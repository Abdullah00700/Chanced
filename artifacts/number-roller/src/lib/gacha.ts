import { PET_BY_ID } from "./pets";
import type { RarityKey } from "./types";

export const GACHA_SPIN_COST = 3_000;
export const GACHA_COOLDOWN_MS = 30 * 60 * 1_000;

export type GachaResult =
  | { kind: "coins"; amount: number }
  | { kind: "pet"; petId: string; rarity: RarityKey; name: string };

type GachaPoolEntry =
  | { kind: "coins"; weight: number; min: number; max: number }
  | { kind: "pet"; petId: string; weight: number };

export const GACHA_POOL: GachaPoolEntry[] = [
  { kind: "coins", weight: 35, min: 1_000, max: 20_000 },
  { kind: "pet",   petId: "prism-fox",        weight: 25 },
  { kind: "pet",   petId: "void-serpent",      weight: 18 },
  { kind: "pet",   petId: "celestial-dragon",  weight: 12 },
  { kind: "pet",   petId: "chrono-wolf",        weight: 7  },
  { kind: "pet",   petId: "nebula-phoenix",     weight: 3  },
];

export const GACHA_PET_IDS = new Set(
  GACHA_POOL.filter((e): e is Extract<GachaPoolEntry, { kind: "pet" }> => e.kind === "pet").map(e => e.petId),
);

const TOTAL_WEIGHT = GACHA_POOL.reduce((s, e) => s + e.weight, 0);

export function spinGacha(): GachaResult {
  let r = Math.random() * TOTAL_WEIGHT;
  for (const entry of GACHA_POOL) {
    r -= entry.weight;
    if (r <= 0) {
      if (entry.kind === "coins") {
        const amount = entry.min + Math.floor(Math.random() * (entry.max - entry.min + 1));
        return { kind: "coins", amount };
      } else {
        const def = PET_BY_ID[entry.petId];
        return {
          kind: "pet",
          petId: entry.petId,
          rarity: def?.baseRarity ?? "common",
          name: def?.name ?? entry.petId,
        };
      }
    }
  }
  return { kind: "coins", amount: 1_000 };
}

export function gachaCooldownMs(lastGachaSpin: number): number {
  return Math.max(0, lastGachaSpin + GACHA_COOLDOWN_MS - Date.now());
}

export function formatCooldown(ms: number): string {
  if (ms <= 0) return "Ready";
  const totalSec = Math.ceil(ms / 1_000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}
