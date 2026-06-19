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
  '--island-float-duration'?: string;
  '--island-float-delay'?: string;
};

type IslandCameraStyle = CSSProperties & {
  '--island-camera-zoom'?: number;
};

const sourceOrder: SourceId[] = [
  'dyson',
  'atomic',
  'vacuum',
  'animal-power',
  'water-wind',
  'orbital-solar',
  'neutron-wells',
  'biomass',
  'fossil',
  'fusion',
  'antimatter',
  'black-hole',
];

const sourceLayout: Record<SourceId, { x: number; y: number; scale?: number; z: number }> = {
  dyson: { x: 12, y: 18, scale: 0.52, z: 2 },
  atomic: { x: 50, y: 16, scale: 0.64, z: 3 },
  vacuum: { x: 88, y: 18, scale: 0.52, z: 2 },
  'animal-power': { x: 36, y: 30, scale: 0.68, z: 4 },
  'water-wind': { x: 64, y: 30, scale: 0.68, z: 4 },
  'orbital-solar': { x: 12, y: 50, scale: 0.58, z: 5 },
  'neutron-wells': { x: 88, y: 50, scale: 0.58, z: 5 },
  biomass: { x: 36, y: 70, scale: 0.68, z: 6 },
  fossil: { x: 64, y: 70, scale: 0.68, z: 6 },
  fusion: { x: 50, y: 84, scale: 0.64, z: 7 },
  antimatter: { x: 12, y: 82, scale: 0.52, z: 7 },
  'black-hole': { x: 88, y: 82, scale: 0.52, z: 7 },
};

function getCameraZoom(visibleSourceCount: number) {
  if (visibleSourceCount <= 1) return 1.42;
  if (visibleSourceCount <= 2) return 1.3;
  if (visibleSourceCount <= 3) return 1.18;
  if (visibleSourceCount <= 4) return 1.06;
  if (visibleSourceCount <= 6) return 0.98;
  if (visibleSourceCount <= 8) return 0.92;
  if (visibleSourceCount <= 10) return 0.87;
  return 0.82;
}

function getIslandStyle(slot: SourceId | 'central'): IslandLayerStyle {
  if (slot === 'central') {
    return {
      '--island-left': '50%',
      '--island-top': '50%',
      '--island-scale': 0.82,
      '--island-float-duration': '7.4s',
      '--island-float-delay': '-1.1s',
      zIndex: 8,
    };
  }

  const layout = sourceLayout[slot];
  const orderIndex = sourceOrder.indexOf(slot);

  return {
    '--island-left': `${layout.x}%`,
    '--island-top': `${layout.y}%`,
    '--island-scale': layout.scale ?? 1,
    '--island-float-duration': `${6.2 + (orderIndex % 5) * 0.34}s`,
    '--island-float-delay': `${-0.35 - orderIndex * 0.47}s`,
    zIndex: layout.z,
  };
}

export default function EnergyIslandsLayer({
  activeAgeId,
  purchaseCounts,
  researchedTechnologies,
}: EnergyIslandsLayerProps) {
  const islands = getIslandVisuals(activeAgeId, purchaseCounts, researchedTechnologies);
  const visibleSourceCount = islands.filter((island) => island.slot !== 'central').length;
  const cameraStyle = {
    '--island-camera-zoom': getCameraZoom(visibleSourceCount),
  } as IslandCameraStyle;

  return (
    <div className="energy-islands-layer" aria-hidden="true">
      <div className="energy-island-world" style={cameraStyle}>
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
    </div>
  );
}
