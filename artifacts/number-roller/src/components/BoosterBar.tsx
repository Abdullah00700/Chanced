import { formatTimeLeft } from "../lib/format";

export function BoosterBar({
  coinUntil,
  rarityUntil,
  xpUntil,
  now,
}: {
  coinUntil: number;
  rarityUntil: number;
  xpUntil: number;
  now: number;
}) {
  const coinLeft = Math.max(0, coinUntil - now);
  const rarityLeft = Math.max(0, rarityUntil - now);
  const xpLeft = Math.max(0, xpUntil - now);
  if (coinLeft === 0 && rarityLeft === 0 && xpLeft === 0) return null;
  return (
    <div className="mb-3 flex flex-wrap gap-1.5">
      {coinLeft > 0 && (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-300">
          ◎ 2x COINS · {formatTimeLeft(coinLeft)}
        </span>
      )}
      {xpLeft > 0 && (
        <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold text-sky-300">
          ✦ 2x XP · {formatTimeLeft(xpLeft)}
        </span>
      )}
      {rarityLeft > 0 && (
        <span className="inline-flex items-center gap-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-2 py-0.5 text-[10px] font-bold text-fuchsia-300">
          ✦ RARITY BOOST · {formatTimeLeft(rarityLeft)}
        </span>
      )}
    </div>
  );
}
