import { Atom, Beef, Factory, Leaf, Wind, type LucideIcon } from 'lucide-react';
import { ages, type AgeId } from '../../game';

type ProgressRailProps = {
  activeAgeId: AgeId;
};

const ageIcons: Record<AgeId, LucideIcon> = {
  biomass: Leaf,
  'animal-power': Beef,
  'water-wind': Wind,
  fossil: Factory,
  atomic: Atom,
};

export default function ProgressRail({ activeAgeId }: ProgressRailProps) {
  const activeIndex = ages.findIndex((age) => age.id === activeAgeId);
  return (
    <div className="progress-rail" aria-label="Progression">
      <span className="era-pill">Âges</span>
      {ages.map((age, index) => {
        const Icon = ageIcons[age.id];
        return (
          <span className="stage-dot" data-active={index <= activeIndex} key={age.id}>
            <Icon size={15} aria-hidden="true" />
            {age.label}
          </span>
        );
      })}
    </div>
  );
}
