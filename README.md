# Prime Polaris Grill Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)

Custom Lovelace card for the [`prime_polaris`](https://github.com/kingchddg901/ha-prime-polaris) pellet-grill integration. One self-contained tile with live chamber + probe readouts, ETA / stall predictions, a 4-hour chart, inline controls, and cook-session inputs.

![card preview placeholder](docs/preview.png)

## Features

- **Chamber tile** — delta-from-setpoint coloring (red over, blue under, green steady)
- **Probe tiles** — live ETA in min/hours, "in stall" callout, prior-source attribution
- **Live chart** — Apex Charts when installed, built-in canvas fallback otherwise
- **Inline controls** — temp ±5 °F, smoke / winter / alarm / push toggles, power off
- **Cook session** — start / stop, protein / weight / notes / ambient + wind overrides
- **Alarm banner** — instant FCM-driven last-alarm display

## Prerequisites

- Home Assistant 2024.1.0 or later
- The [`prime_polaris`](https://github.com/kingchddg901/ha-prime-polaris) integration set up and reporting at least `climate.grill`

## Installation via HACS (custom repository)

1. In Home Assistant, open **HACS**.
2. Click the three-dot menu (top right) → **Custom repositories**.
3. Add `https://github.com/kingchddg901/ha-prime-polaris-card` as type **Lovelace / Plugin**.
4. Click **Install** on the new "Prime Polaris Grill Card" entry.
5. HACS automatically registers the resource. If your dashboard is in YAML mode, add the resource manually:
   ```yaml
   url: /hacsfiles/ha-prime-polaris-card/ha-prime-polaris-card.js
   type: module
   ```
6. Hard-refresh your browser (Ctrl+Shift+R).

## Manual installation

1. Download the latest `ha-prime-polaris-card.js` from [Releases](https://github.com/kingchddg901/ha-prime-polaris-card/releases).
2. Copy it to `<config>/www/ha-prime-polaris-card/ha-prime-polaris-card.js`.
3. **Settings → Dashboards → Resources → Add resource** with URL `/local/ha-prime-polaris-card/ha-prime-polaris-card.js` (type: JavaScript Module).
4. Hard-refresh.

## Usage

Drop into any Lovelace view:

```yaml
type: custom:ha-prime-polaris-card
```

That's the entire required config — defaults to `entity_prefix: grill`.

## Configuration

| key | default | notes |
|---|---|---|
| `entity_prefix` | `grill` | Slug used to derive every entity_id (e.g. `sensor.grill_chamber_temperature`). Change if your integration's device produced different entity_ids. |
| `title` | _none_ | Optional card heading |
| `ambient_entity` | _none_ | Reserved — future ambient overlay on the chart |

## Chart

If [`apexcharts-card`](https://github.com/RomRider/apexcharts-card) (HACS) is installed, the card embeds an Apex chart with full recorder history. Otherwise it falls back to a built-in canvas renderer that pulls 4 hours of history from HA's recorder API on mount and appends each new sample as `hass` updates fire.

Either way you get a 4-hour rolling chart of chamber + Probe 1 + Probe 2 in °F.

## Development

```bash
git clone https://github.com/kingchddg901/ha-prime-polaris-card
cd ha-prime-polaris-card
npm install
npm run build      # → dist/ha-prime-polaris-card.js
npm run watch      # rebuilds on save
```

To drop the bundled output straight into the integration's `www/` dir:

```bash
PRIME_POLARIS_INTEGRATION=//192.168.4.104/config/custom_components/prime_polaris npm run deploy
```

## Distribution model

As of integration v0.2.0 the card ships **bundled with the integration** — when users install the integration, the card is auto-registered as a Lovelace resource. They don't need to install this repo separately. This repo remains the development home for the card source; the bundled `dist/ha-prime-polaris-card.js` gets copied into the integration's `www/` directory on each release.

Vanilla JS, ES modules, [esbuild](https://esbuild.github.io/) bundle. No TypeScript, no Lit, no virtual DOM. The architecture mirrors [eufy-vacuum-command-center](https://github.com/kingchddg901/eufy-vacuum-command-center) but flattened to one card.

```
src/
  all-cards.js        # entry, imports main.js
  main.js             # root <ha-prime-polaris-card> element
  state.js            # entity reads + derived values
  actions.js          # HA service-call wrappers
  chart.js            # apex detection + canvas fallback
  renderers.js        # one fn per UI section, returns HTML string
  styles.js           # CSS string stamped into shadow DOM
  theme.js            # color palette
  constants.js        # CARD_NAME, CARD_VERSION, entity-id mapping
```

## Issues

Please report at [github.com/kingchddg901/ha-prime-polaris-card/issues](https://github.com/kingchddg901/ha-prime-polaris-card/issues).

## License

MIT
