import { Infinity, RotateCcw, Sparkles } from 'lucide-react';

type CosmicEndingProps = {
  visible: boolean;
  onRestart: () => void;
};

const endingBeats = [
  {
    title: 'Maîtrise',
    body: 'Le feu, l’eau, la vapeur, l’atome et les étoiles deviennent un seul réseau.',
  },
  {
    title: 'Silence',
    body: 'La civilisation n’a plus besoin de brûler le monde pour avancer.',
  },
  {
    title: 'Recommencement',
    body: 'La graine d’univers s’ouvre : une nouvelle partie peut commencer.',
  },
];

export default function CosmicEnding({ visible, onRestart }: CosmicEndingProps) {
  if (!visible) return null;

  return (
    <section className="cosmic-ending" aria-label="Fin de l’univers">
      <div className="cosmic-ending-visual" aria-hidden="true">
        <span className="cosmic-ring cosmic-ring--outer" />
        <span className="cosmic-ring cosmic-ring--middle" />
        <span className="cosmic-core" />
      </div>

      <div className="panel cosmic-ending-panel">
        <div className="cosmic-ending-title">
          <Infinity size={22} aria-hidden="true" />
          <div>
            <span className="metric-kicker">Fin de partie</span>
            <h2>Le vide répond</h2>
          </div>
        </div>
        <p>
          Toute l’énergie disponible a été apprivoisée. La progression ne continue plus vers une
          machine plus grosse : elle boucle vers un nouvel univers.
        </p>

        <div className="cosmic-ending-beats">
          {endingBeats.map((beat, index) => (
            <article className="cosmic-ending-beat" data-index={index} key={beat.title}>
              <Sparkles size={15} aria-hidden="true" />
              <strong>{beat.title}</strong>
              <span>{beat.body}</span>
            </article>
          ))}
        </div>

        <button className="cosmic-restart-button" type="button" onClick={onRestart}>
          <RotateCcw size={16} aria-hidden="true" />
          Recommencer l’univers
        </button>
      </div>
    </section>
  );
}
