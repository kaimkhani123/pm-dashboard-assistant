import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { projectId, status, assignee } = req.query;
    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;
    if (assignee) where.assignee = { contains: assignee as string, mode: "insensitive" };

    const tasks = await prisma.task.findMany({
      where,
      include: { project: { select: { id: true, name: true, category: true } } },
      orderBy: { updatedAt: "desc" },
      take: 200,
    });
    res.json(tasks);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { title, description, projectId, priority, assignee, storyPoints, dueDate } = req.body;
    if (!title || !projectId) return res.status(400).json({ error: "Title and projectId required" });

    const task = await prisma.task.create({
      data: {
        title, description, projectId, priority: priority || "normal",
        assignee, storyPoints: storyPoints ? parseInt(storyPoints) : undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
      include: { project: { select: { id: true, name: true } } },
    });
    res.json(task);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/bulk", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { tasks } = req.body;
    if (!Array.isArray(tasks)) return res.status(400).json({ error: "tasks array required" });

    const created = await Promise.all(
      tasks.map((t: any) =>
        prisma.task.create({
          data: {
            title: t.title, description: t.description, projectId: t.projectId,
            priority: t.priority || "normal", assignee: t.assignee,
            storyPoints: t.storyPoints ? parseInt(t.storyPoints) : undefined,
            dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
          },
        })
      )
    );
    res.json({ created: created.length, tasks: created });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const data: any = { ...req.body };
    if (data.status === "done" && !data.completedAt) data.completedAt = new Date();
    if (data.dueDate) data.dueDate = new Date(data.dueDate);
    const task = await prisma.task.update({ where: { id: req.params.id as string }, data });
    res.json(task);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    await prisma.task.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
