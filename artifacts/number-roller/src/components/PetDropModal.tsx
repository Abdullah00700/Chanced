import { Modal } from "./Modal";
import { PetArt } from "./PetArt";
import { PET_BY_ID } from "../lib/pets";
import { isGradientRarity, RARITY_BY_KEY } from "../lib/rarity";

export function PetDropModal({
  petId,
  onClose,
  onEquip,
}: {
  petId: string;
  onClose: () => void;
  onEquip: () => void;
}) {
  const pet = PET_BY_ID[petId];
  if (!pet) return null;
  const r = RARITY_BY_KEY[pet.baseRarity];

  return (
    <Modal onClose={onClose} size="sm">
      <div className="text-center">
        <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
          Pet drop
        </div>
        <h2
          className={
            "mt-1 text-2xl font-black " +
            (isGradientRarity(r.key) ? "gradient-text" : "")
          }
          style={{ ...r.textStyle, textShadow: r.glow }}
        >
          {pet.name}
        </h2>
        <div
          className="mx-auto mt-3 flex h-24 w-24 items-center justify-center rounded-2xl border"
          style={{
            background: r.badgeBg,
            borderColor: "rgba(255,255,255,0.06)",
            boxShadow: r.glow,
          }}
        >
          <PetArt art={pet.art} size={80} />
        </div>
        <div className="mt-2 text-[11px] text-zinc-400">{pet.flavor}</div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-bold text-zinc-200 active:bg-zinc-800"
          >
            Keep
          </button>
          <button
            onClick={onEquip}
            className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-extrabold text-zinc-950 active:bg-amber-600"
          >
            Equip
          </button>
        </div>
      </div>
    </Modal>
  );
}
