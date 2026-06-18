export function formatJoules(value: number) {
  return `${Math.floor(value).toLocaleString('fr-FR')} J`;
}

export function formatSignedJoules(value: number) {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${formatJoules(value)}`;
}

export function formatRate(value: number) {
  if (value === 0) return '0 J/s';
  if (value < 10) return `${value.toFixed(1)} J/s`;
  return `${Math.round(value)} J/s`;
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
