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
  renderRecipes,
  renderSession,
  renderAlarm,
  renderTabs,
} from "./renderers.js";
import { renderSetup } from "./setup-view.js";
import { resolveRecipes } from "./recipes.js";

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
    this._otpFlow = { stage: "idle", email: "", otp: "", error: "" };
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
      <div data-slot="recipes"></div>
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
    this._fill("recipes",                renderRecipes(state, this._config));
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
    this._fillPreserveFocus(
      "setup",
      renderSetup(state, this._config, this._hass, this._otpFlow),
    );
    this._hydrateEntityPickers();
  }

  /** ha-entity-picker requires `hass` as a property and emits
   *  `value-changed` events. Hook those up after every Setup render
   *  (cheap — they self-deduplicate by the listener-marker pattern). */
  _hydrateEntityPickers() {
    const slot = this.shadowRoot.querySelector('[data-slot="setup"]');
    if (!slot || !this._hass) return;
    const pickers = slot.querySelectorAll("ha-entity-picker");
    for (const picker of pickers) {
      // Push hass + current value imperatively
      picker.hass = this._hass;
      const current = picker.dataset.current || "";
      if (picker.value !== current) picker.value = current;
      // Configure include filters (set as properties for reliability)
      const domains = picker.dataset.includeDomains;
      if (domains) picker.includeDomains = domains.split(",");
      const dcs = picker.dataset.includeDeviceClasses;
      if (dcs) picker.includeDeviceClasses = dcs.split(",");
      // One-shot listener attach
      if (!picker.__hpListenerAttached) {
        picker.__hpListenerAttached = true;
        picker.addEventListener("value-changed", (e) => {
          const purpose = picker.dataset.input;
          const value   = e.detail?.value ?? "";
          const map = {
            chamber_override:  "chamber_override",
            probe_1_override:  "probe_1_override",
            probe_2_override:  "probe_2_override",
          };
          const key = map[purpose];
          if (key && this._hass && this._state) {
            const actions = makeActions(this._hass, this._state);
            actions.setText(key, value);
          }
        });
      }
    }
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

      // Apply a default sensor pick (Setup → Default sensors chips
      // and Setup → Probe / chamber overrides chips). Both flows pass
      // a `purpose` data attr that maps to the right text entity.
      if (btn.dataset.action === "apply-default") {
        const purpose = btn.dataset.purpose;
        const value   = btn.dataset.value;
        if (!this._hass || !this._state || !purpose) return;
        const map = {
          ambient:           "ambient_override",
          wind:              "wind_override",
          chamber_override:  "chamber_override",
          probe_1_override:  "probe_1_override",
          probe_2_override:  "probe_2_override",
        };
        const key = map[purpose];
        if (key) {
          const actions = makeActions(this._hass, this._state);
          actions.setText(key, value);
        }
        return;
      }

      // Apply a recipe preset (Live → Recipes tile click)
      if (btn.dataset.action === "apply-recipe") {
        this._applyRecipe(btn.dataset.recipeId);
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

      // Smoke level slider (commit on release). Controller clamps at 9.
      if (key === "smoke_level") {
        const v = parseInt(input.value, 10);
        if (Number.isFinite(v)) {
          actions.setSmokeLevel(Math.max(0, Math.min(9, v)));
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

      // OTP-flow input bindings — kept on the card instance, not in HA
      if (key === "auth_email") {
        this._otpFlow.email = input.value;
        return;
      }
      if (key === "auth_otp") {
        this._otpFlow.otp = input.value;
        return;
      }

      // Free-form text inputs
      const textMap = {
        notes:             "notes",
        protein:           "protein",
        weight_lb:         "weight_lb",
        ambient:           "ambient_override",
        wind:              "wind_override",
        chamber_override:  "chamber_override",
        probe_1_override:  "probe_1_override",
        probe_2_override:  "probe_2_override",
      };
      if (textMap[key]) actions.setText(textMap[key], input.value);
    });

    // Live updates while user is interacting with inputs:
    //   - smoke-level slider readout
    //   - OTP-flow email / OTP value mirroring (so cancel doesn't
    //     lose what they typed mid-flow)
    this.shadowRoot.addEventListener("input", (e) => {
      const input = e.target.closest("[data-input]");
      if (!input) return;
      const key = input.dataset.input;
      if (key === "smoke_level") {
        const readout = this.shadowRoot.querySelector(
          '[data-bind="smoke-level-readout"]'
        );
        if (readout) readout.textContent = input.value;
      }
      if (key === "auth_email") this._otpFlow.email = input.value;
      if (key === "auth_otp")   this._otpFlow.otp   = input.value;
    });
  }

  // === Auth / OTP flow ====================================

  _authStart() {
    this._otpFlow = {
      stage: "email",
      email: this._state?.account?.email || "",
      otp: "",
      error: "",
    };
    this._scheduleRender();
  }

  _authCancel() {
    this._otpFlow = { stage: "idle", email: "", otp: "", error: "" };
    this._scheduleRender();
  }

  async _authRequestOtp() {
    if (!this._hass) return;
    const email = (this._otpFlow.email || "").trim();
    if (!email) {
      this._otpFlow.error = "Email required";
      this._scheduleRender();
      return;
    }
    this._otpFlow.stage = "sending";
    this._otpFlow.error = "";
    this._scheduleRender();
    try {
      await this._hass.callService("prime_polaris", "request_otp", { email });
      this._otpFlow.stage = "otp";
    } catch (err) {
      this._otpFlow.stage = "email";
      this._otpFlow.error = err?.message || String(err);
    }
    this._scheduleRender();
  }

  async _authVerifyOtp() {
    if (!this._hass) return;
    const email = (this._otpFlow.email || "").trim();
    const otp   = (this._otpFlow.otp   || "").trim();
    if (!otp) {
      this._otpFlow.error = "Enter the code";
      this._scheduleRender();
      return;
    }
    this._otpFlow.stage = "verifying";
    this._otpFlow.error = "";
    this._scheduleRender();
    try {
      await this._hass.callService("prime_polaris", "verify_otp", { email, otp });
      this._otpFlow.stage = "done";
      this._scheduleRender();
      // Auto-collapse after a brief success indicator
      setTimeout(() => {
        if (this._otpFlow.stage === "done") {
          this._otpFlow = { stage: "idle", email: "", otp: "", error: "" };
          this._scheduleRender();
        }
      }, 2500);
    } catch (err) {
      this._otpFlow.stage = "otp";
      this._otpFlow.error = err?.message || String(err);
      this._scheduleRender();
    }
  }

  async _resetCookInputs() {
    if (!this._hass) return;
    try {
      await this._hass.callService("prime_polaris", "clear_cook_inputs", {});
    } catch (err) {
      console.warn("clear_cook_inputs failed:", err);
    }
  }

  async _applyRecipe(recipeId) {
    if (!this._hass || !this._state || !recipeId) return;
    const recipes = resolveRecipes(this._config?.recipes);
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe || !recipe.apply) return;

    const actions = makeActions(this._hass, this._state);
    const a = recipe.apply;

    // Sequence (sequential, not parallel):
    //   1. setpoint                    — independent
    //   2. smoke level                 — preserves current mode in payload
    //   3. smoke mode toggle if needed — flip without losing level
    //   4. probe targets               — independent
    //   5. protein text                — purely UI
    try {
      if (a.setpoint != null) {
        await actions.setSetpoint(
          Math.max(180, Math.min(500, a.setpoint))
        );
      }
      if (a.smoke_level != null) {
        await actions.setSmokeLevel(
          Math.max(0, Math.min(9, a.smoke_level))
        );
      }
      if (a.smoke_mode != null && a.smoke_mode !== this._state.smokeOn) {
        await actions.toggle("smoke_mode");
      }
      if (a.probe_1_target != null) {
        await actions.setProbeTarget(1, Math.max(100, a.probe_1_target));
      }
      if (a.probe_2_target != null) {
        await actions.setProbeTarget(2, Math.max(100, a.probe_2_target));
      }
      if (a.protein != null) {
        await actions.setText("protein", a.protein);
      }
    } catch (err) {
      console.warn(`apply-recipe (${recipeId}) failed mid-sequence:`, err);
    }
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
      case "auth-start":          this._authStart();        break;
      case "auth-cancel":         this._authCancel();       break;
      case "auth-request-otp":    this._authRequestOtp();   break;
      case "auth-verify-otp":     this._authVerifyOtp();    break;
      case "reset-cook-inputs":   this._resetCookInputs();  break;
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
