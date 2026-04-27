import { chancePctFromProb } from "../lib/format";
import { isGradientRarity, type RarityDef } from "../lib/rarity";

export function StatCard({
  label,
  number,
  prob,
  rarity,
}: {
  label: string;
  number: number | null;
  prob: number | null;
  rarity: RarityDef | null;
}) {
  const isGradient = !!rarity && isGradientRarity(rarity.key);
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
      <div className="mb-1 text-[10px] uppercase tracking-widest text-zinc-500">
        {label}
      </div>
      {number == null ? (
        <div className="text-2xl font-bold text-zinc-600">—</div>
      ) : (
        <>
          <div
            className={
              "text-2xl font-extrabold tabular-nums " +
              (isGradient ? "gradient-text" : "")
            }
            style={{
              ...(rarity?.textStyle ?? { color: "#e5e7eb" }),
              textShadow: rarity?.glow ?? "none",
              lineHeight: 1.1,
            }}
          >
            {number.toLocaleString()}
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-1.5">
            {rarity && (
              <span
                className="rounded-full px-1.5 py-0.5 text-[9px] font-bold tracking-[0.18em]"
                style={{
                  background: rarity.badgeBg,
                  color: rarity.badgeText,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {rarity.label}
              </span>
            )}
            <span className="truncate text-[10px] text-zinc-400">
              {prob != null ? chancePctFromProb(prob) : "—"}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
