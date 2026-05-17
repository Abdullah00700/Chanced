import { useEffect, useRef, useState } from "react";
import {
  formatCooldown,
  gachaCooldownMs,
  GACHA_COOLDOWN_MS,
  GACHA_POOL,
  GACHA_SPIN_COST,
  type GachaResult,
} from "../lib/gacha";
import { PET_BY_ID } from "../lib/pets";
import { RARITY_BY_KEY } from "../lib/rarity";
import type { Profile } from "../lib/types";

const RARITY_COLOR: Record<string, string> = {
  common:       "from-zinc-600 to-zinc-500 border-zinc-500",
  uncommon:     "from-emerald-700 to-emerald-500 border-emerald-400",
  rare:         "from-blue-700 to-blue-400 border-blue-300",
  epic:         "from-purple-700 to-purple-400 border-purple-300",
  legendary:    "from-amber-600 to-yellow-400 border-yellow-300",
  mythic:       "from-rose-700 to-pink-400 border-pink-300",
  unobtainable: "from-fuchsia-700 to-fuchsia-400 border-fuchsia-300",
};

const RARITY_GLOW: Record<string, string> = {
  common:    "shadow-zinc-500/30",
  uncommon:  "shadow-emerald-400/40",
  rare:      "shadow-blue-400/50",
  epic:      "shadow-purple-400/60",
  legendary: "shadow-yellow-400/70",
  mythic:    "shadow-pink-400/80",
};

const CAPSULE_EMOJIS = ["◈", "◉", "◍", "◎", "⊛"];

type Phase = "idle" | "spinning" | "result";

export function GachaView({
  profile,
  onSpin,
}: {
  profile: Profile;
  onSpin: () => GachaResult | null;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<GachaResult | null>(null);
  const [capsuleIdx, setCapsuleIdx] = useState(0);
  const [cooldownLeft, setCooldownLeft] = useState(() =>
    gachaCooldownMs(profile.lastGachaSpin ?? 0),
  );
  const [showPool, setShowPool] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Update cooldown display
  useEffect(() => {
    const update = () => setCooldownLeft(gachaCooldownMs(profile.lastGachaSpin ?? 0));
    update();
    const id = setInterval(update, 1_000);
    return () => clearInterval(id);
  }, [profile.lastGachaSpin]);

  // Capsule spin animation
  useEffect(() => {
    if (phase !== "spinning") return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setCapsuleIdx((c) => (c + 1) % CAPSULE_EMOJIS.length);
      if (i >= 16) {
        clearInterval(id);
        const r = onSpin();
        setResult(r);
        setPhase(r ? "result" : "idle");
      }
    }, 120);
    timerRef.current = id;
    return () => clearInterval(id);
  }, [phase, onSpin]);

  function handleSpin() {
    if (phase !== "idle") return;
    if (cooldownLeft > 0) return;
    if (profile.coins < GACHA_SPIN_COST) return;
    setResult(null);
    setPhase("spinning");
  }

  const canSpin = cooldownLeft === 0 && profile.coins >= GACHA_SPIN_COST && phase === "idle";
  const notEnoughCoins = profile.coins < GACHA_SPIN_COST;

  const pctPool = GACHA_POOL.map((entry) => {
    const total = GACHA_POOL.reduce((s, e) => s + e.weight, 0);
    const pct = ((entry.weight / total) * 100).toFixed(0);
    if (entry.kind === "coins") {
      return { label: `Coins (1k–20k)`, pct, rarity: null };
    }
    const def = PET_BY_ID[entry.petId];
    return { label: def?.name ?? entry.petId, pct, rarity: def?.baseRarity ?? "common" };
  });

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="text-center">
        <div className="text-[11px] uppercase tracking-[0.3em] text-amber-300 font-bold">
          GACHA MACHINE
        </div>
        <div className="mt-0.5 text-xs text-zinc-500">
          Spin for exclusive pets &amp; coin jackpots
        </div>
      </div>

      {/* Machine visual */}
      <div className="relative mx-auto flex w-full max-w-xs flex-col items-center gap-3 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 px-4 py-5 shadow-xl shadow-amber-500/10">
        {/* Capsule display */}
        <div
          className={
            "flex h-28 w-28 items-center justify-center rounded-full border-4 text-6xl transition-all duration-100 " +
            (phase === "spinning"
              ? "border-amber-400 bg-amber-500/20 animate-pulse shadow-lg shadow-amber-400/50"
              : phase === "result" && result
                ? result.kind === "pet"
                  ? "border-purple-400 bg-purple-500/20 shadow-lg shadow-purple-400/40"
                  : "border-yellow-400 bg-yellow-500/20 shadow-lg shadow-yellow-400/40"
                : "border-zinc-700 bg-zinc-900/60")
          }
        >
          {phase === "spinning"
            ? CAPSULE_EMOJIS[capsuleIdx]
            : phase === "result" && result
              ? result.kind === "pet"
                ? "✦"
                : "🪙"
              : "◈"}
        </div>

        {/* Cost & cooldown */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5 text-sm font-bold text-amber-200">
            <span className="text-amber-400">🪙</span>
            {GACHA_SPIN_COST.toLocaleString()} coins per spin
          </div>
          {cooldownLeft > 0 && (
            <div className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900/60 px-3 py-1 text-xs font-bold text-zinc-300">
              ⏳ Cooldown: {formatCooldown(cooldownLeft)}
            </div>
          )}
        </div>

        {/* Spin button */}
        <button
          onClick={handleSpin}
          disabled={!canSpin}
          className={
            "w-full rounded-xl py-3 text-base font-extrabold shadow-md transition active:scale-[0.98] " +
            (canSpin
              ? "bg-gradient-to-b from-amber-400 to-orange-500 text-zinc-950"
              : "cursor-not-allowed bg-zinc-800 text-zinc-500")
          }
        >
          {phase === "spinning"
            ? "Spinning…"
            : cooldownLeft > 0
              ? `Wait ${formatCooldown(cooldownLeft)}`
              : notEnoughCoins
                ? `Need ${GACHA_SPIN_COST.toLocaleString()} coins`
                : "✦ SPIN"}
        </button>

        {/* Progress bar for cooldown */}
        {cooldownLeft > 0 && (
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-1000"
              style={{ width: `${(1 - cooldownLeft / GACHA_COOLDOWN_MS) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Result card */}
      {phase === "result" && result && (
        <div
          className={
            "mx-auto w-full max-w-xs overflow-hidden rounded-2xl border-2 bg-gradient-to-b shadow-xl " +
            (result.kind === "pet"
              ? (RARITY_COLOR[result.rarity] ?? RARITY_COLOR["common"]) +
                " " +
                (RARITY_GLOW[result.rarity] ?? "")
              : "from-yellow-700 to-yellow-500 border-yellow-300 shadow-yellow-400/50")
          }
        >
          <div className="flex flex-col items-center gap-2 p-5">
            <div className="text-4xl">
              {result.kind === "pet" ? "✦" : "🪙"}
            </div>
            <div className="text-center">
              {result.kind === "pet" ? (
                <>
                  <div className="text-[10px] uppercase tracking-widest text-white/70 font-bold">
                    {(RARITY_BY_KEY[result.rarity]?.label ?? result.rarity).toUpperCase()} PET
                  </div>
                  <div className="mt-0.5 text-xl font-extrabold text-white">
                    {result.name}
                  </div>
                  <div className="mt-1 text-[11px] text-white/70">
                    {PET_BY_ID[result.petId]?.flavor ?? "A rare gacha companion."}
                  </div>
                  {(profile.pets[result.petId]?.level ?? 0) > 0 && (
                    <div className="mt-2 rounded-full border border-white/30 bg-black/30 px-2 py-0.5 text-[10px] font-bold text-white/80">
                      Already owned — level bonus applied!
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="text-[10px] uppercase tracking-widest text-yellow-100/70 font-bold">
                    COIN JACKPOT
                  </div>
                  <div className="mt-0.5 text-2xl font-extrabold text-white">
                    +{result.amount.toLocaleString()} 🪙
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => setPhase("idle")}
              className="mt-1 rounded-lg border border-white/30 bg-black/30 px-4 py-1.5 text-xs font-bold text-white/80 active:bg-black/50"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Pool info */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
        <button
          onClick={() => setShowPool((s) => !s)}
          className="flex w-full items-center justify-between text-xs font-bold text-zinc-400"
        >
          <span>◈ Gacha Pool Chances</span>
          <span>{showPool ? "▲" : "▼"}</span>
        </button>
        {showPool && (
          <div className="mt-2 flex flex-col gap-1">
            {pctPool.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-300 font-semibold">{item.label}</span>
                <span className="text-amber-300 font-bold">{item.pct}%</span>
              </div>
            ))}
            <div className="mt-1.5 text-[10px] text-zinc-600">
              30-minute cooldown between spins. Duplicate pets give +1 level bonus.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
