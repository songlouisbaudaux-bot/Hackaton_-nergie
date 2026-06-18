import { Flame } from 'lucide-react';
import { formatRate, type SourceProduction } from '../game/config';

type MixPanelProps = {
  production: SourceProduction[];
};

export default function MixPanel({ production }: MixPanelProps) {
  return (
    <section className="panel mix-panel" aria-label="Mix énergétique">
      <div className="panel-title">
        <Flame size={18} aria-hidden="true" />
        <h2>Mix énergétique</h2>
      </div>

      <div className="source-list">
        {production.map((source) => (
          <div className="source-row" key={source.id}>
            <span
              className="source-marker"
              style={{ backgroundColor: source.color }}
              aria-hidden="true"
            />
            <div className="source-copy">
              <div className="source-heading">
                <span>{source.label}</span>
                <strong>{Math.round(source.share * 100)}%</strong>
              </div>
              <div className="source-rates">
                <span>{source.clickJoules.toFixed(0)} J/clic</span>
                <span>{formatRate(source.passiveJoules)}</span>
              </div>
              <div className="source-bar" aria-hidden="true">
                <span
                  style={{
                    width: `${Math.max(source.share * 100, 4)}%`,
                    backgroundColor: source.color,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
