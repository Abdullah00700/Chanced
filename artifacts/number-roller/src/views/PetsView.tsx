import { formatNumber } from "../lib/format";
import { PETS } from "../lib/pets";
import { isGradientRarity, RARITY_BY_KEY } from "../lib/rarity";
import type { Profile } from "../lib/types";

export function PetsView({
  profile,
  onEquip,
  onBuyPet,
}: {
  profile: Profile;
  onEquip: (id: string | null) => void;
  onBuyPet: (id: string) => void;
}) {
  const equipped = profile.equippedPet
    ? PETS.find((p) => p.id === profile.equippedPet)
    : null;

  return (
    <div className="flex flex-col gap-3 pb-4">
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
        <div className="mb-1.5 text-[10px] uppercase tracking-widest text-zinc-500">
          Equipped
        </div>
        {equipped ? (
          <div className="flex items-center gap-3">
            <PetIcon glyph={equipped.glyph} rarityKey={equipped.rarity} />
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

      <h2 className="mt-1 text-[11px] font-extrabold tracking-[0.22em] text-zinc-400">
        ALL PETS
      </h2>

      <div className="grid grid-cols-1 gap-2">
        {PETS.map((p) => {
          const owned = !!profile.pets[p.id];
          const isEquipped = profile.equippedPet === p.id;
          const r = RARITY_BY_KEY[p.rarity];
          const canAfford =
            profile.coins >= p.costCoins && profile.gems >= p.costGems;
          return (
            <div
              key={p.id}
              className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3"
            >
              <PetIcon glyph={p.glyph} rarityKey={p.rarity} dim={!owned} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate font-extrabold text-zinc-100">
                    {p.name}
                  </span>
                  <span
                    className={
                      "shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold tracking-[0.18em] " +
                      (isGradientRarity(r.key) ? "gradient-text" : "")
                    }
                    style={{
                      background: r.badgeBg,
                      color: r.badgeText,
                    }}
                  >
                    {r.label}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400">{p.flavor}</div>
                {!owned && (
                  <div className="mt-0.5 text-[10px] text-zinc-500">
                    Drops on rolls or buy below
                  </div>
                )}
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
                ) : (
                  <button
                    onClick={() => onBuyPet(p.id)}
                    disabled={!canAfford}
                    className={
                      "rounded-md px-2 py-1.5 text-[11px] font-bold " +
                      (canAfford
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
          );
        })}
      </div>
    </div>
  );
}

function PetIcon({
  glyph,
  rarityKey,
  dim,
}: {
  glyph: string;
  rarityKey: keyof typeof RARITY_BY_KEY;
  dim?: boolean;
}) {
  const r = RARITY_BY_KEY[rarityKey];
  return (
    <div
      className={
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border " +
        (dim ? "opacity-40 grayscale" : "")
      }
      style={{
        background: r.badgeBg,
        borderColor: "rgba(255,255,255,0.06)",
        boxShadow: dim ? "none" : r.glow,
      }}
    >
      <span
        className="text-xl font-black"
        style={{
          color: r.badgeText,
          textShadow: dim ? "none" : r.glow,
        }}
      >
        {glyph}
      </span>
    </div>
  );
}
