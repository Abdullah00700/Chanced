import type { Profile, RarityKey } from "./types";

export type Achievement = {
  id: string;
  name: string;
  description: string;
  reward: { coins: number; xp: number; gems: number };
  check: (p: Profile, ctx: AchCheckCtx) => boolean;
};

export type AchCheckCtx = {
  lastRoll: { number: number; rarity: RarityKey } | null;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_roll",
    name: "Welcome to the Curve",
    description: "Roll for the first time.",
    reward: { coins: 50, xp: 25, gems: 1 },
    check: (p) => p.totalRolls >= 1,
  },
  {
    id: "rolls_50",
    name: "Just Warming Up",
    description: "Roll 50 times.",
    reward: { coins: 200, xp: 100, gems: 1 },
    check: (p) => p.totalRolls >= 50,
  },
  {
    id: "rolls_500",
    name: "Roller",
    description: "Roll 500 times.",
    reward: { coins: 1500, xp: 500, gems: 2 },
    check: (p) => p.totalRolls >= 500,
  },
  {
    id: "rolls_5000",
    name: "Addict",
    description: "Roll 5,000 times.",
    reward: { coins: 15000, xp: 5000, gems: 5 },
    check: (p) => p.totalRolls >= 5000,
  },
  {
    id: "first_uncommon",
    name: "Off-White",
    description: "Roll an UNCOMMON for the first time.",
    reward: { coins: 50, xp: 30, gems: 1 },
    check: (p) => p.rollsByRarity.uncommon >= 1,
  },
  {
    id: "first_rare",
    name: "Tinted Cyan",
    description: "Roll a RARE for the first time.",
    reward: { coins: 200, xp: 100, gems: 1 },
    check: (p) => p.rollsByRarity.rare >= 1,
  },
  {
    id: "first_epic",
    name: "Going Blue",
    description: "Roll an EPIC for the first time.",
    reward: { coins: 1000, xp: 400, gems: 2 },
    check: (p) => p.rollsByRarity.epic >= 1,
  },
  {
    id: "first_legendary",
    name: "Goldenrod",
    description: "Roll a LEGENDARY for the first time.",
    reward: { coins: 5000, xp: 2000, gems: 5 },
    check: (p) => p.rollsByRarity.legendary >= 1,
  },
  {
    id: "first_mythic",
    name: "The Void",
    description: "Roll a MYTHIC for the first time.",
    reward: { coins: 25000, xp: 10000, gems: 15 },
    check: (p) => p.rollsByRarity.mythic >= 1,
  },
  {
    id: "exact_5000",
    name: "Center of Gravity",
    description: "Roll exactly 5000.",
    reward: { coins: 500, xp: 200, gems: 1 },
    check: (_p, c) => c.lastRoll?.number === 5000,
  },
  {
    id: "edge_zero",
    name: "Absolute Zero",
    description: "Roll exactly 0.",
    reward: { coins: 50000, xp: 20000, gems: 25 },
    check: (_p, c) => c.lastRoll?.number === 0,
  },
  {
    id: "edge_max",
    name: "Maxed",
    description: "Roll exactly 10000.",
    reward: { coins: 50000, xp: 20000, gems: 25 },
    check: (_p, c) => c.lastRoll?.number === 10000,
  },
  {
    id: "level_5",
    name: "Apprentice",
    description: "Reach level 5.",
    reward: { coins: 200, xp: 0, gems: 1 },
    check: (p) => p.level >= 5,
  },
  {
    id: "level_10",
    name: "Adept",
    description: "Reach level 10.",
    reward: { coins: 1000, xp: 0, gems: 2 },
    check: (p) => p.level >= 10,
  },
  {
    id: "level_25",
    name: "Veteran",
    description: "Reach level 25.",
    reward: { coins: 5000, xp: 0, gems: 5 },
    check: (p) => p.level >= 25,
  },
  {
    id: "level_50",
    name: "Master",
    description: "Reach level 50.",
    reward: { coins: 25000, xp: 0, gems: 15 },
    check: (p) => p.level >= 50,
  },
  {
    id: "rich_10k",
    name: "Pocket Change",
    description: "Hold 10,000 coins.",
    reward: { coins: 0, xp: 200, gems: 1 },
    check: (p) => p.coins >= 10000,
  },
  {
    id: "rich_100k",
    name: "Tycoon",
    description: "Hold 100,000 coins.",
    reward: { coins: 0, xp: 2000, gems: 3 },
    check: (p) => p.coins >= 100000,
  },
  {
    id: "rich_1m",
    name: "Millionaire",
    description: "Hold 1,000,000 coins.",
    reward: { coins: 0, xp: 20000, gems: 10 },
    check: (p) => p.coins >= 1000000,
  },
  {
    id: "first_pet",
    name: "Best Friend",
    description: "Acquire your first pet.",
    reward: { coins: 1000, xp: 500, gems: 2 },
    check: (p) => Object.keys(p.pets).length >= 1,
  },
  {
    id: "five_pets",
    name: "The Menagerie",
    description: "Own 5 different pets.",
    reward: { coins: 10000, xp: 5000, gems: 10 },
    check: (p) => Object.keys(p.pets).length >= 5,
  },
  {
    id: "first_upgrade",
    name: "Tinkerer",
    description: "Buy any upgrade in the shop.",
    reward: { coins: 500, xp: 250, gems: 1 },
    check: (p) => p.upgrades.coin + p.upgrades.rarity >= 1,
  },
  {
    id: "coin_upgrade_10",
    name: "Compounding",
    description: "Reach Coin Upgrade level 10.",
    reward: { coins: 5000, xp: 2000, gems: 3 },
    check: (p) => p.upgrades.coin >= 10,
  },
  {
    id: "rarity_upgrade_10",
    name: "Bending Probability",
    description: "Reach Rarity Upgrade level 10.",
    reward: { coins: 5000, xp: 2000, gems: 3 },
    check: (p) => p.upgrades.rarity >= 10,
  },
];

export const ACHIEVEMENT_BY_ID: Record<string, Achievement> = ACHIEVEMENTS.reduce(
  (acc, a) => {
    acc[a.id] = a;
    return acc;
  },
  {} as Record<string, Achievement>,
);
