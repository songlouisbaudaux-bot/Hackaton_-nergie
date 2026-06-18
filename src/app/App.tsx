import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Flame, RotateCcw, Zap } from 'lucide-react';
import {
  CentralPlayfieldSlot,
  MixPanel,
  ProgressRail,
  PurchasePanel,
  TechRail,
} from '../components/game';
import { IntroScreen } from '../components/intro';
import {
  formatJoules,
  formatRate,
  getAdvanceState,
  getAgeById,
  getProduction,
  getTotals,
  type AgeId,
  type PurchaseCounts,
  type Purchase,
  type Technology,
  type TechnologyId,
} from '../game';

type FloatingGain = {
  id: number;
  x: number;
  y: number;
  value: number;
};

function GameScreen() {
  const [energy, setEnergy] = useState(0);
  const [activeAgeId, setActiveAgeId] = useState<AgeId>('biomass');
  const [purchaseCounts, setPurchaseCounts] = useState<PurchaseCounts>({});
  const [researchedTechnologies, setResearchedTechnologies] = useState<TechnologyId[]>([]);
  const [floatingGains, setFloatingGains] = useState<FloatingGain[]>([]);
  const gainIdRef = useRef(0);

  const production = useMemo(
    () => getProduction(purchaseCounts, researchedTechnologies),
    [purchaseCounts, researchedTechnologies],
  );
  const totals = useMemo(() => getTotals(production), [production]);
  const currentAge = useMemo(() => getAgeById(activeAgeId), [activeAgeId]);
  const advanceState = useMemo(
    () => getAdvanceState(activeAgeId, purchaseCounts, researchedTechnologies, energy),
    [activeAgeId, energy, purchaseCounts, researchedTechnologies],
  );

  useEffect(() => {
    if (totals.energyPerSecond <= 0) return undefined;

    const interval = window.setInterval(() => {
      setEnergy((current) => current + totals.energyPerSecond / 4);
    }, 250);

    return () => window.clearInterval(interval);
  }, [totals.energyPerSecond]);

  const addFloatingGain = useCallback((point: { x: number; y: number }, value: number) => {
    const id = gainIdRef.current + 1;
    gainIdRef.current = id;
    setFloatingGains((items) => [...items, { id, x: point.x, y: point.y, value }]);

    window.setTimeout(() => {
      setFloatingGains((items) => items.filter((item) => item.id !== id));
    }, 900);
  }, []);

  const handleCampClick = useCallback(
    (point: { x: number; y: number }) => {
      const gain = totals.energyPerClick;
      setEnergy((current) => current + gain);
      addFloatingGain(point, gain);
    },
    [addFloatingGain, totals.energyPerClick],
  );

  const handleBuyPurchase = useCallback(
    (purchase: Purchase & { nextCostJoules?: number }, point: { x: number; y: number }) => {
      const cost = purchase.nextCostJoules ?? purchase.costJoules;
      if (energy < cost) return;

      setEnergy((current) => {
        if (current < cost) return current;
        return current - cost;
      });
      setPurchaseCounts((current) => ({
        ...current,
        [purchase.id]: (current[purchase.id] ?? 0) + 1,
      }));
      addFloatingGain(point, -cost);
    },
    [addFloatingGain, energy],
  );

  const handleResearchTechnology = useCallback(
    (technology: Technology, point: { x: number; y: number }) => {
      if (
        researchedTechnologies.includes(technology.id) ||
        energy < technology.costJoules ||
        (purchaseCounts[technology.targetPurchaseId] ?? 0) <= 0
      ) {
        return;
      }

      setEnergy((current) => {
        if (current < technology.costJoules) return current;
        return current - technology.costJoules;
      });
      setResearchedTechnologies((current) =>
        current.includes(technology.id) ? current : [...current, technology.id],
      );
      addFloatingGain(point, -technology.costJoules);
    },
    [addFloatingGain, energy, purchaseCounts, researchedTechnologies],
  );

  const handleAdvanceAge = useCallback(
    (point: { x: number; y: number }) => {
      if (!advanceState.canAdvance || !advanceState.nextAge) return;

      setEnergy((current) => {
        if (current < advanceState.cost) return current;
        return current - advanceState.cost;
      });
      setActiveAgeId(advanceState.nextAge.id);
      addFloatingGain(point, -advanceState.cost);
    },
    [addFloatingGain, advanceState],
  );

  return (
    <main className="game-screen">
      <div className="scene-layer">
        <CentralPlayfieldSlot onActivate={handleCampClick} />
      </div>

      <div className="game-hud">
        <header className="energy-header panel" aria-label="Énergie">
          <div>
            <span className="metric-kicker">Énergie</span>
            <strong className="energy-value" aria-live="polite">
              {formatJoules(energy)}
            </strong>
          </div>
          <div className="rate-cluster">
            <span>
              <Zap size={15} aria-hidden="true" />
              {totals.energyPerClick.toFixed(0)} J/clic
            </span>
            <span data-active={totals.energyPerSecond > 0}>
              <Flame size={15} aria-hidden="true" />
              {formatRate(totals.energyPerSecond)}
            </span>
          </div>
        </header>

        <MixPanel production={production} />

        <PurchasePanel
          currentAge={currentAge}
          energy={energy}
          advanceState={advanceState}
          purchaseCounts={purchaseCounts}
          onBuy={handleBuyPurchase}
          onAdvanceAge={handleAdvanceAge}
        />

        <TechRail
          currentAge={currentAge}
          energy={energy}
          purchaseCounts={purchaseCounts}
          researchedTechnologies={researchedTechnologies}
          onResearchTechnology={handleResearchTechnology}
        />

        <ProgressRail activeAgeId={activeAgeId} />
      </div>

      <aside className="rotate-device-overlay" aria-live="polite">
        <div className="rotate-device-card panel">
          <RotateCcw size={34} aria-hidden="true" />
          <strong>Tournez l'écran</strong>
          <span>Le jeu se lit mieux en paysage.</span>
        </div>
      </aside>

      <div className="floating-layer" aria-hidden="true">
        {floatingGains.map((gain) => (
          <span
            className="floating-gain"
            data-negative={gain.value < 0}
            key={gain.id}
            style={{ left: gain.x, top: gain.y }}
          >
            {gain.value > 0 ? '+' : ''}
            {gain.value.toFixed(0)} J
          </span>
        ))}
      </div>
    </main>
  );
}

export default function App() {
  const [introDone, setIntroDone] = useState(false);

  if (!introDone) {
    return <IntroScreen onDone={() => setIntroDone(true)} />;
  }

  return <GameScreen />;
}
