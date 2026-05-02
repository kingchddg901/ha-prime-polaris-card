// Setup tab — account info, push-alert toggle, default sensor pickers.
// Read-mostly for account info; the FCM and sensor fields are bound to
// the same entities the rest of the card uses, so changing values here
// takes effect immediately.

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    "\"": "&quot;", "'": "&#39;",
  }[c]));
}

function renderResolvedRow(label, raw, resolved, unit) {
  let badge = "";
  if (raw) {
    badge = (resolved && resolved.value != null)
      ? `<span class="resolved-badge ok">${resolved.value.toFixed(1)}${unit}</span>`
      : `<span class="resolved-badge bad">unresolved</span>`;
  }
  return `
    <label>${label}</label>
    <input type="text" data-input="${
      label.toLowerCase() === "ambient sensor" ? "ambient" : "wind"
    }" value="${escapeHtml(raw)}" placeholder="entity_id (e.g. sensor.outdoor_temp)">
    ${badge || `<span></span>`}
  `;
}

export function renderSetup(state, config) {
  if (!state || !state.account) {
    return `
      <div class="panel"><div class="small">Loading account info…</div></div>
    `;
  }

  const a = state.account;
  const expiryClass = a.daysToExpiry != null && a.daysToExpiry < 14 ? "bad" : "";

  return `
    <div class="panel">
      <div class="panel-label">Account</div>
      <div class="setup-grid">
        <span class="setup-key">Email</span>
        <span class="setup-val">${escapeHtml(a.email || "—")}</span>

        <span class="setup-key">Token expires</span>
        <span class="setup-val ${expiryClass}">
          ${a.daysToExpiry != null ? `in ${a.daysToExpiry} days` : "—"}
        </span>

        <span class="setup-key">Manage</span>
        <span class="setup-val">
          <a class="setup-link" href="/config/integrations/integration/prime_polaris" target="_top">
            Open in HA Settings →
          </a>
        </span>
      </div>
    </div>

    <div class="panel">
      <div class="panel-label">Push alerts (FCM)</div>
      <div class="setup-grid">
        <span class="setup-key">Enabled</span>
        <span class="setup-val">
          <button class="action ${state.pushOn ? "on" : ""}" data-action="toggle-push">
            ${state.pushOn ? "ON" : "OFF"}
          </button>
        </span>

        <span class="setup-key">Dedupe window</span>
        <span class="setup-val">
          <input type="number" min="10" max="3600" step="10"
                 class="stepper-input"
                 data-input="push_dedupe"
                 value="${state.pushDedupe ?? 60}">
          <span class="stepper-unit">sec</span>
        </span>
      </div>
      <div class="small" style="margin-top:8px;">
        Pushes for the same alarm category fire every ~25–30 s while the
        condition persists; the dedupe window suppresses repeats.
      </div>
    </div>

    <div class="panel">
      <div class="panel-label">Default sensors</div>
      <div class="session">
        ${renderResolvedRow("Ambient sensor", state.ambient, state.ambientResolved, "°F")}
        ${renderResolvedRow("Wind sensor",    state.wind,    state.windResolved,    "")}
      </div>
      <div class="small" style="margin-top:8px;">
        These persist across cooks — set once. Per-cook overrides on the
        Live tab take precedence if you ever want to deviate.
      </div>
    </div>
  `;
}
