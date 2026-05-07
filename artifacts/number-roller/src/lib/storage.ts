import type {
  ActiveBossFight,
  ActiveHatch,
  BossLeaderEntry,
  CorruptedRoll,
  LeaderEntry,
  PetInstance,
  Profile,
  QuestsState,
  RarityKey,
  WeatherState,
} from "./types";

export const LS_ACCOUNTS = "rr2.accounts";
export const LS_ACTIVE = "rr2.active";
export const LS_LEADERBOARD = "rr2.leaderboard";
export const LS_MUTED = "rr2.muted";

export type AccountsMap = Record<string, Profile>;

const RARITIES: RarityKey[] = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "mythic",
  "unobtainable",
];

function clampSlot(raw: any): number {
  const n = typeof raw === "number" ? Math.floor(raw) : 0;
  return Math.max(0, Math.min(2, n));
}

function migrateEquippedPets(raw: any): (string | null)[] {
  const slots = clampSlot(raw?.extraSlots) + 1;
  if (Array.isArray(raw?.equippedPets)) {
    const arr = raw.equippedPets.map((v: unknown) =>
      typeof v === "string" ? v : null,
    );
    while (arr.length < slots) arr.push(null);
    return arr.slice(0, slots);
  }
  const out: (string | null)[] = [
    typeof raw?.equippedPet === "string" ? raw.equippedPet : null,
  ];
  while (out.length < slots) out.push(null);
  return out;
}

function migrateQuests(raw: any): QuestsState {
  const q = raw?.quests ?? {};
  return {
    dailyAssigned: Array.isArray(q.dailyAssigned) ? q.dailyAssigned : [],
    dailyProgress: q.dailyProgress && typeof q.dailyProgress === "object"
      ? q.dailyProgress
      : {},
    dailyClaimed: q.dailyClaimed && typeof q.dailyClaimed === "object"
      ? q.dailyClaimed
      : {},
    dailyRefreshAt: typeof q.dailyRefreshAt === "number" ? q.dailyRefreshAt : 0,
    weeklyAssigned: Array.isArray(q.weeklyAssigned) ? q.weeklyAssigned : [],
    weeklyProgress: q.weeklyProgress && typeof q.weeklyProgress === "object"
      ? q.weeklyProgress
      : {},
    weeklyClaimed: q.weeklyClaimed && typeof q.weeklyClaimed === "object"
      ? q.weeklyClaimed
      : {},
    weeklyRefreshAt:
      typeof q.weeklyRefreshAt === "number" ? q.weeklyRefreshAt : 0,
    specialProgress:
      q.specialProgress && typeof q.specialProgress === "object"
        ? q.specialProgress
        : {},
  };
}

function migrateWeather(raw: any): WeatherState {
  const w = raw?.weather ?? {};
  return {
    activeId: typeof w.activeId === "string" ? w.activeId : null,
    activeUntil: typeof w.activeUntil === "number" ? w.activeUntil : 0,
    nextAutoAt: typeof w.nextAutoAt === "number" ? w.nextAutoAt : 0,
    manualCooldownUntil:
      typeof w.manualCooldownUntil === "number" ? w.manualCooldownUntil : 0,
  };
}

function migrateHatch(raw: any): ActiveHatch | null {
  const h = raw?.hatch;
  if (!h || typeof h !== "object") return null;
  if (typeof h.eggId !== "string") return null;
  return {
    eggId: h.eggId,
    startedAt: typeof h.startedAt === "number" ? h.startedAt : Date.now(),
    durationMs:
      typeof h.durationMs === "number" ? h.durationMs : 30_000,
  };
}

function migrateActiveBoss(raw: any): ActiveBossFight | null {
  const b = raw?.activeBoss;
  if (!b || typeof b !== "object") return null;
  if (typeof b.bossId !== "string") return null;
  return {
    bossId: b.bossId,
    playerHp: typeof b.playerHp === "number" ? b.playerHp : 1000,
    playerMaxHp: typeof b.playerMaxHp === "number" ? b.playerMaxHp : 1000,
    bossHp: typeof b.bossHp === "number" ? b.bossHp : 0,
    bossMaxHp: typeof b.bossMaxHp === "number" ? b.bossMaxHp : 0,
    startedAt: typeof b.startedAt === "number" ? b.startedAt : Date.now(),
    lastMoveId: typeof b.lastMoveId === "string" ? b.lastMoveId : null,
    lastMoveName: typeof b.lastMoveName === "string" ? b.lastMoveName : null,
    lastMoveDamage: typeof b.lastMoveDamage === "number" ? b.lastMoveDamage : 0,
    lastMoveAt: typeof b.lastMoveAt === "number" ? b.lastMoveAt : 0,
    totalDamageDealt: typeof b.totalDamageDealt === "number" ? b.totalDamageDealt : 0,
    rollsDone: typeof b.rollsDone === "number" ? b.rollsDone : 0,
  };
}

function migrateCorruptedRoll(raw: any): CorruptedRoll | null {
  const c = raw?.corruptedRoll;
  if (!c || typeof c !== "object") return null;
  if (typeof c.number !== "number") return null;
  return {
    number: c.number,
    distance: typeof c.distance === "number" ? c.distance : 0,
    drainPerTick: typeof c.drainPerTick === "number" ? c.drainPerTick : 0,
    lastDrainAt: typeof c.lastDrainAt === "number" ? c.lastDrainAt : Date.now(),
  };
}

function migrateProfile(raw: any): Profile {
  const rollsByRarity = { ...(raw.rollsByRarity ?? {}) } as Record<
    RarityKey,
    number
  >;
  for (const r of RARITIES) {
    if (typeof rollsByRarity[r] !== "number") rollsByRarity[r] = 0;
  }
  const pets: Record<string, PetInstance> = {};
  for (const id of Object.keys(raw.pets ?? {})) {
    const inst = raw.pets[id] ?? {};
    pets[id] = {
      ownedAt: typeof inst.ownedAt === "number" ? inst.ownedAt : Date.now(),
      level: typeof inst.level === "number" && inst.level > 0 ? inst.level : 1,
    };
  }
  const eggs: Record<string, number> = {};
  if (raw.eggs && typeof raw.eggs === "object") {
    for (const k of Object.keys(raw.eggs)) {
      const v = raw.eggs[k];
      if (typeof v === "number" && v > 0) eggs[k] = Math.floor(v);
    }
  }
  const defeatedBosses: string[] = Array.isArray(raw.defeatedBosses)
    ? raw.defeatedBosses.filter((x: any) => typeof x === "string")
    : [];

  return {
    username: raw.username,
    passwordHash: raw.passwordHash,
    coins: raw.coins ?? 0,
    gems: raw.gems ?? 0,
    xp: raw.xp ?? 0,
    level: raw.level ?? 1,
    rebirths: typeof raw.rebirths === "number" ? raw.rebirths : 0,
    totalRolls: raw.totalRolls ?? 0,
    rollsByRarity,
    bestNumber: raw.bestNumber ?? null,
    bestProb: raw.bestProb ?? null,
    worstNumber: raw.worstNumber ?? null,
    worstProb: raw.worstProb ?? null,
    rarestNumber: raw.rarestNumber ?? null,
    rarestProb: raw.rarestProb ?? null,
    upgrades: { coin: raw.upgrades?.coin ?? 0, rarity: raw.upgrades?.rarity ?? 0 },
    pets,
    equippedPets: migrateEquippedPets(raw),
    extraSlots: clampSlot(raw.extraSlots),
    achievements: raw.achievements ?? {},
    mythicStreak: raw.mythicStreak ?? 0,
    boosters: {
      coinUntil: raw.boosters?.coinUntil ?? 0,
      rarityUntil: raw.boosters?.rarityUntil ?? 0,
      xpUntil: raw.boosters?.xpUntil ?? 0,
    },
    eggs,
    hatch: migrateHatch(raw),
    petAbilityNext:
      raw.petAbilityNext && typeof raw.petAbilityNext === "object"
        ? raw.petAbilityNext
        : {},
    quests: migrateQuests(raw),
    weather: migrateWeather(raw),
    defeatedBosses,
    activeBoss: migrateActiveBoss(raw),
    bossKills: typeof raw.bossKills === "number" ? raw.bossKills : 0,
    corruptedDefeats: typeof raw.corruptedDefeats === "number" ? raw.corruptedDefeats : 0,
    corruptedRoll: migrateCorruptedRoll(raw),
    createdAt: raw.createdAt ?? Date.now(),
    schemaVersion: 5,
  };
}

export function loadAccounts(): AccountsMap {
  try {
    const raw = localStorage.getItem(LS_ACCOUNTS);
    if (!raw) return {};
    const v = JSON.parse(raw);
    if (typeof v !== "object" || !v) return {};
    const out: AccountsMap = {};
    for (const k of Object.keys(v)) {
      try {
        out[k] = migrateProfile(v[k]);
      } catch {
        // skip corrupt entry
      }
    }
    return out;
  } catch {
    return {};
  }
}

export function saveAccounts(map: AccountsMap) {
  localStorage.setItem(LS_ACCOUNTS, JSON.stringify(map));
}

export function loadLeaderboard(): LeaderEntry[] {
  try {
    const raw = localStorage.getItem(LS_LEADERBOARD);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? (arr as LeaderEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveLeaderboard(entries: LeaderEntry[]) {
  localStorage.setItem(LS_LEADERBOARD, JSON.stringify(entries));
}

export const LS_BOSS_LEADERBOARD = "rr2.boss_leaderboard";

export function loadBossLeaderboard(): BossLeaderEntry[] {
  try {
    const raw = localStorage.getItem(LS_BOSS_LEADERBOARD);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? (arr as BossLeaderEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveBossLeaderboard(entries: BossLeaderEntry[]) {
  localStorage.setItem(LS_BOSS_LEADERBOARD, JSON.stringify(entries));
}

export function upsertBossLeader(
  entries: BossLeaderEntry[],
  candidate: BossLeaderEntry,
): BossLeaderEntry[] {
  const idx = entries.findIndex(
    (e) => e.username.toLowerCase() === candidate.username.toLowerCase(),
  );
  let next = [...entries];
  if (idx >= 0) {
    next[idx] = {
      ...next[idx],
      bossKills: Math.max(next[idx].bossKills, candidate.bossKills),
      defeatedBosses: candidate.defeatedBosses.length > next[idx].defeatedBosses.length
        ? candidate.defeatedBosses
        : next[idx].defeatedBosses,
      timestamp: Date.now(),
    };
  } else {
    next.push(candidate);
  }
  next.sort((a, b) => b.bossKills - a.bossKills);
  return next.slice(0, 50);
}

export function upsertLeader(
  entries: LeaderEntry[],
  candidate: LeaderEntry,
): LeaderEntry[] {
  const idx = entries.findIndex(
    (e) => e.username.toLowerCase() === candidate.username.toLowerCase(),
  );
  let next = [...entries];
  if (idx >= 0) {
    // Always update (keep best prob, always update level)
    if (candidate.prob < next[idx].prob || candidate.level > next[idx].level) {
      next[idx] = {
        ...next[idx],
        prob: Math.min(next[idx].prob, candidate.prob),
        level: Math.max(next[idx].level, candidate.level),
        number: candidate.prob <= next[idx].prob ? candidate.number : next[idx].number,
        rarity: candidate.prob <= next[idx].prob ? candidate.rarity : next[idx].rarity,
        timestamp: Date.now(),
      };
    }
  } else {
    next.push(candidate);
  }
  // Sort by level descending for leaderboard
  next.sort((a, b) => b.level - a.level);
  return next.slice(0, 50);
}

export async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function emptyProfile(
  username: string,
  passwordHash: string,
): Profile {
  return {
    username,
    passwordHash,
    coins: 0,
    gems: 0,
    xp: 0,
    level: 1,
    rebirths: 0,
    totalRolls: 0,
    rollsByRarity: {
      common: 0,
      uncommon: 0,
      rare: 0,
      epic: 0,
      legendary: 0,
      mythic: 0,
      unobtainable: 0,
    },
    bestNumber: null,
    bestProb: null,
    worstNumber: null,
    worstProb: null,
    rarestNumber: null,
    rarestProb: null,
    upgrades: { coin: 0, rarity: 0 },
    pets: {},
    equippedPets: [null],
    extraSlots: 0,
    achievements: {},
    mythicStreak: 0,
    boosters: { coinUntil: 0, rarityUntil: 0, xpUntil: 0 },
    eggs: {},
    hatch: null,
    petAbilityNext: {},
    quests: {
      dailyAssigned: [],
      dailyProgress: {},
      dailyClaimed: {},
      dailyRefreshAt: 0,
      weeklyAssigned: [],
      weeklyProgress: {},
      weeklyClaimed: {},
      weeklyRefreshAt: 0,
      specialProgress: {},
    },
    weather: {
      activeId: null,
      activeUntil: 0,
      nextAutoAt: 0,
      manualCooldownUntil: 0,
    },
    defeatedBosses: [],
    activeBoss: null,
    bossKills: 0,
    corruptedDefeats: 0,
    corruptedRoll: null,
    createdAt: Date.now(),
    schemaVersion: 5,
  };
}
