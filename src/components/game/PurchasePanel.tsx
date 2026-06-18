import {
  Check,
  ChevronsRight,
  Lock,
  ShoppingBag,
  Zap,
} from 'lucide-react';
import {
  assetPath,
  energySources,
  formatJoules,
  formatRate,
  getAgePurchases,
  type Age,
  type Purchase,
  type PurchaseCounts,
} from '../../game';

type PurchasePanelProps = {
  currentAge: Age;
  energy: number;
  advanceState: {
    nextAge?: Age;
    complete: boolean;
    cost: number;
    affordable: boolean;
    canAdvance: boolean;
  };
  purchaseCounts: PurchaseCounts;
  onBuy: (purchase: Purchase & { nextCostJoules?: number }, point: { x: number; y: number }) => void;
  onAdvanceAge: (point: { x: number; y: number }) => void;
};

export default function PurchasePanel({
  currentAge,
  energy,
  advanceState,
  purchaseCounts,
  onBuy,
  onAdvanceAge,
}: PurchasePanelProps) {
  const visiblePurchases = getAgePurchases(currentAge.id, purchaseCounts, energy);
  const sourceLabels = new Map(energySources.map((source) => [source.id, source.shortLabel]));
  const finalAgeComplete = !advanceState.nextAge && advanceState.complete;

  return (
    <section className="panel purchase-panel" aria-label="Achats disponibles">
      <div className="purchase-panel-header">
        <div className="panel-title">
          <ShoppingBag size={18} aria-hidden="true" />
          <h2>{currentAge.label}</h2>
        </div>
        <span className="rail-count">{visiblePurchases.length} objets</span>
      </div>
      <p className="age-description">{currentAge.description}</p>

      <div className="purchase-list">
        {visiblePurchases.map((purchase) => {
          const canBuy = purchase.affordable;

          return (
            <button
              className="purchase-card"
              data-affordable={purchase.affordable}
              data-purchased={purchase.count > 0}
              disabled={!canBuy}
              key={purchase.id}
              type="button"
              onClick={(event) => onBuy(purchase, { x: event.clientX, y: event.clientY })}
            >
              <span className="purchase-asset" data-source={purchase.sourceId} aria-hidden="true">
                {purchase.assetFile ? (
                  <img src={assetPath(purchase.assetFile)} alt="" />
                ) : (
                  <ShoppingBag size={22} />
                )}
              </span>

              <span className="purchase-copy">
                <span className="source-chip">{sourceLabels.get(purchase.sourceId)}</span>
                <span className="purchase-label">{purchase.label}</span>
                <span className="purchase-effect">
                  {purchase.clickGain > 0 ? `+${purchase.clickGain} J/clic` : ''}
                  {purchase.clickGain > 0 && purchase.passiveGain > 0 ? ' · ' : ''}
                  {purchase.passiveGain > 0 ? `+${formatRate(purchase.passiveGain)}` : ''}
                </span>
              </span>

              <span className="purchase-meta">
                {purchase.count > 0 ? (
                  <Check size={16} aria-label="Acheté" />
                ) : canBuy ? (
                  <Zap size={16} aria-label="Disponible" />
                ) : (
                  <Lock size={16} aria-label="J insuffisants" />
                )}
                <span>{formatJoules(purchase.nextCostJoules)}</span>
                <span>x{purchase.count}</span>
              </span>
            </button>
          );
        })}
      </div>

      <button
        className="advance-age-card"
        data-complete={advanceState.complete}
        disabled={!advanceState.canAdvance}
        type="button"
        onClick={(event) => onAdvanceAge({ x: event.clientX, y: event.clientY })}
      >
        <span className="advance-icon" aria-hidden="true">
          <ChevronsRight size={18} />
        </span>
        <span className="advance-copy">
          <span className="advance-label">
            {advanceState.nextAge
              ? `Passer : ${advanceState.nextAge.label}`
              : finalAgeComplete
                ? 'Ère atomique stable'
                : 'Âge final'}
          </span>
          <span className="advance-description">
            {advanceState.nextAge
              ? advanceState.complete
                ? advanceState.nextAge.description
                : 'Compléter objets et technologies.'
              : finalAgeComplete
                ? 'Mix complet.'
                : 'Finir objets et technologies.'}
          </span>
        </span>
        <span className="advance-meta">
          {advanceState.nextAge ? formatJoules(advanceState.cost) : finalAgeComplete ? 'OK' : 'final'}
        </span>
      </button>
    </section>
  );
}
