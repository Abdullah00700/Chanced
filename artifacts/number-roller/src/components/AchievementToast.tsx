import { useEffect, useState } from "react";
import type { Achievement } from "../lib/achievements";
import { formatNumber } from "../lib/format";

export type ToastItem = {
  id: number;
  achievement: Achievement;
};

const SHOW_MS = 6500;
const SLIDE_MS = 700;

export function AchievementToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-2 z-[70] flex flex-col items-center gap-2 px-3">
      {toasts.map((t) => (
        <Toast key={t.id} item={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  );
}

function Toast({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: () => void;
}) {
  const [phase, setPhase] = useState<"enter" | "show" | "leave">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("show"), 20);
    const t2 = setTimeout(() => setPhase("leave"), SHOW_MS - SLIDE_MS);
    const t3 = setTimeout(() => onDismiss(), SHOW_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDismiss]);

  const a = item.achievement;
  const translate =
    phase === "show" ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0";

  return (
    <div
      className={
        "pointer-events-auto w-full max-w-sm transition-all duration-700 ease-out " +
        translate
      }
    >
      <button
        onClick={onDismiss}
        className="flex w-full items-stretch gap-0 overflow-hidden rounded-md border border-amber-500/40 bg-[#1a1410]/95 text-left shadow-[0_8px_28px_rgba(251,146,60,0.35)] backdrop-blur-md active:bg-[#221912]"
        style={{
          imageRendering: "pixelated" as const,
        }}
      >
        {/* Pixel-style trophy plate (Minecraft-ish) */}
        <div className="flex h-full w-14 shrink-0 items-center justify-center border-r border-amber-500/40 bg-amber-500/10">
          <TrophyIcon />
        </div>
        <div className="min-w-0 flex-1 px-3 py-2">
          <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-amber-300">
            Advancement Made!
          </div>
          <div className="mt-0.5 truncate text-sm font-extrabold text-amber-100">
            {a.name}
          </div>
          <div className="truncate text-[11px] text-amber-200/70">
            {a.description}
          </div>
          {(a.reward.coins > 0 || a.reward.xp > 0 || a.reward.gems > 0) && (
            <div className="mt-1 flex flex-wrap gap-1 text-[10px] font-bold">
              {a.reward.coins > 0 && (
                <span className="rounded-sm bg-amber-500/20 px-1.5 py-0.5 text-amber-200">
                  +{formatNumber(a.reward.coins)}◎
                </span>
              )}
              {a.reward.xp > 0 && (
                <span className="rounded-sm bg-sky-500/20 px-1.5 py-0.5 text-sky-200">
                  +{formatNumber(a.reward.xp)} xp
                </span>
              )}
              {a.reward.gems > 0 && (
                <span className="rounded-sm bg-violet-500/20 px-1.5 py-0.5 text-violet-200">
                  +{formatNumber(a.reward.gems)}✦
                </span>
              )}
            </div>
          )}
        </div>
      </button>
    </div>
  );
}

function TrophyIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      aria-hidden
      style={{ shapeRendering: "crispEdges" }}
    >
      {/* Pixel-style trophy/star */}
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="55%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      {/* Cup body */}
      <rect x="9" y="6" width="14" height="10" fill="url(#goldGrad)" stroke="#78350f" strokeWidth="1" />
      {/* Handles */}
      <rect x="6" y="8" width="3" height="6" fill="url(#goldGrad)" stroke="#78350f" strokeWidth="1" />
      <rect x="23" y="8" width="3" height="6" fill="url(#goldGrad)" stroke="#78350f" strokeWidth="1" />
      {/* Stem */}
      <rect x="13" y="16" width="6" height="4" fill="url(#goldGrad)" stroke="#78350f" strokeWidth="1" />
      {/* Base */}
      <rect x="9" y="20" width="14" height="3" fill="url(#goldGrad)" stroke="#78350f" strokeWidth="1" />
      <rect x="7" y="23" width="18" height="3" fill="url(#goldGrad)" stroke="#78350f" strokeWidth="1" />
      {/* Star inside cup */}
      <text
        x="16"
        y="14"
        textAnchor="middle"
        fontSize="9"
        fontWeight="900"
        fill="#78350f"
        fontFamily="Inter, system-ui, sans-serif"
      >
        ★
      </text>
    </svg>
  );
}
