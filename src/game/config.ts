export type SourceId = 'human-food' | 'wood-fire';
export type GameActionId = 'burn-wood' | 'organize-collection';

export type TechnologyId =
  | 'protect-ember'
  | 'stable-hearth'
  | 'organized-collection'
  | 'fire-circle'
  | 'first-surplus';

export type GamePhaseId = 'spark' | 'stable-fire' | 'wood-tribe' | 'agriculture';

export type EnergySource = {
  id: SourceId;
  label: string;
  shortLabel: string;
  color: string;
  clickContribution: number;
  passiveContribution: number;
};

export type GameAction = {
  id: GameActionId;
  label: string;
  description: string;
  costJoules: number;
  immediateJoules: number;
  passiveDelta: number;
  sourceMixDelta: Partial<Record<SourceId, number>>;
  cooldownMs?: number;
  durationMs?: number;
  impactLabel: string;
};

export type Technology = {
  id: TechnologyId;
  label: string;
  sourceId: SourceId;
  costJoules: number;
  clickGain: number;
  passiveGain: number;
  unlockAtJoules: number;
  impactLabel: string;
};

export type GamePhase = {
  id: GamePhaseId;
  label: string;
  thresholdJoules: number;
};

export type ActionCounts = Partial<Record<GameActionId, number>>;

export type MixBoost = {
  sourceMixDelta: Partial<Record<SourceId, number>>;
};

export type SourceProduction = EnergySource & {
  clickJoules: number;
  passiveJoules: number;
  mixWeight: number;
  share: number;
};

export const assetPath = (fileName: string) => `/assets/game/${fileName}`;

export const energySources: EnergySource[] = [
  {
    id: 'human-food',
    label: 'Énergie humaine / nourriture',
    shortLabel: 'Humain',
    color: '#2f8d64',
    clickContribution: 1,
    passiveContribution: 0,
  },
  {
    id: 'wood-fire',
    label: 'Bois / feu',
    shortLabel: 'Feu',
    color: '#ed8a21',
    clickContribution: 2,
    passiveContribution: 0,
  },
];

export const gameActions: GameAction[] = [
  {
    id: 'burn-wood',
    label: 'Brûler plus de bois',
    description: 'Rendement immédiat, pression plus forte sur le foyer.',
    costJoules: 12,
    immediateJoules: 28,
    passiveDelta: 0,
    sourceMixDelta: { 'wood-fire': 3.4, 'human-food': -0.2 },
    cooldownMs: 1400,
    durationMs: 8200,
    impactLabel: '+16 J net · mix feu renforcé',
  },
  {
    id: 'organize-collection',
    label: 'Organiser la collecte',
    description: 'Moins spectaculaire, mais le système devient plus régulier.',
    costJoules: 18,
    immediateJoules: 8,
    passiveDelta: 0.12,
    sourceMixDelta: { 'human-food': 0.7, 'wood-fire': 0.35 },
    cooldownMs: 2200,
    durationMs: 0,
    impactLabel: '-10 J net · +0.12 J/s durable',
  },
];

export const technologies: Technology[] = [
  {
    id: 'protect-ember',
    label: 'Protéger la braise',
    sourceId: 'wood-fire',
    costJoules: 18,
    clickGain: 1,
    passiveGain: 0,
    unlockAtJoules: 0,
    impactLabel: 'Le clic transforme mieux l’effort en chaleur utile.',
  },
  {
    id: 'stable-hearth',
    label: 'Foyer stable',
    sourceId: 'wood-fire',
    costJoules: 72,
    clickGain: 1,
    passiveGain: 0.35,
    unlockAtJoules: 45,
    impactLabel: 'Le feu tient un peu sans intervention constante.',
  },
  {
    id: 'organized-collection',
    label: 'Collecte coordonnée',
    sourceId: 'human-food',
    costJoules: 135,
    clickGain: 1,
    passiveGain: 0.45,
    unlockAtJoules: 95,
    impactLabel: 'L’effort humain devient une routine énergétique.',
  },
  {
    id: 'fire-circle',
    label: 'Groupe autour du feu',
    sourceId: 'human-food',
    costJoules: 260,
    clickGain: 2,
    passiveGain: 0.75,
    unlockAtJoules: 175,
    impactLabel: 'La chaleur rassemble, le groupe produit mieux.',
  },
  {
    id: 'first-surplus',
    label: 'Premiers surplus',
    sourceId: 'human-food',
    costJoules: 430,
    clickGain: 2,
    passiveGain: 1.1,
    unlockAtJoules: 310,
    impactLabel: 'Prépare le passage vers nourriture, champ et stockage.',
  },
];

export const gamePhases: GamePhase[] = [
  { id: 'spark', label: 'Étincelle', thresholdJoules: 0 },
  { id: 'stable-fire', label: 'Feu stable', thresholdJoules: 70 },
  { id: 'wood-tribe', label: 'Bois / tribu', thresholdJoules: 180 },
  { id: 'agriculture', label: 'Agriculture', thresholdJoules: 420 },
];

export function getTechnologyById(id: TechnologyId) {
  return technologies.find((technology) => technology.id === id);
}

export function getActionById(id: GameActionId) {
  return gameActions.find((action) => action.id === id);
}

export function getVisibleTechnologies(
  purchasedIds: TechnologyId[],
  peakEnergyJoules: number,
  limit = 3,
) {
  const purchased = new Set(purchasedIds);
  return technologies
    .filter((technology) => !purchased.has(technology.id))
    .sort((a, b) => a.unlockAtJoules - b.unlockAtJoules)
    .slice(0, limit)
    .map((technology) => ({
      ...technology,
      unlocked: peakEnergyJoules >= technology.unlockAtJoules,
    }));
}

export function getCurrentPhase(peakEnergyJoules: number) {
  return gamePhases.reduce((current, phase) => {
    return peakEnergyJoules >= phase.thresholdJoules ? phase : current;
  }, gamePhases[0]);
}

export function getProduction(
  purchasedIds: TechnologyId[],
  actionCounts: ActionCounts,
  activeMixBoosts: MixBoost[] = [],
): SourceProduction[] {
  const purchased = new Set(purchasedIds);
  const rows = energySources.map((source) => ({
    ...source,
    clickJoules: source.clickContribution,
    passiveJoules: source.passiveContribution,
    mixWeight: source.clickContribution + source.passiveContribution,
    share: 0,
  }));

  const bumpSource = (sourceId: SourceId, clickDelta = 0, passiveDelta = 0, mixDelta = 0) => {
    const row = rows.find((source) => source.id === sourceId);
    if (!row) return;

    row.clickJoules = Math.max(0, row.clickJoules + clickDelta);
    row.passiveJoules = Math.max(0, row.passiveJoules + passiveDelta);
    row.mixWeight = Math.max(0.1, row.mixWeight + clickDelta + passiveDelta + mixDelta);
  };

  for (const technology of technologies) {
    if (!purchased.has(technology.id)) continue;
    bumpSource(technology.sourceId, technology.clickGain, technology.passiveGain);
  }

  for (const action of gameActions) {
    const count = actionCounts[action.id] ?? 0;
    if (count <= 0) continue;

    bumpSource(action.id === 'organize-collection' ? 'human-food' : 'wood-fire', 0, action.passiveDelta * count);
    if (!action.durationMs) {
      for (const [sourceId, mixDelta] of Object.entries(action.sourceMixDelta)) {
        bumpSource(sourceId as SourceId, 0, 0, mixDelta * count * 0.28);
      }
    }
  }

  for (const boost of activeMixBoosts) {
    for (const [sourceId, mixDelta] of Object.entries(boost.sourceMixDelta)) {
      bumpSource(sourceId as SourceId, 0, 0, mixDelta);
    }
  }

  const totalWeight = rows.reduce((sum, row) => sum + row.mixWeight, 0);

  return rows.map((row) => ({
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

export function formatJoules(value: number) {
  if (value < 1000) return `${Math.floor(value)} J`;
  return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)} kJ`;
}

export function formatSignedJoules(value: number) {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${formatJoules(value)}`;
}

export function formatRate(value: number) {
  if (value === 0) return '0 J/s';
  if (value < 10) return `${value.toFixed(1)} J/s`;
  return `${Math.round(value)} J/s`;
}

export function formatUnitExtension(valueInJoules: number) {
  const wattHours = valueInJoules / 3600;
  const kiloWattHours = wattHours / 1000;

  return {
    joules: valueInJoules,
    wattHours,
    kiloWattHours,
  };
}
