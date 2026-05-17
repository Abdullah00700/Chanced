import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.post("/accounts/signup", (_req, res) => {
  return res.status(410).json({ error: "Use Firebase Authentication instead" });
});

router.post("/accounts/login", (_req, res) => {
  return res.status(410).json({ error: "Use Firebase Authentication instead" });
});

router.put("/accounts/sync", (_req, res) => {
  return res.status(410).json({ error: "Use Firestore directly instead" });
});

export default router;
