import type { Profile } from "./types";

const PREFIX = "RR2-";

export function encodeSave(profile: Profile): string {
  const json = JSON.stringify(profile);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return PREFIX + b64;
}

export function decodeSave(code: string): Profile | null {
  try {
    const trimmed = code.trim();
    if (!trimmed.startsWith(PREFIX)) return null;
    const b64 = trimmed.slice(PREFIX.length);
    const json = decodeURIComponent(escape(atob(b64)));
    const parsed = JSON.parse(json);
    if (
      typeof parsed.username !== "string" ||
      typeof parsed.passwordHash !== "string"
    ) {
      return null;
    }
    return parsed as Profile;
  } catch {
    return null;
  }
}
