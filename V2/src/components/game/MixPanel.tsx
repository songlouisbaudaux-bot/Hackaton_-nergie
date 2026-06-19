import { useId } from 'react';
import { Flame } from 'lucide-react';
import { formatRate, type SourceProduction } from '../../game';

type MixPanelProps = {
  production: SourceProduction[];
};

const PIE_RADIUS = 15.91549430918954;

function formatShare(share: number) {
  const percent = share * 100;
  if (percent > 0 && percent < 1) return '<1%';
  return `${Math.round(percent)}%`;
}

export default function MixPanel({ production }: MixPanelProps) {
  const chartTitleId = useId();
  const chartDescriptionId = useId();

  let accumulatedShare = 0;
  const segments = production.map((source) => {
    const share = Math.max(0, Math.min(source.share, 1));
    const segment = {
      ...source,
      dash: share * 100,
      offset: accumulatedShare * 100,
      shareLabel: formatShare(source.share),
    };
    accumulatedShare += share;
    return segment;
  });
  const chartPercent = `${Math.round(Math.min(accumulatedShare, 1) * 100)}%`;
  const chartSummary =
    segments.length > 0
      ? segments.map((source) => `${source.label} ${source.shareLabel}`).join(', ')
      : 'Aucune source active.';
  const dominantSegment = segments.reduce<(typeof segments)[number] | undefined>(
    (current, source) => (!current || source.share > current.share ? source : current),
    undefined,
  );

  return (
    <section className="panel mix-panel" aria-label="Mix énergétique">
      <div className="panel-title">
        <Flame size={18} aria-hidden="true" />
        <h2>Mix énergétique</h2>
      </div>

      <div className="mix-chart">
        <svg
          className="mix-pie"
          viewBox="0 0 42 42"
          role="img"
          aria-labelledby={`${chartTitleId} ${chartDescriptionId}`}
        >
          <title id={chartTitleId}>Répartition du mix énergétique</title>
          <desc id={chartDescriptionId}>{chartSummary}</desc>
          <circle
            className="mix-pie-track"
            cx="21"
            cy="21"
            r={PIE_RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            opacity="0.14"
            aria-hidden="true"
          />
          {segments.map((source) => (
            <circle
              className="mix-pie-segment"
              key={source.id}
              cx="21"
              cy="21"
              r={PIE_RADIUS}
              fill="none"
              stroke={source.color}
              strokeDasharray={`${source.dash} ${100 - source.dash}`}
              strokeDashoffset={-source.offset}
              strokeLinecap="butt"
              strokeWidth="8"
              transform="rotate(-90 21 21)"
              aria-hidden="true"
            />
          ))}
          <circle
            className="mix-pie-hole"
            cx="21"
            cy="21"
            r="9"
            fill="currentColor"
            opacity="0.08"
            aria-hidden="true"
          />
          <text
            className="mix-pie-value"
            x="21"
            y="19.7"
            fill="currentColor"
            textAnchor="middle"
            dominantBaseline="middle"
            aria-hidden="true"
          >
            {dominantSegment?.shareLabel ?? chartPercent}
          </text>
          <text
            className="mix-pie-caption"
            x="21"
            y="24.8"
            fill="currentColor"
            textAnchor="middle"
            dominantBaseline="middle"
            aria-hidden="true"
          >
            max
          </text>
        </svg>

        <ul className="mix-legend" aria-label="Détail du mix énergétique">
          {segments.map((source) => (
            <li
              className="mix-legend-item"
              key={source.id}
              aria-label={`${source.label}: ${source.shareLabel}, ${source.clickJoules.toFixed(
                0,
              )} joules par clic, ${formatRate(source.passiveJoules)}`}
            >
              <span
                className="mix-legend-marker"
                style={{ backgroundColor: source.color }}
                aria-hidden="true"
              />
              <span className="mix-legend-copy">
                <span className="mix-legend-heading">
                  <span className="mix-legend-label">{source.shortLabel}</span>
                  <strong className="mix-legend-share">{source.shareLabel}</strong>
                </span>
                <span className="mix-legend-rates">
                  <span>{source.clickJoules.toFixed(0)} J/clic</span>
                  <span>{formatRate(source.passiveJoules)}</span>
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
