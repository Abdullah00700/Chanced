export type UpgradeKey = "coin" | "rarity";

export const COIN_UPGRADE_GEM_THRESHOLD = 50;
export const RARITY_UPGRADE_GEM_THRESHOLD = 50;

export function coinUpgradeMult(level: number): number {
  // each level adds 20% to coin gain
  return 1 + level * 0.2;
}

export function rarityUpgradeTilt(level: number): number {
  // 0..1 over first 50 levels (sigma flattening),
  // 1..2 over next 50 (U-shape blend), capped.
  return Math.min(2, level * 0.02);
}

export function coinUpgradeCost(level: number): {
  coins: number;
  gems: number;
} {
  const next = level + 1;
  const baseCoin = Math.floor(50 * Math.pow(1.6, level));
  if (next > COIN_UPGRADE_GEM_THRESHOLD) {
    const overflow = next - COIN_UPGRADE_GEM_THRESHOLD;
    return { coins: baseCoin, gems: Math.max(1, overflow) };
  }
  return { coins: baseCoin, gems: 0 };
}

export function rarityUpgradeCost(level: number): {
  coins: number;
  gems: number;
} {
  const next = level + 1;
  const baseCoin = Math.floor(150 * Math.pow(1.7, level));
  if (next > RARITY_UPGRADE_GEM_THRESHOLD) {
    const overflow = next - RARITY_UPGRADE_GEM_THRESHOLD;
    return { coins: baseCoin, gems: Math.max(1, overflow) };
  }
  return { coins: baseCoin, gems: 0 };
}

// ---- Boosters ----
export const COIN_BOOSTER_DURATION_MS = 60_000;
export const RARITY_BOOSTER_DURATION_MS = 60_000;
export const COIN_BOOSTER_COST = 750;
export const RARITY_BOOSTER_COST = 3000;
export const COIN_BOOSTER_MULT = 2;
