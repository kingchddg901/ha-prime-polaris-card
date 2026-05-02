// Color palette for the grill card. Centralised here so future themes
// (light/dark variants, user overrides) can swap one map.

export const THEME = {
  bg:               "#0d1117",
  panel:            "#161b22",
  panelBorder:      "#30363d",
  text:             "#e6edf3",
  textDim:          "#8b949e",
  accent:           "#fb923c",   // grill orange
  accentDim:        "#9a3412",
  cool:             "#3b82f6",   // under setpoint
  hot:              "#ef4444",   // over setpoint
  steady:           "#22c55e",   // within band
  smoke:            "#a78bfa",
  alarm:            "#f87171",
  stall:            "#f59e0b",
  probe1:           "#ef4444",
  probe2:           "#06b6d4",
  chartChamber:     "#fb923c",
  chartProbe1:      "#ef4444",
  chartProbe2:      "#06b6d4",
};

// Deviation thresholds that drive chamber-temp coloring.
export const CHAMBER_BAND_F = 5;   // ±°F around setpoint = "steady"
