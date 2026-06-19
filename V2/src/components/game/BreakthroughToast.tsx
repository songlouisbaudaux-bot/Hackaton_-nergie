import { Sparkles } from 'lucide-react';
import type { BreakthroughMilestone } from '../../game';

export type ActiveBreakthrough = BreakthroughMilestone & {
  nonce: number;
};

type BreakthroughToastProps = {
  breakthrough: ActiveBreakthrough | null;
};

export default function BreakthroughToast({ breakthrough }: BreakthroughToastProps) {
  if (!breakthrough) return null;

  return (
    <aside
      className="breakthrough-toast"
      data-tone={breakthrough.tone}
      key={breakthrough.nonce}
      aria-live="polite"
      aria-label="Percée énergétique"
    >
      <span className="breakthrough-orbit" aria-hidden="true" />
      <div className="breakthrough-card panel">
        <span className="breakthrough-icon" aria-hidden="true">
          <Sparkles size={18} />
        </span>
        <div className="breakthrough-copy">
          <span>{breakthrough.kicker}</span>
          <strong>{breakthrough.title}</strong>
          <p>{breakthrough.detail}</p>
        </div>
      </div>
    </aside>
  );
}
