import { useState } from "react";
import { Modal } from "./Modal";
import { decodeSave } from "../lib/save";
import { sha256 } from "../lib/storage";
import type { Profile } from "../lib/types";

type Mode = "login" | "signup" | "code";

export function AuthModal({
  accounts,
  onLogin,
  onSignup,
  onLoadFromCode,
}: {
  accounts: Record<string, Profile>;
  onLogin: (username: string) => void;
  onSignup: (profile: Profile) => void;
  onLoadFromCode: (profile: Profile, password: string) => void;
}) {
  const [mode, setMode] = useState<Mode>(
    Object.keys(accounts).length > 0 ? "login" : "signup",
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setErr(null);
    if (busy) return;
    setBusy(true);
    try {
      if (mode === "login") {
        const u = username.trim();
        if (!u) {
          setErr("Enter your username.");
          return;
        }
        const acc = accounts[u.toLowerCase()];
        if (!acc) {
          setErr("No account with that username.");
          return;
        }
        const hash = await sha256(password);
        if (hash !== acc.passwordHash) {
          setErr("Wrong password.");
          return;
        }
        onLogin(u.toLowerCase());
        return;
      }
      if (mode === "signup") {
        const u = username.trim();
        if (u.length < 2 || u.length > 16 || !/^[\w-]+$/.test(u)) {
          setErr("2–16 chars: letters, numbers, _ or -");
          return;
        }
        if (accounts[u.toLowerCase()]) {
          setErr("Username already taken.");
          return;
        }
        if (password.length < 4) {
          setErr("Password must be at least 4 characters.");
          return;
        }
        const hash = await sha256(password);
        const { emptyProfile } = await import("../lib/storage");
        const profile = emptyProfile(u, hash);
        onSignup(profile);
        return;
      }
      if (mode === "code") {
        const decoded = decodeSave(code);
        if (!decoded) {
          setErr("Invalid save code.");
          return;
        }
        if (password.length < 1) {
          setErr("Enter the password for this account.");
          return;
        }
        const hash = await sha256(password);
        if (hash !== decoded.passwordHash) {
          setErr("Wrong password for this save code.");
          return;
        }
        onLoadFromCode(decoded, password);
        return;
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal>
      <div className="mb-3 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-amber-300">
          Rarity Roller
        </div>
        <h2 className="mt-1 text-2xl font-extrabold text-white">
          {mode === "login"
            ? "Welcome back"
            : mode === "signup"
              ? "Create account"
              : "Load save code"}
        </h2>
      </div>

      <div className="mb-3 flex rounded-lg border border-zinc-800 bg-zinc-900/40 p-0.5 text-xs font-bold">
        {(["login", "signup", "code"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setErr(null);
            }}
            className={
              "flex-1 rounded-md px-2 py-1.5 transition " +
              (mode === m
                ? "bg-amber-500 text-zinc-950"
                : "text-zinc-400 active:text-zinc-200")
            }
          >
            {m === "login" ? "Login" : m === "signup" ? "Sign up" : "Code"}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {mode === "code" ? (
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="RR2-..."
            className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-amber-500"
          />
        ) : (
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            autoCapitalize="none"
            autoCorrect="off"
            className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-amber-500"
          />
        )}
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="password"
          className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-amber-500"
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
        />
        {err && (
          <div className="rounded-md border border-rose-700/40 bg-rose-950/40 px-2 py-1.5 text-[11px] text-rose-300">
            {err}
          </div>
        )}
        <button
          onClick={submit}
          disabled={busy}
          className="mt-1 rounded-lg bg-gradient-to-b from-amber-400 to-orange-500 px-4 py-2.5 text-sm font-extrabold text-zinc-950 shadow-md active:scale-[0.99] disabled:opacity-60"
        >
          {mode === "login"
            ? "Log in"
            : mode === "signup"
              ? "Create account"
              : "Load save"}
        </button>
        <p className="mt-1 text-center text-[10px] text-zinc-500">
          Accounts are stored only on this device. Save codes let you back up.
        </p>
      </div>
    </Modal>
  );
}
