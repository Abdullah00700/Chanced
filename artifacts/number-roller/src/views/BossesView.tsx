import { useState } from "react";
import { BossArt } from "../components/BossArt";
import { formatNumber } from "../lib/format";
import { BOSS_UNLOCK_LEVEL, BOSSES, BOSS_BY_ID } from "../lib/bosses";
import type { Profile } from "../lib/types";

function HpBar({
  current,
  max,
  color,
  label,
}: {
  current: number;
  max: number;
  color: string;
  label: string;
}) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[10px] font-bold text-zinc-400">
        <span>{label}</span>
        <span className="font-mono text-zinc-200">
          {formatNumber(Math.max(0, current))} / {formatNumber(max)}
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function BossesView({
  profile,
  rolling,
  onRoll,
  onStartBoss,
  onExitBoss,
}: {
  profile: Profile;
  rolling: boolean;
  onRoll: () => void;
  onStartBoss: (bossId: string) => void;
  onExitBoss: () => void;
}) {
  const [confirmBoss, setConfirmBoss] = useState<string | null>(null);

  const level = profile.level ?? 1;
  const bossUnlocked = level >= BOSS_UNLOCK_LEVEL;
  const activeFight = profile.activeBoss;

  // ─── ACTIVE FIGHT UI ─────────────────────────────────────────────────────
  if (activeFight) {
    const boss = BOSS_BY_ID[activeFight.bossId];
    if (!boss) return null;
    const bossHpPct = Math.max(0, Math.min(100, (activeFight.bossHp / activeFight.bossMaxHp) * 100));
    const playerHpPct = Math.max(0, Math.min(100, (activeFight.playerHp / activeFight.playerMaxHp) * 100));
    const isDead = activeFight.playerHp <= 0;
    const isWon = activeFight.bossHp <= 0;
    const over = isDead || isWon;

    return (
      <div className="flex flex-col gap-3 pb-4">
        {/* Boss header */}
        <div
          className="rounded-2xl border p-4 text-center"
          style={{
            borderColor: boss.auraColor + "60",
            background: boss.bgColor,
          }}
        >
          <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-400">
            BOSS FIGHT
          </div>
          <div className="mt-1 text-xl font-black text-white">{boss.name}</div>
          <div className="text-[11px] text-zinc-400">{boss.title}</div>
        </div>

        {/* Boss HP bar */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3">
          <HpBar
            current={activeFight.bossHp}
            max={activeFight.bossMaxHp}
            color={boss.auraColor}
            label={`${boss.name} HP`}
          />
        </div>

        {/* Boss art */}
        <div
          className="flex items-center justify-center rounded-2xl border py-4"
          style={{
            borderColor: boss.auraColor + "50",
            background: boss.bgColor,
            boxShadow: `0 0 40px ${boss.auraColor}30`,
          }}
        >
          <div
            className={over ? "" : "animate-pulse"}
            style={{ animationDuration: "2s" }}
          >
            <BossArt art={boss.art} size={160} />
          </div>
        </div>

        {/* Last move */}
        {activeFight.lastMoveName && (
          <div className="rounded-xl border border-red-800/50 bg-red-950/30 p-3 text-center">
            <div className="text-[10px] uppercase tracking-widest text-red-400">
              Boss attacked!
            </div>
            <div className="mt-1 text-sm font-bold text-red-200">
              {activeFight.lastMoveName}
            </div>
            <div className="text-lg font-black text-red-400">
              -{activeFight.lastMoveDamage} HP
            </div>
          </div>
        )}

        {/* Player HP */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3">
          <HpBar
            current={activeFight.playerHp}
            max={activeFight.playerMaxHp}
            color="#22c55e"
            label="Your HP"
          />
          <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-500">
            <span>Rolls: {activeFight.rollsDone}</span>
            <span>Total dmg: {formatNumber(activeFight.totalDamageDealt)}</span>
          </div>
        </div>

        {/* Fight controls */}
        {over ? (
          <div className="flex flex-col gap-3">
            {isWon && (
              <div className="rounded-xl border border-emerald-600/50 bg-emerald-950/40 p-4 text-center">
                <div className="text-2xl">🏆</div>
                <div className="mt-1 font-extrabold text-emerald-300">
                  BOSS DEFEATED!
                </div>
                <div className="mt-1 text-sm text-emerald-400">
                  Rewards: {formatNumber(boss.rewardCoins)} coins •{" "}
                  {formatNumber(boss.rewardGems)} gems
                </div>
              </div>
            )}
            {isDead && !isWon && (
              <div className="rounded-xl border border-red-700/50 bg-red-950/40 p-4 text-center">
                <div className="text-2xl">💀</div>
                <div className="mt-1 font-extrabold text-red-300">YOU FELL</div>
                <div className="text-sm text-red-400 mt-1">
                  Better luck next time. No rewards.
                </div>
              </div>
            )}
            <button
              onClick={onExitBoss}
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-800 py-4 text-sm font-extrabold text-zinc-100 active:bg-zinc-700"
            >
              ← Return
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <button
              onClick={onRoll}
              disabled={rolling}
              className={
                "w-full select-none rounded-2xl border py-5 text-lg font-extrabold tracking-wider shadow-lg transition active:scale-[0.98] " +
                (rolling
                  ? "border-zinc-700 bg-zinc-800 text-zinc-500"
                  : "border-amber-400/30 bg-gradient-to-b from-amber-400 to-orange-500 text-zinc-950")
              }
              style={
                rolling
                  ? {}
                  : {
                      boxShadow:
                        "0 8px 28px rgba(251,146,60,0.35), inset 0 1px 0 rgba(255,255,255,0.4)",
                    }
              }
            >
              {rolling ? "ROLLING…" : "⚔ ROLL TO ATTACK"}
            </button>
            <p className="text-center text-[10px] text-zinc-500">
              Roll further from 5000 to deal more damage. You cannot leave this fight.
            </p>
          </div>
        )}
      </div>
    );
  }

  // ─── BOSS LIST UI ────────────────────────────────────────────────────────
  if (!bossUnlocked) {
    return (
      <div className="flex flex-col gap-4 pb-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 text-center">
          <div className="text-4xl">⚔</div>
          <div className="mt-3 font-extrabold text-zinc-100">Boss Fights</div>
          <div className="mt-2 text-sm text-zinc-400">
            Reach <span className="font-bold text-amber-300">Level {BOSS_UNLOCK_LEVEL}</span> to unlock boss fights.
          </div>
          <div className="mt-2 text-xs text-zinc-500">
            Current level: {level}
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-amber-400"
              style={{ width: `${Math.min(100, (level / BOSS_UNLOCK_LEVEL) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  const defeatedSet = new Set(profile.defeatedBosses);

  return (
    <div className="flex flex-col gap-3 pb-4">
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
        <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Boss Kills</div>
        <div className="text-2xl font-black text-amber-300">{profile.bossKills ?? 0}</div>
        <div className="text-[10px] text-zinc-500 mt-0.5">
          {profile.defeatedBosses.length} / {BOSSES.length} unique bosses defeated
        </div>
      </div>

      {BOSSES.map((boss, i) => {
        const isDefeated = defeatedSet.has(boss.id);
        const prevDefeated = i === 0 || defeatedSet.has(BOSSES[i - 1].id);
        const isLocked = !prevDefeated;
        const isConfirm = confirmBoss === boss.id;

        return (
          <div
            key={boss.id}
            className={
              "rounded-xl border p-3 " +
              (isLocked
                ? "border-zinc-800/50 bg-zinc-950/30 opacity-50"
                : isDefeated
                  ? "border-emerald-700/30 bg-emerald-950/20"
                  : "border-zinc-800 bg-zinc-950/60")
            }
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                style={{ background: boss.bgColor, border: `1.5px solid ${boss.auraColor}50` }}
              >
                <BossArt art={boss.art} size={52} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-zinc-100 truncate">
                    {boss.name}
                  </span>
                  {isDefeated && (
                    <span className="rounded-full bg-emerald-900/60 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-700/50 shrink-0">
                      ✓ DONE
                    </span>
                  )}
                  {isLocked && (
                    <span className="rounded-full bg-zinc-800 px-1.5 py-0.5 text-[9px] font-bold text-zinc-500 border border-zinc-700 shrink-0">
                      🔒 LOCKED
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-zinc-500 truncate">{boss.title}</div>
                <div className="mt-0.5 flex items-center gap-2 text-[10px] text-zinc-400">
                  <span>{formatNumber(boss.hp)} HP</span>
                  <span>·</span>
                  <span className="text-amber-400">{formatNumber(boss.rewardGems)} 💎</span>
                </div>
              </div>
            </div>

            {/* Lore */}
            <div className="mt-2 text-[10px] text-zinc-500 leading-tight">
              {boss.lore}
            </div>

            {/* Moves preview */}
            <div className="mt-2 flex gap-1.5 flex-wrap">
              {boss.moves.map((m) => (
                <span
                  key={m.id}
                  className="rounded-full border border-zinc-700/60 bg-zinc-900/60 px-2 py-0.5 text-[9px] font-bold"
                  style={{ color: m.animColor }}
                >
                  {m.name} (-{m.damage}hp)
                </span>
              ))}
            </div>

            {/* Rewards */}
            <div className="mt-2 flex gap-2 text-[10px] text-zinc-400">
              <span>Reward:</span>
              <span className="text-amber-300">{formatNumber(boss.rewardCoins)} coins</span>
              <span className="text-emerald-300">{formatNumber(boss.rewardXp)} XP</span>
              <span className="text-blue-300">{formatNumber(boss.rewardGems)} gems</span>
            </div>

            {!isLocked && !isConfirm && (
              <button
                onClick={() => setConfirmBoss(boss.id)}
                className={
                  "mt-3 w-full rounded-xl py-2.5 text-[11px] font-extrabold tracking-wide transition " +
                  (isDefeated
                    ? "border border-emerald-700/40 bg-emerald-950/30 text-emerald-300"
                    : "bg-gradient-to-b from-red-600 to-red-700 text-white shadow-lg")
                }
              >
                {isDefeated ? "Fight Again" : "⚔ Challenge Boss"}
              </button>
            )}
            {isConfirm && (
              <div className="mt-3 rounded-xl border border-red-800/60 bg-red-950/30 p-3">
                <div className="text-sm font-bold text-red-200 text-center mb-2">
                  ⚠ You will be locked in until you win or fall. Ready?
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmBoss(null)}
                    className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 py-2 text-[11px] font-bold text-zinc-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setConfirmBoss(null);
                      onStartBoss(boss.id);
                    }}
                    className="flex-1 rounded-xl bg-gradient-to-b from-red-600 to-red-700 py-2 text-[11px] font-bold text-white"
                  >
                    Fight!
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
