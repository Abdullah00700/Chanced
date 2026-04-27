import { useEffect, useState } from "react";

export function ScreenAura({
  color,
  pulseKey,
}: {
  color: string | null;
  pulseKey: number;
}) {
  const [pulsing, setPulsing] = useState(false);

  useEffect(() => {
    if (pulseKey === 0) return;
    setPulsing(true);
    const t = setTimeout(() => setPulsing(false), 900);
    return () => clearTimeout(t);
  }, [pulseKey]);

  if (!color) return null;

  const inner = pulsing ? "0 0 60px 18px " + color : "0 0 28px 6px " + color;
  const outer = pulsing
    ? "inset 0 0 80px 30px " + color
    : "inset 0 0 40px 10px " + color;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[40] transition-[box-shadow] duration-700 ease-out"
      style={{
        boxShadow: `${outer}, ${inner}`,
      }}
    />
  );
}
