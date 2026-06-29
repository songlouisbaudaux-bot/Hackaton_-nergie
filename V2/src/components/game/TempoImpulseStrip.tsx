import { Activity, Timer } from 'lucide-react';
import { formatDuration } from '../../game';

export type TempoImpulseView = {
  label: string;
  multiplier: number;
  remainingRatio: number;
  remainingSeconds: number;
};

type TempoImpulseStripProps = {
  impulse: TempoImpulseView | null;
};

export default function TempoImpulseStrip({ impulse }: TempoImpulseStripProps) {
  if (!impulse) return null;

  const bonusPercent = Math.max(0, Math.round((impulse.multiplier - 1) * 100));
  const progress = Math.min(1, Math.max(0, impulse.remainingRatio));

  return (
    <aside className="tempo-impulse-strip panel" aria-label="Impulsion temporaire">
      <span className="tempo-impulse-icon" aria-hidden="true">
        <Activity size={15} />
      </span>
      <span className="tempo-impulse-copy">
        <strong>{impulse.label}</strong>
        <span>+{bonusPercent}% J/s</span>
      </span>
      <span className="tempo-impulse-time">
        <Timer size={13} aria-hidden="true" />
        {formatDuration(impulse.remainingSeconds)}
      </span>
      <span className="tempo-impulse-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </span>
    </aside>
  );
}
