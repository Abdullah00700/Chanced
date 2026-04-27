import type { RarityKey } from "./types";

export type PetEffect = {
  coinMult?: number;
  xpMult?: number;
  rarityTilt?: number;
  rollSpeedMult?: number; // <1 = faster
};

export type PetDef = {
  id: string;
  name: string;
  rarity: RarityKey;
  effect: PetEffect;
  flavor: string;
  glyph: string; // single character symbol shown in the icon plate
  costCoins: number;
  costGems: number;
};

export const PETS: PetDef[] = [
  {
    id: "puppy",
    name: "Pup",
    rarity: "common",
    effect: { xpMult: 1.05 },
    flavor: "+5% XP per roll.",
    glyph: "P",
    costCoins: 200,
    costGems: 0,
  },
  {
    id: "bunny",
    name: "Bunny",
    rarity: "common",
    effect: { coinMult: 1.05 },
    flavor: "+5% coins per roll.",
    glyph: "B",
    costCoins: 200,
    costGems: 0,
  },
  {
    id: "cat",
    name: "Cat",
    rarity: "uncommon",
    effect: { xpMult: 1.12 },
    flavor: "+12% XP per roll.",
    glyph: "C",
    costCoins: 1500,
    costGems: 0,
  },
  {
    id: "wolf",
    name: "Wolf",
    rarity: "rare",
    effect: { coinMult: 1.2 },
    flavor: "+20% coins per roll.",
    glyph: "W",
    costCoins: 8000,
    costGems: 0,
  },
  {
    id: "tiger",
    name: "Tiger",
    rarity: "rare",
    effect: { xpMult: 1.25 },
    flavor: "+25% XP per roll.",
    glyph: "T",
    costCoins: 12000,
    costGems: 0,
  },
  {
    id: "leopard",
    name: "Leopard",
    rarity: "epic",
    effect: { rollSpeedMult: 0.5 },
    flavor: "Roll animation is 2x faster.",
    glyph: "L",
    costCoins: 60000,
    costGems: 1,
  },
  {
    id: "dragon",
    name: "Dragon",
    rarity: "epic",
    effect: { rarityTilt: 0.4 },
    flavor: "Pushes the rarity curve outward.",
    glyph: "D",
    costCoins: 80000,
    costGems: 2,
  },
  {
    id: "phoenix",
    name: "Phoenix",
    rarity: "legendary",
    effect: { xpMult: 1.5, rarityTilt: 0.2 },
    flavor: "+50% XP and small rarity tilt.",
    glyph: "X",
    costCoins: 350000,
    costGems: 5,
  },
  {
    id: "golden-dragon",
    name: "Golden Dragon",
    rarity: "legendary",
    effect: { coinMult: 3 },
    flavor: "Triples coins per roll.",
    glyph: "G",
    costCoins: 500000,
    costGems: 8,
  },
  {
    id: "cosmic-serpent",
    name: "Cosmic Serpent",
    rarity: "mythic",
    effect: { coinMult: 1.5, xpMult: 1.5, rarityTilt: 0.3, rollSpeedMult: 0.75 },
    flavor: "All boosts. Bends the cosmos.",
    glyph: "S",
    costCoins: 5_000_000,
    costGems: 50,
  },
];

export const PET_BY_ID: Record<string, PetDef> = PETS.reduce(
  (acc, p) => {
    acc[p.id] = p;
    return acc;
  },
  {} as Record<string, PetDef>,
);

// Pet drop divisors per rarity tier
const PET_DIVISOR: Record<RarityKey, number> = {
  common: 0, // no drops on common
  uncommon: 0,
  rare: 10,
  epic: 100,
  legendary: 1000,
  mythic: 10000,
};

/**
 * Decide if a pet drops on this roll. Returns the dropped pet ID or null.
 * Uses tier total probability divided by tier divisor as drop chance.
 */
export function rollPetDrop(
  tierProb: number,
  tier: RarityKey,
  ownedIds: Set<string>,
): string | null {
  const divisor = PET_DIVISOR[tier];
  if (!divisor) return null;
  const dropChance = tierProb / divisor;
  if (Math.random() > dropChance) return null;

  // Pick a random pet of that tier the player doesn't already own;
  // if all owned, allow a duplicate (which we treat as a no-op in UI).
  const tierPets = PETS.filter((p) => p.rarity === tier);
  if (tierPets.length === 0) return null;
  const unowned = tierPets.filter((p) => !ownedIds.has(p.id));
  const pool = unowned.length > 0 ? unowned : tierPets;
  return pool[Math.floor(Math.random() * pool.length)].id;
}

/**
 * Sum the total probability mass within a rarity tier in the current
 * distribution.
 */
export function tierProbability(
  probs: Float64Array,
  thresholdLow: number,
  thresholdHigh: number,
): number {
  // (Unused — we compute tier prob in App.tsx using rarityFor). Kept for API.
  void probs;
  void thresholdLow;
  void thresholdHigh;
  return 0;
}
