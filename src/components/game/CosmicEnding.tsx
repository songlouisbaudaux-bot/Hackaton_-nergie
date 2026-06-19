import { Infinity, RotateCcw, Sparkles } from 'lucide-react';

type CosmicEndingProps = {
  visible: boolean;
  onRestart: () => void;
};

const endings = [
  {
    title: 'Partage',
    body: 'L’énergie du vide est ouverte à toutes les civilisations. HELIOS cesse d’être une rivale.',
  },
  {
    title: 'Silence',
    body: 'La civilisation devient invisible, trop avancée pour laisser une trace énergétique.',
  },
  {
    title: 'Recommencement',
    body: 'La graine d’univers se referme, puis un nouveau Big Bang peut repartir.',
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
          Toute l’énergie de l’univers est disponible. Il ne reste plus une source à exploiter,
          seulement une décision.
        </p>

        <div className="cosmic-ending-choices">
          {endings.map((ending) => (
            <article className="cosmic-ending-choice" key={ending.title}>
              <Sparkles size={15} aria-hidden="true" />
              <strong>{ending.title}</strong>
              <span>{ending.body}</span>
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
