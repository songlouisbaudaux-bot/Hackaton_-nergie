import { useEffect, useState } from 'react';
import { Play, SkipForward } from 'lucide-react';
import { assetPath } from '../game/config';

type IntroScreenProps = {
  onDone: () => void;
};

export default function IntroScreen({ onDone }: IntroScreenProps) {
  const [videoMissing, setVideoMissing] = useState(false);

  useEffect(() => {
    if (!videoMissing) return undefined;

    const timer = window.setTimeout(onDone, 7200);
    return () => window.clearTimeout(timer);
  }, [onDone, videoMissing]);

  return (
    <main className="intro-screen">
      <video
        className="intro-video"
        src="/assets/intro/prometheus-intro.mp4"
        autoPlay
        muted
        playsInline
        onEnded={onDone}
        onError={() => setVideoMissing(true)}
      />

      <div className="intro-fallback" aria-hidden={!videoMissing}>
        <div className="intro-night">
          <img src={assetPath('fire-glow.png')} alt="" className="intro-glow" />
          <img src={assetPath('campfire.png')} alt="" className="intro-fire" />
        </div>
        <p className="intro-line">Avant le feu, la nuit décide pour nous.</p>
        <div className="intro-progress" />
      </div>

      <button className="intro-skip" type="button" onClick={onDone}>
        <SkipForward size={18} aria-hidden="true" />
        Passer
      </button>

      <button className="intro-enter" type="button" onClick={onDone}>
        <Play size={18} aria-hidden="true" />
        Entrer dans le campement
      </button>
    </main>
  );
}
