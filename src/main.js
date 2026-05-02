// Root custom element for the Prime Polaris Grill Card.
// Mirrors the eufy-vacuum-command-center vanilla-JS pattern (HTMLElement
// + shadow DOM, esbuild bundle, esm output) but flattened to a single
// card with no view-routing or learning sub-controllers.

import { CARD_NAME, CARD_VERSION, DEFAULT_ENTITY_PREFIX } from "./constants.js";
import { buildState }       from "./state.js";
import { makeActions }      from "./actions.js";
import { STYLES }           from "./styles.js";
import { ChartController }  from "./chart.js";
import {
  renderChamber,
  renderStatusChips,
  renderCookHeader,
  renderProbes,
  renderControls,
  renderSession,
  renderAlarm,
  renderTabs,
} from "./renderers.js";
import { renderSetup } from "./setup-view.js";

class HaPrimePolarisCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass     = null;
    this._config   = null;
    this._state    = null;
    this._chart    = null;
    this._view     = "live";          // "live" | "setup"
    this._dismissedAlarmId = null;    // captured_at of the alarm the user dismissed
    this._renderQueued = false;
  }

  setConfig(config) {
    this._config = {
      entity_prefix:   config?.entity_prefix ?? DEFAULT_ENTITY_PREFIX,
      title:           config?.title         ?? null,
      ambient_entity:  config?.ambient_entity ?? null,
      ...config,
    };
    // Force initial render on next hass set
    this._lastSig = null;
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config) return;
    this._state = buildState(hass, this._config.entity_prefix);
    this._scheduleRender();
  }

  getCardSize() { return 8; }

  static getConfigElement() { return null; }

  static getStubConfig() {
    return { entity_prefix: DEFAULT_ENTITY_PREFIX };
  }

  // --- Render ----------------------------------------------

  _scheduleRender() {
    if (this._renderQueued) return;
    this._renderQueued = true;
    requestAnimationFrame(() => {
      this._renderQueued = false;
      this._render();
    });
  }

  _render() {
    const state = this._state;
    // Re-stamp the shell when the view changes so each tab can have
    // its own slot layout. Keeps wiring clean — no view-aware fills.
    if (!this.shadowRoot.firstElementChild ||
        this.shadowRoot.firstElementChild.dataset.view !== this._view) {
      this._stampShell();
      this._wireEvents();
    }

    this._fill("tabs", renderTabs(this._view));

    if (this._view === "live") {
      this._renderLive(state);
    } else {
      this._renderSetup(state);
    }
  }

  _stampShell() {
    const liveBody = `
      <div data-slot="alarm"></div>
      <div data-slot="chips"></div>
      <div class="row">
        <div data-slot="chamber"></div>
        <div data-slot="cookHeader"></div>
      </div>
      <div data-slot="probes"></div>
      <div class="chart-host" data-slot="chart"></div>
      <div data-slot="controls"></div>
      <div data-slot="session"></div>
    `;
    const setupBody = `
      <div data-slot="setup"></div>
    `;
    this.shadowRoot.innerHTML = `
      <style>${STYLES}</style>
      <div class="card" data-view="${this._view}">
        <div data-slot="tabs"></div>
        ${this._view === "live" ? liveBody : setupBody}
      </div>
    `;
    // Chart instance lives within the chart slot — discard if leaving live
    if (this._view !== "live") this._chart = null;
  }

  _renderLive(state) {
    this._fill("alarm",      renderAlarm(state, this._dismissedAlarmId));
    this._fill("chips",      renderStatusChips(state));
    this._fill("cookHeader", renderCookHeader(state));
    this._fill("probes",     renderProbes(state));
    this._fillPreserveFocus("chamber",  renderChamber(state));
    this._fillPreserveFocus("controls", renderControls(state));
    this._fillPreserveFocus("session",  renderSession(state));

    if (this._hass && state) {
      if (!this._chart) {
        const host = this.shadowRoot.querySelector('[data-slot="chart"]');
        this._chart = new ChartController(host);
      }
      const ids = [
        state.entityIds.chamber_temp,
        state.entityIds.probe_1_temp,
        state.entityIds.probe_2_temp,
      ];
      this._chart.update(this._hass, ids);
    }
  }

  _renderSetup(state) {
    this._fillPreserveFocus("setup", renderSetup(state, this._config, this._hass));
  }

  _fill(slotName, html) {
    const slot = this.shadowRoot.querySelector(`[data-slot="${slotName}"]`);
    if (slot) slot.innerHTML = html;
  }

  /** Render `html` into the named slot, but if the user is currently
   *  typing in (or dragging) an input inside that slot, preserve their
   *  in-progress value, focus, and selection. */
  _fillPreserveFocus(slotName, html) {
    const slot = this.shadowRoot.querySelector(`[data-slot="${slotName}"]`);
    if (!slot) return;

    const active = this.shadowRoot.activeElement;
    const isEditing = active && active.dataset?.input && slot.contains(active);

    if (!isEditing) {
      slot.innerHTML = html;
      return;
    }

    // Capture the focused input's transient state, render, then restore.
    const focusedKey = active.dataset.input;
    const focusedValue = active.value;
    const focusedStart = active.selectionStart;
    const focusedEnd   = active.selectionEnd;

    slot.innerHTML = html;

    const newFocused = slot.querySelector(`[data-input="${focusedKey}"]`);
    if (newFocused) {
      newFocused.value = focusedValue;
      newFocused.focus();
      try { newFocused.setSelectionRange(focusedStart, focusedEnd); } catch {}
    }
  }

  // --- Event wiring ---------------------------------------

  _wireEvents() {
    this.shadowRoot.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      // Generic "apply-default" carries purpose+value in dataset —
      // dispatched here directly to keep _dispatchAction switch tight.
      if (btn.dataset.action === "apply-default") {
        const purpose = btn.dataset.purpose;
        const value   = btn.dataset.value;
        if (!this._hass || !this._state || !purpose) return;
        const map = { ambient: "ambient_override", wind: "wind_override" };
        const key = map[purpose];
        if (key) {
          const actions = makeActions(this._hass, this._state);
          actions.setText(key, value);
        }
        return;
      }
      this._dispatchAction(btn.dataset.action);
    });

    this.shadowRoot.addEventListener("change", (e) => {
      const input = e.target.closest("[data-input]");
      if (!input) return;
      const actions = makeActions(this._hass, this._state);
      const key = input.dataset.input;

      // Setpoint number input (commit on Enter / blur / step button)
      if (key === "setpoint") {
        const v = parseInt(input.value, 10);
        if (Number.isFinite(v)) {
          actions.setSetpoint(Math.max(180, Math.min(500, v)));
        }
        return;
      }

      // Smoke level slider (commit on release)
      if (key === "smoke_level") {
        const v = parseInt(input.value, 10);
        if (Number.isFinite(v)) {
          actions.setSmokeLevel(Math.max(0, Math.min(10, v)));
        }
        return;
      }

      // FCM dedupe seconds (Setup tab)
      if (key === "push_dedupe") {
        const v = parseInt(input.value, 10);
        if (Number.isFinite(v)) {
          this._hass.callService("number", "set_value", {
            entity_id: this._state.entityIds.push_dedupe,
            value: Math.max(10, Math.min(3600, v)),
          });
        }
        return;
      }

      // Free-form text inputs
      const textMap = {
        notes:      "notes",
        protein:    "protein",
        weight_lb:  "weight_lb",
        ambient:    "ambient_override",
        wind:       "wind_override",
      };
      if (textMap[key]) actions.setText(textMap[key], input.value);
    });

    // Live readout for the smoke-level slider while dragging
    this.shadowRoot.addEventListener("input", (e) => {
      const input = e.target.closest('[data-input="smoke_level"]');
      if (!input) return;
      const readout = this.shadowRoot.querySelector(
        '[data-bind="smoke-level-readout"]'
      );
      if (readout) readout.textContent = input.value;
    });
  }

  _dispatchAction(action) {
    if (!this._hass || !this._state) return;
    const actions = makeActions(this._hass, this._state);
    const sp = this._state.setpoint ?? 225;

    switch (action) {
      case "toggle-session":  actions.toggle("cook_session");  break;
      case "toggle-smoke":    actions.toggle("smoke_mode");    break;
      case "toggle-winter":   actions.toggle("winter_mode");   break;
      case "toggle-alarm":    actions.toggle("alarm");         break;
      case "toggle-push":     actions.toggle("push_alerts");   break;
      case "temp-up":         actions.setSetpoint(Math.min(500, sp + 1)); break;
      case "temp-down":       actions.setSetpoint(Math.max(180, sp - 1)); break;
      case "power-off":       actions.powerOff();              break;
      case "set-view-live":   this._view = "live";  this._scheduleRender(); break;
      case "set-view-setup":  this._view = "setup"; this._scheduleRender(); break;
      case "dismiss-alarm":
        // Capture the alarm's id so subsequent renders hide it.
        // A new alarm (different captured_at) will surface automatically.
        if (this._state?.lastAlarm) {
          this._dismissedAlarmId = this._state.lastAlarm.captured_at;
          this._scheduleRender();
        }
        break;
    }
  }
}

if (!customElements.get(CARD_NAME)) {
  customElements.define(CARD_NAME, HaPrimePolarisCard);
}

// HACS card-picker registration so the card shows up in "Add Card"
window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === CARD_NAME)) {
  window.customCards.push({
    type:        CARD_NAME,
    name:        "Prime Polaris Grill",
    description: "Live cook dashboard for the Prime Polaris pellet grill integration.",
    preview:     true,
  });
}

console.info(
  `%c ${CARD_NAME} %c v${CARD_VERSION} `,
  "color:#fb923c;background:#0d1117;padding:2px 6px;border-radius:3px 0 0 3px;font-weight:600",
  "color:#0d1117;background:#fb923c;padding:2px 6px;border-radius:0 3px 3px 0"
);
