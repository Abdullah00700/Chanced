import { CENTER, MAX_NUMBER, rarityFor } from "./rarity";
import type { RarityKey } from "./types";

export type Distribution = {
  probs: Float64Array;
  cum: Float64Array;
};

// Per-tier weight configuration. `s` = unnormalized weight at the inner
// (closer-to-center) boundary of the tier; `e` = weight at the outer boundary.
// Within a tier, weight decays exponentially from s -> e as |n - 5000| grows.
// `lo`/`hi` are the inclusive distance-from-center bounds for the tier.
//
// These numbers are tuned so that, with rarityTilt = 0, the tier totals
// land approximately at:
//   common ≈ 65%   (very common)
//   uncommon ≈ 25%
//   rare ≈ 8%
//   epic ≈ 1.5%
//   legendary ≈ 0.4%
//   mythic ≈ 0.1%   (≈ 1 in 1000)
const TIER_BASE: Record<RarityKey, { s: number; e: number; lo: number; hi: number }> = {
  common:    { s: 0.003001,  e: 0.000406,  lo: 0,    hi: 250 },
  uncommon:  { s: 0.001156,  e: 0.0001563, lo: 251,  hi: 500 },
  rare:      { s: 4.624e-5,  e: 6.252e-6,  lo: 501,  hi: 2500 },
  epic:      { s: 1.020e-5,  e: 1.379e-6,  lo: 2501, hi: 4200 },
  legendary: { s: 6.609e-6,  e: 8.937e-7,  lo: 4201, hi: 4900 },
  mythic:    { s: 1.156e-5,  e: 1.564e-6,  lo: 4901, hi: 5000 },
};

// `rarityTilt` ∈ [0, 2] multiplies the rarer tiers up so upgrades/boosters
// can meaningfully push players toward extremes.
function tierBoost(t: RarityKey, tilt: number): number {
  switch (t) {
    case "common":
      return 1;
    case "uncommon":
      return 1 + tilt * 0.05;
    case "rare":
      return 1 + tilt * 0.5;
    case "epic":
      return 1 + tilt * 2;
    case "legendary":
      return 1 + tilt * 5;
    case "mythic":
      return 1 + tilt * 10;
  }
}

export function buildDistribution(rarityTilt: number): Distribution {
  const tilt = Math.max(0, rarityTilt);
  const probs = new Float64Array(MAX_NUMBER + 1);
  const tmp = new Float64Array(MAX_NUMBER + 1);
  let sum = 0;

  for (let n = 0; n <= MAX_NUMBER; n++) {
    const d = Math.abs(n - CENTER);
    const tier = rarityFor(n).key;
    const cfg = TIER_BASE[tier];
    const span = Math.max(1, cfg.hi - cfg.lo);
    const t = Math.min(1, Math.max(0, (d - cfg.lo) / span));
    // exponential interpolation s -> e across the tier
    const w = cfg.s * Math.pow(cfg.e / cfg.s, t) * tierBoost(tier, tilt);
    tmp[n] = w;
    sum += w;
  }

  for (let n = 0; n <= MAX_NUMBER; n++) probs[n] = tmp[n] / sum;

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
 * If a rarity booster is active, draw multiple samples and keep the most
 * extreme (rarest by distance from center).
 */
export function sampleWithBoost(cum: Float64Array, boosted: boolean): number {
  if (!boosted) return sampleFromCdf(cum);
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
