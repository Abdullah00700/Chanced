import { formatNumber, formatTimeLeft } from "../lib/format";
import {
  COIN_BOOSTER_COST,
  COIN_BOOSTER_DURATION_MS,
  RARITY_BOOSTER_COST,
  RARITY_BOOSTER_DURATION_MS,
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
}: {
  profile: Profile;
  now: number;
  onBuyCoinUpgrade: () => void;
  onBuyRarityUpgrade: () => void;
  onBuyCoinBooster: () => void;
  onBuyRarityBooster: () => void;
}) {
  const coinUp = coinUpgradeCost(profile.upgrades.coin);
  const rarityUp = rarityUpgradeCost(profile.upgrades.rarity);
  const canCoin =
    profile.coins >= coinUp.coins && profile.gems >= coinUp.gems;
  const canRarity =
    profile.coins >= rarityUp.coins && profile.gems >= rarityUp.gems;

  const coinBoostLeft = Math.max(0, profile.boosters.coinUntil - now);
  const rarityBoostLeft = Math.max(0, profile.boosters.rarityUntil - now);
  const canCoinBoost = profile.coins >= COIN_BOOSTER_COST;
  const canRarityBoost = profile.coins >= RARITY_BOOSTER_COST;

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
        title="Rarity Burst"
        subtitle={`${RARITY_BOOSTER_DURATION_MS / 1000}s of weighted rare rolls`}
        active={rarityBoostLeft > 0}
        timeLeft={rarityBoostLeft}
        cost={RARITY_BOOSTER_COST}
        canBuy={canRarityBoost}
        onBuy={onBuyRarityBooster}
        accent="fuchsia"
      />
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
  accent: "amber" | "fuchsia";
}) {
  const ringColor =
    accent === "amber" ? "border-amber-500/30" : "border-fuchsia-500/30";
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
              (accent === "amber"
                ? "bg-amber-500/15 text-amber-300"
                : "bg-fuchsia-500/15 text-fuchsia-300")
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
          (canBuy
            ? accent === "amber"
              ? "bg-amber-500 text-zinc-950 active:bg-amber-600"
              : "bg-fuchsia-500 text-zinc-50 active:bg-fuchsia-600"
            : "bg-zinc-800 text-zinc-500")
        }
      >
        {active ? "Extend" : "Activate"} · {formatNumber(cost)}◎
      </button>
    </div>
  );
}
