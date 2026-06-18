import { useEffect, useState } from 'react';
import { Play, SkipForward } from 'lucide-react';
import { assetPath } from '../../game';

const INTRO_VIDEO_SRC = '/assets/intro/prometheus-intro.mp4';

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
        src={INTRO_VIDEO_SRC}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={onDone}
        onError={() => setVideoMissing(true)}
      />

      {videoMissing ? (
        <div className="intro-fallback">
          <div className="intro-night">
            <img src={assetPath('fire-glow.png')} alt="" className="intro-glow" />
            <img src={assetPath('campfire.png')} alt="" className="intro-fire" />
          </div>
          <p className="intro-line">Avant le feu, la nuit decide pour nous.</p>
          <div className="intro-progress" />
        </div>
      ) : null}

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
