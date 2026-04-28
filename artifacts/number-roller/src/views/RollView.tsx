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

const REEL_DIGIT_HEIGHT = 64; // px per digit in the reel strip
const REEL_STAGGER_MS = 140;

export function RollView({
  profile,
  rolling,
  displayNumber,
  lastResult,
  onRoll,
  rollSpeedMult,
  rollStartKey,
  now,
}: {
  profile: Profile;
  rolling: boolean;
  displayNumber: number;
  lastResult: RollResult | null;
  onRoll: () => void;
  rollSpeedMult: number;
  /** Increments each time a new roll begins — used to clear floats. */
  rollStartKey: number;
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

  // Floats: append on each new lastResult, but CLEAR them whenever a fresh
  // roll starts (rollStartKey bumps).
  const [floats, setFloats] = useState<
    {
      id: number;
      coins: number;
      xp: number;
    }[]
  >([]);
  const idRef = useRef(0);

  useEffect(() => {
    setFloats([]);
  }, [rollStartKey]);

  useEffect(() => {
    if (!lastResult) return;
    const id = ++idRef.current;
    setFloats((f) => [
      ...f,
      { id, coins: lastResult.coinsEarned, xp: lastResult.xpEarned },
    ]);
    const t = setTimeout(
      () => setFloats((f) => f.filter((x) => x.id !== id)),
      1800,
    );
    return () => clearTimeout(t);
  }, [lastResult]);

  // 5-digit slot reel target
  const targetNumber = lastResult?.number ?? displayNumber;
  const padded = String(Math.max(0, Math.min(99999, targetNumber))).padStart(
    5,
    "0",
  );
  const targetDigits = padded.split("").map((d) => parseInt(d, 10));

  return (
    <div className="flex flex-col gap-3 pb-4">
      <BoosterBar
        coinUntil={profile.boosters.coinUntil}
        rarityUntil={profile.boosters.rarityUntil}
        xpUntil={profile.boosters.xpUntil}
        now={now}
      />

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
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 p-5 shadow-2xl">
        <div
          className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-500"
          style={{
            background: lastRarity
              ? `radial-gradient(circle at center, ${lastRarity.auraColor} 0%, transparent 70%)`
              : "transparent",
          }}
        />
        <div className="relative flex min-h-[200px] flex-col items-center justify-center">
          {!showCenter ? (
            <div className="text-center">
              <div className="text-5xl font-extrabold text-zinc-700">?</div>
              <div className="mt-2 text-xs uppercase tracking-widest text-zinc-600">
                Tap to roll
              </div>
            </div>
          ) : (
            <>
              {/* Slot machine reels */}
              <div className="flex items-center justify-center gap-1.5">
                {targetDigits.map((d, i) => (
                  <SlotReel
                    key={i}
                    targetDigit={d}
                    spinning={rolling}
                    stopDelayMs={i * REEL_STAGGER_MS}
                    rollSpeedMult={rollSpeedMult}
                    rollStartKey={rollStartKey}
                    color={lastRarity?.textStyle ?? { color: "#e5e7eb" }}
                    isGradient={isGradient}
                    glow={lastRarity?.glow}
                  />
                ))}
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
                  animation: "floatUp 1.6s ease-out forwards",
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

/**
 * One vertical slot reel. While `spinning`, the strip translates upward
 * continuously. When `spinning` becomes false, the reel snaps to the
 * `targetDigit` after `stopDelayMs` so reels stop left-to-right.
 */
function SlotReel({
  targetDigit,
  spinning,
  stopDelayMs,
  rollSpeedMult,
  rollStartKey,
  color,
  isGradient,
  glow,
}: {
  targetDigit: number;
  spinning: boolean;
  stopDelayMs: number;
  rollSpeedMult: number;
  rollStartKey: number;
  color: React.CSSProperties;
  isGradient: boolean;
  glow?: string;
}) {
  const [stopped, setStopped] = useState(!spinning);

  useEffect(() => {
    if (spinning) {
      setStopped(false);
      return;
    }
    const t = setTimeout(() => setStopped(true), stopDelayMs);
    return () => clearTimeout(t);
  }, [spinning, stopDelayMs, rollStartKey]);

  // 0–9 repeated twice for seamless animation loop.
  const strip = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  ];

  const spinDuration = Math.max(0.18, 0.32 * rollSpeedMult);

  return (
    <div
      className="relative overflow-hidden rounded-md border border-zinc-700/70 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 shadow-inner"
      style={{
        width: 46,
        height: REEL_DIGIT_HEIGHT,
      }}
    >
      {/* Top/bottom gradient masks */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-3 bg-gradient-to-b from-zinc-950 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-3 bg-gradient-to-t from-zinc-950 to-transparent" />

      {stopped ? (
        <div
          className={
            "flex h-full w-full items-center justify-center text-5xl font-black tabular-nums " +
            (isGradient ? "gradient-text" : "")
          }
          style={{
            ...color,
            textShadow: glow ?? "none",
          }}
        >
          {targetDigit}
        </div>
      ) : (
        <div
          className="flex flex-col items-center"
          style={{
            animation: `slotSpin ${spinDuration}s linear infinite`,
          }}
        >
          {strip.map((d, i) => (
            <div
              key={i}
              className="flex shrink-0 items-center justify-center text-5xl font-black tabular-nums text-zinc-300"
              style={{ height: REEL_DIGIT_HEIGHT }}
            >
              {d}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function rarityByNumber(n: number): RarityDef {
  return rarityFor(n);
}
