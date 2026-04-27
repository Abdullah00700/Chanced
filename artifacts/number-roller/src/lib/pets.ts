import { RARITY_RANK, RARITY_BY_KEY } from "./rarity";
import type { PetInstance, RarityKey } from "./types";

export type PetEffect = {
  coinMult?: number;
  xpMult?: number;
  rarityTilt?: number;
  rollSpeedMult?: number; // <1 = faster
};

export type PetDef = {
  id: string;
  name: string;
  baseRarity: RarityKey;
  effect: PetEffect;
  flavor: string;
  /** Cartoon SVG glyph identifier — see PetArt.tsx */
  art: string;
  costCoins: number;
  costGems: number;
};

// Rarity progression tiers for pet evolution.
// Pet level → current rarity bracket:
//   1-10  common, 11-20 uncommon, 21-30 rare, 31-40 epic,
//   41-50 legendary, 51+ mythic.
// Unobtainable pets ignore evolution and stay unobtainable.
const TIER_LEVEL_START: Record<RarityKey, number> = {
  common: 1,
  uncommon: 11,
  rare: 21,
  epic: 31,
  legendary: 41,
  mythic: 51,
  unobtainable: 1, // unobtainable pets do not evolve
};

const NORMAL_TIERS: RarityKey[] = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "mythic",
];

// Multiplier ADDED on each evolution step (to the bonus portion of an effect).
// e.g. common→uncommon multiplies bonuses by 1.25, uncommon→rare by 1.20, etc.
const EVOLUTION_BOOST: Partial<Record<RarityKey, number>> = {
  uncommon: 0.25, // when evolving INTO uncommon
  rare: 0.2, // INTO rare
  epic: 0.15, // INTO epic
  legendary: 0.1, // INTO legendary
  mythic: 0.5, // INTO mythic
};

const PER_LEVEL_BONUS = 0.005; // +0.5% per pet level inside a tier
const MAX_PET_LEVEL = 60; // hard cap

export const PETS: PetDef[] = [
  // ---- COMMON (5) ----
  {
    id: "puppy",
    name: "Pup",
    baseRarity: "common",
    effect: { xpMult: 1.05 },
    flavor: "+5% XP per roll.",
    art: "pup",
    costCoins: 150,
    costGems: 0,
  },
  {
    id: "bunny",
    name: "Bunny",
    baseRarity: "common",
    effect: { coinMult: 1.05 },
    flavor: "+5% coins per roll.",
    art: "bunny",
    costCoins: 150,
    costGems: 0,
  },
  {
    id: "chick",
    name: "Chick",
    baseRarity: "common",
    effect: { xpMult: 1.04, coinMult: 1.04 },
    flavor: "+4% XP and +4% coins.",
    art: "chick",
    costCoins: 250,
    costGems: 0,
  },
  {
    id: "mouse",
    name: "Mouse",
    baseRarity: "common",
    effect: { rollSpeedMult: 0.9 },
    flavor: "Roll 10% faster.",
    art: "mouse",
    costCoins: 350,
    costGems: 0,
  },
  {
    id: "frog",
    name: "Frog",
    baseRarity: "common",
    effect: { coinMult: 1.08 },
    flavor: "+8% coins per roll.",
    art: "frog",
    costCoins: 500,
    costGems: 0,
  },

  // ---- UNCOMMON (4) ----
  {
    id: "cat",
    name: "Cat",
    baseRarity: "uncommon",
    effect: { xpMult: 1.12 },
    flavor: "+12% XP per roll.",
    art: "cat",
    costCoins: 1500,
    costGems: 0,
  },
  {
    id: "foxie",
    name: "Fox",
    baseRarity: "uncommon",
    effect: { coinMult: 1.15 },
    flavor: "+15% coins per roll.",
    art: "fox",
    costCoins: 2000,
    costGems: 0,
  },
  {
    id: "raccoon",
    name: "Raccoon",
    baseRarity: "uncommon",
    effect: { coinMult: 1.1, rollSpeedMult: 0.85 },
    flavor: "+10% coins, 15% faster rolls.",
    art: "raccoon",
    costCoins: 3000,
    costGems: 0,
  },
  {
    id: "hedgehog",
    name: "Hedgehog",
    baseRarity: "uncommon",
    effect: { xpMult: 1.1, rarityTilt: 0.05 },
    flavor: "+10% XP and tiny rarity tilt.",
    art: "hedgehog",
    costCoins: 4000,
    costGems: 0,
  },

  // ---- RARE (4) ----
  {
    id: "wolf",
    name: "Wolf",
    baseRarity: "rare",
    effect: { coinMult: 1.2 },
    flavor: "+20% coins per roll.",
    art: "wolf",
    costCoins: 8000,
    costGems: 0,
  },
  {
    id: "tiger",
    name: "Tiger",
    baseRarity: "rare",
    effect: { xpMult: 1.25 },
    flavor: "+25% XP per roll.",
    art: "tiger",
    costCoins: 12000,
    costGems: 0,
  },
  {
    id: "panda",
    name: "Panda",
    baseRarity: "rare",
    effect: { coinMult: 1.18, xpMult: 1.18 },
    flavor: "+18% coins and +18% XP.",
    art: "panda",
    costCoins: 15000,
    costGems: 0,
  },
  {
    id: "penguin",
    name: "Penguin",
    baseRarity: "rare",
    effect: { rollSpeedMult: 0.65, coinMult: 1.1 },
    flavor: "Much faster rolls, +10% coins.",
    art: "penguin",
    costCoins: 18000,
    costGems: 0,
  },

  // ---- EPIC (3) ----
  {
    id: "leopard",
    name: "Leopard",
    baseRarity: "epic",
    effect: { rollSpeedMult: 0.5 },
    flavor: "Roll animation is 2× faster.",
    art: "leopard",
    costCoins: 60000,
    costGems: 1,
  },
  {
    id: "dragon",
    name: "Dragon",
    baseRarity: "epic",
    effect: { rarityTilt: 0.4 },
    flavor: "Pushes the rarity curve outward.",
    art: "dragon",
    costCoins: 80000,
    costGems: 2,
  },
  {
    id: "griffin",
    name: "Griffin",
    baseRarity: "epic",
    effect: { coinMult: 1.5, xpMult: 1.3 },
    flavor: "+50% coins and +30% XP.",
    art: "griffin",
    costCoins: 120000,
    costGems: 3,
  },

  // ---- LEGENDARY (2) ----
  {
    id: "phoenix",
    name: "Phoenix",
    baseRarity: "legendary",
    effect: { xpMult: 1.5, rarityTilt: 0.2 },
    flavor: "+50% XP and small rarity tilt.",
    art: "phoenix",
    costCoins: 350000,
    costGems: 5,
  },
  {
    id: "golden-dragon",
    name: "Golden Dragon",
    baseRarity: "legendary",
    effect: { coinMult: 3 },
    flavor: "Triples coins per roll.",
    art: "golden-dragon",
    costCoins: 500000,
    costGems: 8,
  },

  // ---- MYTHIC (2) ----
  {
    id: "void-cat",
    name: "Void Cat",
    baseRarity: "mythic",
    effect: { coinMult: 2, xpMult: 2, rarityTilt: 0.4 },
    flavor: "Double everything plus a heavy rarity push.",
    art: "void-cat",
    costCoins: 3_000_000,
    costGems: 30,
  },
  {
    id: "shadow-titan",
    name: "Shadow Titan",
    baseRarity: "mythic",
    effect: { rarityTilt: 0.8, rollSpeedMult: 0.5 },
    flavor: "Massive rarity tilt and 2× roll speed.",
    art: "shadow-titan",
    costCoins: 5_000_000,
    costGems: 50,
  },

  // ---- UNOBTAINABLE (2) — cannot be bought ----
  {
    id: "cosmic-serpent",
    name: "Cosmic Serpent",
    baseRarity: "unobtainable",
    effect: {
      coinMult: 5,
      xpMult: 5,
      rarityTilt: 1,
      rollSpeedMult: 0.5,
    },
    flavor: "Bends the cosmos. Drops only from the rarest events.",
    art: "cosmic-serpent",
    costCoins: 0,
    costGems: 0,
  },
  {
    id: "cybernetic-dragon",
    name: "Cybernetic Ultimate Dragon",
    baseRarity: "unobtainable",
    effect: {
      coinMult: 10,
      xpMult: 10,
      rarityTilt: 2,
      rollSpeedMult: 0.4,
    },
    flavor:
      "Reality-warping. Burns away common rolls and lets only the rare survive.",
    art: "cybernetic-dragon",
    costCoins: 0,
    costGems: 0,
  },
];

// Sort: shop displays cheaper / lower-rarity pets first.
PETS.sort((a, b) => {
  const ra = RARITY_RANK[a.baseRarity];
  const rb = RARITY_RANK[b.baseRarity];
  if (ra !== rb) return ra - rb;
  return a.costCoins - b.costCoins;
});

export const PET_BY_ID: Record<string, PetDef> = PETS.reduce(
  (acc, p) => {
    acc[p.id] = p;
    return acc;
  },
  {} as Record<string, PetDef>,
);

// Pet drop divisors per rarity tier
const PET_DIVISOR: Record<RarityKey, number> = {
  common: 0,
  uncommon: 0,
  rare: 10,
  epic: 100,
  legendary: 1000,
  mythic: 10000,
  unobtainable: 0, // unobtainable pets only drop via specific achievements
};

export function rollPetDrop(
  tierProb: number,
  tier: RarityKey,
  ownedIds: Set<string>,
): string | null {
  const divisor = PET_DIVISOR[tier];
  if (!divisor) return null;
  const dropChance = tierProb / divisor;
  if (Math.random() > dropChance) return null;
  const tierPets = PETS.filter(
    (p) => p.baseRarity === tier && p.baseRarity !== "unobtainable",
  );
  if (tierPets.length === 0) return null;
  const unowned = tierPets.filter((p) => !ownedIds.has(p.id));
  const pool = unowned.length > 0 ? unowned : tierPets;
  return pool[Math.floor(Math.random() * pool.length)].id;
}

// ---- Evolution & upgrade math ----

/** Returns the current rarity bracket of a pet given its level. */
export function petCurrentRarity(def: PetDef, petLevel: number): RarityKey {
  if (def.baseRarity === "unobtainable") return "unobtainable";
  const lv = Math.max(1, petLevel);
  if (lv >= 51) return "mythic";
  if (lv >= 41) return "legendary";
  if (lv >= 31) return "epic";
  if (lv >= 21) return "rare";
  if (lv >= 11) return "uncommon";
  return "common";
}

/** Total effect multiplier scale = product of evolution boosts + per-level bonus. */
function petEffectScale(def: PetDef, petLevel: number): number {
  if (def.baseRarity === "unobtainable") return 1;
  const cur = petCurrentRarity(def, petLevel);
  let scale = 1;
  // Apply each evolution boost from baseRarity → cur.
  const baseIdx = NORMAL_TIERS.indexOf(def.baseRarity);
  const curIdx = NORMAL_TIERS.indexOf(cur);
  for (let i = baseIdx + 1; i <= curIdx; i++) {
    const boost = EVOLUTION_BOOST[NORMAL_TIERS[i]] ?? 0;
    scale *= 1 + boost;
  }
  // Add per-level bonus inside current tier.
  const tierStart = TIER_LEVEL_START[cur];
  const levelsInTier = Math.max(0, petLevel - tierStart);
  scale *= 1 + levelsInTier * PER_LEVEL_BONUS;
  return scale;
}

/** Effective effect after applying evolution + per-level scaling. */
export function effectiveEffect(
  def: PetDef,
  petLevel: number,
): Required<PetEffect> {
  const scale = petEffectScale(def, petLevel);
  const e = def.effect;
  // Bonuses scale; multiplicative buffs become 1 + (mult-1)*scale.
  const scaleBonus = (m?: number) =>
    m == null ? 1 : 1 + (m - 1) * scale;
  // Roll speed: lower is better. Convert to "speed bonus" and scale.
  const scaleSpeed = (m?: number) => {
    if (m == null) return 1;
    const speedBonus = 1 - m; // e.g. 0.5 → 0.5 bonus
    const newBonus = Math.min(0.95, speedBonus * scale);
    return 1 - newBonus;
  };
  return {
    coinMult: scaleBonus(e.coinMult),
    xpMult: scaleBonus(e.xpMult),
    rarityTilt: (e.rarityTilt ?? 0) * scale,
    rollSpeedMult: scaleSpeed(e.rollSpeedMult),
  };
}

/** Requirement to evolve from current tier to next. */
export function evolutionInfo(
  def: PetDef,
  inst: PetInstance,
  playerLevel: number,
): {
  cur: RarityKey;
  next: RarityKey | null;
  petLevelNeeded: number; // pet must reach this level
  playerLevelNeeded: number; // player must be ≥ this
  ready: boolean;
  maxed: boolean;
} {
  const cur = petCurrentRarity(def, inst.level);
  if (def.baseRarity === "unobtainable") {
    return {
      cur,
      next: null,
      petLevelNeeded: 0,
      playerLevelNeeded: 0,
      ready: false,
      maxed: true,
    };
  }
  const curIdx = NORMAL_TIERS.indexOf(cur);
  const nextTier = NORMAL_TIERS[curIdx + 1];
  if (!nextTier) {
    return {
      cur,
      next: null,
      petLevelNeeded: 0,
      playerLevelNeeded: 0,
      ready: false,
      maxed: true,
    };
  }
  const petLevelNeeded = TIER_LEVEL_START[nextTier];
  const playerLevelNeeded = (curIdx + 1) * 10; // to uncommon need 10+, rare need 20+, etc.
  const ready =
    inst.level >= petLevelNeeded - 1 && playerLevel >= playerLevelNeeded;
  return {
    cur,
    next: nextTier,
    petLevelNeeded,
    playerLevelNeeded,
    ready,
    maxed: false,
  };
}

/** Cost in coins to bump a pet from level → level+1. */
export function petUpgradeCost(def: PetDef, currentPetLevel: number): number {
  // Base cost scales with pet level and base rarity tier.
  const tierMult = Math.pow(3, RARITY_RANK[def.baseRarity]); // common=1, uncommon=3, rare=9...
  return Math.floor(50 * tierMult * Math.pow(currentPetLevel, 1.5));
}

export function isPetMaxed(def: PetDef, petLevel: number): boolean {
  if (def.baseRarity === "unobtainable") return true;
  return petLevel >= MAX_PET_LEVEL;
}

export const RARITY_DEF_BY_KEY = RARITY_BY_KEY;
