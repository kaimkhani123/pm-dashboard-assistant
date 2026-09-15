import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AIProvider {
  name: string;
  generate(prompt: string, systemPrompt?: string): Promise<string>;
}

class GeminiProvider implements AIProvider {
  name = "gemini";

  async generate(prompt: string, systemPrompt?: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY not set");

    const contents: { role: string; parts: { text: string }[] }[] = [];
    if (systemPrompt) {
      contents.push({ role: "user", parts: [{ text: systemPrompt }] });
      contents.push({ role: "model", parts: [{ text: "Understood." }] });
    }
    contents.push({ role: "user", parts: [{ text: prompt }] });

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      }
    );

    if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
    const data: any = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  }
}

let provider: AIProvider | null = null;

function getProvider(): AIProvider {
  if (!provider) {
    if (process.env.GEMINI_API_KEY) provider = new GeminiProvider();
    else throw new Error("No AI provider configured. Set GEMINI_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY.");
  }
  return provider;
}

export async function generateMorningBriefing(): Promise<string> {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const [recentTasks, blockers, projects] = await Promise.all([
    prisma.task.findMany({
      where: { updatedAt: { gte: yesterday } },
      include: { project: true },
      orderBy: { updatedAt: "desc" },
      take: 50,
    }),
    prisma.blocker.findMany({
      where: { resolvedDate: null },
      include: { project: true, task: true },
    }),
    prisma.project.findMany({
      where: { status: "active" },
      include: { tasks: true },
    }),
  ]);

  const completed = recentTasks.filter((t) => t.status === "done");
  const overdue = recentTasks.filter((t) => t.dueDate && t.dueDate < now && t.status !== "done");

  const projectSummaries = projects.map((p) => {
    const total = p.tasks.length;
    const done = p.tasks.filter((t) => t.status === "done").length;
    const blocked = p.tasks.filter((t) => t.status === "blocked").length;
    const od = p.tasks.filter((t) => t.dueDate && t.dueDate < now && t.status !== "done").length;
    return `- ${p.name}: ${done}/${total} done, ${blocked} blocked, ${od} overdue`;
  }).join("\n");

  const blockerList = blockers.map((b) => {
    const days = Math.floor((now.getTime() - b.raisedDate.getTime()) / (1000 * 60 * 60 * 24));
    return `- [${b.severity.toUpperCase()}] ${b.description} (${b.project.name}) — ${days} days old, assigned to: ${b.assignedTo || "Unassigned"}`;
  }).join("\n");

  const prompt = `You are a PM Co-Pilot AI assistant. Generate a concise morning briefing for a Project Manager.

Today: ${now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}

YESTERDAY'S ACTIVITY:
- Tasks completed: ${completed.length}
- Tasks overdue: ${overdue.length}
${completed.slice(0, 10).map((t) => `  ✓ ${t.title} (${t.project.name})`).join("\n")}

ACTIVE BLOCKERS (${blockers.length}):
${blockerList || "None"}

PROJECT STATUS:
${projectSummaries || "No active projects"}

Generate a briefing with these sections:
1. Quick Summary (2-3 sentences)
2. Today's Priorities (top 3-5 actionable items, ranked by urgency)
3. Risk Alerts (any projects needing attention)
4. Suggested Actions (specific follow-ups with names and tasks)

Keep it concise and actionable. Use bullet points. No fluff.`;

  try {
    return await getProvider().generate(prompt);
  } catch (e: any) {
    return `**Morning Briefing — ${now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}**\n\n` +
      `**Summary:** ${completed.length} tasks completed yesterday. ${blockers.length} active blockers. ${overdue.length} overdue tasks.\n\n` +
      `**Blockers:** ${blockers.length > 0 ? blockerList : "None"}\n\n` +
      `_AI briefing unavailable: ${e.message}_`;
  }
}

export async function generateTasksFromPrompt(prompt: string, projectId?: string): Promise<any[]> {
  const projects = await prisma.project.findMany({ where: { status: "active" }, select: { id: true, name: true } });
  const projectList = projects.map((p) => `${p.id}: ${p.name}`).join("\n");

  const aiPrompt = `You are a PM assistant. Break down this work description into structured tasks.

Available projects:
${projectList}
${projectId ? `\nDefault project ID: ${projectId}` : ""}

Work description: "${prompt}"

Return ONLY a JSON array of tasks. Each task object:
{
  "title": "short task title",
  "description": "detailed description",
  "projectId": "project id from list above or '${projectId || "pick best match"}'",
  "priority": "low|normal|high|urgent",
  "storyPoints": number (1-13, fibonacci),
  "assignee": null
}

Return valid JSON array only, no markdown or explanation.`;

  try {
    const result = await getProvider().generate(aiPrompt);
    const cleaned = result.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return [{
      title: prompt.slice(0, 100),
      description: prompt,
      projectId: projectId || projects[0]?.id,
      priority: "normal",
      storyPoints: 3,
      assignee: null,
    }];
  }
}

export async function answerQuestion(question: string): Promise<string> {
  const [projects, tasks, blockers, teamMembers] = await Promise.all([
    prisma.project.findMany({ where: { status: "active" }, include: { tasks: true } }),
    prisma.task.findMany({ take: 200, orderBy: { updatedAt: "desc" }, include: { project: true } }),
    prisma.blocker.findMany({ where: { resolvedDate: null }, include: { project: true } }),
    prisma.teamMember.findMany(),
  ]);

  const context = `PROJECT DATA:
Active Projects: ${projects.length}
${projects.map((p) => `- ${p.name} (${p.category}): ${p.tasks.filter((t) => t.status === "done").length}/${p.tasks.length} done, ${p.tasks.filter((t) => t.status === "blocked").length} blocked`).join("\n")}

TEAM: ${teamMembers.map((m) => `${m.name} (${m.role || m.teamType})`).join(", ")}

BLOCKERS: ${blockers.length}
${blockers.map((b) => `- ${b.description} [${b.severity}] — ${b.project.name}`).join("\n")}

RECENT TASKS:
${tasks.slice(0, 30).map((t) => `- [${t.status}] ${t.title} (${t.project.name}) ${t.assignee ? "→ " + t.assignee : ""}`).join("\n")}`;

  const prompt = `You are a PM Co-Pilot assistant with access to project data. Answer this question concisely and accurately.

${context}

Question: ${question}

Answer directly with data. Suggest follow-up actions if relevant.`;

  try {
    return await getProvider().generate(prompt);
  } catch (e: any) {
    return `Unable to process question: ${e.message}. Please check your AI provider configuration.`;
  }
}

export async function extractMeetingActions(notes: string): Promise<{
  summary: string;
  actionItems: Array<{ title: string; owner: string; deadline: string }>;
  decisions: string[];
  followUps: string[];
  risks: string[];
}> {
  const prompt = `Extract structured information from these meeting notes:

"${notes}"

Return ONLY valid JSON:
{
  "summary": "2-3 sentence summary",
  "actionItems": [{"title": "task description", "owner": "person name", "deadline": "YYYY-MM-DD or empty"}],
  "decisions": ["decision 1", "decision 2"],
  "followUps": ["follow-up item 1"],
  "risks": ["risk identified"]
}

Return valid JSON only, no markdown.`;

  try {
    const result = await getProvider().generate(prompt);
    const cleaned = result.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      summary: "Meeting notes recorded.",
      actionItems: [],
      decisions: [],
      followUps: [],
      risks: [],
    };
  }
}
