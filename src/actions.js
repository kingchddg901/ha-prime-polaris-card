// Thin wrappers around hass.callService for every user gesture the card
// triggers. Centralised so renderers stay declarative.

export function makeActions(hass, state) {
  if (!hass || !state) return {};

  const call = (domain, service, data = {}) =>
    hass.callService(domain, service, data);

  return {
    setSetpoint: (value) =>
      call("number", "set_value", {
        entity_id: state.entityIds.setpoint,
        value,
      }),

    setSmokeLevel: (value) =>
      call("number", "set_value", {
        entity_id: state.entityIds.smoke_level,
        value,
      }),

    setProbeTarget: (probe, value) =>
      call("number", "set_value", {
        entity_id: state.entityIds[`probe_${probe}_target`],
        value,
      }),

    toggle: (key) => {
      const eid = state.entityIds[key];
      const isOn = hass.states[eid]?.state === "on";
      return call("switch", isOn ? "turn_off" : "turn_on", { entity_id: eid });
    },

    setText: (key, value) =>
      call("text", "set_value", {
        entity_id: state.entityIds[key],
        value: value ?? "",
      }),

    powerOff: () =>
      call("climate", "set_hvac_mode", {
        entity_id: state.entityIds.climate,
        hvac_mode: "off",
      }),
  };
}
