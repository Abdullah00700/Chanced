// Quest system: daily, weekly, and special.
//
// Daily quests refresh 18 hours after the whole batch is generated.
// Weekly quests refresh 7 days after generation.
// Special quests are persistent goals tracked through profile counters.

import type { Profile, RarityKey } from "./types";

export type QuestKind = "daily" | "weekly" | "special";

export type QuestDef = {
  id: string;
  kind: QuestKind;
  name: string;
  description: string;
  /** Returns current progress (0..target). */
  progress: (p: Profile) => number;
  target: number;
  reward: { coins: number; xp: number; gems: number; petId?: string };
  /** For special quests, an optional long-form how-to-obtain string. */
  howTo?: string;
};

// ---------------- DAILY QUESTS (>=20) ----------------
const DAILY: QuestDef[] = [
  {
    id: "d-rolls-25",
    kind: "daily",
    name: "Warming Up",
    description: "Roll 25 times today.",
    progress: (p) => p.quests.dailyProgress["d-rolls-25"] ?? 0,
    target: 25,
    reward: { coins: 1500, xp: 400, gems: 1 },
  },
  {
    id: "d-rolls-100",
    kind: "daily",
    name: "Daily Grinder",
    description: "Roll 100 times today.",
    progress: (p) => p.quests.dailyProgress["d-rolls-100"] ?? 0,
    target: 100,
    reward: { coins: 6000, xp: 1500, gems: 2 },
  },
  {
    id: "d-uncommon-5",
    kind: "daily",
    name: "Off-color",
    description: "Roll 5 uncommons today.",
    progress: (p) => p.quests.dailyProgress["d-uncommon-5"] ?? 0,
    target: 5,
    reward: { coins: 2000, xp: 600, gems: 1 },
  },
  {
    id: "d-rare-3",
    kind: "daily",
    name: "Cyan Day",
    description: "Roll 3 rares today.",
    progress: (p) => p.quests.dailyProgress["d-rare-3"] ?? 0,
    target: 3,
    reward: { coins: 4000, xp: 1000, gems: 2 },
  },
  {
    id: "d-epic-1",
    kind: "daily",
    name: "Lucky Drop",
    description: "Roll 1 epic today.",
    progress: (p) => p.quests.dailyProgress["d-epic-1"] ?? 0,
    target: 1,
    reward: { coins: 8000, xp: 2000, gems: 3 },
  },
  {
    id: "d-coins-50k",
    kind: "daily",
    name: "Coin Stack",
    description: "Earn 50,000 coins from rolls today.",
    progress: (p) => p.quests.dailyProgress["d-coins-50k"] ?? 0,
    target: 50000,
    reward: { coins: 5000, xp: 1500, gems: 2 },
  },
  {
    id: "d-xp-5k",
    kind: "daily",
    name: "Bookworm",
    description: "Earn 5,000 XP today.",
    progress: (p) => p.quests.dailyProgress["d-xp-5k"] ?? 0,
    target: 5000,
    reward: { coins: 4000, xp: 0, gems: 2 },
  },
  {
    id: "d-equip-pet",
    kind: "daily",
    name: "Suited Up",
    description: "Have a pet equipped (any).",
    progress: (p) => (p.equippedPets.some((id) => id != null) ? 1 : 0),
    target: 1,
    reward: { coins: 1000, xp: 300, gems: 1 },
  },
  {
    id: "d-buy-upgrade",
    kind: "daily",
    name: "Tinkerer",
    description: "Buy any upgrade today.",
    progress: (p) => p.quests.dailyProgress["d-buy-upgrade"] ?? 0,
    target: 1,
    reward: { coins: 1500, xp: 500, gems: 1 },
  },
  {
    id: "d-booster",
    kind: "daily",
    name: "Juiced",
    description: "Activate any booster today.",
    progress: (p) => p.quests.dailyProgress["d-booster"] ?? 0,
    target: 1,
    reward: { coins: 2000, xp: 600, gems: 2 },
  },
  {
    id: "d-hatch-1",
    kind: "daily",
    name: "Crack One Open",
    description: "Hatch 1 egg today.",
    progress: (p) => p.quests.dailyProgress["d-hatch-1"] ?? 0,
    target: 1,
    reward: { coins: 3000, xp: 1000, gems: 2 },
  },
  {
    id: "d-roll-near-5000",
    kind: "daily",
    name: "Center Mass",
    description: "Land in the 4900–5100 range.",
    progress: (p) => p.quests.dailyProgress["d-roll-near-5000"] ?? 0,
    target: 1,
    reward: { coins: 1500, xp: 500, gems: 1 },
  },
  {
    id: "d-roll-edge",
    kind: "daily",
    name: "Edge Walker",
    description: "Roll a number under 100 or over 9900.",
    progress: (p) => p.quests.dailyProgress["d-roll-edge"] ?? 0,
    target: 1,
    reward: { coins: 5000, xp: 1500, gems: 2 },
  },
  {
    id: "d-spend-coins",
    kind: "daily",
    name: "Spender",
    description: "Spend 25,000 coins today.",
    progress: (p) => p.quests.dailyProgress["d-spend-coins"] ?? 0,
    target: 25000,
    reward: { coins: 4000, xp: 1500, gems: 2 },
  },
  {
    id: "d-pet-upgrade",
    kind: "daily",
    name: "Sharper Steel",
    description: "Upgrade any pet today.",
    progress: (p) => p.quests.dailyProgress["d-pet-upgrade"] ?? 0,
    target: 3,
    reward: { coins: 5000, xp: 1500, gems: 2 },
  },
  {
    id: "d-event-trigger",
    kind: "daily",
    name: "Stormchaser",
    description: "Trigger 1 weather event.",
    progress: (p) => p.quests.dailyProgress["d-event-trigger"] ?? 0,
    target: 1,
    reward: { coins: 3000, xp: 1000, gems: 2 },
  },
  {
    id: "d-rolls-200",
    kind: "daily",
    name: "Marathon",
    description: "Roll 200 times today.",
    progress: (p) => p.quests.dailyProgress["d-rolls-200"] ?? 0,
    target: 200,
    reward: { coins: 12000, xp: 3000, gems: 3 },
  },
  {
    id: "d-rare-10",
    kind: "daily",
    name: "Cyan Splash",
    description: "Roll 10 rares today.",
    progress: (p) => p.quests.dailyProgress["d-rare-10"] ?? 0,
    target: 10,
    reward: { coins: 9000, xp: 2500, gems: 3 },
  },
  {
    id: "d-shop-pet",
    kind: "daily",
    name: "Shopaholic",
    description: "Buy 1 pet from the shop today.",
    progress: (p) => p.quests.dailyProgress["d-shop-pet"] ?? 0,
    target: 1,
    reward: { coins: 4000, xp: 1500, gems: 2 },
  },
  {
    id: "d-pets-3",
    kind: "daily",
    name: "Three's Company",
    description: "Have 3+ pets in your collection.",
    progress: (p) => Math.min(3, Object.keys(p.pets).length),
    target: 3,
    reward: { coins: 2500, xp: 800, gems: 1 },
  },
];

// ---------------- WEEKLY QUESTS (>=20) ----------------
const WEEKLY: QuestDef[] = [
  {
    id: "w-rolls-1000",
    kind: "weekly",
    name: "Weekly Cycle",
    description: "Roll 1,000 times this week.",
    progress: (p) => p.quests.weeklyProgress["w-rolls-1000"] ?? 0,
    target: 1000,
    reward: { coins: 50000, xp: 15000, gems: 10 },
  },
  {
    id: "w-rolls-5000",
    kind: "weekly",
    name: "Iron Wrist",
    description: "Roll 5,000 times this week.",
    progress: (p) => p.quests.weeklyProgress["w-rolls-5000"] ?? 0,
    target: 5000,
    reward: { coins: 250000, xp: 60000, gems: 25 },
  },
  {
    id: "w-epic-10",
    kind: "weekly",
    name: "Sapphire Hands",
    description: "Roll 10 epics this week.",
    progress: (p) => p.quests.weeklyProgress["w-epic-10"] ?? 0,
    target: 10,
    reward: { coins: 60000, xp: 18000, gems: 12 },
  },
  {
    id: "w-legendary-3",
    kind: "weekly",
    name: "Solar Trio",
    description: "Roll 3 legendaries this week.",
    progress: (p) => p.quests.weeklyProgress["w-legendary-3"] ?? 0,
    target: 3,
    reward: { coins: 100000, xp: 30000, gems: 18 },
  },
  {
    id: "w-mythic-1",
    kind: "weekly",
    name: "First Mythic",
    description: "Roll a mythic this week.",
    progress: (p) => p.quests.weeklyProgress["w-mythic-1"] ?? 0,
    target: 1,
    reward: { coins: 200000, xp: 60000, gems: 25 },
  },
  {
    id: "w-coins-500k",
    kind: "weekly",
    name: "Half a Mil",
    description: "Earn 500,000 coins from rolls this week.",
    progress: (p) => p.quests.weeklyProgress["w-coins-500k"] ?? 0,
    target: 500_000,
    reward: { coins: 60000, xp: 15000, gems: 12 },
  },
  {
    id: "w-xp-50k",
    kind: "weekly",
    name: "Curve Climber",
    description: "Earn 50,000 XP this week.",
    progress: (p) => p.quests.weeklyProgress["w-xp-50k"] ?? 0,
    target: 50000,
    reward: { coins: 40000, xp: 0, gems: 12 },
  },
  {
    id: "w-hatch-10",
    kind: "weekly",
    name: "Hatchery",
    description: "Hatch 10 eggs this week.",
    progress: (p) => p.quests.weeklyProgress["w-hatch-10"] ?? 0,
    target: 10,
    reward: { coins: 80000, xp: 20000, gems: 15 },
  },
  {
    id: "w-pet-evolutions",
    kind: "weekly",
    name: "Ascending",
    description: "Evolve any pet 2 rarity tiers this week.",
    progress: (p) => p.quests.weeklyProgress["w-pet-evolutions"] ?? 0,
    target: 2,
    reward: { coins: 120000, xp: 30000, gems: 18 },
  },
  {
    id: "w-coin-up-3",
    kind: "weekly",
    name: "Compounding",
    description: "Buy 3 coin upgrades this week.",
    progress: (p) => p.quests.weeklyProgress["w-coin-up-3"] ?? 0,
    target: 3,
    reward: { coins: 50000, xp: 12000, gems: 10 },
  },
  {
    id: "w-rarity-up-3",
    kind: "weekly",
    name: "Bender",
    description: "Buy 3 rarity upgrades this week.",
    progress: (p) => p.quests.weeklyProgress["w-rarity-up-3"] ?? 0,
    target: 3,
    reward: { coins: 50000, xp: 12000, gems: 10 },
  },
  {
    id: "w-pets-10",
    kind: "weekly",
    name: "Collector",
    description: "Own 10 different pets.",
    progress: (p) => Math.min(10, Object.keys(p.pets).length),
    target: 10,
    reward: { coins: 100000, xp: 30000, gems: 20 },
  },
  {
    id: "w-events-5",
    kind: "weekly",
    name: "Storm Watcher",
    description: "Trigger 5 weather events this week.",
    progress: (p) => p.quests.weeklyProgress["w-events-5"] ?? 0,
    target: 5,
    reward: { coins: 60000, xp: 18000, gems: 15 },
  },
  {
    id: "w-near-edges",
    kind: "weekly",
    name: "Walking Tightrope",
    description: "Roll under 50 or over 9950 — 3 times.",
    progress: (p) => p.quests.weeklyProgress["w-near-edges"] ?? 0,
    target: 3,
    reward: { coins: 80000, xp: 20000, gems: 15 },
  },
  {
    id: "w-pets-equipped-3",
    kind: "weekly",
    name: "Triple Loadout",
    description: "Equip 3 pets at once.",
    progress: (p) => p.equippedPets.filter((id) => id != null).length,
    target: 3,
    reward: { coins: 80000, xp: 20000, gems: 15 },
  },
  {
    id: "w-rebirth-1",
    kind: "weekly",
    name: "Rebirth",
    description: "Perform at least 1 rebirth this week.",
    progress: (p) => p.quests.weeklyProgress["w-rebirth-1"] ?? 0,
    target: 1,
    reward: { coins: 250000, xp: 60000, gems: 30 },
  },
  {
    id: "w-shop-pet-3",
    kind: "weekly",
    name: "Frequent Buyer",
    description: "Buy 3 pets from the shop this week.",
    progress: (p) => p.quests.weeklyProgress["w-shop-pet-3"] ?? 0,
    target: 3,
    reward: { coins: 60000, xp: 15000, gems: 12 },
  },
  {
    id: "w-pet-upgrades-25",
    kind: "weekly",
    name: "Sharpener",
    description: "Upgrade pets 25 times this week.",
    progress: (p) => p.quests.weeklyProgress["w-pet-upgrades-25"] ?? 0,
    target: 25,
    reward: { coins: 90000, xp: 22000, gems: 15 },
  },
  {
    id: "w-rolls-500-day",
    kind: "weekly",
    name: "Weekly Spinner",
    description: "Roll 2,500 times this week.",
    progress: (p) => p.quests.weeklyProgress["w-rolls-500-day"] ?? 0,
    target: 2500,
    reward: { coins: 120000, xp: 30000, gems: 20 },
  },
  {
    id: "w-buy-eggs",
    kind: "weekly",
    name: "Buyer of Shells",
    description: "Buy 5 eggs from the shop this week.",
    progress: (p) => p.quests.weeklyProgress["w-buy-eggs"] ?? 0,
    target: 5,
    reward: { coins: 80000, xp: 20000, gems: 15 },
  },
];

// ---------------- SPECIAL QUESTS (persistent) ----------------
const SPECIAL: QuestDef[] = [
  {
    id: "sp-cosmic-serpent",
    kind: "special",
    name: "Cosmic Ascent",
    description:
      "Roll an UNOBTAINABLE number — the Cosmic Serpent recognizes its master.",
    progress: (p) => (p.quests.specialProgress["cosmic-serpent"] ?? 0),
    target: 1,
    reward: {
      coins: 25_000_000,
      xp: 10_000_000,
      gems: 2000,
      petId: "cosmic-serpent",
    },
    howTo:
      "Roll the unobtainable number 0. The Cosmic Serpent will be granted automatically.",
  },
  {
    id: "sp-cybernetic-dragon",
    kind: "special",
    name: "Beyond the Curve",
    description:
      "Roll the unobtainable number 10000 — the Cybernetic Ultimate Dragon awakens.",
    progress: (p) => (p.quests.specialProgress["cybernetic-dragon"] ?? 0),
    target: 1,
    reward: {
      coins: 10_000_000,
      xp: 5_000_000,
      gems: 1000,
      petId: "cybernetic-dragon",
    },
    howTo:
      "Roll the unobtainable number 10000. Three mythics in a row also awaken it.",
  },
  {
    id: "sp-monkey",
    kind: "special",
    name: "The Developer Monkey",
    description: "Level up a Monkey pet to level 50.",
    progress: (p) => Math.min(50, p.quests.specialProgress["monkey-max-level"] ?? 0),
    target: 50,
    reward: {
      coins: 5_000_000,
      xp: 2_000_000,
      gems: 500,
      petId: "developer-monkey",
    },
    howTo:
      "Hatch a Monkey from the Jungle Egg, then upgrade it to level 50 in your Inventory. The Developer Monkey auto-rolls for you every 10s and triples every stat.",
  },
  {
    id: "sp-scaly-demon",
    kind: "special",
    name: "The Scaly Demon",
    description:
      "Roll 15 legendaries with a Horned Gecko equipped — awaken the Gila spirit.",
    progress: (p) => Math.min(15, p.quests.specialProgress["scaly-legendary-rolls"] ?? 0),
    target: 15,
    reward: {
      coins: 8_000_000,
      xp: 3_000_000,
      gems: 700,
      petId: "scaly-demon",
    },
    howTo:
      "Hatch a Horned Gecko from the Desert Egg and equip it. Roll 15 legendaries with it active. The Scaly Demon eats a random shop pet under epic and refunds its coin cost, then levels up that pet every 15 minutes.",
  },
  {
    id: "sp-ocean-emperor",
    kind: "special",
    name: "The Ocean Emperor",
    description:
      "Roll 7 mythics with a Shark equipped — claim the Megalodon.",
    progress: (p) => Math.min(7, p.quests.specialProgress["shark-mythic-rolls"] ?? 0),
    target: 7,
    reward: {
      coins: 12_000_000,
      xp: 4_000_000,
      gems: 1000,
      petId: "megalodon",
    },
    howTo:
      "Hatch a Shark from the Ocean Egg and equip it. Roll 7 mythics with it equipped. The Megalodon doubles every stat and devours fish for huge coin payouts.",
  },
];

export const QUEST_BY_ID: Record<string, QuestDef> = {};
for (const q of [...DAILY, ...WEEKLY, ...SPECIAL]) QUEST_BY_ID[q.id] = q;

export const DAILY_POOL = DAILY;
export const WEEKLY_POOL = WEEKLY;
export const SPECIAL_QUESTS = SPECIAL;

export const DAILY_REFRESH_MS = 18 * 60 * 60 * 1000;
export const WEEKLY_REFRESH_MS = 7 * 24 * 60 * 60 * 1000;

/** Pick N random unique quest IDs from a pool. */
export function pickRandomQuestIds(pool: QuestDef[], n: number): string[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n).map((q) => q.id);
}

// ---------------- PROGRESS HOOK helpers ----------------
//
// The roll/buy code calls `bumpQuest(profile, "<id>", delta)` to advance
// counters tracked in dailyProgress / weeklyProgress.

export function bumpDaily(p: Profile, id: string, delta = 1) {
  if (!p.quests.dailyAssigned.includes(id)) return;
  p.quests.dailyProgress[id] = (p.quests.dailyProgress[id] ?? 0) + delta;
}
export function bumpWeekly(p: Profile, id: string, delta = 1) {
  if (!p.quests.weeklyAssigned.includes(id)) return;
  p.quests.weeklyProgress[id] = (p.quests.weeklyProgress[id] ?? 0) + delta;
}
export function bumpBoth(p: Profile, id: string, delta = 1) {
  bumpDaily(p, id, delta);
  bumpWeekly(p, id, delta);
}

/** Helper used by App roll handler — advances all relevant quests for a single roll. */
export function advanceForRoll(
  p: Profile,
  rarity: RarityKey,
  number: number,
  coinsEarned: number,
  xpEarned: number,
) {
  bumpDaily(p, "d-rolls-25");
  bumpDaily(p, "d-rolls-100");
  bumpDaily(p, "d-rolls-200");
  bumpWeekly(p, "w-rolls-1000");
  bumpWeekly(p, "w-rolls-5000");
  bumpWeekly(p, "w-rolls-500-day");

  if (rarity === "uncommon") bumpDaily(p, "d-uncommon-5");
  if (rarity === "rare") {
    bumpDaily(p, "d-rare-3");
    bumpDaily(p, "d-rare-10");
  }
  if (rarity === "epic") {
    bumpDaily(p, "d-epic-1");
    bumpWeekly(p, "w-epic-10");
  }
  if (rarity === "legendary") bumpWeekly(p, "w-legendary-3");
  if (rarity === "mythic") bumpWeekly(p, "w-mythic-1");

  bumpDaily(p, "d-coins-50k", coinsEarned);
  bumpDaily(p, "d-xp-5k", xpEarned);
  bumpWeekly(p, "w-coins-500k", coinsEarned);
  bumpWeekly(p, "w-xp-50k", xpEarned);

  if (number >= 4900 && number <= 5100) bumpDaily(p, "d-roll-near-5000");
  if (number < 100 || number > 9900) bumpDaily(p, "d-roll-edge");
  if (number < 50 || number > 9950) bumpWeekly(p, "w-near-edges");
}

/** Refresh daily/weekly assigned quests if their refresh time has passed. */
export function maybeRefreshQuests(p: Profile, now: number) {
  if (now >= p.quests.dailyRefreshAt || p.quests.dailyAssigned.length === 0) {
    p.quests.dailyAssigned = pickRandomQuestIds(DAILY_POOL, 5);
    p.quests.dailyProgress = {};
    p.quests.dailyClaimed = {};
    p.quests.dailyRefreshAt = now + DAILY_REFRESH_MS;
  }
  if (now >= p.quests.weeklyRefreshAt || p.quests.weeklyAssigned.length === 0) {
    p.quests.weeklyAssigned = pickRandomQuestIds(WEEKLY_POOL, 5);
    p.quests.weeklyProgress = {};
    p.quests.weeklyClaimed = {};
    p.quests.weeklyRefreshAt = now + WEEKLY_REFRESH_MS;
  }
}
