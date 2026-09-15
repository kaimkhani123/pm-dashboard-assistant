import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { getDashboardData, getWeeklyProgress } from "../services/dashboard.service";

const router = Router();

router.get("/", authMiddleware, async (_req: AuthRequest, res: Response) => {
  try {
    const data = await getDashboardData();
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/weekly", authMiddleware, async (_req: AuthRequest, res: Response) => {
  try {
    const data = await getWeeklyProgress();
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
