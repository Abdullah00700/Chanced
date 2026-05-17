import type { LeaderEntry } from "./types";

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

export async function apiGetLeaderboard(): Promise<LeaderEntry[]> {
  const r = await request<{ entries: LeaderEntry[] }>("/leaderboard");
  return r.entries;
}
