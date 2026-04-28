import type { LeaderEntry, Profile } from "./types";

const API_BASE = `${import.meta.env.BASE_URL}api`;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const text = await res.text();
  let body: any = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = { error: text };
  }
  if (!res.ok) {
    const msg = (body && body.error) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return body as T;
}

export async function apiSignup(
  username: string,
  passwordHash: string,
  profile: Profile,
): Promise<Profile> {
  const r = await request<{ ok: boolean; profile: Profile }>(
    "/accounts/signup",
    { method: "POST", body: JSON.stringify({ username, passwordHash, profile }) },
  );
  return r.profile;
}

export async function apiLogin(
  username: string,
  passwordHash: string,
): Promise<Profile> {
  const r = await request<{ ok: boolean; profile: Profile }>(
    "/accounts/login",
    { method: "POST", body: JSON.stringify({ username, passwordHash }) },
  );
  return r.profile;
}

export async function apiSyncProfile(
  username: string,
  passwordHash: string,
  profile: Profile,
): Promise<void> {
  await request<{ ok: boolean }>("/accounts/sync", {
    method: "PUT",
    body: JSON.stringify({ username, passwordHash, profile }),
  });
}

export async function apiGetLeaderboard(): Promise<LeaderEntry[]> {
  const r = await request<{ entries: LeaderEntry[] }>("/leaderboard");
  return r.entries;
}

export async function apiSubmitLeader(
  username: string,
  passwordHash: string,
  entry: Omit<LeaderEntry, "username" | "timestamp">,
): Promise<void> {
  await request<{ ok: boolean }>("/leaderboard/submit", {
    method: "POST",
    body: JSON.stringify({ username, passwordHash, entry }),
  });
}
