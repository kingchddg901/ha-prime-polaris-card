// One render fn per UI section. All return raw HTML strings — the
// main element stamps them into shadow DOM and re-attaches event
// listeners on each render via the `data-action` attribute pattern.

import { CHAMBER_BAND_F } from "./theme.js";
import { renderArcGauge } from "./arc-gauge.js";

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
  const deltaTxt = chamberDelta != null
    ? `Δ ${chamberDelta > 0 ? "+" : ""}${chamberDelta.toFixed(0)}°F`
    : "";
  const sp = setpoint ?? 225;
  return `
    <div class="panel tall arc-panel">
      <div class="panel-label">Chamber</div>
      ${renderArcGauge({
        min: 180,
        max: 500,
        current: chamber,
        target:  setpoint,
      })}
      <div class="delta">${deltaTxt}</div>
      <div class="stepper-row chamber-setpoint">
        <span class="stepper-label">Setpoint</span>
        <button class="action stepper-btn" data-action="temp-down">−</button>
        <input
          type="number"
          inputmode="numeric"
          min="180"
          max="500"
          step="1"
          class="stepper-input"
          data-input="setpoint"
          value="${sp}">
        <span class="stepper-unit">°F</span>
        <button class="action stepper-btn" data-action="temp-up">+</button>
      </div>
    </div>
  `;
}

// === Status / chip strip =====================================

export function renderStatusChips(state) {
  if (!state) return "";
  const chips = [];
  if (state.runningStatus) chips.push({ cls: "active", txt: titleCase(state.runningStatus) });
  chips.push({
    cls: state.activeMode === "smoke" ? "smoke" : "active",
    txt: `Mode: ${titleCase(state.activeMode)}`,
  });
  if (state.smokeOn && state.smokeLevel != null) {
    chips.push({ cls: "smoke", txt: `Smoke ${state.smokeLevel.toFixed(0)}` });
  }
  if (state.alarmOn)  chips.push({ cls: "alarm", txt: "Alarm Armed" });
  if (state.winterOn) chips.push({ cls: "active", txt: "Winter" });
  if (state.pushOn)   chips.push({ cls: "active", txt: "Push On" });

  // Ambient + wind chips (only when the user has typed something).
  // Source attribution is dropped — they already know what they typed.
  if (state.ambient) {
    chips.push(state.ambientResolved.value != null
      ? { cls: "active", txt: `Ambient ${state.ambientResolved.value.toFixed(0)}°F` }
      : { cls: "alarm",  txt: "Ambient Unresolved" });
  }
  if (state.wind) {
    chips.push(state.windResolved.value != null
      ? { cls: "active", txt: `Wind ${state.windResolved.value.toFixed(1)}` }
      : { cls: "alarm",  txt: "Wind Unresolved" });
  }

  return `
    <div class="chip-row">
      ${chips.map((c) => `<span class="chip ${c.cls}">${escapeHtml(c.txt)}</span>`).join("")}
    </div>
  `;
}

function titleCase(s) {
  if (!s) return "";
  return String(s)
    .split(/(\s+)/)
    .map((part) => part.length === 0 || /\s+/.test(part)
      ? part
      : part[0].toUpperCase() + part.slice(1).toLowerCase())
    .join("");
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

  // Read-only environment summary — rendered as chips so the
  // cook session tile reads the same way as the top chip strip
  // (consistent visual language for status / context info).
  const envChips = [];
  if (state.ambientResolved.value != null) {
    envChips.push(`<span class="chip active">Ambient ${state.ambientResolved.value.toFixed(0)}°F</span>`);
  }
  if (state.windResolved.value != null) {
    envChips.push(`<span class="chip active">Wind ${state.windResolved.value.toFixed(1)}</span>`);
  }
  const envLine = envChips.length
    ? `<div class="chip-row env-chips">${envChips.join("")}</div>`
    : "";

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
      ${envLine}
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
  const smokeLevelVal = state.smokeLevel ?? 0;
  return `
    <div class="panel">
      <div class="panel-label">Controls</div>
      <div class="stepper-row">
        <span class="stepper-label">Smoke level</span>
        <input
          type="range"
          min="0"
          max="10"
          step="1"
          class="slider"
          data-input="smoke_level"
          value="${smokeLevelVal}">
        <span class="stepper-unit" data-bind="smoke-level-readout">${smokeLevelVal}</span>
      </div>
      <div class="controls">
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
      <div class="panel-label">This cook</div>
      <div class="session">
        <label>Protein</label>
        <input type="text" data-input="protein"   value="${escapeHtml(state.protein)}"   placeholder="brisket / pork / ribs">
        <label>Weight (lb)</label>
        <input type="text" data-input="weight_lb" value="${escapeHtml(state.weight_lb)}" placeholder="16">
        <label>Notes</label>
        <input type="text" data-input="notes"     value="${escapeHtml(state.notes)}"     placeholder="oak, low and slow">
      </div>
      <div class="small" style="margin-top:8px;">
        Ambient / wind sensors are configured once in the
        <strong>Setup</strong> tab and persist across cooks.
      </div>
    </div>
  `;
}

// Top-of-card tab strip
export function renderTabs(currentView) {
  const tab = (view, label) => `
    <button class="tab ${currentView === view ? "active" : ""}"
            data-action="set-view-${view}">
      ${label}
    </button>
  `;
  return `
    <div class="tab-strip">
      ${tab("live",  "Live")}
      ${tab("setup", "Setup")}
    </div>
  `;
}

// === Last alarm banner ======================================

export function renderAlarm(state, dismissedAlarmId) {
  if (!state) return "";
  const a = state.lastAlarm;
  if (!a) {
    return `<div class="alarm-banner dim">no alarms</div>`;
  }
  // Dismissed banners collapse to the same minimal "no alarms" state.
  // Comparing by captured_at means a new alarm with a fresh timestamp
  // will reappear automatically.
  if (dismissedAlarmId && dismissedAlarmId === a.captured_at) {
    return `<div class="alarm-banner dim">no alarms (dismissed)</div>`;
  }
  return `
    <div class="alarm-banner">
      <span><strong>${escapeHtml(a.title)}</strong> · ${escapeHtml(a.body)}</span>
      <button class="alarm-dismiss" data-action="dismiss-alarm" title="Dismiss">✕</button>
    </div>
  `;
}
