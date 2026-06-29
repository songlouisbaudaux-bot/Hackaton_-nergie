import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Flame, FlaskConical, RotateCcw, Volume2, VolumeX, Zap } from 'lucide-react';
import {
  AgeTransitionOverlay,
  BreakthroughToast,
  CentralPlayfieldSlot,
  CosmicEnding,
  EnergyIslandsLayer,
  MixEvolutionBackdrop,
  MixPanel,
  ObjectiveStrip,
  ProgressRail,
  PurchasePanel,
  TempoImpulseStrip,
  TechRail,
  type ActiveBreakthrough,
  type TempoImpulseView,
} from '../components/game';
import { IntroScreen } from '../components/intro';
import { useGameAudio, type GameAudioController } from '../audio';
import {
  ages,
  breakthroughMilestones,
  formatJoules,
  formatRate,
  getAdvanceState,
  getAgeById,
  getCurrentObjective,
  getProduction,
  getTotals,
  purchases,
  technologies,
  type AgeId,
  type BreakthroughTrigger,
  type PurchaseCounts,
  type PurchaseId,
  type Purchase,
  type Technology,
  type TechnologyId,
} from '../game';

const GAME_PROGRESS_STORAGE_KEY = 'prometheus-protocol:v2:progress:v1';
const INTRO_STORAGE_KEY = 'prometheus-protocol:v2:intro:v2';
const LEGACY_INTRO_STORAGE_KEYS = [
  'prometheus-protocol:v2:intro:v1',
  'prometheus-protocol:intro:v3',
];
const MANUAL_CLICK_COOLDOWN_MS = 500;
const ACTIVE_PLAY_CLICK_RATE_PER_SECOND = 1;
const TEMPO_IMPULSE_DURATION_MS = 14000;
const TEMPO_IMPULSE_TICK_MS = 250;
const tempoImpulseProfiles = {
  purchase: {
    label: 'Atelier en cadence',
    multiplier: 1.14,
    stackBonus: 0.04,
  },
  technology: {
    label: 'Rendement inspire',
    multiplier: 1.22,
    stackBonus: 0.06,
  },
  age: {
    label: 'Nouvel age en marche',
    multiplier: 1.36,
    stackBonus: 0.08,
  },
} as const;

const defaultGameProgress = {
  energy: 0,
  activeAgeId: 'biomass' as AgeId,
  purchaseCounts: {} as PurchaseCounts,
  researchedTechnologies: [] as TechnologyId[],
  achievedBreakthroughs: [] as string[],
};

const ageIdSet = new Set<string>(ages.map((age) => age.id));
const purchaseIdSet = new Set<string>(purchases.map((purchase) => purchase.id));
const technologyIdSet = new Set<string>(technologies.map((technology) => technology.id));
const breakthroughIdSet = new Set<string>(breakthroughMilestones.map((milestone) => milestone.id));

type StoredGameProgress = typeof defaultGameProgress;

type FloatingGain = {
  id: number;
  x: number;
  y: number;
  value: number;
};

type AgeTransition = {
  id: number;
  label: string;
  description: string;
};

type TempoImpulseKind = keyof typeof tempoImpulseProfiles;

type ActiveTempoImpulse = {
  id: number;
  label: string;
  multiplier: number;
  startedAt: number;
  expiresAt: number;
};

type GameScreenProps = {
  audio: GameAudioController;
  onRestartToIntro: () => void;
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

    const achievedBreakthroughs: string[] = [];
    const seenBreakthroughs = new Set<string>();
    if (Array.isArray(parsed.achievedBreakthroughs)) {
      for (const breakthroughId of parsed.achievedBreakthroughs) {
        if (
          typeof breakthroughId !== 'string' ||
          !breakthroughIdSet.has(breakthroughId) ||
          seenBreakthroughs.has(breakthroughId)
        ) {
          continue;
        }

        seenBreakthroughs.add(breakthroughId);
        achievedBreakthroughs.push(breakthroughId);
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
      achievedBreakthroughs,
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

function clearIntroDone() {
  try {
    window.localStorage.removeItem(INTRO_STORAGE_KEY);
    for (const storageKey of LEGACY_INTRO_STORAGE_KEYS) {
      window.localStorage.removeItem(storageKey);
    }
  } catch {
    // Ignorer : l'intro sera quand meme reaffichee dans l'etat React courant.
  }
}

function GameScreen({ audio, onRestartToIntro }: GameScreenProps) {
  const initialProgress = useMemo(() => readGameProgress(), []);
  const [energy, setEnergy] = useState(initialProgress.energy);
  const [activeAgeId, setActiveAgeId] = useState<AgeId>(initialProgress.activeAgeId);
  const [purchaseCounts, setPurchaseCounts] = useState<PurchaseCounts>(initialProgress.purchaseCounts);
  const [researchedTechnologies, setResearchedTechnologies] = useState<TechnologyId[]>(
    initialProgress.researchedTechnologies,
  );
  const [achievedBreakthroughs, setAchievedBreakthroughs] = useState<string[]>(
    initialProgress.achievedBreakthroughs,
  );
  const [floatingGains, setFloatingGains] = useState<FloatingGain[]>([]);
  const [ageTransition, setAgeTransition] = useState<AgeTransition | null>(null);
  const [activeBreakthrough, setActiveBreakthrough] = useState<ActiveBreakthrough | null>(null);
  const [activeTempoImpulse, setActiveTempoImpulse] = useState<ActiveTempoImpulse | null>(null);
  const [tempoNow, setTempoNow] = useState(() => performance.now());
  const gainIdRef = useRef(0);
  const lastManualClickAtRef = useRef(Number.NEGATIVE_INFINITY);
  const transitionIdRef = useRef(0);
  const transitionTimerRef = useRef<number | null>(null);
  const breakthroughIdRef = useRef(0);
  const breakthroughTimerRef = useRef<number | null>(null);
  const tempoImpulseIdRef = useRef(0);
  const endingSoundPlayedRef = useRef(false);
  const achievedBreakthroughsRef = useRef(new Set(initialProgress.achievedBreakthroughs));

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
  const currentObjective = useMemo(
    () => getCurrentObjective(activeAgeId, purchaseCounts, researchedTechnologies, energy),
    [activeAgeId, energy, purchaseCounts, researchedTechnologies],
  );
  const hasReachedCosmicEnding = !advanceState.nextAge && advanceState.complete;
  const activeTempoImpulseView = useMemo<TempoImpulseView | null>(() => {
    if (!activeTempoImpulse || activeTempoImpulse.expiresAt <= tempoNow) return null;

    const remainingMs = activeTempoImpulse.expiresAt - tempoNow;
    const durationMs = Math.max(1, activeTempoImpulse.expiresAt - activeTempoImpulse.startedAt);

    return {
      label: activeTempoImpulse.label,
      multiplier: activeTempoImpulse.multiplier,
      remainingRatio: remainingMs / durationMs,
      remainingSeconds: remainingMs / 1000,
    };
  }, [activeTempoImpulse, tempoNow]);
  const passiveTempoMultiplier = activeTempoImpulseView?.multiplier ?? 1;
  const boostedEnergyPerSecond = totals.energyPerSecond * passiveTempoMultiplier;
  const objectiveEtaSeconds = useMemo(() => {
    if (!currentObjective.costJoules || currentObjective.ready) return undefined;

    const remainingEnergy = currentObjective.costJoules - energy;
    const activeRate =
      boostedEnergyPerSecond + totals.energyPerClick * ACTIVE_PLAY_CLICK_RATE_PER_SECOND;

    if (remainingEnergy <= 0 || activeRate <= 0) return undefined;

    return remainingEnergy / activeRate;
  }, [
    boostedEnergyPerSecond,
    currentObjective.costJoules,
    currentObjective.ready,
    energy,
    totals.energyPerClick,
  ]);

  useEffect(() => {
    audio.setAge(activeAgeId);
  }, [activeAgeId, audio]);

  useEffect(() => {
    writeGameProgress({
      energy,
      activeAgeId,
      purchaseCounts,
      researchedTechnologies,
      achievedBreakthroughs,
    });
  }, [achievedBreakthroughs, activeAgeId, energy, purchaseCounts, researchedTechnologies]);

  useEffect(
    () => () => {
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }
      if (breakthroughTimerRef.current) {
        window.clearTimeout(breakthroughTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (boostedEnergyPerSecond <= 0) return undefined;

    const interval = window.setInterval(() => {
      setEnergy((current) => current + boostedEnergyPerSecond / 4);
    }, 250);

    return () => window.clearInterval(interval);
  }, [boostedEnergyPerSecond]);

  useEffect(() => {
    if (!activeTempoImpulse) return undefined;

    const interval = window.setInterval(() => {
      const now = performance.now();
      setTempoNow(now);
      setActiveTempoImpulse((current) => {
        if (!current || current.expiresAt > now) return current;

        return null;
      });
    }, TEMPO_IMPULSE_TICK_MS);

    return () => window.clearInterval(interval);
  }, [activeTempoImpulse]);

  useEffect(() => {
    if (!hasReachedCosmicEnding) {
      endingSoundPlayedRef.current = false;
      return;
    }

    if (endingSoundPlayedRef.current) return;

    endingSoundPlayedRef.current = true;
    audio.playCue('ending');
  }, [audio, hasReachedCosmicEnding]);

  const addFloatingGain = useCallback((point: { x: number; y: number }, value: number) => {
    const id = gainIdRef.current + 1;
    gainIdRef.current = id;
    setFloatingGains((items) => [...items, { id, x: point.x, y: point.y, value }]);

    window.setTimeout(() => {
      setFloatingGains((items) => items.filter((item) => item.id !== id));
    }, 900);
  }, []);

  const triggerTempoImpulse = useCallback(
    (kind: TempoImpulseKind) => {
      const profile = tempoImpulseProfiles[kind];
      const now = performance.now();
      tempoImpulseIdRef.current += 1;
      setTempoNow(now);
      setActiveTempoImpulse((current) => {
        const currentActive = current && current.expiresAt > now;
        const multiplier = currentActive
          ? Math.min(1.75, Math.max(profile.multiplier, current.multiplier + profile.stackBonus))
          : profile.multiplier;

        return {
          id: tempoImpulseIdRef.current,
          label: profile.label,
          multiplier,
          startedAt: now,
          expiresAt: now + TEMPO_IMPULSE_DURATION_MS,
        };
      });
      audio.playCue('impulse');
    },
    [audio],
  );

  const triggerBreakthrough = useCallback((trigger: BreakthroughTrigger) => {
    const milestone = breakthroughMilestones.find((item) => {
      return item.trigger.type === trigger.type && item.trigger.id === trigger.id;
    });
    if (!milestone || achievedBreakthroughsRef.current.has(milestone.id)) return;

    achievedBreakthroughsRef.current.add(milestone.id);
    setAchievedBreakthroughs(Array.from(achievedBreakthroughsRef.current));

    breakthroughIdRef.current += 1;
    setActiveBreakthrough({
      ...milestone,
      nonce: breakthroughIdRef.current,
    });
    audio.playCue('breakthrough');

    if (breakthroughTimerRef.current) {
      window.clearTimeout(breakthroughTimerRef.current);
    }

    breakthroughTimerRef.current = window.setTimeout(() => {
      setActiveBreakthrough(null);
      breakthroughTimerRef.current = null;
    }, 3600);
  }, [audio]);

  const handleCampClick = useCallback(
    (point: { x: number; y: number }) => {
      const now = performance.now();
      if (now - lastManualClickAtRef.current < MANUAL_CLICK_COOLDOWN_MS) return;

      lastManualClickAtRef.current = now;
      const gain = totals.energyPerClick;
      setEnergy((current) => current + gain);
      addFloatingGain(point, gain);
      audio.playCue('manual-click');
    },
    [addFloatingGain, audio, totals.energyPerClick],
  );

  const handleBuyPurchase = useCallback(
    (purchase: Purchase & { nextCostJoules?: number }, point: { x: number; y: number }) => {
      const cost = purchase.nextCostJoules ?? purchase.costJoules;
      if (energy < cost) {
        audio.playCue('blocked');
        return;
      }

      setEnergy((current) => {
        if (current < cost) return current;
        return current - cost;
      });
      setPurchaseCounts((current) => ({
        ...current,
        [purchase.id]: (current[purchase.id] ?? 0) + 1,
      }));
      triggerTempoImpulse('purchase');
      triggerBreakthrough({ type: 'purchase', id: purchase.id });
      addFloatingGain(point, -cost);
      audio.playCue('purchase');
    },
    [addFloatingGain, audio, energy, triggerBreakthrough, triggerTempoImpulse],
  );

  const handleResearchTechnology = useCallback(
    (technology: Technology, point: { x: number; y: number }) => {
      if (
        researchedTechnologies.includes(technology.id) ||
        energy < technology.costJoules ||
        (purchaseCounts[technology.targetPurchaseId] ?? 0) <= 0
      ) {
        audio.playCue('blocked');
        return;
      }

      setEnergy((current) => {
        if (current < technology.costJoules) return current;
        return current - technology.costJoules;
      });
      setResearchedTechnologies((current) =>
        current.includes(technology.id) ? current : [...current, technology.id],
      );
      triggerTempoImpulse('technology');
      triggerBreakthrough({ type: 'technology', id: technology.id });
      addFloatingGain(point, -technology.costJoules);
      audio.playCue('technology');
    },
    [addFloatingGain, audio, energy, purchaseCounts, researchedTechnologies, triggerBreakthrough, triggerTempoImpulse],
  );

  const handleAdvanceAge = useCallback(
    (point: { x: number; y: number }) => {
      if (!advanceState.canAdvance || !advanceState.nextAge) {
        audio.playCue('blocked');
        return;
      }

      const nextAge = advanceState.nextAge;

      setEnergy((current) => {
        if (current < advanceState.cost) return current;
        return current - advanceState.cost;
      });
      setActiveAgeId(nextAge.id);
      triggerTempoImpulse('age');
      triggerBreakthrough({ type: 'age', id: nextAge.id });
      transitionIdRef.current += 1;
      setAgeTransition({
        id: transitionIdRef.current,
        label: nextAge.label,
        description: nextAge.description,
      });
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }
      transitionTimerRef.current = window.setTimeout(() => {
        setAgeTransition(null);
        transitionTimerRef.current = null;
      }, 2200);
      addFloatingGain(point, -advanceState.cost);
      audio.playCue('age-transition');
    },
    [addFloatingGain, advanceState, audio, triggerBreakthrough, triggerTempoImpulse],
  );

  const handleRestartGame = useCallback(() => {
    audio.setEnabled(true);
    audio.playCue('restart');
    const resetProgress: StoredGameProgress = {
      energy: defaultGameProgress.energy,
      activeAgeId: defaultGameProgress.activeAgeId,
      purchaseCounts: {},
      researchedTechnologies: [],
      achievedBreakthroughs: [],
    };

    writeGameProgress(resetProgress);
    setEnergy(resetProgress.energy);
    setActiveAgeId(resetProgress.activeAgeId);
    setPurchaseCounts(resetProgress.purchaseCounts);
    setResearchedTechnologies(resetProgress.researchedTechnologies);
    setAchievedBreakthroughs(resetProgress.achievedBreakthroughs);
    achievedBreakthroughsRef.current = new Set(resetProgress.achievedBreakthroughs);
    gainIdRef.current = 0;
    lastManualClickAtRef.current = Number.NEGATIVE_INFINITY;
    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    setAgeTransition(null);
    setActiveBreakthrough(null);
    setActiveTempoImpulse(null);
    setTempoNow(performance.now());
    setFloatingGains([]);
    endingSoundPlayedRef.current = false;
    onRestartToIntro();
  }, [audio, onRestartToIntro]);

  const handleSandboxGame = useCallback(() => {
    audio.playCue('sandbox');
    const sandboxPurchaseCounts: PurchaseCounts = {};
    for (const purchase of purchases) {
      sandboxPurchaseCounts[purchase.id] = 1;
    }

    const sandboxProgress: StoredGameProgress = {
      energy: 1_000_000_000_000_000,
      activeAgeId: 'vacuum',
      purchaseCounts: sandboxPurchaseCounts,
      researchedTechnologies: technologies
        .filter((technology) => technology.id !== 'cosmic-reboot')
        .map((technology) => technology.id),
      achievedBreakthroughs: breakthroughMilestones.map((milestone) => milestone.id),
    };

    writeGameProgress(sandboxProgress);
    setEnergy(sandboxProgress.energy);
    setActiveAgeId(sandboxProgress.activeAgeId);
    setPurchaseCounts(sandboxProgress.purchaseCounts);
    setResearchedTechnologies(sandboxProgress.researchedTechnologies);
    setAchievedBreakthroughs(sandboxProgress.achievedBreakthroughs);
    achievedBreakthroughsRef.current = new Set(sandboxProgress.achievedBreakthroughs);
    gainIdRef.current = 0;
    lastManualClickAtRef.current = Number.NEGATIVE_INFINITY;
    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    setAgeTransition(null);
    setActiveBreakthrough(null);
    setActiveTempoImpulse(null);
    setTempoNow(performance.now());
    setFloatingGains([]);
  }, [audio]);

  const SoundIcon = audio.settings.enabled ? Volume2 : VolumeX;

  return (
    <main className="game-screen" data-impulse={Boolean(activeTempoImpulseView)}>
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
        <div className="hud-top-actions">
          <button
            className="sound-toggle-button"
            type="button"
            aria-label={audio.settings.enabled ? 'Couper le son' : 'Activer le son'}
            aria-pressed={audio.settings.enabled}
            data-enabled={audio.settings.enabled}
            onClick={audio.toggleEnabled}
          >
            <SoundIcon size={16} aria-hidden="true" />
            <span className="sound-toggle-label">{audio.settings.enabled ? 'Son' : 'Muet'}</span>
          </button>

          <button
            className="restart-run-button restart-run-button--floating"
            type="button"
            aria-label="Recommencer la partie"
            onClick={handleRestartGame}
          >
            <RotateCcw size={16} aria-hidden="true" />
            <span className="restart-run-button-label">Recommencer</span>
          </button>
        </div>

        <button
          className="sandbox-run-button"
          type="button"
          aria-label="Activer le bac à sable"
          onClick={handleSandboxGame}
        >
          <FlaskConical size={15} aria-hidden="true" />
          <span className="sandbox-run-button-label">Bac à sable</span>
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
              <span data-active={boostedEnergyPerSecond > 0}>
                <Flame size={15} aria-hidden="true" />
                {formatRate(boostedEnergyPerSecond)}
              </span>
            </div>
          </div>
        </header>

        <ObjectiveStrip objective={currentObjective} etaSeconds={objectiveEtaSeconds} />
        <TempoImpulseStrip impulse={activeTempoImpulseView} />

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

      <AgeTransitionOverlay age={ageTransition} />
      <BreakthroughToast breakthrough={activeBreakthrough} />
      <CosmicEnding visible={hasReachedCosmicEnding} onRestart={handleRestartGame} />

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
  const audio = useGameAudio();

  const handleIntroDone = useCallback(() => {
    audio.playCue('intro-done');
    writeIntroDone();
    setIntroDone(true);
  }, [audio]);

  const handleRestartToIntro = useCallback(() => {
    clearIntroDone();
    setIntroDone(false);
  }, []);

  if (!introDone) {
    return <IntroScreen onDone={handleIntroDone} />;
  }

  return <GameScreen audio={audio} onRestartToIntro={handleRestartToIntro} />;
}
