import { Router, type IRouter } from "express";
import accountsRouter from "./accounts";
import healthRouter from "./health";
import leaderboardRouter from "./leaderboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(accountsRouter);
router.use(leaderboardRouter);

export default router;
