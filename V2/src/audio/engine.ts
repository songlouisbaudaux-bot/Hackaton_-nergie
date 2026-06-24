import type { AudioCueId, AudioSettings } from './types';

type AudioContextConstructor = typeof AudioContext;
type WindowWithWebAudio = Window & {
  AudioContext?: AudioContextConstructor;
  webkitAudioContext?: AudioContextConstructor;
};

type MusicTheme = {
  baseFrequency: number;
  waveform: OscillatorType;
  intervalMs: number;
  scale: number[];
  volume: number;
  drone: boolean;
};

const PENTATONIC = [0, 2, 4, 7, 9, 12, 14, 16];
const COSMIC_SCALE = [0, 3, 5, 7, 10, 12, 15, 17];

const musicThemes: Record<string, MusicTheme> = {
  biomass: {
    baseFrequency: 196,
    waveform: 'triangle',
    intervalMs: 1800,
    scale: PENTATONIC,
    volume: 0.9,
    drone: true,
  },
  'animal-power': {
    baseFrequency: 174.61,
    waveform: 'sine',
    intervalMs: 1680,
    scale: [0, 2, 5, 7, 9, 12, 14, 17],
    volume: 0.86,
    drone: true,
  },
  'water-wind': {
    baseFrequency: 220,
    waveform: 'sine',
    intervalMs: 1500,
    scale: PENTATONIC,
    volume: 0.84,
    drone: false,
  },
  fossil: {
    baseFrequency: 164.81,
    waveform: 'triangle',
    intervalMs: 1320,
    scale: [0, 3, 5, 7, 10, 12, 15, 17],
    volume: 0.8,
    drone: true,
  },
  atomic: {
    baseFrequency: 246.94,
    waveform: 'sine',
    intervalMs: 1260,
    scale: [0, 2, 4, 7, 11, 12, 14, 16],
    volume: 0.76,
    drone: true,
  },
  fusion: {
    baseFrequency: 261.63,
    waveform: 'triangle',
    intervalMs: 1160,
    scale: [0, 4, 7, 9, 12, 16, 19, 21],
    volume: 0.74,
    drone: true,
  },
  'orbital-solar': {
    baseFrequency: 293.66,
    waveform: 'sine',
    intervalMs: 1080,
    scale: PENTATONIC,
    volume: 0.72,
    drone: false,
  },
  'neutron-wells': {
    baseFrequency: 207.65,
    waveform: 'sine',
    intervalMs: 980,
    scale: COSMIC_SCALE,
    volume: 0.68,
    drone: true,
  },
  antimatter: {
    baseFrequency: 233.08,
    waveform: 'triangle',
    intervalMs: 940,
    scale: COSMIC_SCALE,
    volume: 0.66,
    drone: false,
  },
  'black-hole': {
    baseFrequency: 146.83,
    waveform: 'sine',
    intervalMs: 1120,
    scale: [0, 3, 7, 10, 12, 15, 19, 22],
    volume: 0.62,
    drone: true,
  },
  dyson: {
    baseFrequency: 329.63,
    waveform: 'triangle',
    intervalMs: 920,
    scale: [0, 2, 4, 7, 9, 12, 16, 19],
    volume: 0.64,
    drone: true,
  },
  vacuum: {
    baseFrequency: 392,
    waveform: 'sine',
    intervalMs: 860,
    scale: [0, 5, 7, 12, 17, 19, 24],
    volume: 0.58,
    drone: false,
  },
};

const cueCooldowns: Partial<Record<AudioCueId, number>> = {
  'manual-click': 180,
  blocked: 280,
  purchase: 90,
  technology: 140,
  breakthrough: 320,
};

const defaultSettings: AudioSettings = {
  enabled: true,
  masterVolume: 0.7,
  musicVolume: 0.42,
  sfxVolume: 0.72,
};

function getAudioContextConstructor() {
  if (typeof window === 'undefined') return undefined;

  const audioWindow = window as WindowWithWebAudio;
  return audioWindow.AudioContext ?? audioWindow.webkitAudioContext;
}

function clampVolume(value: number) {
  return Math.min(1, Math.max(0, value));
}

function frequency(base: number, semitones: number) {
  return base * 2 ** (semitones / 12);
}

export class GameAudioEngine {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private settings = defaultSettings;
  private currentAgeId = 'biomass';
  private musicTimer: number | null = null;
  private musicStep = 0;
  private lastCueAt = new Map<AudioCueId, number>();

  get supported() {
    return Boolean(getAudioContextConstructor());
  }

  configure(settings: AudioSettings) {
    this.settings = {
      enabled: settings.enabled,
      masterVolume: clampVolume(settings.masterVolume),
      musicVolume: clampVolume(settings.musicVolume),
      sfxVolume: clampVolume(settings.sfxVolume),
    };

    this.applyVolumes();

    if (!this.settings.enabled) {
      this.stopMusic();
    }
  }

  setAge(ageId: string) {
    if (this.currentAgeId === ageId) return;

    this.currentAgeId = ageId;
    this.musicStep = 0;
    this.restartMusic();
  }

  setEnabled(enabled: boolean) {
    this.configure({
      ...this.settings,
      enabled,
    });

    if (enabled) {
      void this.ensureStarted();
    } else {
      this.stopMusic();
    }
  }

  playCue(cueId: AudioCueId) {
    if (!this.settings.enabled || !this.supported) return;

    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const cooldown = cueCooldowns[cueId] ?? 0;
    const previous = this.lastCueAt.get(cueId) ?? Number.NEGATIVE_INFINITY;
    if (now - previous < cooldown) return;
    this.lastCueAt.set(cueId, now);

    void this.ensureStarted().then((started) => {
      if (!started) return;
      this.playCueNow(cueId);
    });
  }

  async ensureStarted() {
    if (!this.settings.enabled || !this.supported) return false;

    this.ensureContext();

    if (!this.context) return false;

    if (this.context.state === 'suspended') {
      try {
        await this.context.resume();
      } catch {
        return false;
      }
    }

    this.startMusic();
    return this.context.state === 'running';
  }

  private ensureContext() {
    if (this.context) return;

    const AudioContextCtor = getAudioContextConstructor();
    if (!AudioContextCtor) return;

    const context = new AudioContextCtor();
    const masterGain = context.createGain();
    const musicGain = context.createGain();
    const sfxGain = context.createGain();
    const compressor = context.createDynamicsCompressor();

    compressor.threshold.value = -22;
    compressor.knee.value = 24;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.005;
    compressor.release.value = 0.18;

    musicGain.connect(masterGain);
    sfxGain.connect(masterGain);
    masterGain.connect(compressor);
    compressor.connect(context.destination);

    this.context = context;
    this.masterGain = masterGain;
    this.musicGain = musicGain;
    this.sfxGain = sfxGain;
    this.compressor = compressor;
    this.applyVolumes();
  }

  private applyVolumes() {
    if (!this.context || !this.masterGain || !this.musicGain || !this.sfxGain) return;

    const time = this.context.currentTime;
    this.masterGain.gain.setTargetAtTime(
      this.settings.enabled ? this.settings.masterVolume : 0,
      time,
      0.04,
    );
    this.musicGain.gain.setTargetAtTime(this.settings.musicVolume, time, 0.08);
    this.sfxGain.gain.setTargetAtTime(this.settings.sfxVolume, time, 0.03);
  }

  private startMusic() {
    if (!this.context || this.musicTimer !== null || !this.settings.enabled) return;

    this.playMusicStep();
    this.musicTimer = window.setInterval(() => {
      this.playMusicStep();
    }, this.getTheme().intervalMs);
  }

  private stopMusic() {
    if (this.musicTimer === null) return;

    window.clearInterval(this.musicTimer);
    this.musicTimer = null;
  }

  private restartMusic() {
    const wasPlaying = this.musicTimer !== null;
    this.stopMusic();
    if (wasPlaying && this.settings.enabled) {
      this.startMusic();
    }
  }

  private getTheme() {
    return musicThemes[this.currentAgeId] ?? musicThemes.biomass;
  }

  private playMusicStep() {
    if (!this.context || !this.musicGain || !this.settings.enabled) return;

    const theme = this.getTheme();
    const step = this.musicStep;
    const semitone = theme.scale[step % theme.scale.length];
    const accent = step % 4 === 0 ? 1.25 : 1;
    const noteFrequency = frequency(theme.baseFrequency, semitone);
    const now = this.context.currentTime + 0.015;

    this.playTone({
      frequency: noteFrequency,
      duration: 0.48,
      type: theme.waveform,
      gain: 0.018 * theme.volume * accent,
      destination: this.musicGain,
      when: now,
    });

    if (theme.drone && step % 4 === 0) {
      this.playTone({
        frequency: theme.baseFrequency / 2,
        duration: 1.2,
        type: 'sine',
        gain: 0.012 * theme.volume,
        destination: this.musicGain,
        when: now,
      });
    }

    this.musicStep += 1;
  }

  private playCueNow(cueId: AudioCueId) {
    if (!this.context || !this.sfxGain) return;

    const now = this.context.currentTime + 0.006;

    switch (cueId) {
      case 'manual-click':
        this.playTone({ frequency: 523.25, duration: 0.075, type: 'triangle', gain: 0.05, destination: this.sfxGain, when: now });
        this.playTone({ frequency: 783.99, duration: 0.09, type: 'sine', gain: 0.025, destination: this.sfxGain, when: now + 0.035 });
        break;
      case 'purchase':
        this.playArpeggio([329.63, 392, 493.88], 0.062, 0.042, 'triangle', now);
        break;
      case 'blocked':
        this.playTone({ frequency: 146.83, duration: 0.14, type: 'sine', gain: 0.034, destination: this.sfxGain, when: now, glideTo: 110 });
        this.playTone({ frequency: 98, duration: 0.12, type: 'sine', gain: 0.02, destination: this.sfxGain, when: now + 0.075 });
        break;
      case 'technology':
        this.playArpeggio([659.25, 783.99, 987.77, 1318.51], 0.052, 0.033, 'sine', now);
        this.playNoise(0.16, 0.012, 1800, now);
        break;
      case 'age-transition':
        this.playArpeggio([196, 293.66, 392, 523.25, 783.99], 0.09, 0.05, 'triangle', now);
        this.playNoise(0.32, 0.018, 900, now + 0.03);
        break;
      case 'breakthrough':
        this.playArpeggio([392, 587.33, 783.99, 1174.66], 0.07, 0.044, 'sine', now);
        break;
      case 'ending':
        this.playChord([196, 293.66, 392, 587.33], 1.8, 0.03, 'sine', now);
        this.playArpeggio([783.99, 987.77, 1174.66, 1567.98], 0.18, 0.026, 'triangle', now + 0.3);
        break;
      case 'restart':
        this.playArpeggio([493.88, 392, 293.66, 392], 0.06, 0.04, 'triangle', now);
        break;
      case 'sandbox':
        this.playArpeggio([261.63, 392, 554.37, 739.99], 0.055, 0.036, 'sine', now);
        break;
      case 'intro-done':
        this.playChord([196, 246.94, 329.63], 0.65, 0.028, 'triangle', now);
        break;
      default:
        break;
    }
  }

  private playArpeggio(
    frequencies: number[],
    spacing: number,
    gain: number,
    type: OscillatorType,
    startAt: number,
  ) {
    if (!this.sfxGain) return;

    frequencies.forEach((itemFrequency, index) => {
      this.playTone({
        frequency: itemFrequency,
        duration: 0.16,
        type,
        gain,
        destination: this.sfxGain!,
        when: startAt + index * spacing,
      });
    });
  }

  private playChord(
    frequencies: number[],
    duration: number,
    gain: number,
    type: OscillatorType,
    when: number,
  ) {
    if (!this.sfxGain) return;

    frequencies.forEach((itemFrequency) => {
      this.playTone({
        frequency: itemFrequency,
        duration,
        type,
        gain,
        destination: this.sfxGain!,
        when,
      });
    });
  }

  private playTone({
    frequency: startFrequency,
    duration,
    type,
    gain,
    destination,
    when,
    glideTo,
  }: {
    frequency: number;
    duration: number;
    type: OscillatorType;
    gain: number;
    destination: AudioNode;
    when: number;
    glideTo?: number;
  }) {
    if (!this.context) return;

    const oscillator = this.context.createOscillator();
    const envelope = this.context.createGain();
    const releaseAt = when + duration;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(startFrequency, when);
    if (glideTo) {
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, glideTo), releaseAt);
    }

    envelope.gain.setValueAtTime(0.0001, when);
    envelope.gain.exponentialRampToValueAtTime(Math.max(0.0001, gain), when + 0.018);
    envelope.gain.exponentialRampToValueAtTime(0.0001, releaseAt);

    oscillator.connect(envelope);
    envelope.connect(destination);
    oscillator.start(when);
    oscillator.stop(releaseAt + 0.04);
  }

  private playNoise(duration: number, gain: number, filterFrequency: number, when: number) {
    if (!this.context || !this.sfxGain) return;

    const sampleRate = this.context.sampleRate;
    const frameCount = Math.floor(sampleRate * duration);
    const buffer = this.context.createBuffer(1, frameCount, sampleRate);
    const data = buffer.getChannelData(0);

    for (let index = 0; index < frameCount; index += 1) {
      data[index] = (Math.random() * 2 - 1) * (1 - index / frameCount);
    }

    const source = this.context.createBufferSource();
    const filter = this.context.createBiquadFilter();
    const envelope = this.context.createGain();

    filter.type = 'bandpass';
    filter.frequency.value = filterFrequency;
    filter.Q.value = 0.8;
    envelope.gain.setValueAtTime(0.0001, when);
    envelope.gain.exponentialRampToValueAtTime(gain, when + 0.02);
    envelope.gain.exponentialRampToValueAtTime(0.0001, when + duration);

    source.buffer = buffer;
    source.connect(filter);
    filter.connect(envelope);
    envelope.connect(this.sfxGain);
    source.start(when);
    source.stop(when + duration + 0.03);
  }
}

export const defaultAudioSettings = defaultSettings;
