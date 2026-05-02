// State accessor — derives every value the card needs from `hass.states`
// keyed by the configured entity prefix. Centralised here so renderers
// don't reach into hass directly.

import { ENTITY_SUFFIXES } from "./constants.js";

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

    // Probes
    probe1: {
      temp:    num("probe_1_temp"),
      target:  num("probe_1_target"),
      ...eta(1),
    },
    probe2: {
      temp:    num("probe_2_temp"),
      target:  num("probe_2_target"),
      ...eta(2),
    },

    // Cook session inputs
    cookSession:    bool("cook_session"),
    notes:          text("notes"),
    protein:        text("protein"),
    weight_lb:      text("weight_lb"),
    ambient:        text("ambient_override"),
    wind:           text("wind_override"),

    // Push / FCM
    pushOn:         bool("push_alerts"),
    pushDedupe:     num("push_dedupe"),

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
