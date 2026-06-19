import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const dataFile = path.join(repoRoot, 'src/game/data.ts');
const selectorsFile = path.join(repoRoot, 'src/game/selectors.ts');
const simulatorFile = path.join(repoRoot, 'scripts/simulate-progression.mjs');
const reportFile = path.join(repoRoot, 'docs/balance-v2-report.json');

const TARGET_SECONDS = 120 * 60;
const CLICK_RATE_PER_SECOND = 1;
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

function getScaledCost(baseCostJoules, count, costGrowth) {
  return Math.ceil(baseCostJoules * costGrowth ** count);
}

function formatMinutes(seconds) {
  return Number((seconds / 60).toFixed(2));
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
  if (state.energy >= targetEnergy) return;

  const { rate } = getProduction(state);
  if (rate <= 0) {
    throw new Error(`No production available while waiting for ${targetEnergy} J.`);
  }

  const waitedSeconds = (targetEnergy - state.energy) / rate;
  state.energy += waitedSeconds * rate;
  state.seconds += waitedSeconds;
}

function buyPurchase(state, purchase, costGrowth) {
  const count = state.counts.get(purchase.id) ?? 0;
  const cost = getScaledCost(purchase.costJoules, count, costGrowth);
  waitForEnergy(state, cost);
  state.energy -= cost;
  state.counts.set(purchase.id, count + 1);
}

function researchTechnology(state, technology) {
  waitForEnergy(state, technology.costJoules);
  state.energy -= technology.costJoules;
  state.researched.add(technology.id);
}

function getRepeatCandidate(state, ageId, maxPaybackSeconds, costGrowth) {
  if (!Number.isFinite(maxPaybackSeconds)) return undefined;

  return purchases
    .filter((purchase) => purchase.ageId === ageId)
    .map((purchase) => {
      const count = state.counts.get(purchase.id) ?? 0;
      const cost = getScaledCost(purchase.costJoules, count, costGrowth);
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

function simulate(costGrowth, { repeatPaybackSeconds = 0 } = {}) {
  const state = createState();
  const rows = [];

  for (let ageIndex = 0; ageIndex < ages.length; ageIndex += 1) {
    const age = ages[ageIndex];
    const startSeconds = state.seconds;
    let guard = 0;

    while (guard < 20000) {
      guard += 1;

      const agePurchases = purchases.filter((purchase) => purchase.ageId === age.id);
      const requiredPurchase = agePurchases.find((purchase) => (state.counts.get(purchase.id) ?? 0) <= 0);

      if (requiredPurchase) {
        buyPurchase(state, requiredPurchase, costGrowth);
        continue;
      }

      const ageTechnologies = technologies.filter((technology) => technology.ageId === age.id);
      const requiredTechnology = ageTechnologies.find(
        (technology) =>
          !state.researched.has(technology.id) &&
          (state.counts.get(technology.targetPurchaseId) ?? 0) > 0,
      );

      if (requiredTechnology) {
        researchTechnology(state, requiredTechnology);
        continue;
      }

      const nextAge = ages[ageIndex + 1];
      if (!nextAge) break;

      const advanceCost = age.advanceCostJoules ?? 0;
      const repeatCandidate = getRepeatCandidate(state, age.id, repeatPaybackSeconds, costGrowth);

      if (repeatCandidate && repeatCandidate.cost < advanceCost) {
        buyPurchase(state, repeatCandidate.purchase, costGrowth);
        continue;
      }

      waitForEnergy(state, advanceCost);
      state.energy -= advanceCost;
      break;
    }

    if (guard >= 20000) {
      throw new Error(`Simulation guard reached for age ${age.id} with cost growth ${costGrowth}.`);
    }

    rows.push({
      age: age.label,
      ageMinutes: formatMinutes(state.seconds - startSeconds),
      elapsedMinutes: formatMinutes(state.seconds),
      production: Math.round(getProduction(state).rate),
    });
  }

  return {
    totalSeconds: state.seconds,
    totalMinutes: formatMinutes(state.seconds),
    rows,
  };
}

function evaluate(costGrowth) {
  const requiredOnly = simulate(costGrowth, { repeatPaybackSeconds: 0 });
  const aggressiveRepeat = simulate(costGrowth, { repeatPaybackSeconds: AGGRESSIVE_PAYBACK_SECONDS });
  const shortestSeconds = Math.min(requiredOnly.totalSeconds, aggressiveRepeat.totalSeconds);
  const underTargetPenalty = Math.max(0, TARGET_SECONDS - shortestSeconds) * 10;
  const overTargetPenalty = Math.max(0, shortestSeconds - TARGET_SECONDS);
  const earlyPenalty = Math.max(0, requiredOnly.rows[0].ageMinutes - 1.2) * 180;

  return {
    costGrowth: Number(costGrowth.toFixed(3)),
    shortestMinutes: formatMinutes(shortestSeconds),
    requiredOnly,
    aggressiveRepeat,
    score: underTargetPenalty + overTargetPenalty + earlyPenalty,
  };
}

function updateCostGrowth(file, value) {
  const content = fs.readFileSync(file, 'utf8');
  const updated = content.replace(/const COST_GROWTH = [0-9.]+;/, `const COST_GROWTH = ${value};`);

  if (updated === content) {
    throw new Error(`Unable to update COST_GROWTH in ${file}`);
  }

  fs.writeFileSync(file, updated);
}

const apply = process.argv.includes('--apply');
const candidates = [];

for (let growth = 1.18; growth <= 4.01; growth += 0.02) {
  candidates.push(evaluate(growth));
}

const viable = candidates.filter((candidate) => candidate.shortestMinutes >= 120);
const best = (viable.length ? viable : candidates)
  .sort((a, b) => a.score - b.score || a.costGrowth - b.costGrowth)[0];

const report = {
  targetMinutes: 120,
  clickRatePerSecond: CLICK_RATE_PER_SECOND,
  aggressivePaybackSeconds: AGGRESSIVE_PAYBACK_SECONDS,
  chosen: best,
  topCandidates: candidates
    .slice()
    .sort((a, b) => a.score - b.score)
    .slice(0, 10)
    .map((candidate) => ({
      costGrowth: candidate.costGrowth,
      shortestMinutes: candidate.shortestMinutes,
      requiredOnlyMinutes: candidate.requiredOnly.totalMinutes,
      aggressiveRepeatMinutes: candidate.aggressiveRepeat.totalMinutes,
      score: Number(candidate.score.toFixed(2)),
    })),
};

fs.mkdirSync(path.dirname(reportFile), { recursive: true });
fs.writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`);

console.table(report.topCandidates);
console.log(`Chosen COST_GROWTH=${best.costGrowth}, shortest=${best.shortestMinutes} min.`);
console.log(`Report written to ${path.relative(repoRoot, reportFile)}.`);

if (apply) {
  updateCostGrowth(selectorsFile, best.costGrowth);
  updateCostGrowth(simulatorFile, best.costGrowth);
  console.log(`Applied COST_GROWTH=${best.costGrowth} to selectors and simulator.`);
}
