import { useState } from "react";
import { Modal } from "./Modal";
import {
  firebaseLogin,
  firebaseSignup,
  firebaseImportSave,
} from "../lib/firebase-ops";
import { decodeSave } from "../lib/save";
import { isFirebaseConfigured } from "../lib/firebase";
import type { Profile } from "../lib/types";

type Mode = "login" | "signup" | "code";

export function AuthModal({
  onAuthed,
}: {
  onAuthed: (profile: Profile, uid: string) => void;
}) {
  const [mode, setMode] = useState<Mode>("signup");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const firebaseReady = isFirebaseConfigured();

  async function submit() {
    setErr(null);
    if (busy) return;
    if (!firebaseReady) {
      setErr("Firebase is not configured. Please add your Firebase credentials.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "login") {
        const u = username.trim();
        if (!u) { setErr("Enter your username."); return; }
        if (password.length < 1) { setErr("Enter your password."); return; }
        try {
          const { user, profile } = await firebaseLogin(u, password);
          onAuthed(profile, user.uid);
        } catch (e) {
          const msg = (e as Error).message;
          if (msg.includes("auth/invalid-credential") || msg.includes("auth/wrong-password") || msg.includes("auth/user-not-found")) {
            setErr("Wrong username or password.");
          } else if (msg === "no profile") {
            setErr("Account exists but profile is missing. Contact support.");
          } else {
            setErr("Couldn't sign in. Check your connection and try again.");
          }
        }
        return;
      }

      if (mode === "signup") {
        const u = username.trim();
        if (u.length < 2 || u.length > 16 || !/^[\w-]+$/.test(u)) {
          setErr("2–16 chars: letters, numbers, _ or -");
          return;
        }
        if (password.length < 6) {
          setErr("Password must be at least 6 characters.");
          return;
        }
        try {
          const { user, profile } = await firebaseSignup(u, password);
          onAuthed(profile, user.uid);
        } catch (e) {
          const msg = (e as Error).message;
          if (msg === "username taken" || msg.includes("auth/email-already-in-use")) {
            setErr("Username already taken.");
          } else if (msg.includes("auth/weak-password")) {
            setErr("Password must be at least 6 characters.");
          } else {
            setErr("Couldn't create account. Try again.");
          }
        }
        return;
      }

      if (mode === "code") {
        const decoded = decodeSave(code);
        if (!decoded) {
          setErr("Invalid save code.");
          return;
        }
        if (password.length < 6) {
          setErr("Password must be at least 6 characters.");
          return;
        }
        try {
          const { user, profile } = await firebaseImportSave(
            decoded.username,
            password,
            decoded,
          );
          onAuthed(profile, user.uid);
        } catch (e) {
          const msg = (e as Error).message;
          if (msg.includes("auth/invalid-credential") || msg.includes("auth/wrong-password")) {
            setErr("Wrong password for that account.");
          } else if (msg.includes("auth/weak-password")) {
            setErr("Password must be at least 6 characters.");
          } else {
            setErr("Couldn't restore account. Check your password and try again.");
          }
        }
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
          CHANCED
        </div>
        <h2 className="mt-1 text-2xl font-extrabold text-white">
          {mode === "login"
            ? "Welcome back"
            : mode === "signup"
              ? "Create account"
              : "Import save code"}
        </h2>
      </div>

      {!firebaseReady && (
        <div className="mb-3 rounded-md border border-amber-700/40 bg-amber-950/40 px-2 py-1.5 text-[11px] text-amber-300">
          Firebase credentials not configured. Add your VITE_FIREBASE_* environment variables to enable cloud accounts.
        </div>
      )}

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
          placeholder={mode === "code" ? "password for this account" : "password"}
          className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-amber-500"
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
        />
        {mode === "code" && (
          <p className="text-[10px] text-zinc-500">
            Enter a password (6+ chars) to link this save to a new cloud account, or your existing password to log back in.
          </p>
        )}
        {err && (
          <div className="rounded-md border border-rose-700/40 bg-rose-950/40 px-2 py-1.5 text-[11px] text-rose-300">
            {err}
          </div>
        )}
        <button
          onClick={submit}
          disabled={busy || !firebaseReady}
          className="mt-1 rounded-lg bg-gradient-to-b from-amber-400 to-orange-500 px-4 py-2.5 text-sm font-extrabold text-zinc-950 shadow-md active:scale-[0.99] disabled:opacity-60"
        >
          {busy
            ? "Please wait…"
            : mode === "login"
              ? "Log in"
              : mode === "signup"
                ? "Create account"
                : "Import save"}
        </button>
        <p className="mt-1 text-center text-[10px] text-zinc-500">
          Accounts sync to the cloud — play across any device.
        </p>
      </div>
    </Modal>
  );
}
