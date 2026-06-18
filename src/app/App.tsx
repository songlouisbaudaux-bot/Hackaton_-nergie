import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Flame, Zap } from 'lucide-react';
import ActionPanel from '../components/ActionPanel';
import CentralPlayfieldSlot from '../components/CentralPlayfieldSlot';
import IntroScreen from '../components/IntroScreen';
import MixPanel from '../components/MixPanel';
import ProgressRail from '../components/ProgressRail';
import TechRail from '../components/TechRail';
import {
  formatJoules,
  formatRate,
  getCurrentPhase,
  getProduction,
  getTotals,
  type ActionCounts,
  type GameAction,
  type GameActionId,
  type MixBoost,
  type Technology,
  type TechnologyId,
} from '../game/config';

type FloatingGain = {
  id: number;
  x: number;
  y: number;
  value: number;
};

type TemporaryMixBoost = MixBoost & {
  id: number;
  expiresAt: number;
};

function GameScreen() {
  const [energy, setEnergy] = useState(0);
  const [peakEnergy, setPeakEnergy] = useState(0);
  const [purchased, setPurchased] = useState<TechnologyId[]>([]);
  const [actionCounts, setActionCounts] = useState<ActionCounts>({});
  const [actionCooldowns, setActionCooldowns] = useState<Partial<Record<GameActionId, number>>>({});
  const [temporaryMixBoosts, setTemporaryMixBoosts] = useState<TemporaryMixBoost[]>([]);
  const [floatingGains, setFloatingGains] = useState<FloatingGain[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const gainIdRef = useRef(0);
  const boostIdRef = useRef(0);

  const activeMixBoosts = useMemo(
    () =>
      temporaryMixBoosts
        .filter((boost) => boost.expiresAt > now)
        .map(({ sourceMixDelta }) => ({ sourceMixDelta })),
    [now, temporaryMixBoosts],
  );
  const production = useMemo(
    () => getProduction(purchased, actionCounts, activeMixBoosts),
    [activeMixBoosts, actionCounts, purchased],
  );
  const totals = useMemo(() => getTotals(production), [production]);
  const currentPhase = useMemo(() => getCurrentPhase(peakEnergy), [peakEnergy]);

  useEffect(() => {
    setPeakEnergy((current) => Math.max(current, energy));
  }, [energy]);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    setTemporaryMixBoosts((boosts) => boosts.filter((boost) => boost.expiresAt > now));
  }, [now]);

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

  const handleRunAction = useCallback(
    (action: GameAction, point: { x: number; y: number }) => {
      const cooldownUntil = actionCooldowns[action.id] ?? 0;
      if (energy < action.costJoules || cooldownUntil > now) return;

      const netJoules = action.immediateJoules - action.costJoules;

      setEnergy((current) => {
        if (current < action.costJoules) return current;
        return current - action.costJoules + action.immediateJoules;
      });
      setActionCounts((current) => ({
        ...current,
        [action.id]: (current[action.id] ?? 0) + 1,
      }));
      setActionCooldowns((current) => ({
        ...current,
        [action.id]: now + (action.cooldownMs ?? 0),
      }));

      const durationMs = action.durationMs ?? 0;
      if (durationMs > 0) {
        const id = boostIdRef.current + 1;
        boostIdRef.current = id;
        setTemporaryMixBoosts((current) => [
          ...current,
          {
            id,
            sourceMixDelta: action.sourceMixDelta,
            expiresAt: now + durationMs,
          },
        ]);
      }

      addFloatingGain(point, netJoules);
    },
    [actionCooldowns, addFloatingGain, energy, now],
  );

  const handleBuyTechnology = useCallback(
    (technology: Technology, point: { x: number; y: number }) => {
      if (purchased.includes(technology.id) || energy < technology.costJoules) return;

      setEnergy((current) => {
        if (current < technology.costJoules) return current;
        return current - technology.costJoules;
      });
      setPurchased((current) =>
        current.includes(technology.id) ? current : [...current, technology.id],
      );
      addFloatingGain(point, -technology.costJoules);
    },
    [addFloatingGain, energy, purchased],
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

        <ActionPanel
          energy={energy}
          cooldownUntil={actionCooldowns}
          now={now}
          onRun={handleRunAction}
        />

        <TechRail
          energy={energy}
          peakEnergy={peakEnergy}
          purchased={purchased}
          onBuy={handleBuyTechnology}
        />

        <ProgressRail activePhaseId={currentPhase.id} />
      </div>

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
