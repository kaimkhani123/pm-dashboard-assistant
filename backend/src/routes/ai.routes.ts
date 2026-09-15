import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth";
import { generateMorningBriefing, generateTasksFromPrompt, answerQuestion, extractMeetingActions } from "../services/ai.service";

const prisma = new PrismaClient();
const router = Router();

router.get("/briefing", authMiddleware, async (_req: Request, res: Response) => {
  try {
    const briefing = await generateMorningBriefing();
    res.json({ briefing });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/generate-tasks", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { prompt, projectId } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt required" });
    const tasks = await generateTasksFromPrompt(prompt, projectId);
    res.json({ tasks });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/ask", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Question required" });
    const answer = await answerQuestion(question);
    res.json({ answer });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/meeting-actions", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { notes, title } = req.body;
    if (!notes) return res.status(400).json({ error: "Meeting notes required" });

    const extracted = await extractMeetingActions(notes);

    const meeting = await prisma.meetingNote.create({
      data: {
        title: title || `Meeting — ${new Date().toLocaleDateString()}`,
        rawNotes: notes,
        aiSummary: extracted.summary,
        actionItems: extracted.actionItems as any,
        followUps: extracted.followUps as any,
      },
    });

    res.json({ meeting, extracted });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/meetings", authMiddleware, async (_req: Request, res: Response) => {
  try {
    const meetings = await prisma.meetingNote.findMany({ orderBy: { date: "desc" }, take: 20 });
    res.json(meetings);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
