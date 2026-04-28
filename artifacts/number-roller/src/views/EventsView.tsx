import { formatTimeLeft } from "../lib/format";
import {
  WEATHER_AUTO_INTERVAL_MS,
  WEATHER_BY_ID,
  WEATHER_EVENTS,
  WEATHER_MANUAL_COOLDOWN_MS,
} from "../lib/weather";
import type { Profile } from "../lib/types";

export function EventsView({
  profile,
  now,
  onTrigger,
}: {
  profile: Profile;
  now: number;
  onTrigger: (id: string) => void;
}) {
  const active = profile.weather.activeId
    ? WEATHER_BY_ID[profile.weather.activeId]
    : null;
  const activeLeft = Math.max(0, profile.weather.activeUntil - now);
  const nextAuto = Math.max(0, profile.weather.nextAutoAt - now);
  const cooldown = Math.max(0, profile.weather.manualCooldownUntil - now);

  void WEATHER_AUTO_INTERVAL_MS;

  return (
    <div className="flex flex-col gap-3 pb-4">
      {/* Active event card */}
      <div
        className="rounded-xl border p-3"
        style={{
          background: active
            ? `linear-gradient(135deg, ${active.color}30, transparent)`
            : "rgba(24,24,27,0.5)",
          borderColor: active ? active.color : "#27272a",
        }}
      >
        <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
          Active weather
        </div>
        {active ? (
          <>
            <div className="mt-1 flex items-center gap-2">
              <span
                className="text-2xl"
                style={{ color: active.color, textShadow: `0 0 8px ${active.color}` }}
              >
                {active.glyph}
              </span>
              <div className="flex-1">
                <div className="text-base font-extrabold text-zinc-100">
                  {active.name}
                </div>
                <div className="text-[11px] text-zinc-400">{active.flavor}</div>
              </div>
              <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-bold text-zinc-200">
                {formatTimeLeft(activeLeft)}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {active.effects.coinMult && (
                <Chip label={`Coins ×${active.effects.coinMult}`} />
              )}
              {active.effects.xpMult && (
                <Chip label={`XP ×${active.effects.xpMult}`} />
              )}
              {active.effects.rarityTilt && (
                <Chip label={`Rarity +${active.effects.rarityTilt}`} />
              )}
              {active.effects.rollSpeedMult && (
                <Chip
                  label={`Roll ${active.effects.rollSpeedMult < 1 ? "faster" : "slower"} ×${active.effects.rollSpeedMult}`}
                />
              )}
            </div>
          </>
        ) : (
          <div className="mt-1 text-[12px] text-zinc-500">
            No active weather right now. Trigger one below or wait —
            next auto event in {formatTimeLeft(nextAuto)}.
          </div>
        )}
      </div>

      {/* Manual trigger */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
              Trigger manually
            </div>
            <div className="text-[11px] text-zinc-500">
              Pick any event to start it now.
              {cooldown > 0
                ? ` Cooldown: ${formatTimeLeft(cooldown)}`
                : " Ready."}
              {" Manual cooldown: " +
                Math.round(WEATHER_MANUAL_COOLDOWN_MS / 60_000) +
                "m"}
            </div>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {WEATHER_EVENTS.map((w) => {
            const disabled = cooldown > 0 || profile.weather.activeId === w.id;
            return (
              <button
                key={w.id}
                onClick={() => onTrigger(w.id)}
                disabled={disabled}
                className={
                  "flex items-center gap-2 rounded-lg border p-2 text-left transition active:scale-[0.98] " +
                  (disabled
                    ? "cursor-not-allowed border-zinc-800 bg-zinc-900/30 opacity-50"
                    : "border-zinc-700/70 bg-zinc-900/50 active:bg-zinc-900")
                }
                style={
                  !disabled
                    ? {
                        boxShadow: `inset 0 0 0 1px ${w.color}30`,
                      }
                    : undefined
                }
              >
                <span
                  className="text-lg"
                  style={{ color: w.color, textShadow: `0 0 6px ${w.color}88` }}
                >
                  {w.glyph}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[11px] font-extrabold text-zinc-100">
                    {w.name}
                  </div>
                  <div className="truncate text-[9px] text-zinc-500">
                    {Math.round(w.durationMs / 1000)}s · {w.flavor}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-2.5 text-[10px] text-zinc-500">
        Auto events fire every{" "}
        {Math.round(WEATHER_AUTO_INTERVAL_MS / 60_000)} minutes regardless of
        activity. Effects apply globally to your rolls while active.
      </div>
    </div>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-zinc-900/80 px-2 py-0.5 text-[10px] font-bold text-zinc-200">
      {label}
    </span>
  );
}
