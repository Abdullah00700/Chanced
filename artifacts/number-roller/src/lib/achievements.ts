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
    reward: { coins: 50, xp: 25, gems: 10 },
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
    reward: { coins: 200, xp: 100, gems: 10 },
    check: (p) => p.totalRolls >= 50,
  },
  {
    id: "rolls_100",
    name: "Triple Digits",
    description: "Roll 100 times.",
    rarity: "common",
    reward: { coins: 400, xp: 200, gems: 10 },
    check: (p) => p.totalRolls >= 100,
  },
  {
    id: "first_uncommon",
    name: "Off-White",
    description: "Roll an UNCOMMON for the first time.",
    rarity: "common",
    reward: { coins: 50, xp: 30, gems: 10 },
    check: (p) => p.rollsByRarity.uncommon >= 1,
  },
  {
    id: "uncommon_10",
    name: "Lightly Spiced",
    description: "Roll 10 uncommons.",
    rarity: "common",
    reward: { coins: 200, xp: 100, gems: 10 },
    check: (p) => p.rollsByRarity.uncommon >= 10,
  },
  {
    id: "first_pet",
    name: "Best Friend",
    description: "Acquire your first pet.",
    rarity: "common",
    reward: { coins: 1000, xp: 500, gems: 20 },
    check: (p) => Object.keys(p.pets).length >= 1,
  },
  {
    id: "first_upgrade",
    name: "Tinkerer",
    description: "Buy any upgrade in the shop.",
    rarity: "common",
    reward: { coins: 500, xp: 250, gems: 10 },
    check: (p) => p.upgrades.coin + p.upgrades.rarity >= 1,
  },
  {
    id: "level_3",
    name: "Sprout",
    description: "Reach level 3.",
    rarity: "common",
    reward: { coins: 100, xp: 0, gems: 10 },
    check: (p) => p.level >= 3,
  },
  {
    id: "level_10",
    name: "Getting Somewhere",
    description: "Reach level 10.",
    rarity: "common",
    reward: { coins: 500, xp: 0, gems: 20 },
    check: (p) => p.level >= 10,
  },
  {
    id: "first_egg_buy",
    name: "Incubator",
    description: "Purchase your first egg.",
    rarity: "common",
    reward: { coins: 1000, xp: 200, gems: 10 },
    check: (p) =>
      Object.values(p.eggs).some((v) => typeof v === "number" && v > 0) ||
      p.hatch !== null,
  },
  {
    id: "rolls_500",
    name: "Dedicated Roller",
    description: "Roll 500 times total.",
    rarity: "common",
    reward: { coins: 2000, xp: 800, gems: 30 },
    check: (p) => p.totalRolls >= 500,
  },
  {
    id: "coins_1k",
    name: "Pocket Change",
    description: "Have 1,000 coins at once.",
    rarity: "common",
    reward: { coins: 500, xp: 100, gems: 10 },
    check: (p) => p.coins >= 1000,
  },
  {
    id: "coins_10k",
    name: "Growing Wallet",
    description: "Have 10,000 coins at once.",
    rarity: "common",
    reward: { coins: 2000, xp: 500, gems: 20 },
    check: (p) => p.coins >= 10_000,
  },
  {
    id: "uncommon_50",
    name: "Off-Color Collector",
    description: "Roll 50 uncommons.",
    rarity: "common",
    reward: { coins: 800, xp: 400, gems: 20 },
    check: (p) => p.rollsByRarity.uncommon >= 50,
  },
  {
    id: "first_hatch",
    name: "Hatching Season",
    description: "Hatch your first egg.",
    rarity: "common",
    reward: { coins: 2500, xp: 1000, gems: 20 },
    check: (p) => Object.keys(p.pets).some((k) => {
      const def = p.pets[k];
      return def !== undefined;
    }) && Object.values(p.eggs).some((v) => v >= 0),
  },

  // ============================ UNCOMMON ============================
  {
    id: "first_rare",
    name: "Cyan Rarity",
    description: "Roll a RARE for the first time.",
    rarity: "uncommon",
    reward: { coins: 1500, xp: 600, gems: 20 },
    check: (p) => p.rollsByRarity.rare >= 1,
  },
  {
    id: "rare_5",
    name: "Finding the Tails",
    description: "Roll 5 rares.",
    rarity: "uncommon",
    reward: { coins: 3000, xp: 1200, gems: 30 },
    check: (p) => p.rollsByRarity.rare >= 5,
  },
  {
    id: "level_25",
    name: "Quarter Century",
    description: "Reach level 25.",
    rarity: "uncommon",
    reward: { coins: 5000, xp: 0, gems: 50 },
    check: (p) => p.level >= 25,
  },
  {
    id: "level_50",
    name: "Halfway Legend",
    description: "Reach level 50.",
    rarity: "uncommon",
    reward: { coins: 15000, xp: 0, gems: 100 },
    check: (p) => p.level >= 50,
  },
  {
    id: "pets_3",
    name: "Mini Zoo",
    description: "Own 3 different pets.",
    rarity: "uncommon",
    reward: { coins: 3000, xp: 1500, gems: 30 },
    check: (p) => Object.keys(p.pets).length >= 3,
  },
  {
    id: "upgrades_5",
    name: "Power User",
    description: "Buy 5 upgrades.",
    rarity: "uncommon",
    reward: { coins: 4000, xp: 2000, gems: 30 },
    check: (p) => p.upgrades.coin + p.upgrades.rarity >= 5,
  },
  {
    id: "rolls_1k",
    name: "Four Digits",
    description: "Roll 1,000 times total.",
    rarity: "uncommon",
    reward: { coins: 5000, xp: 2000, gems: 50 },
    check: (p) => p.totalRolls >= 1000,
  },
  {
    id: "rare_25",
    name: "Rare Collector",
    description: "Roll 25 rares.",
    rarity: "uncommon",
    reward: { coins: 8000, xp: 3000, gems: 50 },
    check: (p) => p.rollsByRarity.rare >= 25,
  },
  {
    id: "coins_100k",
    name: "Six Figures",
    description: "Have 100,000 coins at once.",
    rarity: "uncommon",
    reward: { coins: 10000, xp: 3000, gems: 60 },
    check: (p) => p.coins >= 100_000,
  },
  {
    id: "first_equipped_pet",
    name: "Companion",
    description: "Equip a pet.",
    rarity: "uncommon",
    reward: { coins: 2000, xp: 800, gems: 20 },
    check: (p) => p.equippedPets.some((e) => e !== null),
  },

  // ============================ RARE ============================
  {
    id: "first_epic",
    name: "Purple Haze",
    description: "Roll an EPIC for the first time.",
    rarity: "rare",
    reward: { coins: 8000, xp: 3000, gems: 50 },
    check: (p) => p.rollsByRarity.epic >= 1,
  },
  {
    id: "epic_5",
    name: "Epic Collector",
    description: "Roll 5 epics.",
    rarity: "rare",
    reward: { coins: 20000, xp: 8000, gems: 100 },
    check: (p) => p.rollsByRarity.epic >= 5,
  },
  {
    id: "level_75",
    name: "High Scorer",
    description: "Reach level 75.",
    rarity: "rare",
    reward: { coins: 30000, xp: 0, gems: 200 },
    check: (p) => p.level >= 75,
  },
  {
    id: "level_100",
    name: "Centurion",
    description: "Reach level 100.",
    rarity: "rare",
    reward: { coins: 100000, xp: 0, gems: 500 },
    check: (p) => p.level >= 100,
  },
  {
    id: "pets_6",
    name: "Safari",
    description: "Own 6 different pets.",
    rarity: "rare",
    reward: { coins: 15000, xp: 5000, gems: 100 },
    check: (p) => Object.keys(p.pets).length >= 6,
  },
  {
    id: "upgrades_10",
    name: "Maximized",
    description: "Buy 10 upgrades.",
    rarity: "rare",
    reward: { coins: 20000, xp: 8000, gems: 100 },
    check: (p) => p.upgrades.coin + p.upgrades.rarity >= 10,
  },
  {
    id: "rolls_5k",
    name: "Veteran Roller",
    description: "Roll 5,000 times total.",
    rarity: "rare",
    reward: { coins: 25000, xp: 10000, gems: 200 },
    check: (p) => p.totalRolls >= 5000,
  },
  {
    id: "coins_1m",
    name: "Millionaire",
    description: "Have 1,000,000 coins at once.",
    rarity: "rare",
    reward: { coins: 100000, xp: 20000, gems: 300 },
    check: (p) => p.coins >= 1_000_000,
  },
  {
    id: "rare_100",
    name: "Rare Fanatic",
    description: "Roll 100 rares.",
    rarity: "rare",
    reward: { coins: 30000, xp: 12000, gems: 150 },
    check: (p) => p.rollsByRarity.rare >= 100,
  },
  {
    id: "two_pet_slots",
    name: "Dynamic Duo",
    description: "Unlock and fill 2 pet slots simultaneously.",
    rarity: "rare",
    reward: { coins: 10000, xp: 5000, gems: 100 },
    check: (p) =>
      p.equippedPets.filter((e) => e !== null).length >= 2,
  },
  {
    id: "rebirth_1",
    name: "Born Again",
    description: "Perform your first rebirth.",
    rarity: "rare",
    reward: { coins: 0, xp: 10000, gems: 500 },
    check: (p) => (p.rebirths ?? 0) >= 1,
  },
  {
    id: "jungle_egg_hatch",
    name: "Jungle Fever",
    description: "Hatch at least one Jungle Egg.",
    rarity: "rare",
    reward: { coins: 20000, xp: 8000, gems: 100 },
    check: (p) =>
      ["monkey", "tree-frog", "gorilla", "toucan", "lion"].some(
        (id) => !!p.pets[id],
      ),
  },
  {
    id: "gems_100",
    name: "Gem Hoarder",
    description: "Have 100 gems at once.",
    rarity: "rare",
    reward: { coins: 5000, xp: 2000, gems: 0 },
    check: (p) => p.gems >= 100,
  },
  {
    id: "epic_20",
    name: "Epic Regular",
    description: "Roll 20 epics.",
    rarity: "rare",
    reward: { coins: 50000, xp: 20000, gems: 200 },
    check: (p) => p.rollsByRarity.epic >= 20,
  },

  // ============================ EPIC ============================
  {
    id: "first_legendary",
    name: "Golden Moment",
    description: "Roll a LEGENDARY for the first time.",
    rarity: "epic",
    reward: { coins: 25000, xp: 10000, gems: 200 },
    check: (p) => p.rollsByRarity.legendary >= 1,
  },
  {
    id: "legendary_5",
    name: "Legend Rising",
    description: "Roll 5 legendaries.",
    rarity: "epic",
    reward: { coins: 80000, xp: 30000, gems: 500 },
    check: (p) => p.rollsByRarity.legendary >= 5,
  },
  {
    id: "legendary_25",
    name: "Living Legend",
    description: "Roll 25 legendaries.",
    rarity: "epic",
    reward: { coins: 300000, xp: 100000, gems: 1500 },
    check: (p) => p.rollsByRarity.legendary >= 25,
  },
  {
    id: "rebirth_5",
    name: "Phoenix Soul",
    description: "Rebirth 5 times.",
    rarity: "epic",
    reward: { coins: 0, xp: 50000, gems: 2000 },
    check: (p) => (p.rebirths ?? 0) >= 5,
  },
  {
    id: "level_150",
    name: "Ascending",
    description: "Reach level 150.",
    rarity: "epic",
    reward: { coins: 500000, xp: 0, gems: 2000 },
    check: (p) => p.level >= 150,
  },
  {
    id: "pets_12",
    name: "Ark Builder",
    description: "Own 12 different pets.",
    rarity: "epic",
    reward: { coins: 100000, xp: 40000, gems: 500 },
    check: (p) => Object.keys(p.pets).length >= 12,
  },
  {
    id: "rolls_25k",
    name: "Obsessed Roller",
    description: "Roll 25,000 times total.",
    rarity: "epic",
    reward: { coins: 200000, xp: 80000, gems: 1000 },
    check: (p) => p.totalRolls >= 25000,
  },
  {
    id: "coins_100m",
    name: "Fortune Amassed",
    description: "Have 100,000,000 coins at once.",
    rarity: "epic",
    reward: { coins: 5000000, xp: 500000, gems: 3000 },
    check: (p) => p.coins >= 100_000_000,
  },
  {
    id: "desert_egg_hatch",
    name: "Desert Storm",
    description: "Hatch at least one Desert Egg.",
    rarity: "epic",
    reward: { coins: 50000, xp: 20000, gems: 300 },
    check: (p) =>
      ["horned-gecko", "rattlesnake", "scorpion", "camel", "fennec-fox"].some(
        (id) => !!p.pets[id],
      ),
  },
  {
    id: "ocean_egg_hatch",
    name: "Sea Legs",
    description: "Hatch at least one Ocean Egg.",
    rarity: "epic",
    reward: { coins: 50000, xp: 20000, gems: 300 },
    check: (p) =>
      ["fish", "sea-horse", "starfish", "shark", "blue-whale"].some(
        (id) => !!p.pets[id],
      ),
  },
  {
    id: "gems_1000",
    name: "Gem Baron",
    description: "Have 1,000 gems at once.",
    rarity: "epic",
    reward: { coins: 50000, xp: 10000, gems: 0 },
    check: (p) => p.gems >= 1000,
  },
  {
    id: "first_boss_kill",
    name: "Boss Slayer",
    description: "Defeat your first boss.",
    rarity: "epic",
    reward: { coins: 500000, xp: 200000, gems: 2000 },
    check: (p) => p.bossKills >= 1,
  },
  {
    id: "boss_fight_3",
    name: "Monster Hunter",
    description: "Defeat 3 different bosses.",
    rarity: "epic",
    reward: { coins: 2000000, xp: 500000, gems: 5000 },
    check: (p) => p.defeatedBosses.length >= 3,
  },
  {
    id: "arctic_egg_hatch",
    name: "Deep Freeze",
    description: "Hatch at least one Arctic Egg.",
    rarity: "epic",
    reward: { coins: 100000, xp: 40000, gems: 500 },
    check: (p) =>
      ["arctic-fox", "polar-bear", "snow-leopard", "ice-dragon", "frost-titan"].some(
        (id) => !!p.pets[id],
      ),
  },
  {
    id: "corrupted_first",
    name: "Corrupted Survivor",
    description: "Survive a corrupted number roll by defeating it.",
    rarity: "epic",
    reward: { coins: 200000, xp: 50000, gems: 1000 },
    check: (p) => (p.achievements["corrupted_first"] ?? 0) > 0,
  },

  // ============================ LEGENDARY ============================
  {
    id: "first_mythic",
    name: "The Impossible Roll",
    description: "Roll a MYTHIC for the first time.",
    rarity: "legendary",
    reward: { coins: 100000, xp: 50000, gems: 1000 },
    check: (p) => p.rollsByRarity.mythic >= 1,
  },
  {
    id: "mythic_5",
    name: "Mythical Being",
    description: "Roll 5 mythics.",
    rarity: "legendary",
    reward: { coins: 500000, xp: 200000, gems: 5000 },
    check: (p) => p.rollsByRarity.mythic >= 5,
  },
  {
    id: "mythic_25",
    name: "Mythic God",
    description: "Roll 25 mythics.",
    rarity: "legendary",
    reward: { coins: 2000000, xp: 800000, gems: 20000 },
    check: (p) => p.rollsByRarity.mythic >= 25,
  },
  {
    id: "rebirth_10",
    name: "Eternal Soul",
    description: "Rebirth 10 times.",
    rarity: "legendary",
    reward: { coins: 0, xp: 200000, gems: 10000 },
    check: (p) => (p.rebirths ?? 0) >= 10,
  },
  {
    id: "level_300",
    name: "Transcendent",
    description: "Reach level 300.",
    rarity: "legendary",
    reward: { coins: 10000000, xp: 0, gems: 10000 },
    check: (p) => p.level >= 300,
  },
  {
    id: "pets_20",
    name: "Master Tamer",
    description: "Own 20 different pets.",
    rarity: "legendary",
    reward: { coins: 500000, xp: 200000, gems: 3000 },
    check: (p) => Object.keys(p.pets).length >= 20,
  },
  {
    id: "rolls_100k",
    name: "Eternal Roller",
    description: "Roll 100,000 times total.",
    rarity: "legendary",
    reward: { coins: 1000000, xp: 500000, gems: 5000 },
    check: (p) => p.totalRolls >= 100000,
  },
  {
    id: "coins_10b",
    name: "Billionaire",
    description: "Have 10,000,000,000 coins at once.",
    rarity: "legendary",
    reward: { coins: 100000000, xp: 10000000, gems: 50000 },
    check: (p) => p.coins >= 10_000_000_000,
  },
  {
    id: "rebirth_20",
    name: "Cosmic Ascendant",
    description: "Rebirth 20 times.",
    rarity: "legendary",
    reward: { coins: 0, xp: 1000000, gems: 50000 },
    check: (p) => (p.rebirths ?? 0) >= 20,
  },
  {
    id: "boss_fight_7",
    name: "Titan Destroyer",
    description: "Defeat 7 different bosses.",
    rarity: "legendary",
    reward: { coins: 100000000, xp: 50000000, gems: 100000 },
    check: (p) => p.defeatedBosses.length >= 7,
  },
  {
    id: "mythical_egg_hatch",
    name: "Born of Myth",
    description: "Hatch at least one Mythical Egg.",
    rarity: "legendary",
    reward: { coins: 500000, xp: 200000, gems: 5000 },
    check: (p) =>
      ["rune-stone", "astral-wolf", "reality-fox", "infinity-drake", "primordial-god"].some(
        (id) => !!p.pets[id],
      ),
  },
  {
    id: "boss_kills_5",
    name: "Boss Annihilator",
    description: "Kill any bosses 5 times total.",
    rarity: "legendary",
    reward: { coins: 50000000, xp: 20000000, gems: 50000 },
    check: (p) => p.bossKills >= 5,
  },
  {
    id: "gems_50000",
    name: "Gem God",
    description: "Have 50,000 gems at once.",
    rarity: "legendary",
    reward: { coins: 1000000, xp: 500000, gems: 0 },
    check: (p) => p.gems >= 50_000,
  },

  // ============================ MYTHIC ============================
  {
    id: "mythic_100",
    name: "Beyond the Curve",
    description: "Roll 100 mythics.",
    rarity: "mythic",
    reward: {
      coins: 10000000,
      xp: 5000000,
      gems: 100000,
      petId: "cybernetic-dragon",
    },
    check: (p) => p.rollsByRarity.mythic >= 100,
  },
  {
    id: "cosmic_ascent",
    name: "Cosmic Ascent",
    description: "Reach level 500 and rebirth 25 times.",
    rarity: "mythic",
    reward: {
      coins: 50000000,
      xp: 25000000,
      gems: 500000,
      petId: "cosmic-serpent",
    },
    check: (p) => p.level >= 500 && (p.rebirths ?? 0) >= 25,
  },
  {
    id: "all_bosses",
    name: "Conqueror of All",
    description: "Defeat all 10 bosses.",
    rarity: "mythic",
    reward: {
      coins: 1000000000,
      xp: 500000000,
      gems: 1000000,
    },
    check: (p) => p.defeatedBosses.length >= 10,
  },
  {
    id: "rolls_1m",
    name: "The Endless Roll",
    description: "Roll 1,000,000 times.",
    rarity: "mythic",
    reward: {
      coins: 100000000,
      xp: 50000000,
      gems: 500000,
    },
    check: (p) => p.totalRolls >= 1_000_000,
  },
  {
    id: "rebirth_30",
    name: "Absolute Transcendence",
    description: "Reach the maximum rebirth level (30).",
    rarity: "mythic",
    reward: {
      coins: 0,
      xp: 100000000,
      gems: 2000000,
    },
    check: (p) => (p.rebirths ?? 0) >= 30,
  },
  {
    id: "pets_all_eggs",
    name: "Eggsplosion",
    description: "Hatch every type of egg at least once.",
    rarity: "mythic",
    reward: {
      coins: 100000000,
      xp: 50000000,
      gems: 250000,
    },
    check: (p) => {
      const allEggPets = [
        "monkey", "tree-frog", "gorilla", "toucan", "lion",
        "horned-gecko", "rattlesnake", "scorpion", "camel", "fennec-fox",
        "fish", "sea-horse", "starfish", "shark", "blue-whale",
        "arctic-fox", "polar-bear", "snow-leopard", "ice-dragon", "frost-titan",
        "rune-stone", "astral-wolf", "reality-fox", "infinity-drake", "primordial-god",
      ];
      return allEggPets.filter((id) => !!p.pets[id]).length >= 20;
    },
  },

  // ============================================================
  // UNOBTAINABLE PET ACHIEVEMENTS
  // These award unobtainable special pets.
  // ============================================================

  // Developer Monkey: own Monkey + roll 5000 times
  {
    id: "dev_monkey_unlock",
    name: "I Am The Algorithm",
    description: "Own the Monkey pet and roll 5,000 times total.",
    rarity: "epic",
    reward: {
      coins: 100000,
      xp: 50000,
      gems: 5000,
      petId: "developer-monkey",
    },
    check: (p) => !!p.pets["monkey"] && p.totalRolls >= 5000,
  },

  // Scaly Demon: own Horned Gecko + roll 10 epics
  {
    id: "scaly_demon_unlock",
    name: "Evolution of Scales",
    description: "Own the Horned Gecko and roll 10 epics.",
    rarity: "epic",
    reward: {
      coins: 500000,
      xp: 200000,
      gems: 10000,
      petId: "scaly-demon",
    },
    check: (p) => !!p.pets["horned-gecko"] && p.rollsByRarity.epic >= 10,
  },

  // Megalodon: own Shark + own Fish + roll 50 legendaries
  {
    id: "megalodon_unlock",
    name: "Apex Predator",
    description: "Own Shark and Fish, and roll 50 legendaries.",
    rarity: "legendary",
    reward: {
      coins: 5000000,
      xp: 2000000,
      gems: 50000,
      petId: "megalodon",
    },
    check: (p) =>
      !!p.pets["shark"] &&
      !!p.pets["fish"] &&
      p.rollsByRarity.legendary >= 50,
  },

  // Arctic Guardian: own Arctic Fox + defeat boss 1 (Slime King)
  {
    id: "arctic_guardian_unlock",
    name: "Guardian of the Tundra",
    description: "Own the Arctic Fox and defeat the Slime King boss.",
    rarity: "legendary",
    reward: {
      coins: 5000000,
      xp: 2000000,
      gems: 50000,
      petId: "arctic-guardian",
    },
    check: (p) =>
      !!p.pets["arctic-fox"] &&
      p.defeatedBosses.includes("slime-king"),
  },

  // Primordial Chaos: own Rune Stone + defeat boss 5 (Thunder Colossus)
  {
    id: "primordial_chaos_unlock",
    name: "Before the Beginning",
    description: "Own the Rune Stone and defeat the Thunder Colossus.",
    rarity: "mythic",
    reward: {
      coins: 100000000,
      xp: 50000000,
      gems: 500000,
      petId: "primordial-chaos",
    },
    check: (p) =>
      !!p.pets["rune-stone"] &&
      p.defeatedBosses.includes("thunder-colossus"),
  },

  // ============================ DINOSAUR ACHIEVEMENTS ============================
  {
    id: "first_dino",
    name: "Welcome to the Jurassic",
    description: "Buy your first dinosaur pet.",
    rarity: "common",
    reward: { coins: 2000, xp: 1000, gems: 20 },
    check: (p) =>
      ["raptor","parasaur","stegosaurus","ankylosaur","triceratops","pterodactyl",
       "brachiosaurus","spinosaurus","allosaurus","carnotaurus","t-rex",
       "carcharodont","therizinosaurus","giganotosaurus","dracorex"].some((id) => !!p.pets[id]),
  },
  {
    id: "dino_5",
    name: "Dino Herd",
    description: "Own 5 different dinosaur pets.",
    rarity: "uncommon",
    reward: { coins: 25000, xp: 10000, gems: 150 },
    check: (p) =>
      ["raptor","parasaur","stegosaurus","ankylosaur","triceratops","pterodactyl",
       "brachiosaurus","spinosaurus","allosaurus","carnotaurus","t-rex",
       "carcharodont","therizinosaurus","giganotosaurus","dracorex"].filter((id) => !!p.pets[id]).length >= 5,
  },
  {
    id: "dino_10",
    name: "Dinosaur Park",
    description: "Own 10 different dinosaur pets.",
    rarity: "rare",
    reward: { coins: 200000, xp: 80000, gems: 1000 },
    check: (p) =>
      ["raptor","parasaur","stegosaurus","ankylosaur","triceratops","pterodactyl",
       "brachiosaurus","spinosaurus","allosaurus","carnotaurus","t-rex",
       "carcharodont","therizinosaurus","giganotosaurus","dracorex"].filter((id) => !!p.pets[id]).length >= 10,
  },
  {
    id: "dino_all",
    name: "Dino Overlord",
    description: "Own all 15 dinosaur pets.",
    rarity: "legendary",
    reward: { coins: 10000000, xp: 5000000, gems: 50000 },
    check: (p) =>
      ["raptor","parasaur","stegosaurus","ankylosaur","triceratops","pterodactyl",
       "brachiosaurus","spinosaurus","allosaurus","carnotaurus","t-rex",
       "carcharodont","therizinosaurus","giganotosaurus","dracorex"].every((id) => !!p.pets[id]),
  },
  {
    id: "trex_lvl50",
    name: "King's Strength",
    description: "Evolve a T-Rex to level 50.",
    rarity: "epic",
    reward: { coins: 1000000, xp: 500000, gems: 5000 },
    check: (p) => (p.pets["t-rex"]?.level ?? 0) >= 50,
  },
  {
    id: "dracorex_lvl50",
    name: "Dragon Crowned",
    description: "Evolve a Dracorex to level 50.",
    rarity: "mythic",
    reward: { coins: 10000000, xp: 5000000, gems: 50000 },
    check: (p) => (p.pets["dracorex"]?.level ?? 0) >= 50,
  },

  // ============================ BOSS DROP PET ACHIEVEMENTS ============================
  {
    id: "boss_drop_first",
    name: "Trophy Hunter",
    description: "Collect your first boss drop pet.",
    rarity: "epic",
    reward: { coins: 1000000, xp: 500000, gems: 5000 },
    check: (p) =>
      ["slime-spawn","golem-shard","ember-whelp","leviathan-cub","storm-sprite",
       "shadow-wisp","void-fragment","cosmic-eye","titan-shard","reality-chip"].some((id) => !!p.pets[id]),
  },
  {
    id: "boss_drop_5",
    name: "Collector of the Fallen",
    description: "Collect 5 different boss drop pets.",
    rarity: "legendary",
    reward: { coins: 100000000, xp: 50000000, gems: 200000 },
    check: (p) =>
      ["slime-spawn","golem-shard","ember-whelp","leviathan-cub","storm-sprite",
       "shadow-wisp","void-fragment","cosmic-eye","titan-shard","reality-chip"].filter((id) => !!p.pets[id]).length >= 5,
  },
  {
    id: "boss_drop_all",
    name: "Spoils of War",
    description: "Collect all 10 boss drop pets.",
    rarity: "mythic",
    reward: { coins: 1000000000, xp: 500000000, gems: 2000000 },
    check: (p) =>
      ["slime-spawn","golem-shard","ember-whelp","leviathan-cub","storm-sprite",
       "shadow-wisp","void-fragment","cosmic-eye","titan-shard","reality-chip"].every((id) => !!p.pets[id]),
  },
  {
    id: "reality_chip_drop",
    name: "Shattered Reality",
    description: "Obtain the Reality Chip from the Reality Shredder.",
    rarity: "mythic",
    reward: { coins: 500000000, xp: 250000000, gems: 1000000 },
    check: (p) => !!p.pets["reality-chip"],
  },

  // ============================ MORE END-GAME ACHIEVEMENTS ============================
  {
    id: "level_200",
    name: "Double Century",
    description: "Reach level 200.",
    rarity: "epic",
    reward: { coins: 5000000, xp: 0, gems: 10000 },
    check: (p) => p.level >= 200,
  },
  {
    id: "level_500",
    name: "Half a Thousand",
    description: "Reach level 500.",
    rarity: "legendary",
    reward: { coins: 100000000, xp: 0, gems: 100000 },
    check: (p) => p.level >= 500,
  },
  {
    id: "level_1000",
    name: "Four Digit Legend",
    description: "Reach level 1,000.",
    rarity: "mythic",
    reward: { coins: 5000000000, xp: 0, gems: 1000000 },
    check: (p) => p.level >= 1000,
  },
  {
    id: "rolls_50k",
    name: "Roll Addict",
    description: "Roll 50,000 times total.",
    rarity: "legendary",
    reward: { coins: 500000, xp: 250000, gems: 3000 },
    check: (p) => p.totalRolls >= 50_000,
  },
  {
    id: "rolls_250k",
    name: "Infinite Spinner",
    description: "Roll 250,000 times total.",
    rarity: "mythic",
    reward: { coins: 50000000, xp: 25000000, gems: 250000 },
    check: (p) => p.totalRolls >= 250_000,
  },
  {
    id: "coins_1b",
    name: "Billion Club",
    description: "Have 1,000,000,000 coins at once.",
    rarity: "legendary",
    reward: { coins: 100000000, xp: 20000000, gems: 100000 },
    check: (p) => p.coins >= 1_000_000_000,
  },
  {
    id: "coins_1t",
    name: "Trillionaire",
    description: "Have 1,000,000,000,000 coins at once.",
    rarity: "mythic",
    reward: { coins: 1000000000, xp: 100000000, gems: 5000000 },
    check: (p) => p.coins >= 1_000_000_000_000,
  },
  {
    id: "gems_10000",
    name: "Gem Vault",
    description: "Have 10,000 gems at once.",
    rarity: "epic",
    reward: { coins: 500000, xp: 100000, gems: 0 },
    check: (p) => p.gems >= 10_000,
  },
  {
    id: "gems_1m",
    name: "Gem Emperor",
    description: "Have 1,000,000 gems at once.",
    rarity: "mythic",
    reward: { coins: 100000000, xp: 50000000, gems: 0 },
    check: (p) => p.gems >= 1_000_000,
  },
  {
    id: "rebirth_15",
    name: "Fifteen Lives",
    description: "Rebirth 15 times.",
    rarity: "legendary",
    reward: { coins: 0, xp: 500000, gems: 25000 },
    check: (p) => (p.rebirths ?? 0) >= 15,
  },
  {
    id: "rebirth_25",
    name: "Silver Reincarnation",
    description: "Rebirth 25 times.",
    rarity: "mythic",
    reward: { coins: 0, xp: 5000000, gems: 1000000 },
    check: (p) => (p.rebirths ?? 0) >= 25,
  },
  {
    id: "pets_30",
    name: "Living Museum",
    description: "Own 30 different pets.",
    rarity: "legendary",
    reward: { coins: 5000000, xp: 2000000, gems: 25000 },
    check: (p) => Object.keys(p.pets).length >= 30,
  },
  {
    id: "pets_50",
    name: "Menagerie God",
    description: "Own 50 different pets.",
    rarity: "mythic",
    reward: { coins: 100000000, xp: 50000000, gems: 500000 },
    check: (p) => Object.keys(p.pets).length >= 50,
  },
  {
    id: "boss_kills_10",
    name: "Relentless Slayer",
    description: "Kill bosses 10 times total.",
    rarity: "legendary",
    reward: { coins: 500000000, xp: 200000000, gems: 500000 },
    check: (p) => p.bossKills >= 10,
  },
  {
    id: "boss_kills_25",
    name: "Boss Exterminator",
    description: "Kill bosses 25 times total.",
    rarity: "mythic",
    reward: { coins: 5000000000, xp: 2000000000, gems: 5000000 },
    check: (p) => p.bossKills >= 25,
  },
  {
    id: "all_bosses_twice",
    name: "Double Domination",
    description: "Defeat all 10 bosses at least twice (20+ total kills).",
    rarity: "mythic",
    reward: { coins: 2000000000, xp: 1000000000, gems: 3000000 },
    check: (p) => p.bossKills >= 20 && p.defeatedBosses.length >= 10,
  },
  {
    id: "legendary_100",
    name: "Golden Century",
    description: "Roll 100 legendaries.",
    rarity: "legendary",
    reward: { coins: 5000000, xp: 2000000, gems: 50000 },
    check: (p) => p.rollsByRarity.legendary >= 100,
  },
  {
    id: "legendary_500",
    name: "Legendary Obsession",
    description: "Roll 500 legendaries.",
    rarity: "mythic",
    reward: { coins: 100000000, xp: 50000000, gems: 1000000 },
    check: (p) => p.rollsByRarity.legendary >= 500,
  },
  {
    id: "mythic_50",
    name: "Mythic Devotee",
    description: "Roll 50 mythics.",
    rarity: "mythic",
    reward: { coins: 5000000, xp: 2000000, gems: 100000 },
    check: (p) => p.rollsByRarity.mythic >= 50,
  },
  {
    id: "unobtainable_first",
    name: "Beyond Probability",
    description: "Roll an UNOBTAINABLE for the first time.",
    rarity: "mythic",
    reward: { coins: 50000000, xp: 25000000, gems: 500000 },
    check: (p) => p.rollsByRarity.unobtainable >= 1,
  },
  {
    id: "corrupted_5",
    name: "Corruption Slayer",
    description: "Defeat 5 corrupted numbers.",
    rarity: "legendary",
    reward: { coins: 5000000, xp: 2000000, gems: 50000 },
    check: (p) => (p.achievements["corrupted_first"] ?? 0) >= 5,
  },
  {
    id: "pet_level_100",
    name: "Perfected",
    description: "Evolve any pet to level 100.",
    rarity: "mythic",
    reward: { coins: 100000000, xp: 50000000, gems: 500000 },
    check: (p) => Object.values(p.pets).some((inst) => inst.level >= 100),
  },
  {
    id: "absolute_zero_buy",
    name: "Absolute Madness",
    description: "Purchase the Absolute Zero pet.",
    rarity: "mythic",
    reward: { coins: 0, xp: 1000000000, gems: 1000000 },
    check: (p) => !!p.pets["absolute-zero"],
  },
  {
    id: "three_pet_slots",
    name: "Triple Threat",
    description: "Unlock and fill 3 pet slots simultaneously.",
    rarity: "epic",
    reward: { coins: 50000, xp: 20000, gems: 500 },
    check: (p) => p.equippedPets.filter((e) => e !== null).length >= 3,
  },
  {
    id: "mythic_streak_5",
    name: "Mythic Run",
    description: "Roll 5 mythics in a row.",
    rarity: "legendary",
    reward: { coins: 10000000, xp: 5000000, gems: 100000 },
    check: (p) => (p.mythicStreak ?? 0) >= 5,
  },
  {
    id: "epic_100",
    name: "Epic Centurion",
    description: "Roll 100 epics.",
    rarity: "legendary",
    reward: { coins: 2000000, xp: 800000, gems: 20000 },
    check: (p) => p.rollsByRarity.epic >= 100,
  },
  {
    id: "coins_10m",
    name: "Fortune Elite",
    description: "Have 10,000,000 coins at once.",
    rarity: "epic",
    reward: { coins: 1000000, xp: 300000, gems: 5000 },
    check: (p) => p.coins >= 10_000_000,
  },
  {
    id: "all_boss_unique",
    name: "Boss Hunter's Seal",
    description: "Defeat every boss at least once.",
    rarity: "legendary",
    reward: { coins: 500000000, xp: 200000000, gems: 500000 },
    check: (p) => p.defeatedBosses.length >= 10,
  },
  {
    id: "dino_boss_synergy",
    name: "Prehistoric Power",
    description: "Own a T-Rex and defeat the Void Emperor.",
    rarity: "mythic",
    reward: { coins: 1000000000, xp: 500000000, gems: 2000000 },
    check: (p) =>
      !!p.pets["t-rex"] && p.defeatedBosses.includes("void-emperor"),
  },
];

// Ensure no duplicates
const seen = new Set<string>();
for (const a of A) {
  if (seen.has(a.id)) {
    console.warn(`Duplicate achievement id: ${a.id}`);
  }
  seen.add(a.id);
}

export const ACHIEVEMENTS: Achievement[] = A;

export const ACHIEVEMENT_BY_ID: Record<string, Achievement> = A.reduce(
  (acc, a) => {
    acc[a.id] = a;
    return acc;
  },
  {} as Record<string, Achievement>,
);

export function checkAndGrantAchievements(
  profile: Profile,
  ctx: AchCheckCtx,
  grant: (id: string, reward: Achievement["reward"]) => void,
) {
  for (const ach of ACHIEVEMENTS) {
    if (profile.achievements[ach.id]) continue;
    if (ach.check(profile, ctx)) {
      grant(ach.id, ach.reward);
    }
  }
}

export const RARITY_COLOR: Record<AchievementRarity, string> = {
  common: "text-zinc-300",
  uncommon: "text-emerald-300",
  rare: "text-sky-300",
  epic: "text-purple-400",
  legendary: "text-amber-300",
  mythic: "text-pink-400",
  unobtainable: "text-white",
};

export const RARITY_BORDER: Record<AchievementRarity, string> = {
  common: "border-zinc-700/50",
  uncommon: "border-emerald-600/40",
  rare: "border-sky-500/40",
  epic: "border-purple-600/40",
  legendary: "border-amber-500/40",
  mythic: "border-pink-500/40",
  unobtainable: "border-white/30",
};

export function sortedAchievements(p: Profile) {
  return [...ACHIEVEMENTS].sort((a, b) => {
    const aHas = !!p.achievements[a.id];
    const bHas = !!p.achievements[b.id];
    if (aHas !== bHas) return aHas ? -1 : 1;
    const ra = RARITY_RANK[a.rarity];
    const rb = RARITY_RANK[b.rarity];
    return ra - rb;
  });
}
