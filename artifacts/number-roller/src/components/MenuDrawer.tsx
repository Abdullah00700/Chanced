import { useEffect } from "react";
import type { Tab } from "./BottomNav";

type MenuItem = {
  key: Tab;
  label: string;
  icon: string;
  hint?: string;
};

const PAGE_ITEMS: MenuItem[] = [
  { key: "roll", label: "Roll", icon: "◎", hint: "Spin the curve" },
  { key: "shop", label: "Shop", icon: "▲", hint: "Upgrades & boosters" },
  { key: "pets", label: "Pets", icon: "✦", hint: "Collect & equip" },
  { key: "pets", label: "Inventory", icon: "▢", hint: "Your owned pets" },
  { key: "achievements", label: "Achievements", icon: "★", hint: "Trophies" },
  { key: "leaderboard", label: "Leaderboard", icon: "≡", hint: "Rarest rolls" },
];

export function MenuDrawer({
  open,
  active,
  onClose,
  onChangeTab,
  onOpenSave,
  onOpenWipe,
  onLogout,
}: {
  open: boolean;
  active: Tab;
  onClose: () => void;
  onChangeTab: (t: Tab) => void;
  onOpenSave: () => void;
  onOpenWipe: () => void;
  onLogout: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className={
        "fixed inset-0 z-[55] " + (open ? "" : "pointer-events-none")
      }
      aria-hidden={!open}
    >
      {/* Scrim */}
      <div
        onClick={onClose}
        className={
          "absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-200 " +
          (open ? "opacity-100" : "opacity-0")
        }
      />

      {/* Drawer */}
      <aside
        className={
          "absolute right-0 top-0 flex h-full w-72 max-w-[85vw] flex-col border-l border-zinc-800/80 bg-[#0b0c14] shadow-2xl transition-transform duration-200 ease-out " +
          (open ? "translate-x-0" : "translate-x-full")
        }
      >
        <div className="flex items-center justify-between border-b border-zinc-800/70 px-4 py-3">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-amber-300">
            Menu
          </span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-md border border-zinc-700/70 bg-zinc-900/60 px-2 py-1 text-sm text-zinc-300 active:bg-zinc-800"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 scroll-hide">
          <div className="mb-2 px-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Pages
          </div>
          <ul className="flex flex-col gap-1.5">
            {PAGE_ITEMS.map((item, idx) => {
              const isActive = item.key === active;
              return (
                <li key={`${item.key}-${idx}`}>
                  <button
                    onClick={() => {
                      onChangeTab(item.key);
                      onClose();
                    }}
                    className={
                      "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition active:scale-[0.99] " +
                      (isActive
                        ? "border-amber-500/40 bg-amber-500/10"
                        : "border-zinc-800 bg-zinc-900/40 active:bg-zinc-900/70")
                    }
                  >
                    <span
                      className={
                        "text-xl leading-none " +
                        (isActive ? "text-amber-300" : "text-zinc-400")
                      }
                    >
                      {item.icon}
                    </span>
                    <span className="flex-1">
                      <span
                        className={
                          "block text-sm font-extrabold " +
                          (isActive ? "text-amber-200" : "text-zinc-100")
                        }
                      >
                        {item.label}
                      </span>
                      {item.hint && (
                        <span className="block text-[10px] text-zinc-500">
                          {item.hint}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mb-2 mt-5 px-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Account
          </div>
          <ul className="flex flex-col gap-1.5">
            <li>
              <button
                onClick={() => {
                  onOpenSave();
                  onClose();
                }}
                className="flex w-full items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-2.5 text-left active:scale-[0.99] active:bg-zinc-900/70"
              >
                <span className="text-xl leading-none text-emerald-300">⤓</span>
                <span className="flex-1">
                  <span className="block text-sm font-extrabold text-zinc-100">
                    Save code
                  </span>
                  <span className="block text-[10px] text-zinc-500">
                    Back up or share progress
                  </span>
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  onOpenWipe();
                  onClose();
                }}
                className="flex w-full items-center gap-3 rounded-lg border border-rose-700/40 bg-rose-950/30 px-3 py-2.5 text-left active:scale-[0.99] active:bg-rose-950/50"
              >
                <span className="text-xl leading-none text-rose-400">⌫</span>
                <span className="flex-1">
                  <span className="block text-sm font-extrabold text-rose-200">
                    Wipe account data
                  </span>
                  <span className="block text-[10px] text-rose-300/70">
                    Permanently reset this account
                  </span>
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex w-full items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-2.5 text-left active:scale-[0.99] active:bg-zinc-900/70"
              >
                <span className="text-xl leading-none text-zinc-400">↪</span>
                <span className="flex-1">
                  <span className="block text-sm font-extrabold text-zinc-100">
                    Log out
                  </span>
                  <span className="block text-[10px] text-zinc-500">
                    Switch to another account
                  </span>
                </span>
              </button>
            </li>
          </ul>
        </div>

        <div className="border-t border-zinc-800/70 px-4 py-2 text-center text-[10px] text-zinc-600">
          Rarity Roller
        </div>
      </aside>
    </div>
  );
}
