import { CENTER, MAX_NUMBER } from "./rarity";

const BASE_SIGMA = 1700;

function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1.0 / (1.0 + p * ax);
  const y =
    1.0 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) *
      t *
      Math.exp(-ax * ax);
  return sign * y;
}

function normalCdf(x: number, mu: number, sigma: number): number {
  return 0.5 * (1 + erf((x - mu) / (sigma * Math.SQRT2)));
}

export type Distribution = {
  probs: Float64Array;
  cum: Float64Array;
};

/**
 * Build a distribution influenced by:
 *   rarityTilt: 0 = pure Gaussian (center heavy)
 *               0..1 = sigma grows (flatter)
 *               1..2 = blends in U-shape (edges heavier)
 *               2 = full U-shape (extreme rolls common)
 */
export function buildDistribution(rarityTilt: number): Distribution {
  const t = Math.max(0, rarityTilt);
  const sigmaT = Math.min(1, t);
  const blendT = Math.max(0, Math.min(1, t - 1));
  const sigma = BASE_SIGMA + sigmaT * BASE_SIGMA; // up to 2x

  const probs = new Float64Array(MAX_NUMBER + 1);

  if (blendT === 0) {
    const lo = normalCdf(-0.5, CENTER, sigma);
    const hi = normalCdf(MAX_NUMBER + 0.5, CENTER, sigma);
    const total = hi - lo;
    for (let n = 0; n <= MAX_NUMBER; n++) {
      probs[n] =
        (normalCdf(n + 0.5, CENTER, sigma) -
          normalCdf(n - 0.5, CENTER, sigma)) /
        total;
    }
  } else {
    // Mix Gaussian + U-shape (1 + (d/CENTER)^2 weight)
    let sum = 0;
    const tmp = new Float64Array(MAX_NUMBER + 1);
    for (let n = 0; n <= MAX_NUMBER; n++) {
      const d = n - CENTER;
      const gauss = Math.exp(-(d * d) / (2 * sigma * sigma));
      const ushape = 0.05 + Math.pow(Math.abs(d) / CENTER, 2) * 4;
      const w = (1 - blendT) * gauss + blendT * ushape;
      tmp[n] = w;
      sum += w;
    }
    for (let n = 0; n <= MAX_NUMBER; n++) probs[n] = tmp[n] / sum;
  }

  const cum = new Float64Array(MAX_NUMBER + 1);
  let s = 0;
  for (let n = 0; n <= MAX_NUMBER; n++) {
    s += probs[n];
    cum[n] = s;
  }
  return { probs, cum };
}

export function sampleFromCdf(cum: Float64Array): number {
  const r = Math.random() * cum[cum.length - 1];
  let lo = 0;
  let hi = cum.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (cum[mid] < r) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/**
 * If a rarity booster is active, bias the sample by re-rolling
 * common/uncommon results with some probability (giving more high-tier hits).
 */
export function sampleWithBoost(
  cum: Float64Array,
  boosted: boolean,
): number {
  if (!boosted) return sampleFromCdf(cum);
  // Up to 3 attempts, take the most extreme (rarest) one
  let best = sampleFromCdf(cum);
  let bestExtreme = Math.abs(best - CENTER);
  for (let i = 0; i < 2; i++) {
    const c = sampleFromCdf(cum);
    const ce = Math.abs(c - CENTER);
    if (ce > bestExtreme) {
      best = c;
      bestExtreme = ce;
    }
  }
  return best;
}
