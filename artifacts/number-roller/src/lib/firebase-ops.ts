import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { getFirebaseAuth, getFirebaseFirestore } from "./firebase";
import type { LeaderEntry, Profile } from "./types";
import { emptyProfile, migrateProfileExport } from "./storage";

const EMAIL_DOMAIN = "rarityroller.game";

export function usernameToEmail(username: string): string {
  return `${username.toLowerCase()}@${EMAIL_DOMAIN}`;
}

export async function firebaseSignup(
  username: string,
  password: string,
): Promise<{ user: User; profile: Profile }> {
  const fs = getFirebaseFirestore();
  const auth = getFirebaseAuth();
  const key = username.toLowerCase();

  const usernameDoc = await getDoc(doc(fs, "usernames", key));
  if (usernameDoc.exists()) {
    throw new Error("username taken");
  }

  const email = usernameToEmail(username);
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const { user } = credential;

  await setDoc(doc(fs, "usernames", key), { uid: user.uid, displayName: username });
  const profile = emptyProfile(username);
  await setDoc(doc(fs, "users", user.uid), profileToFirestore(profile));

  return { user, profile };
}

export async function firebaseLogin(
  username: string,
  password: string,
): Promise<{ user: User; profile: Profile }> {
  const fs = getFirebaseFirestore();
  const auth = getFirebaseAuth();

  const email = usernameToEmail(username);
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const { user } = credential;

  const profileDoc = await getDoc(doc(fs, "users", user.uid));
  if (!profileDoc.exists()) {
    const fresh = emptyProfile(username);
    await setDoc(doc(fs, "users", user.uid), profileToFirestore(fresh));
    return { user, profile: fresh };
  }

  const profile = migrateProfileExport({ ...profileDoc.data(), username });
  return { user, profile };
}

export async function firebaseImportSave(
  username: string,
  password: string,
  saveProfile: Profile,
): Promise<{ user: User; profile: Profile }> {
  const fs = getFirebaseFirestore();
  const auth = getFirebaseAuth();

  const key = username.toLowerCase();
  const email = usernameToEmail(username);

  const usernameDoc = await getDoc(doc(fs, "usernames", key));
  if (usernameDoc.exists()) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const { user } = credential;
    const existingDoc = await getDoc(doc(fs, "users", user.uid));
    const profile = existingDoc.exists()
      ? migrateProfileExport({ ...existingDoc.data(), username })
      : migrateProfileExport({ ...saveProfile, username });
    return { user, profile };
  }

  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const { user } = credential;

  await setDoc(doc(fs, "usernames", key), { uid: user.uid, displayName: username });
  const cleanProfile = migrateProfileExport({ ...saveProfile, username, passwordHash: "" });
  await setDoc(doc(fs, "users", user.uid), profileToFirestore(cleanProfile));

  return { user, profile: cleanProfile };
}

export async function firebaseLogout(): Promise<void> {
  await signOut(getFirebaseAuth());
}

export async function saveProfileToFirestore(
  uid: string,
  profile: Profile,
): Promise<void> {
  const fs = getFirebaseFirestore();
  await setDoc(doc(fs, "users", uid), profileToFirestore(profile));
}

export async function getLeaderboardFromFirestore(): Promise<LeaderEntry[]> {
  const fs = getFirebaseFirestore();
  const q = query(
    collection(fs, "leaderboard"),
    orderBy("level", "desc"),
    limit(50),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      username: data["username"] as string,
      number: data["number"] as number,
      prob: data["prob"] as number,
      rarity: data["rarity"] as LeaderEntry["rarity"],
      level: data["level"] as number,
      timestamp: (data["ts"] as number) ?? Date.now(),
    };
  });
}

export async function submitLeaderToFirestore(
  uid: string,
  entry: {
    username: string;
    number: number;
    prob: number;
    rarity: string;
    level: number;
  },
): Promise<void> {
  const fs = getFirebaseFirestore();
  const docRef = doc(fs, "leaderboard", uid);
  const existing = await getDoc(docRef);
  if (existing.exists()) {
    const cur = existing.data();
    if (
      (cur["level"] as number) >= entry.level &&
      (cur["prob"] as number) <= entry.prob
    ) {
      return;
    }
  }
  await setDoc(docRef, { ...entry, ts: Date.now() });
}

function profileToFirestore(p: Profile): Record<string, unknown> {
  const out: Record<string, unknown> = { ...p };
  delete out["passwordHash"];
  return out;
}
