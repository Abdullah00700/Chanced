import { useEffect, useRef, useState } from "react";
import { BoosterBar } from "../components/BoosterBar";
import { StatCard } from "../components/StatCard";
import { chancePctFromProb, formatNumber } from "../lib/format";
import {
  isGradientRarity,
  rarityFor,
  RARITY_BY_KEY,
  type RarityDef,
} from "../lib/rarity";
import type { Profile, RollResult } from "../lib/types";

export function RollView({
  profile,
  rolling,
  displayNumber,
  lastResult,
  onRoll,
  rollSpeedMult,
  now,
}: {
  profile: Profile;
  rolling: boolean;
  displayNumber: number;
  lastResult: RollResult | null;
  onRoll: () => void;
  rollSpeedMult: number;
  now: number;
}) {
  const lastRarity: RarityDef | null = lastResult
    ? RARITY_BY_KEY[lastResult.rarity]
    : null;
  const bestR =
    profile.bestNumber != null ? rarityByNumber(profile.bestNumber) : null;
  const worstR =
    profile.worstNumber != null ? rarityByNumber(profile.worstNumber) : null;
  const rarestR =
    profile.rarestNumber != null
      ? rarityByNumber(profile.rarestNumber)
      : null;

  const isGradient = lastRarity ? isGradientRarity(lastRarity.key) : false;
  const showCenter = rolling || lastResult != null;

  const [floats, setFloats] = useState<
    {
      id: number;
      coins: number;
      xp: number;
    }[]
  >([]);
  const idRef = useRef(0);
  useEffect(() => {
    if (!lastResult) return;
    const id = ++idRef.current;
    setFloats((f) => [
      ...f,
      { id, coins: lastResult.coinsEarned, xp: lastResult.xpEarned },
    ]);
    const t = setTimeout(
      () => setFloats((f) => f.filter((x) => x.id !== id)),
      1400,
    );
    return () => clearTimeout(t);
  }, [lastResult]);

  return (
    <div className="flex flex-col gap-3 pb-4">
      <BoosterBar
        coinUntil={profile.boosters.coinUntil}
        rarityUntil={profile.boosters.rarityUntil}
        now={now}
      />

      {/* Stats grid moved ABOVE the roll panel per user request */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard
          label="Closest"
          number={profile.bestNumber}
          prob={profile.bestProb}
          rarity={bestR}
        />
        <StatCard
          label="Furthest"
          number={profile.worstNumber}
          prob={profile.worstProb}
          rarity={worstR}
        />
        <StatCard
          label="Rarest"
          number={profile.rarestNumber}
          prob={profile.rarestProb}
          rarity={rarestR}
        />
      </div>

      {/* Roll display panel */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 p-6 shadow-2xl">
        <div
          className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-500"
          style={{
            background: lastRarity
              ? `radial-gradient(circle at center, ${lastRarity.auraColor} 0%, transparent 70%)`
              : "transparent",
          }}
        />
        <div className="relative flex min-h-[180px] flex-col items-center justify-center">
          {!showCenter ? (
            <div className="text-center">
              <div className="text-5xl font-extrabold text-zinc-700">?</div>
              <div className="mt-2 text-xs uppercase tracking-widest text-zinc-600">
                Tap to roll
              </div>
            </div>
          ) : (
            <>
              <div
                className={
                  "text-center text-7xl font-black tabular-nums leading-none " +
                  (isGradient ? "gradient-text" : "")
                }
                style={{
                  ...(lastRarity?.textStyle ?? { color: "#e5e7eb" }),
                  textShadow: rolling
                    ? "0 0 12px rgba(255,255,255,0.4)"
                    : (lastRarity?.glow ?? "none"),
                  animation: rolling
                    ? `flicker ${Math.max(80, 180 * rollSpeedMult)}ms ease-in-out infinite`
                    : "none",
                }}
              >
                {displayNumber.toLocaleString()}
              </div>
              {!rolling && lastResult && lastRarity && (
                <div className="mt-3 flex flex-col items-center gap-1.5 fade-in">
                  <span
                    className="rounded-full px-3 py-1 text-[11px] font-extrabold tracking-[0.22em]"
                    style={{
                      background: lastRarity.badgeBg,
                      color: lastRarity.badgeText,
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {lastRarity.label}
                  </span>
                  <div className="text-[11px] tabular-nums text-zinc-400">
                    {chancePctFromProb(lastResult.prob)} chance
                  </div>
                </div>
              )}
            </>
          )}
          {/* Floating reward popups */}
          <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-2">
            {floats.map((f, i) => (
              <div
                key={f.id}
                className="absolute fade-in text-xs font-bold"
                style={{
                  bottom: 8,
                  transform: `translateY(${-i * 18}px)`,
                  animation: "floatUp 1.2s ease-out forwards",
                }}
              >
                <span className="mr-2 text-amber-300">
                  +{formatNumber(f.coins)}◎
                </span>
                <span className="text-sky-300">+{formatNumber(f.xp)} xp</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROLL button moved BELOW the panel per user request */}
      <button
        onClick={onRoll}
        disabled={rolling}
        className={
          "select-none rounded-2xl border border-amber-400/30 px-6 py-5 text-lg font-extrabold tracking-wider shadow-lg transition active:scale-[0.98] " +
          (rolling
            ? "bg-zinc-800 text-zinc-500"
            : "bg-gradient-to-b from-amber-400 to-orange-500 text-zinc-950 active:from-amber-500 active:to-orange-600")
        }
        style={{
          boxShadow: rolling
            ? "none"
            : "0 8px 28px rgba(251,146,60,0.35), inset 0 1px 0 rgba(255,255,255,0.4)",
        }}
      >
        {rolling ? "ROLLING…" : "ROLL"}
      </button>

      {/* Per-rarity tally */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
        <div className="mb-2 text-[10px] uppercase tracking-widest text-zinc-500">
          Rolls by rarity
        </div>
        <div className="grid grid-cols-3 gap-1.5 text-[11px]">
          {(Object.keys(profile.rollsByRarity) as Array<keyof typeof profile.rollsByRarity>).map(
            (k) => {
              const r = RARITY_BY_KEY[k];
              return (
                <div
                  key={k}
                  className="flex items-center justify-between rounded-md border border-zinc-800/60 bg-zinc-900/40 px-1.5 py-1"
                >
                  <span
                    className="truncate font-bold"
                    style={{
                      color: r.badgeText,
                    }}
                  >
                    {r.label}
                  </span>
                  <span className="font-mono text-zinc-300">
                    {profile.rollsByRarity[k]}
                  </span>
                </div>
              );
            },
          )}
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
          <span>Total rolls</span>
          <span className="font-mono text-zinc-300">{profile.totalRolls}</span>
        </div>
      </div>
    </div>
  );
}

function rarityByNumber(n: number): RarityDef {
  return rarityFor(n);
}
