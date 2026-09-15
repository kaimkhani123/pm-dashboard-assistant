import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

router.get("/", authMiddleware, async (_req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: { tasks: { select: { id: true, status: true, dueDate: true } } },
      orderBy: { updatedAt: "desc" },
    });
    const result = projects.map((p) => {
      const total = p.tasks.length;
      const done = p.tasks.filter((t) => t.status === "done").length;
      const blocked = p.tasks.filter((t) => t.status === "blocked").length;
      const overdue = p.tasks.filter((t) => t.dueDate && t.dueDate < new Date() && t.status !== "done").length;
      return { ...p, tasks: undefined, totalTasks: total, completedTasks: done, blockedTasks: blocked, overdueTasks: overdue, progress: total > 0 ? Math.round((done / total) * 100) : 0 };
    });
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, category, clientName, startDate, targetDate } = req.body;
    const project = await prisma.project.create({
      data: { name, category: category || "implementation", clientName, startDate: startDate ? new Date(startDate) : undefined, targetDate: targetDate ? new Date(targetDate) : undefined },
    });
    res.json(project);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const project = await prisma.project.update({ where: { id: req.params.id as string }, data: req.body });
    res.json(project);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
