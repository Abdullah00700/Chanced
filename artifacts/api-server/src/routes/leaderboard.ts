import { Router, type IRouter } from "express";
import { getAdminFirestore, verifyIdToken } from "../lib/firebase-admin";

const router: IRouter = Router();

const ALLOWED_RARITY = new Set([
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "mythic",
  "unobtainable",
]);

router.get("/leaderboard", async (_req, res) => {
  try {
    const fs = getAdminFirestore();
    const snap = await fs
      .collection("leaderboard")
      .orderBy("level", "desc")
      .limit(50)
      .get();
    const entries = snap.docs.map((d) => {
      const data = d.data();
      return {
        username: data["username"] as string,
        number: data["number"] as number,
        prob: data["prob"] as number,
        rarity: data["rarity"] as string,
        level: data["level"] as number,
        timestamp: (data["ts"] as number) ?? Date.now(),
      };
    });
    return res.json({ entries });
  } catch (e) {
    return res.status(500).json({ error: "server error" });
  }
});

router.post("/leaderboard/submit", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "missing token" });
  }
  const token = authHeader.slice(7);

  let decoded;
  try {
    decoded = await verifyIdToken(token);
  } catch {
    return res.status(401).json({ error: "invalid token" });
  }

  const { entry } = req.body ?? {};
  if (!entry || typeof entry !== "object") {
    return res.status(400).json({ error: "invalid input" });
  }

  const { number, prob, rarity, level, username } = entry as Record<string, unknown>;
  if (
    typeof number !== "number" ||
    typeof prob !== "number" ||
    typeof rarity !== "string" ||
    typeof level !== "number" ||
    typeof username !== "string" ||
    !ALLOWED_RARITY.has(rarity)
  ) {
    return res.status(400).json({ error: "invalid entry" });
  }

  try {
    const fs = getAdminFirestore();
    const uid = decoded.uid;
    const docRef = fs.collection("leaderboard").doc(uid);
    const existing = await docRef.get();

    const safeNumber = Math.max(0, Math.min(10000, Math.floor(number)));
    const safeProb = Math.max(0, Math.min(1, prob));
    const safeLevel = Math.max(1, Math.floor(level));

    if (existing.exists) {
      const cur = existing.data()!;
      if ((cur["level"] as number) >= safeLevel && (cur["prob"] as number) <= safeProb) {
        return res.json({ ok: true, kept: true });
      }
    }

    await docRef.set({
      username,
      number: safeNumber,
      prob: safeProb,
      rarity,
      level: safeLevel,
      ts: Date.now(),
    });

    return res.json({ ok: true, kept: false });
  } catch (e) {
    req.log.error({ err: e }, "submit failed");
    return res.status(500).json({ error: "server error" });
  }
});

export default router;
