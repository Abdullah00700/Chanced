// XP needed to go FROM level n TO level n+1
export function xpForNextLevel(level: number): number {
  return Math.floor(50 * Math.pow(level, 2.2));
}

export function totalXpForLevel(level: number): number {
  let s = 0;
  for (let i = 1; i < level; i++) s += xpForNextLevel(i);
  return s;
}

// Returns { level, xpInLevel, xpToNext } given current totalXp from level 1.
// Profile stores level and "xp" as xp progress within current level.
export function applyXpGain(
  level: number,
  xpInLevel: number,
  gain: number,
): { level: number; xpInLevel: number; leveledUp: number } {
  let lv = level;
  let xp = xpInLevel + gain;
  let leveledUp = 0;
  while (true) {
    const need = xpForNextLevel(lv);
    if (xp < need) break;
    xp -= need;
    lv += 1;
    leveledUp += 1;
  }
  return { level: lv, xpInLevel: xp, leveledUp };
}

// ---- Level multipliers ----
export function coinMultFromLevel(level: number): number {
  return 1 + (level - 1) * 0.02; // +2% per level
}

export function xpMultFromLevel(level: number): number {
  return 1 + (level - 1) * 0.01; // +1% per level
}

export function rarityTiltFromLevel(level: number): number {
  return Math.min(0.5, (level - 1) * 0.005); // small tilt, caps at 0.5
}
