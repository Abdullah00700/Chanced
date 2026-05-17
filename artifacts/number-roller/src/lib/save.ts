import type { Profile, RarityKey } from "./types";

const PREFIX = "RR2-";

const RARITY_KEYS: RarityKey[] = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "mythic",
  "unobtainable",
];

function migrateLoaded(raw: any): Profile {
  const rollsByRarity = { ...(raw.rollsByRarity ?? {}) };
  for (const k of RARITY_KEYS) {
    if (typeof rollsByRarity[k] !== "number") rollsByRarity[k] = 0;
  }
  const pets: Record<string, { ownedAt: number; level: number }> = {};
  for (const id of Object.keys(raw.pets ?? {})) {
    const inst = raw.pets[id] ?? {};
    pets[id] = {
      ownedAt: typeof inst.ownedAt === "number" ? inst.ownedAt : Date.now(),
      level: typeof inst.level === "number" && inst.level > 0 ? inst.level : 1,
    };
  }
  return {
    ...raw,
    rollsByRarity,
    pets,
    mythicStreak: raw.mythicStreak ?? 0,
    lastGachaSpin: raw.lastGachaSpin ?? 0,
    schemaVersion: 3,
  };
}

export function encodeSave(profile: Profile): string {
  const json = JSON.stringify(profile);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return PREFIX + b64;
}

export function decodeSave(code: string): Profile | null {
  try {
    const trimmed = code.trim();
    if (!trimmed.startsWith(PREFIX)) return null;
    const b64 = trimmed.slice(PREFIX.length);
    const json = decodeURIComponent(escape(atob(b64)));
    const parsed = JSON.parse(json);
    if (
      typeof parsed.username !== "string" ||
      typeof parsed.passwordHash !== "string"
    ) {
      return null;
    }
    return migrateLoaded(parsed) as Profile;
  } catch {
    return null;
  }
}
