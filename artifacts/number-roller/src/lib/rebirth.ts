// Rebirth system. Resets coins; in exchange grants permanent stacking
// multipliers for coins/XP and a small additive rarity tilt. Capped at 30.

export const MAX_REBIRTH = 30;

/** Coin cost (in coins) to reach rebirth N+1 from N. Starts at 100k, scales up. */
export function rebirthCost(currentRebirth: number): number {
  if (currentRebirth >= MAX_REBIRTH) return Number.POSITIVE_INFINITY;
  // 100k * 1.4^N — nice exponential ramp; reaches ~7.4B at r=29.
  return Math.floor(100_000 * Math.pow(1.4, currentRebirth));
}

/** Coin multiplier from rebirth count (compounding 1.5x per rebirth). */
export function rebirthCoinMult(rebirths: number): number {
  return Math.pow(1.5, rebirths);
}

/** XP multiplier from rebirth count (compounding 2x per rebirth, also affects pet "exp"). */
export function rebirthXpMult(rebirths: number): number {
  return Math.pow(2, rebirths);
}

/** Additive rarity tilt from rebirths (small "better rolls" buff per rebirth). */
export function rebirthRarityTilt(rebirths: number): number {
  return rebirths * 0.05;
}
