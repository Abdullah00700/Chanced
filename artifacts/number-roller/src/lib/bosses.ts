// Boss fight system — unlocks at level 50.
// Each boss is exponentially stronger than the previous.
// New boss unlocked only after killing the previous one.

export type BossMove = {
  id: string;
  name: string;
  description: string;
  damage: number;
  intervalMs: number;
  animColor: string;
};

export type BossDef = {
  id: string;
  name: string;
  title: string;
  lore: string;
  hp: number;
  playerHp: number;
  moves: BossMove[];
  rewardCoins: number;
  rewardXp: number;
  rewardGems: number;
  art: string;
  auraColor: string;
  bgColor: string;
  /** Unique pet that has a 5% chance to drop when this boss is defeated for the first time. */
  dropPetId: string;
};

export const BOSSES: BossDef[] = [
  {
    id: "slime-king",
    name: "Slime King",
    title: "Ruler of the Puddles",
    lore: "A towering mass of pulsating green slime that devoured an entire kingdom.",
    hp: 25_000,
    playerHp: 1000,
    art: "slime-king",
    auraColor: "#4ade80",
    bgColor: "#052e16",
    moves: [
      {
        id: "slime-splash",
        name: "Slime Splash",
        description: "Hurls a glob of acid slime.",
        damage: 25,
        intervalMs: 8_000,
        animColor: "#4ade80",
      },
      {
        id: "toxic-breath",
        name: "Toxic Breath",
        description: "Breathes corrosive green gas.",
        damage: 50,
        intervalMs: 18_000,
        animColor: "#86efac",
      },
      {
        id: "mega-slime",
        name: "Mega Slime Wave",
        description: "Unleashes a massive wave of slime.",
        damage: 100,
        intervalMs: 35_000,
        animColor: "#22c55e",
      },
    ],
    rewardCoins: 100_000,
    rewardXp: 25_000,
    rewardGems: 100,
    dropPetId: "slime-spawn",
  },
  {
    id: "stone-golem",
    name: "Stone Golem",
    title: "The Immovable Wall",
    lore: "An ancient construct of living granite, awakened by the tremors of rolling numbers.",
    hp: 125_000,
    playerHp: 950,
    art: "stone-golem",
    auraColor: "#a8a29e",
    bgColor: "#1c1917",
    moves: [
      {
        id: "rock-throw",
        name: "Rock Throw",
        description: "Launches a massive boulder.",
        damage: 60,
        intervalMs: 7_000,
        animColor: "#78716c",
      },
      {
        id: "earthquake",
        name: "Earthquake",
        description: "Slams the ground, sending shockwaves.",
        damage: 120,
        intervalMs: 16_000,
        animColor: "#a8a29e",
      },
      {
        id: "meteor-strike",
        name: "Meteor Strike",
        description: "Calls down a mountain of rock.",
        damage: 250,
        intervalMs: 32_000,
        animColor: "#d6d3d1",
      },
    ],
    rewardCoins: 500_000,
    rewardXp: 150_000,
    rewardGems: 500,
    dropPetId: "golem-shard",
  },
  {
    id: "fire-drake",
    name: "Fire Drake",
    title: "The Scorching Terror",
    lore: "A dragon of pure flame whose breath can melt the very fabric of probability.",
    hp: 625_000,
    playerHp: 900,
    art: "fire-drake",
    auraColor: "#f97316",
    bgColor: "#431407",
    moves: [
      {
        id: "flame-breath",
        name: "Flame Breath",
        description: "Scorching fire engulfs the arena.",
        damage: 120,
        intervalMs: 7_000,
        animColor: "#fb923c",
      },
      {
        id: "inferno",
        name: "Inferno",
        description: "Summons a raging column of fire.",
        damage: 220,
        intervalMs: 15_000,
        animColor: "#f97316",
      },
      {
        id: "dragon-roar",
        name: "Dragon Roar",
        description: "A reality-shaking roar that stuns and scorches.",
        damage: 450,
        intervalMs: 30_000,
        animColor: "#ef4444",
      },
    ],
    rewardCoins: 2_500_000,
    rewardXp: 750_000,
    rewardGems: 2_500,
    dropPetId: "ember-whelp",
  },
  {
    id: "ocean-leviathan",
    name: "Ocean Leviathan",
    title: "Devourer of Worlds",
    lore: "An ancient sea titan that predates the universe. Rolls fear it.",
    hp: 3_125_000,
    playerHp: 850,
    art: "ocean-leviathan",
    auraColor: "#0ea5e9",
    bgColor: "#082f49",
    moves: [
      {
        id: "tidal-wave",
        name: "Tidal Wave",
        description: "A wall of ocean water crashes down.",
        damage: 200,
        intervalMs: 6_000,
        animColor: "#38bdf8",
      },
      {
        id: "whirlpool",
        name: "Whirlpool",
        description: "Drags the player into a deadly vortex.",
        damage: 350,
        intervalMs: 14_000,
        animColor: "#0ea5e9",
      },
      {
        id: "tsunami",
        name: "Tsunami",
        description: "A continent-leveling wave.",
        damage: 700,
        intervalMs: 28_000,
        animColor: "#0284c7",
      },
    ],
    rewardCoins: 15_000_000,
    rewardXp: 5_000_000,
    rewardGems: 12_000,
    dropPetId: "leviathan-cub",
  },
  {
    id: "thunder-colossus",
    name: "Thunder Colossus",
    title: "The Storm Incarnate",
    lore: "A being of pure lightning energy who predates civilisation. Its strikes bend chance itself.",
    hp: 15_625_000,
    playerHp: 800,
    art: "thunder-colossus",
    auraColor: "#facc15",
    bgColor: "#1c1917",
    moves: [
      {
        id: "lightning-strike",
        name: "Lightning Strike",
        description: "A precise bolt from above.",
        damage: 350,
        intervalMs: 6_000,
        animColor: "#fde047",
      },
      {
        id: "thunder-clap",
        name: "Thunder Clap",
        description: "A sonic boom that ruptures eardrums and HP.",
        damage: 600,
        intervalMs: 13_000,
        animColor: "#facc15",
      },
      {
        id: "storm-of-zeus",
        name: "Storm of Zeus",
        description: "A divine storm of infinite thunderbolts.",
        damage: 1200,
        intervalMs: 26_000,
        animColor: "#a78bfa",
      },
    ],
    rewardCoins: 75_000_000,
    rewardXp: 30_000_000,
    rewardGems: 60_000,
    dropPetId: "storm-sprite",
  },
  {
    id: "shadow-overlord",
    name: "Shadow Overlord",
    title: "Lord of the Dark Dimension",
    lore: "A being of pure darkness who feeds on failed rolls. It has consumed countless rollers.",
    hp: 78_125_000,
    playerHp: 750,
    art: "shadow-overlord",
    auraColor: "#a855f7",
    bgColor: "#0c0010",
    moves: [
      {
        id: "shadow-claw",
        name: "Shadow Claw",
        description: "Claws of pure darkness rend reality.",
        damage: 550,
        intervalMs: 5_000,
        animColor: "#a855f7",
      },
      {
        id: "darkness-shroud",
        name: "Darkness Shroud",
        description: "Envelopes the arena in crushing darkness.",
        damage: 950,
        intervalMs: 12_000,
        animColor: "#7c3aed",
      },
      {
        id: "void-pulse",
        name: "Void Pulse",
        description: "Emits a reality-annihilating void shockwave.",
        damage: 1800,
        intervalMs: 24_000,
        animColor: "#c4b5fd",
      },
    ],
    rewardCoins: 500_000_000,
    rewardXp: 200_000_000,
    rewardGems: 300_000,
    dropPetId: "shadow-wisp",
  },
  {
    id: "void-emperor",
    name: "Void Emperor",
    title: "Ruler of the Nothing",
    lore: "Commands legions of destroyed universes. Your rolls are but a flicker in its endless void.",
    hp: 390_625_000,
    playerHp: 700,
    art: "void-emperor",
    auraColor: "#6366f1",
    bgColor: "#020209",
    moves: [
      {
        id: "void-slash",
        name: "Void Slash",
        description: "Slices through existence itself.",
        damage: 900,
        intervalMs: 5_000,
        animColor: "#818cf8",
      },
      {
        id: "reality-tear",
        name: "Reality Tear",
        description: "Tears a hole in the fabric of space.",
        damage: 1500,
        intervalMs: 11_000,
        animColor: "#6366f1",
      },
      {
        id: "annihilation",
        name: "Annihilation",
        description: "A beam of pure nothingness that erases.",
        damage: 3000,
        intervalMs: 22_000,
        animColor: "#a5b4fc",
      },
    ],
    rewardCoins: 2_500_000_000,
    rewardXp: 1_000_000_000,
    rewardGems: 1_500_000,
    dropPetId: "void-fragment",
  },
  {
    id: "cosmic-horror",
    name: "Cosmic Horror",
    title: "The Unnameable",
    lore: "An entity so ancient it remembers the first number ever rolled. It is beyond comprehension.",
    hp: 1_953_125_000,
    playerHp: 650,
    art: "cosmic-horror",
    auraColor: "#22d3ee",
    bgColor: "#00050f",
    moves: [
      {
        id: "cosmic-ray",
        name: "Cosmic Ray",
        description: "Fires a beam from the edge of the universe.",
        damage: 1400,
        intervalMs: 4_500,
        animColor: "#67e8f9",
      },
      {
        id: "madness-wave",
        name: "Madness Wave",
        description: "Floods the mind with cosmic horror.",
        damage: 2400,
        intervalMs: 10_000,
        animColor: "#22d3ee",
      },
      {
        id: "event-horizon",
        name: "Event Horizon",
        description: "Creates a black hole that swallows all light and HP.",
        damage: 5000,
        intervalMs: 20_000,
        animColor: "#0ea5e9",
      },
    ],
    rewardCoins: 15_000_000_000,
    rewardXp: 7_500_000_000,
    rewardGems: 7_500_000,
    dropPetId: "cosmic-eye",
  },
  {
    id: "primordial-titan",
    name: "Primordial Titan",
    title: "The First Being",
    lore: "The original entity that existed before numbers, before chance, before anything. It regards you with contempt.",
    hp: 9_765_625_000,
    playerHp: 600,
    art: "primordial-titan",
    auraColor: "#f43f5e",
    bgColor: "#0a0002",
    moves: [
      {
        id: "planet-smash",
        name: "Planet Smash",
        description: "Hurls a planet at you like a pebble.",
        damage: 2500,
        intervalMs: 4_000,
        animColor: "#fb7185",
      },
      {
        id: "extinction-beam",
        name: "Extinction Beam",
        description: "The beam that ended the dinosaurs.",
        damage: 4500,
        intervalMs: 9_000,
        animColor: "#f43f5e",
      },
      {
        id: "big-bang",
        name: "Big Bang",
        description: "Creates a miniature universe just to destroy it on you.",
        damage: 9000,
        intervalMs: 18_000,
        animColor: "#fda4af",
      },
    ],
    rewardCoins: 75_000_000_000,
    rewardXp: 50_000_000_000,
    rewardGems: 37_500_000,
    dropPetId: "titan-shard",
  },
  {
    id: "reality-shredder",
    name: "Reality Shredder",
    title: "The End of All Things",
    lore: "It does not hate you. It does not feel anything. It will simply unmake your rolls, your progress, your existence — and smile doing it.",
    hp: 48_828_125_000,
    playerHp: 550,
    art: "reality-shredder",
    auraColor: "#ffffff",
    bgColor: "#000000",
    moves: [
      {
        id: "reality-slash",
        name: "Reality Slash",
        description: "Cuts through the simulation itself.",
        damage: 4000,
        intervalMs: 3_500,
        animColor: "#f0fdf4",
      },
      {
        id: "existence-eraser",
        name: "Existence Eraser",
        description: "Erases you from all timelines simultaneously.",
        damage: 7000,
        intervalMs: 8_000,
        animColor: "#dcfce7",
      },
      {
        id: "universal-collapse",
        name: "Universal Collapse",
        description: "The heat death of your health bar.",
        damage: 14_000,
        intervalMs: 16_000,
        animColor: "#fff",
      },
    ],
    rewardCoins: 500_000_000_000,
    rewardXp: 500_000_000_000,
    rewardGems: 200_000_000,
    dropPetId: "reality-chip",
  },
];

export const BOSS_BY_ID: Record<string, BossDef> = BOSSES.reduce(
  (acc, b) => {
    acc[b.id] = b;
    return acc;
  },
  {} as Record<string, BossDef>,
);

export const BOSS_UNLOCK_LEVEL = 50;
