import { chancePctFromProb } from "../lib/format";
import { isGradientRarity, RARITY_BY_KEY } from "../lib/rarity";
import type { LeaderEntry } from "../lib/types";

export function LeaderboardView({
  entries,
  currentUser,
}: {
  entries: LeaderEntry[];
  currentUser: string;
}) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 text-center text-sm text-zinc-500">
        No entries yet. Roll something rare to claim a spot.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 pb-4">
      <h2 className="text-[11px] font-extrabold tracking-[0.22em] text-zinc-400">
        RAREST ROLLS
      </h2>
      {entries.map((e, i) => {
        const r = RARITY_BY_KEY[e.rarity];
        const isMe = e.username.toLowerCase() === currentUser.toLowerCase();
        const isGradient = isGradientRarity(e.rarity);
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
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-extrabold text-zinc-300">
              {i + 1}
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
                {chancePctFromProb(e.prob)} chance
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
