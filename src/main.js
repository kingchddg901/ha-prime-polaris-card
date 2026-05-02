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
} from "./renderers.js";

class HaPrimePolarisCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass     = null;
    this._config   = null;
    this._state    = null;
    this._chart    = null;
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
    if (!this.shadowRoot.firstElementChild) {
      this.shadowRoot.innerHTML = `
        <style>${STYLES}</style>
        <div class="card">
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
        </div>
      `;
      this._wireEvents();
    }

    this._fill("alarm",      renderAlarm(state));
    this._fill("chips",      renderStatusChips(state));
    this._fill("chamber",    renderChamber(state));
    this._fill("cookHeader", renderCookHeader(state));
    this._fill("probes",     renderProbes(state));
    this._fill("controls",   renderControls(state));
    this._fillSessionPreserveFocus(state);

    // Chart updates (entity ids depend on prefix)
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

  _fill(slotName, html) {
    const slot = this.shadowRoot.querySelector(`[data-slot="${slotName}"]`);
    if (slot) slot.innerHTML = html;
  }

  /** Don't blow away an input the user is currently typing in. */
  _fillSessionPreserveFocus(state) {
    const slot = this.shadowRoot.querySelector('[data-slot="session"]');
    if (!slot) return;
    const active = this.shadowRoot.activeElement;
    const focusedKey = active && active.dataset?.input;
    if (!focusedKey) {
      slot.innerHTML = renderSession(state);
      return;
    }
    // Update non-focused inputs only
    const tmp = document.createElement("div");
    tmp.innerHTML = renderSession(state);
    tmp.querySelectorAll("[data-input]").forEach((el) => {
      if (el.dataset.input === focusedKey) return;
      const live = slot.querySelector(`[data-input="${el.dataset.input}"]`);
      if (live && live.value !== el.value) live.value = el.value;
    });
  }

  // --- Event wiring ---------------------------------------

  _wireEvents() {
    this.shadowRoot.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      this._dispatchAction(btn.dataset.action);
    });

    this.shadowRoot.addEventListener("change", (e) => {
      const input = e.target.closest("[data-input]");
      if (!input) return;
      const actions = makeActions(this._hass, this._state);
      const map = {
        notes:      "notes",
        protein:    "protein",
        weight_lb:  "weight_lb",
        ambient:    "ambient_override",
        wind:       "wind_override",
      };
      const key = map[input.dataset.input];
      if (key) actions.setText(key, input.value);
    });
  }

  _dispatchAction(action) {
    if (!this._hass || !this._state) return;
    const actions = makeActions(this._hass, this._state);
    const sp = this._state.setpoint ?? 225;

    switch (action) {
      case "toggle-session": actions.toggle("cook_session");  break;
      case "toggle-smoke":   actions.toggle("smoke_mode");    break;
      case "toggle-winter":  actions.toggle("winter_mode");   break;
      case "toggle-alarm":   actions.toggle("alarm");         break;
      case "toggle-push":    actions.toggle("push_alerts");   break;
      case "temp-up":        actions.setSetpoint(Math.min(500, sp + 1));  break;
      case "temp-down":      actions.setSetpoint(Math.max(180, sp - 1));  break;
      case "temp-up-10":     actions.setSetpoint(Math.min(500, sp + 10)); break;
      case "temp-down-10":   actions.setSetpoint(Math.max(180, sp - 10)); break;
      case "power-off":      actions.powerOff();              break;
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
