import { CheckCircle2, Target } from 'lucide-react';
import { formatDuration, formatJoules, type CurrentObjective } from '../../game';

type ObjectiveStripProps = {
  objective: CurrentObjective;
  etaSeconds?: number;
};

export default function ObjectiveStrip({ objective, etaSeconds }: ObjectiveStripProps) {
  const Icon = objective.ready ? CheckCircle2 : Target;
  const costLabel = objective.costJoules ? formatJoules(objective.costJoules) : 'pret';
  const etaLabel =
    typeof etaSeconds === 'number' && Number.isFinite(etaSeconds)
      ? `dans ${formatDuration(etaSeconds)}`
      : undefined;

  return (
    <section className="objective-strip panel" data-ready={objective.ready} aria-label="Objectif actuel">
      <div className="objective-main">
        <span className="objective-icon" aria-hidden="true">
          <Icon size={16} />
        </span>
        <div className="objective-copy">
          <span className="objective-kicker">{objective.kicker}</span>
          <strong>{objective.label}</strong>
        </div>
      </div>
      <div className="objective-side">
        <span>{costLabel}</span>
        <div className="objective-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${objective.progress})` }} />
        </div>
      </div>
      <p>{objective.detail}</p>
      {etaLabel ? <span className="objective-eta">{etaLabel}</span> : null}
    </section>
  );
}
