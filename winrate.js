// UX Adventure — Win Rate Path Model
// Usage: node winrate.js
// Make sure the scenes array below matches the current index.html

const fs = require('fs');
const path = require('path');

// Read scenes from index.html
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Extract scenes array from the script block
const lines = html.split('\n');
const start = lines.findIndex(l => l.trim().startsWith('const scenes'));
const end   = lines.findIndex((l, i) => i > start && l.trim() === '];');
if (start === -1 || end === -1) {
  console.error('Could not find scenes array in index.html');
  process.exit(1);
}
const scenesCode = lines.slice(start, end + 1).join('\n');

// Build sceneMap from the scenes array
eval(scenesCode.replace('const scenes', 'var scenes'));
const sceneMap = {};
scenes.forEach(s => { sceneMap[s.id] = s; });

// Path model
const WIN = new Set(['ending_win', 'ending_ship']);
const clamp = v => Math.max(0, Math.min(100, v));
const apply = (s, fx) => ({
  sanity:      clamp(s.sanity      + (fx.sanity      || 0)),
  credibility: clamp(s.credibility + (fx.credibility || 0)),
  caffeine:    clamp(s.caffeine    + (fx.caffeine    || 0)),
  deadline:    clamp(s.deadline    + (fx.deadline    || 0)),
});

const INIT = { sanity: 80, credibility: 80, caffeine: 45, deadline: 85 };

let total = 0, wins = 0;
const failures = { deadline: 0, caffeine: 0, sanity: 0, credibility: 0 };

const checkFailure = s => {
  if (s.deadline    <= 0) return 'deadline';
  if (s.caffeine    <= 0) return 'caffeine';
  if (s.sanity      <= 0) return 'sanity';
  if (s.credibility <= 0) return 'credibility';
  return null;
};

const traverse = (sceneId, s) => {
  const fail = checkFailure(s);
  if (fail) { total++; failures[fail]++; return; }
  if (WIN.has(sceneId)) { total++; wins++; return; }
  const scene = sceneMap[sceneId];
  if (!scene || !scene.choices) { total++; return; }
  scene.choices.forEach(c => traverse(c.next, apply(s, c.effects || {})));
};

traverse('intro', { ...INIT });

const pct = (n) => `${(n / total * 100).toFixed(1)}%`;

console.log('');
console.log(`Win rate: ${(wins / total * 100).toFixed(1)}% (${wins}/${total} paths)`);
console.log('');
console.log('Failure breakdown:');
console.log(`  Deadline     → 0 : ${failures.deadline} paths (${pct(failures.deadline)})`);
console.log(`  Caffeine     → 0 : ${failures.caffeine} paths (${pct(failures.caffeine)})`);
console.log(`  Sanity       → 0 : ${failures.sanity} paths (${pct(failures.sanity)})`);
console.log(`  Credibility  → 0 : ${failures.credibility} paths (${pct(failures.credibility)})`);
console.log('');
