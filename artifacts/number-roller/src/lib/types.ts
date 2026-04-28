export type RarityKey =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic"
  | "unobtainable";

export type PetInstance = {
  ownedAt: number;
  level: number;
};

export type EggInstance = number; // count owned

export type ActiveHatch = {
  eggId: string;
  startedAt: number;
  durationMs: number;
};

export type QuestProgressMap = Record<string, number>;
export type QuestClaimMap = Record<string, number>;

export type QuestsState = {
  dailyAssigned: string[];
  dailyProgress: QuestProgressMap;
  dailyClaimed: QuestClaimMap;
  dailyRefreshAt: number;
  weeklyAssigned: string[];
  weeklyProgress: QuestProgressMap;
  weeklyClaimed: QuestClaimMap;
  weeklyRefreshAt: number;
  /** Counters for special quests (monkey-max-level, scaly legendary rolls, shark mythic rolls). */
  specialProgress: QuestProgressMap;
};

export type WeatherState = {
  activeId: string | null;
  activeUntil: number;
  nextAutoAt: number;
  manualCooldownUntil: number;
};

export type Profile = {
  username: string;
  passwordHash: string;

  coins: number;
  gems: number;
  xp: number;
  level: number;

  rebirths: number;

  totalRolls: number;
  rollsByRarity: Record<RarityKey, number>;

  bestNumber: number | null;
  bestProb: number | null;
  worstNumber: number | null;
  worstProb: number | null;
  rarestNumber: number | null;
  rarestProb: number | null;

  upgrades: { coin: number; rarity: number };
  pets: Record<string, PetInstance>;
  /**
   * Up to 3 pet slots. Index 0 is always available; slots 1 and 2 are
   * unlocked by purchasing extra slots with gems (see `extraSlots`).
   */
  equippedPets: (string | null)[];
  /** Number of extra slots purchased (0-2). Total slots = 1 + extraSlots. */
  extraSlots: number;
  achievements: Record<string, number>;

  // Tracks consecutive mythic rolls for the special achievement.
  mythicStreak: number;

  boosters: {
    coinUntil: number;
    rarityUntil: number;
    xpUntil: number;
  };

  // Eggs in inventory (id -> count owned, unhatched).
  eggs: Record<string, number>;
  // Currently hatching slot (one at a time).
  hatch: ActiveHatch | null;

  // Per-pet next ability trigger timestamps.
  petAbilityNext: Record<string, number>;

  quests: QuestsState;
  weather: WeatherState;

  createdAt: number;
  schemaVersion: 4;
};

export type LeaderEntry = {
  username: string;
  number: number;
  prob: number;
  rarity: RarityKey;
  level: number;
  timestamp: number;
};

export type RollResult = {
  number: number;
  prob: number;
  rarity: RarityKey;
  baseCoins: number;
  coinMult: number;
  coinsEarned: number;
  baseXp: number;
  xpMult: number;
  xpEarned: number;
  petDropped: string | null;
};
