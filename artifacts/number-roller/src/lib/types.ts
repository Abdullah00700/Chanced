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

export type Profile = {
  username: string;
  passwordHash: string;

  coins: number;
  gems: number;
  xp: number;
  level: number;

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
  };

  createdAt: number;
  schemaVersion: 3;
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
