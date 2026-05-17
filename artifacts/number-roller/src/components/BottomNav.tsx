export type Tab =
  | "roll"
  | "shop"
  | "inventory"
  | "quests"
  | "events"
  | "pets"
  | "achievements"
  | "leaderboard"
  | "bosses"
  | "gacha";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "roll",      label: "Roll",   icon: "◎" },
  { key: "shop",      label: "Shop",   icon: "▲" },
  { key: "inventory", label: "Inv",    icon: "▢" },
  { key: "quests",    label: "Quests", icon: "✎" },
  { key: "bosses",    label: "Bosses", icon: "⚔" },
  { key: "gacha",     label: "Gacha",  icon: "◈" },
];

export function BottomNav({
  active,
  onChange,
  bossActive,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
  bossActive?: boolean;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-800 bg-[#0a0b10]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-stretch">
        {TABS.map((t) => {
          const isActive = t.key === active;
          const isBossTab = t.key === "bosses";
          const isGachaTab = t.key === "gacha";
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={
                "flex flex-1 flex-col items-center gap-0.5 px-1 py-2 text-[10px] font-semibold transition " +
                (isActive
                  ? isBossTab && bossActive
                    ? "text-red-400"
                    : isGachaTab
                      ? "text-purple-300"
                      : "text-amber-300"
                  : isBossTab && bossActive
                    ? "text-red-500 animate-pulse"
                    : "text-zinc-500 active:text-zinc-300")
              }
            >
              <span
                className={
                  "text-lg leading-none " +
                  (isActive
                    ? isBossTab && bossActive
                      ? "drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]"
                      : isGachaTab
                        ? "drop-shadow-[0_0_6px_rgba(192,132,252,0.7)]"
                        : "drop-shadow-[0_0_6px_rgba(252,211,77,0.6)]"
                    : "")
                }
              >
                {t.icon}
              </span>
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
