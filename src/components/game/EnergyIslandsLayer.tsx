import {
  assetPath,
  getIslandVisuals,
  type AgeId,
  type PurchaseCounts,
  type SourceId,
  type TechnologyId,
} from '../../game';
import type { CSSProperties } from 'react';

type EnergyIslandsLayerProps = {
  activeAgeId: AgeId;
  purchaseCounts: PurchaseCounts;
  researchedTechnologies: TechnologyId[];
};

type IslandLayerStyle = CSSProperties & {
  '--island-left'?: string;
  '--island-top'?: string;
  '--island-scale'?: number;
};

const sourceLayout: Record<SourceId, { x: number; y: number; scale?: number }> = {
  biomass: { x: 39, y: 60 },
  'animal-power': { x: 39, y: 38 },
  'water-wind': { x: 61, y: 38 },
  fossil: { x: 61, y: 60 },
  atomic: { x: 50, y: 25 },
  fusion: { x: 50, y: 72, scale: 0.88 },
  'orbital-solar': { x: 29, y: 49, scale: 0.78 },
  'neutron-wells': { x: 71, y: 49, scale: 0.78 },
  antimatter: { x: 29, y: 72, scale: 0.76 },
  'black-hole': { x: 71, y: 72, scale: 0.76 },
  dyson: { x: 22, y: 28, scale: 0.72 },
  vacuum: { x: 78, y: 28, scale: 0.72 },
};

function getIslandStyle(slot: SourceId | 'central'): IslandLayerStyle {
  if (slot === 'central') {
    return {
      '--island-left': '50%',
      '--island-top': '48%',
      '--island-scale': 1.06,
      zIndex: 5,
    };
  }

  const layout = sourceLayout[slot];
  return {
    '--island-left': `${layout.x}%`,
    '--island-top': `${layout.y}%`,
    '--island-scale': layout.scale ?? 1,
  };
}

export default function EnergyIslandsLayer({
  activeAgeId,
  purchaseCounts,
  researchedTechnologies,
}: EnergyIslandsLayerProps) {
  const islands = getIslandVisuals(activeAgeId, purchaseCounts, researchedTechnologies);

  return (
    <div className="energy-islands-layer" aria-hidden="true">
      {islands.map((island) => (
        <figure
          className="energy-island"
          data-slot={island.slot}
          data-state={island.state}
          key={island.id}
          style={getIslandStyle(island.slot)}
        >
          <img
            src={assetPath(island.file)}
            alt=""
            draggable={false}
            onError={(event) => {
              event.currentTarget.closest('.energy-island')?.setAttribute('data-missing', 'true');
            }}
          />
        </figure>
      ))}
    </div>
  );
}
