import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const dataFile = path.join(repoRoot, 'src/game/data.ts');

const COST_GROWTH = 3.02;
const TARGET_MINUTES = 120;
const PLAYER_PROFILES = [
  {
    id: 'requiredOnly',
    label: 'Objets et technologies obligatoires',
    clickRatePerSecond: 1,
    repeatPaybackSeconds: 0,
  },
  {
    id: 'aggressiveRepeat',
    label: 'Achats repetes rentables',
    clickRatePerSecond: 1,
    repeatPaybackSeconds: 600,
  },
  {
    id: 'lowClickSteady',
    label: 'Joueur calme, peu de clics',
    clickRatePerSecond: 0.35,
    repeatPaybackSeconds: 420,
  },
];

const source = fs.readFileSync(dataFile, 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;

const context = { exports: {}, require: () => undefined };
vm.createContext(context);
vm.runInContext(compiled, context);

const { ages, breakthroughMilestones = [], purchases, technologies } = context.exports;

function getScaledCost(baseCostJoules, count) {
  return Math.ceil(baseCostJoules * COST_GROWTH ** count);
}

function formatMinutes(seconds) {
  return `${(seconds / 60).toFixed(1)} min`;
}

function createState(profile) {
  return {
    counts: new Map(),
    researched: new Set(),
    breakthroughs: new Set(),
    events: [],
    energy: 0,
    profile,
    seconds: 0,
  };
}

function getBreakthroughForTrigger(trigger) {
  return breakthroughMilestones.find((milestone) => {
    return milestone.trigger.type === trigger.type && milestone.trigger.id === trigger.id;
  });
}

function recordEvent(state, event) {
  const trigger = { type: event.type, id: event.id };
  const breakthrough = getBreakthroughForTrigger(trigger);
  const isNewBreakthrough = breakthrough && !state.breakthroughs.has(breakthrough.id);

  if (isNewBreakthrough) {
    state.breakthroughs.add(breakthrough.id);
  }

  state.events.push({
    second: Number(state.seconds.toFixed(2)),
    minute: Number((state.seconds / 60).toFixed(2)),
    ...event,
    breakthrough: isNewBreakthrough
      ? {
          id: breakthrough.id,
          title: breakthrough.title,
        }
      : undefined,
  });
}

function getProduction(state) {
  let click = 2;
  let passive = 0;

  for (const purchase of purchases) {
    const count = state.counts.get(purchase.id) ?? 0;
    click += purchase.clickGain * count;
    passive += purchase.passiveGain * count;
  }

  for (const technology of technologies) {
    if (!state.researched.has(technology.id)) continue;

    click += technology.clickGain;
    passive += technology.passiveGain;
  }

  return {
    click,
    passive,
    rate: passive + click * state.profile.clickRatePerSecond,
  };
}

function waitForEnergy(state, targetEnergy) {
  if (state.energy >= targetEnergy) return 0;

  const { rate } = getProduction(state);
  if (rate <= 0) {
    throw new Error(`No production available while waiting for ${targetEnergy} J.`);
  }

  const waitedSeconds = (targetEnergy - state.energy) / rate;
  state.energy += waitedSeconds * rate;
  state.seconds += waitedSeconds;

  return waitedSeconds;
}

function buyPurchase(state, purchase) {
  const count = state.counts.get(purchase.id) ?? 0;
  const cost = getScaledCost(purchase.costJoules, count);
  waitForEnergy(state, cost);
  state.energy -= cost;
  state.counts.set(purchase.id, count + 1);
  recordEvent(state, {
    type: 'purchase',
    id: purchase.id,
    ageId: purchase.ageId,
    label: purchase.label,
  });
}

function researchTechnology(state, technology) {
  waitForEnergy(state, technology.costJoules);
  state.energy -= technology.costJoules;
  state.researched.add(technology.id);
  recordEvent(state, {
    type: 'technology',
    id: technology.id,
    ageId: technology.ageId,
    label: technology.label,
  });
}

function getRepeatCandidate(state, ageId, maxPaybackSeconds) {
  if (!Number.isFinite(maxPaybackSeconds)) return undefined;

  return purchases
    .filter((purchase) => purchase.ageId === ageId)
    .map((purchase) => {
      const count = state.counts.get(purchase.id) ?? 0;
      const cost = getScaledCost(purchase.costJoules, count);
      const gainPerSecond = purchase.passiveGain + purchase.clickGain * state.profile.clickRatePerSecond;

      return {
        purchase,
        cost,
        paybackSeconds: cost / Math.max(gainPerSecond, 0.0001),
      };
    })
    .filter((candidate) => candidate.paybackSeconds <= maxPaybackSeconds)
    .sort((a, b) => a.paybackSeconds - b.paybackSeconds)[0];
}

function simulate(profile) {
  const state = createState(profile);
  const rows = [];

  for (let ageIndex = 0; ageIndex < ages.length; ageIndex += 1) {
    const age = ages[ageIndex];
    const startSeconds = state.seconds;
    let guard = 0;

    while (guard < 10000) {
      guard += 1;

      const agePurchases = purchases.filter((purchase) => purchase.ageId === age.id);
      const requiredPurchase = agePurchases.find((purchase) => {
        return (state.counts.get(purchase.id) ?? 0) <= 0;
      });

      if (requiredPurchase) {
        buyPurchase(state, requiredPurchase);
        continue;
      }

      const ageTechnologies = technologies.filter((technology) => technology.ageId === age.id);
      const requiredTechnology = ageTechnologies.find((technology) => {
        return (
          !state.researched.has(technology.id) &&
          (state.counts.get(technology.targetPurchaseId) ?? 0) > 0
        );
      });

      if (requiredTechnology) {
        researchTechnology(state, requiredTechnology);
        continue;
      }

      const nextAge = ages[ageIndex + 1];
      if (!nextAge) break;

      const advanceCost = age.advanceCostJoules ?? 0;
      const repeatCandidate = getRepeatCandidate(state, age.id, profile.repeatPaybackSeconds);

      if (repeatCandidate && repeatCandidate.cost < advanceCost) {
        buyPurchase(state, repeatCandidate.purchase);
        continue;
      }

      waitForEnergy(state, advanceCost);
      state.energy -= advanceCost;
      recordEvent(state, {
        type: 'age',
        id: nextAge.id,
        ageId: nextAge.id,
        label: nextAge.label,
      });
      break;
    }

    if (guard >= 10000) {
      throw new Error(`Simulation guard reached for age ${age.id}.`);
    }

    const production = getProduction(state);
    rows.push({
      age: age.label,
      ageSeconds: state.seconds - startSeconds,
      elapsedSeconds: state.seconds,
      rate: production.rate,
    });
  }

  return {
    totalSeconds: state.seconds,
    rows,
    events: state.events,
    breakthroughEvents: state.events.filter((event) => event.breakthrough),
  };
}

function printRun(title, run) {
  console.log(`\n${title}`);
  console.table(
    run.rows.map((row) => ({
      age: row.age,
      ageTime: formatMinutes(row.ageSeconds),
      elapsed: formatMinutes(row.elapsedSeconds),
      production: `${Math.round(row.rate).toLocaleString('fr-FR')} J/s`,
    })),
  );
  console.log(`Total: ${formatMinutes(run.totalSeconds)}`);
}

function printBreakthroughs(title, run) {
  console.log(`\n${title} — moments forts`);
  console.table(
    run.breakthroughEvents.map((event) => ({
      minute: `${event.minute.toFixed(1)} min`,
      milestone: event.breakthrough.id,
      title: event.breakthrough.title,
      trigger: `${event.type}:${event.id}`,
    })),
  );

  const points = [
    { minute: 0, label: 'Debut' },
    ...run.breakthroughEvents.map((event) => ({
      minute: event.minute,
      label: event.breakthrough.id,
    })),
    { minute: run.totalSeconds / 60, label: 'Fin' },
  ];
  const gaps = [];
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const gapMinutes = current.minute - previous.minute;
    if (gapMinutes >= 16) {
      gaps.push({
        from: previous.label,
        to: current.label,
        gap: `${gapMinutes.toFixed(1)} min`,
      });
    }
  }

  if (gaps.length) {
    console.log(`${title} — creux a surveiller`);
    console.table(gaps);
  }
}

const runs = PLAYER_PROFILES.map((profile) => ({
  profile,
  run: simulate(profile),
}));

for (const { profile, run } of runs) {
  printRun(
    `${profile.label} (${profile.clickRatePerSecond} clic/s, payback <= ${profile.repeatPaybackSeconds}s)`,
    run,
  );
}

for (const { profile, run } of runs) {
  printBreakthroughs(profile.label, run);
}

const shortestRunSeconds = Math.min(...runs.map(({ run }) => run.totalSeconds));
if (shortestRunSeconds < TARGET_MINUTES * 60) {
  console.error(
    `\nPacing check failed: shortest simulated run is ${formatMinutes(shortestRunSeconds)}, target is ${TARGET_MINUTES} min.`,
  );
  process.exit(1);
}

console.log(
  `\nPacing check passed: shortest simulated run is ${formatMinutes(shortestRunSeconds)}, target is ${TARGET_MINUTES} min.`,
);
