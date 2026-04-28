export type Tab =
  | "roll"
  | "shop"
  | "inventory"
  | "quests"
  | "events"
  | "pets"
  | "achievements"
  | "leaderboard";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "roll", label: "Roll", icon: "◎" },
  { key: "shop", label: "Shop", icon: "▲" },
  { key: "inventory", label: "Inv", icon: "▢" },
  { key: "quests", label: "Quests", icon: "✎" },
  { key: "events", label: "Events", icon: "❉" },
];

export function BottomNav({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-800 bg-[#0a0b10]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-stretch">
        {TABS.map((t) => {
          const isActive = t.key === active;
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={
                "flex flex-1 flex-col items-center gap-0.5 px-1 py-2 text-[10px] font-semibold transition " +
                (isActive
                  ? "text-amber-300"
                  : "text-zinc-500 active:text-zinc-300")
              }
            >
              <span
                className={
                  "text-lg leading-none " +
                  (isActive ? "drop-shadow-[0_0_6px_rgba(252,211,77,0.6)]" : "")
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
