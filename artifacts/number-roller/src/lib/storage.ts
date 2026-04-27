import type { LeaderEntry, Profile } from "./types";

export const LS_ACCOUNTS = "rr2.accounts";
export const LS_ACTIVE = "rr2.active";
export const LS_LEADERBOARD = "rr2.leaderboard";
export const LS_MUTED = "rr2.muted";

export type AccountsMap = Record<string, Profile>;

export function loadAccounts(): AccountsMap {
  try {
    const raw = localStorage.getItem(LS_ACCOUNTS);
    if (!raw) return {};
    const v = JSON.parse(raw);
    if (typeof v !== "object" || !v) return {};
    return v as AccountsMap;
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

// SHA-256 hashing for password
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
    },
    bestNumber: null,
    bestProb: null,
    worstNumber: null,
    worstProb: null,
    rarestNumber: null,
    rarestProb: null,
    upgrades: { coin: 0, rarity: 0 },
    pets: {},
    equippedPet: null,
    achievements: {},
    boosters: { coinUntil: 0, rarityUntil: 0 },
    createdAt: Date.now(),
    schemaVersion: 2,
  };
}
