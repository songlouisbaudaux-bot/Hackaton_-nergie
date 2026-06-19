import {
  Atom,
  Beef,
  CircleDot,
  Disc3,
  Eclipse,
  Factory,
  Infinity,
  Leaf,
  RadioTower,
  Satellite,
  Sun,
  Wind,
  type LucideIcon,
} from 'lucide-react';
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
  fusion: CircleDot,
  'orbital-solar': Satellite,
  'neutron-wells': RadioTower,
  antimatter: Disc3,
  'black-hole': Eclipse,
  dyson: Sun,
  vacuum: Infinity,
};

export default function ProgressRail({ activeAgeId }: ProgressRailProps) {
  const activeIndex = ages.findIndex((age) => age.id === activeAgeId);
  const windowSize = 5;
  const windowStart = Math.max(0, Math.min(activeIndex - 2, ages.length - windowSize));
  const visibleAges = ages.slice(windowStart, windowStart + windowSize);

  return (
    <div className="progress-rail" aria-label="Progression">
      <span className="era-pill">Âges {activeIndex + 1}/{ages.length}</span>
      {visibleAges.map((age) => {
        const index = ages.findIndex((item) => item.id === age.id);
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
