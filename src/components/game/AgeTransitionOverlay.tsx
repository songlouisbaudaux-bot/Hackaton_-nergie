import { Sparkles } from 'lucide-react';

type AgeTransitionOverlayProps = {
  age:
    | {
        id: number;
        label: string;
        description: string;
      }
    | null;
};

export default function AgeTransitionOverlay({ age }: AgeTransitionOverlayProps) {
  if (!age) return null;

  return (
    <section className="age-transition-overlay" aria-live="polite" key={age.id}>
      <div className="age-transition-ring" aria-hidden="true" />
      <div className="age-transition-card">
        <span className="age-transition-kicker">
          <Sparkles size={16} aria-hidden="true" />
          Nouvel âge
        </span>
        <strong>{age.label}</strong>
        <span>{age.description}</span>
      </div>
    </section>
  );
}
