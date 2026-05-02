// SVG arc-gauge rendering + drag interaction.
//
// Renders the chamber temp as a filled arc on a 270° track and the
// setpoint as a draggable thumb on the same arc. User can drag the
// thumb (or click anywhere on the arc) to set the setpoint live.

import { THEME, CHAMBER_BAND_F } from "./theme.js";

const ARC_START_DEG = -135;   // rotation start (left side)
const ARC_END_DEG   =  135;   // rotation end (right side)
const ARC_SPAN      = ARC_END_DEG - ARC_START_DEG;  // 270°

/**
 * @param {object} cfg
 * @param {number} cfg.min            scale minimum (e.g. 180)
 * @param {number} cfg.max            scale maximum (e.g. 500)
 * @param {number|null} cfg.current   current measured value (chamber temp)
 * @param {number|null} cfg.target    target setpoint
 * @param {number} [cfg.size]         pixel size of the square viewBox
 * @param {string} [cfg.fillColor]    arc fill color (overrides default coloring)
 */
export function renderArcGauge(cfg) {
  const size = cfg.size ?? 220;
  const cx = size / 2;
  const cy = size / 2;
  const r  = size / 2 - 18;

  const min = cfg.min;
  const max = cfg.max;
  const cur = cfg.current ?? min;
  const tgt = cfg.target  ?? min;

  const curAngle = angleFor(cur, min, max);
  const tgtAngle = angleFor(tgt, min, max);

  const fillColor = cfg.fillColor ?? colorFor(cur, tgt);

  const bgPath  = arcPath(cx, cy, r, ARC_START_DEG, ARC_END_DEG);
  const fillPth = arcPath(cx, cy, r, ARC_START_DEG, curAngle);

  const tgtPos = polar(cx, cy, r, tgtAngle);

  return `
    <svg
      viewBox="0 0 ${size} ${size}"
      class="arc-gauge"
      data-gauge="true"
      data-min="${min}"
      data-max="${max}"
      data-cx="${cx}"
      data-cy="${cy}"
      data-r="${r}">

      <!-- track -->
      <path d="${bgPath}"
        stroke="${THEME.panelBorder}"
        stroke-width="12"
        stroke-linecap="round"
        fill="none" />

      <!-- filled arc up to current -->
      <path d="${fillPth}"
        stroke="${fillColor}"
        stroke-width="12"
        stroke-linecap="round"
        fill="none" />

      <!-- setpoint indicator (display-only; setpoint is set via the
           type-in input in the chamber panel) -->
      <circle cx="${tgtPos.x}" cy="${tgtPos.y}" r="11"
        fill="${THEME.accent}"
        stroke="${THEME.text}"
        stroke-width="2" />

      <!-- center readout: big chamber temp, small target -->
      <text x="${cx}" y="${cy - 4}"
        text-anchor="middle"
        font-size="44"
        font-weight="600"
        fill="${THEME.text}"
        style="font-family: inherit;">
        ${cfg.current != null ? cfg.current.toFixed(0) : "—"}<tspan font-size="22" fill="${THEME.textDim}">°F</tspan>
      </text>
      <text x="${cx}" y="${cy + 24}"
        text-anchor="middle"
        font-size="13"
        fill="${THEME.textDim}"
        style="font-family: inherit;">
        target ${cfg.target ?? "—"}°F
      </text>
    </svg>
  `;
}

// === Geometry helpers ========================================

function angleFor(v, min, max) {
  const clamped = Math.max(min, Math.min(max, v));
  const t = (clamped - min) / (max - min);
  return ARC_START_DEG + t * ARC_SPAN;
}

function valueFromAngle(angleDeg, min, max) {
  // Snap to arc range
  let a = angleDeg;
  while (a < ARC_START_DEG - 180) a += 360;
  while (a >  ARC_END_DEG   + 180) a -= 360;
  const clamped = Math.max(ARC_START_DEG, Math.min(ARC_END_DEG, a));
  const t = (clamped - ARC_START_DEG) / ARC_SPAN;
  return Math.round(min + t * (max - min));
}

function polar(cx, cy, r, angleDeg) {
  const rad = (angleDeg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx, cy, r, fromDeg, toDeg) {
  const a = polar(cx, cy, r, fromDeg);
  const b = polar(cx, cy, r, toDeg);
  const large = Math.abs(toDeg - fromDeg) > 180 ? 1 : 0;
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${large} 1 ${b.x} ${b.y}`;
}

function colorFor(current, target) {
  if (current == null || target == null) return THEME.accent;
  const delta = current - target;
  if (delta >  CHAMBER_BAND_F) return THEME.hot;
  if (delta < -CHAMBER_BAND_F) return THEME.cool;
  return THEME.steady;
}

// === Drag interaction ========================================

/**
 * Wires drag-to-set on a gauge element. Calls `onCommit(value)` once
 * the user releases (avoids spamming setpoint commands during the drag).
 */
export function attachGaugeDrag(svgEl, onCommit) {
  if (!svgEl) return;
  const min = parseFloat(svgEl.dataset.min);
  const max = parseFloat(svgEl.dataset.max);
  const cx  = parseFloat(svgEl.dataset.cx);
  const cy  = parseFloat(svgEl.dataset.cy);

  let dragging = false;
  let pendingValue = null;

  const computeValue = (clientX, clientY) => {
    const rect = svgEl.getBoundingClientRect();
    const scaleX = svgEl.viewBox.baseVal.width  / rect.width;
    const scaleY = svgEl.viewBox.baseVal.height / rect.height;
    const x = (clientX - rect.left) * scaleX - cx;
    const y = (clientY - rect.top)  * scaleY - cy;
    const angleDeg = Math.atan2(y, x) * 180 / Math.PI + 90;
    return valueFromAngle(angleDeg, min, max);
  };

  const onMove = (e) => {
    if (!dragging) return;
    const v = computeValue(e.clientX, e.clientY);
    pendingValue = v;
    // Live preview by repositioning thumb + reflowing filled arc would
    // require redrawing — defer that to the next render after commit.
  };

  const onUp = () => {
    if (!dragging) return;
    dragging = false;
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerup",   onUp);
    if (pendingValue != null) onCommit(pendingValue);
  };

  svgEl.addEventListener("pointerdown", (e) => {
    // Only start drag from the thumb or the filled arc area
    const target = e.target;
    const isThumb = target.dataset?.thumb === "true";
    const isOnGauge = target.tagName === "path" || isThumb;
    if (!isOnGauge) return;
    e.preventDefault();
    dragging = true;
    pendingValue = computeValue(e.clientX, e.clientY);
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup",   onUp);
  });
}
