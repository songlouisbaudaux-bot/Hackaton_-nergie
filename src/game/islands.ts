import { ages, finalImagePath, purchases, technologies } from './data';
import { getAgeIndex } from './selectors';
import type { AgeId, PurchaseCounts, PurchaseId, SourceId, TechnologyId } from './types';

type IslandSlot = SourceId | 'central';

type IslandState = 'empty' | 'built' | 'upgraded';

export type IslandVisual = {
  id: string;
  slot: IslandSlot;
  label: string;
  sourceId?: SourceId;
  file: string;
  state: IslandState;
};

type SourceIslandStage = {
  purchaseId: PurchaseId;
  technologyId: TechnologyId;
  builtFile: string;
  upgradedFile: string;
};

const finalIslandFile = finalImagePath;

const centralFiles: Record<AgeId, string> = {
  biomass: finalIslandFile('central/island-central-01-camp.png'),
  'animal-power': finalIslandFile('central/island-central-02-village.png'),
  'water-wind': finalIslandFile('central/island-central-03-medieval-town.png'),
  fossil: finalIslandFile('central/island-central-04-industrial-town.png'),
  atomic: finalIslandFile('central/island-central-05-modern-grid-city.png'),
  fusion: finalIslandFile('atomic/island-atomic-07-built-fusion-plant.png'),
  'orbital-solar': 'Panneaux_solaires.png',
  'neutron-wells': finalIslandFile('cosmic/island-cosmic-08-neutron-wells.png'),
  antimatter: finalIslandFile('atomic/island-atomic-08-built-antimatter.png'),
  'black-hole': finalIslandFile('cosmic/island-cosmic-10-black-hole-siphon.png'),
  dyson: 'Dyson_sphere.png',
  vacuum: finalIslandFile('cosmic/island-cosmic-12-vacuum-universe-seed.png'),
};

const sourceBaseFiles: Record<SourceId, string> = {
  biomass: finalIslandFile('base/island-base-forest.png'),
  'animal-power': finalIslandFile('base/island-base-pasture.png'),
  'water-wind': finalIslandFile('base/island-base-river-hill.png'),
  fossil: finalIslandFile('base/island-base-rock.png'),
  atomic: finalIslandFile('base/island-base-tech-platform.png'),
  fusion: finalIslandFile('base/island-base-tech-platform.png'),
  'orbital-solar': finalIslandFile('base/island-base-tech-platform.png'),
  'neutron-wells': finalIslandFile('base/island-base-tech-platform.png'),
  antimatter: finalIslandFile('base/island-base-tech-platform.png'),
  'black-hole': finalIslandFile('base/island-base-rock.png'),
  dyson: finalIslandFile('base/island-base-tech-platform.png'),
  vacuum: finalIslandFile('base/island-base-tech-platform.png'),
};

const sourceStages: Record<SourceId, SourceIslandStage[]> = {
  biomass: [
    {
      purchaseId: 'campfire',
      technologyId: 'ember-keeping',
      builtFile: finalIslandFile('biomass/island-biomass-01-built-campfire.png'),
      upgradedFile: finalIslandFile('biomass/island-biomass-01-upgraded-ember-keeping.png'),
    },
    {
      purchaseId: 'stone-hearth',
      technologyId: 'masonry-hearth',
      builtFile: finalIslandFile('biomass/island-biomass-02-built-stone-hearth.png'),
      upgradedFile: finalIslandFile('biomass/island-biomass-02-upgraded-masonry-hearth.png'),
    },
    {
      purchaseId: 'charcoal-kiln',
      technologyId: 'charcoal-craft',
      builtFile: finalIslandFile('biomass/island-biomass-03-built-charcoal-kiln.png'),
      upgradedFile: finalIslandFile('biomass/island-biomass-03-upgraded-charcoal-craft.png'),
    },
    {
      purchaseId: 'wood-gasifier',
      technologyId: 'wood-gas-process',
      builtFile: finalIslandFile('biomass/island-biomass-04-built-wood-gasifier.png'),
      upgradedFile: finalIslandFile('biomass/island-biomass-04-upgraded-wood-gas-process.png'),
    },
    {
      purchaseId: 'biogas-digester',
      technologyId: 'biogas-process',
      builtFile: finalIslandFile('biomass/island-biomass-05-built-biogas-digester.png'),
      upgradedFile: finalIslandFile('biomass/island-biomass-05-upgraded-methanization.png'),
    },
  ],
  'animal-power': [
    {
      purchaseId: 'oxen',
      technologyId: 'animal-domestication',
      builtFile: finalIslandFile('animal/island-animal-02-built-oxen-pasture.png'),
      upgradedFile: finalIslandFile('animal/island-animal-02-upgraded-animal-domestication.png'),
    },
    {
      purchaseId: 'heavy-plough',
      technologyId: 'shoulder-collar',
      builtFile: finalIslandFile('animal/island-animal-03-built-heavy-plough.png'),
      upgradedFile: finalIslandFile('animal/island-animal-03-upgraded-shoulder-collar.png'),
    },
    {
      purchaseId: 'relay-stables',
      technologyId: 'horse-logistics',
      builtFile: finalIslandFile('animal/island-animal-04-built-horse-relay.png'),
      upgradedFile: finalIslandFile('animal/island-animal-04-upgraded-horse-logistics.png'),
    },
    {
      purchaseId: 'feed-logistics',
      technologyId: 'feed-chain',
      builtFile: finalIslandFile('animal/island-animal-05-built-food-logistics.png'),
      upgradedFile: finalIslandFile('animal/island-animal-05-upgraded-food-chain.png'),
    },
  ],
  'water-wind': [
    {
      purchaseId: 'watermill',
      technologyId: 'wind-gears',
      builtFile: finalIslandFile('water-wind/island-water-wind-03-built-watermill.png'),
      upgradedFile: finalIslandFile('water-wind/island-water-wind-03-upgraded-windmill.png'),
    },
    {
      purchaseId: 'wind-pump',
      technologyId: 'mechanical-pumps',
      builtFile: finalIslandFile('water-wind/island-water-wind-04-built-wind-pump.png'),
      upgradedFile: finalIslandFile('water-wind/island-water-wind-04-upgraded-mechanical-pumps.png'),
    },
    {
      purchaseId: 'hydro-wind-grid',
      technologyId: 'modern-wind-turbines',
      builtFile: finalIslandFile('water-wind/island-water-wind-05-built-hydro-wind-grid.png'),
      upgradedFile: finalIslandFile('water-wind/island-water-wind-05-upgraded-modern-wind-turbines.png'),
    },
  ],
  fossil: [
    {
      purchaseId: 'steam-engine',
      technologyId: 'high-pressure-steam',
      builtFile: finalIslandFile('fossil/island-fossil-04-built-steam-engine.png'),
      upgradedFile: finalIslandFile('fossil/island-fossil-04-upgraded-high-pressure-steam.png'),
    },
    {
      purchaseId: 'thermal-turbine',
      technologyId: 'thermal-cycle',
      builtFile: finalIslandFile('fossil/island-fossil-05-built-thermal-turbine.png'),
      upgradedFile: finalIslandFile('fossil/island-fossil-05-upgraded-thermal-cycle.png'),
    },
  ],
  atomic: [
    {
      purchaseId: 'reactor-core',
      technologyId: 'controlled-fission',
      builtFile: finalIslandFile('atomic/island-atomic-05-built-reactor-core.png'),
      upgradedFile: finalIslandFile('atomic/island-atomic-05-upgraded-controlled-fission.png'),
    },
  ],
  fusion: [
    {
      purchaseId: 'fusion-tokamak',
      technologyId: 'plasma-confinement',
      builtFile: finalIslandFile('atomic/island-atomic-07-built-fusion-plant.png'),
      upgradedFile: finalIslandFile('atomic/island-atomic-07-upgraded-controlled-fusion.png'),
    },
    {
      purchaseId: 'laser-fusion',
      technologyId: 'laser-compression',
      builtFile: 'Centrale_fusion.png',
      upgradedFile: finalIslandFile('atomic/island-atomic-07-upgraded-controlled-fusion.png'),
    },
  ],
  'orbital-solar': [
    {
      purchaseId: 'orbital-collector',
      technologyId: 'coherent-transmission',
      builtFile: 'Panneaux_solaires.png',
      upgradedFile: 'Panneaux_solaires.png',
    },
    {
      purchaseId: 'sps-alpha',
      technologyId: 'orbital-phase-lock',
      builtFile: 'Panneaux_solaires.png',
      upgradedFile: 'Panneaux_solaires.png',
    },
  ],
  'neutron-wells': [
    {
      purchaseId: 'pulsar-probe',
      technologyId: 'pulsar-mapping',
      builtFile: finalIslandFile('cosmic/island-cosmic-08-neutron-wells.png'),
      upgradedFile: finalIslandFile('cosmic/island-cosmic-08-neutron-wells.png'),
    },
    {
      purchaseId: 'neutron-mill',
      technologyId: 'neutron-orbits',
      builtFile: finalIslandFile('cosmic/island-cosmic-08-neutron-wells.png'),
      upgradedFile: finalIslandFile('cosmic/island-cosmic-08-neutron-wells.png'),
    },
  ],
  antimatter: [
    {
      purchaseId: 'antimatter-accelerator',
      technologyId: 'magnetic-bottles',
      builtFile: finalIslandFile('atomic/island-atomic-08-built-antimatter.png'),
      upgradedFile: finalIslandFile('atomic/island-atomic-08-upgraded-antimatter-containment.png'),
    },
    {
      purchaseId: 'annihilation-reactor',
      technologyId: 'controlled-annihilation',
      builtFile: 'Centrale_antimatière.png',
      upgradedFile: finalIslandFile('atomic/island-atomic-08-upgraded-antimatter-containment.png'),
    },
  ],
  'black-hole': [
    {
      purchaseId: 'ergosphere-probe',
      technologyId: 'kerr-measure',
      builtFile: finalIslandFile('cosmic/island-cosmic-10-black-hole-siphon.png'),
      upgradedFile: finalIslandFile('cosmic/island-cosmic-10-black-hole-siphon.png'),
    },
    {
      purchaseId: 'penrose-extractor',
      technologyId: 'penrose-stability',
      builtFile: finalIslandFile('cosmic/island-cosmic-10-black-hole-siphon.png'),
      upgradedFile: finalIslandFile('cosmic/island-cosmic-10-black-hole-siphon.png'),
    },
  ],
  dyson: [
    {
      purchaseId: 'dyson-segment',
      technologyId: 'dyson-swarm',
      builtFile: 'Dyson_sphere.png',
      upgradedFile: 'Dyson_sphere.png',
    },
    {
      purchaseId: 'energy-distribution',
      technologyId: 'stellar-governance',
      builtFile: 'Dyson_sphere.png',
      upgradedFile: 'Dyson_sphere.png',
    },
  ],
  vacuum: [
    {
      purchaseId: 'casimir-fluctuator',
      technologyId: 'casimir-geometry',
      builtFile: finalIslandFile('cosmic/island-cosmic-12-vacuum-universe-seed.png'),
      upgradedFile: finalIslandFile('cosmic/island-cosmic-12-vacuum-universe-seed.png'),
    },
    {
      purchaseId: 'universe-seed',
      technologyId: 'cosmic-reboot',
      builtFile: finalIslandFile('cosmic/island-cosmic-12-vacuum-universe-seed.png'),
      upgradedFile: finalIslandFile('cosmic/island-cosmic-12-vacuum-universe-seed.png'),
    },
  ],
};

function getPurchaseAgeIndex(purchaseId: PurchaseId) {
  const purchase = purchases.find((item) => item.id === purchaseId);
  return purchase ? getAgeIndex(purchase.ageId) : -1;
}

function getSourceAgeIndex(sourceId: SourceId) {
  const age = ages.find((item) => item.sourceId === sourceId);
  return age ? getAgeIndex(age.id) : -1;
}

export function getIslandVisuals(
  activeAgeId: AgeId,
  purchaseCounts: PurchaseCounts,
  researchedTechnologies: TechnologyId[],
): IslandVisual[] {
  const activeAgeIndex = getAgeIndex(activeAgeId);
  const researched = new Set(researchedTechnologies);
  const visuals: IslandVisual[] = [
    {
      id: `central-${activeAgeId}`,
      slot: 'central',
      label: 'Village',
      file: centralFiles[activeAgeId],
      state: 'built',
    },
  ];

  for (const sourceId of Object.keys(sourceBaseFiles) as SourceId[]) {
    if (getSourceAgeIndex(sourceId) > activeAgeIndex) continue;

    const visibleStages = sourceStages[sourceId].filter(
      (stage) => getPurchaseAgeIndex(stage.purchaseId) <= activeAgeIndex,
    );
    const builtStage = [...visibleStages]
      .reverse()
      .find((stage) => (purchaseCounts[stage.purchaseId] ?? 0) > 0);

    if (!builtStage) {
      visuals.push({
        id: `${sourceId}-empty`,
        slot: sourceId,
        sourceId,
        label: sourceId,
        file: sourceBaseFiles[sourceId],
        state: 'empty',
      });
      continue;
    }

    const upgraded = researched.has(builtStage.technologyId);
    const purchase = purchases.find((item) => item.id === builtStage.purchaseId);
    const technology = technologies.find((item) => item.id === builtStage.technologyId);

    visuals.push({
      id: `${sourceId}-${builtStage.purchaseId}-${upgraded ? 'upgraded' : 'built'}`,
      slot: sourceId,
      sourceId,
      label: upgraded ? (technology?.label ?? purchase?.label ?? sourceId) : (purchase?.label ?? sourceId),
      file: upgraded ? builtStage.upgradedFile : builtStage.builtFile,
      state: upgraded ? 'upgraded' : 'built',
    });
  }

  return visuals;
}
