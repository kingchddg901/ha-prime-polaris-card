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

// Heuristics for finding LIKELY outdoor temp / wind sensors.
// Strict on purpose: if a sensor's entity_id doesn't match an
// outdoor-y hint AND it isn't a weather.* entity, it doesn't show.
// False negatives are fine — the user can always type manually.
// False positives (e.g. fridge / cpu / battery temps) are not.

const INDOOR_RE = /\b(indoor|inside|bedroom|bathroom|kitchen|living|hallway|office|garage|attic|basement|fridge|freezer|oven|refrigerator|dishwasher|washer|dryer|cpu|gpu|battery|server|chip|water_heater|coolant|pool|spa|jacuzzi|hot_tub|aquarium|fishtank|car|vehicle|engine)\b/i;

const OUTDOOR_HINT_RE = /\b(outdoor|outside|exterior|patio|deck|porch|backyard|yard|weather|ambient|station|pws|awn|tempest|davis|ecowitt|netatmo)\b/i;

const WIND_UNIT_RE = /\b(mph|m\/s|km\/h|knots?)\b/i;
const WIND_HINT_RE = /\b(wind|gust)\b/i;

function detectAmbientCandidates(hass, prefix) {
  if (!hass) return [];
  // Never suggest our own integration's entities (e.g. sensor.grill_*).
  // The configured entity_prefix tells us what to skip.
  const ownPrefixRe = prefix
    ? new RegExp(`^[a-z_]+\\.${prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}_`, "i")
    : null;
  const out = [];
  for (const [eid, st] of Object.entries(hass.states)) {
    if (ownPrefixRe && ownPrefixRe.test(eid)) continue;
    if (INDOOR_RE.test(eid)) continue;

    // Weather entities almost always qualify (typically one per install)
    if (eid.startsWith("weather.")) {
      const t = parseFloat(st.attributes?.temperature);
      if (Number.isFinite(t)) {
        out.push({ eid, value: t, unit: "°F" });
      }
      continue;
    }

    // Sensor entities: only suggest when there's BOTH a temperature
    // signal AND an explicit outdoor-y hint in the entity_id. This is
    // what keeps random house-temp / device-temp sensors out of the list.
    const dc = st.attributes?.device_class;
    const unit = st.attributes?.unit_of_measurement || "";
    const isTempSensor = dc === "temperature" || /°[FC]|degf|degc/i.test(unit);
    if (!isTempSensor) continue;
    if (!OUTDOOR_HINT_RE.test(eid)) continue;

    const v = parseFloat(st.state);
    if (!Number.isFinite(v)) continue;
    out.push({ eid, value: v, unit: unit || "°F" });
  }
  // Stable order: weather.* first, then alphabetical
  return out.sort((a, b) => {
    const aw = a.eid.startsWith("weather.") ? 0 : 1;
    const bw = b.eid.startsWith("weather.") ? 0 : 1;
    return aw - bw || a.eid.localeCompare(b.eid);
  }).slice(0, 6);
}

function detectWindCandidates(hass, prefix) {
  if (!hass) return [];
  const ownPrefixRe = prefix
    ? new RegExp(`^[a-z_]+\\.${prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}_`, "i")
    : null;
  const out = [];
  for (const [eid, st] of Object.entries(hass.states)) {
    if (ownPrefixRe && ownPrefixRe.test(eid)) continue;
    if (INDOOR_RE.test(eid)) continue;
    const unit = st.attributes?.unit_of_measurement || "";
    // Require BOTH an entity_id wind hint AND a wind-y unit.
    // This filters things like sensor.battery_voltage that might
    // accidentally be in m/s, or sensor.window_count.
    if (!WIND_HINT_RE.test(eid)) continue;
    if (!WIND_UNIT_RE.test(unit)) continue;
    const v = parseFloat(st.state);
    if (!Number.isFinite(v)) continue;
    out.push({ eid, value: v, unit });
  }
  return out.sort((a, b) => a.eid.localeCompare(b.eid)).slice(0, 4);
}

function renderCandidateChips(candidates, purpose, currentValue) {
  if (!candidates.length) return "";
  return `
    <div class="cand-row">
      ${candidates.map((c) => `
        <button class="cand-chip ${c.eid === currentValue ? "selected" : ""}"
                data-action="apply-default"
                data-purpose="${purpose}"
                data-value="${escapeHtml(c.eid)}"
                title="Click to use this sensor">
          ${escapeHtml(c.eid)} · ${c.value.toFixed(1)}${c.unit ? " " + escapeHtml(c.unit) : ""}
        </button>`).join("")}
    </div>
  `;
}

function renderSensorRow(label, inputKey, raw, resolved, unit, candidates) {
  let badge = "";
  if (raw) {
    badge = (resolved && resolved.value != null)
      ? `<span class="resolved-badge ok">${resolved.value.toFixed(1)}${unit}</span>`
      : `<span class="resolved-badge bad">unresolved</span>`;
  }
  return `
    <label>${label}</label>
    <input type="text" data-input="${inputKey}" value="${escapeHtml(raw)}" placeholder="entity_id (e.g. sensor.outdoor_temp)">
    ${badge || `<span></span>`}
    <span></span>
    <div class="cand-host">${renderCandidateChips(candidates, inputKey, raw)}</div>
    <span></span>
  `;
}

export function renderSetup(state, config, hass) {
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
      <div class="small" style="margin-bottom:10px;">
        Point these at any HA temperature / wind sensor. Common picks:
        a <strong>weather.*</strong> entity (HA's default weather integration),
        a <strong>sensor.*</strong> from your weather station / Ambient Weather Network,
        or just a fixed number (e.g. <code>32</code>) for cooks at a known temp.
        Set once — per-cook overrides on the Live tab take precedence if you ever deviate.
      </div>
      <div class="session sensor-grid">
        ${renderSensorRow("Ambient sensor", "ambient", state.ambient, state.ambientResolved, "°F",
            detectAmbientCandidates(hass, config?.entity_prefix))}
        ${renderSensorRow("Wind sensor",    "wind",    state.wind,    state.windResolved,    "",
            detectWindCandidates(hass, config?.entity_prefix))}
      </div>
      <div class="small" style="margin-top:8px;">
        💡 Suggestions are conservative — only <strong>weather.*</strong> entities
        and sensors whose entity_id contains an outdoor hint
        (<em>outdoor / outside / weather / station / pws / patio …</em>) show up.
        If yours doesn't match, just type the entity_id manually.
      </div>
    </div>
  `;
}
