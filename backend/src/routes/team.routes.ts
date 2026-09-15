import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

router.get("/", authMiddleware, async (_req: Request, res: Response) => {
  try {
    const members = await prisma.teamMember.findMany({ orderBy: { name: "asc" } });
    const tasks = await prisma.task.findMany({ where: { status: { not: "done" } } });

    const result = members.map((m) => {
      const memberTasks = tasks.filter((t) => t.assignee?.toLowerCase() === m.name.toLowerCase());
      return {
        ...m,
        activeTasks: memberTasks.length,
        inProgress: memberTasks.filter((t) => t.status === "in_progress").length,
        blocked: memberTasks.filter((t) => t.status === "blocked").length,
        overdue: memberTasks.filter((t) => t.dueDate && t.dueDate < new Date()).length,
        totalPoints: memberTasks.reduce((s, t) => s + (t.storyPoints || 0), 0),
      };
    });
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const member = await prisma.teamMember.create({ data: req.body });
    res.json(member);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const member = await prisma.teamMember.update({ where: { id: req.params.id as string }, data: req.body });
    res.json(member);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    await prisma.teamMember.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
