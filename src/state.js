// State accessor — derives every value the card needs from `hass.states`
// keyed by the configured entity prefix. Centralised here so renderers
// don't reach into hass directly.

import { ENTITY_SUFFIXES } from "./constants.js";

// Matches "domain.entity_id" (e.g. weather.home, sensor.outdoor_temp)
const ENTITY_RE = /^[a-z_]+\.[a-z0-9_]+$/;

/**
 * Resolve a free-form override value (an entity_id OR a literal number)
 * into a numeric reading.
 *
 *   - entity is a weather.* entity → read attributes[attrKey] (HA weather
 *     entities have temperature/wind_speed in attributes, not state)
 *   - any other entity → parse state as a float
 *   - literal numeric string → parse directly
 *   - empty / unresolvable → returns { value: null, source: "" }
 */
function resolveValue(hass, raw, attrKey) {
  const out = { value: null, source: "" };
  if (!hass || !raw) return out;
  if (ENTITY_RE.test(raw)) {
    const st = hass.states[raw];
    if (!st) return { value: null, source: `${raw} (missing)` };
    if (raw.startsWith("weather.") && st.attributes?.[attrKey] != null) {
      const v = parseFloat(st.attributes[attrKey]);
      return Number.isFinite(v) ? { value: v, source: raw } : out;
    }
    const v = parseFloat(st.state);
    return Number.isFinite(v) ? { value: v, source: raw } : out;
  }
  const v = parseFloat(raw);
  return Number.isFinite(v) ? { value: v, source: "literal" } : out;
}

export function buildState(hass, prefix) {
  if (!hass) return null;

  const eid = (key) => ENTITY_SUFFIXES[key].replace("{prefix}", prefix);
  const get = (key) => hass.states[eid(key)] ?? null;
  const num = (key) => {
    const s = get(key);
    if (!s) return null;
    const v = parseFloat(s.state);
    return Number.isFinite(v) ? v : null;
  };
  const bool = (key) => get(key)?.state === "on";
  const text = (key) => {
    const s = get(key);
    if (!s) return "";
    return s.state === "unknown" || s.state === "unavailable" ? "" : s.state;
  };

  // ETA + stall pulled from sensor attributes
  const eta = (probe) => {
    const s = get(probe === 1 ? "probe_1_eta" : "probe_2_eta");
    if (!s) return { minutes: null, in_stall: false, stdev: null, source: null };
    const v = parseFloat(s.state);
    return {
      minutes:  Number.isFinite(v) ? v : null,
      in_stall: !!s.attributes?.in_stall,
      stdev:    s.attributes?.stall_stdev ?? null,
      source:   s.attributes?.prior_source ?? null,
      samples:  s.attributes?.samples ?? 0,
    };
  };

  const climate = get("climate");
  const setpoint = num("setpoint") ?? climate?.attributes?.temperature ?? null;

  return {
    prefix,
    entityIds: Object.fromEntries(
      Object.keys(ENTITY_SUFFIXES).map((k) => [k, eid(k)])
    ),

    // Chamber + setpoint
    chamber:        num("chamber_temp") ?? climate?.attributes?.current_temperature ?? null,
    setpoint,
    chamberDelta:   (num("chamber_temp") != null && setpoint != null)
                      ? num("chamber_temp") - setpoint : null,

    // Status
    runningStatus:  text("running_status") || null,
    activeMode:     text("active_mode") || "off",
    smokeLevel:     num("active_smoke_level"),     // null when smoke off
    smokeOn:        bool("smoke_mode"),
    winterOn:       bool("winter_mode"),
    alarmOn:        bool("alarm"),

    // Probes — both OEM reading and override (if set)
    probe1: {
      temp:    num("probe_1_temp"),
      target:  num("probe_1_target"),
      override_raw:      text("probe_1_override"),
      override_resolved: resolveValue(hass, text("probe_1_override"), "temperature"),
      ...eta(1),
    },
    probe2: {
      temp:    num("probe_2_temp"),
      target:  num("probe_2_target"),
      override_raw:      text("probe_2_override"),
      override_resolved: resolveValue(hass, text("probe_2_override"), "temperature"),
      ...eta(2),
    },

    // Chamber override (used by predictor when set)
    chamber_override: {
      raw:      text("chamber_override"),
      resolved: resolveValue(hass, text("chamber_override"), "temperature"),
    },

    // Cook session inputs (raw text the user typed)
    cookSession:    bool("cook_session"),
    notes:          text("notes"),
    protein:        text("protein"),
    weight_lb:      text("weight_lb"),
    ambient:        text("ambient_override"),
    wind:           text("wind_override"),

    // Resolved ambient + wind (handles weather entities, sensor
    // entities, and literal numeric values uniformly)
    ambientResolved: resolveValue(hass, text("ambient_override"), "temperature"),
    windResolved:    resolveValue(hass, text("wind_override"),    "wind_speed"),

    // Push / FCM
    pushOn:         bool("push_alerts"),
    pushDedupe:     num("push_dedupe"),

    // Account info — best-effort; pulled from the integration's
    // config entry diagnostics if exposed, else null. Falls back
    // gracefully when these attrs aren't present.
    account: (() => {
      // Token email is exposed by the climate entity's friendly_name
      // device, but the cleanest source is the integration's own
      // attributes. Prime Polaris doesn't expose them on a sensor yet,
      // so we leave this null for now and let the future integration
      // add a dedicated `sensor.{prefix}_account` if needed.
      const climate = get("climate");
      const email = climate?.attributes?.email ?? null;
      const expiry = climate?.attributes?.token_expiry ?? null;
      const daysToExpiry = expiry
        ? Math.max(0, Math.round((expiry * 1000 - Date.now()) / 86_400_000))
        : null;
      return { email, daysToExpiry };
    })(),

    // Last alarm
    lastAlarm: (() => {
      const s = get("last_alarm");
      if (!s) return null;
      if (s.state === "unknown" || s.state === "unavailable" || !s.state) return null;
      return {
        title:       s.state,
        body:        s.attributes?.body ?? "",
        captured_at: s.attributes?.captured_at ?? null,
        source:      s.attributes?.source ?? null,
      };
    })(),
  };
}
