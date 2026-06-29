export type AudioCueId =
  | 'manual-click'
  | 'purchase'
  | 'blocked'
  | 'technology'
  | 'impulse'
  | 'age-transition'
  | 'breakthrough'
  | 'ending'
  | 'restart'
  | 'sandbox'
  | 'intro-done';

export type AudioSettings = {
  enabled: boolean;
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
};

export type GameAudioController = {
  settings: AudioSettings;
  supported: boolean;
  playCue: (cueId: AudioCueId) => void;
  setAge: (ageId: string) => void;
  setEnabled: (enabled: boolean) => void;
  toggleEnabled: () => void;
};
