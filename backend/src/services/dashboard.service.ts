import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getWeekDates() {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  friday.setHours(23, 59, 59, 999);
  return { start: monday, end: friday };
}

export async function getDashboardData() {
  const { start, end } = getWeekDates();

  const [projects, tasks, blockers, teamMembers, recentLogs] = await Promise.all([
    prisma.project.findMany({ where: { status: "active" } }),
    prisma.task.findMany({ include: { project: true } }),
    prisma.blocker.findMany({ where: { resolvedDate: null }, include: { project: true, task: true } }),
    prisma.teamMember.findMany(),
    prisma.dailyLog.findMany({ orderBy: { date: "desc" }, take: 5 }),
  ]);

  const completedThisWeek = tasks.filter(
    (t) => t.status === "done" && t.completedAt && t.completedAt >= start && t.completedAt <= end
  );
  const inProgress = tasks.filter((t) => t.status === "in_progress");
  const blocked = tasks.filter((t) => t.status === "blocked");
  const overdue = tasks.filter((t) => t.dueDate && t.dueDate < new Date() && t.status !== "done");

  const projectHealth = projects.map((p) => {
    const pTasks = tasks.filter((t) => t.projectId === p.id);
    const pBlocked = pTasks.filter((t) => t.status === "blocked").length;
    const pOverdue = pTasks.filter((t) => t.dueDate && t.dueDate < new Date() && t.status !== "done").length;
    const pCompleted = pTasks.filter((t) => t.status === "done").length;
    const total = pTasks.length || 1;

    let status: "on-track" | "at-risk" | "critical" | "blocked" = "on-track";
    if (pBlocked >= total * 0.3) status = "blocked";
    else if (pOverdue > 3 || (pOverdue > 0 && pBlocked > 0)) status = "critical";
    else if (pOverdue > 0 || pBlocked > 0) status = "at-risk";

    return {
      id: p.id,
      name: p.name,
      category: p.category,
      status,
      totalTasks: pTasks.length,
      completed: pCompleted,
      inProgress: pTasks.filter((t) => t.status === "in_progress").length,
      blocked: pBlocked,
      overdue: pOverdue,
      progress: Math.round((pCompleted / total) * 100),
    };
  });

  return {
    summary: {
      totalCompleted: completedThisWeek.length,
      totalInProgress: inProgress.length,
      totalBlocked: blocked.length,
      totalOverdue: overdue.length,
      activeProjects: projects.length,
      teamSize: teamMembers.length,
    },
    projectHealth,
    blockers: blockers.map((b) => ({
      id: b.id,
      description: b.description,
      projectName: b.project.name,
      taskTitle: b.task?.title || "N/A",
      severity: b.severity,
      assignedTo: b.assignedTo,
      daysSinceRaised: Math.floor((Date.now() - b.raisedDate.getTime()) / (1000 * 60 * 60 * 24)),
    })),
    recentLogs,
  };
}

export async function getWeeklyProgress() {
  const { start, end } = getWeekDates();
  const days: string[] = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(formatDate(d));
  }

  const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const tasks = await prisma.task.findMany({
    where: { updatedAt: { gte: start, lte: end } },
    include: { project: true },
  });

  const dailyBreakdown = days.map((dateStr, i) => {
    const dayTasks = tasks.filter((t) => formatDate(t.updatedAt) === dateStr);
    const completed = dayTasks.filter((t) => t.status === "done");
    const inProg = dayTasks.filter((t) => t.status === "in_progress");
    const blocked = dayTasks.filter((t) => t.status === "blocked");

    return {
      date: dateStr,
      dayName: DAY_NAMES[i],
      completed: completed.map((t) => ({
        id: t.id,
        title: t.title,
        projectName: t.project.name,
        assignee: t.assignee || "Unassigned",
        storyPoints: t.storyPoints,
      })),
      inProgress: inProg.length,
      blocked: blocked.length,
      totalCompleted: completed.length,
    };
  });

  const allCompleted = tasks.filter(
    (t) => t.status === "done" && t.completedAt && t.completedAt >= start
  );

  const completedByProject = new Map<string, Array<{ title: string; assignee: string; day: string; storyPoints: number | null }>>();
  for (const t of allCompleted) {
    const projName = t.project.name;
    if (!completedByProject.has(projName)) completedByProject.set(projName, []);
    const dayIdx = days.indexOf(formatDate(t.completedAt!));
    completedByProject.get(projName)!.push({
      title: t.title,
      assignee: t.assignee || "Unassigned",
      day: dayIdx >= 0 ? DAY_NAMES[dayIdx] : "This Week",
      storyPoints: t.storyPoints,
    });
  }

  const projects = await prisma.project.findMany({
    where: { status: "active" },
    include: { tasks: true },
  });

  const projectProgress = projects.map((p) => {
    const pCompleted = p.tasks.filter((t) => t.status === "done" && t.completedAt && t.completedAt >= start).length;
    const pInProgress = p.tasks.filter((t) => t.status === "in_progress").length;
    const pBlocked = p.tasks.filter((t) => t.status === "blocked").length;
    const pOverdue = p.tasks.filter((t) => t.dueDate && t.dueDate < new Date() && t.status !== "done").length;
    const total = p.tasks.length || 1;
    const done = p.tasks.filter((t) => t.status === "done").length;

    return {
      id: p.id,
      name: p.name,
      category: p.category,
      completedThisWeek: pCompleted,
      inProgress: pInProgress,
      blocked: pBlocked,
      overdue: pOverdue,
      progress: Math.round((done / total) * 100),
    };
  });

  return {
    weekStart: formatDate(start),
    weekEnd: formatDate(end),
    summary: {
      totalCompleted: allCompleted.length,
      totalInProgress: tasks.filter((t) => t.status === "in_progress").length,
      totalBlocked: tasks.filter((t) => t.status === "blocked").length,
      totalOverdue: tasks.filter((t) => t.dueDate && t.dueDate < new Date() && t.status !== "done").length,
      activeProjects: projects.length,
    },
    dailyBreakdown,
    completedByProject: Object.fromEntries(completedByProject),
    projectProgress,
  };
}
