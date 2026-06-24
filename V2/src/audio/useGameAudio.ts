import { useCallback, useEffect, useMemo, useState } from 'react';
import { defaultAudioSettings, GameAudioEngine } from './engine';
import type { AudioCueId, AudioSettings, GameAudioController } from './types';

const AUDIO_SETTINGS_STORAGE_KEY = 'prometheus-protocol:v2:audio:v2';
const gameAudioEngine = new GameAudioEngine();

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function cleanVolume(value: unknown, fallback: number) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;

  return Math.min(1, Math.max(0, value));
}

function readAudioSettings(): AudioSettings {
  if (typeof window === 'undefined') return defaultAudioSettings;

  try {
    const rawSettings = window.localStorage.getItem(AUDIO_SETTINGS_STORAGE_KEY);
    if (!rawSettings) return defaultAudioSettings;

    const parsed: unknown = JSON.parse(rawSettings);
    if (!isObject(parsed)) return defaultAudioSettings;

    return {
      enabled:
        typeof parsed.enabled === 'boolean'
          ? parsed.enabled
          : defaultAudioSettings.enabled,
      masterVolume: cleanVolume(parsed.masterVolume, defaultAudioSettings.masterVolume),
      musicVolume: cleanVolume(parsed.musicVolume, defaultAudioSettings.musicVolume),
      sfxVolume: cleanVolume(parsed.sfxVolume, defaultAudioSettings.sfxVolume),
    };
  } catch {
    return defaultAudioSettings;
  }
}

function writeAudioSettings(settings: AudioSettings) {
  try {
    window.localStorage.setItem(AUDIO_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // L'audio reste utilisable meme si le stockage local refuse l'ecriture.
  }
}

export function useGameAudio(): GameAudioController {
  const [settings, setSettings] = useState<AudioSettings>(readAudioSettings);

  useEffect(() => {
    gameAudioEngine.configure(settings);
    writeAudioSettings(settings);
  }, [settings]);

  const playCue = useCallback((cueId: AudioCueId) => {
    gameAudioEngine.playCue(cueId);
  }, []);

  const setAge = useCallback((ageId: string) => {
    gameAudioEngine.setAge(ageId);
  }, []);

  const setEnabled = useCallback((enabled: boolean) => {
    setSettings((current) => ({
      ...current,
      enabled,
    }));
    gameAudioEngine.setEnabled(enabled);
  }, []);

  const toggleEnabled = useCallback(() => {
    setSettings((current) => {
      const next = {
        ...current,
        enabled: !current.enabled,
      };
      gameAudioEngine.setEnabled(next.enabled);
      return next;
    });
  }, []);

  return useMemo(
    () => ({
      settings,
      supported: gameAudioEngine.supported,
      playCue,
      setAge,
      setEnabled,
      toggleEnabled,
    }),
    [playCue, setAge, setEnabled, settings, toggleEnabled],
  );
}
