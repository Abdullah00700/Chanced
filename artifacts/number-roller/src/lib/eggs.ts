import type { RarityKey } from "./types";

export type EggDef = {
  id: string;
  name: string;
  flavor: string;
  cost: number;
  hatchMs: number;
  rebirthRequired: number;
  hatchTable: Array<{ petId: string; weight: number }>;
  color: string;
  symbol: string;
};

export const EGGS: EggDef[] = [
  // ---- Always available ----
  {
    id: "egg-common",
    name: "Common Egg",
    flavor: "Cheap and cheerful. Often hatches early-game pals.",
    cost: 25,
    hatchMs: 12_000,
    rebirthRequired: 0,
    color: "#a3e635",
    symbol: "•",
    hatchTable: [
      { petId: "puppy", weight: 35 },
      { petId: "bunny", weight: 25 },
      { petId: "chick", weight: 20 },
      { petId: "mouse", weight: 12 },
      { petId: "frog", weight: 5 },
      { petId: "cat", weight: 3 },
    ],
  },
  {
    id: "egg-rare",
    name: "Rare Egg",
    flavor: "Polished shell. Hatches into uncommon-to-rare pets.",
    cost: 80,
    hatchMs: 18_000,
    rebirthRequired: 0,
    color: "#22d3ee",
    symbol: "✦",
    hatchTable: [
      { petId: "cat", weight: 28 },
      { petId: "foxie", weight: 22 },
      { petId: "raccoon", weight: 18 },
      { petId: "hedgehog", weight: 14 },
      { petId: "wolf", weight: 9 },
      { petId: "tiger", weight: 5 },
      { petId: "panda", weight: 3 },
      { petId: "penguin", weight: 1 },
    ],
  },
  {
    id: "egg-epic",
    name: "Epic Egg",
    flavor: "Glows faintly. Has a real shot at epics and beyond.",
    cost: 220,
    hatchMs: 30_000,
    rebirthRequired: 0,
    color: "#a855f7",
    symbol: "❖",
    hatchTable: [
      { petId: "wolf", weight: 22 },
      { petId: "tiger", weight: 18 },
      { petId: "panda", weight: 16 },
      { petId: "penguin", weight: 14 },
      { petId: "leopard", weight: 12 },
      { petId: "dragon", weight: 10 },
      { petId: "griffin", weight: 6 },
      { petId: "phoenix", weight: 2 },
    ],
  },

  // ---- Unlocked via rebirth ----
  {
    id: "egg-jungle",
    name: "Jungle Egg",
    flavor: "Wrapped in vines. Hatches jungle-exclusive creatures.",
    cost: 350,
    hatchMs: 45_000,
    rebirthRequired: 3,
    color: "#16a34a",
    symbol: "✦",
    hatchTable: [
      { petId: "monkey", weight: 45 },
      { petId: "tree-frog", weight: 30 },
      { petId: "gorilla", weight: 15 },
      { petId: "toucan", weight: 7 },
      { petId: "lion", weight: 3 },
    ],
  },
  {
    id: "egg-desert",
    name: "Desert Egg",
    flavor: "Hot to the touch. Sand pours out of the cracks.",
    cost: 500,
    hatchMs: 60_000,
    rebirthRequired: 5,
    color: "#f59e0b",
    symbol: "☼",
    hatchTable: [
      { petId: "horned-gecko", weight: 50 },
      { petId: "rattlesnake", weight: 30 },
      { petId: "scorpion", weight: 12 },
      { petId: "camel", weight: 5 },
      { petId: "fennec-fox", weight: 3 },
    ],
  },
  {
    id: "egg-ocean",
    name: "Ocean Egg",
    flavor: "Dripping with brine. Saltwater roars inside.",
    cost: 800,
    hatchMs: 90_000,
    rebirthRequired: 10,
    color: "#0ea5e9",
    symbol: "≈",
    hatchTable: [
      { petId: "fish", weight: 55 },
      { petId: "sea-horse", weight: 30 },
      { petId: "starfish", weight: 10 },
      { petId: "shark", weight: 4 },
      { petId: "blue-whale", weight: 1 },
    ],
  },
  {
    id: "egg-arctic",
    name: "Arctic Egg",
    flavor: "Ice cold and glowing with a faint blue light. Frozen wonder inside.",
    cost: 1500,
    hatchMs: 120_000,
    rebirthRequired: 15,
    color: "#7dd3fc",
    symbol: "❄",
    hatchTable: [
      { petId: "arctic-fox", weight: 45 },
      { petId: "polar-bear", weight: 30 },
      { petId: "snow-leopard", weight: 14 },
      { petId: "ice-dragon", weight: 8 },
      { petId: "frost-titan", weight: 3 },
    ],
  },
  {
    id: "egg-mythical",
    name: "Mythical Egg",
    flavor: "Pulses with impossible power. Legends say it predates the universe itself.",
    cost: 3000,
    hatchMs: 180_000,
    rebirthRequired: 25,
    color: "#c4b5fd",
    symbol: "✵",
    hatchTable: [
      { petId: "rune-stone", weight: 40 },
      { petId: "astral-wolf", weight: 30 },
      { petId: "reality-fox", weight: 18 },
      { petId: "infinity-drake", weight: 9 },
      { petId: "primordial-god", weight: 3 },
    ],
  },
];

export const EGG_BY_ID: Record<string, EggDef> = EGGS.reduce(
  (acc, e) => {
    acc[e.id] = e;
    return acc;
  },
  {} as Record<string, EggDef>,
);

export function rollEggHatch(eggId: string): string | null {
  const def = EGG_BY_ID[eggId];
  if (!def) return null;
  const total = def.hatchTable.reduce((s, e) => s + e.weight, 0);
  let r = Math.random() * total;
  for (const e of def.hatchTable) {
    r -= e.weight;
    if (r <= 0) return e.petId;
  }
  return def.hatchTable[0]?.petId ?? null;
}

export function eggRarityHint(def: EggDef): RarityKey {
  if (def.rebirthRequired >= 25) return "unobtainable";
  if (def.rebirthRequired >= 15) return "mythic";
  if (def.rebirthRequired >= 10) return "legendary";
  if (def.rebirthRequired >= 5) return "epic";
  if (def.rebirthRequired >= 3) return "rare";
  if (def.cost >= 200) return "epic";
  if (def.cost >= 70) return "rare";
  return "uncommon";
}
