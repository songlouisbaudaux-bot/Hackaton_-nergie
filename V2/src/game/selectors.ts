import { ages, energySources, purchases, technologies } from './data';
import { formatRate } from './formatters';
import type {
  AgeId,
  CurrentObjective,
  Purchase,
  PurchaseCounts,
  PurchaseId,
  SourceProduction,
  Technology,
  TechnologyId,
} from './types';

const COST_GROWTH = 5.6;
const TECHNOLOGY_BUILDING_BOOST_FACTOR = 0.35;

export type VisiblePurchase = Purchase & {
  affordable: boolean;
  count: number;
  nextCostJoules: number;
};

export type VisibleTechnology = Technology & {
  affordable: boolean;
  available: boolean;
  boostedClickGain: number;
  boostedPassiveGain: number;
  targetCount: number;
  targetLabel: string;
  researched: boolean;
};

function getTechnologyBuildingBoost(technology: Technology, targetCount: number) {
  const effectiveCount = Math.max(0, targetCount);

  return {
    clickGain: technology.clickGain * effectiveCount * TECHNOLOGY_BUILDING_BOOST_FACTOR,
    passiveGain: technology.passiveGain * effectiveCount * TECHNOLOGY_BUILDING_BOOST_FACTOR,
  };
}

function formatTechnologyValue(value: number) {
  if (value === 0) return '0';
  if (Math.abs(value) < 10) return Number(value.toFixed(1)).toLocaleString('fr-FR');
  if (Math.abs(value) < 1000000) return Math.round(value).toLocaleString('fr-FR');

  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 1,
    notation: 'compact',
  }).format(value);
}

function getTechnologyImpactLabel(
  technology: Technology,
  targetCount: number,
  targetLabel: string,
) {
  const perBuildingClickGain = technology.clickGain * TECHNOLOGY_BUILDING_BOOST_FACTOR;
  const perBuildingPassiveGain = technology.passiveGain * TECHNOLOGY_BUILDING_BOOST_FACTOR;
  const pieces = [];

  if (perBuildingClickGain > 0) {
    pieces.push(`+${formatTechnologyValue(perBuildingClickGain)} J/clic`);
  }

  if (perBuildingPassiveGain > 0) {
    pieces.push(`+${formatRate(perBuildingPassiveGain)}`);
  }

  const countLabel = targetCount > 1 ? ` · x${targetCount}` : '';

  return `${pieces.join(' · ')} / ${targetLabel}${countLabel}`;
}

export function getPurchaseById(id: PurchaseId) {
  return purchases.find((purchase) => purchase.id === id);
}

export function getAgeById(id: AgeId) {
  return ages.find((age) => age.id === id) ?? ages[0];
}

export function getAgeIndex(ageId: AgeId) {
  return ages.findIndex((age) => age.id === ageId);
}

export function getNextAge(ageId: AgeId) {
  const nextIndex = getAgeIndex(ageId) + 1;
  return ages[nextIndex];
}

export function getScaledCost(baseCostJoules: number, count: number) {
  return Math.ceil(baseCostJoules * COST_GROWTH ** count);
}

export function getAgePurchases(
  ageId: AgeId,
  purchaseCounts: PurchaseCounts,
  currentEnergyJoules: number,
): VisiblePurchase[] {
  return purchases
    .filter((purchase) => purchase.ageId === ageId)
    .map((purchase) => {
      const count = purchaseCounts[purchase.id] ?? 0;
      const nextCostJoules = getScaledCost(purchase.costJoules, count);

      return {
        ...purchase,
        count,
        nextCostJoules,
        affordable: currentEnergyJoules >= nextCostJoules,
      };
    });
}

export function getAgeTechnologies(
  ageId: AgeId,
  purchaseCounts: PurchaseCounts,
  researchedIds: TechnologyId[],
  currentEnergyJoules: number,
): VisibleTechnology[] {
  const researched = new Set(researchedIds);

  return technologies
    .filter((technology) => technology.ageId === ageId)
    .map((technology) => {
      const targetCount = purchaseCounts[technology.targetPurchaseId] ?? 0;
      const targetLabel = getPurchaseById(technology.targetPurchaseId)?.label ?? 'Objet';
      const boost = getTechnologyBuildingBoost(technology, targetCount);

      return {
        ...technology,
        boostedClickGain: boost.clickGain,
        boostedPassiveGain: boost.passiveGain,
        impactLabel: getTechnologyImpactLabel(technology, targetCount, targetLabel),
        targetCount,
        targetLabel,
        available: targetCount > 0,
        researched: researched.has(technology.id),
        affordable: currentEnergyJoules >= technology.costJoules,
      };
    });
}

export function isAgeComplete(
  ageId: AgeId,
  purchaseCounts: PurchaseCounts,
  researchedIds: TechnologyId[],
) {
  const agePurchases = purchases.filter((purchase) => purchase.ageId === ageId);
  const ageTechnologies = technologies.filter((technology) => technology.ageId === ageId);
  const researched = new Set(researchedIds);
  const hasEveryObject = agePurchases.every((purchase) => (purchaseCounts[purchase.id] ?? 0) > 0);
  const hasEveryTechnology = ageTechnologies.every((technology) => researched.has(technology.id));

  return hasEveryObject && hasEveryTechnology;
}

export function getAdvanceState(
  ageId: AgeId,
  purchaseCounts: PurchaseCounts,
  researchedIds: TechnologyId[],
  currentEnergyJoules: number,
) {
  const currentAge = getAgeById(ageId);
  const nextAge = getNextAge(ageId);
  const complete = isAgeComplete(ageId, purchaseCounts, researchedIds);
  const cost = currentAge.advanceCostJoules ?? 0;

  return {
    nextAge,
    complete,
    cost,
    affordable: currentEnergyJoules >= cost,
    canAdvance: Boolean(nextAge && complete && currentEnergyJoules >= cost),
  };
}

function getProgress(currentEnergyJoules: number, costJoules: number) {
  if (costJoules <= 0) return 1;

  return Math.min(1, Math.max(0, currentEnergyJoules / costJoules));
}

export function getCurrentObjective(
  ageId: AgeId,
  purchaseCounts: PurchaseCounts,
  researchedIds: TechnologyId[],
  currentEnergyJoules: number,
): CurrentObjective {
  const currentAge = getAgeById(ageId);
  const researched = new Set(researchedIds);
  const agePurchases = purchases.filter((purchase) => purchase.ageId === ageId);
  const missingPurchase = agePurchases.find((purchase) => (purchaseCounts[purchase.id] ?? 0) <= 0);

  if (missingPurchase) {
    const count = purchaseCounts[missingPurchase.id] ?? 0;
    const costJoules = getScaledCost(missingPurchase.costJoules, count);

    return {
      kind: 'purchase',
      kicker: currentAge.label,
      label: missingPurchase.label,
      detail: missingPurchase.impactLabel,
      progress: getProgress(currentEnergyJoules, costJoules),
      ready: currentEnergyJoules >= costJoules,
      costJoules,
    };
  }

  const ageTechnologies = technologies.filter((technology) => technology.ageId === ageId);
  const missingTechnology = ageTechnologies.find((technology) => {
    return !researched.has(technology.id) && (purchaseCounts[technology.targetPurchaseId] ?? 0) > 0;
  });

  if (missingTechnology) {
    const targetCount = purchaseCounts[missingTechnology.targetPurchaseId] ?? 0;
    const targetLabel = getPurchaseById(missingTechnology.targetPurchaseId)?.label ?? 'Objet';

    return {
      kind: 'technology',
      kicker: 'Technologie',
      label: missingTechnology.label,
      detail: getTechnologyImpactLabel(missingTechnology, targetCount, targetLabel),
      progress: getProgress(currentEnergyJoules, missingTechnology.costJoules),
      ready: currentEnergyJoules >= missingTechnology.costJoules,
      costJoules: missingTechnology.costJoules,
    };
  }

  const advanceState = getAdvanceState(ageId, purchaseCounts, researchedIds, currentEnergyJoules);

  if (advanceState.nextAge) {
    return {
      kind: 'advance',
      kicker: 'Transition',
      label: advanceState.nextAge.label,
      detail: advanceState.nextAge.description,
      progress: getProgress(currentEnergyJoules, advanceState.cost),
      ready: advanceState.canAdvance,
      costJoules: advanceState.cost,
    };
  }

  return {
    kind: 'ending',
    kicker: 'Fin',
    label: 'Univers stabilise',
    detail: 'Le vide devient une source exploitable.',
    progress: 1,
    ready: true,
  };
}

export function getProduction(
  purchaseCounts: PurchaseCounts,
  researchedIds: TechnologyId[],
): SourceProduction[] {
  const researched = new Set(researchedIds);
  const rows = energySources.map((source) => ({
    ...source,
    clickJoules: source.clickContribution,
    passiveJoules: source.passiveContribution,
    mixWeight: source.clickContribution + source.passiveContribution,
    share: 0,
  }));

  const bumpSource = (sourceId: SourceProduction['id'], clickDelta = 0, passiveDelta = 0) => {
    const row = rows.find((source) => source.id === sourceId);
    if (!row) return;

    row.clickJoules = Math.max(0, row.clickJoules + clickDelta);
    row.passiveJoules = Math.max(0, row.passiveJoules + passiveDelta);
    row.mixWeight = Math.max(0, row.clickJoules + row.passiveJoules);
  };

  for (const purchase of purchases) {
    const count = purchaseCounts[purchase.id] ?? 0;
    if (count <= 0) continue;
    bumpSource(purchase.sourceId, purchase.clickGain * count, purchase.passiveGain * count);
  }

  for (const technology of technologies) {
    if (!researched.has(technology.id)) continue;

    const targetCount = purchaseCounts[technology.targetPurchaseId] ?? 0;
    const boost = getTechnologyBuildingBoost(technology, targetCount);
    bumpSource(technology.sourceId, boost.clickGain, boost.passiveGain);
  }

  const visibleRows = rows.filter((row) => row.clickJoules > 0 || row.passiveJoules > 0);
  const totalWeight = visibleRows.reduce((sum, row) => sum + row.mixWeight, 0);

  return visibleRows.map((row) => ({
    ...row,
    share: totalWeight > 0 ? row.mixWeight / totalWeight : 0,
  }));
}

export function getTotals(sourceProduction: SourceProduction[]) {
  return sourceProduction.reduce(
    (totals, source) => ({
      energyPerClick: totals.energyPerClick + source.clickJoules,
      energyPerSecond: totals.energyPerSecond + source.passiveJoules,
    }),
    { energyPerClick: 0, energyPerSecond: 0 },
  );
}
