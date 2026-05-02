// Recipe presets — one-tap application of grill setpoint + smoke
// + probe targets. Time is always a variable, so it's never set.
//
// Each recipe's `apply` block is sparse: only the fields actually
// being set get keys. Missing fields = "leave as-is" so users
// don't see their other knobs spuriously reset.

export const DEFAULT_RECIPES = [
  {
    id: "brisket",
    name: "Brisket Low & Slow",
    description: "225°F · P1→203°F",
    apply: { setpoint: 225, smoke_mode: false, probe_1_target: 203, protein: "brisket" },
  },
  {
    id: "brisket_smoke",
    name: "Brisket + Smoke",
    description: "225°F · smoke 5 · P1→203°F",
    apply: { setpoint: 225, smoke_mode: true, smoke_level: 5, probe_1_target: 203, protein: "brisket" },
  },
  {
    id: "pork_shoulder",
    name: "Pork Shoulder",
    description: "250°F · P1→203°F",
    apply: { setpoint: 250, smoke_mode: false, probe_1_target: 203, protein: "pork shoulder" },
  },
  {
    id: "ribs",
    name: "Ribs",
    description: "225°F · smoke 4 · P1→195°F",
    apply: { setpoint: 225, smoke_mode: true, smoke_level: 4, probe_1_target: 195, protein: "ribs" },
  },
  {
    id: "chicken",
    name: "Chicken",
    description: "375°F · P1→165°F",
    apply: { setpoint: 375, smoke_mode: false, probe_1_target: 165, protein: "chicken" },
  },
  {
    id: "burgers",
    name: "Burgers",
    description: "400°F · P1→160°F",
    apply: { setpoint: 400, smoke_mode: false, probe_1_target: 160, protein: "burgers" },
  },
  {
    id: "sear",
    name: "Sear",
    description: "500°F",
    apply: { setpoint: 500, smoke_mode: false },
  },
  {
    id: "smoke_only",
    name: "Smoke Only",
    description: "200°F · smoke 8",
    apply: { setpoint: 200, smoke_mode: true, smoke_level: 8 },
  },
];

/**
 * Merge user-configured recipes (from card YAML) with defaults.
 * User entries override defaults of the same `id`; new ones append.
 */
export function resolveRecipes(userRecipes) {
  if (!Array.isArray(userRecipes) || userRecipes.length === 0) {
    return DEFAULT_RECIPES;
  }
  const byId = new Map(DEFAULT_RECIPES.map((r) => [r.id, r]));
  for (const r of userRecipes) {
    if (!r || !r.id) continue;
    byId.set(r.id, {
      id: r.id,
      name: r.name || r.id,
      description: r.description || "",
      apply: r.apply || {},
    });
  }
  return Array.from(byId.values());
}
