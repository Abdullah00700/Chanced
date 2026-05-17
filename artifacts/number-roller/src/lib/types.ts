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
  specialProgress: QuestProgressMap;
};

export type WeatherState = {
  activeId: string | null;
  activeUntil: number;
  nextAutoAt: number;
  manualCooldownUntil: number;
};

export type ActiveBossFight = {
  bossId: string;
  playerHp: number;
  playerMaxHp: number;
  bossHp: number;
  bossMaxHp: number;
  startedAt: number;
  lastMoveId: string | null;
  lastMoveName: string | null;
  lastMoveDamage: number;
  lastMoveAt: number;
  totalDamageDealt: number;
  rollsDone: number;
};

export type CorruptedRoll = {
  number: number;
  distance: number;
  drainPerTick: number;
  lastDrainAt: number;
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
  equippedPets: (string | null)[];
  extraSlots: number;
  achievements: Record<string, number>;

  mythicStreak: number;

  boosters: {
    coinUntil: number;
    rarityUntil: number;
    xpUntil: number;
  };

  eggs: Record<string, number>;
  hatch: ActiveHatch | null;

  petAbilityNext: Record<string, number>;

  quests: QuestsState;
  weather: WeatherState;

  defeatedBosses: string[];
  activeBoss: ActiveBossFight | null;
  bossKills: number;
  corruptedDefeats: number;

  corruptedRoll: CorruptedRoll | null;

  lastGachaSpin: number;

  createdAt: number;
  schemaVersion: 5;
};

export type LeaderEntry = {
  username: string;
  number: number;
  prob: number;
  rarity: RarityKey;
  level: number;
  timestamp: number;
};

export type BossLeaderEntry = {
  username: string;
  bossKills: number;
  defeatedBosses: string[];
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
  gemsEarned: number;
  petDropped: string | null;
};
