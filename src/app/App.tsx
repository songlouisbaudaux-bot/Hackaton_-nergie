import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Flame, RotateCcw, Zap } from 'lucide-react';
import {
  CentralPlayfieldSlot,
  EnergyIslandsLayer,
  MixEvolutionBackdrop,
  MixPanel,
  ProgressRail,
  PurchasePanel,
  TechRail,
} from '../components/game';
import { IntroScreen } from '../components/intro';
import {
  ages,
  formatJoules,
  formatRate,
  getAdvanceState,
  getAgeById,
  getProduction,
  getTotals,
  purchases,
  technologies,
  type AgeId,
  type PurchaseCounts,
  type PurchaseId,
  type Purchase,
  type Technology,
  type TechnologyId,
} from '../game';

const GAME_PROGRESS_STORAGE_KEY = 'prometheus-protocol:progress:v1';
const INTRO_STORAGE_KEY = 'prometheus-protocol:intro:v2';

const defaultGameProgress = {
  energy: 0,
  activeAgeId: 'biomass' as AgeId,
  purchaseCounts: {} as PurchaseCounts,
  researchedTechnologies: [] as TechnologyId[],
};

const ageIdSet = new Set<string>(ages.map((age) => age.id));
const purchaseIdSet = new Set<string>(purchases.map((purchase) => purchase.id));
const technologyIdSet = new Set<string>(technologies.map((technology) => technology.id));

type StoredGameProgress = typeof defaultGameProgress;

type FloatingGain = {
  id: number;
  x: number;
  y: number;
  value: number;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isAgeId(value: unknown): value is AgeId {
  return typeof value === 'string' && ageIdSet.has(value);
}

function isTechnologyId(value: unknown): value is TechnologyId {
  return typeof value === 'string' && technologyIdSet.has(value);
}

function readGameProgress(): StoredGameProgress {
  if (typeof window === 'undefined') return defaultGameProgress;

  try {
    const rawProgress = window.localStorage.getItem(GAME_PROGRESS_STORAGE_KEY);
    if (!rawProgress) return defaultGameProgress;

    const parsed: unknown = JSON.parse(rawProgress);
    if (!isObject(parsed)) return defaultGameProgress;

    const purchaseCounts: PurchaseCounts = {};
    if (isObject(parsed.purchaseCounts)) {
      for (const [id, count] of Object.entries(parsed.purchaseCounts)) {
        if (!purchaseIdSet.has(id) || typeof count !== 'number' || !Number.isFinite(count)) continue;

        const cleanCount = Math.floor(count);
        if (cleanCount > 0) {
          purchaseCounts[id as PurchaseId] = cleanCount;
        }
      }
    }

    const researchedTechnologies: TechnologyId[] = [];
    const seenTechnologies = new Set<TechnologyId>();
    if (Array.isArray(parsed.researchedTechnologies)) {
      for (const technologyId of parsed.researchedTechnologies) {
        if (!isTechnologyId(technologyId) || seenTechnologies.has(technologyId)) continue;

        seenTechnologies.add(technologyId);
        researchedTechnologies.push(technologyId);
      }
    }

    return {
      energy:
        typeof parsed.energy === 'number' && Number.isFinite(parsed.energy)
          ? Math.max(0, parsed.energy)
          : defaultGameProgress.energy,
      activeAgeId: isAgeId(parsed.activeAgeId) ? parsed.activeAgeId : defaultGameProgress.activeAgeId,
      purchaseCounts,
      researchedTechnologies,
    };
  } catch {
    return defaultGameProgress;
  }
}

function writeGameProgress(progress: StoredGameProgress) {
  try {
    window.localStorage.setItem(
      GAME_PROGRESS_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        ...progress,
      }),
    );
  } catch {
    // Le jeu reste jouable meme si le navigateur refuse le stockage local.
  }
}

function readIntroDone() {
  if (typeof window === 'undefined') return false;

  try {
    return window.localStorage.getItem(INTRO_STORAGE_KEY) === 'done';
  } catch {
    return false;
  }
}

function writeIntroDone() {
  try {
    window.localStorage.setItem(INTRO_STORAGE_KEY, 'done');
  } catch {
    // Ignorer : l'intro reviendra seulement si le stockage local est indisponible.
  }
}

function GameScreen() {
  const initialProgress = useMemo(() => readGameProgress(), []);
  const [energy, setEnergy] = useState(initialProgress.energy);
  const [activeAgeId, setActiveAgeId] = useState<AgeId>(initialProgress.activeAgeId);
  const [purchaseCounts, setPurchaseCounts] = useState<PurchaseCounts>(initialProgress.purchaseCounts);
  const [researchedTechnologies, setResearchedTechnologies] = useState<TechnologyId[]>(
    initialProgress.researchedTechnologies,
  );
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
    writeGameProgress({
      energy,
      activeAgeId,
      purchaseCounts,
      researchedTechnologies,
    });
  }, [activeAgeId, energy, purchaseCounts, researchedTechnologies]);

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

  const handleRestartGame = useCallback(() => {
    const resetProgress: StoredGameProgress = {
      energy: defaultGameProgress.energy,
      activeAgeId: defaultGameProgress.activeAgeId,
      purchaseCounts: {},
      researchedTechnologies: [],
    };

    writeGameProgress(resetProgress);
    setEnergy(resetProgress.energy);
    setActiveAgeId(resetProgress.activeAgeId);
    setPurchaseCounts(resetProgress.purchaseCounts);
    setResearchedTechnologies(resetProgress.researchedTechnologies);
    gainIdRef.current = 0;
    setFloatingGains([]);
  }, []);

  return (
    <main className="game-screen">
      <MixEvolutionBackdrop activeAgeId={activeAgeId} production={production} />

      <div className="scene-layer">
        <EnergyIslandsLayer
          activeAgeId={activeAgeId}
          purchaseCounts={purchaseCounts}
          researchedTechnologies={researchedTechnologies}
        />
        <CentralPlayfieldSlot onActivate={handleCampClick} />
      </div>

      <div className="game-hud">
        <button
          className="restart-run-button restart-run-button--floating"
          type="button"
          aria-label="Recommencer la partie"
          onClick={handleRestartGame}
        >
          <RotateCcw size={16} aria-hidden="true" />
          <span className="restart-run-button-label">Recommencer</span>
        </button>

        <header className="energy-header panel" aria-label="Énergie">
          <div>
            <span className="metric-kicker">Énergie</span>
            <strong className="energy-value" aria-live="polite">
              {formatJoules(energy)}
            </strong>
          </div>
          <div className="energy-actions">
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
  const [introDone, setIntroDone] = useState(readIntroDone);

  const handleIntroDone = useCallback(() => {
    writeIntroDone();
    setIntroDone(true);
  }, []);

  if (!introDone) {
    return <IntroScreen onDone={handleIntroDone} />;
  }

  return <GameScreen />;
}
