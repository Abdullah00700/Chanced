import type { RarityKey } from "./types";

export type RarityDef = {
  key: RarityKey;
  label: string;
  threshold: number;
  textStyle: React.CSSProperties;
  glow: string;
  badgeBg: string;
  badgeText: string;
  auraColor: string;
  baseCoins: number;
  baseXp: number;
};

export const RARITIES: RarityDef[] = [
  {
    key: "common",
    label: "COMMON",
    threshold: 0,
    textStyle: { color: "#ffffff" },
    glow: "0 0 12px rgba(255,255,255,0.55), 0 0 28px rgba(255,255,255,0.25)",
    badgeBg: "rgba(255,255,255,0.10)",
    badgeText: "#ffffff",
    auraColor: "rgba(255,255,255,0.35)",
    baseCoins: 1,
    baseXp: 1,
  },
  {
    key: "uncommon",
    label: "UNCOMMON",
    threshold: 0.5,
    textStyle: { color: "#22c55e" },
    glow: "0 0 14px rgba(34,197,94,0.7), 0 0 36px rgba(34,197,94,0.45)",
    badgeBg: "rgba(34,197,94,0.14)",
    badgeText: "#4ade80",
    auraColor: "rgba(34,197,94,0.55)",
    baseCoins: 5,
    baseXp: 4,
  },
  {
    key: "rare",
    label: "RARE",
    threshold: 0.75,
    textStyle: { color: "#06b6d4" },
    glow: "0 0 16px rgba(6,182,212,0.8), 0 0 42px rgba(6,182,212,0.5)",
    badgeBg: "rgba(6,182,212,0.16)",
    badgeText: "#22d3ee",
    auraColor: "rgba(6,182,212,0.6)",
    baseCoins: 25,
    baseXp: 18,
  },
  {
    key: "epic",
    label: "EPIC",
    threshold: 0.88,
    textStyle: {
      backgroundImage: "linear-gradient(90deg, #3b82f6 0%, #1e3a8a 100%)",
    },
    glow: "0 0 18px rgba(59,130,246,0.85), 0 0 48px rgba(30,58,138,0.6)",
    badgeBg: "linear-gradient(90deg, rgba(59,130,246,0.25), rgba(30,58,138,0.25))",
    badgeText: "#93c5fd",
    auraColor: "rgba(59,130,246,0.7)",
    baseCoins: 120,
    baseXp: 80,
  },
  {
    key: "legendary",
    label: "LEGENDARY",
    threshold: 0.96,
    textStyle: {
      backgroundImage: "linear-gradient(90deg, #facc15 0%, #f97316 100%)",
    },
    glow: "0 0 22px rgba(250,204,21,0.85), 0 0 60px rgba(249,115,22,0.6)",
    badgeBg: "linear-gradient(90deg, rgba(250,204,21,0.25), rgba(249,115,22,0.25))",
    badgeText: "#fbbf24",
    auraColor: "rgba(249,115,22,0.8)",
    baseCoins: 800,
    baseXp: 400,
  },
  {
    key: "mythic",
    label: "MYTHIC",
    threshold: 0.992,
    textStyle: {
      backgroundImage: "linear-gradient(90deg, #000000 0%, #4c1d95 100%)",
    },
    glow: "0 0 24px rgba(76,29,149,0.95), 0 0 70px rgba(124,58,237,0.65), 0 0 12px rgba(0,0,0,0.9)",
    badgeBg: "linear-gradient(90deg, rgba(0,0,0,0.6), rgba(76,29,149,0.45))",
    badgeText: "#c4b5fd",
    auraColor: "rgba(139,92,246,0.85)",
    baseCoins: 8000,
    baseXp: 3000,
  },
];

export const RARITY_BY_KEY: Record<RarityKey, RarityDef> = RARITIES.reduce(
  (acc, r) => {
    acc[r.key] = r;
    return acc;
  },
  {} as Record<RarityKey, RarityDef>,
);

export const CENTER = 5000;
export const MAX_NUMBER = 10000;

export function extremeness(n: number) {
  return Math.abs(n - CENTER) / CENTER;
}

export function rarityFor(n: number): RarityDef {
  const e = extremeness(n);
  let chosen = RARITIES[0];
  for (const r of RARITIES) {
    if (e >= r.threshold) chosen = r;
  }
  return chosen;
}

export function isGradientRarity(key: RarityKey): boolean {
  return key === "epic" || key === "legendary" || key === "mythic";
}
