/**
 * Cartoonish SVG art for each pet, in a Blox Fruits-style:
 * round, glossy, bold colors with a thick dark outline and a soft shine.
 *
 * All art shares a common "blob" body so silhouettes feel like a unified set.
 * Differences come from color palette, ears/horns, accents, and accessories.
 */

const STROKE = "#1a0f08";
const STROKE_W = 2;
const SHINE = "rgba(255,255,255,0.55)";

type Palette = {
  body: string;
  bodyDark: string;
  belly?: string;
  accent?: string;
};

function Body({
  pal,
  children,
}: {
  pal: Palette;
  children?: React.ReactNode;
}) {
  return (
    <>
      <defs>
        <linearGradient id={`g-body-${pal.body}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={pal.body} />
          <stop offset="100%" stopColor={pal.bodyDark} />
        </linearGradient>
      </defs>
      {/* Body */}
      <ellipse
        cx="32"
        cy="36"
        rx="22"
        ry="20"
        fill={`url(#g-body-${pal.body})`}
        stroke={STROKE}
        strokeWidth={STROKE_W}
      />
      {/* Belly */}
      {pal.belly && (
        <ellipse
          cx="32"
          cy="42"
          rx="13"
          ry="11"
          fill={pal.belly}
          opacity="0.85"
        />
      )}
      {children}
      {/* Shine */}
      <ellipse cx="24" cy="24" rx="6" ry="4" fill={SHINE} opacity="0.55" />
    </>
  );
}

function Eyes({
  cx1 = 25,
  cx2 = 39,
  cy = 30,
  r = 3.2,
  pupil = "#0b0a0e",
  white = "#fff",
}: {
  cx1?: number;
  cx2?: number;
  cy?: number;
  r?: number;
  pupil?: string;
  white?: string;
}) {
  return (
    <>
      <circle cx={cx1} cy={cy} r={r} fill={white} stroke={STROKE} strokeWidth="1.2" />
      <circle cx={cx2} cy={cy} r={r} fill={white} stroke={STROKE} strokeWidth="1.2" />
      <circle cx={cx1 + 0.6} cy={cy + 0.6} r={r * 0.55} fill={pupil} />
      <circle cx={cx2 + 0.6} cy={cy + 0.6} r={r * 0.55} fill={pupil} />
      <circle cx={cx1 + 1.2} cy={cy - 0.4} r={0.7} fill="#fff" />
      <circle cx={cx2 + 1.2} cy={cy - 0.4} r={0.7} fill="#fff" />
    </>
  );
}

function SmallSmile({ cy = 40 }: { cy?: number }) {
  return (
    <path
      d={`M27 ${cy} Q32 ${cy + 4} 37 ${cy}`}
      fill="none"
      stroke={STROKE}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  );
}

// ---- Per-pet art ----

function Pup() {
  const pal: Palette = {
    body: "#fde68a",
    bodyDark: "#d97706",
    belly: "#fff7ed",
  };
  return (
    <svg viewBox="0 0 64 64">
      {/* Ears */}
      <path
        d="M14 18 L20 8 L26 18 Z"
        fill={pal.bodyDark}
        stroke={STROKE}
        strokeWidth={STROKE_W}
      />
      <path
        d="M50 18 L44 8 L38 18 Z"
        fill={pal.bodyDark}
        stroke={STROKE}
        strokeWidth={STROKE_W}
      />
      <Body pal={pal} />
      <Eyes />
      {/* Nose */}
      <ellipse cx="32" cy="36" rx="2.2" ry="1.6" fill={STROKE} />
      <SmallSmile cy={40} />
    </svg>
  );
}

function Bunny() {
  const pal: Palette = { body: "#fff", bodyDark: "#cbd5e1", belly: "#fbcfe8" };
  return (
    <svg viewBox="0 0 64 64">
      {/* Long ears */}
      <ellipse
        cx="24"
        cy="14"
        rx="4"
        ry="11"
        fill={pal.body}
        stroke={STROKE}
        strokeWidth={STROKE_W}
      />
      <ellipse cx="24" cy="14" rx="2" ry="8" fill="#fbcfe8" />
      <ellipse
        cx="40"
        cy="14"
        rx="4"
        ry="11"
        fill={pal.body}
        stroke={STROKE}
        strokeWidth={STROKE_W}
      />
      <ellipse cx="40" cy="14" rx="2" ry="8" fill="#fbcfe8" />
      <Body pal={pal} />
      <Eyes pupil="#7e22ce" />
      <ellipse cx="32" cy="38" rx="2" ry="1.4" fill="#ec4899" />
      <SmallSmile cy={42} />
    </svg>
  );
}

function Chick() {
  const pal: Palette = { body: "#fde047", bodyDark: "#eab308" };
  return (
    <svg viewBox="0 0 64 64">
      {/* Tuft */}
      <path
        d="M30 14 L32 6 L34 14 Z"
        fill={pal.bodyDark}
        stroke={STROKE}
        strokeWidth={STROKE_W}
      />
      <Body pal={pal} />
      <Eyes />
      {/* Beak */}
      <path
        d="M28 36 L32 41 L36 36 Z"
        fill="#f97316"
        stroke={STROKE}
        strokeWidth="1.2"
      />
    </svg>
  );
}

function Mouse() {
  const pal: Palette = { body: "#d4d4d8", bodyDark: "#71717a", belly: "#fafafa" };
  return (
    <svg viewBox="0 0 64 64">
      {/* Round ears */}
      <circle cx="20" cy="18" r="6" fill={pal.bodyDark} stroke={STROKE} strokeWidth={STROKE_W} />
      <circle cx="20" cy="18" r="3" fill="#fbcfe8" />
      <circle cx="44" cy="18" r="6" fill={pal.bodyDark} stroke={STROKE} strokeWidth={STROKE_W} />
      <circle cx="44" cy="18" r="3" fill="#fbcfe8" />
      <Body pal={pal} />
      <Eyes />
      <ellipse cx="32" cy="38" rx="2" ry="1.4" fill="#ec4899" />
    </svg>
  );
}

function Frog() {
  const pal: Palette = { body: "#86efac", bodyDark: "#16a34a", belly: "#dcfce7" };
  return (
    <svg viewBox="0 0 64 64">
      {/* Bulgy eyes on top */}
      <circle cx="22" cy="18" r="6" fill={pal.body} stroke={STROKE} strokeWidth={STROKE_W} />
      <circle cx="42" cy="18" r="6" fill={pal.body} stroke={STROKE} strokeWidth={STROKE_W} />
      <circle cx="22" cy="18" r="3.2" fill="#fff" />
      <circle cx="42" cy="18" r="3.2" fill="#fff" />
      <circle cx="23" cy="19" r="1.8" fill={STROKE} />
      <circle cx="43" cy="19" r="1.8" fill={STROKE} />
      <Body pal={pal} />
      <path
        d="M22 38 Q32 46 42 38"
        fill="none"
        stroke={STROKE}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Cat() {
  const pal: Palette = { body: "#fcd34d", bodyDark: "#b45309", belly: "#fef3c7" };
  return (
    <svg viewBox="0 0 64 64">
      <path d="M14 20 L18 8 L26 18 Z" fill={pal.bodyDark} stroke={STROKE} strokeWidth={STROKE_W} />
      <path d="M50 20 L46 8 L38 18 Z" fill={pal.bodyDark} stroke={STROKE} strokeWidth={STROKE_W} />
      <path d="M16 18 L18 12 L22 17 Z" fill="#fbcfe8" />
      <path d="M48 18 L46 12 L42 17 Z" fill="#fbcfe8" />
      <Body pal={pal} />
      <Eyes pupil="#16a34a" />
      <ellipse cx="32" cy="36" rx="1.6" ry="1.2" fill={STROKE} />
      <path d="M27 38 L21 40" stroke={STROKE} strokeWidth="0.8" />
      <path d="M27 39 L21 41" stroke={STROKE} strokeWidth="0.8" />
      <path d="M37 38 L43 40" stroke={STROKE} strokeWidth="0.8" />
      <path d="M37 39 L43 41" stroke={STROKE} strokeWidth="0.8" />
      <SmallSmile cy={40} />
    </svg>
  );
}

function Fox() {
  const pal: Palette = { body: "#fb923c", bodyDark: "#c2410c", belly: "#fff" };
  return (
    <svg viewBox="0 0 64 64">
      <path d="M14 22 L20 6 L26 20 Z" fill={pal.bodyDark} stroke={STROKE} strokeWidth={STROKE_W} />
      <path d="M50 22 L44 6 L38 20 Z" fill={pal.bodyDark} stroke={STROKE} strokeWidth={STROKE_W} />
      <Body pal={pal} />
      <ellipse cx="32" cy="40" rx="14" ry="9" fill="#fff" opacity="0.95" />
      <Eyes />
      <ellipse cx="32" cy="38" rx="2" ry="1.4" fill={STROKE} />
      <SmallSmile cy={43} />
    </svg>
  );
}

function Raccoon() {
  const pal: Palette = { body: "#9ca3af", bodyDark: "#374151", belly: "#e5e7eb" };
  return (
    <svg viewBox="0 0 64 64">
      <path d="M14 20 L20 10 L26 18 Z" fill={pal.bodyDark} stroke={STROKE} strokeWidth={STROKE_W} />
      <path d="M50 20 L44 10 L38 18 Z" fill={pal.bodyDark} stroke={STROKE} strokeWidth={STROKE_W} />
      <Body pal={pal} />
      {/* Mask */}
      <ellipse cx="25" cy="30" rx="6" ry="4" fill="#1f2937" />
      <ellipse cx="39" cy="30" rx="6" ry="4" fill="#1f2937" />
      <Eyes pupil="#fbbf24" />
      <ellipse cx="32" cy="38" rx="2" ry="1.4" fill={STROKE} />
    </svg>
  );
}

function Hedgehog() {
  const pal: Palette = { body: "#a78bfa", bodyDark: "#6d28d9", belly: "#fde68a" };
  return (
    <svg viewBox="0 0 64 64">
      {/* Spikes */}
      {Array.from({ length: 11 }).map((_, i) => {
        const a = -100 + i * 16;
        const r = 24;
        const x1 = 32 + Math.cos((a * Math.PI) / 180) * r;
        const y1 = 36 + Math.sin((a * Math.PI) / 180) * r;
        const x2 = 32 + Math.cos((a * Math.PI) / 180) * (r + 6);
        const y2 = 36 + Math.sin((a * Math.PI) / 180) * (r + 6);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={pal.bodyDark}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        );
      })}
      <Body pal={pal} />
      <Eyes />
      <ellipse cx="32" cy="38" rx="1.8" ry="1.2" fill={STROKE} />
    </svg>
  );
}

function Wolf() {
  const pal: Palette = { body: "#94a3b8", bodyDark: "#1e293b", belly: "#e2e8f0" };
  return (
    <svg viewBox="0 0 64 64">
      <path d="M14 18 L20 6 L26 18 Z" fill={pal.bodyDark} stroke={STROKE} strokeWidth={STROKE_W} />
      <path d="M50 18 L44 6 L38 18 Z" fill={pal.bodyDark} stroke={STROKE} strokeWidth={STROKE_W} />
      <Body pal={pal} />
      <Eyes pupil="#dc2626" />
      <path d="M28 38 L32 42 L36 38 Z" fill={STROKE} />
      <path d="M30 42 L30 46" stroke="#fff" strokeWidth="1.4" />
      <path d="M34 42 L34 46" stroke="#fff" strokeWidth="1.4" />
    </svg>
  );
}

function Tiger() {
  const pal: Palette = { body: "#fb923c", bodyDark: "#c2410c", belly: "#fff7ed" };
  return (
    <svg viewBox="0 0 64 64">
      <path d="M14 18 L18 8 L24 18 Z" fill={pal.bodyDark} stroke={STROKE} strokeWidth={STROKE_W} />
      <path d="M50 18 L46 8 L40 18 Z" fill={pal.bodyDark} stroke={STROKE} strokeWidth={STROKE_W} />
      <Body pal={pal} />
      {/* Stripes */}
      <path d="M16 26 Q20 30 16 34" stroke={STROKE} strokeWidth="1.4" fill="none" />
      <path d="M48 26 Q44 30 48 34" stroke={STROKE} strokeWidth="1.4" fill="none" />
      <path d="M22 22 Q26 24 22 28" stroke={STROKE} strokeWidth="1.4" fill="none" />
      <path d="M42 22 Q38 24 42 28" stroke={STROKE} strokeWidth="1.4" fill="none" />
      <Eyes pupil="#16a34a" />
      <ellipse cx="32" cy="38" rx="2" ry="1.4" fill={STROKE} />
      <SmallSmile cy={42} />
    </svg>
  );
}

function Panda() {
  const pal: Palette = { body: "#fff", bodyDark: "#cbd5e1", belly: "#fff" };
  return (
    <svg viewBox="0 0 64 64">
      <circle cx="18" cy="14" r="6" fill="#1f2937" stroke={STROKE} strokeWidth={STROKE_W} />
      <circle cx="46" cy="14" r="6" fill="#1f2937" stroke={STROKE} strokeWidth={STROKE_W} />
      <Body pal={pal} />
      <ellipse cx="25" cy="30" rx="5" ry="6" fill="#1f2937" />
      <ellipse cx="39" cy="30" rx="5" ry="6" fill="#1f2937" />
      <circle cx="25" cy="30" r="2.2" fill="#fff" />
      <circle cx="39" cy="30" r="2.2" fill="#fff" />
      <circle cx="25.6" cy="30.6" r="1.2" fill={STROKE} />
      <circle cx="39.6" cy="30.6" r="1.2" fill={STROKE} />
      <ellipse cx="32" cy="38" rx="2" ry="1.4" fill={STROKE} />
    </svg>
  );
}

function Penguin() {
  const pal: Palette = { body: "#1f2937", bodyDark: "#0b1220", belly: "#fff" };
  return (
    <svg viewBox="0 0 64 64">
      <Body pal={pal} />
      <ellipse cx="32" cy="42" rx="13" ry="13" fill="#fff" />
      <Eyes cy={28} />
      <path d="M28 32 L32 38 L36 32 Z" fill="#f59e0b" stroke={STROKE} strokeWidth="1" />
      <path d="M16 50 L22 48 L20 54 Z" fill="#f59e0b" stroke={STROKE} strokeWidth="1" />
      <path d="M48 50 L42 48 L44 54 Z" fill="#f59e0b" stroke={STROKE} strokeWidth="1" />
    </svg>
  );
}

function Leopard() {
  const pal: Palette = { body: "#fde68a", bodyDark: "#a16207", belly: "#fef3c7" };
  return (
    <svg viewBox="0 0 64 64">
      <path d="M14 18 L18 8 L24 18 Z" fill={pal.bodyDark} stroke={STROKE} strokeWidth={STROKE_W} />
      <path d="M50 18 L46 8 L40 18 Z" fill={pal.bodyDark} stroke={STROKE} strokeWidth={STROKE_W} />
      <Body pal={pal} />
      {/* Spots */}
      {[
        [18, 28],
        [22, 38],
        [16, 44],
        [46, 28],
        [42, 38],
        [48, 44],
        [30, 50],
        [38, 50],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.4" fill={STROKE} />
      ))}
      <Eyes pupil="#16a34a" />
      <ellipse cx="32" cy="38" rx="2" ry="1.4" fill={STROKE} />
    </svg>
  );
}

function Dragon() {
  const pal: Palette = { body: "#34d399", bodyDark: "#065f46", belly: "#bbf7d0" };
  return (
    <svg viewBox="0 0 64 64">
      {/* Horns */}
      <path d="M16 18 L14 6 L22 14 Z" fill={pal.bodyDark} stroke={STROKE} strokeWidth={STROKE_W} />
      <path d="M48 18 L50 6 L42 14 Z" fill={pal.bodyDark} stroke={STROKE} strokeWidth={STROKE_W} />
      <Body pal={pal} />
      {/* Spikes back */}
      <path
        d="M22 16 L26 12 L30 16 L34 12 L38 16 L42 12 L46 16"
        stroke={pal.bodyDark}
        strokeWidth="2"
        fill="none"
      />
      <Eyes pupil="#dc2626" />
      <path
        d="M28 38 L32 42 L36 38 Z"
        fill={STROKE}
      />
      <path d="M30 42 L29 47" stroke="#fff" strokeWidth="1.4" />
      <path d="M34 42 L35 47" stroke="#fff" strokeWidth="1.4" />
    </svg>
  );
}

function Griffin() {
  const pal: Palette = { body: "#fde68a", bodyDark: "#92400e", belly: "#f5d0a9" };
  return (
    <svg viewBox="0 0 64 64">
      {/* Wings */}
      <path d="M6 30 Q14 22 22 30 Q14 36 6 30 Z" fill="#fff" stroke={STROKE} strokeWidth={STROKE_W} />
      <path d="M58 30 Q50 22 42 30 Q50 36 58 30 Z" fill="#fff" stroke={STROKE} strokeWidth={STROKE_W} />
      <Body pal={pal} />
      <Eyes pupil="#dc2626" />
      <path d="M28 36 L32 42 L36 36 Z" fill="#f59e0b" stroke={STROKE} strokeWidth="1" />
    </svg>
  );
}

function Phoenix() {
  const pal: Palette = { body: "#fb923c", bodyDark: "#b91c1c", belly: "#fde047" };
  return (
    <svg viewBox="0 0 64 64">
      {/* Flame crest */}
      <path
        d="M22 16 Q28 4 32 14 Q36 4 42 16 Q46 8 50 18 Z"
        fill={pal.bodyDark}
        stroke={STROKE}
        strokeWidth={STROKE_W}
      />
      {/* Wings */}
      <path d="M6 32 Q14 22 24 32 Q14 38 6 32 Z" fill="#fbbf24" stroke={STROKE} strokeWidth={STROKE_W} />
      <path d="M58 32 Q50 22 40 32 Q50 38 58 32 Z" fill="#fbbf24" stroke={STROKE} strokeWidth={STROKE_W} />
      <Body pal={pal} />
      <Eyes pupil="#dc2626" />
      <path d="M28 36 L32 42 L36 36 Z" fill="#f59e0b" stroke={STROKE} strokeWidth="1" />
    </svg>
  );
}

function GoldenDragon() {
  const pal: Palette = { body: "#fde047", bodyDark: "#a16207", belly: "#fef9c3" };
  return (
    <svg viewBox="0 0 64 64">
      <path d="M14 18 L12 4 L22 14 Z" fill={pal.bodyDark} stroke={STROKE} strokeWidth={STROKE_W} />
      <path d="M50 18 L52 4 L42 14 Z" fill={pal.bodyDark} stroke={STROKE} strokeWidth={STROKE_W} />
      <Body pal={pal} />
      <path
        d="M22 16 L26 10 L30 16 L34 10 L38 16 L42 10 L46 16"
        stroke="#a16207"
        strokeWidth="2.4"
        fill="none"
      />
      {/* Crown */}
      <path d="M24 14 L28 8 L32 14 L36 8 L40 14 Z" fill="#facc15" stroke={STROKE} strokeWidth="1.4" />
      <Eyes pupil="#7c2d12" />
      <path d="M28 38 L32 44 L36 38 Z" fill={STROKE} />
    </svg>
  );
}

function VoidCat() {
  const pal: Palette = { body: "#5b21b6", bodyDark: "#0b0a1a", belly: "#1e1b4b" };
  return (
    <svg viewBox="0 0 64 64">
      <path d="M14 18 L18 4 L26 16 Z" fill={pal.bodyDark} stroke={STROKE} strokeWidth={STROKE_W} />
      <path d="M50 18 L46 4 L38 16 Z" fill={pal.bodyDark} stroke={STROKE} strokeWidth={STROKE_W} />
      <Body pal={pal} />
      {/* Stars on body */}
      <text x="20" y="46" fontSize="6" fill="#fff">✦</text>
      <text x="40" y="46" fontSize="6" fill="#fff">✦</text>
      <text x="32" y="52" fontSize="5" fill="#fff">✦</text>
      <Eyes pupil="#fbbf24" white="#fde68a" />
      <ellipse cx="32" cy="38" rx="2" ry="1.4" fill="#fbbf24" />
    </svg>
  );
}

function ShadowTitan() {
  const pal: Palette = { body: "#1f2937", bodyDark: "#000", belly: "#374151" };
  return (
    <svg viewBox="0 0 64 64">
      <path d="M12 20 L8 4 L24 16 Z" fill={pal.bodyDark} stroke={STROKE} strokeWidth={STROKE_W} />
      <path d="M52 20 L56 4 L40 16 Z" fill={pal.bodyDark} stroke={STROKE} strokeWidth={STROKE_W} />
      <Body pal={pal} />
      {/* Glowing red eyes */}
      <circle cx="25" cy="30" r="3.5" fill="#dc2626" />
      <circle cx="39" cy="30" r="3.5" fill="#dc2626" />
      <circle cx="25" cy="30" r="1.6" fill="#fff" />
      <circle cx="39" cy="30" r="1.6" fill="#fff" />
      {/* Smoke */}
      <circle cx="14" cy="14" r="3" fill="#374151" opacity="0.7" />
      <circle cx="50" cy="12" r="2.5" fill="#374151" opacity="0.6" />
    </svg>
  );
}

function CosmicSerpent() {
  const pal: Palette = {
    body: "#7c3aed",
    bodyDark: "#0b0a1a",
    belly: "#22d3ee",
  };
  return (
    <svg viewBox="0 0 64 64">
      <defs>
        <radialGradient id="cosmic-grad" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#0b0a1a" />
        </radialGradient>
      </defs>
      <ellipse cx="32" cy="36" rx="22" ry="20" fill="url(#cosmic-grad)" stroke={STROKE} strokeWidth={STROKE_W} />
      {/* Coiled body suggestion */}
      <path
        d="M14 36 Q22 22 32 30 Q42 38 50 24"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        opacity="0.7"
      />
      {/* Stars */}
      <text x="16" y="22" fontSize="5" fill="#fff">★</text>
      <text x="44" y="46" fontSize="5" fill="#fff">★</text>
      <text x="36" y="20" fontSize="4" fill="#fff">✦</text>
      {/* Snake head */}
      <path
        d="M28 36 L32 42 L36 36 Z"
        fill="#fbbf24"
      />
      <circle cx="25" cy="30" r="3" fill="#fbbf24" />
      <circle cx="39" cy="30" r="3" fill="#fbbf24" />
      <circle cx="25" cy="30" r="1.4" fill={STROKE} />
      <circle cx="39" cy="30" r="1.4" fill={STROKE} />
      {/* Sparkle */}
      <text x="42" y="14" fontSize="8" fill="#fff" fontWeight="900">✦</text>
    </svg>
  );
}

function CyberneticDragon() {
  const pal: Palette = {
    body: "#0ea5e9",
    bodyDark: "#0c4a6e",
    belly: "#7dd3fc",
  };
  return (
    <svg viewBox="0 0 64 64">
      <defs>
        <linearGradient id="cyber-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0c4a6e" />
        </linearGradient>
      </defs>
      {/* Mech horns */}
      <path d="M14 16 L10 2 L24 12 Z" fill="#9ca3af" stroke={STROKE} strokeWidth={STROKE_W} />
      <path d="M50 16 L54 2 L40 12 Z" fill="#9ca3af" stroke={STROKE} strokeWidth={STROKE_W} />
      {/* Body */}
      <ellipse cx="32" cy="36" rx="22" ry="20" fill="url(#cyber-body)" stroke={STROKE} strokeWidth={STROKE_W} />
      {/* Tech panels */}
      <rect x="20" y="38" width="6" height="6" fill="#fbbf24" stroke={STROKE} strokeWidth="1" />
      <rect x="38" y="38" width="6" height="6" fill="#22d3ee" stroke={STROKE} strokeWidth="1" />
      <rect x="29" y="46" width="6" height="3" fill="#dc2626" stroke={STROKE} strokeWidth="1" />
      {/* Spike row */}
      <path
        d="M22 14 L26 10 L30 14 L34 10 L38 14 L42 10 L46 14"
        stroke="#9ca3af"
        strokeWidth="2.2"
        fill="none"
      />
      {/* Glowing eyes */}
      <circle cx="25" cy="28" r="4" fill="#dc2626" />
      <circle cx="39" cy="28" r="4" fill="#dc2626" />
      <circle cx="25" cy="28" r="1.6" fill="#fff" />
      <circle cx="39" cy="28" r="1.6" fill="#fff" />
      {/* Mouth with fangs */}
      <path d="M26 36 L32 42 L38 36 Z" fill={STROKE} />
      <path d="M28 39 L28 43" stroke="#fff" strokeWidth="1.6" />
      <path d="M36 39 L36 43" stroke="#fff" strokeWidth="1.6" />
      {/* Sparkles */}
      <text x="6" y="18" fontSize="8" fill="#22d3ee">✦</text>
      <text x="52" y="56" fontSize="8" fill="#fbbf24">✦</text>
    </svg>
  );
}

// ==================== NEW PETS ====================
function Owl() {
  const pal: Palette = { body: "#a16207", bodyDark: "#451a03", belly: "#fde68a" };
  return (
    <svg viewBox="0 0 64 64">
      <path d="M16 14 L20 8 L24 14 Z" fill={pal.bodyDark} stroke={STROKE} strokeWidth={STROKE_W} />
      <path d="M48 14 L44 8 L40 14 Z" fill={pal.bodyDark} stroke={STROKE} strokeWidth={STROKE_W} />
      <Body pal={pal} />
      <circle cx="25" cy="30" r="6" fill="#fff" stroke={STROKE} strokeWidth="1.4" />
      <circle cx="39" cy="30" r="6" fill="#fff" stroke={STROKE} strokeWidth="1.4" />
      <circle cx="25" cy="30" r="2.6" fill="#f59e0b" />
      <circle cx="39" cy="30" r="2.6" fill="#f59e0b" />
      <circle cx="25" cy="30" r="1.2" fill={STROKE} />
      <circle cx="39" cy="30" r="1.2" fill={STROKE} />
      <path d="M28 36 L32 41 L36 36 Z" fill="#f97316" stroke={STROKE} strokeWidth="1" />
    </svg>
  );
}
function Rooster() {
  const pal: Palette = { body: "#b91c1c", bodyDark: "#7f1d1d", belly: "#fef2f2" };
  return (
    <svg viewBox="0 0 64 64">
      <path d="M28 14 L30 6 L32 12 L34 6 L36 14 Z" fill="#dc2626" stroke={STROKE} strokeWidth={STROKE_W} />
      <Body pal={pal} />
      <Eyes />
      <path d="M28 36 L32 42 L36 36 Z" fill="#facc15" stroke={STROKE} strokeWidth="1" />
      <path d="M30 30 Q32 32 34 30" stroke="#dc2626" strokeWidth="1.6" fill="none" />
    </svg>
  );
}
function Falcon() {
  const pal: Palette = { body: "#525b6b", bodyDark: "#1f2430", belly: "#cbd5e1" };
  return (
    <svg viewBox="0 0 64 64">
      <path d="M6 30 Q14 22 24 30 Q14 36 6 30 Z" fill={pal.body} stroke={STROKE} strokeWidth={STROKE_W} />
      <path d="M58 30 Q50 22 40 30 Q50 36 58 30 Z" fill={pal.body} stroke={STROKE} strokeWidth={STROKE_W} />
      <Body pal={pal} />
      <Eyes pupil="#fbbf24" />
      <path d="M28 36 L32 42 L36 36 Z" fill="#f59e0b" stroke={STROKE} strokeWidth="1" />
    </svg>
  );
}
function Yeti() {
  const pal: Palette = { body: "#e2e8f0", bodyDark: "#94a3b8", belly: "#f8fafc" };
  return (
    <svg viewBox="0 0 64 64">
      <path d="M14 12 L12 4 L20 14 Z" fill={pal.body} stroke={STROKE} strokeWidth={STROKE_W} />
      <path d="M50 12 L52 4 L44 14 Z" fill={pal.body} stroke={STROKE} strokeWidth={STROKE_W} />
      <Body pal={pal} />
      <Eyes pupil="#0ea5e9" />
      <path d="M26 38 L32 44 L38 38 Z" fill={STROKE} />
      <path d="M28 41 L28 46" stroke="#fff" strokeWidth="1.6" />
      <path d="M36 41 L36 46" stroke="#fff" strokeWidth="1.6" />
    </svg>
  );
}
function Kraken() {
  const pal: Palette = { body: "#7c3aed", bodyDark: "#3b0764", belly: "#a78bfa" };
  return (
    <svg viewBox="0 0 64 64">
      <Body pal={pal} />
      {[10, 22, 32, 42, 54].map((x, i) => (
        <path key={i} d={`M${x} 50 Q${x} 60 ${x + 4} 56`} stroke={pal.bodyDark} strokeWidth="3" fill="none" strokeLinecap="round" />
      ))}
      <Eyes pupil="#fbbf24" />
      <ellipse cx="32" cy="38" rx="2" ry="1.4" fill={STROKE} />
    </svg>
  );
}
function Thunderbird() {
  const pal: Palette = { body: "#1e3a8a", bodyDark: "#0c1e4d", belly: "#fde047" };
  return (
    <svg viewBox="0 0 64 64">
      <path d="M4 28 Q14 18 24 28 Q14 34 4 28 Z" fill={pal.body} stroke={STROKE} strokeWidth={STROKE_W} />
      <path d="M60 28 Q50 18 40 28 Q50 34 60 28 Z" fill={pal.body} stroke={STROKE} strokeWidth={STROKE_W} />
      <Body pal={pal} />
      <text x="29" y="44" fontSize="18" fill="#fde047">⚡</text>
      <Eyes pupil="#fde047" />
    </svg>
  );
}
function CelestialStag() {
  const pal: Palette = { body: "#312e81", bodyDark: "#0c0a3a", belly: "#a5b4fc" };
  return (
    <svg viewBox="0 0 64 64">
      <path d="M14 18 L8 6 L22 14 Z" fill="#fbbf24" stroke={STROKE} strokeWidth={STROKE_W} />
      <path d="M50 18 L56 6 L42 14 Z" fill="#fbbf24" stroke={STROKE} strokeWidth={STROKE_W} />
      <Body pal={pal} />
      <text x="14" y="46" fontSize="6" fill="#fbbf24">✦</text>
      <text x="42" y="46" fontSize="6" fill="#fbbf24">✦</text>
      <Eyes pupil="#fde047" />
    </svg>
  );
}
function AbyssLeviathan() {
  const pal: Palette = { body: "#0f172a", bodyDark: "#000", belly: "#1e3a8a" };
  return (
    <svg viewBox="0 0 64 64">
      <Body pal={pal} />
      <circle cx="25" cy="30" r="3.5" fill="#22d3ee" />
      <circle cx="39" cy="30" r="3.5" fill="#22d3ee" />
      <circle cx="25" cy="30" r="1.4" fill="#fff" />
      <circle cx="39" cy="30" r="1.4" fill="#fff" />
      <path d="M22 38 L32 44 L42 38 Z" fill={STROKE} />
      <path d="M24 41 L24 45" stroke="#fff" strokeWidth="1.4" />
      <path d="M32 42 L32 46" stroke="#fff" strokeWidth="1.4" />
      <path d="M40 41 L40 45" stroke="#fff" strokeWidth="1.4" />
    </svg>
  );
}
function Monkey() {
  const pal: Palette = { body: "#92400e", bodyDark: "#451a03", belly: "#f5d0a9" };
  return (
    <svg viewBox="0 0 64 64">
      <circle cx="16" cy="20" r="6" fill={pal.body} stroke={STROKE} strokeWidth={STROKE_W} />
      <circle cx="48" cy="20" r="6" fill={pal.body} stroke={STROKE} strokeWidth={STROKE_W} />
      <circle cx="16" cy="20" r="3" fill={pal.belly} />
      <circle cx="48" cy="20" r="3" fill={pal.belly} />
      <Body pal={pal} />
      <ellipse cx="32" cy="38" rx="10" ry="7" fill={pal.belly} />
      <Eyes cy={32} />
      <ellipse cx="32" cy="38" rx="1.6" ry="1" fill={STROKE} />
      <path d="M28 42 Q32 45 36 42" stroke={STROKE} strokeWidth="1.4" fill="none" />
    </svg>
  );
}
function TreeFrog() {
  const pal: Palette = { body: "#4ade80", bodyDark: "#15803d", belly: "#bbf7d0" };
  return (
    <svg viewBox="0 0 64 64">
      <circle cx="22" cy="18" r="6" fill={pal.body} stroke={STROKE} strokeWidth={STROKE_W} />
      <circle cx="42" cy="18" r="6" fill={pal.body} stroke={STROKE} strokeWidth={STROKE_W} />
      <circle cx="22" cy="18" r="3.4" fill="#dc2626" />
      <circle cx="42" cy="18" r="3.4" fill="#dc2626" />
      <circle cx="22" cy="19" r="1.8" fill={STROKE} />
      <circle cx="42" cy="19" r="1.8" fill={STROKE} />
      <Body pal={pal} />
      <path d="M22 38 Q32 46 42 38" fill="none" stroke={STROKE} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function Gorilla() {
  const pal: Palette = { body: "#27272a", bodyDark: "#0a0a0a", belly: "#52525b" };
  return (
    <svg viewBox="0 0 64 64">
      <Body pal={pal} />
      <ellipse cx="32" cy="40" rx="13" ry="10" fill={pal.belly} />
      <Eyes pupil="#dc2626" />
      <path d="M26 38 L32 44 L38 38 Z" fill={STROKE} />
      <path d="M28 41 L28 45" stroke="#fff" strokeWidth="1.4" />
      <path d="M36 41 L36 45" stroke="#fff" strokeWidth="1.4" />
    </svg>
  );
}
function Toucan() {
  const pal: Palette = { body: "#0a0a0a", bodyDark: "#000", belly: "#fff" };
  return (
    <svg viewBox="0 0 64 64">
      <Body pal={pal} />
      <Eyes pupil="#fbbf24" />
      <path d="M28 32 Q40 32 50 38 Q40 42 28 38 Z" fill="#facc15" stroke={STROKE} strokeWidth="1.4" />
      <path d="M50 38 L48 34" stroke="#dc2626" strokeWidth="2" />
    </svg>
  );
}
function Lion() {
  const pal: Palette = { body: "#fbbf24", bodyDark: "#a16207", belly: "#fef3c7" };
  return (
    <svg viewBox="0 0 64 64">
      {Array.from({ length: 12 }).map((_, i) => {
        const a = -180 + i * 30;
        const x1 = 32 + Math.cos((a * Math.PI) / 180) * 22;
        const y1 = 32 + Math.sin((a * Math.PI) / 180) * 22;
        const x2 = 32 + Math.cos((a * Math.PI) / 180) * 30;
        const y2 = 32 + Math.sin((a * Math.PI) / 180) * 30;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#92400e" strokeWidth="3" strokeLinecap="round" />;
      })}
      <Body pal={pal} />
      <Eyes pupil="#16a34a" />
      <ellipse cx="32" cy="38" rx="2" ry="1.4" fill={STROKE} />
      <path d="M27 42 Q32 47 37 42" stroke={STROKE} strokeWidth="1.6" fill="none" />
    </svg>
  );
}
function HornedGecko() {
  const pal: Palette = { body: "#a16207", bodyDark: "#451a03", belly: "#fde68a" };
  return (
    <svg viewBox="0 0 64 64">
      <path d="M14 16 L18 8 L22 16 Z" fill="#dc2626" stroke={STROKE} strokeWidth={STROKE_W} />
      <path d="M50 16 L46 8 L42 16 Z" fill="#dc2626" stroke={STROKE} strokeWidth={STROKE_W} />
      <Body pal={pal} />
      <Eyes pupil="#fbbf24" />
      <path d="M27 40 Q32 44 37 40" stroke={STROKE} strokeWidth="1.4" fill="none" />
    </svg>
  );
}
function Rattlesnake() {
  const pal: Palette = { body: "#65a30d", bodyDark: "#365314", belly: "#fde68a" };
  return (
    <svg viewBox="0 0 64 64">
      <Body pal={pal} />
      <path d="M14 30 Q20 26 26 30 Q32 34 38 30 Q44 26 50 30" stroke={pal.bodyDark} strokeWidth="3" fill="none" />
      <Eyes pupil="#dc2626" />
      <path d="M28 36 L32 42 L36 36 Z" fill={STROKE} />
      <path d="M50 50 L54 54 L52 56 L48 52 Z" fill="#a16207" stroke={STROKE} strokeWidth="1.2" />
    </svg>
  );
}
function Scorpion() {
  const pal: Palette = { body: "#7f1d1d", bodyDark: "#3f0a0a", belly: "#fbbf24" };
  return (
    <svg viewBox="0 0 64 64">
      <Body pal={pal} />
      <path d="M50 22 L58 14 L60 8 L56 12 L52 18" stroke={pal.bodyDark} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M14 50 L8 56 L8 60" stroke={pal.bodyDark} strokeWidth="3" fill="none" strokeLinecap="round" />
      <Eyes pupil="#fbbf24" />
    </svg>
  );
}
function Camel() {
  const pal: Palette = { body: "#d4a373", bodyDark: "#7c4f23", belly: "#fef3c7" };
  return (
    <svg viewBox="0 0 64 64">
      <ellipse cx="20" cy="22" rx="6" ry="5" fill={pal.body} stroke={STROKE} strokeWidth={STROKE_W} />
      <ellipse cx="44" cy="22" rx="6" ry="5" fill={pal.body} stroke={STROKE} strokeWidth={STROKE_W} />
      <Body pal={pal} />
      <Eyes pupil="#7c2d12" />
      <ellipse cx="32" cy="38" rx="1.8" ry="1.2" fill={STROKE} />
    </svg>
  );
}
function FennecFox() {
  const pal: Palette = { body: "#fde68a", bodyDark: "#fbbf24", belly: "#fff" };
  return (
    <svg viewBox="0 0 64 64">
      <path d="M10 22 L18 4 L26 20 Z" fill={pal.body} stroke={STROKE} strokeWidth={STROKE_W} />
      <path d="M54 22 L46 4 L38 20 Z" fill={pal.body} stroke={STROKE} strokeWidth={STROKE_W} />
      <Body pal={pal} />
      <Eyes pupil="#7c2d12" />
      <ellipse cx="32" cy="38" rx="1.8" ry="1.2" fill={STROKE} />
      <SmallSmile cy={42} />
    </svg>
  );
}
function Fish() {
  const pal: Palette = { body: "#38bdf8", bodyDark: "#0c4a6e", belly: "#bae6fd" };
  return (
    <svg viewBox="0 0 64 64">
      <Body pal={pal} />
      <path d="M50 30 L60 22 L60 42 L50 36 Z" fill={pal.body} stroke={STROKE} strokeWidth={STROKE_W} />
      <Eyes pupil="#0c4a6e" />
      <path d="M22 38 Q26 40 30 38" stroke={STROKE} strokeWidth="1.4" fill="none" />
    </svg>
  );
}
function SeaHorse() {
  const pal: Palette = { body: "#f472b6", bodyDark: "#9d174d", belly: "#fbcfe8" };
  return (
    <svg viewBox="0 0 64 64">
      <Body pal={pal} />
      <path d="M14 16 L22 12 L26 22" fill="none" stroke={pal.bodyDark} strokeWidth="3" strokeLinecap="round" />
      <Eyes />
      <path d="M30 50 Q34 56 30 60" fill="none" stroke={pal.bodyDark} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
function Starfish() {
  return (
    <svg viewBox="0 0 64 64">
      <path
        d="M32 6 L38 26 L60 28 L42 40 L48 60 L32 48 L16 60 L22 40 L4 28 L26 26 Z"
        fill="#fbbf24"
        stroke={STROKE}
        strokeWidth={STROKE_W}
      />
      <Eyes cy={34} />
      <SmallSmile cy={42} />
    </svg>
  );
}
function Shark() {
  const pal: Palette = { body: "#475569", bodyDark: "#1e293b", belly: "#cbd5e1" };
  return (
    <svg viewBox="0 0 64 64">
      <Body pal={pal} />
      <path d="M30 12 L34 4 L38 20 Z" fill={pal.bodyDark} stroke={STROKE} strokeWidth={STROKE_W} />
      <ellipse cx="32" cy="44" rx="14" ry="10" fill={pal.belly} opacity="0.9" />
      <Eyes pupil="#dc2626" />
      <path d="M22 36 L42 36 L40 42 L24 42 Z" fill={STROKE} />
      {[26, 30, 34, 38].map((x, i) => (
        <path key={i} d={`M${x} 36 L${x} 42`} stroke="#fff" strokeWidth="1" />
      ))}
    </svg>
  );
}
function BlueWhale() {
  const pal: Palette = { body: "#1e40af", bodyDark: "#0c1e4d", belly: "#bfdbfe" };
  return (
    <svg viewBox="0 0 64 64">
      <Body pal={pal} />
      <ellipse cx="32" cy="42" rx="18" ry="10" fill={pal.belly} opacity="0.85" />
      <path d="M50 30 L62 22 L60 42 L50 36 Z" fill={pal.body} stroke={STROKE} strokeWidth={STROKE_W} />
      <Eyes cy={28} />
      <path d="M22 38 Q26 40 30 38" stroke={STROKE} strokeWidth="1.4" fill="none" />
      <path d="M28 12 L30 4 M30 12 L32 4 M32 12 L34 4" stroke="#bfdbfe" strokeWidth="1.4" />
    </svg>
  );
}
function DeveloperMonkey() {
  const pal: Palette = { body: "#451a03", bodyDark: "#0a0a0a", belly: "#f5d0a9" };
  return (
    <svg viewBox="0 0 64 64">
      <circle cx="16" cy="20" r="6" fill={pal.body} stroke={STROKE} strokeWidth={STROKE_W} />
      <circle cx="48" cy="20" r="6" fill={pal.body} stroke={STROKE} strokeWidth={STROKE_W} />
      <Body pal={pal} />
      <ellipse cx="32" cy="38" rx="11" ry="8" fill={pal.belly} />
      {/* Glasses */}
      <circle cx="25" cy="30" r="4" fill="#000" stroke="#fff" strokeWidth="1" />
      <circle cx="39" cy="30" r="4" fill="#000" stroke="#fff" strokeWidth="1" />
      <line x1="29" y1="30" x2="35" y2="30" stroke="#fff" strokeWidth="1.4" />
      <text x="22" y="32" fontSize="3.6" fill="#22d3ee" fontFamily="monospace">{"01"}</text>
      <text x="36" y="32" fontSize="3.6" fill="#22d3ee" fontFamily="monospace">{"10"}</text>
      <ellipse cx="32" cy="38" rx="1.6" ry="1" fill={STROKE} />
      <path d="M28 42 Q32 45 36 42" stroke={STROKE} strokeWidth="1.4" fill="none" />
    </svg>
  );
}
function ScalyDemon() {
  const pal: Palette = { body: "#7f1d1d", bodyDark: "#3f0a0a", belly: "#facc15" };
  return (
    <svg viewBox="0 0 64 64">
      <path d="M12 14 L8 0 L24 12 Z" fill={pal.bodyDark} stroke={STROKE} strokeWidth={STROKE_W} />
      <path d="M52 14 L56 0 L40 12 Z" fill={pal.bodyDark} stroke={STROKE} strokeWidth={STROKE_W} />
      <Body pal={pal} />
      <path d="M22 14 L26 8 L30 14 L34 8 L38 14 L42 8 L46 14" stroke={pal.bodyDark} strokeWidth="2.4" fill="none" />
      <circle cx="25" cy="30" r="3.5" fill="#facc15" />
      <circle cx="39" cy="30" r="3.5" fill="#facc15" />
      <circle cx="25" cy="30" r="1.4" fill={STROKE} />
      <circle cx="39" cy="30" r="1.4" fill={STROKE} />
      <path d="M24 38 L32 44 L40 38 Z" fill={STROKE} />
      <path d="M27 41 L27 45" stroke="#fff" strokeWidth="1.4" />
      <path d="M37 41 L37 45" stroke="#fff" strokeWidth="1.4" />
    </svg>
  );
}
function Megalodon() {
  const pal: Palette = { body: "#1e293b", bodyDark: "#020617", belly: "#475569" };
  return (
    <svg viewBox="0 0 64 64">
      <Body pal={pal} />
      <path d="M30 8 L36 0 L40 22 Z" fill={pal.bodyDark} stroke={STROKE} strokeWidth={STROKE_W} />
      <ellipse cx="32" cy="44" rx="16" ry="11" fill={pal.belly} opacity="0.7" />
      <circle cx="25" cy="28" r="3.5" fill="#dc2626" />
      <circle cx="39" cy="28" r="3.5" fill="#dc2626" />
      <circle cx="25" cy="28" r="1.4" fill="#fff" />
      <circle cx="39" cy="28" r="1.4" fill="#fff" />
      <path d="M14 36 L50 36 L46 46 L18 46 Z" fill={STROKE} />
      {[20, 26, 32, 38, 44].map((x, i) => (
        <path key={i} d={`M${x} 36 L${x - 1} 44 L${x + 1} 44 Z`} fill="#fff" />
      ))}
      <text x="6" y="20" fontSize="8" fill="#dc2626" fontWeight="900">✦</text>
    </svg>
  );
}

// ---- NEW PETS ----

function BloodWerewolf() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <Body pal={{ body: "#7c1a1a", bodyDark: "#4a0d0d", belly: "#b22222", accent: "#ef4444" }}>
        {/* Ears */}
        <polygon points="14,18 10,6 20,14" fill="#7c1a1a" stroke={STROKE} strokeWidth="1.5" />
        <polygon points="50,18 54,6 44,14" fill="#7c1a1a" stroke={STROKE} strokeWidth="1.5" />
        {/* Eyes */}
        <circle cx="25" cy="32" r="4" fill="#ff2200" />
        <circle cx="39" cy="32" r="4" fill="#ff2200" />
        <circle cx="25" cy="32" r="1.5" fill="#000" />
        <circle cx="39" cy="32" r="1.5" fill="#000" />
        {/* Claws */}
        <path d="M12 52 L9 58 M14 52 L12 59 M16 52 L15 59" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M52 52 L55 58 M50 52 L52 59 M48 52 L49 59" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
      </Body>
    </svg>
  );
}

function BattleBoar() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <Body pal={{ body: "#78350f", bodyDark: "#451a03", belly: "#a16207", accent: "#f59e0b" }}>
        {/* Tusks */}
        <ellipse cx="22" cy="52" rx="5" ry="2.5" fill="#fef9c3" stroke={STROKE} strokeWidth="1.2" transform="rotate(-30 22 52)" />
        <ellipse cx="42" cy="52" rx="5" ry="2.5" fill="#fef9c3" stroke={STROKE} strokeWidth="1.2" transform="rotate(30 42 52)" />
        {/* Snout */}
        <ellipse cx="32" cy="44" rx="9" ry="7" fill="#92400e" stroke={STROKE} strokeWidth="1.5" />
        <circle cx="29" cy="44" r="2" fill={STROKE} />
        <circle cx="35" cy="44" r="2" fill={STROKE} />
        {/* Eyes */}
        <circle cx="23" cy="30" r="3.5" fill="#fef08a" /><circle cx="23" cy="30" r="1.5" fill="#000" />
        <circle cx="41" cy="30" r="3.5" fill="#fef08a" /><circle cx="41" cy="30" r="1.5" fill="#000" />
        {/* Armor plate */}
        <rect x="20" y="35" width="24" height="6" rx="2" fill="#6b7280" opacity="0.7" stroke={STROKE} strokeWidth="1" />
      </Body>
    </svg>
  );
}

function StormHawk() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <Body pal={{ body: "#1e3a5f", bodyDark: "#0f1f3d", belly: "#3b82f6", accent: "#93c5fd" }}>
        {/* Wings */}
        <ellipse cx="8" cy="36" rx="9" ry="5" fill="#1e40af" stroke={STROKE} strokeWidth="1.2" transform="rotate(-20 8 36)" />
        <ellipse cx="56" cy="36" rx="9" ry="5" fill="#1e40af" stroke={STROKE} strokeWidth="1.2" transform="rotate(20 56 36)" />
        {/* Beak */}
        <polygon points="32,40 27,48 37,48" fill="#f59e0b" stroke={STROKE} strokeWidth="1.2" />
        {/* Eyes */}
        <circle cx="24" cy="30" r="4" fill="#facc15" /><circle cx="24" cy="30" r="2" fill="#000" />
        <circle cx="40" cy="30" r="4" fill="#facc15" /><circle cx="40" cy="30" r="2" fill="#000" />
        {/* Lightning bolt */}
        <path d="M30 14 L27 22 L31 22 L28 30" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </Body>
    </svg>
  );
}

function MagmaBear() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <Body pal={{ body: "#9a3412", bodyDark: "#431407", belly: "#ea580c", accent: "#f97316" }}>
        {/* Ears */}
        <circle cx="16" cy="16" r="6" fill="#9a3412" stroke={STROKE} strokeWidth="1.5" />
        <circle cx="48" cy="16" r="6" fill="#9a3412" stroke={STROKE} strokeWidth="1.5" />
        <circle cx="16" cy="16" r="3" fill="#dc2626" />
        <circle cx="48" cy="16" r="3" fill="#dc2626" />
        {/* Snout */}
        <ellipse cx="32" cy="44" rx="10" ry="7" fill="#c2410c" stroke={STROKE} strokeWidth="1.5" />
        {/* Lava cracks */}
        <path d="M20 30 L24 38 M40 28 L38 36 M30 20 L32 28" stroke="#facc15" strokeWidth="1.5" strokeLinecap="round" />
        {/* Eyes */}
        <circle cx="23" cy="29" r="4" fill="#ff6600" /><circle cx="23" cy="29" r="2" fill="#000" />
        <circle cx="41" cy="29" r="4" fill="#ff6600" /><circle cx="41" cy="29" r="2" fill="#000" />
      </Body>
    </svg>
  );
}

function IronColossus() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <Body pal={{ body: "#374151", bodyDark: "#111827", belly: "#6b7280", accent: "#9ca3af" }}>
        {/* Armor plates */}
        <rect x="18" y="28" width="28" height="20" rx="3" fill="#4b5563" stroke={STROKE} strokeWidth="1.2" />
        <rect x="22" y="28" width="20" height="5" rx="1.5" fill="#6b7280" />
        {/* Rivets */}
        <circle cx="22" cy="38" r="1.5" fill="#9ca3af" />
        <circle cx="32" cy="38" r="1.5" fill="#9ca3af" />
        <circle cx="42" cy="38" r="1.5" fill="#9ca3af" />
        {/* Eyes glowing */}
        <circle cx="24" cy="27" r="4" fill="#60a5fa" /><circle cx="24" cy="27" r="2" fill="#1d4ed8" />
        <circle cx="40" cy="27" r="4" fill="#60a5fa" /><circle cx="40" cy="27" r="2" fill="#1d4ed8" />
        {/* Head gear */}
        <rect x="16" y="18" width="32" height="8" rx="2" fill="#374151" stroke={STROKE} strokeWidth="1.2" />
      </Body>
    </svg>
  );
}

function TitanRhino() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <Body pal={{ body: "#4b5563", bodyDark: "#1f2937", belly: "#6b7280", accent: "#d1d5db" }}>
        {/* Horn */}
        <polygon points="32,8 27,20 37,20" fill="#d1d5db" stroke={STROKE} strokeWidth="1.5" />
        {/* Snout */}
        <ellipse cx="32" cy="44" rx="11" ry="7" fill="#6b7280" stroke={STROKE} strokeWidth="1.5" />
        {/* Nostrils */}
        <ellipse cx="27" cy="45" rx="2.5" ry="1.5" fill={STROKE} />
        <ellipse cx="37" cy="45" rx="2.5" ry="1.5" fill={STROKE} />
        {/* Eyes */}
        <circle cx="22" cy="30" r="4" fill="#6ee7b7" /><circle cx="22" cy="30" r="2" fill="#000" />
        <circle cx="42" cy="30" r="4" fill="#6ee7b7" /><circle cx="42" cy="30" r="2" fill="#000" />
        {/* Armor ridges */}
        <path d="M14 36 Q20 32 32 34 Q44 32 50 36" stroke="#d1d5db" strokeWidth="1.5" fill="none" />
      </Body>
    </svg>
  );
}

function EclipseSerpent() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <Body pal={{ body: "#1e1b4b", bodyDark: "#0d0b24", belly: "#4c1d95", accent: "#a78bfa" }}>
        {/* Eclipse ring */}
        <circle cx="32" cy="30" r="18" fill="none" stroke="#a78bfa" strokeWidth="2" opacity="0.6" />
        <circle cx="32" cy="30" r="12" fill="none" stroke="#7c3aed" strokeWidth="2" opacity="0.5" />
        {/* Fangs */}
        <polygon points="27,52 25,60 29,54" fill="#c4b5fd" stroke={STROKE} strokeWidth="1" />
        <polygon points="37,52 35,54 39,60" fill="#c4b5fd" stroke={STROKE} strokeWidth="1" />
        {/* Eyes */}
        <ellipse cx="24" cy="30" rx="4" ry="5" fill="#a78bfa" /><circle cx="24" cy="30" r="2" fill="#000" />
        <ellipse cx="40" cy="30" rx="4" ry="5" fill="#a78bfa" /><circle cx="40" cy="30" r="2" fill="#000" />
      </Body>
    </svg>
  );
}

function SpectralWolf() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <Body pal={{ body: "#312e81", bodyDark: "#1e1b4b", belly: "#4338ca", accent: "#818cf8" }}>
        {/* Ghost aura */}
        <ellipse cx="32" cy="32" rx="26" ry="24" fill="#818cf8" opacity="0.1" />
        {/* Ears */}
        <polygon points="15,20 10,8 22,16" fill="#312e81" stroke={STROKE} strokeWidth="1.2" />
        <polygon points="49,20 54,8 42,16" fill="#312e81" stroke={STROKE} strokeWidth="1.2" />
        {/* Snout */}
        <ellipse cx="32" cy="44" rx="9" ry="6" fill="#4338ca" stroke={STROKE} strokeWidth="1.2" />
        {/* Eyes */}
        <circle cx="23" cy="30" r="4" fill="#a5b4fc" /><circle cx="23" cy="30" r="2" fill="#000" />
        <circle cx="41" cy="30" r="4" fill="#a5b4fc" /><circle cx="41" cy="30" r="2" fill="#000" />
        {/* Sparkles */}
        <circle cx="12" cy="22" r="1.5" fill="#e0e7ff" opacity="0.8" />
        <circle cx="52" cy="18" r="1" fill="#e0e7ff" opacity="0.8" />
        <circle cx="46" cy="50" r="1.5" fill="#e0e7ff" opacity="0.6" />
      </Body>
    </svg>
  );
}

function WarPhoenix() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <Body pal={{ body: "#b91c1c", bodyDark: "#7f1d1d", belly: "#f97316", accent: "#fbbf24" }}>
        {/* Wings */}
        <path d="M6 30 Q2 20 10 12 Q16 22 12 34Z" fill="#dc2626" stroke={STROKE} strokeWidth="1.2" />
        <path d="M58 30 Q62 20 54 12 Q48 22 52 34Z" fill="#dc2626" stroke={STROKE} strokeWidth="1.2" />
        {/* Crest feathers */}
        <path d="M28 16 L26 6 L30 14" fill="#fbbf24" stroke={STROKE} strokeWidth="1" />
        <path d="M32 14 L32 4 L35 12" fill="#f97316" stroke={STROKE} strokeWidth="1" />
        <path d="M36 16 L38 6 L34 14" fill="#fbbf24" stroke={STROKE} strokeWidth="1" />
        {/* Eyes */}
        <circle cx="24" cy="30" r="4" fill="#fbbf24" /><circle cx="24" cy="30" r="2" fill="#000" />
        <circle cx="40" cy="30" r="4" fill="#fbbf24" /><circle cx="40" cy="30" r="2" fill="#000" />
        {/* Beak */}
        <polygon points="32,44 27,52 37,52" fill="#fbbf24" stroke={STROKE} strokeWidth="1.2" />
      </Body>
    </svg>
  );
}

function VoidStalker() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <Body pal={{ body: "#0f0f1a", bodyDark: "#000005", belly: "#1e1040", accent: "#7c3aed" }}>
        {/* Void tendrils */}
        <path d="M10 40 Q6 30 12 22 Q16 32 14 42Z" fill="#4c1d95" opacity="0.7" />
        <path d="M54 40 Q58 30 52 22 Q48 32 50 42Z" fill="#4c1d95" opacity="0.7" />
        {/* Eyes */}
        <circle cx="23" cy="30" r="5" fill="#7c3aed" /><circle cx="23" cy="30" r="2.5" fill="#000" />
        <circle cx="41" cy="30" r="5" fill="#7c3aed" /><circle cx="41" cy="30" r="2.5" fill="#000" />
        {/* Void glow */}
        <ellipse cx="32" cy="36" rx="14" ry="8" fill="#4c1d95" opacity="0.3" />
        {/* Stars */}
        <circle cx="16" cy="16" r="1" fill="#c4b5fd" />
        <circle cx="48" cy="14" r="1.5" fill="#c4b5fd" />
        <circle cx="52" cy="48" r="1" fill="#c4b5fd" />
      </Body>
    </svg>
  );
}

function NebulaSerpent() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <Body pal={{ body: "#0d1b4b", bodyDark: "#050a1f", belly: "#1e40af", accent: "#60a5fa" }}>
        {/* Nebula swirls */}
        <ellipse cx="32" cy="28" rx="18" ry="14" fill="#a855f7" opacity="0.2" />
        <ellipse cx="32" cy="36" rx="12" ry="8" fill="#06b6d4" opacity="0.2" />
        {/* Scales pattern */}
        <path d="M18 32 Q24 28 32 30 Q40 28 46 32 Q40 36 32 34 Q24 36 18 32Z" fill="#1e40af" opacity="0.6" />
        {/* Fangs */}
        <path d="M27 52 L25 60 M37 52 L39 60" stroke="#e0f2fe" strokeWidth="2" strokeLinecap="round" />
        {/* Eyes */}
        <ellipse cx="24" cy="29" rx="4" ry="5" fill="#60a5fa" /><circle cx="24" cy="29" r="2" fill="#000" />
        <ellipse cx="40" cy="29" rx="4" ry="5" fill="#60a5fa" /><circle cx="40" cy="29" r="2" fill="#000" />
      </Body>
    </svg>
  );
}

function StormGiant() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <Body pal={{ body: "#1f2937", bodyDark: "#030712", belly: "#374151", accent: "#facc15" }}>
        {/* Storm clouds */}
        <ellipse cx="18" cy="20" rx="8" ry="5" fill="#374151" opacity="0.8" />
        <ellipse cx="46" cy="18" rx="8" ry="5" fill="#374151" opacity="0.8" />
        {/* Lightning bolts */}
        <path d="M22 16 L19 24 L23 24 L20 32" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
        <path d="M44 14 L41 22 L45 22 L42 30" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
        {/* Eyes */}
        <circle cx="24" cy="32" r="4" fill="#facc15" /><circle cx="24" cy="32" r="2" fill="#000" />
        <circle cx="40" cy="32" r="4" fill="#facc15" /><circle cx="40" cy="32" r="2" fill="#000" />
        {/* Giant body glow */}
        <ellipse cx="32" cy="40" rx="16" ry="8" fill="#fde047" opacity="0.1" />
      </Body>
    </svg>
  );
}

function VoidHydra() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <Body pal={{ body: "#134e4a", bodyDark: "#042f2e", belly: "#0f766e", accent: "#5eead4" }}>
        {/* Three heads (simplified) */}
        <circle cx="18" cy="14" r="7" fill="#0d9488" stroke={STROKE} strokeWidth="1.2" />
        <circle cx="32" cy="10" r="7" fill="#0d9488" stroke={STROKE} strokeWidth="1.2" />
        <circle cx="46" cy="14" r="7" fill="#0d9488" stroke={STROKE} strokeWidth="1.2" />
        {/* Head eyes */}
        <circle cx="16" cy="13" r="2" fill="#5eead4" /><circle cx="20" cy="13" r="2" fill="#5eead4" />
        <circle cx="30" cy="9" r="2" fill="#5eead4" /><circle cx="34" cy="9" r="2" fill="#5eead4" />
        <circle cx="44" cy="13" r="2" fill="#5eead4" /><circle cx="48" cy="13" r="2" fill="#5eead4" />
        {/* Body */}
        <ellipse cx="32" cy="40" rx="20" ry="14" fill="#0f766e" stroke={STROKE} strokeWidth="1.5" />
        {/* Scales */}
        <path d="M14 38 Q24 34 32 36 Q40 34 50 38" stroke="#5eead4" strokeWidth="1" fill="none" opacity="0.5" />
      </Body>
    </svg>
  );
}

function ChaosTitan() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <Body pal={{ body: "#1a0533", bodyDark: "#0a0014", belly: "#4c1d95", accent: "#e879f9" }}>
        {/* Chaos aura rings */}
        <circle cx="32" cy="32" r="28" fill="none" stroke="#e879f9" strokeWidth="1" opacity="0.3" />
        <circle cx="32" cy="32" r="22" fill="none" stroke="#a855f7" strokeWidth="1" opacity="0.4" />
        {/* Horns */}
        <polygon points="22,20 16,4 26,16" fill="#c026d3" stroke={STROKE} strokeWidth="1.2" />
        <polygon points="42,20 48,4 38,16" fill="#c026d3" stroke={STROKE} strokeWidth="1.2" />
        {/* Eyes */}
        <circle cx="23" cy="30" r="5" fill="#e879f9" /><circle cx="23" cy="30" r="2.5" fill="#000" />
        <circle cx="41" cy="30" r="5" fill="#e879f9" /><circle cx="41" cy="30" r="2.5" fill="#000" />
        {/* Third eye */}
        <circle cx="32" cy="22" r="3" fill="#f0abfc" /><circle cx="32" cy="22" r="1.5" fill="#000" />
        {/* Chaos sparks */}
        <circle cx="10" cy="24" r="1.5" fill="#e879f9" opacity="0.8" />
        <circle cx="54" cy="20" r="1.5" fill="#e879f9" opacity="0.8" />
        <circle cx="14" cy="48" r="2" fill="#a855f7" opacity="0.7" />
        <circle cx="50" cy="50" r="1" fill="#e879f9" opacity="0.9" />
      </Body>
    </svg>
  );
}

function ArcticFox() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <Body pal={{ body: "#e0f2fe", bodyDark: "#bae6fd", belly: "#f0f9ff", accent: "#7dd3fc" }}>
        {/* Pointed ears */}
        <polygon points="16,22 12,8 22,18" fill="#e0f2fe" stroke={STROKE} strokeWidth="1.2" />
        <polygon points="48,22 52,8 42,18" fill="#e0f2fe" stroke={STROKE} strokeWidth="1.2" />
        <polygon points="16,20 13,10 20,16" fill="#bae6fd" />
        <polygon points="48,20 51,10 44,16" fill="#bae6fd" />
        {/* Snout */}
        <ellipse cx="32" cy="44" rx="9" ry="6" fill="#bae6fd" stroke={STROKE} strokeWidth="1.2" />
        <circle cx="32" cy="42" r="2" fill="#94a3b8" />
        {/* Eyes */}
        <circle cx="23" cy="30" r="4" fill="#7dd3fc" /><circle cx="23" cy="30" r="2" fill="#000" />
        <circle cx="41" cy="30" r="4" fill="#7dd3fc" /><circle cx="41" cy="30" r="2" fill="#000" />
      </Body>
    </svg>
  );
}

function PolarBear() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <Body pal={{ body: "#f8fafc", bodyDark: "#e2e8f0", belly: "#fff", accent: "#94a3b8" }}>
        {/* Ears */}
        <circle cx="16" cy="16" r="7" fill="#f1f5f9" stroke={STROKE} strokeWidth="1.5" />
        <circle cx="48" cy="16" r="7" fill="#f1f5f9" stroke={STROKE} strokeWidth="1.5" />
        <circle cx="16" cy="16" r="4" fill="#e2e8f0" />
        <circle cx="48" cy="16" r="4" fill="#e2e8f0" />
        {/* Snout */}
        <ellipse cx="32" cy="44" rx="11" ry="7" fill="#f1f5f9" stroke={STROKE} strokeWidth="1.5" />
        <circle cx="32" cy="42" r="3" fill="#94a3b8" />
        {/* Eyes */}
        <circle cx="23" cy="29" r="4" fill="#000" /><circle cx="23" cy="28" r="1.5" fill="#fff" />
        <circle cx="41" cy="29" r="4" fill="#000" /><circle cx="41" cy="28" r="1.5" fill="#fff" />
      </Body>
    </svg>
  );
}

function SnowLeopard() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <Body pal={{ body: "#f0f9ff", bodyDark: "#bae6fd", belly: "#fff", accent: "#475569" }}>
        {/* Spots */}
        <circle cx="20" cy="26" r="3" fill="#94a3b8" opacity="0.6" />
        <circle cx="40" cy="22" r="3" fill="#94a3b8" opacity="0.6" />
        <circle cx="28" cy="18" r="2.5" fill="#94a3b8" opacity="0.5" />
        <circle cx="44" cy="36" r="3" fill="#94a3b8" opacity="0.6" />
        <circle cx="16" cy="40" r="2.5" fill="#94a3b8" opacity="0.5" />
        {/* Ears */}
        <polygon points="16,22 12,8 22,18" fill="#f0f9ff" stroke={STROKE} strokeWidth="1.2" />
        <polygon points="48,22 52,8 42,18" fill="#f0f9ff" stroke={STROKE} strokeWidth="1.2" />
        {/* Snout */}
        <ellipse cx="32" cy="44" rx="9" ry="6" fill="#e2e8f0" stroke={STROKE} strokeWidth="1.2" />
        <circle cx="32" cy="42" r="2" fill="#64748b" />
        {/* Eyes */}
        <circle cx="23" cy="30" r="4" fill="#a3e635" /><circle cx="23" cy="30" r="2" fill="#000" />
        <circle cx="41" cy="30" r="4" fill="#a3e635" /><circle cx="41" cy="30" r="2" fill="#000" />
      </Body>
    </svg>
  );
}

function IceDragon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <Body pal={{ body: "#0ea5e9", bodyDark: "#0369a1", belly: "#7dd3fc", accent: "#e0f2fe" }}>
        {/* Wings */}
        <path d="M6 32 Q2 18 12 12 Q16 24 12 36Z" fill="#0284c7" stroke={STROKE} strokeWidth="1" />
        <path d="M58 32 Q62 18 52 12 Q48 24 52 36Z" fill="#0284c7" stroke={STROKE} strokeWidth="1" />
        {/* Horns */}
        <polygon points="26,18 22,6 29,15" fill="#bae6fd" stroke={STROKE} strokeWidth="1" />
        <polygon points="38,18 42,6 35,15" fill="#bae6fd" stroke={STROKE} strokeWidth="1" />
        {/* Scales */}
        <path d="M18 30 Q26 26 32 28 Q38 26 46 30" stroke="#e0f2fe" strokeWidth="1.5" fill="none" opacity="0.6" />
        {/* Eyes */}
        <circle cx="24" cy="28" r="4" fill="#e0f2fe" /><circle cx="24" cy="28" r="2" fill="#000" />
        <circle cx="40" cy="28" r="4" fill="#e0f2fe" /><circle cx="40" cy="28" r="2" fill="#000" />
      </Body>
    </svg>
  );
}

function FrostTitan() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <Body pal={{ body: "#0c4a6e", bodyDark: "#082f49", belly: "#0ea5e9", accent: "#e0f2fe" }}>
        {/* Ice crown */}
        <polygon points="20,20 17,6 23,12" fill="#bae6fd" stroke={STROKE} strokeWidth="1" />
        <polygon points="28,18 28,4 33,10" fill="#e0f2fe" stroke={STROKE} strokeWidth="1" />
        <polygon points="36,18 36,4 41,10" fill="#bae6fd" stroke={STROKE} strokeWidth="1" />
        <polygon points="44,20 47,6 41,12" fill="#e0f2fe" stroke={STROKE} strokeWidth="1" />
        {/* Frost armor */}
        <rect x="18" y="30" width="28" height="18" rx="3" fill="#075985" stroke="#bae6fd" strokeWidth="1" />
        {/* Eyes */}
        <circle cx="24" cy="26" r="4" fill="#bae6fd" /><circle cx="24" cy="26" r="2" fill="#000" />
        <circle cx="40" cy="26" r="4" fill="#bae6fd" /><circle cx="40" cy="26" r="2" fill="#000" />
        {/* Glow */}
        <ellipse cx="32" cy="44" rx="18" ry="6" fill="#7dd3fc" opacity="0.15" />
      </Body>
    </svg>
  );
}

function RuneStone() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <Body pal={{ body: "#44403c", bodyDark: "#1c1917", belly: "#78716c", accent: "#fcd34d" }}>
        {/* Stone texture */}
        <rect x="14" y="18" width="36" height="32" rx="4" fill="#57534e" stroke={STROKE} strokeWidth="1.5" />
        {/* Runes */}
        <path d="M22 28 L22 38 M22 33 L28 28 M22 33 L28 38" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" />
        <path d="M34 28 L34 38 M34 28 L40 38 M34 33 L40 33" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" />
        {/* Glow */}
        <rect x="14" y="18" width="36" height="32" rx="4" fill="#fcd34d" opacity="0.08" />
        {/* Eyes */}
        <circle cx="24" cy="48" r="3" fill="#fcd34d" /><circle cx="24" cy="48" r="1.5" fill="#000" />
        <circle cx="40" cy="48" r="3" fill="#fcd34d" /><circle cx="40" cy="48" r="1.5" fill="#000" />
      </Body>
    </svg>
  );
}

function AstralWolf() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <Body pal={{ body: "#1e1b4b", bodyDark: "#0d0b24", belly: "#4338ca", accent: "#c7d2fe" }}>
        {/* Star particles */}
        <circle cx="12" cy="14" r="1.5" fill="#c7d2fe" opacity="0.9" />
        <circle cx="52" cy="12" r="1" fill="#c7d2fe" opacity="0.9" />
        <circle cx="48" cy="50" r="1.5" fill="#a5b4fc" opacity="0.8" />
        <circle cx="14" cy="50" r="1" fill="#c7d2fe" opacity="0.7" />
        {/* Ears */}
        <polygon points="15,22 10,8 22,16" fill="#1e1b4b" stroke={STROKE} strokeWidth="1.2" />
        <polygon points="49,22 54,8 42,16" fill="#1e1b4b" stroke={STROKE} strokeWidth="1.2" />
        {/* Cosmic aura */}
        <ellipse cx="32" cy="32" rx="22" ry="20" fill="#4338ca" opacity="0.1" />
        {/* Snout */}
        <ellipse cx="32" cy="44" rx="8" ry="5" fill="#4338ca" stroke={STROKE} strokeWidth="1.2" />
        {/* Eyes */}
        <circle cx="23" cy="30" r="4" fill="#c7d2fe" /><circle cx="23" cy="30" r="2" fill="#000" />
        <circle cx="41" cy="30" r="4" fill="#c7d2fe" /><circle cx="41" cy="30" r="2" fill="#000" />
      </Body>
    </svg>
  );
}

function RealityFox() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <Body pal={{ body: "#7c3aed", bodyDark: "#4c1d95", belly: "#a78bfa", accent: "#fde68a" }}>
        {/* Pointed ears */}
        <polygon points="16,22 10,6 22,16" fill="#7c3aed" stroke={STROKE} strokeWidth="1.2" />
        <polygon points="48,22 54,6 42,16" fill="#7c3aed" stroke={STROKE} strokeWidth="1.2" />
        <polygon points="16,20 12,8 20,14" fill="#a78bfa" />
        <polygon points="48,20 52,8 44,14" fill="#a78bfa" />
        {/* Reality fractures */}
        <path d="M20 32 L28 28 L24 36 L32 30 L28 38" stroke="#fde68a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Snout */}
        <ellipse cx="32" cy="44" rx="9" ry="6" fill="#6d28d9" stroke={STROKE} strokeWidth="1.2" />
        <circle cx="32" cy="42" r="2" fill="#fde68a" />
        {/* Eyes */}
        <circle cx="23" cy="30" r="4" fill="#fde68a" /><circle cx="23" cy="30" r="2" fill="#000" />
        <circle cx="41" cy="30" r="4" fill="#fde68a" /><circle cx="41" cy="30" r="2" fill="#000" />
      </Body>
    </svg>
  );
}

function InfinityDrake() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <Body pal={{ body: "#14532d", bodyDark: "#052e16", belly: "#16a34a", accent: "#86efac" }}>
        {/* Infinity symbol */}
        <path d="M16 30 Q20 24 26 30 Q20 36 16 30Z" fill="none" stroke="#86efac" strokeWidth="2" />
        <path d="M48 30 Q44 24 38 30 Q44 36 48 30Z" fill="none" stroke="#86efac" strokeWidth="2" />
        <path d="M26 30 L38 30" stroke="#86efac" strokeWidth="2" />
        {/* Wings */}
        <path d="M8 34 Q4 22 12 16 Q16 26 12 36Z" fill="#166534" stroke={STROKE} strokeWidth="1" />
        <path d="M56 34 Q60 22 52 16 Q48 26 52 36Z" fill="#166534" stroke={STROKE} strokeWidth="1" />
        {/* Eyes */}
        <circle cx="24" cy="28" r="4" fill="#86efac" /><circle cx="24" cy="28" r="2" fill="#000" />
        <circle cx="40" cy="28" r="4" fill="#86efac" /><circle cx="40" cy="28" r="2" fill="#000" />
      </Body>
    </svg>
  );
}

function PrimordialGod() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <Body pal={{ body: "#1a0533", bodyDark: "#0a0014", belly: "#4c1d95", accent: "#fbbf24" }}>
        {/* Divine rings */}
        <circle cx="32" cy="32" r="26" fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.4" />
        <circle cx="32" cy="32" r="20" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.5" />
        {/* God horns */}
        <polygon points="22,18 18,2 28,14" fill="#fbbf24" stroke={STROKE} strokeWidth="1.2" />
        <polygon points="42,18 46,2 36,14" fill="#fbbf24" stroke={STROKE} strokeWidth="1.2" />
        {/* Halo */}
        <ellipse cx="32" cy="14" rx="16" ry="4" fill="none" stroke="#fbbf24" strokeWidth="2.5" opacity="0.7" />
        {/* Eyes */}
        <circle cx="23" cy="30" r="5" fill="#fbbf24" /><circle cx="23" cy="30" r="2.5" fill="#000" />
        <circle cx="41" cy="30" r="5" fill="#fbbf24" /><circle cx="41" cy="30" r="2.5" fill="#000" />
        {/* Third eye */}
        <circle cx="32" cy="21" r="3.5" fill="#fde68a" /><circle cx="32" cy="21" r="1.5" fill="#000" />
      </Body>
    </svg>
  );
}

function ArcticGuardian() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <Body pal={{ body: "#0c4a6e", bodyDark: "#042f2e", belly: "#0ea5e9", accent: "#f0f9ff" }}>
        {/* Massive ice armor */}
        <rect x="14" y="26" width="36" height="24" rx="4" fill="#0369a1" stroke="#bae6fd" strokeWidth="1.5" />
        {/* Shoulder guards */}
        <ellipse cx="14" cy="32" rx="7" ry="10" fill="#0284c7" stroke="#bae6fd" strokeWidth="1.2" />
        <ellipse cx="50" cy="32" rx="7" ry="10" fill="#0284c7" stroke="#bae6fd" strokeWidth="1.2" />
        {/* Ice spikes */}
        <polygon points="20,18 17,8 23,14" fill="#e0f2fe" stroke={STROKE} strokeWidth="1" />
        <polygon points="32,16 29,4 35,12" fill="#f0f9ff" stroke={STROKE} strokeWidth="1" />
        <polygon points="44,18 41,8 47,14" fill="#e0f2fe" stroke={STROKE} strokeWidth="1" />
        {/* Eyes */}
        <circle cx="24" cy="23" r="4" fill="#7dd3fc" /><circle cx="24" cy="23" r="2" fill="#000" />
        <circle cx="40" cy="23" r="4" fill="#7dd3fc" /><circle cx="40" cy="23" r="2" fill="#000" />
        {/* Glow */}
        <ellipse cx="32" cy="38" rx="20" ry="8" fill="#7dd3fc" opacity="0.1" />
      </Body>
    </svg>
  );
}

function PrimordialChaos() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <Body pal={{ body: "#040010", bodyDark: "#000000", belly: "#1a0030", accent: "#e879f9" }}>
        {/* Chaos rings */}
        <circle cx="32" cy="32" r="28" fill="none" stroke="#e879f9" strokeWidth="1" opacity="0.5" />
        <circle cx="32" cy="32" r="22" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity="0.5" />
        <circle cx="32" cy="32" r="16" fill="none" stroke="#7c3aed" strokeWidth="1" opacity="0.4" />
        {/* Chaos horns — many */}
        <polygon points="20,20 16,4 24,14" fill="#e879f9" stroke={STROKE} strokeWidth="1" />
        <polygon points="30,18 28,4 34,12" fill="#c026d3" stroke={STROKE} strokeWidth="1" />
        <polygon points="44,20 48,4 40,14" fill="#e879f9" stroke={STROKE} strokeWidth="1" />
        {/* Eyes — four */}
        <circle cx="21" cy="28" r="4" fill="#e879f9" /><circle cx="21" cy="28" r="2" fill="#000" />
        <circle cx="32" cy="24" r="3.5" fill="#f0abfc" /><circle cx="32" cy="24" r="1.5" fill="#000" />
        <circle cx="43" cy="28" r="4" fill="#e879f9" /><circle cx="43" cy="28" r="2" fill="#000" />
        {/* Chaos tendrils */}
        <path d="M8 32 Q12 20 20 28" stroke="#a855f7" strokeWidth="2" fill="none" opacity="0.7" />
        <path d="M56 32 Q52 20 44 28" stroke="#a855f7" strokeWidth="2" fill="none" opacity="0.7" />
      </Body>
    </svg>
  );
}

function AbsoluteZero() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <Body pal={{ body: "#000814", bodyDark: "#000000", belly: "#0c0a1e", accent: "#ffffff" }}>
        {/* Perfect white rings — absolute cold */}
        <circle cx="32" cy="32" r="26" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.5" />
        <circle cx="32" cy="32" r="20" fill="none" stroke="#e0f2fe" strokeWidth="1" opacity="0.4" />
        <circle cx="32" cy="32" r="14" fill="none" stroke="#bae6fd" strokeWidth="0.5" opacity="0.3" />
        {/* Crystal spires */}
        <polygon points="20,18 16,2 24,12" fill="#ffffff" stroke={STROKE} strokeWidth="1" />
        <polygon points="32,16 29,2 35,10" fill="#f0f9ff" stroke={STROKE} strokeWidth="1" />
        <polygon points="44,18 40,2 48,12" fill="#ffffff" stroke={STROKE} strokeWidth="1" />
        {/* Deep void eyes */}
        <circle cx="23" cy="28" r="5" fill="#ffffff" /><circle cx="23" cy="28" r="3" fill="#000" /><circle cx="22" cy="27" r="1" fill="#fff" />
        <circle cx="41" cy="28" r="5" fill="#ffffff" /><circle cx="41" cy="28" r="3" fill="#000" /><circle cx="40" cy="27" r="1" fill="#fff" />
        {/* 0K text */}
        <text x="28" y="47" fontSize="8" fill="#ffffff" fontFamily="monospace" fontWeight="bold">0K</text>
        {/* Frost aura */}
        <ellipse cx="32" cy="40" rx="20" ry="8" fill="#bae6fd" opacity="0.06" />
      </Body>
    </svg>
  );
}

const ART_MAP: Record<string, () => React.ReactElement> = {
  pup: Pup,
  bunny: Bunny,
  chick: Chick,
  mouse: Mouse,
  frog: Frog,
  cat: Cat,
  fox: Fox,
  raccoon: Raccoon,
  hedgehog: Hedgehog,
  wolf: Wolf,
  tiger: Tiger,
  panda: Panda,
  penguin: Penguin,
  leopard: Leopard,
  dragon: Dragon,
  griffin: Griffin,
  phoenix: Phoenix,
  "golden-dragon": GoldenDragon,
  "void-cat": VoidCat,
  "shadow-titan": ShadowTitan,
  "cosmic-serpent": CosmicSerpent,
  "cybernetic-dragon": CyberneticDragon,
  // New additions
  owl: Owl,
  rooster: Rooster,
  falcon: Falcon,
  yeti: Yeti,
  kraken: Kraken,
  thunderbird: Thunderbird,
  "celestial-stag": CelestialStag,
  "abyss-leviathan": AbyssLeviathan,
  monkey: Monkey,
  "tree-frog": TreeFrog,
  gorilla: Gorilla,
  toucan: Toucan,
  lion: Lion,
  "horned-gecko": HornedGecko,
  rattlesnake: Rattlesnake,
  scorpion: Scorpion,
  camel: Camel,
  "fennec-fox": FennecFox,
  fish: Fish,
  "sea-horse": SeaHorse,
  starfish: Starfish,
  shark: Shark,
  "blue-whale": BlueWhale,
  "developer-monkey": DeveloperMonkey,
  "scaly-demon": ScalyDemon,
  megalodon: Megalodon,
  // New shop pets
  "blood-werewolf": BloodWerewolf,
  "battle-boar": BattleBoar,
  "storm-hawk": StormHawk,
  "magma-bear": MagmaBear,
  "iron-colossus": IronColossus,
  "titan-rhino": TitanRhino,
  "eclipse-serpent": EclipseSerpent,
  "spectral-wolf": SpectralWolf,
  "war-phoenix": WarPhoenix,
  "void-stalker": VoidStalker,
  "nebula-serpent": NebulaSerpent,
  "storm-giant": StormGiant,
  "void-hydra": VoidHydra,
  "chaos-titan": ChaosTitan,
  // Arctic Egg pets
  "arctic-fox": ArcticFox,
  "polar-bear": PolarBear,
  "snow-leopard": SnowLeopard,
  "ice-dragon": IceDragon,
  "frost-titan": FrostTitan,
  // Mythical Egg pets
  "rune-stone": RuneStone,
  "astral-wolf": AstralWolf,
  "reality-fox": RealityFox,
  "infinity-drake": InfinityDrake,
  "primordial-god": PrimordialGod,
  // Unobtainable special pets
  "arctic-guardian": ArcticGuardian,
  "primordial-chaos": PrimordialChaos,
  "absolute-zero": AbsoluteZero,
};

export function PetArt({
  art,
  size = 48,
  dim,
}: {
  art: string;
  size?: number;
  dim?: boolean;
}) {
  const Cmp = ART_MAP[art] ?? Pup;
  return (
    <div
      style={{
        width: size,
        height: size,
        opacity: dim ? 0.45 : 1,
        filter: dim ? "grayscale(0.7)" : "none",
      }}
    >
      <Cmp />
    </div>
  );
}
