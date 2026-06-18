import { ages, purchases, technologies } from './data';
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

const centralFiles: Record<AgeId, string> = {
  biomass: 'islands/central/island-central-01-camp.png',
  'animal-power': 'islands/central/island-central-02-village.png',
  'water-wind': 'islands/central/island-central-03-medieval-town.png',
  fossil: 'islands/central/island-central-04-industrial-town.png',
  atomic: 'islands/central/island-central-05-modern-grid-city.png',
};

const sourceBaseFiles: Record<SourceId, string> = {
  biomass: 'islands/base/island-base-forest.png',
  'animal-power': 'islands/base/island-base-pasture.png',
  'water-wind': 'islands/base/island-base-river-hill.png',
  fossil: 'islands/base/island-base-rock.png',
  atomic: 'islands/base/island-base-tech-platform.png',
};

const sourceStages: Record<SourceId, SourceIslandStage[]> = {
  biomass: [
    {
      purchaseId: 'campfire',
      technologyId: 'ember-keeping',
      builtFile: 'islands/biomass/island-biomass-01-built-campfire.png',
      upgradedFile: 'islands/biomass/island-biomass-01-upgraded-ember-keeping.png',
    },
    {
      purchaseId: 'stone-hearth',
      technologyId: 'masonry-hearth',
      builtFile: 'islands/biomass/island-biomass-02-built-stone-hearth.png',
      upgradedFile: 'islands/biomass/island-biomass-02-upgraded-masonry-hearth.png',
    },
    {
      purchaseId: 'charcoal-kiln',
      technologyId: 'charcoal-craft',
      builtFile: 'islands/biomass/island-biomass-03-built-charcoal-kiln.png',
      upgradedFile: 'islands/biomass/island-biomass-03-upgraded-charcoal-craft.png',
    },
    {
      purchaseId: 'wood-gasifier',
      technologyId: 'wood-gas-process',
      builtFile: 'islands/biomass/island-biomass-04-built-wood-gasifier.png',
      upgradedFile: 'islands/biomass/island-biomass-04-upgraded-wood-gas-process.png',
    },
    {
      purchaseId: 'biogas-digester',
      technologyId: 'biogas-process',
      builtFile: 'islands/biomass/island-biomass-05-built-biogas-digester.png',
      upgradedFile: 'islands/biomass/island-biomass-05-upgraded-methanization.png',
    },
  ],
  'animal-power': [
    {
      purchaseId: 'oxen',
      technologyId: 'animal-domestication',
      builtFile: 'islands/animal/island-animal-02-built-oxen-pasture.png',
      upgradedFile: 'islands/animal/island-animal-02-upgraded-animal-domestication.png',
    },
    {
      purchaseId: 'heavy-plough',
      technologyId: 'shoulder-collar',
      builtFile: 'islands/animal/island-animal-03-built-heavy-plough.png',
      upgradedFile: 'islands/animal/island-animal-03-upgraded-shoulder-collar.png',
    },
    {
      purchaseId: 'relay-stables',
      technologyId: 'horse-logistics',
      builtFile: 'islands/animal/island-animal-04-built-horse-relay.png',
      upgradedFile: 'islands/animal/island-animal-04-upgraded-horse-logistics.png',
    },
    {
      purchaseId: 'feed-logistics',
      technologyId: 'feed-chain',
      builtFile: 'islands/animal/island-animal-05-built-food-logistics.png',
      upgradedFile: 'islands/animal/island-animal-05-upgraded-food-chain.png',
    },
  ],
  'water-wind': [
    {
      purchaseId: 'watermill',
      technologyId: 'wind-gears',
      builtFile: 'islands/water-wind/island-water-wind-03-built-watermill.png',
      upgradedFile: 'islands/water-wind/island-water-wind-03-upgraded-windmill.png',
    },
    {
      purchaseId: 'wind-pump',
      technologyId: 'mechanical-pumps',
      builtFile: 'islands/water-wind/island-water-wind-04-built-wind-pump.png',
      upgradedFile: 'islands/water-wind/island-water-wind-04-upgraded-mechanical-pumps.png',
    },
    {
      purchaseId: 'hydro-wind-grid',
      technologyId: 'modern-wind-turbines',
      builtFile: 'islands/water-wind/island-water-wind-05-built-hydro-wind-grid.png',
      upgradedFile: 'islands/water-wind/island-water-wind-05-upgraded-modern-wind-turbines.png',
    },
  ],
  fossil: [
    {
      purchaseId: 'steam-engine',
      technologyId: 'high-pressure-steam',
      builtFile: 'islands/fossil/island-fossil-04-built-steam-engine.png',
      upgradedFile: 'islands/fossil/island-fossil-04-upgraded-high-pressure-steam.png',
    },
    {
      purchaseId: 'thermal-turbine',
      technologyId: 'thermal-cycle',
      builtFile: 'islands/fossil/island-fossil-05-built-thermal-turbine.png',
      upgradedFile: 'islands/fossil/island-fossil-05-upgraded-thermal-cycle.png',
    },
  ],
  atomic: [
    {
      purchaseId: 'reactor-core',
      technologyId: 'controlled-fission',
      builtFile: 'islands/atomic/island-atomic-05-built-reactor-core.png',
      upgradedFile: 'islands/atomic/island-atomic-05-upgraded-controlled-fission.png',
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
