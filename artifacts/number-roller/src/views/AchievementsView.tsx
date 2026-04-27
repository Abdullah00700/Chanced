import { ACHIEVEMENTS } from "../lib/achievements";
import { formatNumber } from "../lib/format";
import type { Profile } from "../lib/types";

export function AchievementsView({ profile }: { profile: Profile }) {
  const total = ACHIEVEMENTS.length;
  const unlocked = ACHIEVEMENTS.filter(
    (a) => profile.achievements[a.id],
  ).length;

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

      <div className="grid grid-cols-1 gap-2">
        {ACHIEVEMENTS.map((a) => {
          const unlockedAt = profile.achievements[a.id];
          const isUnlocked = !!unlockedAt;
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
                <div className="min-w-0">
                  <div
                    className={
                      "flex items-center gap-1.5 truncate text-sm font-extrabold " +
                      (isUnlocked ? "text-amber-200" : "text-zinc-300")
                    }
                  >
                    <span>{isUnlocked ? "★" : "☆"}</span>
                    <span className="truncate">{a.name}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400">
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
