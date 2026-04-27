import { useMemo, useState } from "react";
import { ACHIEVEMENTS, type AchievementRarity } from "../lib/achievements";
import { formatNumber } from "../lib/format";
import { isGradientRarity, RARITY_BY_KEY } from "../lib/rarity";
import type { Profile } from "../lib/types";

const FILTERS: Array<AchievementRarity | "all"> = [
  "all",
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "mythic",
  "unobtainable",
];

export function AchievementsView({ profile }: { profile: Profile }) {
  const [filter, setFilter] = useState<AchievementRarity | "all">("all");
  const total = ACHIEVEMENTS.length;
  const unlocked = ACHIEVEMENTS.filter(
    (a) => profile.achievements[a.id],
  ).length;

  const visible = useMemo(() => {
    if (filter === "all") return ACHIEVEMENTS;
    return ACHIEVEMENTS.filter((a) => a.rarity === filter);
  }, [filter]);

  return (
    <div className="flex flex-col gap-3 pb-4">
      <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/70 px-3 py-2">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-zinc-500">
            Progress
          </div>
          <div className="text-lg font-extrabold text-zinc-100">
            {unlocked} / {total}
          </div>
        </div>
        <div className="h-2 w-32 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
            style={{ width: ((unlocked / total) * 100).toFixed(0) + "%" }}
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="-mx-1 flex flex-wrap gap-1.5 px-1">
        {FILTERS.map((f) => {
          const r = f === "all" ? null : RARITY_BY_KEY[f as AchievementRarity];
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={
                "rounded-full border px-2.5 py-1 text-[10px] font-extrabold tracking-[0.14em] " +
                (active
                  ? "border-amber-500/60 bg-amber-500/15 text-amber-200"
                  : "border-zinc-800 bg-zinc-900/50 text-zinc-400 active:bg-zinc-900")
              }
              style={
                active && r
                  ? { color: r.badgeText, borderColor: "rgba(255,255,255,0.18)" }
                  : undefined
              }
            >
              {f === "all" ? "ALL" : r!.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-2">
        {visible.map((a) => {
          const unlockedAt = profile.achievements[a.id];
          const isUnlocked = !!unlockedAt;
          const r = RARITY_BY_KEY[a.rarity];
          return (
            <div
              key={a.id}
              className={
                "rounded-xl border p-3 " +
                (isUnlocked
                  ? "border-amber-500/30 bg-amber-500/5"
                  : "border-zinc-800 bg-zinc-950/60")
              }
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={
                        "text-base " +
                        (isUnlocked ? "text-amber-300" : "text-zinc-600")
                      }
                    >
                      {isUnlocked ? "★" : "☆"}
                    </span>
                    <span
                      className={
                        "truncate text-sm font-extrabold " +
                        (isUnlocked ? "text-amber-200" : "text-zinc-300")
                      }
                    >
                      {a.name}
                    </span>
                    <span
                      className={
                        "shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold tracking-[0.18em] " +
                        (isGradientRarity(r.key) ? "gradient-text" : "")
                      }
                      style={{ background: r.badgeBg, color: r.badgeText }}
                    >
                      {r.label}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-zinc-400">
                    {a.description}
                  </div>
                </div>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10px] font-bold">
                {a.reward.coins > 0 && (
                  <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-amber-300">
                    +{formatNumber(a.reward.coins)}◎
                  </span>
                )}
                {a.reward.xp > 0 && (
                  <span className="rounded-full bg-sky-500/15 px-1.5 py-0.5 text-sky-300">
                    +{formatNumber(a.reward.xp)} xp
                  </span>
                )}
                {a.reward.gems > 0 && (
                  <span className="rounded-full bg-violet-500/15 px-1.5 py-0.5 text-violet-300">
                    +{formatNumber(a.reward.gems)}✦
                  </span>
                )}
                {a.reward.petId && (
                  <span className="rounded-full bg-rose-500/15 px-1.5 py-0.5 text-rose-300">
                    + Unobtainable Pet
                  </span>
                )}
              </div>
            </div>
          );
        })}
        {visible.length === 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 text-center text-sm text-zinc-500">
            No achievements at this rarity.
          </div>
        )}
      </div>
    </div>
  );
}
