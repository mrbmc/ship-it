# SHIP IT — Claude Code Briefing

## Project
A choose-your-own-adventure game for UX designers navigating tech industry dysfunction. Single HTML file, no build step, no dependencies except Google Fonts. Runs directly at `http://localhost/ux-adventure/`.

## File
`~/Sites/ux-adventure/index.html`

After every edit, the browser just needs a hard reload. No compilation.

---

## Game Structure

### Stats (all 0–100)
| Stat | Starts | Fails when |
|---|---|---|
| Sanity | 80 | → 0 |
| Credibility | 80 | → 0 |
| Caffeine | 45 | → 0 |
| Deadline | 85 | → 0 |

**Deadline counts DOWN.** Good choices cost less time (smaller negative). Bad choices cost more time (larger negative). A few very bad choices can briefly add time back (positive values = you bought time at a cost). Deadline failing at 0 triggers the AI layoff ending.

### Win rate
Mathematically enumerated across all 2,315 paths: **~36.5% win rate** (intentionally hard).

Failure breakdown:
- Deadline → 0: 1,180 paths (primary killer)
- Caffeine → 0: 203 paths
- Sanity → 0: 87 paths
- Credibility → 0: 0 paths (currently unreachable — worth fixing someday)

### Scene IDs
```
ch0               → Chapter 1: The Last Minute Request (Derek's Slack)
ch1_a             → Chapter 2a: The Missing Files (chose to panic-agree)
ch1_b             → Chapter 2b: The Negotiation (chose to push back)
ch1_c             → Chapter 2c: The Caffeinated Clarity (made coffee first)
ch2               → Chapter 3: The Design System of Broken Promises
ch3               → Chapter 4: The Creative Director Appears (Soren)
ch4               → Chapter 5: The Machine Protests (laptop freeze)
ch5               → Chapter 6: The Forty-Five Minute Window (Derek wants gamification)
ch6          → Chapter 7: Make It Look Like Balenciaga (CEO brief)
ch6_follow   → Chapter 8: The Brief That Cannot Be Briefed
ending_win  → Win: You Made Carol Visible
ending_ship       → Win: Shipped
ending_chaos      → Lose: story ending (made bad ch5 choice)
```

### Game-over screens (stat failures)
- **Credibility or Deadline → 0**: AI layoff ending (two variants, one per stat)
- **Sanity → 0**: Burnout — resign, work at Bloom & Co. florist, $14.50/hr, no health insurance, peace
- **Caffeine → 0**: Burnout — resign, work at pottery studio front desk, Gerald the cat

---

## Typography

Three-font system — each layer has a distinct role:

| Token | Font | Used for |
|---|---|---|
| `--serif` | Playfair Display, 400 italic | Story headings: `.scene-title`, `.gameover-title`, `.outcome-title` |
| `--sans` | Inter | Body copy, UI prose |
| `--mono` | DM Mono | Labels, eyebrows, buttons, stat HUD |

The game title "SHIP IT" stays Inter Bold — it's a mark, not prose.

---

## Code Architecture

Single `<script>` block at bottom of file. Key functions:

```
scenes[]           → Array of scene objects
sceneMap{}         → ID-keyed index built from scenes[]
renderScene(id)    → Renders a scene or ending
renderEnding()     → Win/lose story endings
renderGameOver()   → Stat-failure endings
handleChoice(i)    → Applies effects, shows consequence panel + Continue button, checks failure
advanceScene(id)   → Called by Continue button; failure check gates here too
checkFailure()     → Returns stat name if any stat has failed, else null
updateStats()      → Updates HUD bar widths and values
updateProgress()   → Updates chapter dot indicators
showStatDeltas()   → Animates floating +/- numbers on HUD
resetGame()        → Resets all state, re-renders ch0
getChapterParam()  → Reads ?chapter= or #chapter= or bare #hash from URL
```

### Scene object shape
```js
{
  id: 'ch2',
  tag: 'Monday, 11:45 AM',       // timestamp shown above title
  title: 'THE DESIGN SYSTEM...',
  emoji: '🧩',
  text: `...html allowed...`,
  choices: [
    {
      letter: 'A',
      text: 'What the button says',
      consequence: 'Shown AFTER the player chooses — not before.',
      type: 'good' | 'neutral' | 'bad',   // affects consequence panel color
      effects: { sanity: -15, credibility: +10, caffeine: -10, deadline: -15 },
      next: 'ch3',
      flags: { optional_flag: true }       // optional
    }
  ]
}
```

### Consequence + Continue button layout

After a choice, `handleChoice()` appends two sibling elements to `#scene-container`:
1. `.consequence-panel` — consequence text + stat delta pills (no button inside)
2. `#continue-btn` (`.continue-btn`) — full-width amber button, same style as the intro "Start your shift" CTA. Failure variant uses `.continue-btn.danger` (red background).

The scroll target is `#continue-btn`, not the panel, so the button is always visible on arrival.

### Ending object shape
```js
{
  id: 'ending_ship',
  tag: 'Tuesday, 2:47 PM',
  title: 'SHIPPED.',
  emoji: '🚢',
  text: `...`,
  isEnding: true,
  endingType: 'win' | 'lose',
  endingLabel: 'YOU SHIPPED SOMETHING'
}
```

---

## Design Rules

**Do not change these without re-running the path model:**
- Starting stat values
- Failure thresholds
- Any existing effect weights

**Effect weight conventions (sanity/credibility):**
- Bad: -10, -15, -20, -25 (scaled to severity)
- Good: +5, +10, +15, +20, +25
- Never use -5 for sanity or credibility (too weak to matter)

**Deadline conventions:**
- Counts DOWN from 85
- Normal good choice: -10 to -20
- Normal bad choice: -5 to -15 (less runway consumed because you wasted time)
- Catastrophic choice: +10 to +20 (costs you time)
- ch5 gamification choice is -20/deadline because doing the right thing at the last minute saves you

**Consequence text:**
- Shown AFTER the player chooses, not before
- Dry, deadpan, 1–2 sentences
- Does not editorialize about whether the choice was right
- Often ends on an ironic detail

**Tone:** Office Space energy. Darkly comic. The jokes come from recognition, not exaggeration. The characters (Derek, Soren, Alex) are types, not cartoons — they have internal logic.

**Writing style:** Plain prose. No jargon. Strong verbs. Short sentences in tense moments. The game text should read like a good short story, not game copy.

---

## Characters
- **Derek** — Senior PM. Rocket emojis. 11pm Slack. Wants 14 screens by tomorrow. Blameless optimist.
- **Soren** — Creative Director. Gender-neutral name, intentionally so. Just listened to a podcast. Thinks colors have shapes. Sends 4-minute voice notes. References thresholds, negative space, Muji, Dieter Rams.
- **Alex** — CEO. Did an MBA. Saw the Balenciaga website last night. Uses "skeuomorphic" in board meetings.
- **Carol** — The actual user. 47-year-old accounts payable manager. Needs to reconcile 300 freight invoices before end of quarter. Nobody in the room remembers she exists until you make them.
- **Kyle** — On parental leave. Had the source files.
- **Carl** — Left the company. One Figma artboard just says "ASK CARL."
- **Priya** — Built the design system 18 months ago. Now doing extremely well at a different company.

---

## URL Debug Parameter
```
http://localhost/ux-adventure/?chapter=ch6
```
Any valid scene ID works. Falls back to `ch0` if unrecognized. Also supports `#chapter=id` and bare `#id` hashes.

---

## Path Model
To re-run the win rate model after making changes to effect weights, run this node script (update the `scenes` object to match the current file):

```js
// paste scenes object from index.html, then:
const WIN = new Set(['ending_win','ending_ship']);
const clamp = v => Math.max(0, Math.min(100, v));
const apply = (s, fx) => ({
  sanity:      clamp(s.sanity      + (fx.sanity      || 0)),
  credibility: clamp(s.credibility + (fx.credibility || 0)),
  caffeine:    clamp(s.caffeine    + (fx.caffeine    || 0)),
  deadline:    clamp(s.deadline    + (fx.deadline    || 0)),
});
const failed = s => s.credibility<=0 || s.deadline<=0 || s.sanity<=0 || s.caffeine<=0;
const INIT = { sanity:80, credibility:80, caffeine:45, deadline:85 };
let total=0, wins=0;
const traverse = (scene, s) => {
  if (failed(s)) { total++; return; }
  if (WIN.has(scene)) { total++; wins++; return; }
  if (!scenes[scene]) { total++; return; }
  scenes[scene].forEach(([fx,next]) => traverse(next, apply(s,fx)));
};
traverse('ch0', {...INIT});
console.log(`Win rate: ${(wins/total*100).toFixed(1)}% (${wins}/${total})`);
```

Target win rate: **~20–25%**. It is currently 36.5% — acceptable but could be tighter.
