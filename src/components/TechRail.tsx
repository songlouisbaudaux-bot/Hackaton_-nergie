import { Check, Cpu, Flame, Lock, Users, Zap, type LucideIcon } from 'lucide-react';
import {
  formatJoules,
  formatRate,
  getVisibleTechnologies,
  type Technology,
  type TechnologyId,
} from '../game/config';

type TechRailProps = {
  energy: number;
  peakEnergy: number;
  purchased: TechnologyId[];
  onBuy: (technology: Technology, point: { x: number; y: number }) => void;
};

const technologyIcons: Record<TechnologyId, LucideIcon> = {
  'protect-ember': Flame,
  'stable-hearth': Flame,
  'organized-collection': Users,
  'fire-circle': Users,
  'first-surplus': Cpu,
};

export default function TechRail({ energy, peakEnergy, purchased, onBuy }: TechRailProps) {
  const visibleTechnologies = getVisibleTechnologies(purchased, peakEnergy, 3);

  return (
    <section className="panel tech-rail" aria-label="Technologies">
      <div className="tech-rail-header">
        <div className="panel-title">
          <Cpu size={18} aria-hidden="true" />
          <h2>Technologies</h2>
        </div>
        <span className="rail-count">{visibleTechnologies.length}/3 visibles</span>
      </div>

      <div className="tech-card-list">
        {visibleTechnologies.map((technology) => {
          const affordable = energy >= technology.costJoules;
          const canBuy = technology.unlocked && affordable;
          const Icon = technologyIcons[technology.id];

          return (
            <button
              className="tech-card"
              data-affordable={affordable}
              data-unlocked={technology.unlocked}
              disabled={!canBuy}
              key={technology.id}
              type="button"
              onClick={(event) => onBuy(technology, { x: event.clientX, y: event.clientY })}
            >
              <span className="tech-icon" aria-hidden="true">
                <Icon size={18} />
              </span>
              <span className="tech-copy">
                <span className="tech-label">{technology.label}</span>
                <span className="tech-effect">
                  +{technology.clickGain} J/clic
                  {technology.passiveGain > 0 ? ` · +${formatRate(technology.passiveGain)}` : ''}
                </span>
                <span className="tech-impact">{technology.impactLabel}</span>
              </span>
              <span className="tech-meta">
                {canBuy ? (
                  <Zap size={16} aria-label="Disponible" />
                ) : technology.unlocked ? (
                  <Check size={16} aria-label="Débloqué" />
                ) : (
                  <Lock size={16} aria-label="Verrouillé" />
                )}
                <span>{formatJoules(technology.costJoules)}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
