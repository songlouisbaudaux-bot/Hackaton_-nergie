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

const TARGET_MINUTES = 121;
const TARGET_SECONDS = TARGET_MINUTES * 60;
const MANUAL_CLICK_COOLDOWN_MS = 500;
const MANUAL_CLICK_CAP_RATE = 1000 / MANUAL_CLICK_COOLDOWN_MS;
const TECHNOLOGY_BUILDING_BOOST_FACTOR = 0.35;
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
  {
    id: 'spamCapped',
    label: 'Spam plafonné par anti-spam',
    clickRatePerSecond: MANUAL_CLICK_CAP_RATE,
    repeatPaybackSeconds: 600,
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

function getScaledCost(baseCostJoules, count, costGrowth) {
  return Math.ceil(baseCostJoules * costGrowth ** count);
}

function formatMinutes(seconds) {
  return Number((seconds / 60).toFixed(2));
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
    minute: formatMinutes(state.seconds),
    ...event,
    breakthrough: isNewBreakthrough
      ? {
          id: breakthrough.id,
          title: breakthrough.title,
          tone: breakthrough.tone,
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

    const targetCount = state.counts.get(technology.targetPurchaseId) ?? 0;
    click += technology.clickGain * targetCount * TECHNOLOGY_BUILDING_BOOST_FACTOR;
    passive += technology.passiveGain * targetCount * TECHNOLOGY_BUILDING_BOOST_FACTOR;
  }

  return {
    click,
    passive,
    rate: passive + click * state.profile.clickRatePerSecond,
  };
}

function getResearchedBoostForPurchase(state, purchaseId) {
  return technologies
    .filter((technology) => technology.targetPurchaseId === purchaseId)
    .filter((technology) => state.researched.has(technology.id))
    .reduce(
      (total, technology) => ({
        clickGain: total.clickGain + technology.clickGain * TECHNOLOGY_BUILDING_BOOST_FACTOR,
        passiveGain: total.passiveGain + technology.passiveGain * TECHNOLOGY_BUILDING_BOOST_FACTOR,
      }),
      { clickGain: 0, passiveGain: 0 },
    );
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
  recordEvent(state, {
    type: 'purchase',
    id: purchase.id,
    ageId: purchase.ageId,
    label: purchase.label,
    cost,
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
    cost: technology.costJoules,
  });
}

function getRepeatCandidate(state, ageId, maxPaybackSeconds, costGrowth) {
  if (!Number.isFinite(maxPaybackSeconds)) return undefined;

  return purchases
    .filter((purchase) => purchase.ageId === ageId)
    .map((purchase) => {
      const count = state.counts.get(purchase.id) ?? 0;
      const cost = getScaledCost(purchase.costJoules, count, costGrowth);
      const technologyBoost = getResearchedBoostForPurchase(state, purchase.id);
      const gainPerSecond =
        purchase.passiveGain +
        technologyBoost.passiveGain +
        (purchase.clickGain + technologyBoost.clickGain) * state.profile.clickRatePerSecond;

      return {
        purchase,
        cost,
        paybackSeconds: cost / Math.max(gainPerSecond, 0.0001),
      };
    })
    .filter((candidate) => candidate.paybackSeconds <= maxPaybackSeconds)
    .sort((a, b) => a.paybackSeconds - b.paybackSeconds)[0];
}

function simulate(costGrowth, profile) {
  const state = createState(profile);
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
      const repeatCandidate = getRepeatCandidate(state, age.id, profile.repeatPaybackSeconds, costGrowth);

      if (repeatCandidate && repeatCandidate.cost < advanceCost) {
        buyPurchase(state, repeatCandidate.purchase, costGrowth);
        continue;
      }

      waitForEnergy(state, advanceCost);
      state.energy -= advanceCost;
      recordEvent(state, {
        type: 'age',
        id: nextAge.id,
        ageId: nextAge.id,
        label: nextAge.label,
        cost: advanceCost,
      });
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
    events: state.events,
    breakthroughEvents: state.events.filter((event) => event.breakthrough),
  };
}

function evaluate(costGrowth) {
  const profileRuns = Object.fromEntries(
    PLAYER_PROFILES.map((profile) => [profile.id, simulate(costGrowth, profile)]),
  );
  const runValues = Object.values(profileRuns);
  const shortestSeconds = Math.min(...runValues.map((run) => run.totalSeconds));
  const slowestSeconds = Math.max(...runValues.map((run) => run.totalSeconds));
  const underTargetPenalty = Math.max(0, TARGET_SECONDS - shortestSeconds) * 10;
  const overTargetPenalty = Math.max(0, shortestSeconds - TARGET_SECONDS);
  const slowProfilePenalty = Math.max(0, slowestSeconds - 210 * 60) * 0.35;
  const earlyPenalty = Math.max(0, profileRuns.requiredOnly.rows[0].ageMinutes - 1.2) * 180;
  const agePacingPenalty = runValues.reduce((sum, run) => {
    return (
      sum +
      diagnoseRun(run).reduce((runSum, row) => {
        if (row.status === 'too-slow') return runSum + 240;
        if (row.status === 'too-fast') return runSum + 120;
        if (row.status === 'watch') return runSum + 12;

        return runSum;
      }, 0)
    );
  }, 0);
  const flowPenalty = runValues.reduce((sum, run) => {
    return (
      sum +
      diagnoseFlow(run).gaps.reduce((runSum, gap) => {
        if (gap.status === 'too-long') return runSum + 480;
        if (gap.status === 'watch') return runSum + 90;

        return runSum;
      }, 0)
    );
  }, 0);

  return {
    costGrowth: Number(costGrowth.toFixed(3)),
    shortestMinutes: formatMinutes(shortestSeconds),
    slowestMinutes: formatMinutes(slowestSeconds),
    profileRuns,
    requiredOnly: profileRuns.requiredOnly,
    aggressiveRepeat: profileRuns.aggressiveRepeat,
    lowClickSteady: profileRuns.lowClickSteady,
    spamCapped: profileRuns.spamCapped,
    score:
      underTargetPenalty +
      overTargetPenalty +
      slowProfilePenalty +
      earlyPenalty +
      agePacingPenalty +
      flowPenalty,
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

function diagnoseFlow(run) {
  const events = run.breakthroughEvents;
  const points = [
    {
      minute: 0,
      label: 'Debut',
    },
    ...events.map((event) => ({
      minute: event.minute,
      label: event.breakthrough.title,
      id: event.breakthrough.id,
    })),
    {
      minute: run.totalMinutes,
      label: 'Fin',
    },
  ];
  const gaps = [];

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const gapMinutes = Number((current.minute - previous.minute).toFixed(2));
    gaps.push({
      from: previous.id ?? previous.label,
      to: current.id ?? current.label,
      gapMinutes,
      status: gapMinutes > 24 ? 'too-long' : gapMinutes > 16 ? 'watch' : 'ok',
    });
  }

  const maxGap = gaps.slice().sort((a, b) => b.gapMinutes - a.gapMinutes)[0];

  return {
    breakthroughCount: events.length,
    breakthroughTimeline: events.map((event) => ({
      id: event.breakthrough.id,
      title: event.breakthrough.title,
      minute: event.minute,
      trigger: {
        type: event.type,
        id: event.id,
      },
    })),
    gaps,
    maxGap,
    recommendation:
      maxGap && maxGap.status !== 'ok'
        ? `Ajouter un micro-objectif entre ${maxGap.from} et ${maxGap.to}.`
        : 'Les moments forts couvrent correctement le run.',
  };
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

  for (let growth = 1.18; growth <= 12.01; growth += 0.02) {
    candidates.push(evaluate(growth));
  }

  const viable = candidates.filter((candidate) => candidate.shortestMinutes >= TARGET_MINUTES);
  const best = (viable.length ? viable : candidates)
    .sort((a, b) => a.score - b.score || a.costGrowth - b.costGrowth)[0];

  return {
    targetMinutes: TARGET_MINUTES,
    playerProfiles: PLAYER_PROFILES,
    breakthroughs: breakthroughMilestones.map((milestone) => ({
      id: milestone.id,
      trigger: milestone.trigger,
      title: milestone.title,
    })),
    chosen: best,
    profileSummary: PLAYER_PROFILES.map((profile) => ({
      profile: profile.id,
      label: profile.label,
      clickRatePerSecond: profile.clickRatePerSecond,
      repeatPaybackSeconds: profile.repeatPaybackSeconds,
      totalMinutes: best.profileRuns[profile.id].totalMinutes,
    })),
    diagnostics: Object.fromEntries(
      PLAYER_PROFILES.map((profile) => [profile.id, diagnoseRun(best.profileRuns[profile.id])]),
    ),
    flowDiagnostics: Object.fromEntries(
      PLAYER_PROFILES.map((profile) => [profile.id, diagnoseFlow(best.profileRuns[profile.id])]),
    ),
    topCandidates: candidates
      .slice()
      .sort((a, b) => a.score - b.score)
      .slice(0, 10)
      .map((candidate) => ({
        costGrowth: candidate.costGrowth,
        shortestMinutes: candidate.shortestMinutes,
        slowestMinutes: candidate.slowestMinutes,
        requiredOnlyMinutes: candidate.requiredOnly.totalMinutes,
        aggressiveRepeatMinutes: candidate.aggressiveRepeat.totalMinutes,
        lowClickSteadyMinutes: candidate.lowClickSteady.totalMinutes,
        spamCappedMinutes: candidate.spamCapped.totalMinutes,
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
  console.log('\nProfile summary');
  console.table(report.profileSummary);
  console.log(`Report written to ${path.relative(repoRoot, reportFile)}.`);

  const warnings = Object.entries(report.diagnostics).flatMap(([profileId, rows]) =>
    rows
      .filter((row) => row.status !== 'ok')
      .map((row) => ({
        profile: profileId,
        ...row,
      })),
  );
  if (warnings.length) {
    console.log('\nPacing diagnostics');
    console.table(warnings);
  }

  const flowWarnings = Object.entries(report.flowDiagnostics).flatMap(([profileId, flow]) =>
    flow.gaps
      .filter((gap) => gap.status !== 'ok')
      .map((gap) => ({
        profile: profileId,
        ...gap,
      })),
  );
  if (flowWarnings.length) {
    console.log('\nBreakthrough gaps');
    console.table(flowWarnings);
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
