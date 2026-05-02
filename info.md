# Prime Polaris Grill Card

A custom Lovelace card for the [`prime_polaris`](https://github.com/kingchddg901/ha-prime-polaris) Home Assistant integration — a single-tile dashboard for live cook monitoring.

## Features

- **Big chamber readout** with delta-from-setpoint coloring (red over, blue under, green steady)
- **Probe tiles** with live ETA and stall detection from the integration's predictor
- **4-hour live chart** — Apex Charts when installed, built-in canvas fallback otherwise
- **Inline controls** — temp ±5°F, smoke / winter / alarm / push toggles, power off
- **Cook session inputs** — protein / weight / notes / ambient + wind overrides
- **Last-alarm banner** — title + body, shows FCM source

## Setup

After install, add as a Lovelace resource (HACS does this automatically) and drop into any view:

```yaml
type: custom:ha-prime-polaris-card
```

Defaults to `entity_prefix: grill` — auto-discovers all needed entities. Override `entity_prefix` if your device's entity_ids use a different slug.
