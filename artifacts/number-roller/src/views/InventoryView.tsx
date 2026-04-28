import { useMemo, useState } from "react";
import { PetArt } from "../components/PetArt";
import { EGG_BY_ID, EGGS } from "../lib/eggs";
import { formatNumber } from "../lib/format";
import {
  effectiveEffect,
  evolutionInfo,
  isPetMaxed,
  PET_BY_ID,
  PETS,
  petCurrentRarity,
  petUpgradeCost,
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

export function InventoryView({
  profile,
  now,
  onUpgradePet,
  onEquip,
  onStartHatch,
  onClaimHatch,
  onCancelHatch,
}: {
  profile: Profile;
  now: number;
  onUpgradePet: (id: string) => void;
  onEquip: (id: string | null) => void;
  onStartHatch: (eggId: string) => void;
  onClaimHatch: () => void;
  onCancelHatch: () => void;
}) {
  const [filter, setFilter] = useState<RarityKey | "all">("all");

  const ownedPetIds = useMemo(
    () => Object.keys(profile.pets).sort((a, b) => {
      const pa = PET_BY_ID[a];
      const pb = PET_BY_ID[b];
      if (!pa || !pb) return 0;
      const ia = profile.pets[a];
      const ib = profile.pets[b];
      const ra = petCurrentRarity(pa, ia.level);
      const rb = petCurrentRarity(pb, ib.level);
      const order: RarityKey[] = ["unobtainable", "mythic", "legendary", "epic", "rare", "uncommon", "common"];
      const di = order.indexOf(ra) - order.indexOf(rb);
      if (di !== 0) return di;
      return pa.name.localeCompare(pb.name);
    }),
    [profile.pets],
  );

  const visiblePets = useMemo(() => {
    if (filter === "all") return ownedPetIds;
    return ownedPetIds.filter((id) => {
      const def = PET_BY_ID[id];
      if (!def) return false;
      return petCurrentRarity(def, profile.pets[id].level) === filter;
    });
  }, [ownedPetIds, filter, profile.pets]);

  const eggIdsOwned = Object.keys(profile.eggs).filter(
    (id) => (profile.eggs[id] ?? 0) > 0,
  );

  const equippedSet = new Set(
    profile.equippedPets.filter((id): id is string => !!id),
  );

  return (
    <div className="flex flex-col gap-3 pb-4">
      {/* Active hatch */}
      <HatchPanel
        profile={profile}
        now={now}
        onStartHatch={onStartHatch}
        onClaimHatch={onClaimHatch}
        onCancelHatch={onCancelHatch}
      />

      {/* Eggs grid */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
          Eggs ({eggIdsOwned.reduce((s, id) => s + (profile.eggs[id] ?? 0), 0)})
        </div>
        {eggIdsOwned.length === 0 ? (
          <div className="text-center text-[11px] text-zinc-500 py-3">
            No eggs yet. Buy some in the shop.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {eggIdsOwned.map((id) => {
              const def = EGG_BY_ID[id];
              if (!def) return null;
              const count = profile.eggs[id] ?? 0;
              const hatching = profile.hatch != null;
              return (
                <button
                  key={id}
                  onClick={() => !hatching && onStartHatch(id)}
                  disabled={hatching}
                  className={
                    "relative flex flex-col items-center gap-1 rounded-lg border bg-zinc-900/50 p-2 text-center transition active:scale-[0.98] " +
                    (hatching
                      ? "border-zinc-800 opacity-50"
                      : "border-zinc-700/70 active:bg-zinc-900")
                  }
                >
                  <EggGlyph color={def.color} symbol={def.symbol} />
                  <div className="text-[10px] font-extrabold text-zinc-100">
                    {def.name}
                  </div>
                  <div className="text-[9px] text-zinc-500">
                    ×{count}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Pets grid */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
            Pets ({ownedPetIds.length})
          </div>
        </div>
        <RarityFilter value={filter} onChange={setFilter} />
        <div className="mt-2 grid grid-cols-2 gap-2">
          {visiblePets.map((id) => {
            const def = PET_BY_ID[id];
            if (!def) return null;
            const inst = profile.pets[id];
            const cur = petCurrentRarity(def, inst.level);
            const r = RARITY_BY_KEY[cur];
            const isEquipped = equippedSet.has(id);
            const ev = evolutionInfo(def, inst, profile.level);
            const cost = isPetMaxed(def, inst.level)
              ? null
              : petUpgradeCost(def, inst.level);
            const blockedTier =
              !!cost &&
              ev.next != null &&
              inst.level + 1 >= ev.petLevelNeeded &&
              profile.level < ev.playerLevelNeeded;
            const canAfford =
              cost != null &&
              !blockedTier &&
              profile.coins >= cost.coins &&
              profile.gems >= cost.gems;
            const abilityNext = profile.petAbilityNext[id] ?? 0;
            const cdLeft = abilityNext > now ? abilityNext - now : 0;

            return (
              <div
                key={id}
                className={
                  "rounded-lg border bg-zinc-950/70 p-2 " +
                  (isEquipped ? "border-amber-500/50" : "border-zinc-800")
                }
              >
                <div className="flex flex-col items-center gap-1">
                  <PetArt art={def.art} size={48} />
                  <div className="flex w-full items-center justify-center gap-1">
                    <span className="truncate text-[11px] font-extrabold text-zinc-100">
                      {def.name}
                    </span>
                  </div>
                  <span
                    className={
                      "rounded-full px-1.5 py-0.5 text-[8px] font-bold tracking-[0.18em] " +
                      (isGradientRarity(r.key) ? "gradient-text" : "")
                    }
                    style={{ background: r.badgeBg, color: r.badgeText }}
                  >
                    {r.label} · LV {inst.level}
                  </span>
                </div>

                {def.effect.abilityIntervalMs && (
                  <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full bg-amber-400 transition-all"
                      style={{
                        width:
                          cdLeft > 0
                            ? `${100 - (cdLeft / def.effect.abilityIntervalMs) * 100}%`
                            : "100%",
                      }}
                    />
                  </div>
                )}
                {def.effect.abilityIntervalMs && (
                  <div className="text-center text-[9px] text-zinc-500">
                    {cdLeft > 0
                      ? `Ability in ${Math.ceil(cdLeft / 1000)}s`
                      : "Ability ready"}
                  </div>
                )}

                <div className="mt-1.5 flex gap-1">
                  <button
                    onClick={() => onEquip(isEquipped ? null : id)}
                    className={
                      "flex-1 rounded-md px-1.5 py-1 text-[10px] font-extrabold " +
                      (isEquipped
                        ? "bg-amber-500 text-zinc-950"
                        : "border border-zinc-700/70 bg-zinc-900/60 text-zinc-200 active:bg-zinc-800")
                    }
                  >
                    {isEquipped ? "✓" : "EQUIP"}
                  </button>
                  {cost != null ? (
                    <button
                      onClick={() => onUpgradePet(id)}
                      disabled={!canAfford}
                      className={
                        "flex-1 rounded-md px-1.5 py-1 text-[10px] font-extrabold " +
                        (canAfford
                          ? "bg-emerald-500 text-zinc-950 active:bg-emerald-600"
                          : "bg-zinc-800 text-zinc-500")
                      }
                      title={
                        blockedTier && ev.next
                          ? `Need player LV ${ev.playerLevelNeeded} to evolve`
                          : ""
                      }
                    >
                      {cost.gems > 0
                        ? `${cost.gems}✦`
                        : `${formatNumber(cost.coins)}◎`}
                    </button>
                  ) : (
                    <span className="flex-1 rounded-md bg-zinc-800 px-1.5 py-1 text-center text-[10px] font-extrabold text-amber-300">
                      MAX
                    </span>
                  )}
                </div>

                {/* Effect summary */}
                <PetEffectChips def={def} inst={inst} />
              </div>
            );
          })}
        </div>
        {visiblePets.length === 0 && (
          <div className="mt-2 rounded-lg border border-zinc-800 bg-zinc-950/60 p-4 text-center text-xs text-zinc-500">
            No pets here yet.
          </div>
        )}
      </div>

      {/* All eggs (shop hint if you don't own them) */}
      <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-2.5 text-[10px] text-zinc-500">
        Hint: Eggs can be bought in the shop. Some eggs unlock at higher
        Rebirths ({EGGS.filter((e) => e.rebirthRequired > 0).length} of{" "}
        {EGGS.length} are rebirth-locked).
      </div>
    </div>
  );
}

function HatchPanel({
  profile,
  now,
  onStartHatch,
  onClaimHatch,
  onCancelHatch,
}: {
  profile: Profile;
  now: number;
  onStartHatch: (eggId: string) => void;
  onClaimHatch: () => void;
  onCancelHatch: () => void;
}) {
  const h = profile.hatch;
  if (!h) {
    void onStartHatch;
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
        <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
          Hatchery
        </div>
        <div className="mt-1 text-[11px] text-zinc-500">
          Tap an egg below to start hatching.
        </div>
      </div>
    );
  }
  const def = EGG_BY_ID[h.eggId];
  const elapsed = now - h.startedAt;
  const pct = Math.min(100, (elapsed / h.durationMs) * 100);
  const ready = elapsed >= h.durationMs;
  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
      <div className="flex items-center gap-3">
        <EggGlyph color={def?.color ?? "#facc15"} symbol={def?.symbol ?? "•"} />
        <div className="flex-1">
          <div className="text-sm font-extrabold text-amber-200">
            {def?.name ?? "Egg"} hatching…
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-zinc-900">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all"
              style={{ width: pct + "%" }}
            />
          </div>
          <div className="mt-0.5 text-[10px] text-zinc-400">
            {ready
              ? "Ready to claim!"
              : `${Math.ceil((h.durationMs - elapsed) / 1000)}s left`}
          </div>
        </div>
      </div>
      <div className="mt-2 flex gap-2">
        <button
          onClick={onCancelHatch}
          className="flex-1 rounded-md border border-zinc-700/70 bg-zinc-900/60 px-2 py-1.5 text-[11px] font-bold text-zinc-300 active:bg-zinc-800"
        >
          Cancel
        </button>
        <button
          onClick={onClaimHatch}
          disabled={!ready}
          className={
            "flex-[2] rounded-md px-2 py-1.5 text-[11px] font-extrabold " +
            (ready
              ? "bg-amber-500 text-zinc-950 active:bg-amber-600"
              : "bg-zinc-800 text-zinc-500")
          }
        >
          {ready ? "Claim hatch" : "Hatching…"}
        </button>
      </div>
    </div>
  );
}

function EggGlyph({ color, symbol }: { color: string; symbol: string }) {
  return (
    <div
      className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 text-2xl"
      style={{
        background: `radial-gradient(circle at 30% 25%, #fff8 0%, ${color} 60%, #0008 100%)`,
      }}
    >
      <span style={{ color: "#0008", fontWeight: 900 }}>{symbol}</span>
    </div>
  );
}

function PetEffectChips({
  def,
  inst,
}: {
  def: ReturnType<typeof PET_BY_ID[string] extends infer T ? () => T : never> extends never ? never : (typeof PETS)[number];
  inst: { level: number };
}) {
  const eff = effectiveEffect(def, inst.level);
  const chips: { label: string; value: string }[] = [];
  if (Math.abs(eff.coinMult - 1) > 0.005)
    chips.push({ label: "Coin", value: `×${eff.coinMult.toFixed(2)}` });
  if (Math.abs(eff.xpMult - 1) > 0.005)
    chips.push({ label: "XP", value: `×${eff.xpMult.toFixed(2)}` });
  if (Math.abs(eff.rarityTilt) > 0.005)
    chips.push({ label: "Rar", value: `+${eff.rarityTilt.toFixed(2)}` });
  if (Math.abs(eff.rollSpeedMult - 1) > 0.005)
    chips.push({ label: "Spd", value: `×${eff.rollSpeedMult.toFixed(2)}` });
  if (chips.length === 0) return null;
  return (
    <div className="mt-1 flex flex-wrap justify-center gap-0.5">
      {chips.map((c, i) => (
        <span
          key={i}
          className="rounded-sm bg-zinc-900/70 px-1 py-0.5 text-[8px] font-mono text-zinc-300"
        >
          {c.label} {c.value}
        </span>
      ))}
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
    <div className="-mx-1 flex flex-wrap gap-1 px-1">
      {FILTERS.map((f) => {
        const r = f === "all" ? null : RARITY_BY_KEY[f as RarityKey];
        const active = value === f;
        return (
          <button
            key={f}
            onClick={() => onChange(f)}
            className={
              "rounded-full border px-2 py-0.5 text-[9px] font-extrabold tracking-[0.14em] " +
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
