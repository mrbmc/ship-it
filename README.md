# SHIP IT

A choose-your-own-adventure game for UX designers navigating tech industry dysfunction.

You have until morning. Derek needs 14 screens. Kyle is on parental leave. The design system is held together with good intentions and a Figma file nobody can find.

**Win rate: ~36.5% across all 2,315 paths. Intentionally hard.**

## Play

Open `index.html` directly in a browser, or serve it locally:

```
http://localhost/ux-adventure/
```

No build step. No dependencies except Google Fonts. Hard reload after any edits.

## Stats

| Stat | Starts at | Fails when |
|---|---|---|
| Sanity | 80 | → 0 |
| Credibility | 80 | → 0 |
| Caffeine | 45 | → 0 |
| Deadline | 85 | → 0 |

Deadline counts down. It hits zero more than anything else.

## Debug

Jump to any scene via URL:

```
http://localhost/ux-adventure/?chapter=ch6
```

Valid scene IDs: `ch0`, `ch1_a`, `ch1_b`, `ch1_c`, `ch2`, `ch3`, `ch4`, `ch5`, `ch6`, `ch6_follow`, `ending_win`, `ending_ship`, `ending_chaos`

## Characters

- **Derek** — Senior PM. Rocket emojis. Wants 14 screens by tomorrow morning.
- **Soren** — Creative Director. Just listened to a podcast. Thinks colors have shapes.
- **Alex** — CEO. Did an MBA. Saw the Rolex website last night.
- **Carol** — The actual user. Nobody remembers she exists until you make them.
- **Kyle** — On parental leave. Had the source files.
