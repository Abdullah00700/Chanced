import { WEATHER_BY_ID } from "../lib/weather";

export function WeatherOverlay({ activeId }: { activeId: string | null }) {
  if (!activeId) return null;
  const def = WEATHER_BY_ID[activeId];
  if (!def) return null;
  return (
    <div
      className={"pointer-events-none fixed inset-0 z-20 " + def.overlayClass}
      aria-hidden
    />
  );
}

export function WeatherChip({
  activeId,
  timeLeft,
  onClick,
}: {
  activeId: string | null;
  timeLeft: number;
  onClick?: () => void;
}) {
  if (!activeId) return null;
  const def = WEATHER_BY_ID[activeId];
  if (!def) return null;
  const secs = Math.max(0, Math.ceil(timeLeft / 1000));
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold transition active:scale-95"
      style={{
        background: `${def.color}20`,
        borderColor: `${def.color}80`,
        color: def.color,
        textShadow: `0 0 6px ${def.color}66`,
      }}
    >
      <span>{def.glyph}</span>
      <span>{def.name}</span>
      <span className="text-zinc-300">{secs}s</span>
    </button>
  );
}
