// Modified version: all negative sanity effects reduced by 5 (less severe),
// all negative caffeine effects reduced by 5 (less severe).
// Positive sanity/caffeine values are unchanged.

const scenes = {
  'ch0': [
    [{ sanity: -5,  credibility: +5, caffeine: -10, deadline: -15 }, 'ch1_a'],  // sanity -10->-5, caffeine -15->-10
    [{ sanity: +5,  credibility: +5, caffeine: -5,  deadline: -5  }, 'ch1_b'],  // sanity positive, unchanged; caffeine already -5 -> 0? No: -5->0 would be reduction by 5
    [{ sanity: +5,  credibility: -5, caffeine: +10, deadline: -10 }, 'ch1_c'],  // sanity positive, caffeine positive — both unchanged
  ],
  'ch1_a': [
    [{ sanity: -5,  credibility: -15, caffeine: -5,  deadline: -15 }, 'ch2'],  // sanity -10->-5, caffeine -10->-5
    [{ sanity: 0,   credibility: -5,  caffeine: 0,   deadline: -10 }, 'ch2'],  // sanity -5->0, caffeine -5->0
    [{ sanity: -10, credibility: 0,   caffeine: 0,   deadline: -5  }, 'ch2'],  // sanity -15->-10, caffeine 0 unchanged
  ],
  'ch1_b': [
    [{ sanity: -15, credibility: 0,   caffeine: 0,   deadline: +5  }, 'ch2'],  // sanity -20->-15, caffeine 0 unchanged
    [{ sanity: +5,  credibility: +10, caffeine: -5,  deadline: -15 }, 'ch2'],  // sanity positive unchanged, caffeine -5->0? No: reduce -5 by 5 = 0
    [{ sanity: 0,   credibility: +5,  caffeine: -5,  deadline: -10 }, 'ch2'],  // sanity -5->0, caffeine -10->-5
  ],
  'ch1_c': [
    [{ sanity: +5,  credibility: +10, caffeine: -5,  deadline: -15 }, 'ch2'],  // sanity positive unchanged, caffeine -10->-5
    [{ sanity: -10, credibility: -5,  caffeine: -10, deadline: -5  }, 'ch2'],  // sanity -15->-10, caffeine -15->-10
    [{ sanity: 0,   credibility: -10, caffeine: 0,   deadline: -10 }, 'ch2'],  // sanity -5->0, caffeine -5->0
  ],
  'ch2': [
    [{ sanity: -10, credibility: -5,  caffeine: 0,   deadline: -5  }, 'ch3'],  // sanity -15->-10, caffeine -5->0
    [{ sanity: -20, credibility: -10, caffeine: -5,  deadline: -10 }, 'ch3'],  // sanity -25->-20, caffeine -10->-5
    [{ sanity: -10, credibility: +10, caffeine: -10, deadline: -10 }, 'ch3'],  // sanity -15->-10, caffeine -15->-10
  ],
  'ch3': [
    [{ sanity: -5,  credibility: +5,  caffeine: -5,  deadline: -10 }, 'ch4'],  // sanity -10->-5, caffeine -10->-5
    [{ sanity: -15, credibility: +5,  caffeine: 0,   deadline: -5  }, 'ch4'],  // sanity -20->-15, caffeine -5->0
    [{ sanity: 0,   credibility: -10, caffeine: 0,   deadline: -15 }, 'ch4'],  // sanity -5->0, caffeine 0 unchanged
  ],
  'ch4': [
    [{ sanity: -5,  credibility: -10, caffeine: -5,  deadline: -5  }, 'ch5'],  // sanity -10->-5, caffeine -10->-5
    [{ sanity: -15, credibility: -10, caffeine: 0,   deadline: -15 }, 'ch5'],  // sanity -20->-15, caffeine -5->0
    [{ sanity: +5,  credibility: +5,  caffeine: 0,   deadline: -10 }, 'ch5'],  // sanity positive unchanged, caffeine 0 unchanged
  ],
  'ch5': [
    [{ sanity: -5,  credibility: +10, caffeine: 0,   deadline: -5  }, 'ch_6'],  // sanity -10->-5, caffeine -5->0
    [{ sanity: -10, credibility: -10, caffeine: 0,   deadline: -10 }, 'ch_6'],  // sanity -15->-10, caffeine 0 unchanged
    [{ sanity: -20, credibility: -15, caffeine: -5,  deadline: -15 }, 'ch_6'],  // sanity -25->-20, caffeine -10->-5
  ],
  'ch_6': [
    [{ sanity: -10, credibility: +10, caffeine: 0,   deadline: -10 }, 'ch_6_follow'],  // sanity -15->-10, caffeine -5->0
    [{ sanity: -5,  credibility: -5,  caffeine: 0,   deadline: -5  }, 'ch_6_follow'],  // sanity -10->-5, caffeine 0 unchanged
    [{ sanity: -20, credibility: -15, caffeine: -5,  deadline: -15 }, 'ch_6_follow'],  // sanity -25->-20, caffeine -10->-5
  ],
  'ch_6_follow': [
    [{ sanity: -5,  credibility: -5,  caffeine: -5,  deadline: -10 }, 'ending_balenciaga_win'],  // sanity -10->-5, caffeine -10->-5
    [{ sanity: -15, credibility: +5,  caffeine: 0,   deadline: -15 }, 'ending_ship'],             // sanity -20->-15, caffeine -5->0
    [{ sanity: -5,  credibility: -5,  caffeine: 0,   deadline: -5  }, 'ending_ship'],             // sanity -10->-5, caffeine 0 unchanged
  ],
};

const WIN = new Set(['ending_balenciaga_win', 'ending_ship']);
const clamp = v => Math.max(0, Math.min(100, v));
const apply = (s, fx) => ({
  sanity:      clamp(s.sanity      + (fx.sanity      || 0)),
  credibility: clamp(s.credibility + (fx.credibility || 0)),
  caffeine:    clamp(s.caffeine    + (fx.caffeine    || 0)),
  deadline:    clamp(s.deadline    + (fx.deadline    || 0)),
});
const failed = s => s.credibility <= 0 || s.deadline <= 0 || s.sanity <= 0 || s.caffeine <= 0;
const INIT = { sanity: 80, credibility: 80, caffeine: 45, deadline: 85 };
let total = 0, wins = 0;
const deaths = { sanity: 0, credibility: 0, caffeine: 0, deadline: 0 };

const traverse = (scene, s) => {
  if (failed(s)) {
    total++;
    if (s.sanity <= 0) deaths.sanity++;
    else if (s.credibility <= 0) deaths.credibility++;
    else if (s.caffeine <= 0) deaths.caffeine++;
    else if (s.deadline <= 0) deaths.deadline++;
    return;
  }
  if (WIN.has(scene)) { total++; wins++; return; }
  if (!scenes[scene]) { total++; return; }
  scenes[scene].forEach(([fx, next]) => traverse(next, apply(s, fx)));
};

traverse('ch0', { ...INIT });
console.log(`Win rate: ${(wins/total*100).toFixed(1)}% (${wins}/${total})`);
console.log('Deaths:', deaths);
