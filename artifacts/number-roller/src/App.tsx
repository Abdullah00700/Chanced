import { useEffect, useMemo, useRef, useState } from "react";

type RarityKey =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic";

type RarityDef = {
  key: RarityKey;
  label: string;
  threshold: number;
  textStyle: React.CSSProperties;
  glow: string;
  badgeBg: string;
  badgeText: string;
};

const RARITIES: RarityDef[] = [
  {
    key: "common",
    label: "COMMON",
    threshold: 0,
    textStyle: { color: "#ffffff" },
    glow: "0 0 12px rgba(255,255,255,0.55), 0 0 28px rgba(255,255,255,0.25)",
    badgeBg: "rgba(255,255,255,0.10)",
    badgeText: "#ffffff",
  },
  {
    key: "uncommon",
    label: "UNCOMMON",
    threshold: 0.5,
    textStyle: { color: "#22c55e" },
    glow: "0 0 14px rgba(34,197,94,0.7), 0 0 36px rgba(34,197,94,0.45)",
    badgeBg: "rgba(34,197,94,0.14)",
    badgeText: "#4ade80",
  },
  {
    key: "rare",
    label: "RARE",
    threshold: 0.75,
    textStyle: { color: "#06b6d4" },
    glow: "0 0 16px rgba(6,182,212,0.8), 0 0 42px rgba(6,182,212,0.5)",
    badgeBg: "rgba(6,182,212,0.16)",
    badgeText: "#22d3ee",
  },
  {
    key: "epic",
    label: "EPIC",
    threshold: 0.88,
    textStyle: {
      backgroundImage: "linear-gradient(90deg, #3b82f6 0%, #1e3a8a 100%)",
    },
    glow: "0 0 18px rgba(59,130,246,0.85), 0 0 48px rgba(30,58,138,0.6)",
    badgeBg: "linear-gradient(90deg, rgba(59,130,246,0.25), rgba(30,58,138,0.25))",
    badgeText: "#93c5fd",
  },
  {
    key: "legendary",
    label: "LEGENDARY",
    threshold: 0.96,
    textStyle: {
      backgroundImage: "linear-gradient(90deg, #facc15 0%, #f97316 100%)",
    },
    glow: "0 0 22px rgba(250,204,21,0.85), 0 0 60px rgba(249,115,22,0.6)",
    badgeBg: "linear-gradient(90deg, rgba(250,204,21,0.25), rgba(249,115,22,0.25))",
    badgeText: "#fbbf24",
  },
  {
    key: "mythic",
    label: "MYTHIC",
    threshold: 0.992,
    textStyle: {
      backgroundImage: "linear-gradient(90deg, #000000 0%, #4c1d95 100%)",
    },
    glow: "0 0 24px rgba(76,29,149,0.95), 0 0 70px rgba(124,58,237,0.65), 0 0 12px rgba(0,0,0,0.9)",
    badgeBg: "linear-gradient(90deg, rgba(0,0,0,0.6), rgba(76,29,149,0.45))",
    badgeText: "#c4b5fd",
  },
];

const CENTER = 5000;
const MAX_NUMBER = 10000;
const SIGMA = 1700;

// erf approximation (Abramowitz & Stegun 7.1.26)
function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1.0 / (1.0 + p * ax);
  const y =
    1.0 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) *
      t *
      Math.exp(-ax * ax);
  return sign * y;
}

function normalCdf(x: number, mu = CENTER, sigma = SIGMA): number {
  return 0.5 * (1 + erf((x - mu) / (sigma * Math.SQRT2)));
}

// Build the discrete distribution over 0..10000
function buildDistribution() {
  const probs = new Float64Array(MAX_NUMBER + 1);
  // Mass for each integer n is CDF(n+0.5) - CDF(n-0.5), then normalize
  const lo = normalCdf(-0.5);
  const hi = normalCdf(MAX_NUMBER + 0.5);
  const totalMass = hi - lo;
  for (let n = 0; n <= MAX_NUMBER; n++) {
    const p = (normalCdf(n + 0.5) - normalCdf(n - 0.5)) / totalMass;
    probs[n] = p;
  }
  // Cumulative for sampling
  const cum = new Float64Array(MAX_NUMBER + 1);
  let s = 0;
  for (let n = 0; n <= MAX_NUMBER; n++) {
    s += probs[n];
    cum[n] = s;
  }
  return { probs, cum };
}

function sampleFromCdf(cum: Float64Array): number {
  const r = Math.random() * cum[cum.length - 1];
  let lo = 0;
  let hi = cum.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (cum[mid] < r) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

// extremeness = how far from center, normalized 0..1
function extremeness(n: number) {
  return Math.abs(n - CENTER) / CENTER;
}

function rarityFor(n: number): RarityDef {
  const e = extremeness(n);
  let chosen = RARITIES[0];
  for (const r of RARITIES) {
    if (e >= r.threshold) chosen = r;
  }
  return chosen;
}

function chancePctFromProb(p: number): string {
  const pct = p * 100;
  if (pct === 0) return "0.000%";
  if (pct >= 0.001) return pct.toFixed(3) + "%";
  // For very small probabilities, use scientific notation but still 3 decimal places of precision
  return pct.toExponential(3) + "%";
}

// ---- Save code helpers ----
type ProfileState = {
  username: string;
  bestNumber: number | null;
  bestProb: number | null;
  worstNumber: number | null;
  worstProb: number | null;
  totalRolls: number;
  rarestNumber: number | null;
  rarestProb: number | null;
};

function emptyProfile(username: string): ProfileState {
  return {
    username,
    bestNumber: null,
    bestProb: null,
    worstNumber: null,
    worstProb: null,
    totalRolls: 0,
    rarestNumber: null,
    rarestProb: null,
  };
}

function encodeSave(state: ProfileState): string {
  const json = JSON.stringify(state);
  // base64 with a small prefix marker
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return "RR1-" + b64;
}

function decodeSave(code: string): ProfileState | null {
  try {
    const trimmed = code.trim();
    if (!trimmed.startsWith("RR1-")) return null;
    const b64 = trimmed.slice(4);
    const json = decodeURIComponent(escape(atob(b64)));
    const parsed = JSON.parse(json);
    if (typeof parsed.username !== "string") return null;
    return parsed as ProfileState;
  } catch {
    return null;
  }
}

// ---- Storage ----
const LS_USERNAME = "rr.username";
const LS_PROFILE = "rr.profile";
const LS_LEADERBOARD = "rr.leaderboard.v1";

type LeaderEntry = {
  username: string;
  number: number;
  prob: number;
  rarity: RarityKey;
  timestamp: number;
};

function loadLeaderboard(): LeaderEntry[] {
  try {
    const raw = localStorage.getItem(LS_LEADERBOARD);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr;
  } catch {
    return [];
  }
}

function saveLeaderboard(entries: LeaderEntry[]) {
  localStorage.setItem(LS_LEADERBOARD, JSON.stringify(entries));
}

function upsertLeaderboard(
  entries: LeaderEntry[],
  candidate: LeaderEntry,
): LeaderEntry[] {
  const existingIdx = entries.findIndex(
    (e) => e.username.toLowerCase() === candidate.username.toLowerCase(),
  );
  let next = [...entries];
  if (existingIdx >= 0) {
    const existing = next[existingIdx];
    // Keep the rarer roll (smaller probability)
    if (candidate.prob < existing.prob) {
      next[existingIdx] = candidate;
    }
  } else {
    next.push(candidate);
  }
  // Sort by rarity ascending probability
  next.sort((a, b) => a.prob - b.prob);
  return next.slice(0, 50);
}

function App() {
  const distRef = useRef(buildDistribution());
  const dist = distRef.current;

  // Username + profile
  const [username, setUsername] = useState<string>("");
  const [showRegister, setShowRegister] = useState<boolean>(false);
  const [registerInput, setRegisterInput] = useState<string>("");
  const [profile, setProfile] = useState<ProfileState>(emptyProfile(""));

  // Roll state
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [currentProb, setCurrentProb] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [displayNumber, setDisplayNumber] = useState<number | null>(null);

  // Leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([]);

  // Save / load modal
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveCode, setSaveCode] = useState("");
  const [loadInput, setLoadInput] = useState("");
  const [loadError, setLoadError] = useState("");
  const [copied, setCopied] = useState(false);

  // Load on mount
  useEffect(() => {
    const u = localStorage.getItem(LS_USERNAME);
    if (u) {
      setUsername(u);
      const raw = localStorage.getItem(LS_PROFILE);
      if (raw) {
        try {
          const p = JSON.parse(raw) as ProfileState;
          setProfile(p);
        } catch {
          setProfile(emptyProfile(u));
        }
      } else {
        setProfile(emptyProfile(u));
      }
    } else {
      setShowRegister(true);
    }
    setLeaderboard(loadLeaderboard());
  }, []);

  // Persist profile
  useEffect(() => {
    if (username) {
      localStorage.setItem(LS_PROFILE, JSON.stringify(profile));
    }
  }, [profile, username]);

  const currentRarity = useMemo(
    () => (currentNumber == null ? null : rarityFor(currentNumber)),
    [currentNumber],
  );

  function handleRegister() {
    const name = registerInput.trim().slice(0, 20);
    if (!name) return;
    localStorage.setItem(LS_USERNAME, name);
    setUsername(name);
    setProfile(emptyProfile(name));
    setShowRegister(false);
  }

  function handleRoll() {
    if (rolling || !username) return;
    setRolling(true);

    // Animated reveal: cycle through random numbers, then settle
    const finalN = sampleFromCdf(dist.cum);
    const finalProb = dist.probs[finalN];

    const startTs = performance.now();
    const duration = 850;
    let frame = 0;
    const tick = () => {
      const elapsed = performance.now() - startTs;
      const t = Math.min(1, elapsed / duration);
      // Slow the flicker as we approach the end
      const interval = 30 + t * 90;
      frame++;
      if (t < 1) {
        if (frame % Math.max(1, Math.floor(interval / 16)) === 0) {
          setDisplayNumber(Math.floor(Math.random() * (MAX_NUMBER + 1)));
        }
        requestAnimationFrame(tick);
      } else {
        setDisplayNumber(finalN);
        setCurrentNumber(finalN);
        setCurrentProb(finalProb);
        setRolling(false);

        // Update profile + leaderboard
        setProfile((prev) => {
          const next: ProfileState = { ...prev, totalRolls: prev.totalRolls + 1 };
          if (next.bestNumber == null || finalN > next.bestNumber) {
            next.bestNumber = finalN;
            next.bestProb = finalProb;
          }
          if (next.worstNumber == null || finalN < next.worstNumber) {
            next.worstNumber = finalN;
            next.worstProb = finalProb;
          }
          if (next.rarestProb == null || finalProb < next.rarestProb) {
            next.rarestNumber = finalN;
            next.rarestProb = finalProb;
          }
          return next;
        });

        const r = rarityFor(finalN);
        const candidate: LeaderEntry = {
          username,
          number: finalN,
          prob: finalProb,
          rarity: r.key,
          timestamp: Date.now(),
        };
        setLeaderboard((prev) => {
          const next = upsertLeaderboard(prev, candidate);
          saveLeaderboard(next);
          return next;
        });
      }
    };
    requestAnimationFrame(tick);
  }

  function openSaveModal() {
    setSaveCode(encodeSave(profile));
    setLoadInput("");
    setLoadError("");
    setCopied(false);
    setShowSaveModal(true);
  }

  function handleLoadCode() {
    const decoded = decodeSave(loadInput);
    if (!decoded) {
      setLoadError("Invalid save code.");
      return;
    }
    // Adopt the loaded profile and username
    setUsername(decoded.username);
    localStorage.setItem(LS_USERNAME, decoded.username);
    setProfile(decoded);
    // Add their rarest roll to leaderboard if present
    if (decoded.rarestNumber != null && decoded.rarestProb != null) {
      const r = rarityFor(decoded.rarestNumber);
      setLeaderboard((prev) => {
        const next = upsertLeaderboard(prev, {
          username: decoded.username,
          number: decoded.rarestNumber!,
          prob: decoded.rarestProb!,
          rarity: r.key,
          timestamp: Date.now(),
        });
        saveLeaderboard(next);
        return next;
      });
    }
    setLoadError("");
    setShowSaveModal(false);
  }

  function handleCopy() {
    navigator.clipboard.writeText(saveCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function handleChangeUser() {
    setRegisterInput("");
    setShowRegister(true);
  }

  // ---- Render ----
  const lowestRarity =
    profile.worstNumber != null ? rarityFor(profile.worstNumber) : null;
  const highestRarity =
    profile.bestNumber != null ? rarityFor(profile.bestNumber) : null;

  return (
    <div className="min-h-[100dvh] w-full px-3 pb-8 pt-4">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <header className="mb-4">
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-extrabold tracking-tight text-white">
                Rarity Roller
              </h1>
              <p className="mt-0.5 text-[11px] leading-tight text-zinc-400">
                Roll 0–10,000. Edges are exponentially rarer.
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <div className="max-w-[140px] truncate rounded-md border border-zinc-700/70 bg-zinc-900/60 px-2 py-1 text-[11px]">
                <span className="text-zinc-500">player:</span>{" "}
                <span className="font-semibold text-white">
                  {username || "—"}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-2 flex gap-2">
            <button
              onClick={handleChangeUser}
              className="flex-1 rounded-md border border-zinc-700/70 bg-zinc-900/60 px-3 py-2 text-xs font-semibold text-zinc-300 active:bg-zinc-800"
            >
              Change name
            </button>
            <button
              onClick={openSaveModal}
              disabled={!username}
              className="flex-1 rounded-md border border-zinc-700/70 bg-zinc-900/60 px-3 py-2 text-xs font-semibold text-zinc-300 active:bg-zinc-800 disabled:opacity-40"
            >
              Save / Load
            </button>
          </div>
        </header>

        {/* Roll panel */}
        <section>
          <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 px-4 py-6 shadow-2xl">
            <div className="absolute inset-0 -z-10 opacity-40 blur-3xl">
              <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/20" />
            </div>

            <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
              {/* Chance above the number */}
              <div className="mb-2 h-5 text-[12px] tracking-wide text-zinc-400">
                {currentProb != null ? (
                  <span>
                    chance:{" "}
                    <span className="font-semibold text-zinc-200">
                      {chancePctFromProb(currentProb)}
                    </span>
                  </span>
                ) : (
                  <span className="text-zinc-600">press roll to begin</span>
                )}
              </div>

              {/* The Number */}
              <div
                className={
                  "select-none text-6xl font-black leading-none " +
                  (currentRarity &&
                  (currentRarity.key === "epic" ||
                    currentRarity.key === "legendary" ||
                    currentRarity.key === "mythic")
                    ? "gradient-text"
                    : "")
                }
                style={{
                  ...(currentRarity?.textStyle ?? { color: "#9ca3af" }),
                  textShadow: currentRarity?.glow ?? "none",
                  filter: rolling ? "blur(1px)" : "none",
                  transition: "filter 200ms ease",
                }}
              >
                {displayNumber != null
                  ? displayNumber.toLocaleString()
                  : "0000"}
              </div>

              {/* Rarity below the number */}
              <div className="mt-3 h-6">
                {currentRarity ? (
                  <span
                    className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-[0.2em]"
                    style={{
                      background: currentRarity.badgeBg,
                      color: currentRarity.badgeText,
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {currentRarity.label}
                  </span>
                ) : (
                  <span className="text-[10px] tracking-[0.2em] text-zinc-600">
                    ———
                  </span>
                )}
              </div>

              {/* Roll button */}
              <button
                onClick={handleRoll}
                disabled={rolling || !username}
                className="mt-6 w-full rounded-xl border border-zinc-700/80 bg-gradient-to-b from-zinc-800 to-zinc-900 px-8 py-4 text-base font-bold tracking-wide text-white shadow-lg active:scale-[0.98] active:from-zinc-700 active:to-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {rolling ? "ROLLING…" : "ROLL"}
              </button>
            </div>
          </div>

          {/* Stats: lowest / highest */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <StatCard
              label="Lowest"
              number={profile.worstNumber}
              prob={profile.worstProb}
              rarity={lowestRarity}
            />
            <StatCard
              label="Highest"
              number={profile.bestNumber}
              prob={profile.bestProb}
              rarity={highestRarity}
            />
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-zinc-500">
            <div className="rounded-md border border-zinc-800/80 bg-zinc-900/40 px-2 py-1.5">
              <div className="text-zinc-500">rolls</div>
              <div className="font-semibold text-zinc-200">
                {profile.totalRolls.toLocaleString()}
              </div>
            </div>
            <div className="rounded-md border border-zinc-800/80 bg-zinc-900/40 px-2 py-1.5">
              <div className="text-zinc-500">rarest #</div>
              <div className="truncate font-semibold text-zinc-200">
                {profile.rarestNumber != null
                  ? profile.rarestNumber.toLocaleString()
                  : "—"}
              </div>
            </div>
            <div className="rounded-md border border-zinc-800/80 bg-zinc-900/40 px-2 py-1.5">
              <div className="text-zinc-500">rarest %</div>
              <div className="truncate font-semibold text-zinc-200">
                {profile.rarestProb != null
                  ? chancePctFromProb(profile.rarestProb)
                  : "—"}
              </div>
            </div>
          </div>
        </section>

        {/* Leaderboard */}
        <aside className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Leaderboard</h2>
            <span className="text-[10px] uppercase tracking-widest text-zinc-500">
              rarest first
            </span>
          </div>
          {leaderboard.length === 0 ? (
            <div className="rounded-md border border-dashed border-zinc-800 p-5 text-center text-xs text-zinc-500">
              No rolls yet. Be the first.
            </div>
          ) : (
            <ol className="scroll-hide max-h-[60vh] space-y-1.5 overflow-y-auto pr-1">
              {leaderboard.map((e, i) => {
                const r = RARITIES.find((x) => x.key === e.rarity)!;
                return (
                  <li
                    key={`${e.username}-${e.timestamp}-${i}`}
                    className="flex items-center gap-2.5 rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-2.5 py-2"
                  >
                    <div className="w-5 text-right font-mono text-[11px] text-zinc-500">
                      {i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-semibold text-zinc-100">
                        {e.username}
                      </div>
                      <div className="text-[10px] uppercase tracking-widest" style={{ color: r.badgeText }}>
                        {r.label}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={
                          "text-sm font-bold tabular-nums " +
                          (r.key === "epic" || r.key === "legendary" || r.key === "mythic"
                            ? "gradient-text"
                            : "")
                        }
                        style={{
                          ...r.textStyle,
                          textShadow: r.glow,
                        }}
                      >
                        {e.number.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        {chancePctFromProb(e.prob)}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          {/* Rarity legend */}
          <div className="mt-4 border-t border-zinc-800 pt-3">
            <div className="mb-2 text-[10px] uppercase tracking-widest text-zinc-500">
              tiers
            </div>
            <div className="flex flex-wrap gap-1.5">
              {RARITIES.map((r) => (
                <span
                  key={r.key}
                  className="rounded-full px-2 py-0.5 text-[9px] font-bold tracking-[0.18em]"
                  style={{
                    background: r.badgeBg,
                    color: r.badgeText,
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {r.label}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Username register modal */}
      {showRegister && (
        <Modal>
          <div className="mb-1 text-xs uppercase tracking-[0.25em] text-zinc-500">
            Welcome
          </div>
          <h2 className="mb-4 text-2xl font-bold text-white">
            Choose a username
          </h2>
          <input
            value={registerInput}
            onChange={(e) => setRegisterInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
            maxLength={20}
            placeholder="your name…"
            autoFocus
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-4 py-3 text-base text-white outline-none focus:border-zinc-500"
          />
          <div className="mt-2 text-xs text-zinc-500">
            Up to 20 characters. Stored locally on this device.
          </div>
          <div className="mt-5 flex justify-end gap-2">
            {username && (
              <button
                onClick={() => setShowRegister(false)}
                className="rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleRegister}
              disabled={!registerInput.trim()}
              className="rounded-md border border-zinc-600 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200 disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        </Modal>
      )}

      {/* Save / Load modal */}
      {showSaveModal && (
        <Modal onClose={() => setShowSaveModal(false)}>
          <h2 className="mb-1 text-2xl font-bold text-white">Save / Load</h2>
          <p className="mb-5 text-sm text-zinc-400">
            Copy your save code to back up your progress, or paste one to
            restore it on any device.
          </p>

          <div className="mb-2 text-xs uppercase tracking-widest text-zinc-500">
            your save code
          </div>
          <textarea
            value={saveCode}
            readOnly
            rows={4}
            className="scroll-hide w-full resize-none rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-xs text-zinc-200 outline-none"
          />
          <div className="mt-2 flex justify-end">
            <button
              onClick={handleCopy}
              className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-200 hover:bg-zinc-800"
            >
              {copied ? "Copied!" : "Copy code"}
            </button>
          </div>

          <div className="my-5 h-px bg-zinc-800" />

          <div className="mb-2 text-xs uppercase tracking-widest text-zinc-500">
            load a save code
          </div>
          <textarea
            value={loadInput}
            onChange={(e) => {
              setLoadInput(e.target.value);
              setLoadError("");
            }}
            rows={3}
            placeholder="paste a code that starts with RR1-…"
            className="scroll-hide w-full resize-none rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-xs text-zinc-200 outline-none focus:border-zinc-500"
          />
          {loadError && (
            <div className="mt-2 text-xs text-red-400">{loadError}</div>
          )}

          <div className="mt-5 flex justify-end gap-2">
            <button
              onClick={() => setShowSaveModal(false)}
              className="rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              Close
            </button>
            <button
              onClick={handleLoadCode}
              disabled={!loadInput.trim()}
              className="rounded-md border border-zinc-600 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-200 disabled:opacity-40"
            >
              Load
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function StatCard({
  label,
  number,
  prob,
  rarity,
}: {
  label: string;
  number: number | null;
  prob: number | null;
  rarity: RarityDef | null;
}) {
  const isGradient =
    rarity &&
    (rarity.key === "epic" ||
      rarity.key === "legendary" ||
      rarity.key === "mythic");
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
      <div className="mb-1 text-xs uppercase tracking-widest text-zinc-500">
        {label}
      </div>
      {number == null ? (
        <div className="text-2xl font-bold text-zinc-600">—</div>
      ) : (
        <>
          <div
            className={
              "text-3xl font-extrabold tabular-nums " +
              (isGradient ? "gradient-text" : "")
            }
            style={{
              ...(rarity?.textStyle ?? { color: "#e5e7eb" }),
              textShadow: rarity?.glow ?? "none",
              lineHeight: 1.1,
            }}
          >
            {number.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center justify-between">
            {rarity && (
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold tracking-[0.18em]"
                style={{
                  background: rarity.badgeBg,
                  color: rarity.badgeText,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {rarity.label}
              </span>
            )}
            <span className="text-xs text-zinc-400">
              chance:{" "}
              <span className="font-semibold text-zinc-200">
                {prob != null ? chancePctFromProb(prob) : "—"}
              </span>
            </span>
          </div>
        </>
      )}
    </div>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose?: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default App;
