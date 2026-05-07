// Weather event system. Adds short-lived global modifiers shown in the HUD
// and visualized as overlays. One auto-event triggers every ~10 minutes;
// the player can also call one on demand from the Events tab (with cooldown).

export type WeatherDef = {
  id: string;
  name: string;
  flavor: string;
  /** Active duration in ms. */
  durationMs: number;
  /** Visible weight when randomly selecting. */
  weight: number;
  effects: {
    coinMult?: number; // multiplicative
    xpMult?: number;
    rarityTilt?: number; // additive
    rollSpeedMult?: number; // multiplicative; <1 faster
  };
  /** Hex / theme color. */
  color: string;
  /** Single-char glyph for compact HUD chip. */
  glyph: string;
  /** css overlay class — see index.css */
  overlayClass: string;
  /** Gem cost to manually trigger this event (0 = free). */
  gemCost: number;
};

export const WEATHER_EVENTS: WeatherDef[] = [
  {
    id: "rain",
    name: "Rain",
    flavor: "Gentle rain. +25% coins.",
    durationMs: 90_000,
    weight: 18,
    effects: { coinMult: 1.25 },
    color: "#60a5fa",
    glyph: "☂",
    overlayClass: "weather-rain",
    gemCost: 0,
  },
  {
    id: "thunder",
    name: "Thunderstorm",
    flavor: "Charged air. +50% XP and faster rolls.",
    durationMs: 75_000,
    weight: 12,
    effects: { xpMult: 1.5, rollSpeedMult: 0.7 },
    color: "#a78bfa",
    glyph: "⚡",
    overlayClass: "weather-thunder",
    gemCost: 5,
  },
  {
    id: "meteor-shower",
    name: "Meteor Shower",
    flavor: "Falling stars push the curve outward. +0.4 rarity tilt.",
    durationMs: 60_000,
    weight: 8,
    effects: { rarityTilt: 0.4 },
    color: "#fbbf24",
    glyph: "☄",
    overlayClass: "weather-meteor",
    gemCost: 25,
  },
  {
    id: "acid-rain",
    name: "Acid Rain",
    flavor: "Corrosive but lucky. -20% coins, +0.6 rarity tilt.",
    durationMs: 60_000,
    weight: 6,
    effects: { coinMult: 0.8, rarityTilt: 0.6 },
    color: "#84cc16",
    glyph: "☢",
    overlayClass: "weather-acid",
    gemCost: 15,
  },
  {
    id: "tsunami",
    name: "Tsunami",
    flavor: "Tidal wave! Triple coins, but rolls are slower.",
    durationMs: 60_000,
    weight: 5,
    effects: { coinMult: 3, rollSpeedMult: 1.2 },
    color: "#0ea5e9",
    glyph: "≋",
    overlayClass: "weather-tsunami",
    gemCost: 20,
  },
  {
    id: "tornado",
    name: "Tornado",
    flavor: "Chaos winds. Roll speed × 0.4 (much faster).",
    durationMs: 60_000,
    weight: 6,
    effects: { rollSpeedMult: 0.4, xpMult: 1.2 },
    color: "#94a3b8",
    glyph: "🌀",
    overlayClass: "weather-tornado",
    gemCost: 10,
  },
  {
    id: "snow",
    name: "Snowstorm",
    flavor: "Crisp and frosty. +30% XP.",
    durationMs: 75_000,
    weight: 14,
    effects: { xpMult: 1.3 },
    color: "#bae6fd",
    glyph: "❄",
    overlayClass: "weather-snow",
    gemCost: 0,
  },
  {
    id: "aurora",
    name: "Aurora",
    flavor: "Sky lights up. +40% coins, +40% XP.",
    durationMs: 60_000,
    weight: 7,
    effects: { coinMult: 1.4, xpMult: 1.4 },
    color: "#22d3ee",
    glyph: "✦",
    overlayClass: "weather-aurora",
    gemCost: 30,
  },
  {
    id: "eclipse",
    name: "Solar Eclipse",
    flavor: "Eerie quiet. +0.8 rarity tilt and XP doubled.",
    durationMs: 45_000,
    weight: 3,
    effects: { rarityTilt: 0.8, xpMult: 2 },
    color: "#1e1b4b",
    glyph: "◐",
    overlayClass: "weather-eclipse",
    gemCost: 50,
  },
  {
    id: "heatwave",
    name: "Heatwave",
    flavor: "Sun blasts down. +60% coins, slightly slower rolls.",
    durationMs: 75_000,
    weight: 10,
    effects: { coinMult: 1.6, rollSpeedMult: 1.1 },
    color: "#f97316",
    glyph: "☼",
    overlayClass: "weather-heatwave",
    gemCost: 0,
  },
  {
    id: "fog",
    name: "Mystic Fog",
    flavor: "Hides the curve. +0.3 rarity tilt.",
    durationMs: 90_000,
    weight: 11,
    effects: { rarityTilt: 0.3 },
    color: "#cbd5e1",
    glyph: "≈",
    overlayClass: "weather-fog",
    gemCost: 0,
  },
];

export const WEATHER_BY_ID: Record<string, WeatherDef> = WEATHER_EVENTS.reduce(
  (acc, w) => {
    acc[w.id] = w;
    return acc;
  },
  {} as Record<string, WeatherDef>,
);

export const WEATHER_AUTO_INTERVAL_MS = 10 * 60_000;
export const WEATHER_MANUAL_COOLDOWN_MS = 5 * 60_000;

export function pickRandomWeather(excludeId?: string | null): WeatherDef {
  const pool = WEATHER_EVENTS.filter((w) => w.id !== excludeId);
  const total = pool.reduce((s, w) => s + w.weight, 0);
  let r = Math.random() * total;
  for (const w of pool) {
    r -= w.weight;
    if (r <= 0) return w;
  }
  return pool[0];
}
