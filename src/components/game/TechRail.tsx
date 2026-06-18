import type { CSSProperties } from 'react';
import {
  Atom,
  Beef,
  Check,
  Factory,
  Leaf,
  Lock,
  Microscope,
  Wind,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import {
  assetPath,
  energySources,
  formatJoules,
  getAgeTechnologies,
  type Age,
  type PurchaseCounts,
  type SourceId,
  type Technology,
  type TechnologyId,
} from '../../game';

type TechRailProps = {
  currentAge: Age;
  energy: number;
  purchaseCounts: PurchaseCounts;
  researchedTechnologies: TechnologyId[];
  onResearchTechnology: (technology: Technology, point: { x: number; y: number }) => void;
};

const sourceIcons: Record<SourceId, LucideIcon> = {
  biomass: Leaf,
  'animal-power': Beef,
  'water-wind': Wind,
  fossil: Factory,
  atomic: Atom,
};

export default function TechRail({
  currentAge,
  energy,
  purchaseCounts,
  researchedTechnologies,
  onResearchTechnology,
}: TechRailProps) {
  const visibleTechnologies = getAgeTechnologies(
    currentAge.id,
    purchaseCounts,
    researchedTechnologies,
    energy,
  );
  const sourceLabels = new Map(energySources.map((source) => [source.id, source.shortLabel]));
  const techListStyle = {
    '--technology-count': Math.max(visibleTechnologies.length, 1),
  } as CSSProperties;

  return (
    <section className="panel tech-rail" aria-label="Technologies">
      <div className="tech-rail-header">
        <div className="panel-title">
          <Microscope size={18} aria-hidden="true" />
          <h2>Technologies</h2>
        </div>
        <span className="rail-count">{currentAge.label}</span>
      </div>

      <div className="technology-list" style={techListStyle}>
        {visibleTechnologies.map((technology) => {
          const canResearch =
            technology.available && technology.affordable && !technology.researched;
          const Icon = sourceIcons[technology.sourceId];

          return (
            <button
              className="technology-card"
              data-affordable={technology.affordable}
              data-available={technology.available}
              data-researched={technology.researched}
              disabled={!canResearch}
              key={technology.id}
              type="button"
              onClick={(event) =>
                onResearchTechnology(technology, { x: event.clientX, y: event.clientY })
              }
            >
              <span className="technology-icon" aria-hidden="true">
                {technology.assetFile ? (
                  <img src={assetPath(technology.assetFile)} alt="" />
                ) : (
                  <Icon size={18} />
                )}
              </span>
              <span className="technology-copy">
                <span className="source-chip">{sourceLabels.get(technology.sourceId)}</span>
                <span className="technology-label">{technology.label}</span>
                <span className="technology-effect">{technology.impactLabel}</span>
              </span>
              <span className="technology-meta">
                {technology.researched ? (
                  <Check size={15} aria-label="Recherché" />
                ) : canResearch ? (
                  <Zap size={15} aria-label="Disponible" />
                ) : (
                  <Lock size={15} aria-label="Verrouillé" />
                )}
                <span>{technology.researched ? 'fait' : formatJoules(technology.costJoules)}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
