import { ages, energySources, purchases, technologies } from './data';
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

const COST_GROWTH = 3.02;

export type VisiblePurchase = Purchase & {
  affordable: boolean;
  count: number;
  nextCostJoules: number;
};

export type VisibleTechnology = Technology & {
  affordable: boolean;
  available: boolean;
  targetCount: number;
  targetLabel: string;
  researched: boolean;
};

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

      return {
        ...technology,
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
    return {
      kind: 'technology',
      kicker: 'Technologie',
      label: missingTechnology.label,
      detail: missingTechnology.impactLabel,
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
    bumpSource(technology.sourceId, technology.clickGain, technology.passiveGain);
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
