export function formatJoules(value: number) {
  const roundedValue = Math.floor(value);

  if (Math.abs(roundedValue) >= 1000000) {
    return `${new Intl.NumberFormat('fr-FR', {
      maximumFractionDigits: 1,
      notation: 'compact',
    }).format(roundedValue)} J`;
  }

  return `${roundedValue.toLocaleString('fr-FR')} J`;
}

export function formatSignedJoules(value: number) {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${formatJoules(value)}`;
}

export function formatRate(value: number) {
  if (value === 0) return '0 J/s';
  if (value < 10) return `${value.toFixed(1)} J/s`;
  if (value >= 1000000) {
    return `${new Intl.NumberFormat('fr-FR', {
      maximumFractionDigits: 1,
      notation: 'compact',
    }).format(value)} J/s`;
  }
  return `${Math.round(value)} J/s`;
}

export function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '';
  if (seconds < 60) return `${Math.ceil(seconds)} s`;
  if (seconds < 3600) return `${Math.ceil(seconds / 60)} min`;

  return `${Math.ceil(seconds / 3600)} h`;
}

export function formatUnitExtension(valueInJoules: number) {
  const wattHours = valueInJoules / 3600;
  const kiloWattHours = wattHours / 1000;

  return {
    joules: valueInJoules,
    wattHours,
    kiloWattHours,
  };
}
