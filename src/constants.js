// Single source of truth for the custom-element name and version.

export const CARD_NAME    = "ha-prime-polaris-card";
export const CARD_VERSION = "0.1.3";

// Default entity prefix when card config doesn't override.
// Most HA installs of the Prime Polaris integration end up with
// entity_ids starting with "grill_" because the device defaults to
// being named "Grill" or the OEM device name slugifies to it.
export const DEFAULT_ENTITY_PREFIX = "grill";

// Suffixes that, combined with the prefix, form the entity_ids the
// card reads/writes. Centralised so the card is reusable: a single
// `entity_prefix: my_smoker` config value rewires everything.
export const ENTITY_SUFFIXES = {
  climate:                "climate.{prefix}",
  chamber_temp:           "sensor.{prefix}_chamber_temperature",
  running_status:         "sensor.{prefix}_running_status",
  active_mode:            "sensor.{prefix}_active_mode",
  active_smoke_level:     "sensor.{prefix}_active_smoke_level",
  last_alarm:             "sensor.{prefix}_last_alarm",
  probe_1_temp:           "sensor.{prefix}_probe_1_temperature",
  probe_2_temp:           "sensor.{prefix}_probe_2_temperature",
  probe_1_eta:            "sensor.{prefix}_probe_1_eta",
  probe_2_eta:            "sensor.{prefix}_probe_2_eta",
  setpoint:               "number.{prefix}_temperature",
  smoke_level:            "number.{prefix}_smoke_level",
  probe_1_target:         "number.{prefix}_probe_1_target",
  probe_2_target:         "number.{prefix}_probe_2_target",
  push_dedupe:            "number.{prefix}_push_alert_dedupe",
  smoke_mode:             "switch.{prefix}_smoke_mode",
  winter_mode:            "switch.{prefix}_winter_mode",
  alarm:                  "switch.{prefix}_temperature_alarm",
  cook_session:           "switch.{prefix}_cook_session",
  push_alerts:            "switch.{prefix}_push_alerts",
  notes:                  "text.{prefix}_cook_notes",
  protein:                "text.{prefix}_cook_protein",
  weight_lb:              "text.{prefix}_cook_weight_lb",
  ambient_override:       "text.{prefix}_cook_ambient_override",
  wind_override:          "text.{prefix}_cook_wind_override",
};

// Chart configuration
export const CHART_HISTORY_HOURS = 4;
export const CHART_REFRESH_INTERVAL_MS = 30_000;
