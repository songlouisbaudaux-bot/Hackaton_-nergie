import { Flame, Handshake } from 'lucide-react';
import {
  formatJoules,
  formatRate,
  gameActions,
  type GameAction,
  type GameActionId,
} from '../game/config';

type ActionPanelProps = {
  energy: number;
  cooldownUntil: Partial<Record<GameActionId, number>>;
  now: number;
  onRun: (action: GameAction, point: { x: number; y: number }) => void;
};

const actionIcons = {
  'burn-wood': Flame,
  'organize-collection': Handshake,
};

export default function ActionPanel({ energy, cooldownUntil, now, onRun }: ActionPanelProps) {
  return (
    <section className="panel action-panel" aria-label="Actions énergétiques">
      <div className="panel-title">
        <Flame size={18} aria-hidden="true" />
        <h2>Âge du feu</h2>
      </div>

      <div className="action-list">
        {gameActions.map((action) => {
          const Icon = actionIcons[action.id];
          const cooldownLeft = Math.max(0, (cooldownUntil[action.id] ?? 0) - now);
          const affordable = energy >= action.costJoules;
          const ready = affordable && cooldownLeft === 0;
          const netJoules = action.immediateJoules - action.costJoules;

          return (
            <button
              className="action-row"
              data-ready={ready}
              disabled={!ready}
              key={action.id}
              type="button"
              onClick={(event) => onRun(action, { x: event.clientX, y: event.clientY })}
            >
              <span className="action-icon" aria-hidden="true">
                <Icon size={18} />
              </span>
              <span className="action-copy">
                <span className="action-label">{action.label}</span>
                <span className="action-description">{action.description}</span>
                <span className="action-impact">
                  {netJoules >= 0 ? `+${formatJoules(netJoules)}` : `-${formatJoules(Math.abs(netJoules))}`}
                  {action.passiveDelta > 0 ? ` · +${formatRate(action.passiveDelta)}` : ''}
                </span>
              </span>
              <span className="action-meta">
                <span>{formatJoules(action.costJoules)}</span>
                <span>{cooldownLeft > 0 ? `${Math.ceil(cooldownLeft / 1000)}s` : ready ? 'prêt' : 'attente'}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
