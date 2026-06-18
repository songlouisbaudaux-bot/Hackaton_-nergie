import {
  assetPath,
  getIslandVisuals,
  type AgeId,
  type PurchaseCounts,
  type TechnologyId,
} from '../../game';

type EnergyIslandsLayerProps = {
  activeAgeId: AgeId;
  purchaseCounts: PurchaseCounts;
  researchedTechnologies: TechnologyId[];
};

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
