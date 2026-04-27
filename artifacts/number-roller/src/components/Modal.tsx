import type { ReactNode } from "react";

export function Modal({
  children,
  onClose,
  size = "md",
}: {
  children: ReactNode;
  onClose?: () => void;
  size?: "sm" | "md";
}) {
  const max = size === "sm" ? "max-w-xs" : "max-w-md";
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={
          "w-full rounded-2xl border border-zinc-700/70 bg-zinc-950 p-5 shadow-2xl " +
          max
        }
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
