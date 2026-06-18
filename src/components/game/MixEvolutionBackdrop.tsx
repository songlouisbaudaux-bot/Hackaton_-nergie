import { ages, energySources, getAgeIndex, type AgeId, type SourceProduction } from '../../game';

type MixEvolutionBackdropProps = {
  activeAgeId: AgeId;
  production: SourceProduction[];
};

type GraphPoint = {
  x: number;
  y0: number;
  y1: number;
};

const graphWidth = 100;
const graphHeight = 100;
const graphPadding = 0;

function buildBandPath(points: GraphPoint[]) {
  const top = points.map((point) => `${point.x.toFixed(2)},${point.y1.toFixed(2)}`).join(' ');
  const bottom = [...points]
    .reverse()
    .map((point) => `${point.x.toFixed(2)},${point.y0.toFixed(2)}`)
    .join(' ');

  return `M ${top} L ${bottom} Z`;
}

export default function MixEvolutionBackdrop({
  activeAgeId,
  production,
}: MixEvolutionBackdropProps) {
  const activeAgeIndex = getAgeIndex(activeAgeId);
  const visibleAges = ages.slice(0, Math.max(1, activeAgeIndex + 1));
  const shareBySource = new Map(production.map((source) => [source.id, source.share]));

  const snapshots = visibleAges.map((age, ageIndex) => {
    const weights = energySources.map((source) => {
      const sourceAgeIndex = getAgeIndex(source.ageId);
      if (sourceAgeIndex > ageIndex) return 0;

      const currentShare = shareBySource.get(source.id) ?? 0;
      const ageBoost = 0.08 + Math.max(0, ageIndex - sourceAgeIndex) * 0.035;
      return Math.max(currentShare, ageBoost);
    });
    const total = weights.reduce((sum, weight) => sum + weight, 0) || 1;

    return weights.map((weight) => weight / total);
  });

  const renderedSnapshots = snapshots.length === 1 ? [snapshots[0], snapshots[0]] : snapshots;
  const step = renderedSnapshots.length > 1 ? graphWidth / (renderedSnapshots.length - 1) : graphWidth;
  const bands = energySources.map((source, sourceIndex) => {
    const points = renderedSnapshots.map((snapshot, ageIndex) => {
      const below = snapshot.slice(0, sourceIndex).reduce((sum, share) => sum + share, 0);
      const share = snapshot[sourceIndex] ?? 0;
      const x = ageIndex * step;
      const y0 = graphHeight - graphPadding - below * (graphHeight - graphPadding * 2);
      const y1 = graphHeight - graphPadding - (below + share) * (graphHeight - graphPadding * 2);

      return { x, y0, y1 };
    });

    return {
      id: source.id,
      color: source.color,
      path: buildBandPath(points),
    };
  });

  return (
    <div className="mix-evolution-backdrop" aria-hidden="true">
      <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} preserveAspectRatio="none">
        <g>
          {bands.map((band) => (
            <path d={band.path} fill={band.color} key={band.id} />
          ))}
        </g>
      </svg>
    </div>
  );
}
