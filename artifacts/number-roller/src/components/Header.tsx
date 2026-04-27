import { formatCompact } from "../lib/format";
import { xpForNextLevel } from "../lib/level";
import type { Profile } from "../lib/types";

export function Header({
  profile,
  muted,
  onToggleMute,
  onOpenMenu,
}: {
  profile: Profile;
  muted: boolean;
  onToggleMute: () => void;
  onOpenMenu: () => void;
}) {
  const need = xpForNextLevel(profile.level);
  const pct = Math.min(100, (profile.xp / need) * 100);

  return (
    <header className="sticky top-0 z-30 -mx-3 mb-3 border-b border-zinc-800/80 bg-[#0d0e14]/85 px-3 pb-2 pt-3 backdrop-blur-md">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-extrabold tracking-tight text-white">
            {profile.username}
          </h1>
          {/* Level bar: fills based on XP%, level number centered inside */}
          <div
            className="relative mt-1.5 h-6 w-full overflow-hidden rounded-full border border-amber-500/30 bg-zinc-900/70"
            aria-label={`Level ${profile.level}, ${Math.floor(pct)}% to next`}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-orange-500 transition-[width] duration-500"
              style={{
                width: pct + "%",
                boxShadow: "0 0 12px rgba(251,146,60,0.45)",
              }}
            />
            <div className="relative z-10 flex h-full items-center justify-between px-2.5 text-[10px] font-bold tabular-nums">
              <span className="text-amber-100/90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]">
                LV {profile.level}
              </span>
              <span className="text-amber-50/90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]">
                {formatCompact(profile.xp)} / {formatCompact(need)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={onToggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className="rounded-md border border-zinc-700/70 bg-zinc-900/60 px-2 py-1.5 text-xs text-zinc-300 active:bg-zinc-800"
          >
            {muted ? "🔇" : "🔊"}
          </button>
          <button
            onClick={onOpenMenu}
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-amber-500/40 bg-amber-500/10 text-amber-300 active:bg-amber-500/20"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden
            >
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="flex items-center justify-between rounded-md border border-amber-500/20 bg-amber-500/5 px-2 py-1.5">
          <span className="flex items-center gap-1.5">
            <CoinIcon />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-300/80">
              COINS
            </span>
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

function CoinIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden
      className="drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]"
    >
      <defs>
        <radialGradient id="coinGrad" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="55%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#b45309" />
        </radialGradient>
      </defs>
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="url(#coinGrad)"
        stroke="#78350f"
        strokeWidth="1"
      />
      <circle
        cx="12"
        cy="12"
        r="7"
        fill="none"
        stroke="#78350f"
        strokeWidth="0.8"
        opacity="0.5"
      />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fontSize="10"
        fontWeight="900"
        fill="#78350f"
        fontFamily="Inter, system-ui, sans-serif"
      >
        ¢
      </text>
    </svg>
  );
}
