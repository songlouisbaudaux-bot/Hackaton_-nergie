import { BatteryCharging } from 'lucide-react';
import { formatDuration, formatJoules } from '../../game';

export type ActiveReturnBonus = {
  id: number;
  value: number;
  seconds: number;
};

type ReturnBonusToastProps = {
  bonus: ActiveReturnBonus | null;
};

export default function ReturnBonusToast({ bonus }: ReturnBonusToastProps) {
  if (!bonus) return null;

  return (
    <aside
      className="return-bonus-toast panel"
      key={bonus.id}
      aria-live="polite"
      aria-label="Production hors ligne"
    >
      <span className="return-bonus-icon" aria-hidden="true">
        <BatteryCharging size={17} />
      </span>
      <span className="return-bonus-copy">
        <strong>{formatJoules(bonus.value)}</strong>
        <span>produits pendant {formatDuration(bonus.seconds)}</span>
      </span>
    </aside>
  );
}
