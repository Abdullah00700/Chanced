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
