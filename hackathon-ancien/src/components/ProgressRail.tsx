import { CircleDot, Flame, Sprout, Users } from 'lucide-react';
import { gamePhases, type GamePhaseId } from '../game/config';

type ProgressRailProps = {
  activePhaseId: GamePhaseId;
};

const phaseIcons = {
  spark: CircleDot,
  'stable-fire': Flame,
  'wood-tribe': Users,
  agriculture: Sprout,
};

export default function ProgressRail({ activePhaseId }: ProgressRailProps) {
  const activeIndex = gamePhases.findIndex((phase) => phase.id === activePhaseId);
  return (
    <div className="progress-rail" aria-label="Progression">
      <span className="era-pill">V1 cœur</span>
      {gamePhases.map((phase, index) => {
        const Icon = phaseIcons[phase.id];
        return (
        <span className="stage-dot" data-active={index <= activeIndex} key={phase.id}>
          <Icon size={15} aria-hidden="true" />
          {phase.label}
        </span>
        );
      })}
    </div>
  );
}
