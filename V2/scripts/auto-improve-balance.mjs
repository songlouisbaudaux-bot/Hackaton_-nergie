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

const { ages, breakthroughMilestones = [], purchases, technologies } = context.exports;

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

const pacingBands = [
  { min: 0.2, max: 2.0 },
  { min: 0.5, max: 3.0 },
  { min: 0.8, max: 5.0 },
  { min: 1.0, max: 7.0 },
  { min: 2.0, max: 10.0 },
  { min: 4.0, max: 14.0 },
  { min: 6.0, max: 18.0 },
  { min: 8.0, max: 22.0 },
  { min: 10.0, max: 28.0 },
  { min: 16.0, max: 36.0 },
  { min: 24.0, max: 52.0 },
  { min: 10.0, max: 28.0 },
];

function getAgeBand(index) {
  return pacingBands[index] ?? { min: 2, max: 20 };
}

function diagnoseAge(row, index) {
  const band = getAgeBand(index);
  let status = 'ok';
  let recommendation = 'Garder le rythme actuel.';
  const ageId = ages[index]?.id;
  const ageBreakthroughs = breakthroughMilestones.filter((milestone) => {
    if (milestone.trigger.type === 'age') return milestone.trigger.id === ageId;

    const source = milestone.trigger.type === 'purchase' ? purchases : technologies;
    return source.find((item) => item.id === milestone.trigger.id)?.ageId === ageId;
  });

  if (row.ageMinutes < band.min) {
    status = 'too-fast';
    recommendation = 'Ajouter un petit palier ou augmenter legerement le cout de transition.';
  } else if (row.ageMinutes > band.max) {
    status = 'too-slow';
    recommendation = 'Ajouter un objectif intermediaire, un feedback fort, ou reduire le cout de transition.';
  } else if (row.ageMinutes > band.max * 0.72) {
    status = 'watch';
    recommendation = ageBreakthroughs.length
      ? `Moment fort en place : ${ageBreakthroughs.map((milestone) => milestone.id).join(', ')}.`
      : 'Prevoir un moment waouh pour eviter une attente passive.';
  }

  return {
    age: row.age,
    ageMinutes: row.ageMinutes,
    targetBandMinutes: `${band.min}-${band.max}`,
    status,
    breakthroughs: ageBreakthroughs.map((milestone) => milestone.id),
    recommendation,
  };
}

function diagnoseRun(run) {
  return run.rows.map((row, index) => diagnoseAge(row, index));
}

function updateCostGrowth(file, value) {
  const content = fs.readFileSync(file, 'utf8');
  const pattern = /const COST_GROWTH = [0-9.]+;/;

  if (!pattern.test(content)) {
    throw new Error(`Unable to update COST_GROWTH in ${file}`);
  }

  const updated = content.replace(pattern, `const COST_GROWTH = ${value};`);

  if (updated === content) return;

  fs.writeFileSync(file, updated);
}

const apply = process.argv.includes('--apply');
const loop = process.argv.includes('--loop');
const roundsArg = process.argv.find((arg) => arg.startsWith('--rounds='));
const intervalArg = process.argv.find((arg) => arg.startsWith('--interval-ms='));
const maxRounds = roundsArg ? Number(roundsArg.split('=')[1]) : Infinity;
const intervalMs = intervalArg ? Number(intervalArg.split('=')[1]) : 5000;

function buildReport() {
  const candidates = [];

  for (let growth = 1.18; growth <= 4.01; growth += 0.02) {
    candidates.push(evaluate(growth));
  }

  const viable = candidates.filter((candidate) => candidate.shortestMinutes >= 120);
  const best = (viable.length ? viable : candidates)
    .sort((a, b) => a.score - b.score || a.costGrowth - b.costGrowth)[0];

  return {
    targetMinutes: 120,
    clickRatePerSecond: CLICK_RATE_PER_SECOND,
    aggressivePaybackSeconds: AGGRESSIVE_PAYBACK_SECONDS,
    breakthroughs: breakthroughMilestones.map((milestone) => ({
      id: milestone.id,
      trigger: milestone.trigger,
      title: milestone.title,
    })),
    chosen: best,
    diagnostics: {
      requiredOnly: diagnoseRun(best.requiredOnly),
      aggressiveRepeat: diagnoseRun(best.aggressiveRepeat),
    },
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
}

function writeReport(report) {
  fs.mkdirSync(path.dirname(reportFile), { recursive: true });
  fs.writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`);
}

function printReport(report, round) {
  if (round) {
    console.log(`\nBalance round ${round}`);
  }

  console.table(report.topCandidates);
  console.log(`Chosen COST_GROWTH=${report.chosen.costGrowth}, shortest=${report.chosen.shortestMinutes} min.`);
  console.log(`Report written to ${path.relative(repoRoot, reportFile)}.`);

  const warnings = report.diagnostics.aggressiveRepeat.filter((row) => row.status !== 'ok');
  if (warnings.length) {
    console.log('\nPacing diagnostics, aggressive run');
    console.table(warnings);
  }
}

function runRound(round) {
  const report = buildReport();
  writeReport(report);
  printReport(report, round);

  if (apply) {
    updateCostGrowth(selectorsFile, report.chosen.costGrowth);
    updateCostGrowth(simulatorFile, report.chosen.costGrowth);
    console.log(`Applied COST_GROWTH=${report.chosen.costGrowth} to selectors and simulator.`);
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

if (loop) {
  let round = 1;
  while (round <= maxRounds) {
    runRound(round);
    round += 1;
    if (round <= maxRounds) {
      await sleep(intervalMs);
    }
  }
} else {
  runRound();
}
