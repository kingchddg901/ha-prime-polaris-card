// Two-mode chart renderer:
//   - apex mode: embed <apexcharts-card> if the custom element is registered
//   - canvas mode: fetch HA recorder history once, then append live points
//                  on each hass update, render with raw 2D canvas.

import {
  CHART_HISTORY_HOURS,
  CHART_REFRESH_INTERVAL_MS,
} from "./constants.js";
import { THEME } from "./theme.js";

const APEX_TAG = "apexcharts-card";

export class ChartController {

  constructor(host) {
    this._host = host;
    this._mode = null;        // "apex" | "canvas"
    this._apexEl = null;
    this._canvas = null;
    this._series = {};        // entityId → [[ts_ms, value], ...]
    this._historyLoaded = false;
    this._lastConfig = null;
  }

  /** Render or update the chart inside `host` for the given entity ids. */
  async update(hass, entityIds) {
    const sig = entityIds.join("|");
    if (sig !== this._lastConfig) {
      this._lastConfig = sig;
      this._historyLoaded = false;
      this._series = {};
      this._host.innerHTML = "";
      this._mode = customElements.get(APEX_TAG) ? "apex" : "canvas";
      if (this._mode === "apex") this._mountApex(entityIds);
      else                       this._mountCanvas();
    }

    if (this._mode === "apex") {
      this._apexEl.hass = hass;
      return;
    }

    // Canvas mode — fetch history once, then append live points
    if (!this._historyLoaded) {
      this._historyLoaded = true;
      await this._loadHistory(hass, entityIds);
    }
    this._appendLive(hass, entityIds);
    this._draw(entityIds);
  }

  // --- Apex path -----------------------------------------

  _mountApex(entityIds) {
    const series = entityIds.map((eid, i) => ({
      entity: eid,
      name: this._labelFor(eid),
      yaxis_id: "temp",
      color: [THEME.chartChamber, THEME.chartProbe1, THEME.chartProbe2][i] || "#fff",
      type: i === 0 ? "area" : "line",
      opacity: i === 0 ? 0.25 : 1,
      stroke_width: 2,
    }));

    const card = document.createElement(APEX_TAG);
    card.setConfig({
      header: { show: false },
      graph_span: `${CHART_HISTORY_HOURS}h`,
      update_interval: `${CHART_REFRESH_INTERVAL_MS / 1000}s`,
      yaxis: [{
        id: "temp", decimals: 0,
        apex_config: { title: { text: "°F" }, forceNiceScale: true },
      }],
      series,
    });
    this._apexEl = card;
    this._host.appendChild(card);
  }

  // --- Canvas path ---------------------------------------

  _mountCanvas() {
    this._canvas = document.createElement("canvas");
    this._host.appendChild(this._canvas);
  }

  async _loadHistory(hass, entityIds) {
    const start = new Date(Date.now() - CHART_HISTORY_HOURS * 3600 * 1000);
    const startIso = start.toISOString();
    const url = `history/period/${startIso}?filter_entity_id=${entityIds.join(",")}&minimal_response`;
    try {
      const result = await hass.callApi("GET", url);
      // result is an array of arrays — one per entity, in entityIds order
      for (let i = 0; i < entityIds.length; i++) {
        const eid = entityIds[i];
        const samples = (result?.[i] ?? [])
          .map((s) => [Date.parse(s.last_changed), parseFloat(s.state)])
          .filter(([t, v]) => Number.isFinite(t) && Number.isFinite(v));
        this._series[eid] = samples;
      }
    } catch (err) {
      console.warn("[ha-prime-polaris-card] history fetch failed:", err);
    }
  }

  _appendLive(hass, entityIds) {
    const now = Date.now();
    const cutoff = now - CHART_HISTORY_HOURS * 3600 * 1000;
    for (const eid of entityIds) {
      const arr = this._series[eid] ?? (this._series[eid] = []);
      const v = parseFloat(hass.states[eid]?.state);
      if (Number.isFinite(v)) {
        const lastTs = arr.length ? arr[arr.length - 1][0] : 0;
        if (now - lastTs >= 5_000) arr.push([now, v]);  // dedupe rapid renders
      }
      // Drop samples older than the window
      while (arr.length && arr[0][0] < cutoff) arr.shift();
    }
  }

  _draw(entityIds) {
    const c = this._canvas;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const W = c.clientWidth || 600;
    const H = 240;
    c.width = W * dpr;
    c.height = H * dpr;
    const ctx = c.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    // Compute bounds across all series
    const all = entityIds.flatMap((e) => this._series[e] ?? []);
    if (all.length < 2) {
      ctx.fillStyle = THEME.textDim;
      ctx.font = "12px system-ui";
      ctx.fillText("collecting data…", 16, 24);
      return;
    }
    const xs = all.map((p) => p[0]);
    const ys = all.map((p) => p[1]);
    const xMin = Math.min(...xs), xMax = Math.max(...xs);
    const yMin = Math.min(...ys) - 5, yMax = Math.max(...ys) + 5;
    const pad = { l: 36, r: 12, t: 12, b: 22 };

    const X = (x) => pad.l + ((x - xMin) / Math.max(1, xMax - xMin)) * (W - pad.l - pad.r);
    const Y = (y) => pad.t + (1 - (y - yMin) / Math.max(1, yMax - yMin)) * (H - pad.t - pad.b);

    // Y-axis grid + labels
    ctx.strokeStyle = THEME.panelBorder;
    ctx.fillStyle = THEME.textDim;
    ctx.font = "11px system-ui";
    ctx.lineWidth = 1;
    const yTicks = 4;
    for (let i = 0; i <= yTicks; i++) {
      const yVal = yMin + (i / yTicks) * (yMax - yMin);
      const y = Y(yVal);
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke();
      ctx.fillText(yVal.toFixed(0), 6, y + 4);
    }

    // Series
    const colors = [THEME.chartChamber, THEME.chartProbe1, THEME.chartProbe2];
    entityIds.forEach((eid, i) => {
      const samples = this._series[eid] ?? [];
      if (samples.length < 2) return;
      ctx.strokeStyle = colors[i] || "#fff";
      ctx.lineWidth = i === 0 ? 1.5 : 2;

      // First series = filled area underneath
      if (i === 0) {
        ctx.fillStyle = colors[0] + "40";  // ~25% alpha
        ctx.beginPath();
        ctx.moveTo(X(samples[0][0]), Y(yMin));
        for (const [t, v] of samples) ctx.lineTo(X(t), Y(v));
        ctx.lineTo(X(samples[samples.length - 1][0]), Y(yMin));
        ctx.closePath();
        ctx.fill();
      }

      ctx.beginPath();
      ctx.moveTo(X(samples[0][0]), Y(samples[0][1]));
      for (const [t, v] of samples) ctx.lineTo(X(t), Y(v));
      ctx.stroke();
    });
  }

  _labelFor(eid) {
    if (eid.includes("chamber")) return "Chamber";
    if (eid.includes("probe_1"))  return "Probe 1";
    if (eid.includes("probe_2"))  return "Probe 2";
    return eid;
  }
}
