// One render fn per UI section. All return raw HTML strings — the
// main element stamps them into shadow DOM and re-attaches event
// listeners on each render via the `data-action` attribute pattern.

import { CHAMBER_BAND_F } from "./theme.js";

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    "\"": "&quot;", "'": "&#39;",
  }[c]));
}

// === Chamber section =========================================

export function renderChamber(state) {
  if (!state) return "";
  const { chamber, setpoint, chamberDelta } = state;
  let cls = "steady";
  if (chamberDelta != null) {
    if (chamberDelta > CHAMBER_BAND_F)  cls = "over";
    if (chamberDelta < -CHAMBER_BAND_F) cls = "under";
  }
  const deltaTxt = chamberDelta != null
    ? `Δ ${chamberDelta > 0 ? "+" : ""}${chamberDelta.toFixed(0)}°F`
    : "";
  return `
    <div class="panel tall">
      <div class="panel-label">Chamber</div>
      <div class="big-temp ${cls}">
        ${chamber != null ? chamber.toFixed(0) : "—"}<span class="unit">°F</span>
      </div>
      <div class="delta">setpoint ${setpoint ?? "—"}°F · ${deltaTxt}</div>
    </div>
  `;
}

// === Status / chip strip =====================================

export function renderStatusChips(state) {
  if (!state) return "";
  const chips = [];
  if (state.runningStatus) chips.push({ cls: "active", txt: state.runningStatus });
  chips.push({ cls: state.activeMode === "smoke" ? "smoke" : "active",
               txt: `mode: ${state.activeMode}` });
  if (state.smokeOn && state.smokeLevel != null) {
    chips.push({ cls: "smoke", txt: `smoke ${state.smokeLevel.toFixed(0)}` });
  }
  if (state.alarmOn)  chips.push({ cls: "alarm", txt: "alarm armed" });
  if (state.winterOn) chips.push({ cls: "active", txt: "winter" });
  if (state.pushOn)   chips.push({ cls: "active", txt: "push on" });

  return `
    <div class="chip-row">
      ${chips.map((c) => `<span class="chip ${c.cls}">${escapeHtml(c.txt)}</span>`).join("")}
    </div>
  `;
}

// === Cook session header =====================================

export function renderCookHeader(state) {
  if (!state) return "";
  const live = state.cookSession;
  const label = live
    ? (state.protein
        ? `${escapeHtml(state.protein)}${state.weight_lb ? " · " + escapeHtml(state.weight_lb) + " lb" : ""}`
        : "recording")
    : "no active cook";
  const sub = state.notes ? escapeHtml(state.notes) : (live ? "" : "flip the switch when you start a real cook");

  return `
    <div class="panel tall">
      <div class="panel-label">Cook session</div>
      <div class="session-toggle">
        <span class="rec-dot ${live ? "live" : ""}"></span>
        <button class="action ${live ? "on" : ""}" data-action="toggle-session">
          ${live ? "Stop session" : "Start session"}
        </button>
      </div>
      <div class="big-temp" style="font-size:22px; margin-top:8px;">${label}</div>
      <div class="small">${sub}</div>
    </div>
  `;
}

// === Probes ==================================================

function renderProbe(probeNum, p) {
  if (p.temp == null) {
    return `
      <div class="panel">
        <div class="probe">
          <div class="probe-label">Probe ${probeNum}</div>
          <div class="small">not connected</div>
        </div>
      </div>
    `;
  }
  let etaTxt = "fitting…";
  let etaCls = "fitting";
  if (p.in_stall) {
    etaTxt = `🛑 in stall · σ ${p.stdev?.toFixed(2) ?? "—"}°F`;
    etaCls = "stall";
  } else if (p.minutes != null) {
    const m = Math.max(0, p.minutes);
    etaTxt = m >= 60 ? `ETA ${(m / 60).toFixed(1)} h` : `ETA ${m.toFixed(0)} min`;
    etaCls = "";
  }
  return `
    <div class="panel">
      <div class="probe">
        <div class="probe-label">Probe ${probeNum}</div>
        <div>
          <div class="probe-temp">${p.temp.toFixed(0)}°F</div>
          <div class="probe-target">→ ${p.target ?? "—"}°F</div>
          <div class="probe-eta ${etaCls}">${escapeHtml(etaTxt)}</div>
          ${p.source ? `<div class="small">prior: ${escapeHtml(p.source)}</div>` : ""}
        </div>
      </div>
    </div>
  `;
}

export function renderProbes(state) {
  if (!state) return "";
  return `
    <div class="row">
      ${renderProbe(1, state.probe1)}
      ${renderProbe(2, state.probe2)}
    </div>
  `;
}

// === Controls ===============================================

export function renderControls(state) {
  if (!state) return "";
  return `
    <div class="panel">
      <div class="panel-label">Controls</div>
      <div class="controls">
        <button class="action" data-action="temp-down">– 5°F</button>
        <button class="action" data-action="temp-up">+ 5°F</button>
        <button class="action ${state.smokeOn   ? "on" : ""}" data-action="toggle-smoke">Smoke</button>
        <button class="action ${state.winterOn  ? "on" : ""}" data-action="toggle-winter">Winter</button>
        <button class="action alarm ${state.alarmOn ? "on" : ""}" data-action="toggle-alarm">Alarm</button>
        <button class="action ${state.pushOn    ? "on" : ""}" data-action="toggle-push">Push</button>
        <button class="action" data-action="power-off">Power off</button>
      </div>
    </div>
  `;
}

// === Cook session inputs ====================================

export function renderSession(state) {
  if (!state) return "";
  return `
    <div class="panel">
      <div class="panel-label">Session inputs</div>
      <div class="session">
        <label>Protein</label>
        <input type="text" data-input="protein"   value="${escapeHtml(state.protein)}"   placeholder="brisket / pork / ribs">
        <label>Weight (lb)</label>
        <input type="text" data-input="weight_lb" value="${escapeHtml(state.weight_lb)}" placeholder="16">
        <label>Notes</label>
        <input type="text" data-input="notes"     value="${escapeHtml(state.notes)}"     placeholder="oak, low and slow">
        <label>Ambient</label>
        <input type="text" data-input="ambient"   value="${escapeHtml(state.ambient)}"   placeholder="weather.home or 32">
        <label>Wind</label>
        <input type="text" data-input="wind"      value="${escapeHtml(state.wind)}"      placeholder="entity_id or m/s">
      </div>
    </div>
  `;
}

// === Last alarm banner ======================================

export function renderAlarm(state) {
  if (!state) return "";
  const a = state.lastAlarm;
  if (!a) {
    return `<div class="alarm-banner dim">no alarms</div>`;
  }
  return `
    <div class="alarm-banner">
      <span><strong>${escapeHtml(a.title)}</strong> · ${escapeHtml(a.body)}</span>
      <span class="small">${escapeHtml(a.source ?? "")}</span>
    </div>
  `;
}
