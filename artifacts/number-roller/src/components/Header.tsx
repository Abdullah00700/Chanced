import { formatCompact } from "../lib/format";
import { xpForNextLevel } from "../lib/level";
import type { Profile } from "../lib/types";

export function Header({
  profile,
  muted,
  onToggleMute,
  onOpenSave,
  onOpenWipe,
  onLogout,
}: {
  profile: Profile;
  muted: boolean;
  onToggleMute: () => void;
  onOpenSave: () => void;
  onOpenWipe: () => void;
  onLogout: () => void;
}) {
  const need = xpForNextLevel(profile.level);
  const pct = Math.min(100, (profile.xp / need) * 100);

  return (
    <header className="sticky top-0 z-30 -mx-3 mb-3 border-b border-zinc-800/80 bg-[#0d0e14]/85 px-3 pb-2 pt-3 backdrop-blur-md">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-base font-extrabold tracking-tight text-white">
              {profile.username}
            </h1>
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-300">
              LV {profile.level}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-[width] duration-500"
                style={{ width: pct + "%" }}
              />
            </div>
            <span className="shrink-0 text-[10px] tabular-nums text-zinc-500">
              {formatCompact(profile.xp)}/{formatCompact(need)}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={onToggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className="rounded-md border border-zinc-700/70 bg-zinc-900/60 px-2 py-1.5 text-xs text-zinc-300 active:bg-zinc-800"
          >
            {muted ? "🔇" : "🔊"}
          </button>
          <button
            onClick={onOpenSave}
            className="rounded-md border border-zinc-700/70 bg-zinc-900/60 px-2 py-1.5 text-[11px] font-semibold text-zinc-300 active:bg-zinc-800"
          >
            Save
          </button>
          <button
            onClick={onOpenWipe}
            className="rounded-md border border-rose-700/40 bg-rose-950/40 px-2 py-1.5 text-[11px] font-semibold text-rose-300 active:bg-rose-900/40"
          >
            Wipe
          </button>
          <button
            onClick={onLogout}
            className="rounded-md border border-zinc-700/70 bg-zinc-900/60 px-2 py-1.5 text-[11px] font-semibold text-zinc-300 active:bg-zinc-800"
          >
            Out
          </button>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="flex items-center justify-between rounded-md border border-amber-500/20 bg-amber-500/5 px-2 py-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-300/80">
            COINS
          </span>
          <span className="font-mono text-sm font-bold text-amber-300">
            {profile.coins.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-md border border-violet-500/25 bg-violet-500/5 px-2 py-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-violet-300/80">
            GEMS
          </span>
          <span className="font-mono text-sm font-bold text-violet-300">
            {profile.gems.toLocaleString()}
          </span>
        </div>
      </div>
    </header>
  );
}
