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
