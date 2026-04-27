import { useMemo, useState } from "react";
import { PetArt } from "../components/PetArt";
import { formatNumber } from "../lib/format";
import {
  effectiveEffect,
  evolutionInfo,
  isPetMaxed,
  petCurrentRarity,
  petUpgradeCost,
  PETS,
} from "../lib/pets";
import { isGradientRarity, RARITY_BY_KEY } from "../lib/rarity";
import type { Profile, RarityKey } from "../lib/types";

const FILTERS: Array<RarityKey | "all"> = [
  "all",
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "mythic",
  "unobtainable",
];

export function PetsView({
  profile,
  onEquip,
  onBuyPet,
  onUpgradePet,
}: {
  profile: Profile;
  onEquip: (id: string | null) => void;
  onBuyPet: (id: string) => void;
  onUpgradePet: (id: string) => void;
}) {
  const [filter, setFilter] = useState<RarityKey | "all">("all");

  const equipped = profile.equippedPet
    ? PETS.find((p) => p.id === profile.equippedPet) ?? null
    : null;

  const visible = useMemo(() => {
    if (filter === "all") return PETS;
    // Filter by *current* rarity for owned pets, base rarity otherwise.
    return PETS.filter((p) => {
      const inst = profile.pets[p.id];
      const cur = inst ? petCurrentRarity(p, inst.level) : p.baseRarity;
      return cur === filter;
    });
  }, [filter, profile.pets]);

  return (
    <div className="flex flex-col gap-3 pb-4">
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
        <div className="mb-1.5 text-[10px] uppercase tracking-widest text-zinc-500">
          Equipped
        </div>
        {equipped ? (
          <div className="flex items-center gap-3">
            <PetArt art={equipped.art} size={48} />
            <div className="min-w-0 flex-1">
              <div className="truncate font-extrabold text-zinc-100">
                {equipped.name}
              </div>
              <div className="text-[11px] text-zinc-400">{equipped.flavor}</div>
            </div>
            <button
              onClick={() => onEquip(null)}
              className="rounded-md border border-zinc-700/70 bg-zinc-900/60 px-2 py-1 text-[11px] font-semibold text-zinc-300 active:bg-zinc-800"
            >
              Unequip
            </button>
          </div>
        ) : (
          <div className="text-sm text-zinc-500">
            No pet equipped. Equip one for permanent boosts.
          </div>
        )}
      </div>

      {/* Filter chips */}
      <RarityFilter value={filter} onChange={setFilter} />

      <div className="grid grid-cols-1 gap-2">
        {visible.map((p) => {
          const inst = profile.pets[p.id];
          const owned = !!inst;
          const isEquipped = profile.equippedPet === p.id;
          const curRarity = inst ? petCurrentRarity(p, inst.level) : p.baseRarity;
          const r = RARITY_BY_KEY[curRarity];
          const canAffordBuy =
            profile.coins >= p.costCoins && profile.gems >= p.costGems;

          return (
            <div
              key={p.id}
              className={
                "rounded-xl border bg-zinc-950/60 p-3 " +
                (owned
                  ? "border-amber-500/20"
                  : "border-zinc-800")
              }
            >
              <div className="flex items-center gap-3">
                <PetArt art={p.art} size={48} dim={!owned} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="truncate font-extrabold text-zinc-100">
                      {p.name}
                    </span>
                    <span
                      className={
                        "shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold tracking-[0.18em] " +
                        (isGradientRarity(r.key) ? "gradient-text" : "")
                      }
                      style={{ background: r.badgeBg, color: r.badgeText }}
                    >
                      {r.label}
                    </span>
                    {owned && (
                      <span className="shrink-0 rounded-full border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-300">
                        LV {inst!.level}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-zinc-400">{p.flavor}</div>
                </div>
                <div className="shrink-0">
                  {owned ? (
                    <button
                      onClick={() => onEquip(isEquipped ? null : p.id)}
                      className={
                        "rounded-md px-2 py-1.5 text-[11px] font-bold " +
                        (isEquipped
                          ? "bg-amber-500 text-zinc-950"
                          : "border border-zinc-700/70 bg-zinc-900/60 text-zinc-200 active:bg-zinc-800")
                      }
                    >
                      {isEquipped ? "Equipped" : "Equip"}
                    </button>
                  ) : p.baseRarity === "unobtainable" ? (
                    <span className="rounded-md border border-rose-500/40 bg-rose-500/10 px-2 py-1.5 text-[10px] font-bold text-rose-300">
                      ACHIEVEMENT
                    </span>
                  ) : (
                    <button
                      onClick={() => onBuyPet(p.id)}
                      disabled={!canAffordBuy}
                      className={
                        "rounded-md px-2 py-1.5 text-[11px] font-bold " +
                        (canAffordBuy
                          ? "bg-emerald-500 text-zinc-950 active:bg-emerald-600"
                          : "bg-zinc-800 text-zinc-500")
                      }
                    >
                      {formatNumber(p.costCoins)}◎
                      {p.costGems > 0 && (
                        <span className="ml-1 text-violet-200/90">
                          +{p.costGems}✦
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Owned pet upgrade panel */}
              {owned && (
                <UpgradePanel
                  petId={p.id}
                  petLevel={inst!.level}
                  playerLevel={profile.level}
                  coins={profile.coins}
                  onUpgrade={() => onUpgradePet(p.id)}
                />
              )}
            </div>
          );
        })}
        {visible.length === 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 text-center text-sm text-zinc-500">
            No pets at this rarity yet.
          </div>
        )}
      </div>
    </div>
  );
}

function RarityFilter({
  value,
  onChange,
}: {
  value: RarityKey | "all";
  onChange: (v: RarityKey | "all") => void;
}) {
  return (
    <div className="-mx-1 flex flex-wrap gap-1.5 px-1">
      {FILTERS.map((f) => {
        const r = f === "all" ? null : RARITY_BY_KEY[f as RarityKey];
        const active = value === f;
        return (
          <button
            key={f}
            onClick={() => onChange(f)}
            className={
              "rounded-full border px-2.5 py-1 text-[10px] font-extrabold tracking-[0.14em] " +
              (active
                ? "border-amber-500/60 bg-amber-500/15 text-amber-200"
                : "border-zinc-800 bg-zinc-900/50 text-zinc-400 active:bg-zinc-900")
            }
            style={
              active && r
                ? { color: r.badgeText, borderColor: "rgba(255,255,255,0.18)" }
                : undefined
            }
          >
            {f === "all" ? "ALL" : r!.label}
          </button>
        );
      })}
    </div>
  );
}

function UpgradePanel({
  petId,
  petLevel,
  playerLevel,
  coins,
  onUpgrade,
}: {
  petId: string;
  petLevel: number;
  playerLevel: number;
  coins: number;
  onUpgrade: () => void;
}) {
  const def = PETS.find((p) => p.id === petId)!;
  const maxed = isPetMaxed(def, petLevel);
  const ev = evolutionInfo(def, { ownedAt: 0, level: petLevel }, playerLevel);
  const cost = maxed ? 0 : petUpgradeCost(def, petLevel);
  const canAfford = !maxed && coins >= cost;
  const currentEff = effectiveEffect(def, petLevel);
  const nextEff = maxed ? currentEff : effectiveEffect(def, petLevel + 1);

  // Block upgrades when reaching the next-tier threshold without meeting
  // player level requirement (the level-cap before evolution).
  const blocksAtTierEnd =
    !maxed &&
    !ev.maxed &&
    ev.next != null &&
    petLevel + 1 >= ev.petLevelNeeded &&
    playerLevel < ev.playerLevelNeeded;

  return (
    <div className="mt-3 rounded-lg border border-zinc-800 bg-zinc-900/40 p-2.5">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-zinc-500">
        <span>Upgrade slot</span>
        <span className="text-zinc-400">Pet LV {petLevel} → {petLevel + 1}</span>
      </div>
      <div className="mt-1 grid grid-cols-2 gap-2 text-[10px]">
        <Stat label="Coin mult" cur={currentEff.coinMult} next={nextEff.coinMult} unit="×" />
        <Stat label="XP mult" cur={currentEff.xpMult} next={nextEff.xpMult} unit="×" />
        <Stat
          label="Rarity tilt"
          cur={currentEff.rarityTilt}
          next={nextEff.rarityTilt}
          unit=""
          deltaPos
        />
        <Stat
          label="Roll speed"
          cur={currentEff.rollSpeedMult}
          next={nextEff.rollSpeedMult}
          unit="×"
          inverse
        />
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        {maxed ? (
          <div className="text-[10px] font-bold text-amber-300">
            MAX EVOLUTION
          </div>
        ) : blocksAtTierEnd ? (
          <div className="text-[10px] text-rose-300">
            Reach player LV {ev.playerLevelNeeded} to evolve to {ev.next?.toUpperCase()}
          </div>
        ) : ev.next && petLevel + 1 === ev.petLevelNeeded ? (
          <div className="text-[10px] font-bold text-emerald-300">
            ⚡ Next upgrade EVOLVES → {ev.next.toUpperCase()}
          </div>
        ) : (
          <div className="text-[10px] text-zinc-500">+0.5% per level</div>
        )}
        <button
          onClick={onUpgrade}
          disabled={maxed || !canAfford || blocksAtTierEnd}
          className={
            "shrink-0 rounded-md px-2.5 py-1.5 text-[11px] font-extrabold " +
            (maxed || blocksAtTierEnd
              ? "bg-zinc-800 text-zinc-500"
              : canAfford
                ? "bg-emerald-500 text-zinc-950 active:bg-emerald-600"
                : "bg-zinc-800 text-zinc-500")
          }
        >
          {maxed ? "MAX" : `${formatNumber(cost)}◎`}
        </button>
      </div>
    </div>
  );
}

function Stat({
  label,
  cur,
  next,
  unit,
  inverse,
  deltaPos,
}: {
  label: string;
  cur: number;
  next: number;
  unit: string;
  inverse?: boolean;
  deltaPos?: boolean;
}) {
  const better = inverse ? next < cur : next > cur;
  const fmt = (v: number) =>
    deltaPos ? v.toFixed(2) : (Math.round(v * 1000) / 1000).toFixed(3);
  return (
    <div className="flex items-center justify-between rounded-md bg-zinc-950/50 px-1.5 py-1 text-zinc-300">
      <span className="text-[9px] uppercase tracking-widest text-zinc-500">
        {label}
      </span>
      <span className="font-mono">
        {fmt(cur)}
        {unit}
        {Math.abs(next - cur) > 0.0005 && (
          <span className={"ml-1 " + (better ? "text-emerald-400" : "text-zinc-500")}>
            → {fmt(next)}
            {unit}
          </span>
        )}
      </span>
    </div>
  );
}
