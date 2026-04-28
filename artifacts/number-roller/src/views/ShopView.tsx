import { EGGS } from "../lib/eggs";
import { formatNumber, formatTimeLeft } from "../lib/format";
import { MAX_REBIRTH, rebirthCost } from "../lib/rebirth";
import {
  COIN_BOOSTER_COST,
  COIN_BOOSTER_DURATION_MS,
  RARITY_BOOSTER_COST,
  RARITY_BOOSTER_DURATION_MS,
  XP_BOOSTER_COST,
  XP_BOOSTER_DURATION_MS,
  coinUpgradeCost,
  coinUpgradeMult,
  rarityUpgradeCost,
  rarityUpgradeTilt,
} from "../lib/shop";
import type { Profile } from "../lib/types";

export function ShopView({
  profile,
  now,
  onBuyCoinUpgrade,
  onBuyRarityUpgrade,
  onBuyCoinBooster,
  onBuyRarityBooster,
  onBuyXpBooster,
  onBuyEgg,
  onRebirth,
}: {
  profile: Profile;
  now: number;
  onBuyCoinUpgrade: () => void;
  onBuyRarityUpgrade: () => void;
  onBuyCoinBooster: () => void;
  onBuyRarityBooster: () => void;
  onBuyXpBooster: () => void;
  onBuyEgg: (eggId: string) => void;
  onRebirth: () => void;
}) {
  const coinUp = coinUpgradeCost(profile.upgrades.coin);
  const rarityUp = rarityUpgradeCost(profile.upgrades.rarity);
  const canCoin =
    profile.coins >= coinUp.coins && profile.gems >= coinUp.gems;
  const canRarity =
    profile.coins >= rarityUp.coins && profile.gems >= rarityUp.gems;

  const coinBoostLeft = Math.max(0, profile.boosters.coinUntil - now);
  const rarityBoostLeft = Math.max(0, profile.boosters.rarityUntil - now);
  const xpBoostLeft = Math.max(0, profile.boosters.xpUntil - now);
  const canCoinBoost = profile.coins >= COIN_BOOSTER_COST;
  const canRarityBoost = profile.coins >= RARITY_BOOSTER_COST;
  const canXpBoost = profile.coins >= XP_BOOSTER_COST;

  return (
    <div className="flex flex-col gap-3 pb-4">
      <SectionHeader title="UPGRADES" hint="Permanent" />

      <UpgradeCard
        title="Coin Multiplier"
        subtitle={`+20% coins per level`}
        statusLabel={`Level ${profile.upgrades.coin}`}
        currentLine={`Now: x${coinUpgradeMult(profile.upgrades.coin).toFixed(2)} → Next: x${coinUpgradeMult(profile.upgrades.coin + 1).toFixed(2)}`}
        costCoins={coinUp.coins}
        costGems={coinUp.gems}
        canBuy={canCoin}
        onBuy={onBuyCoinUpgrade}
        accent="amber"
      />

      <UpgradeCard
        title="Rarity Tilt"
        subtitle="Edges become more common"
        statusLabel={`Level ${profile.upgrades.rarity}`}
        currentLine={`Tilt: ${rarityUpgradeTilt(profile.upgrades.rarity).toFixed(2)} → Next: ${rarityUpgradeTilt(profile.upgrades.rarity + 1).toFixed(2)}`}
        costCoins={rarityUp.coins}
        costGems={rarityUp.gems}
        canBuy={canRarity}
        onBuy={onBuyRarityUpgrade}
        accent="fuchsia"
      />

      <SectionHeader title="BOOSTERS" hint="Temporary" />

      <BoosterCard
        title="2x Coins"
        subtitle={`${COIN_BOOSTER_DURATION_MS / 1000}s of doubled coin payouts`}
        active={coinBoostLeft > 0}
        timeLeft={coinBoostLeft}
        cost={COIN_BOOSTER_COST}
        canBuy={canCoinBoost}
        onBuy={onBuyCoinBooster}
        accent="amber"
      />

      <BoosterCard
        title="2x XP"
        subtitle={`${XP_BOOSTER_DURATION_MS / 1000}s of doubled XP gains`}
        active={xpBoostLeft > 0}
        timeLeft={xpBoostLeft}
        cost={XP_BOOSTER_COST}
        canBuy={canXpBoost}
        onBuy={onBuyXpBooster}
        accent="sky"
      />

      <BoosterCard
        title="Rarity Burst"
        subtitle={`${RARITY_BOOSTER_DURATION_MS / 1000}s of weighted rare rolls`}
        active={rarityBoostLeft > 0}
        timeLeft={rarityBoostLeft}
        cost={RARITY_BOOSTER_COST}
        canBuy={canRarityBoost}
        onBuy={onBuyRarityBooster}
        accent="fuchsia"
      />

      <SectionHeader title="EGGS" hint="Buy with gems" />
      <div className="grid grid-cols-2 gap-2">
        {EGGS.map((egg) => {
          const locked = (profile.rebirths ?? 0) < egg.rebirthRequired;
          const canAfford = profile.gems >= egg.cost;
          return (
            <div
              key={egg.id}
              className={
                "flex flex-col items-stretch gap-1.5 rounded-xl border bg-zinc-950/60 p-2.5 " +
                (locked ? "border-zinc-800 opacity-60" : "border-zinc-700/60")
              }
            >
              <div className="flex items-center gap-2">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base"
                  style={{
                    background: `radial-gradient(circle at 30% 25%, #fff8 0%, ${egg.color} 60%, #0008 100%)`,
                  }}
                >
                  <span style={{ color: "#0008", fontWeight: 900 }}>
                    {egg.symbol}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[11px] font-extrabold text-zinc-100">
                    {egg.name}
                  </div>
                  <div className="truncate text-[9px] text-zinc-500">
                    {Math.round(egg.hatchMs / 1000)}s hatch
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-zinc-400 line-clamp-2">
                {egg.flavor}
              </div>
              {locked ? (
                <div className="rounded-md bg-zinc-800 px-2 py-1 text-center text-[10px] font-extrabold text-rose-300">
                  Rebirth {egg.rebirthRequired}+ required
                </div>
              ) : (
                <button
                  onClick={() => onBuyEgg(egg.id)}
                  disabled={!canAfford}
                  className={
                    "rounded-md px-2 py-1 text-[11px] font-extrabold " +
                    (canAfford
                      ? "bg-violet-500 text-zinc-950 active:bg-violet-600"
                      : "bg-zinc-800 text-zinc-500")
                  }
                >
                  Buy · {egg.cost}✦
                </button>
              )}
            </div>
          );
        })}
      </div>

      <SectionHeader title="REBIRTH" hint="Permanent · resets coins" />
      <RebirthPanel profile={profile} onRebirth={onRebirth} />
    </div>
  );
}

function RebirthPanel({
  profile,
  onRebirth,
}: {
  profile: Profile;
  onRebirth: () => void;
}) {
  const cur = profile.rebirths ?? 0;
  const maxed = cur >= MAX_REBIRTH;
  const cost = maxed ? Number.POSITIVE_INFINITY : rebirthCost(cur);
  const canAfford = !maxed && profile.coins >= cost;
  return (
    <div className="rounded-xl border border-fuchsia-500/40 bg-gradient-to-br from-fuchsia-500/10 to-transparent p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-sm font-extrabold text-fuchsia-200">
            Rebirth {cur} {maxed ? "· MAX" : `→ ${cur + 1}`}
          </div>
          <div className="mt-1 text-[11px] text-zinc-400">
            Each rebirth: ×1.5 coins · ×2 XP · +0.05 rarity tilt (permanent &
            stacking). Coins reset to 0; pets, gems, level kept.
          </div>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1.5 text-[10px]">
        <Stat label="Coin ×" value={`×${Math.pow(1.5, cur).toFixed(2)}`} />
        <Stat label="XP ×" value={`×${Math.pow(2, cur).toFixed(2)}`} />
        <Stat label="Rarity +" value={`+${(cur * 0.05).toFixed(2)}`} />
      </div>
      <button
        onClick={onRebirth}
        disabled={!canAfford}
        className={
          "mt-2 w-full rounded-lg px-3 py-2 text-xs font-extrabold transition active:scale-[0.99] " +
          (canAfford
            ? "bg-fuchsia-500 text-zinc-50 active:bg-fuchsia-600"
            : "bg-zinc-800 text-zinc-500")
        }
      >
        {maxed
          ? "MAX REBIRTH"
          : `Rebirth · ${formatNumber(cost)}◎`}
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-zinc-950/60 px-1.5 py-1 text-zinc-300">
      <span className="text-[9px] uppercase tracking-widest text-zinc-500">
        {label}
      </span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

function SectionHeader({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="mt-1 flex items-center justify-between">
      <h2 className="text-[11px] font-extrabold tracking-[0.22em] text-zinc-400">
        {title}
      </h2>
      <span className="text-[10px] uppercase tracking-widest text-zinc-600">
        {hint}
      </span>
    </div>
  );
}

function UpgradeCard({
  title,
  subtitle,
  statusLabel,
  currentLine,
  costCoins,
  costGems,
  canBuy,
  onBuy,
  accent,
}: {
  title: string;
  subtitle: string;
  statusLabel: string;
  currentLine: string;
  costCoins: number;
  costGems: number;
  canBuy: boolean;
  onBuy: () => void;
  accent: "amber" | "fuchsia";
}) {
  const ringColor =
    accent === "amber" ? "border-amber-500/30" : "border-fuchsia-500/30";
  return (
    <div
      className={
        "rounded-xl border bg-zinc-950/70 p-3 shadow-sm " + ringColor
      }
    >
      <div className="mb-1 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-sm font-extrabold text-zinc-100">{title}</div>
          <div className="text-[11px] text-zinc-500">{subtitle}</div>
        </div>
        <span
          className={
            "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold " +
            (accent === "amber"
              ? "bg-amber-500/15 text-amber-300"
              : "bg-fuchsia-500/15 text-fuchsia-300")
          }
        >
          {statusLabel}
        </span>
      </div>
      <div className="mb-2 text-[11px] text-zinc-400">{currentLine}</div>
      <button
        onClick={onBuy}
        disabled={!canBuy}
        className={
          "w-full rounded-lg px-3 py-2 text-xs font-bold transition active:scale-[0.99] " +
          (canBuy
            ? accent === "amber"
              ? "bg-amber-500 text-zinc-950 active:bg-amber-600"
              : "bg-fuchsia-500 text-zinc-50 active:bg-fuchsia-600"
            : "bg-zinc-800 text-zinc-500")
        }
      >
        Upgrade · {formatNumber(costCoins)}◎
        {costGems > 0 && (
          <span className="ml-1.5 text-violet-200/90">
            + {formatNumber(costGems)}✦
          </span>
        )}
      </button>
    </div>
  );
}

function BoosterCard({
  title,
  subtitle,
  active,
  timeLeft,
  cost,
  canBuy,
  onBuy,
  accent,
}: {
  title: string;
  subtitle: string;
  active: boolean;
  timeLeft: number;
  cost: number;
  canBuy: boolean;
  onBuy: () => void;
  accent: "amber" | "fuchsia" | "sky";
}) {
  const ringColor =
    accent === "amber"
      ? "border-amber-500/30"
      : accent === "sky"
        ? "border-sky-500/30"
        : "border-fuchsia-500/30";
  const btnColor =
    accent === "amber"
      ? "bg-amber-500 text-zinc-950 active:bg-amber-600"
      : accent === "sky"
        ? "bg-sky-500 text-zinc-950 active:bg-sky-600"
        : "bg-fuchsia-500 text-zinc-50 active:bg-fuchsia-600";
  const chipColor =
    accent === "amber"
      ? "bg-amber-500/15 text-amber-300"
      : accent === "sky"
        ? "bg-sky-500/15 text-sky-300"
        : "bg-fuchsia-500/15 text-fuchsia-300";
  return (
    <div className={"rounded-xl border bg-zinc-950/70 p-3 " + ringColor}>
      <div className="mb-1 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-sm font-extrabold text-zinc-100">{title}</div>
          <div className="text-[11px] text-zinc-500">{subtitle}</div>
        </div>
        {active && (
          <span
            className={
              "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold " +
              chipColor
            }
          >
            {formatTimeLeft(timeLeft)}
          </span>
        )}
      </div>
      <button
        onClick={onBuy}
        disabled={!canBuy}
        className={
          "mt-1 w-full rounded-lg px-3 py-2 text-xs font-bold transition active:scale-[0.99] " +
          (canBuy ? btnColor : "bg-zinc-800 text-zinc-500")
        }
      >
        {active ? "Extend" : "Activate"} · {formatNumber(cost)}◎
      </button>
    </div>
  );
}
