import { useState } from "react";
import { chancePctFromProb } from "../lib/format";
import { isGradientRarity, RARITY_BY_KEY } from "../lib/rarity";
import type { BossLeaderEntry, LeaderEntry } from "../lib/types";
import { BOSS_BY_ID, BOSSES } from "../lib/bosses";

export function LeaderboardView({
  entries,
  bossEntries,
  currentUser,
}: {
  entries: LeaderEntry[];
  bossEntries: BossLeaderEntry[];
  currentUser: string;
}) {
  const [tab, setTab] = useState<"level" | "boss">("level");

  return (
    <div className="flex flex-col gap-3 pb-4">
      <div className="flex rounded-xl border border-zinc-800 bg-zinc-950/60 p-1 gap-1">
        <button
          onClick={() => setTab("level")}
          className={
            "flex-1 rounded-lg py-2 text-xs font-bold tracking-wide transition-colors " +
            (tab === "level"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              : "text-zinc-500 hover:text-zinc-300")
          }
        >
          ★ LEVEL BOARD
        </button>
        <button
          onClick={() => setTab("boss")}
          className={
            "flex-1 rounded-lg py-2 text-xs font-bold tracking-wide transition-colors " +
            (tab === "boss"
              ? "bg-red-500/20 text-red-300 border border-red-500/30"
              : "text-zinc-500 hover:text-zinc-300")
          }
        >
          ☠ BOSS BOARD
        </button>
      </div>

      {tab === "level" ? (
        <LevelBoard entries={entries} currentUser={currentUser} />
      ) : (
        <BossBoard entries={bossEntries} currentUser={currentUser} />
      )}
    </div>
  );
}

function LevelBoard({
  entries,
  currentUser,
}: {
  entries: LeaderEntry[];
  currentUser: string;
}) {
  const sorted = [...entries].sort((a, b) => b.level - a.level);

  if (sorted.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 text-center text-sm text-zinc-500">
        No entries yet. Play and level up to claim a spot!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-[11px] font-extrabold tracking-[0.22em] text-zinc-400">
        TOP PLAYERS BY LEVEL
      </h2>
      {sorted.map((e, i) => {
        const r = RARITY_BY_KEY[e.rarity];
        const isMe = e.username.toLowerCase() === currentUser.toLowerCase();
        const isGradient = isGradientRarity(e.rarity);
        const rank = i + 1;
        const rankColor =
          rank === 1 ? "text-amber-300" : rank === 2 ? "text-zinc-300" : rank === 3 ? "text-amber-600" : "text-zinc-500";
        return (
          <div
            key={e.username + e.timestamp}
            className={
              "flex items-center gap-3 rounded-xl border p-2.5 " +
              (isMe
                ? "border-amber-500/40 bg-amber-500/5"
                : "border-zinc-800 bg-zinc-950/60")
            }
          >
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-extrabold ${rankColor}`}>
              {rank === 1 ? "★" : rank === 2 ? "☆" : rank === 3 ? "▲" : rank}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-sm font-extrabold text-zinc-100">
                  {e.username}
                </span>
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-300">
                  LV{e.level}
                </span>
              </div>
              <div className="text-[10px] text-zinc-500">
                Best roll: {chancePctFromProb(e.prob)} chance
              </div>
            </div>
            <div className="text-right">
              <div
                className={
                  "text-lg font-black tabular-nums " +
                  (isGradient ? "gradient-text" : "")
                }
                style={{
                  ...r.textStyle,
                  textShadow: r.glow,
                }}
              >
                {e.number.toLocaleString()}
              </div>
              <div
                className="text-[9px] font-bold tracking-[0.18em]"
                style={{ color: r.badgeText }}
              >
                {r.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BossBoard({
  entries,
  currentUser,
}: {
  entries: BossLeaderEntry[];
  currentUser: string;
}) {
  const sorted = [...entries].sort((a, b) => b.bossKills - a.bossKills);

  if (sorted.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 text-center text-sm text-zinc-500">
        No boss kills recorded yet. Reach level 50 and start fighting bosses!
      </div>
    );
  }

  const highestBossName = (defeatedBosses: string[]) => {
    if (!defeatedBosses.length) return "—";
    const ordered = BOSSES.map((b) => b.id);
    let highest = defeatedBosses[0];
    for (const id of defeatedBosses) {
      if (ordered.indexOf(id) > ordered.indexOf(highest)) highest = id;
    }
    return BOSS_BY_ID[highest]?.name ?? highest;
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-[11px] font-extrabold tracking-[0.22em] text-zinc-400">
        TOP BOSS SLAYERS
      </h2>
      {sorted.map((e, i) => {
        const isMe = e.username.toLowerCase() === currentUser.toLowerCase();
        const rank = i + 1;
        const rankColor =
          rank === 1 ? "text-red-300" : rank === 2 ? "text-orange-300" : rank === 3 ? "text-amber-500" : "text-zinc-500";
        return (
          <div
            key={e.username}
            className={
              "flex items-center gap-3 rounded-xl border p-2.5 " +
              (isMe
                ? "border-red-500/40 bg-red-500/5"
                : "border-zinc-800 bg-zinc-950/60")
            }
          >
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-extrabold ${rankColor}`}>
              {rank === 1 ? "☠" : rank === 2 ? "⚔" : rank === 3 ? "🗡" : rank}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-sm font-extrabold text-zinc-100">
                  {e.username}
                </span>
                <span className="rounded-full border border-red-500/30 bg-red-500/10 px-1.5 py-0.5 text-[9px] font-bold text-red-300">
                  {e.bossKills} kills
                </span>
              </div>
              <div className="text-[10px] text-zinc-500">
                Highest: {highestBossName(e.defeatedBosses)} · {e.defeatedBosses.length}/10 unique bosses
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl">⚔</div>
              <div className="text-[9px] font-bold tracking-wide text-red-400">
                SLAYER
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
