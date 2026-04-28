import { useMemo, useState } from "react";
import { PetArt } from "../components/PetArt";
import { formatNumber } from "../lib/format";
import { petCurrentRarity, PETS } from "../lib/pets";
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
  onBuyExtraSlot,
  extraSlotCost,
}: {
  profile: Profile;
  onEquip: (id: string | null, slot?: number) => void;
  onBuyPet: (id: string) => void;
  onBuyExtraSlot: () => void;
  extraSlotCost: (currentExtra: number) => number;
}) {
  const [filter, setFilter] = useState<RarityKey | "all">("all");

  const totalSlots = 1 + profile.extraSlots;
  const equippedIds = profile.equippedPets;
  const equippedSet = new Set(equippedIds.filter((id): id is string => !!id));

  const visible = useMemo(() => {
    if (filter === "all") return PETS;
    return PETS.filter((p) => {
      const inst = profile.pets[p.id];
      const cur = inst ? petCurrentRarity(p, inst.level) : p.baseRarity;
      return cur === filter;
    });
  }, [filter, profile.pets]);

  return (
    <div className="flex flex-col gap-3 pb-4">
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
        <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-widest text-zinc-500">
          <span>Equipped Pets</span>
          <span className="text-zinc-600">
            {equippedSet.size} / {totalSlots} slot{totalSlots === 1 ? "" : "s"}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {Array.from({ length: totalSlots }).map((_, i) => {
            const id = equippedIds[i] ?? null;
            const def = id ? PETS.find((p) => p.id === id) ?? null : null;
            return (
              <div
                key={i}
                className={
                  "flex items-center gap-3 rounded-lg border p-2 " +
                  (def
                    ? "border-amber-500/30 bg-zinc-900/40"
                    : "border-dashed border-zinc-800 bg-zinc-950/40")
                }
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-zinc-950/60">
                  {def ? (
                    <PetArt art={def.art} size={44} />
                  ) : (
                    <span className="text-[10px] font-bold text-zinc-600">
                      SLOT {i + 1}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  {def ? (
                    <>
                      <div className="truncate text-sm font-extrabold text-zinc-100">
                        {def.name}
                      </div>
                      <div className="truncate text-[11px] text-zinc-400">
                        {def.flavor}
                      </div>
                    </>
                  ) : (
                    <div className="text-[11px] text-zinc-500">
                      Empty slot — equip a pet from below.
                    </div>
                  )}
                </div>
                {def && (
                  <button
                    onClick={() => onEquip(null, i)}
                    className="shrink-0 rounded-md border border-zinc-700/70 bg-zinc-900/60 px-2 py-1 text-[11px] font-semibold text-zinc-300 active:bg-zinc-800"
                  >
                    Unequip
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {profile.extraSlots < 2 && (
          <ExtraSlotBuy
            currentExtra={profile.extraSlots}
            gems={profile.gems}
            cost={extraSlotCost(profile.extraSlots)}
            onBuy={onBuyExtraSlot}
          />
        )}
      </div>

      <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-2.5 text-[10px] text-zinc-500">
        Tip: Pet upgrades and ability cooldowns are managed in the{" "}
        <span className="font-bold text-zinc-300">Inventory</span> tab.
      </div>

      {/* Filter chips */}
      <RarityFilter value={filter} onChange={setFilter} />

      <div className="grid grid-cols-1 gap-2">
        {visible.map((p) => {
          const inst = profile.pets[p.id];
          const owned = !!inst;
          const isEquipped = equippedSet.has(p.id);
          const curRarity = inst ? petCurrentRarity(p, inst.level) : p.baseRarity;
          const r = RARITY_BY_KEY[curRarity];
          const canAffordBuy =
            profile.coins >= p.costCoins && profile.gems >= p.costGems;
          const isShopBuyable =
            !owned && p.source !== "egg" && p.source !== "special";

          return (
            <div
              key={p.id}
              className={
                "rounded-xl border bg-zinc-950/60 p-3 " +
                (owned ? "border-amber-500/20" : "border-zinc-800")
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
                  ) : p.source === "special" ? (
                    <span className="rounded-md border border-rose-500/40 bg-rose-500/10 px-2 py-1.5 text-[10px] font-bold text-rose-300">
                      SPECIAL
                    </span>
                  ) : p.source === "egg" ? (
                    <span className="rounded-md border border-cyan-500/40 bg-cyan-500/10 px-2 py-1.5 text-[10px] font-bold text-cyan-300">
                      EGG-ONLY
                    </span>
                  ) : isShopBuyable ? (
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
                  ) : null}
                </div>
              </div>
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

function ExtraSlotBuy({
  currentExtra,
  gems,
  cost,
  onBuy,
}: {
  currentExtra: number;
  gems: number;
  cost: number;
  onBuy: () => void;
}) {
  const canAfford = gems >= cost;
  const slotNumber = currentExtra + 2;
  return (
    <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-violet-500/30 bg-violet-500/5 p-2">
      <div className="min-w-0">
        <div className="text-[11px] font-extrabold text-violet-200">
          Unlock Slot {slotNumber}
        </div>
        <div className="text-[10px] text-zinc-400">
          Equip another pet to stack their boosts.
        </div>
      </div>
      <button
        onClick={onBuy}
        disabled={!canAfford}
        className={
          "shrink-0 rounded-md px-2.5 py-1.5 text-[11px] font-extrabold " +
          (canAfford
            ? "bg-violet-500 text-zinc-950 active:bg-violet-600"
            : "bg-zinc-800 text-zinc-500")
        }
      >
        {cost}✦
      </button>
    </div>
  );
}
