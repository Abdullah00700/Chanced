import { RARITY_RANK } from "./rarity";
import type { Profile, RarityKey } from "./types";

export type AchievementRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic"
  | "unobtainable";

export type Achievement = {
  id: string;
  name: string;
  description: string;
  rarity: AchievementRarity;
  reward: { coins: number; xp: number; gems: number; petId?: string };
  check: (p: Profile, ctx: AchCheckCtx) => boolean;
};

export type AchCheckCtx = {
  lastRoll: { number: number; rarity: RarityKey } | null;
  mythicStreak?: number;
};

const A: Achievement[] = [
  // ============================ COMMON ============================
  {
    id: "first_roll",
    name: "Welcome to the Curve",
    description: "Roll for the first time.",
    rarity: "common",
    reward: { coins: 50, xp: 25, gems: 1 },
    check: (p) => p.totalRolls >= 1,
  },
  {
    id: "rolls_10",
    name: "Getting the Hang",
    description: "Roll 10 times.",
    rarity: "common",
    reward: { coins: 80, xp: 40, gems: 0 },
    check: (p) => p.totalRolls >= 10,
  },
  {
    id: "rolls_50",
    name: "Just Warming Up",
    description: "Roll 50 times.",
    rarity: "common",
    reward: { coins: 200, xp: 100, gems: 1 },
    check: (p) => p.totalRolls >= 50,
  },
  {
    id: "rolls_100",
    name: "Triple Digits",
    description: "Roll 100 times.",
    rarity: "common",
    reward: { coins: 400, xp: 200, gems: 1 },
    check: (p) => p.totalRolls >= 100,
  },
  {
    id: "first_uncommon",
    name: "Off-White",
    description: "Roll an UNCOMMON for the first time.",
    rarity: "common",
    reward: { coins: 50, xp: 30, gems: 1 },
    check: (p) => p.rollsByRarity.uncommon >= 1,
  },
  {
    id: "uncommon_10",
    name: "Lightly Spiced",
    description: "Roll 10 uncommons.",
    rarity: "common",
    reward: { coins: 200, xp: 100, gems: 1 },
    check: (p) => p.rollsByRarity.uncommon >= 10,
  },
  {
    id: "first_pet",
    name: "Best Friend",
    description: "Acquire your first pet.",
    rarity: "common",
    reward: { coins: 1000, xp: 500, gems: 2 },
    check: (p) => Object.keys(p.pets).length >= 1,
  },
  {
    id: "first_upgrade",
    name: "Tinkerer",
    description: "Buy any upgrade in the shop.",
    rarity: "common",
    reward: { coins: 500, xp: 250, gems: 1 },
    check: (p) => p.upgrades.coin + p.upgrades.rarity >= 1,
  },
  {
    id: "level_3",
    name: "Sprout",
    description: "Reach level 3.",
    rarity: "common",
    reward: { coins: 100, xp: 0, gems: 1 },
    check: (p) => p.level >= 3,
  },
  {
    id: "level_5",
    name: "Apprentice",
    description: "Reach level 5.",
    rarity: "common",
    reward: { coins: 200, xp: 0, gems: 1 },
    check: (p) => p.level >= 5,
  },
  {
    id: "rich_1k",
    name: "First Thousand",
    description: "Hold 1,000 coins.",
    rarity: "common",
    reward: { coins: 0, xp: 100, gems: 1 },
    check: (p) => p.coins >= 1000,
  },
  {
    id: "equip_pet",
    name: "Suited Up",
    description: "Equip any pet.",
    rarity: "common",
    reward: { coins: 200, xp: 100, gems: 1 },
    check: (p) => p.equippedPet != null,
  },
  {
    id: "rolled_any_5xxx",
    name: "Center Mass",
    description: "Land in the 4900–5100 range.",
    rarity: "common",
    reward: { coins: 100, xp: 50, gems: 1 },
    check: (_p, c) =>
      c.lastRoll != null &&
      c.lastRoll.number >= 4900 &&
      c.lastRoll.number <= 5100,
  },

  // ============================ UNCOMMON ============================
  {
    id: "rolls_500",
    name: "Roller",
    description: "Roll 500 times.",
    rarity: "uncommon",
    reward: { coins: 1500, xp: 500, gems: 2 },
    check: (p) => p.totalRolls >= 500,
  },
  {
    id: "rolls_1000",
    name: "Four Digits",
    description: "Roll 1,000 times.",
    rarity: "uncommon",
    reward: { coins: 3000, xp: 1500, gems: 3 },
    check: (p) => p.totalRolls >= 1000,
  },
  {
    id: "first_rare",
    name: "Tinted Cyan",
    description: "Roll a RARE for the first time.",
    rarity: "uncommon",
    reward: { coins: 200, xp: 100, gems: 1 },
    check: (p) => p.rollsByRarity.rare >= 1,
  },
  {
    id: "rare_10",
    name: "Cyan Streak",
    description: "Roll 10 rares.",
    rarity: "uncommon",
    reward: { coins: 1500, xp: 600, gems: 2 },
    check: (p) => p.rollsByRarity.rare >= 10,
  },
  {
    id: "level_10",
    name: "Adept",
    description: "Reach level 10.",
    rarity: "uncommon",
    reward: { coins: 1000, xp: 0, gems: 2 },
    check: (p) => p.level >= 10,
  },
  {
    id: "level_15",
    name: "Skilled",
    description: "Reach level 15.",
    rarity: "uncommon",
    reward: { coins: 2500, xp: 0, gems: 3 },
    check: (p) => p.level >= 15,
  },
  {
    id: "rich_10k",
    name: "Pocket Change",
    description: "Hold 10,000 coins.",
    rarity: "uncommon",
    reward: { coins: 0, xp: 200, gems: 1 },
    check: (p) => p.coins >= 10000,
  },
  {
    id: "two_pets",
    name: "Pair of Pals",
    description: "Own 2 different pets.",
    rarity: "uncommon",
    reward: { coins: 1500, xp: 500, gems: 2 },
    check: (p) => Object.keys(p.pets).length >= 2,
  },
  {
    id: "five_pets",
    name: "The Menagerie",
    description: "Own 5 different pets.",
    rarity: "uncommon",
    reward: { coins: 5000, xp: 2000, gems: 5 },
    check: (p) => Object.keys(p.pets).length >= 5,
  },
  {
    id: "coin_upgrade_5",
    name: "Saver",
    description: "Reach Coin Upgrade level 5.",
    rarity: "uncommon",
    reward: { coins: 2000, xp: 800, gems: 2 },
    check: (p) => p.upgrades.coin >= 5,
  },
  {
    id: "rarity_upgrade_5",
    name: "Tilt the Curve",
    description: "Reach Rarity Upgrade level 5.",
    rarity: "uncommon",
    reward: { coins: 2000, xp: 800, gems: 2 },
    check: (p) => p.upgrades.rarity >= 5,
  },
  {
    id: "exact_5000",
    name: "Center of Gravity",
    description: "Roll exactly 5000.",
    rarity: "uncommon",
    reward: { coins: 500, xp: 200, gems: 1 },
    check: (_p, c) => c.lastRoll?.number === 5000,
  },
  {
    id: "any_3000",
    name: "Triple Threes",
    description: "Roll exactly 3000 or 7000.",
    rarity: "uncommon",
    reward: { coins: 600, xp: 250, gems: 1 },
    check: (_p, c) =>
      c.lastRoll?.number === 3000 || c.lastRoll?.number === 7000,
  },
  {
    id: "first_booster",
    name: "Juiced",
    description: "Activate any booster.",
    rarity: "uncommon",
    reward: { coins: 400, xp: 200, gems: 2 },
    check: (p) => p.boosters.coinUntil > 0 || p.boosters.rarityUntil > 0,
  },

  // ============================ RARE ============================
  {
    id: "rolls_5000",
    name: "Addict",
    description: "Roll 5,000 times.",
    rarity: "rare",
    reward: { coins: 15000, xp: 5000, gems: 5 },
    check: (p) => p.totalRolls >= 5000,
  },
  {
    id: "rolls_10000",
    name: "Five Digits",
    description: "Roll 10,000 times.",
    rarity: "rare",
    reward: { coins: 30000, xp: 12000, gems: 8 },
    check: (p) => p.totalRolls >= 10000,
  },
  {
    id: "first_epic",
    name: "Going Blue",
    description: "Roll an EPIC for the first time.",
    rarity: "rare",
    reward: { coins: 1000, xp: 400, gems: 2 },
    check: (p) => p.rollsByRarity.epic >= 1,
  },
  {
    id: "epic_10",
    name: "Sapphire Hands",
    description: "Roll 10 epics.",
    rarity: "rare",
    reward: { coins: 8000, xp: 3000, gems: 4 },
    check: (p) => p.rollsByRarity.epic >= 10,
  },
  {
    id: "level_25",
    name: "Veteran",
    description: "Reach level 25.",
    rarity: "rare",
    reward: { coins: 5000, xp: 0, gems: 5 },
    check: (p) => p.level >= 25,
  },
  {
    id: "level_30",
    name: "Seasoned",
    description: "Reach level 30.",
    rarity: "rare",
    reward: { coins: 10000, xp: 0, gems: 8 },
    check: (p) => p.level >= 30,
  },
  {
    id: "rich_100k",
    name: "Tycoon",
    description: "Hold 100,000 coins.",
    rarity: "rare",
    reward: { coins: 0, xp: 2000, gems: 3 },
    check: (p) => p.coins >= 100000,
  },
  {
    id: "ten_pets",
    name: "Pet Collector",
    description: "Own 10 different pets.",
    rarity: "rare",
    reward: { coins: 25000, xp: 10000, gems: 10 },
    check: (p) => Object.keys(p.pets).length >= 10,
  },
  {
    id: "coin_upgrade_10",
    name: "Compounding",
    description: "Reach Coin Upgrade level 10.",
    rarity: "rare",
    reward: { coins: 5000, xp: 2000, gems: 3 },
    check: (p) => p.upgrades.coin >= 10,
  },
  {
    id: "rarity_upgrade_10",
    name: "Bending Probability",
    description: "Reach Rarity Upgrade level 10.",
    rarity: "rare",
    reward: { coins: 5000, xp: 2000, gems: 3 },
    check: (p) => p.upgrades.rarity >= 10,
  },
  {
    id: "exact_2500",
    name: "Quartertile",
    description: "Roll exactly 2500 or 7500.",
    rarity: "rare",
    reward: { coins: 1500, xp: 500, gems: 2 },
    check: (_p, c) =>
      c.lastRoll?.number === 2500 || c.lastRoll?.number === 7500,
  },
  {
    id: "evolved_pet_uncommon",
    name: "First Evolution",
    description: "Evolve a pet to UNCOMMON.",
    rarity: "rare",
    reward: { coins: 5000, xp: 2000, gems: 3 },
    check: (p) =>
      Object.values(p.pets).some((inst) => (inst.level ?? 1) >= 11),
  },

  // ============================ EPIC ============================
  {
    id: "rolls_25000",
    name: "Roller Without End",
    description: "Roll 25,000 times.",
    rarity: "epic",
    reward: { coins: 100000, xp: 30000, gems: 15 },
    check: (p) => p.totalRolls >= 25000,
  },
  {
    id: "first_legendary",
    name: "Goldenrod",
    description: "Roll a LEGENDARY for the first time.",
    rarity: "epic",
    reward: { coins: 5000, xp: 2000, gems: 5 },
    check: (p) => p.rollsByRarity.legendary >= 1,
  },
  {
    id: "legendary_5",
    name: "Solar Flare",
    description: "Roll 5 legendaries.",
    rarity: "epic",
    reward: { coins: 25000, xp: 10000, gems: 10 },
    check: (p) => p.rollsByRarity.legendary >= 5,
  },
  {
    id: "level_50",
    name: "Master",
    description: "Reach level 50.",
    rarity: "epic",
    reward: { coins: 25000, xp: 0, gems: 15 },
    check: (p) => p.level >= 50,
  },
  {
    id: "rich_1m",
    name: "Millionaire",
    description: "Hold 1,000,000 coins.",
    rarity: "epic",
    reward: { coins: 0, xp: 20000, gems: 10 },
    check: (p) => p.coins >= 1_000_000,
  },
  {
    id: "fifteen_pets",
    name: "Almost All",
    description: "Own 15 different pets.",
    rarity: "epic",
    reward: { coins: 100000, xp: 30000, gems: 20 },
    check: (p) => Object.keys(p.pets).length >= 15,
  },
  {
    id: "evolved_pet_rare",
    name: "Hardened",
    description: "Evolve a pet to RARE.",
    rarity: "epic",
    reward: { coins: 25000, xp: 8000, gems: 8 },
    check: (p) =>
      Object.values(p.pets).some((inst) => (inst.level ?? 1) >= 21),
  },
  {
    id: "coin_upgrade_25",
    name: "Geometric",
    description: "Reach Coin Upgrade level 25.",
    rarity: "epic",
    reward: { coins: 50000, xp: 15000, gems: 10 },
    check: (p) => p.upgrades.coin >= 25,
  },
  {
    id: "rarity_upgrade_25",
    name: "Reality Bender",
    description: "Reach Rarity Upgrade level 25.",
    rarity: "epic",
    reward: { coins: 50000, xp: 15000, gems: 10 },
    check: (p) => p.upgrades.rarity >= 25,
  },

  // ============================ LEGENDARY ============================
  {
    id: "rolls_100000",
    name: "Six Digits",
    description: "Roll 100,000 times.",
    rarity: "legendary",
    reward: { coins: 1_000_000, xp: 300000, gems: 50 },
    check: (p) => p.totalRolls >= 100000,
  },
  {
    id: "first_mythic",
    name: "The Void",
    description: "Roll a MYTHIC for the first time.",
    rarity: "legendary",
    reward: { coins: 25000, xp: 10000, gems: 15 },
    check: (p) => p.rollsByRarity.mythic >= 1,
  },
  {
    id: "mythic_5",
    name: "Voidtouched",
    description: "Roll 5 mythics.",
    rarity: "legendary",
    reward: { coins: 250000, xp: 75000, gems: 30 },
    check: (p) => p.rollsByRarity.mythic >= 5,
  },
  {
    id: "level_100",
    name: "Centurion",
    description: "Reach level 100.",
    rarity: "legendary",
    reward: { coins: 500000, xp: 0, gems: 50 },
    check: (p) => p.level >= 100,
  },
  {
    id: "rich_10m",
    name: "Fortune",
    description: "Hold 10,000,000 coins.",
    rarity: "legendary",
    reward: { coins: 0, xp: 250000, gems: 30 },
    check: (p) => p.coins >= 10_000_000,
  },
  {
    id: "twenty_pets",
    name: "Completionist",
    description: "Own 20 different pets.",
    rarity: "legendary",
    reward: { coins: 1_000_000, xp: 200000, gems: 50 },
    check: (p) => Object.keys(p.pets).length >= 20,
  },
  {
    id: "evolved_pet_legendary",
    name: "Ascendant",
    description: "Evolve a pet to LEGENDARY.",
    rarity: "legendary",
    reward: { coins: 500000, xp: 150000, gems: 30 },
    check: (p) =>
      Object.values(p.pets).some((inst) => (inst.level ?? 1) >= 41),
  },

  // ============================ MYTHIC ============================
  {
    id: "edge_zero",
    name: "Absolute Zero",
    description: "Roll exactly 0.",
    rarity: "mythic",
    reward: { coins: 250000, xp: 100000, gems: 100 },
    check: (_p, c) => c.lastRoll?.number === 0,
  },
  {
    id: "edge_max",
    name: "Maxed",
    description: "Roll exactly 10000.",
    rarity: "mythic",
    reward: { coins: 250000, xp: 100000, gems: 100 },
    check: (_p, c) => c.lastRoll?.number === 10000,
  },
  {
    id: "mythic_25",
    name: "Voidsworn",
    description: "Roll 25 mythics.",
    rarity: "mythic",
    reward: { coins: 2_000_000, xp: 500000, gems: 100 },
    check: (p) => p.rollsByRarity.mythic >= 25,
  },
  {
    id: "level_250",
    name: "Demigod",
    description: "Reach level 250.",
    rarity: "mythic",
    reward: { coins: 5_000_000, xp: 0, gems: 200 },
    check: (p) => p.level >= 250,
  },
  {
    id: "rich_100m",
    name: "Plutocrat",
    description: "Hold 100,000,000 coins.",
    rarity: "mythic",
    reward: { coins: 0, xp: 1_000_000, gems: 100 },
    check: (p) => p.coins >= 100_000_000,
  },
  {
    id: "evolved_pet_mythic",
    name: "Reality-Bender",
    description: "Evolve a pet all the way to MYTHIC.",
    rarity: "mythic",
    reward: { coins: 5_000_000, xp: 1_000_000, gems: 150 },
    check: (p) =>
      Object.values(p.pets).some((inst) => (inst.level ?? 1) >= 51),
  },

  // ============================ UNOBTAINABLE ============================
  {
    id: "the_unobtainable",
    name: "Beyond the Curve",
    description:
      "Roll an UNOBTAINABLE, OR land 3 mythics in a row. Drops the Cybernetic Ultimate Dragon.",
    rarity: "unobtainable",
    reward: {
      coins: 10_000_000,
      xp: 5_000_000,
      gems: 1000,
      petId: "cybernetic-dragon",
    },
    check: (_p, c) =>
      c.lastRoll?.rarity === "unobtainable" || (c.mythicStreak ?? 0) >= 3,
  },
  {
    id: "cosmic_ascent",
    name: "Cosmic Ascent",
    description:
      "Roll an UNOBTAINABLE number. The Cosmic Serpent recognizes its master.",
    rarity: "unobtainable",
    reward: {
      coins: 25_000_000,
      xp: 10_000_000,
      gems: 2000,
      petId: "cosmic-serpent",
    },
    check: (_p, c) => c.lastRoll?.rarity === "unobtainable",
  },
];

// Sort: lowest rarity first, then by id for stable order.
A.sort((a, b) => {
  const ra = RARITY_RANK[a.rarity];
  const rb = RARITY_RANK[b.rarity];
  if (ra !== rb) return ra - rb;
  return a.id.localeCompare(b.id);
});

export const ACHIEVEMENTS: Achievement[] = A;

export const ACHIEVEMENT_BY_ID: Record<string, Achievement> = ACHIEVEMENTS.reduce(
  (acc, a) => {
    acc[a.id] = a;
    return acc;
  },
  {} as Record<string, Achievement>,
);
