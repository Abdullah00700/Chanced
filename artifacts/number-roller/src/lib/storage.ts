import type { LeaderEntry, PetInstance, Profile, RarityKey } from "./types";

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

/**
 * Migrate older profiles into the current schema, filling missing fields with
 * sensible defaults so old save codes / accounts keep working.
 */
function clampSlot(raw: any): number {
  const n = typeof raw === "number" ? Math.floor(raw) : 0;
  return Math.max(0, Math.min(2, n));
}

function migrateEquippedPets(raw: any): (string | null)[] {
  const slots = clampSlot(raw?.extraSlots) + 1;
  // New schema
  if (Array.isArray(raw?.equippedPets)) {
    const arr = raw.equippedPets.map((v: unknown) =>
      typeof v === "string" ? v : null,
    );
    while (arr.length < slots) arr.push(null);
    return arr.slice(0, slots);
  }
  // Old schema: single equippedPet
  const out: (string | null)[] = [
    typeof raw?.equippedPet === "string" ? raw.equippedPet : null,
  ];
  while (out.length < slots) out.push(null);
  return out;
}

function migrateProfile(raw: any): Profile {
  const rollsByRarity = { ...(raw.rollsByRarity ?? {}) } as Record<
    RarityKey,
    number
  >;
  for (const r of RARITIES) {
    if (typeof rollsByRarity[r] !== "number") rollsByRarity[r] = 0;
  }
  // Pet instances may have been { ownedAt: number } only — ensure { level }.
  const pets: Record<string, PetInstance> = {};
  for (const id of Object.keys(raw.pets ?? {})) {
    const inst = raw.pets[id] ?? {};
    pets[id] = {
      ownedAt: typeof inst.ownedAt === "number" ? inst.ownedAt : Date.now(),
      level: typeof inst.level === "number" && inst.level > 0 ? inst.level : 1,
    };
  }
  return {
    username: raw.username,
    passwordHash: raw.passwordHash,
    coins: raw.coins ?? 0,
    gems: raw.gems ?? 0,
    xp: raw.xp ?? 0,
    level: raw.level ?? 1,
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
    },
    createdAt: raw.createdAt ?? Date.now(),
    schemaVersion: 3,
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

export function upsertLeader(
  entries: LeaderEntry[],
  candidate: LeaderEntry,
): LeaderEntry[] {
  const idx = entries.findIndex(
    (e) => e.username.toLowerCase() === candidate.username.toLowerCase(),
  );
  let next = [...entries];
  if (idx >= 0) {
    if (candidate.prob < next[idx].prob) next[idx] = candidate;
  } else {
    next.push(candidate);
  }
  next.sort((a, b) => a.prob - b.prob);
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
    boosters: { coinUntil: 0, rarityUntil: 0 },
    createdAt: Date.now(),
    schemaVersion: 3,
  };
}
