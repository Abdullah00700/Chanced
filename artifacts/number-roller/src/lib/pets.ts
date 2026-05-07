import { RARITY_RANK, RARITY_BY_KEY } from "./rarity";
import type { PetInstance, RarityKey } from "./types";

export type PetEffect = {
  coinMult?: number;
  xpMult?: number;
  rarityTilt?: number;
  rollSpeedMult?: number;
  hatchSkipMs?: number;
  abilityIntervalMs?: number;
  abilityKind?:
    | "auto-roll"
    | "hatch-skip"
    | "auto-coins"
    | "auto-xp"
    | "shark-eats-fish"
    | "blue-whale"
    | "fennec-borrow"
    | "scaly-eat"
    | "scaly-uplevel-all"
    | "megalodon-eats-fish"
    | "dev-monkey-roll"
    | "boss-rage"
    | "void-pulse"
    ;
  abilityPayload?: number;
  /** Multiplier applied to boss damage from rolls. Stacks multiplicatively. */
  bossDamageMult?: number;
};

export type PetDef = {
  id: string;
  name: string;
  baseRarity: RarityKey;
  effect: PetEffect;
  flavor: string;
  art: string;
  costCoins: number;
  costGems: number;
  source?: "shop" | "egg" | "special";
  fromEgg?: string;
  unobtainable?: boolean;
  /** If true, this unobtainable-rarity pet CAN be purchased from the shop. */
  shopBuyable?: boolean;
};

const TIER_LEVEL_START: Record<RarityKey, number> = {
  common: 1,
  uncommon: 16,
  rare: 31,
  epic: 46,
  legendary: 61,
  mythic: 81,
  unobtainable: 1,
};

const NORMAL_TIERS: RarityKey[] = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "mythic",
];

const EVOLUTION_BOOST: Partial<Record<RarityKey, number>> = {
  uncommon: 0.25,
  rare: 0.2,
  epic: 0.15,
  legendary: 0.1,
  mythic: 0.5,
};

const PER_LEVEL_BONUS = 0.005;
export const MAX_PET_LEVEL = 100;
export const PET_GEM_LEVEL_THRESHOLD = 50;

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

  // ---- RARE (6) ----
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
    effect: { rollSpeedMult: 0.65, coinMult: 1.1, xpMult: 1.15 },
    flavor: "Much faster rolls, +10% coins, +15% XP.",
    art: "penguin",
    costCoins: 18000,
    costGems: 0,
  },
  {
    id: "owl",
    name: "Owl",
    baseRarity: "rare",
    effect: {
      xpMult: 1.2,
      hatchSkipMs: 750,
      abilityIntervalMs: 12_000,
      abilityKind: "hatch-skip",
      abilityPayload: 750,
    },
    flavor: "+20% XP. Every 12s, skips 0.75s of any active hatch.",
    art: "owl",
    costCoins: 20000,
    costGems: 0,
  },
  {
    id: "rooster",
    name: "Rooster",
    baseRarity: "rare",
    effect: {
      coinMult: 1.15,
      hatchSkipMs: 500,
      abilityIntervalMs: 8_000,
      abilityKind: "hatch-skip",
      abilityPayload: 500,
    },
    flavor: "+15% coins. Crows every 8s, skips 0.5s of hatch time.",
    art: "rooster",
    costCoins: 22000,
    costGems: 0,
  },
  // NEW rare pets
  {
    id: "blood-werewolf",
    name: "Blood Werewolf",
    baseRarity: "rare",
    effect: { coinMult: 1.2, rollSpeedMult: 0.8, bossDamageMult: 1.15 },
    flavor: "+20% coins, faster rolls. +15% boss damage.",
    art: "blood-werewolf",
    costCoins: 30000,
    costGems: 0,
  },

  // ---- EPIC (5 + 3 new) ----
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
  {
    id: "falcon",
    name: "Falcon",
    baseRarity: "epic",
    effect: {
      rollSpeedMult: 0.6,
      hatchSkipMs: 1500,
      abilityIntervalMs: 15_000,
      abilityKind: "hatch-skip",
      abilityPayload: 1500,
    },
    flavor: "Faster rolls. Every 15s, skips 1.5s of hatch time.",
    art: "falcon",
    costCoins: 100000,
    costGems: 2,
  },
  {
    id: "yeti",
    name: "Yeti",
    baseRarity: "epic",
    effect: { coinMult: 1.6, rarityTilt: 0.15 },
    flavor: "+60% coins and small rarity tilt.",
    art: "yeti",
    costCoins: 180000,
    costGems: 4,
  },
  // NEW epic pets
  {
    id: "battle-boar",
    name: "Battle Boar",
    baseRarity: "epic",
    effect: { coinMult: 1.4, bossDamageMult: 1.3 },
    flavor: "+40% coins. +30% boss damage.",
    art: "battle-boar",
    costCoins: 200000,
    costGems: 4,
  },
  {
    id: "storm-hawk",
    name: "Storm Hawk",
    baseRarity: "epic",
    effect: { rollSpeedMult: 0.55, xpMult: 1.4, bossDamageMult: 1.2 },
    flavor: "Blazing speed, +40% XP, +20% boss damage.",
    art: "storm-hawk",
    costCoins: 250000,
    costGems: 5,
  },
  {
    id: "magma-bear",
    name: "Magma Bear",
    baseRarity: "epic",
    effect: { coinMult: 1.7, rarityTilt: 0.2, bossDamageMult: 1.25 },
    flavor: "+70% coins, rarity push, +25% boss damage.",
    art: "magma-bear",
    costCoins: 300000,
    costGems: 6,
  },

  // ---- LEGENDARY (4 + 4 new) ----
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
  {
    id: "kraken",
    name: "Kraken",
    baseRarity: "legendary",
    effect: {
      rarityTilt: 0.5,
      hatchSkipMs: 3000,
      abilityIntervalMs: 20_000,
      abilityKind: "hatch-skip",
      abilityPayload: 3000,
    },
    flavor: "+0.5 rarity tilt. Every 20s, skips 3s of hatch time.",
    art: "kraken",
    costCoins: 800000,
    costGems: 12,
  },
  {
    id: "thunderbird",
    name: "Thunderbird",
    baseRarity: "legendary",
    effect: { coinMult: 2, xpMult: 1.8, rollSpeedMult: 0.7 },
    flavor: "2× coins, +80% XP, faster rolls.",
    art: "thunderbird",
    costCoins: 1_200_000,
    costGems: 18,
  },
  // NEW legendary pets
  {
    id: "iron-colossus",
    name: "Iron Colossus",
    baseRarity: "legendary",
    effect: { coinMult: 2, bossDamageMult: 1.8 },
    flavor: "2× coins. +80% boss damage — built for battle.",
    art: "iron-colossus",
    costCoins: 2_000_000,
    costGems: 25,
  },
  {
    id: "titan-rhino",
    name: "Titan Rhino",
    baseRarity: "legendary",
    effect: { rarityTilt: 0.4, coinMult: 1.8, bossDamageMult: 2.0 },
    flavor: "+0.4 rarity tilt, +80% coins. Doubles boss damage.",
    art: "titan-rhino",
    costCoins: 3_000_000,
    costGems: 35,
  },
  {
    id: "eclipse-serpent",
    name: "Eclipse Serpent",
    baseRarity: "legendary",
    effect: { xpMult: 2.5, rarityTilt: 0.35, bossDamageMult: 1.6 },
    flavor: "+150% XP, tilt push, +60% boss damage.",
    art: "eclipse-serpent",
    costCoins: 4_000_000,
    costGems: 45,
  },
  {
    id: "spectral-wolf",
    name: "Spectral Wolf",
    baseRarity: "legendary",
    effect: { coinMult: 2.5, rollSpeedMult: 0.6, bossDamageMult: 1.7 },
    flavor: "+150% coins, extreme speed, +70% boss damage.",
    art: "spectral-wolf",
    costCoins: 5_000_000,
    costGems: 55,
  },

  // ---- MYTHIC (4 + 6 new) ----
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
  {
    // Buffed "void stag" (celestial-stag)
    id: "celestial-stag",
    name: "Celestial Stag",
    baseRarity: "mythic",
    effect: {
      coinMult: 5,
      xpMult: 5,
      rarityTilt: 1,
      bossDamageMult: 2,
      hatchSkipMs: 5000,
      abilityIntervalMs: 15_000,
      abilityKind: "hatch-skip",
      abilityPayload: 5000,
    },
    flavor: "+400% coins/XP, +1 rarity tilt, 2× boss damage. Every 15s skips 5s hatch.",
    art: "celestial-stag",
    costCoins: 10_000_000,
    costGems: 100,
  },
  {
    id: "abyss-leviathan",
    name: "Abyss Leviathan",
    baseRarity: "mythic",
    effect: { rarityTilt: 1, coinMult: 1.5, xpMult: 1.5 },
    flavor: "+1 rarity tilt and +50% to coins/XP.",
    art: "abyss-leviathan",
    costCoins: 10_000_000,
    costGems: 100,
  },
  // NEW mythic pets
  {
    id: "war-phoenix",
    name: "War Phoenix",
    baseRarity: "mythic",
    effect: { coinMult: 3, xpMult: 3, bossDamageMult: 3 },
    flavor: "3× coins, 3× XP, 3× boss damage. The battle reborn.",
    art: "war-phoenix",
    costCoins: 15_000_000,
    costGems: 150,
  },
  {
    id: "void-stalker",
    name: "Void Stalker",
    baseRarity: "mythic",
    effect: { rarityTilt: 1.2, rollSpeedMult: 0.45, bossDamageMult: 2.5 },
    flavor: "+1.2 rarity tilt, blazing speed, +150% boss damage.",
    art: "void-stalker",
    costCoins: 20_000_000,
    costGems: 200,
  },
  {
    id: "nebula-serpent",
    name: "Nebula Serpent",
    baseRarity: "mythic",
    effect: { coinMult: 4, xpMult: 3, rarityTilt: 0.8, bossDamageMult: 3.5 },
    flavor: "4× coins, 3× XP, massive tilt, +250% boss damage.",
    art: "nebula-serpent",
    costCoins: 30_000_000,
    costGems: 300,
  },
  {
    id: "storm-giant",
    name: "Storm Giant",
    baseRarity: "mythic",
    effect: { coinMult: 3, xpMult: 2.5, rollSpeedMult: 0.4, bossDamageMult: 4 },
    flavor: "3× coins, 2.5× XP, max speed, 4× boss damage.",
    art: "storm-giant",
    costCoins: 40_000_000,
    costGems: 400,
  },
  {
    id: "void-hydra",
    name: "Void Hydra",
    baseRarity: "mythic",
    effect: {
      coinMult: 5,
      xpMult: 4,
      rarityTilt: 1.5,
      bossDamageMult: 5,
      abilityIntervalMs: 30_000,
      abilityKind: "void-pulse",
    },
    flavor: "5× coins, 4× XP, +1.5 tilt, 5× boss damage. Pulses every 30s.",
    art: "void-hydra",
    costCoins: 75_000_000,
    costGems: 750,
  },
  {
    id: "chaos-titan",
    name: "Chaos Titan",
    baseRarity: "mythic",
    effect: {
      coinMult: 6,
      xpMult: 5,
      rarityTilt: 2,
      rollSpeedMult: 0.35,
      bossDamageMult: 6,
    },
    flavor: "6× coins, 5× XP, +2 tilt, max speed, 6× boss damage.",
    art: "chaos-titan",
    costCoins: 150_000_000,
    costGems: 1500,
  },

  // ============================================================
  // ============== EGG-EXCLUSIVE PETS ===========================
  // ============================================================

  // ---- JUNGLE EGG ----
  {
    id: "monkey",
    name: "Monkey",
    baseRarity: "common",
    effect: {
      coinMult: 1.1,
      abilityIntervalMs: 60_000,
      abilityKind: "auto-roll",
    },
    flavor: "+10% coins. Auto-rolls once every 60s. Used to unlock Developer Monkey.",
    art: "monkey",
    costCoins: 0,
    costGems: 0,
    source: "egg",
    fromEgg: "egg-jungle",
  },
  {
    id: "tree-frog",
    name: "Tree Frog",
    baseRarity: "uncommon",
    effect: { coinMult: 1.18, xpMult: 1.12, rollSpeedMult: 0.9 },
    flavor: "+18% coins, +12% XP, faster rolls.",
    art: "tree-frog",
    costCoins: 0,
    costGems: 0,
    source: "egg",
    fromEgg: "egg-jungle",
  },
  {
    id: "gorilla",
    name: "Gorilla",
    baseRarity: "epic",
    effect: { coinMult: 1.8, xpMult: 1.4 },
    flavor: "+80% coins, +40% XP. Pure muscle.",
    art: "gorilla",
    costCoins: 0,
    costGems: 0,
    source: "egg",
    fromEgg: "egg-jungle",
  },
  {
    id: "toucan",
    name: "Toucan",
    baseRarity: "legendary",
    effect: {
      xpMult: 1.8,
      hatchSkipMs: 2000,
      abilityIntervalMs: 18_000,
      abilityKind: "hatch-skip",
      abilityPayload: 2000,
    },
    flavor: "+80% XP. Every 18s, skips 2s of hatch.",
    art: "toucan",
    costCoins: 0,
    costGems: 0,
    source: "egg",
    fromEgg: "egg-jungle",
  },
  {
    id: "lion",
    name: "Lion",
    baseRarity: "mythic",
    effect: { coinMult: 2.5, xpMult: 2, rarityTilt: 0.5 },
    flavor: "King of the jungle. +150% coins, +100% XP, +0.5 rarity tilt.",
    art: "lion",
    costCoins: 0,
    costGems: 0,
    source: "egg",
    fromEgg: "egg-jungle",
  },

  // ---- DESERT EGG ----
  {
    id: "horned-gecko",
    name: "Horned Gecko",
    baseRarity: "common",
    effect: { rarityTilt: 0.1, coinMult: 1.1 },
    flavor: "+0.1 rarity tilt and +10% coins. Used to unlock the Scaly Demon.",
    art: "horned-gecko",
    costCoins: 0,
    costGems: 0,
    source: "egg",
    fromEgg: "egg-desert",
  },
  {
    id: "rattlesnake",
    name: "Rattlesnake",
    baseRarity: "rare",
    effect: { rollSpeedMult: 0.6, coinMult: 1.15 },
    flavor: "Strikes fast. 40% faster rolls, +15% coins.",
    art: "rattlesnake",
    costCoins: 0,
    costGems: 0,
    source: "egg",
    fromEgg: "egg-desert",
  },
  {
    id: "scorpion",
    name: "Scorpion",
    baseRarity: "epic",
    effect: { rarityTilt: 0.5, xpMult: 1.4 },
    flavor: "+0.5 rarity tilt and +40% XP.",
    art: "scorpion",
    costCoins: 0,
    costGems: 0,
    source: "egg",
    fromEgg: "egg-desert",
  },
  {
    id: "camel",
    name: "Camel",
    baseRarity: "legendary",
    effect: {
      coinMult: 2.5,
      abilityIntervalMs: 60_000,
      abilityKind: "auto-coins",
      abilityPayload: 5000,
    },
    flavor: "+150% coins. Stores up 5,000 coins every minute.",
    art: "camel",
    costCoins: 0,
    costGems: 0,
    source: "egg",
    fromEgg: "egg-desert",
  },
  {
    id: "fennec-fox",
    name: "Fennec Fox",
    baseRarity: "mythic",
    effect: {
      coinMult: 1.5,
      xpMult: 1.5,
      abilityIntervalMs: 5 * 60_000,
      abilityKind: "fennec-borrow",
      abilityPayload: 10_000,
    },
    flavor:
      "Every 5 minutes, borrows the strongest equipped pet's effect for 10 seconds.",
    art: "fennec-fox",
    costCoins: 0,
    costGems: 0,
    source: "egg",
    fromEgg: "egg-desert",
  },

  // ---- OCEAN EGG ----
  {
    id: "fish",
    name: "Fish",
    baseRarity: "common",
    effect: { coinMult: 1.12 },
    flavor: "+12% coins. Bait for sharks.",
    art: "fish",
    costCoins: 0,
    costGems: 0,
    source: "egg",
    fromEgg: "egg-ocean",
  },
  {
    id: "sea-horse",
    name: "Sea Horse",
    baseRarity: "uncommon",
    effect: { xpMult: 1.18, rollSpeedMult: 0.9 },
    flavor: "+18% XP and slightly faster rolls.",
    art: "sea-horse",
    costCoins: 0,
    costGems: 0,
    source: "egg",
    fromEgg: "egg-ocean",
  },
  {
    id: "starfish",
    name: "Starfish",
    baseRarity: "epic",
    effect: { rarityTilt: 0.3, coinMult: 1.4, xpMult: 1.4 },
    flavor: "+0.3 rarity tilt, +40% coins, +40% XP.",
    art: "starfish",
    costCoins: 0,
    costGems: 0,
    source: "egg",
    fromEgg: "egg-ocean",
  },
  {
    id: "shark",
    name: "Shark",
    baseRarity: "legendary",
    effect: {
      coinMult: 1.5,
      abilityIntervalMs: 60_000,
      abilityKind: "shark-eats-fish",
      abilityPayload: 6250,
    },
    flavor: "+50% coins. Every 60s, eats a fish for 5–7.5k coins.",
    art: "shark",
    costCoins: 0,
    costGems: 0,
    source: "egg",
    fromEgg: "egg-ocean",
  },
  {
    id: "blue-whale",
    name: "Blue Whale",
    baseRarity: "mythic",
    effect: {
      xpMult: 1.5,
      coinMult: 1.5,
      abilityIntervalMs: 30 * 60_000,
      abilityKind: "blue-whale",
      abilityPayload: 10_000,
    },
    flavor:
      "Every 30 min: eats a Fish for 10k XP (scaling with level), or eats gems if no Fish.",
    art: "blue-whale",
    costCoins: 0,
    costGems: 0,
    source: "egg",
    fromEgg: "egg-ocean",
  },

  // ---- ARCTIC EGG ----
  {
    id: "arctic-fox",
    name: "Arctic Fox",
    baseRarity: "common",
    effect: { coinMult: 1.1, bossDamageMult: 1.05 },
    flavor: "+10% coins, +5% boss damage. Key to unlocking the Arctic Guardian.",
    art: "arctic-fox",
    costCoins: 0,
    costGems: 0,
    source: "egg",
    fromEgg: "egg-arctic",
  },
  {
    id: "polar-bear",
    name: "Polar Bear",
    baseRarity: "uncommon",
    effect: { coinMult: 1.25, bossDamageMult: 1.1 },
    flavor: "+25% coins, +10% boss damage.",
    art: "polar-bear",
    costCoins: 0,
    costGems: 0,
    source: "egg",
    fromEgg: "egg-arctic",
  },
  {
    id: "snow-leopard",
    name: "Snow Leopard",
    baseRarity: "rare",
    effect: { coinMult: 1.4, rollSpeedMult: 0.7, bossDamageMult: 1.2 },
    flavor: "+40% coins, 30% faster rolls, +20% boss damage.",
    art: "snow-leopard",
    costCoins: 0,
    costGems: 0,
    source: "egg",
    fromEgg: "egg-arctic",
  },
  {
    id: "ice-dragon",
    name: "Ice Dragon",
    baseRarity: "legendary",
    effect: { rarityTilt: 0.6, coinMult: 2.5, bossDamageMult: 1.5 },
    flavor: "+0.6 tilt, +150% coins, +50% boss damage.",
    art: "ice-dragon",
    costCoins: 0,
    costGems: 0,
    source: "egg",
    fromEgg: "egg-arctic",
  },
  {
    id: "frost-titan",
    name: "Frost Titan",
    baseRarity: "mythic",
    effect: { coinMult: 4, xpMult: 3, rarityTilt: 0.8, bossDamageMult: 3 },
    flavor: "4× coins, 3× XP, +0.8 tilt, 3× boss damage. Pure glacier power.",
    art: "frost-titan",
    costCoins: 0,
    costGems: 0,
    source: "egg",
    fromEgg: "egg-arctic",
  },

  // ---- MYTHICAL EGG ----
  {
    id: "rune-stone",
    name: "Rune Stone",
    baseRarity: "uncommon",
    effect: { xpMult: 1.3, bossDamageMult: 1.1 },
    flavor: "+30% XP, +10% boss damage. Key to unlocking Primordial Chaos.",
    art: "rune-stone",
    costCoins: 0,
    costGems: 0,
    source: "egg",
    fromEgg: "egg-mythical",
  },
  {
    id: "astral-wolf",
    name: "Astral Wolf",
    baseRarity: "rare",
    effect: { coinMult: 1.6, xpMult: 1.5, bossDamageMult: 1.3 },
    flavor: "+60% coins, +50% XP, +30% boss damage.",
    art: "astral-wolf",
    costCoins: 0,
    costGems: 0,
    source: "egg",
    fromEgg: "egg-mythical",
  },
  {
    id: "reality-fox",
    name: "Reality Fox",
    baseRarity: "epic",
    effect: { rarityTilt: 0.6, coinMult: 1.8, bossDamageMult: 1.4 },
    flavor: "+0.6 tilt, +80% coins, +40% boss damage.",
    art: "reality-fox",
    costCoins: 0,
    costGems: 0,
    source: "egg",
    fromEgg: "egg-mythical",
  },
  {
    id: "infinity-drake",
    name: "Infinity Drake",
    baseRarity: "legendary",
    effect: { coinMult: 4, rarityTilt: 0.5, bossDamageMult: 2 },
    flavor: "4× coins, +0.5 tilt, 2× boss damage.",
    art: "infinity-drake",
    costCoins: 0,
    costGems: 0,
    source: "egg",
    fromEgg: "egg-mythical",
  },
  {
    id: "primordial-god",
    name: "Primordial God",
    baseRarity: "mythic",
    effect: { coinMult: 6, xpMult: 5, rarityTilt: 2, rollSpeedMult: 0.3, bossDamageMult: 5 },
    flavor: "The alpha and omega. 6× coins, 5× XP, +2 tilt, max speed, 5× boss damage.",
    art: "primordial-god",
    costCoins: 0,
    costGems: 0,
    source: "egg",
    fromEgg: "egg-mythical",
  },

  // ============================================================
  // ============== UNOBTAINABLE / SPECIAL =======================
  // ============================================================
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
    flavor: "Bends the cosmos. Awarded by the Cosmic Ascent quest.",
    art: "cosmic-serpent",
    costCoins: 0,
    costGems: 0,
    source: "special",
    unobtainable: true,
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
    flavor: "Reality-warping. Awarded by Beyond the Curve.",
    art: "cybernetic-dragon",
    costCoins: 0,
    costGems: 0,
    source: "special",
    unobtainable: true,
  },
  {
    id: "developer-monkey",
    name: "Developer Monkey",
    baseRarity: "unobtainable",
    effect: {
      coinMult: 3,
      xpMult: 3,
      rarityTilt: 0.5,
      rollSpeedMult: 0.5,
      abilityIntervalMs: 10_000,
      abilityKind: "dev-monkey-roll",
    },
    flavor: "Auto-rolls every 10s and triples every stat.",
    art: "developer-monkey",
    costCoins: 0,
    costGems: 0,
    source: "special",
    unobtainable: true,
  },
  {
    id: "scaly-demon",
    name: "Scaly Demon",
    baseRarity: "unobtainable",
    effect: {
      coinMult: 2,
      xpMult: 2,
      rarityTilt: 0.3,
      abilityIntervalMs: 15 * 60_000,
      abilityKind: "scaly-eat",
    },
    flavor:
      "Every 15 min: eats a random shop pet under epic, refunding its cost. Levels up that pet.",
    art: "scaly-demon",
    costCoins: 0,
    costGems: 0,
    source: "special",
    unobtainable: true,
  },
  {
    id: "megalodon",
    name: "Megalodon",
    baseRarity: "unobtainable",
    effect: {
      coinMult: 4,
      xpMult: 4,
      rarityTilt: 0.5,
      rollSpeedMult: 0.7,
      abilityIntervalMs: 90_000,
      abilityKind: "megalodon-eats-fish",
      abilityPayload: 30,
    },
    flavor:
      "4× every stat. Every 90s eats 10–50 fish for 1–5k coins each.",
    art: "megalodon",
    costCoins: 0,
    costGems: 0,
    source: "special",
    unobtainable: true,
  },
  {
    id: "arctic-guardian",
    name: "Arctic Guardian",
    baseRarity: "unobtainable",
    effect: {
      coinMult: 8,
      xpMult: 6,
      rarityTilt: 1.5,
      bossDamageMult: 4,
      rollSpeedMult: 0.4,
    },
    flavor: "8× coins, 6× XP, +1.5 tilt, 4× boss damage. Born from the frozen north.",
    art: "arctic-guardian",
    costCoins: 0,
    costGems: 0,
    source: "special",
    unobtainable: true,
  },
  {
    id: "primordial-chaos",
    name: "Primordial Chaos",
    baseRarity: "unobtainable",
    effect: {
      coinMult: 12,
      xpMult: 10,
      rarityTilt: 3,
      bossDamageMult: 7,
      rollSpeedMult: 0.3,
    },
    flavor: "12× coins, 10× XP, +3 tilt, 7× boss damage. The chaos before all things.",
    art: "primordial-chaos",
    costCoins: 0,
    costGems: 0,
    source: "special",
    unobtainable: true,
  },
  // ============================================================
  // ====== DINOSAUR SHOP PETS (15) ==============================
  // ============================================================

  // ---- COMMON DINOS ----
  {
    id: "raptor",
    name: "Raptor",
    baseRarity: "common",
    effect: { rollSpeedMult: 0.88, coinMult: 1.06 },
    flavor: "Lightning fast. 12% faster rolls and +6% coins.",
    art: "raptor",
    costCoins: 500,
    costGems: 0,
  },
  {
    id: "parasaur",
    name: "Parasaur",
    baseRarity: "common",
    effect: { coinMult: 1.08, xpMult: 1.05 },
    flavor: "+8% coins and +5% XP. Gentle giant.",
    art: "parasaur",
    costCoins: 600,
    costGems: 0,
  },

  // ---- UNCOMMON DINOS ----
  {
    id: "stegosaurus",
    name: "Stegosaurus",
    baseRarity: "uncommon",
    effect: { xpMult: 1.15, coinMult: 1.1 },
    flavor: "+15% XP and +10% coins. Spiked for success.",
    art: "stegosaurus",
    costCoins: 3500,
    costGems: 0,
  },
  {
    id: "ankylosaur",
    name: "Ankylosaur",
    baseRarity: "uncommon",
    effect: { coinMult: 1.12, bossDamageMult: 1.08 },
    flavor: "+12% coins, +8% boss damage. Built like a tank.",
    art: "ankylosaur",
    costCoins: 5000,
    costGems: 0,
  },

  // ---- RARE DINOS ----
  {
    id: "triceratops",
    name: "Triceratops",
    baseRarity: "rare",
    effect: { rarityTilt: 0.15, coinMult: 1.2, bossDamageMult: 1.1 },
    flavor: "+0.15 rarity tilt, +20% coins, +10% boss damage.",
    art: "triceratops",
    costCoins: 15000,
    costGems: 0,
  },
  {
    id: "pterodactyl",
    name: "Pterodactyl",
    baseRarity: "rare",
    effect: { rollSpeedMult: 0.7, xpMult: 1.25 },
    flavor: "30% faster rolls and +25% XP. Rules the skies.",
    art: "pterodactyl",
    costCoins: 20000,
    costGems: 0,
  },
  {
    id: "brachiosaurus",
    name: "Brachiosaurus",
    baseRarity: "rare",
    effect: { coinMult: 1.28, xpMult: 1.22 },
    flavor: "+28% coins and +22% XP. Towering wealth.",
    art: "brachiosaurus",
    costCoins: 25000,
    costGems: 0,
  },

  // ---- EPIC DINOS ----
  {
    id: "spinosaurus",
    name: "Spinosaurus",
    baseRarity: "epic",
    effect: { coinMult: 1.55, bossDamageMult: 1.35 },
    flavor: "+55% coins. +35% boss damage. Apex of the Cretaceous.",
    art: "spinosaurus",
    costCoins: 200000,
    costGems: 4,
  },
  {
    id: "allosaurus",
    name: "Allosaurus",
    baseRarity: "epic",
    effect: { rarityTilt: 0.28, bossDamageMult: 1.45 },
    flavor: "+0.28 rarity tilt. +45% boss damage.",
    art: "allosaurus",
    costCoins: 250000,
    costGems: 5,
  },
  {
    id: "carnotaurus",
    name: "Carnotaurus",
    baseRarity: "epic",
    effect: { rollSpeedMult: 0.58, coinMult: 1.4, bossDamageMult: 1.5 },
    flavor: "Blistering speed, +40% coins, +50% boss damage.",
    art: "carnotaurus",
    costCoins: 300000,
    costGems: 6,
  },

  // ---- LEGENDARY DINOS ----
  {
    id: "t-rex",
    name: "T-Rex",
    baseRarity: "legendary",
    effect: { coinMult: 2.2, xpMult: 1.8, bossDamageMult: 2.2 },
    flavor: "King of all. +120% coins, +80% XP, +120% boss damage.",
    art: "t-rex",
    costCoins: 3_000_000,
    costGems: 35,
  },
  {
    id: "carcharodont",
    name: "Carcharodontosaurus",
    baseRarity: "legendary",
    effect: { rarityTilt: 0.45, coinMult: 1.9, bossDamageMult: 2.5 },
    flavor: "+0.45 rarity tilt, +90% coins, +150% boss damage.",
    art: "carcharodont",
    costCoins: 4_000_000,
    costGems: 45,
  },
  {
    id: "therizinosaurus",
    name: "Therizinosaurus",
    baseRarity: "legendary",
    effect: { xpMult: 2.8, rarityTilt: 0.3, bossDamageMult: 2.0 },
    flavor: "+180% XP, +0.3 tilt, +100% boss damage. Slashes through limits.",
    art: "therizinosaurus",
    costCoins: 5_000_000,
    costGems: 55,
  },

  // ---- MYTHIC DINOS ----
  {
    id: "giganotosaurus",
    name: "Giganotosaurus",
    baseRarity: "mythic",
    effect: { coinMult: 3.5, xpMult: 3, rarityTilt: 0.6, bossDamageMult: 3.5 },
    flavor: "3.5× coins, 3× XP, +0.6 tilt, 3.5× boss damage. Bigger than T-Rex.",
    art: "giganotosaurus",
    costCoins: 50_000_000,
    costGems: 500,
  },
  {
    id: "dracorex",
    name: "Dracorex",
    baseRarity: "mythic",
    effect: { rarityTilt: 1.2, bossDamageMult: 4.5, rollSpeedMult: 0.45, xpMult: 2.5 },
    flavor: "+1.2 rarity tilt, 4.5× boss damage, blazing speed, +150% XP. Dragon king.",
    art: "dracorex",
    costCoins: 80_000_000,
    costGems: 800,
  },

  // ============================================================
  // ====== BOSS DROP PETS (10) ==================================
  // Source: "boss" — granted at 5% chance on first kill.
  // ============================================================
  {
    id: "slime-spawn",
    name: "Slime Spawn",
    baseRarity: "common",
    effect: { coinMult: 1.12, bossDamageMult: 1.12 },
    flavor: "A glob that survived the Slime King's demise. +12% coins, +12% boss damage.",
    art: "slime-spawn",
    costCoins: 0,
    costGems: 0,
    source: "special",
    unobtainable: true,
  },
  {
    id: "golem-shard",
    name: "Golem Shard",
    baseRarity: "uncommon",
    effect: { coinMult: 1.3, bossDamageMult: 1.2, rarityTilt: 0.1 },
    flavor: "A living fragment of the Stone Golem. +30% coins, +20% boss damage.",
    art: "golem-shard",
    costCoins: 0,
    costGems: 0,
    source: "special",
    unobtainable: true,
  },
  {
    id: "ember-whelp",
    name: "Ember Whelp",
    baseRarity: "rare",
    effect: { rarityTilt: 0.22, bossDamageMult: 1.35, coinMult: 1.25 },
    flavor: "A baby drake born of the Fire Drake's last breath. +0.22 tilt, +35% boss damage.",
    art: "ember-whelp",
    costCoins: 0,
    costGems: 0,
    source: "special",
    unobtainable: true,
  },
  {
    id: "leviathan-cub",
    name: "Leviathan Cub",
    baseRarity: "epic",
    effect: { coinMult: 2, xpMult: 1.6, bossDamageMult: 1.6 },
    flavor: "Offspring of the Ocean Leviathan. 2× coins, +60% XP, +60% boss damage.",
    art: "leviathan-cub",
    costCoins: 0,
    costGems: 0,
    source: "special",
    unobtainable: true,
  },
  {
    id: "storm-sprite",
    name: "Storm Sprite",
    baseRarity: "legendary",
    effect: { xpMult: 2.2, bossDamageMult: 2.2, rollSpeedMult: 0.65 },
    flavor: "Born from the Thunder Colossus's final bolt. +120% XP, 2.2× boss damage.",
    art: "storm-sprite",
    costCoins: 0,
    costGems: 0,
    source: "special",
    unobtainable: true,
  },
  {
    id: "shadow-wisp",
    name: "Shadow Wisp",
    baseRarity: "legendary",
    effect: { rarityTilt: 0.6, bossDamageMult: 2.8, coinMult: 2 },
    flavor: "A remnant of the Shadow Overlord's essence. +0.6 tilt, 2.8× boss damage.",
    art: "shadow-wisp",
    costCoins: 0,
    costGems: 0,
    source: "special",
    unobtainable: true,
  },
  {
    id: "void-fragment",
    name: "Void Fragment",
    baseRarity: "mythic",
    effect: { coinMult: 3.5, rarityTilt: 0.8, bossDamageMult: 4 },
    flavor: "A piece of the Void Emperor's shattered crown. 3.5× coins, 4× boss damage.",
    art: "void-fragment",
    costCoins: 0,
    costGems: 0,
    source: "special",
    unobtainable: true,
  },
  {
    id: "cosmic-eye",
    name: "Cosmic Eye",
    baseRarity: "mythic",
    effect: { rarityTilt: 1.5, xpMult: 3, bossDamageMult: 4.5 },
    flavor: "The all-seeing eye of Cosmic Horror. +1.5 tilt, 3× XP, 4.5× boss damage.",
    art: "cosmic-eye",
    costCoins: 0,
    costGems: 0,
    source: "special",
    unobtainable: true,
  },
  {
    id: "titan-shard",
    name: "Titan Shard",
    baseRarity: "mythic",
    effect: { coinMult: 4, xpMult: 4, bossDamageMult: 5, rarityTilt: 1 },
    flavor: "A splinter of the Primordial Titan's being. 4× everything, 5× boss damage.",
    art: "titan-shard",
    costCoins: 0,
    costGems: 0,
    source: "special",
    unobtainable: true,
  },
  {
    id: "reality-chip",
    name: "Reality Chip",
    baseRarity: "unobtainable",
    effect: {
      coinMult: 8,
      xpMult: 8,
      rarityTilt: 2,
      bossDamageMult: 7,
      rollSpeedMult: 0.35,
    },
    flavor: "A fragment of the Reality Shredder itself. 8× all, 7× boss damage, max speed.",
    art: "reality-chip",
    costCoins: 0,
    costGems: 0,
    source: "special",
    unobtainable: true,
  },

  {
    // Buyable unobtainable pet
    id: "absolute-zero",
    name: "Absolute Zero",
    baseRarity: "unobtainable",
    effect: {
      coinMult: 15,
      xpMult: 12,
      rarityTilt: 3,
      bossDamageMult: 8,
      rollSpeedMult: 0.25,
    },
    flavor:
      "The temperature at which all things cease. 15× coins, 12× XP, +3 tilt, 8× boss damage, maximum roll speed. Costs a fortune.",
    art: "absolute-zero",
    costCoins: 500_000_000,
    costGems: 50_000,
    source: "shop",
    unobtainable: true,
    shopBuyable: true,
  },
];

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

export const SHOP_PETS: PetDef[] = PETS.filter(
  (p) => !p.source || p.source === "shop",
).filter((p) => p.baseRarity !== "unobtainable" || p.shopBuyable === true);

const PET_DIVISOR: Record<RarityKey, number> = {
  common: 0,
  uncommon: 0,
  rare: 10,
  epic: 100,
  legendary: 1000,
  mythic: 10000,
  unobtainable: 0,
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
  const tierPets = SHOP_PETS.filter(
    (p) => p.baseRarity === tier && !p.shopBuyable,
  );
  if (tierPets.length === 0) return null;
  const unowned = tierPets.filter((p) => !ownedIds.has(p.id));
  const pool = unowned.length > 0 ? unowned : tierPets;
  return pool[Math.floor(Math.random() * pool.length)].id;
}

export function petCurrentRarity(def: PetDef, petLevel: number): RarityKey {
  if (def.baseRarity === "unobtainable") return "unobtainable";
  const lv = Math.max(1, petLevel);
  if (lv >= TIER_LEVEL_START.mythic) return "mythic";
  if (lv >= TIER_LEVEL_START.legendary) return "legendary";
  if (lv >= TIER_LEVEL_START.epic) return "epic";
  if (lv >= TIER_LEVEL_START.rare) return "rare";
  if (lv >= TIER_LEVEL_START.uncommon) return "uncommon";
  return "common";
}

function petEffectScale(def: PetDef, petLevel: number): number {
  if (def.baseRarity === "unobtainable") return 1;
  const cur = petCurrentRarity(def, petLevel);
  let scale = 1;
  const baseIdx = NORMAL_TIERS.indexOf(def.baseRarity);
  const curIdx = NORMAL_TIERS.indexOf(cur);
  for (let i = baseIdx + 1; i <= curIdx; i++) {
    const boost = EVOLUTION_BOOST[NORMAL_TIERS[i]] ?? 0;
    scale *= 1 + boost;
  }
  const tierStart = TIER_LEVEL_START[cur];
  const levelsInTier = Math.max(0, petLevel - tierStart);
  scale *= 1 + levelsInTier * PER_LEVEL_BONUS;
  return scale;
}

export function effectiveEffect(
  def: PetDef,
  petLevel: number,
): Required<
  Pick<
    PetEffect,
    "coinMult" | "xpMult" | "rarityTilt" | "rollSpeedMult" | "bossDamageMult"
  >
> {
  const scale = petEffectScale(def, petLevel);
  const e = def.effect;
  const scaleBonus = (m?: number) => (m == null ? 1 : 1 + (m - 1) * scale);
  const scaleSpeed = (m?: number) => {
    if (m == null) return 1;
    const speedBonus = 1 - m;
    const newBonus = Math.min(0.95, speedBonus * scale);
    return 1 - newBonus;
  };
  const scaleBossDmg = (m?: number) =>
    m == null ? 1 : 1 + (m - 1) * scale;
  return {
    coinMult: scaleBonus(e.coinMult),
    xpMult: scaleBonus(e.xpMult),
    rarityTilt: (e.rarityTilt ?? 0) * scale,
    rollSpeedMult: scaleSpeed(e.rollSpeedMult),
    bossDamageMult: scaleBossDmg(e.bossDamageMult),
  };
}

export function evolutionInfo(
  def: PetDef,
  inst: PetInstance,
  playerLevel: number,
): {
  cur: RarityKey;
  next: RarityKey | null;
  petLevelNeeded: number;
  playerLevelNeeded: number;
} {
  const cur = petCurrentRarity(def, inst.level);
  if (def.baseRarity === "unobtainable") {
    return { cur: "unobtainable", next: null, petLevelNeeded: 9999, playerLevelNeeded: 0 };
  }
  const curIdx = NORMAL_TIERS.indexOf(cur);
  const next = curIdx < NORMAL_TIERS.length - 1 ? NORMAL_TIERS[curIdx + 1] : null;
  const petLevelNeeded = next ? TIER_LEVEL_START[next] : 9999;
  const playerLevelNeeded = next
    ? (curIdx + 1) * 10
    : 0;
  void playerLevel;
  return { cur, next, petLevelNeeded, playerLevelNeeded };
}

export function petUpgradeCost(
  def: PetDef,
  currentLevel: number,
): { coins: number; gems: number } {
  if (def.baseRarity === "unobtainable") {
    return { coins: Number.POSITIVE_INFINITY, gems: Number.POSITIVE_INFINITY };
  }
  const base = def.costCoins > 0 ? def.costCoins : 1000;
  const coins = Math.floor(base * 0.1 * Math.pow(1.08, currentLevel));
  const gems =
    currentLevel >= PET_GEM_LEVEL_THRESHOLD
      ? Math.max(1, Math.floor((currentLevel - PET_GEM_LEVEL_THRESHOLD) / 5) + 1)
      : 0;
  return { coins, gems };
}

export function isPetMaxed(def: PetDef, currentLevel: number): boolean {
  if (def.baseRarity === "unobtainable") return true;
  return currentLevel >= MAX_PET_LEVEL;
}
