// All CSS for the card. Imported as a string and stamped into shadow DOM.

import { THEME } from "./theme.js";

export const STYLES = `
  :host {
    display: block;
    color: ${THEME.text};
    font-family: var(--paper-font-body1_-_font-family, system-ui, sans-serif);
  }
  .card {
    background: ${THEME.bg};
    border-radius: 14px;
    padding: 16px;
    display: grid;
    gap: 12px;
  }
  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .panel {
    background: ${THEME.panel};
    border: 1px solid ${THEME.panelBorder};
    border-radius: 10px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .panel.tall { padding: 16px 14px; }
  .panel-label {
    font-size: 11px;
    color: ${THEME.textDim};
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .big-temp {
    font-size: 44px;
    font-weight: 600;
    line-height: 1;
    margin-top: 2px;
  }
  .big-temp .unit {
    font-size: 22px;
    color: ${THEME.textDim};
    font-weight: 400;
    margin-left: 4px;
  }
  .big-temp.over   { color: ${THEME.hot}; }
  .big-temp.under  { color: ${THEME.cool}; }
  .big-temp.steady { color: ${THEME.steady}; }
  .delta {
    font-size: 13px;
    color: ${THEME.textDim};
    margin-top: 2px;
  }
  .chip-row {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  .chip {
    background: ${THEME.bg};
    border: 1px solid ${THEME.panelBorder};
    border-radius: 999px;
    padding: 3px 10px;
    font-size: 11px;
    color: ${THEME.textDim};
  }
  .chip.active   { border-color: ${THEME.accent}; color: ${THEME.accent}; }
  .chip.smoke    { border-color: ${THEME.smoke};  color: ${THEME.smoke};  }
  .chip.alarm    { border-color: ${THEME.alarm};  color: ${THEME.alarm};  }
  .chip.stall    { border-color: ${THEME.stall};  color: ${THEME.stall};  }

  .probe {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 8px 12px;
    align-items: center;
  }
  .probe-label { font-size: 11px; color: ${THEME.textDim}; text-transform: uppercase; }
  .probe-temp {
    font-size: 28px;
    font-weight: 600;
    line-height: 1;
  }
  .probe-target {
    font-size: 13px;
    color: ${THEME.textDim};
  }
  .probe-eta {
    font-size: 14px;
    color: ${THEME.text};
    margin-top: 2px;
  }
  .probe-eta.fitting { color: ${THEME.textDim}; font-style: italic; }
  .probe-eta.stall   { color: ${THEME.stall}; font-weight: 500; }

  .controls {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 8px;
  }
  .stepper-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .stepper-label {
    font-size: 12px;
    color: ${THEME.textDim};
    text-transform: uppercase;
    letter-spacing: 0.04em;
    flex: 0 0 88px;
  }
  .stepper-input {
    background: ${THEME.bg};
    color: ${THEME.text};
    border: 1px solid ${THEME.panelBorder};
    border-radius: 6px;
    padding: 6px 8px;
    width: 80px;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    -moz-appearance: textfield;
  }
  .stepper-input::-webkit-outer-spin-button,
  .stepper-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .stepper-input:focus { outline: none; border-color: ${THEME.accent}; }
  .stepper-unit {
    font-size: 13px;
    color: ${THEME.textDim};
    min-width: 22px;
  }
  .stepper-btn {
    width: 36px;
    padding: 6px 0;
    font-size: 18px;
    font-weight: 600;
  }
  .slider {
    flex: 1;
    accent-color: ${THEME.accent};
    height: 6px;
  }
  .arc-panel {
    align-items: center;
  }
  .arc-gauge {
    width: 100%;
    max-width: 260px;
    height: auto;
    display: block;
    margin: 4px auto 0;
    user-select: none;
    touch-action: none;
  }
  .arc-gauge text {
    font-family: var(--paper-font-body1_-_font-family, system-ui, sans-serif);
  }
  button.action {
    background: ${THEME.panel};
    color: ${THEME.text};
    border: 1px solid ${THEME.panelBorder};
    border-radius: 8px;
    padding: 8px 10px;
    cursor: pointer;
    font-size: 13px;
    transition: border-color 0.15s, background 0.15s;
  }
  button.action:hover { border-color: ${THEME.accent}; }
  button.action.on    { border-color: ${THEME.accent}; background: ${THEME.accentDim}; color: ${THEME.text}; }
  button.action.alarm.on { border-color: ${THEME.alarm}; background: #4b1d1d; }

  .session {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 8px 12px;
    align-items: center;
  }
  .resolved-badge {
    font-size: 12px;
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
  .resolved-badge.ok  { color: ${THEME.steady}; border-color: ${THEME.steady}; background: rgba(34, 197, 94, 0.08); }
  .resolved-badge.bad { color: ${THEME.alarm};  border-color: ${THEME.alarm};  background: rgba(248, 113, 113, 0.08); }
  .session input[type="text"], .session input[type="number"] {
    background: ${THEME.bg};
    color: ${THEME.text};
    border: 1px solid ${THEME.panelBorder};
    border-radius: 6px;
    padding: 6px 8px;
    width: 100%;
    box-sizing: border-box;
    font-size: 13px;
  }
  .session input:focus { outline: none; border-color: ${THEME.accent}; }
  .session-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .rec-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${THEME.textDim};
  }
  .rec-dot.live { background: ${THEME.alarm}; box-shadow: 0 0 8px ${THEME.alarm}; }

  .chart-host {
    width: 100%;
    min-height: 240px;
    background: ${THEME.panel};
    border: 1px solid ${THEME.panelBorder};
    border-radius: 10px;
    overflow: hidden;
  }
  .chart-host canvas { display: block; width: 100%; height: 240px; }

  .alarm-banner {
    background: #4b1d1d;
    border: 1px solid ${THEME.alarm};
    color: ${THEME.text};
    padding: 8px 12px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .alarm-banner.dim {
    background: ${THEME.panel};
    border-color: ${THEME.panelBorder};
    color: ${THEME.textDim};
  }
  .small { font-size: 11px; color: ${THEME.textDim}; }

  @media (max-width: 600px) {
    .row { grid-template-columns: 1fr; }
  }
`;
