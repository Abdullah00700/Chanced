export function chancePctFromProb(p: number): string {
  const pct = p * 100;
  if (pct === 0) return "0.000%";
  if (pct >= 0.001) return pct.toFixed(3) + "%";
  return pct.toExponential(3) + "%";
}

export function formatNumber(n: number): string {
  if (n < 1000) return n.toString();
  if (n < 1_000_000) return (n / 1000).toFixed(n < 10_000 ? 2 : 1) + "K";
  if (n < 1_000_000_000) return (n / 1_000_000).toFixed(n < 10_000_000 ? 2 : 1) + "M";
  return (n / 1_000_000_000).toFixed(2) + "B";
}

export function formatCompact(n: number): string {
  return formatNumber(Math.floor(n));
}

export function formatTimeLeft(ms: number): string {
  if (ms <= 0) return "0s";
  const sec = Math.ceil(ms / 1000);
  if (sec < 60) return sec + "s";
  const min = Math.floor(sec / 60);
  const rem = sec % 60;
  return `${min}m ${rem}s`;
}
