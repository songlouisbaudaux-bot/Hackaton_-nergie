export type SourceId =
  | 'biomass'
  | 'animal-power'
  | 'water-wind'
  | 'fossil'
  | 'atomic'
  | 'fusion'
  | 'orbital-solar'
  | 'neutron-wells'
  | 'antimatter'
  | 'black-hole'
  | 'dyson'
  | 'vacuum';
export type AgeId = SourceId;

export type PurchaseId =
  | 'campfire'
  | 'stone-hearth'
  | 'oxen'
  | 'charcoal-kiln'
  | 'heavy-plough'
  | 'watermill'
  | 'wood-gasifier'
  | 'relay-stables'
  | 'wind-pump'
  | 'steam-engine'
  | 'biogas-digester'
  | 'feed-logistics'
  | 'hydro-wind-grid'
  | 'thermal-turbine'
  | 'reactor-core'
  | 'fusion-tokamak'
  | 'stellarator'
  | 'laser-fusion'
  | 'orbital-collector'
  | 'laser-relay'
  | 'sps-alpha'
  | 'pulsar-probe'
  | 'gravity-antenna'
  | 'neutron-mill'
  | 'antimatter-accelerator'
  | 'magnetic-trap'
  | 'annihilation-reactor'
  | 'ergosphere-probe'
  | 'gravity-anchor'
  | 'penrose-extractor'
  | 'dyson-segment'
  | 'space-foundry'
  | 'energy-distribution'
  | 'casimir-fluctuator'
  | 'vacuum-lattice'
  | 'universe-seed';

export type TechnologyId =
  | 'ember-keeping'
  | 'masonry-hearth'
  | 'animal-domestication'
  | 'charcoal-craft'
  | 'shoulder-collar'
  | 'wind-gears'
  | 'wood-gas-process'
  | 'horse-logistics'
  | 'mechanical-pumps'
  | 'high-pressure-steam'
  | 'biogas-process'
  | 'feed-chain'
  | 'modern-wind-turbines'
  | 'thermal-cycle'
  | 'controlled-fission'
  | 'plasma-confinement'
  | 'laser-compression'
  | 'coherent-transmission'
  | 'orbital-phase-lock'
  | 'pulsar-mapping'
  | 'neutron-orbits'
  | 'magnetic-bottles'
  | 'controlled-annihilation'
  | 'kerr-measure'
  | 'penrose-stability'
  | 'dyson-swarm'
  | 'stellar-governance'
  | 'casimir-geometry'
  | 'cosmic-reboot';

export type EnergySource = {
  id: SourceId;
  ageId: AgeId;
  label: string;
  shortLabel: string;
  color: string;
  clickContribution: number;
  passiveContribution: number;
};

export type Purchase = {
  id: PurchaseId;
  ageId: AgeId;
  label: string;
  sourceId: SourceId;
  description: string;
  costJoules: number;
  clickGain: number;
  passiveGain: number;
  assetFile?: string;
  impactLabel: string;
};

export type Technology = {
  id: TechnologyId;
  ageId: AgeId;
  label: string;
  sourceId: SourceId;
  targetPurchaseId: PurchaseId;
  costJoules: number;
  clickGain: number;
  passiveGain: number;
  assetFile?: string;
  impactLabel: string;
};

export type PurchaseCounts = Partial<Record<PurchaseId, number>>;

export type Age = {
  id: AgeId;
  label: string;
  sourceId: SourceId;
  advanceCostJoules?: number;
  description: string;
};

export type SourceProduction = EnergySource & {
  clickJoules: number;
  passiveJoules: number;
  mixWeight: number;
  share: number;
};

export type CurrentObjectiveKind = 'purchase' | 'technology' | 'advance' | 'ending';

export type CurrentObjective = {
  kind: CurrentObjectiveKind;
  kicker: string;
  label: string;
  detail: string;
  progress: number;
  ready: boolean;
  costJoules?: number;
};

export type BreakthroughTrigger =
  | {
      type: 'purchase';
      id: PurchaseId;
    }
  | {
      type: 'technology';
      id: TechnologyId;
    }
  | {
      type: 'age';
      id: AgeId;
    };

export type BreakthroughMilestone = {
  id: string;
  trigger: BreakthroughTrigger;
  kicker: string;
  title: string;
  detail: string;
  tone: 'steam' | 'atomic' | 'stellar' | 'cosmic';
};
