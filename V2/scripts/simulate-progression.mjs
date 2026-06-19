import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const dataFile = path.join(repoRoot, 'src/game/data.ts');

const COST_GROWTH = 3.02;
const CLICK_RATE_PER_SECOND = 1;
const TARGET_MINUTES = 120;
const AGGRESSIVE_PAYBACK_SECONDS = 600;

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

const { ages, purchases, technologies } = context.exports;

function getScaledCost(baseCostJoules, count) {
  return Math.ceil(baseCostJoules * COST_GROWTH ** count);
}

function formatMinutes(seconds) {
  return `${(seconds / 60).toFixed(1)} min`;
}

function createState() {
  return {
    counts: new Map(),
    researched: new Set(),
    energy: 0,
    seconds: 0,
  };
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
    rate: passive + click * CLICK_RATE_PER_SECOND,
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
}

function researchTechnology(state, technology) {
  waitForEnergy(state, technology.costJoules);
  state.energy -= technology.costJoules;
  state.researched.add(technology.id);
}

function getRepeatCandidate(state, ageId, maxPaybackSeconds) {
  if (!Number.isFinite(maxPaybackSeconds)) return undefined;

  return purchases
    .filter((purchase) => purchase.ageId === ageId)
    .map((purchase) => {
      const count = state.counts.get(purchase.id) ?? 0;
      const cost = getScaledCost(purchase.costJoules, count);
      const gainPerSecond = purchase.passiveGain + purchase.clickGain * CLICK_RATE_PER_SECOND;

      return {
        purchase,
        cost,
        paybackSeconds: cost / Math.max(gainPerSecond, 0.0001),
      };
    })
    .filter((candidate) => candidate.paybackSeconds <= maxPaybackSeconds)
    .sort((a, b) => a.paybackSeconds - b.paybackSeconds)[0];
}

function simulate({ repeatPaybackSeconds = 0 } = {}) {
  const state = createState();
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
      const repeatCandidate = getRepeatCandidate(state, age.id, repeatPaybackSeconds);

      if (repeatCandidate && repeatCandidate.cost < advanceCost) {
        buyPurchase(state, repeatCandidate.purchase);
        continue;
      }

      waitForEnergy(state, advanceCost);
      state.energy -= advanceCost;
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

const requiredOnly = simulate({ repeatPaybackSeconds: 0 });
const aggressiveRepeat = simulate({ repeatPaybackSeconds: AGGRESSIVE_PAYBACK_SECONDS });

printRun('Required objects and technologies only', requiredOnly);
printRun(`Aggressive repeats, current-age purchases, payback <= ${AGGRESSIVE_PAYBACK_SECONDS}s`, aggressiveRepeat);

const shortestRunSeconds = Math.min(requiredOnly.totalSeconds, aggressiveRepeat.totalSeconds);
if (shortestRunSeconds < TARGET_MINUTES * 60) {
  console.error(
    `\nPacing check failed: shortest simulated run is ${formatMinutes(shortestRunSeconds)}, target is ${TARGET_MINUTES} min.`,
  );
  process.exit(1);
}

console.log(
  `\nPacing check passed: shortest simulated run is ${formatMinutes(shortestRunSeconds)}, target is ${TARGET_MINUTES} min.`,
);
