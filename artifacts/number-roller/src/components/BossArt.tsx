// Boss SVG artwork — one component per boss.

const STROKE = "#0a0a0a";
const SW = 1.4;

function SlimeKingArt() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      {/* Slime puddle base */}
      <ellipse cx="60" cy="95" rx="50" ry="14" fill="#16a34a" opacity="0.6" />
      {/* Body */}
      <path d="M20 80 Q15 40 60 20 Q105 40 100 80 Q90 110 60 110 Q30 110 20 80 Z"
        fill="#22c55e" stroke={STROKE} strokeWidth={SW} />
      {/* Drips */}
      <path d="M30 95 Q28 108 32 112" fill="#22c55e" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
      <path d="M90 95 Q92 108 88 112" fill="#22c55e" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
      <path d="M55 108 Q53 118 58 120" fill="#22c55e" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
      {/* Eyes */}
      <circle cx="44" cy="62" r="12" fill="#fff" stroke={STROKE} strokeWidth={SW}/>
      <circle cx="76" cy="62" r="12" fill="#fff" stroke={STROKE} strokeWidth={SW}/>
      <circle cx="47" cy="65" r="7" fill="#dc2626"/>
      <circle cx="79" cy="65" r="7" fill="#dc2626"/>
      <circle cx="49" cy="63" r="3" fill="#fff"/>
      <circle cx="81" cy="63" r="3" fill="#fff"/>
      {/* Crown */}
      <path d="M35 35 L35 15 L50 28 L60 10 L70 28 L85 15 L85 35 Z"
        fill="#fbbf24" stroke={STROKE} strokeWidth={SW}/>
      <circle cx="60" cy="12" r="5" fill="#ef4444"/>
      <circle cx="35" cy="16" r="4" fill="#a855f7"/>
      <circle cx="85" cy="16" r="4" fill="#22d3ee"/>
      {/* Grin */}
      <path d="M42 78 Q60 92 78 78" stroke={STROKE} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M48 80 L48 86" stroke={STROKE} strokeWidth="2" strokeLinecap="round"/>
      <path d="M60 83 L60 89" stroke={STROKE} strokeWidth="2" strokeLinecap="round"/>
      <path d="M72 80 L72 86" stroke={STROKE} strokeWidth="2" strokeLinecap="round"/>
      {/* Glow */}
      <ellipse cx="60" cy="60" rx="52" ry="52" fill="none" stroke="#4ade80" strokeWidth="2" opacity="0.3"/>
    </svg>
  );
}

function StoneGolemArt() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      {/* Shadow */}
      <ellipse cx="60" cy="110" rx="42" ry="8" fill="#000" opacity="0.4"/>
      {/* Left arm */}
      <rect x="8" y="45" width="22" height="40" rx="6" fill="#78716c" stroke={STROKE} strokeWidth={SW}/>
      {/* Right arm */}
      <rect x="90" y="45" width="22" height="40" rx="6" fill="#78716c" stroke={STROKE} strokeWidth={SW}/>
      {/* Body */}
      <rect x="25" y="40" width="70" height="65" rx="10" fill="#a8a29e" stroke={STROKE} strokeWidth={SW}/>
      {/* Chest cracks */}
      <path d="M50 55 L60 70 L55 85" stroke="#57534e" strokeWidth="2" fill="none"/>
      <path d="M70 50 L65 65 L72 80" stroke="#57534e" strokeWidth="1.5" fill="none"/>
      {/* Head */}
      <rect x="30" y="10" width="60" height="38" rx="8" fill="#a8a29e" stroke={STROKE} strokeWidth={SW}/>
      {/* Eyes */}
      <rect x="40" y="22" width="14" height="10" rx="2" fill="#ef4444"/>
      <rect x="66" y="22" width="14" height="10" rx="2" fill="#ef4444"/>
      <rect x="46" y="25" width="6" height="5" rx="1" fill="#fca5a5"/>
      <rect x="72" y="25" width="6" height="5" rx="1" fill="#fca5a5"/>
      {/* Brow */}
      <path d="M38 20 L54 18" stroke={STROKE} strokeWidth="3" strokeLinecap="round"/>
      <path d="M66 18 L82 20" stroke={STROKE} strokeWidth="3" strokeLinecap="round"/>
      {/* Mouth */}
      <rect x="44" y="38" width="32" height="6" rx="3" fill="#57534e"/>
      {/* Aura */}
      <ellipse cx="60" cy="60" rx="56" ry="56" fill="none" stroke="#d6d3d1" strokeWidth="2" opacity="0.25"/>
    </svg>
  );
}

function FireDrakeArt() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      {/* Flames behind */}
      <path d="M20 90 Q15 60 30 40 Q20 70 40 65 Q25 50 45 30 Q35 60 55 55 Q40 40 60 10 Q65 45 75 50 Q60 30 80 50 Q85 35 90 70 Q100 60 95 85"
        fill="#f97316" opacity="0.7"/>
      {/* Wings */}
      <path d="M15 55 Q5 30 20 20 L45 50 Z" fill="#7f1d1d" stroke={STROKE} strokeWidth={SW}/>
      <path d="M105 55 Q115 30 100 20 L75 50 Z" fill="#7f1d1d" stroke={STROKE} strokeWidth={SW}/>
      {/* Body */}
      <ellipse cx="60" cy="75" rx="32" ry="30" fill="#b91c1c" stroke={STROKE} strokeWidth={SW}/>
      {/* Belly */}
      <ellipse cx="60" cy="82" rx="20" ry="18" fill="#fca5a5" opacity="0.8"/>
      {/* Head */}
      <path d="M35 55 Q35 25 60 22 Q85 25 85 55 Q85 70 60 68 Q35 70 35 55 Z"
        fill="#dc2626" stroke={STROKE} strokeWidth={SW}/>
      {/* Horns */}
      <path d="M44 30 L38 10 L50 26" fill="#7f1d1d" stroke={STROKE} strokeWidth={SW}/>
      <path d="M76 30 L82 10 L70 26" fill="#7f1d1d" stroke={STROKE} strokeWidth={SW}/>
      {/* Eyes */}
      <circle cx="48" cy="50" r="8" fill="#fde047"/>
      <circle cx="72" cy="50" r="8" fill="#fde047"/>
      <ellipse cx="48" cy="50" rx="3.5" ry="6" fill="#0a0a0a"/>
      <ellipse cx="72" cy="50" rx="3.5" ry="6" fill="#0a0a0a"/>
      {/* Nostrils */}
      <ellipse cx="55" cy="60" rx="3" ry="2" fill="#7f1d1d"/>
      <ellipse cx="65" cy="60" rx="3" ry="2" fill="#7f1d1d"/>
      {/* Flame breath */}
      <path d="M60 68 Q45 80 30 110 Q50 90 60 105 Q65 85 80 110 Q75 88 90 100 Q80 78 60 68 Z"
        fill="#fbbf24" opacity="0.9"/>
      {/* Glow */}
      <ellipse cx="60" cy="65" rx="55" ry="55" fill="none" stroke="#f97316" strokeWidth="2" opacity="0.3"/>
    </svg>
  );
}

function OceanLeviathanArt() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      {/* Ocean */}
      <ellipse cx="60" cy="105" rx="55" ry="12" fill="#0c4a6e" opacity="0.5"/>
      {/* Tail */}
      <path d="M60 90 Q45 108 30 115 Q50 100 45 115 Q60 95 75 115 Q70 100 90 115 Q75 108 60 90 Z"
        fill="#0369a1" stroke={STROKE} strokeWidth={SW}/>
      {/* Body coil */}
      <ellipse cx="60" cy="70" rx="38" ry="28" fill="#0284c7" stroke={STROKE} strokeWidth={SW}/>
      {/* Scales */}
      {[0,1,2,3,4,5].map(i => (
        <ellipse key={i} cx={35 + i*10} cy={65 + (i%2)*8} rx="6" ry="4"
          fill="#0369a1" stroke={STROKE} strokeWidth="0.8"/>
      ))}
      {/* Neck */}
      <path d="M42 48 Q60 35 78 48" fill="#0284c7" stroke={STROKE} strokeWidth={SW}/>
      {/* Head */}
      <path d="M32 28 Q32 10 60 8 Q88 10 88 28 Q88 48 60 46 Q32 48 32 28 Z"
        fill="#0ea5e9" stroke={STROKE} strokeWidth={SW}/>
      {/* Frill */}
      <path d="M32 20 L18 8 L26 24" fill="#38bdf8" stroke={STROKE} strokeWidth={SW}/>
      <path d="M88 20 L102 8 L94 24" fill="#38bdf8" stroke={STROKE} strokeWidth={SW}/>
      {/* Eyes */}
      <circle cx="46" cy="28" r="9" fill="#fff"/>
      <circle cx="74" cy="28" r="9" fill="#fff"/>
      <circle cx="46" cy="28" r="5" fill="#0ea5e9"/>
      <circle cx="74" cy="28" r="5" fill="#0ea5e9"/>
      <circle cx="48" cy="26" r="2.5" fill="#0a0a0a"/>
      <circle cx="76" cy="26" r="2.5" fill="#0a0a0a"/>
      {/* Mouth */}
      <path d="M40 40 Q60 52 80 40" stroke={STROKE} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Teeth */}
      {[44,52,60,68,76].map(x => (
        <path key={x} d={`M${x} 40 L${x-2} 47 L${x+2} 47 Z`} fill="#fff"/>
      ))}
      {/* Water spray */}
      <path d="M55 8 Q53 2 57 0" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round"/>
      <path d="M60 6 Q60 0 60 0" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round"/>
      <path d="M65 8 Q67 2 63 0" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round"/>
      <ellipse cx="60" cy="60" rx="55" ry="55" fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.2"/>
    </svg>
  );
}

function ThunderColossusArt() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      {/* Lightning bolts bg */}
      <path d="M10 20 L30 50 L20 50 L40 80" stroke="#fde047" strokeWidth="3" fill="none" opacity="0.4"/>
      <path d="M110 20 L90 50 L100 50 L80 80" stroke="#fde047" strokeWidth="3" fill="none" opacity="0.4"/>
      {/* Left arm raised */}
      <path d="M22 55 Q10 30 18 10 L35 45 Z" fill="#78350f" stroke={STROKE} strokeWidth={SW}/>
      {/* Right arm raised */}
      <path d="M98 55 Q110 30 102 10 L85 45 Z" fill="#78350f" stroke={STROKE} strokeWidth={SW}/>
      {/* Body */}
      <rect x="28" y="45" width="64" height="60" rx="8" fill="#92400e" stroke={STROKE} strokeWidth={SW}/>
      {/* Rune lines */}
      <path d="M42 58 L42 90 M42 70 L78 70" stroke="#fde047" strokeWidth="2" opacity="0.7"/>
      <path d="M78 58 L78 90" stroke="#fde047" strokeWidth="2" opacity="0.7"/>
      {/* Head */}
      <path d="M28 18 Q28 0 60 0 Q92 0 92 18 Q92 45 60 45 Q28 45 28 18 Z"
        fill="#a16207" stroke={STROKE} strokeWidth={SW}/>
      {/* Eyes - glowing yellow */}
      <circle cx="46" cy="25" r="10" fill="#fde047"/>
      <circle cx="74" cy="25" r="10" fill="#fde047"/>
      <circle cx="46" cy="25" r="5" fill="#fff"/>
      <circle cx="74" cy="25" r="5" fill="#fff"/>
      <circle cx="47" cy="24" r="3" fill="#0a0a0a"/>
      <circle cx="75" cy="24" r="3" fill="#0a0a0a"/>
      {/* Nose */}
      <ellipse cx="60" cy="33" rx="4" ry="3" fill="#78350f"/>
      {/* Mouth */}
      <path d="M44 39 L60 43 L76 39" stroke={STROKE} strokeWidth="2" fill="none"/>
      {/* Lightning in hands */}
      <path d="M16 8 L24 22 L19 22 L28 36" stroke="#fde047" strokeWidth="3" fill="none"/>
      <path d="M104 8 L96 22 L101 22 L92 36" stroke="#fde047" strokeWidth="3" fill="none"/>
      <ellipse cx="60" cy="60" rx="56" ry="56" fill="none" stroke="#fde047" strokeWidth="2" opacity="0.3"/>
    </svg>
  );
}

function ShadowOverlordArt() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      {/* Dark tendrils */}
      {[0,40,80,120,160,200,240,300].map((deg, i) => {
        const r1 = 45, r2 = 65;
        const a = deg * Math.PI / 180;
        const x1 = 60 + r1 * Math.cos(a), y1 = 60 + r1 * Math.sin(a);
        const x2 = 60 + r2 * Math.cos(a), y2 = 60 + r2 * Math.sin(a);
        return <path key={i} d={`M${x1} ${y1} L${x2} ${y2}`}
          stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" opacity="0.6"/>;
      })}
      {/* Cloak */}
      <path d="M15 50 Q10 90 20 120 L60 100 L100 120 Q110 90 105 50 Q90 25 60 20 Q30 25 15 50 Z"
        fill="#1e1b4b" stroke={STROKE} strokeWidth={SW}/>
      {/* Inner shadow */}
      <path d="M30 60 Q25 90 35 115 L60 100 L85 115 Q95 90 90 60 Q80 35 60 32 Q40 35 30 60 Z"
        fill="#0c0010"/>
      {/* Hood */}
      <path d="M25 50 Q20 10 60 5 Q100 10 95 50 Q85 30 60 28 Q35 30 25 50 Z"
        fill="#1e1b4b" stroke={STROKE} strokeWidth={SW}/>
      {/* Face (in shadow) */}
      <path d="M35 42 Q35 58 60 58 Q85 58 85 42 Q85 28 60 28 Q35 28 35 42 Z"
        fill="#0c0010"/>
      {/* Glowing purple eyes */}
      <ellipse cx="48" cy="42" rx="7" ry="5" fill="#a855f7"/>
      <ellipse cx="72" cy="42" rx="7" ry="5" fill="#a855f7"/>
      <ellipse cx="48" cy="42" rx="3" ry="2.5" fill="#e879f9"/>
      <ellipse cx="72" cy="42" rx="3" ry="2.5" fill="#e879f9"/>
      {/* Void hands */}
      <path d="M15 75 Q5 65 8 55 L22 62 Z" fill="#1e1b4b" stroke={STROKE} strokeWidth={SW}/>
      <path d="M105 75 Q115 65 112 55 L98 62 Z" fill="#1e1b4b" stroke={STROKE} strokeWidth={SW}/>
      {/* Void orbs */}
      <circle cx="12" cy="60" r="8" fill="#7c3aed" opacity="0.8"/>
      <circle cx="108" cy="60" r="8" fill="#7c3aed" opacity="0.8"/>
      <circle cx="12" cy="60" r="4" fill="#e879f9"/>
      <circle cx="108" cy="60" r="4" fill="#e879f9"/>
      <ellipse cx="60" cy="65" rx="56" ry="52" fill="none" stroke="#7c3aed" strokeWidth="2" opacity="0.4"/>
    </svg>
  );
}

function VoidEmperorArt() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      {/* Void spiral */}
      <circle cx="60" cy="60" r="55" fill="none" stroke="#4338ca" strokeWidth="1" opacity="0.3" strokeDasharray="8 4"/>
      <circle cx="60" cy="60" r="45" fill="none" stroke="#6366f1" strokeWidth="1" opacity="0.3" strokeDasharray="6 3"/>
      {/* Cape */}
      <path d="M10 60 Q10 105 60 115 Q110 105 110 60 Q100 80 60 75 Q20 80 10 60 Z"
        fill="#1e1b4b" stroke={STROKE} strokeWidth={SW}/>
      {/* Armor body */}
      <rect x="30" y="42" width="60" height="55" rx="8" fill="#312e81" stroke={STROKE} strokeWidth={SW}/>
      {/* Void rune chest */}
      <path d="M50 55 L60 45 L70 55 L65 70 L55 70 Z" fill="#818cf8" opacity="0.8"/>
      <circle cx="60" cy="60" r="5" fill="#c7d2fe"/>
      {/* Armored shoulders */}
      <path d="M15 42 Q10 30 22 28 L35 42 Z" fill="#3730a3" stroke={STROKE} strokeWidth={SW}/>
      <path d="M105 42 Q110 30 98 28 L85 42 Z" fill="#3730a3" stroke={STROKE} strokeWidth={SW}/>
      {/* Head / helmet */}
      <path d="M28 18 Q28 0 60 0 Q92 0 92 18 Q92 40 60 38 Q28 40 28 18 Z"
        fill="#312e81" stroke={STROKE} strokeWidth={SW}/>
      {/* Visor */}
      <path d="M36 20 Q36 32 60 30 Q84 32 84 20 L84 14 Q84 8 60 8 Q36 8 36 14 Z"
        fill="#0c0a2e"/>
      {/* Void eyes */}
      <ellipse cx="48" cy="22" rx="8" ry="5" fill="#818cf8"/>
      <ellipse cx="72" cy="22" rx="8" ry="5" fill="#818cf8"/>
      <ellipse cx="48" cy="22" rx="4" ry="2.5" fill="#e0e7ff"/>
      <ellipse cx="72" cy="22" rx="4" ry="2.5" fill="#e0e7ff"/>
      {/* Spiky crown */}
      <path d="M36 10 L32 0 L44 8 L60 0 L76 8 L88 0 L84 10"
        fill="#4f46e5" stroke={STROKE} strokeWidth={SW}/>
      {/* Gauntlets */}
      <rect x="10" y="55" width="18" height="24" rx="5" fill="#3730a3" stroke={STROKE} strokeWidth={SW}/>
      <rect x="92" y="55" width="18" height="24" rx="5" fill="#3730a3" stroke={STROKE} strokeWidth={SW}/>
      <ellipse cx="60" cy="60" rx="56" ry="56" fill="none" stroke="#6366f1" strokeWidth="2" opacity="0.3"/>
    </svg>
  );
}

function CosmicHorrorArt() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      {/* Tentacles */}
      {[0,45,90,135,180,225,270,315].map((deg, i) => {
        const a = (deg - 90) * Math.PI / 180;
        const r = 30, len = 48;
        const cx = 60 + r * Math.cos(a), cy = 60 + r * Math.sin(a);
        const ex = 60 + (r + len) * Math.cos(a), ey = 60 + (r + len) * Math.sin(a);
        const mx = (cx + ex) / 2 + Math.cos(a + 1.5) * 15;
        const my = (cy + ey) / 2 + Math.sin(a + 1.5) * 15;
        return <path key={i} d={`M${cx} ${cy} Q${mx} ${my} ${ex} ${ey}`}
          fill="none" stroke="#0e7490" strokeWidth={i % 2 === 0 ? 5 : 3.5} strokeLinecap="round" opacity="0.8"/>;
      })}
      {/* Body */}
      <circle cx="60" cy="60" r="32" fill="#164e63" stroke={STROKE} strokeWidth={SW}/>
      {/* Iris ring */}
      <circle cx="60" cy="60" r="24" fill="#0e7490" stroke={STROKE} strokeWidth={SW}/>
      {/* Pupil */}
      <circle cx="60" cy="60" r="16" fill="#0a0a0a"/>
      {/* Void iris */}
      <circle cx="60" cy="60" r="10" fill="#22d3ee" opacity="0.7"/>
      {/* Cosmic pupil */}
      <circle cx="60" cy="60" r="6" fill="#0a0a0a"/>
      {/* Star reflection */}
      <circle cx="57" cy="57" r="2" fill="#fff" opacity="0.9"/>
      {/* Tiny eyes around body */}
      {[0,60,120,180,240,300].map((deg, i) => {
        const a = (deg - 90) * Math.PI / 180;
        const r = 26;
        return (
          <g key={i}>
            <circle cx={60 + r * Math.cos(a)} cy={60 + r * Math.sin(a)} r="4" fill="#fff"/>
            <circle cx={60 + r * Math.cos(a)} cy={60 + r * Math.sin(a)} r="2" fill="#22d3ee"/>
          </g>
        );
      })}
      <ellipse cx="60" cy="60" rx="56" ry="56" fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.3"/>
    </svg>
  );
}

function PrimordialTitanArt() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      {/* Lava cracks */}
      <path d="M20 90 Q30 70 50 80 Q40 60 60 55 Q80 60 70 80 Q90 70 100 90"
        stroke="#f97316" strokeWidth="2" fill="none" opacity="0.5"/>
      {/* Massive legs */}
      <rect x="20" y="88" width="30" height="26" rx="5" fill="#7f1d1d" stroke={STROKE} strokeWidth={SW}/>
      <rect x="70" y="88" width="30" height="26" rx="5" fill="#7f1d1d" stroke={STROKE} strokeWidth={SW}/>
      {/* Body — titanic */}
      <rect x="15" y="42" width="90" height="55" rx="10" fill="#991b1b" stroke={STROKE} strokeWidth={SW}/>
      {/* Lava veins */}
      <path d="M30 55 Q50 70 40 85" stroke="#f97316" strokeWidth="2.5" fill="none" opacity="0.7"/>
      <path d="M90 55 Q70 70 80 85" stroke="#f97316" strokeWidth="2.5" fill="none" opacity="0.7"/>
      <path d="M60 42 L60 97" stroke="#f97316" strokeWidth="2" fill="none" opacity="0.5"/>
      {/* Arms */}
      <rect x="0" y="44" width="20" height="44" rx="6" fill="#7f1d1d" stroke={STROKE} strokeWidth={SW}/>
      <rect x="100" y="44" width="20" height="44" rx="6" fill="#7f1d1d" stroke={STROKE} strokeWidth={SW}/>
      {/* Head */}
      <rect x="22" y="8" width="76" height="42" rx="10" fill="#b91c1c" stroke={STROKE} strokeWidth={SW}/>
      {/* Volcano-like spikes on head */}
      <path d="M28 8 L22 0 L36 8" fill="#7f1d1d" stroke={STROKE} strokeWidth={SW}/>
      <path d="M50 8 L46 0 L58 8" fill="#7f1d1d" stroke={STROKE} strokeWidth={SW}/>
      <path d="M70 8 L66 0 L78 8" fill="#7f1d1d" stroke={STROKE} strokeWidth={SW}/>
      <path d="M92 8 L86 0 L96 8" fill="#7f1d1d" stroke={STROKE} strokeWidth={SW}/>
      {/* Eyes — molten */}
      <ellipse cx="44" cy="28" rx="11" ry="8" fill="#fbbf24"/>
      <ellipse cx="76" cy="28" rx="11" ry="8" fill="#fbbf24"/>
      <ellipse cx="44" cy="28" rx="5" ry="4" fill="#f97316"/>
      <ellipse cx="76" cy="28" rx="5" ry="4" fill="#f97316"/>
      {/* Mouth */}
      <path d="M38 40 Q60 50 82 40" stroke={STROKE} strokeWidth="3" fill="none"/>
      <path d="M45 41 L45 47" stroke="#f97316" strokeWidth="2"/>
      <path d="M60 43 L60 49" stroke="#f97316" strokeWidth="2"/>
      <path d="M75 41 L75 47" stroke="#f97316" strokeWidth="2"/>
      <ellipse cx="60" cy="65" rx="56" ry="52" fill="none" stroke="#f43f5e" strokeWidth="2" opacity="0.3"/>
    </svg>
  );
}

function RealityShredderArt() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      {/* Reality fractures */}
      <line x1="0" y1="30" x2="120" y2="90" stroke="#fff" strokeWidth="1" opacity="0.15"/>
      <line x1="0" y1="60" x2="120" y2="60" stroke="#fff" strokeWidth="1" opacity="0.15"/>
      <line x1="0" y1="90" x2="120" y2="30" stroke="#fff" strokeWidth="1" opacity="0.15"/>
      <line x1="30" y1="0" x2="90" y2="120" stroke="#fff" strokeWidth="1" opacity="0.15"/>
      <line x1="60" y1="0" x2="60" y2="120" stroke="#fff" strokeWidth="1" opacity="0.15"/>
      <line x1="90" y1="0" x2="30" y2="120" stroke="#fff" strokeWidth="1" opacity="0.15"/>
      {/* Glitchy body panels */}
      <rect x="25" y="42" width="70" height="60" rx="6" fill="#18181b"/>
      <rect x="27" y="44" width="66" height="56" rx="4" fill="#09090b" opacity="0.9"/>
      {/* Data corruption lines */}
      {[50,60,70,80,90].map((y, i) => (
        <rect key={i} x={25 + (i%3)*8} y={y} width={45 + (i%2)*12} height="3" rx="1"
          fill="#fff" opacity={0.05 + i * 0.04}/>
      ))}
      {/* Head */}
      <rect x="28" y="8" width="64" height="38" rx="8" fill="#18181b" stroke="#fff" strokeWidth="0.8" strokeOpacity="0.3"/>
      {/* Eye — singular all-seeing */}
      <ellipse cx="60" cy="27" rx="22" ry="14" fill="#09090b" stroke="#fff" strokeWidth="0.8" strokeOpacity="0.5"/>
      <ellipse cx="60" cy="27" rx="16" ry="10" fill="#fff" opacity="0.05"/>
      {/* Iris */}
      <circle cx="60" cy="27" r="9" fill="#fff"/>
      <circle cx="60" cy="27" r="6" fill="#f0fdf4"/>
      <circle cx="60" cy="27" r="3.5" fill="#0a0a0a"/>
      <circle cx="58" cy="25" r="1.5" fill="#fff" opacity="0.7"/>
      {/* Cracks on face */}
      <path d="M36 14 L44 32" stroke="#fff" strokeWidth="1" opacity="0.6"/>
      <path d="M84 14 L76 32" stroke="#fff" strokeWidth="1" opacity="0.6"/>
      {/* Arms with void blades */}
      <rect x="0" y="46" width="26" height="12" rx="4" fill="#18181b" stroke="#fff" strokeWidth="0.8" strokeOpacity="0.3"/>
      <path d="M0 46 L-8 40 L0 52" fill="#fff" opacity="0.6"/>
      <rect x="94" y="46" width="26" height="12" rx="4" fill="#18181b" stroke="#fff" strokeWidth="0.8" strokeOpacity="0.3"/>
      <path d="M120 46 L128 40 L120 52" fill="#fff" opacity="0.6"/>
      {/* Data stream feet */}
      <rect x="30" y="98" width="24" height="18" rx="4" fill="#18181b" stroke="#fff" strokeWidth="0.5" strokeOpacity="0.3"/>
      <rect x="66" y="98" width="24" height="18" rx="4" fill="#18181b" stroke="#fff" strokeWidth="0.5" strokeOpacity="0.3"/>
      {/* Glitch scanline overlay */}
      <rect x="25" y="62" width="70" height="4" rx="1" fill="#fff" opacity="0.03"/>
      <ellipse cx="60" cy="65" rx="58" ry="56" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.2" strokeDasharray="4 4"/>
    </svg>
  );
}

export const BOSS_ART_MAP: Record<string, () => React.ReactElement> = {
  "slime-king": SlimeKingArt,
  "stone-golem": StoneGolemArt,
  "fire-drake": FireDrakeArt,
  "ocean-leviathan": OceanLeviathanArt,
  "thunder-colossus": ThunderColossusArt,
  "shadow-overlord": ShadowOverlordArt,
  "void-emperor": VoidEmperorArt,
  "cosmic-horror": CosmicHorrorArt,
  "primordial-titan": PrimordialTitanArt,
  "reality-shredder": RealityShredderArt,
};

export function BossArt({ art, size = 120 }: { art: string; size?: number }) {
  const Cmp = BOSS_ART_MAP[art] ?? SlimeKingArt;
  return (
    <div style={{ width: size, height: size }}>
      <Cmp />
    </div>
  );
}
