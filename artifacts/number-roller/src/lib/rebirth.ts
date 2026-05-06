// Rebirth system. Resets coins; in exchange grants permanent stacking
// multipliers for coins/XP and a small additive rarity tilt. Capped at 30.

export const MAX_REBIRTH = 30;

/** Coin cost (in coins) to reach rebirth N+1 from N. Starts at 100k, scales up. */
export function rebirthCost(currentRebirth: number): number {
  if (currentRebirth >= MAX_REBIRTH) return Number.POSITIVE_INFINITY;
  return Math.floor(100_000 * Math.pow(1.4, currentRebirth));
}

/**
 * Coin multiplier from rebirth count.
 * Formula: 1 + n * 0.5 (each rebirth adds 50%, linear — not exponential).
 * Rebirth 0 → ×1.0, Rebirth 1 → ×1.5, Rebirth 10 → ×6.0, Rebirth 30 → ×16.
 */
export function rebirthCoinMult(rebirths: number): number {
  if (rebirths <= 0) return 1;
  return 1 + rebirths * 0.5;
}

/**
 * XP multiplier from rebirth count.
 * Formula: 1 + n * 1.0 (each rebirth adds 100%, linear — not exponential).
 * Rebirth 0 → ×1.0, Rebirth 1 → ×2.0, Rebirth 10 → ×11.0.
 */
export function rebirthXpMult(rebirths: number): number {
  if (rebirths <= 0) return 1;
  return 1 + rebirths * 1.0;
}

/** Additive rarity tilt from rebirths (small "better rolls" buff per rebirth). */
export function rebirthRarityTilt(rebirths: number): number {
  return rebirths * 0.05;
}
