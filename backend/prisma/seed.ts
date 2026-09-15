import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const p1 = await prisma.project.create({
    data: { name: "CRM Implementation", category: "implementation", status: "active", clientName: "Acme Corp", startDate: new Date("2024-09-01"), targetDate: new Date("2024-12-31") },
  });
  const p2 = await prisma.project.create({
    data: { name: "Website Redesign", category: "implementation", status: "active", clientName: "Beta Inc", startDate: new Date("2024-08-15"), targetDate: new Date("2024-11-30") },
  });
  const p3 = await prisma.project.create({
    data: { name: "IT Support", category: "support", status: "active", clientName: "Gamma LLC" },
  });

  const tasks = [
    { projectId: p1.id, title: "Setup project structure", status: "done", priority: "high", assignee: "Ali", completedAt: new Date() },
    { projectId: p1.id, title: "Design database schema", status: "done", priority: "high", assignee: "Ahmed", completedAt: new Date() },
    { projectId: p1.id, title: "Build API endpoints", status: "in_progress", priority: "high", assignee: "Ali" },
    { projectId: p1.id, title: "Implement auth module", status: "in_progress", priority: "urgent", assignee: "Sara" },
    { projectId: p1.id, title: "Write unit tests", status: "todo", priority: "normal", assignee: "Ahmed" },
    { projectId: p2.id, title: "Wireframe homepage", status: "done", priority: "high", assignee: "Fatima", completedAt: new Date() },
    { projectId: p2.id, title: "Develop responsive layout", status: "in_progress", priority: "high", assignee: "Fatima" },
    { projectId: p2.id, title: "SEO optimization", status: "todo", priority: "normal", assignee: "Omar" },
    { projectId: p3.id, title: "Fix email server issue", status: "blocked", priority: "urgent", assignee: "Ali" },
    { projectId: p3.id, title: "Update antivirus licenses", status: "todo", priority: "normal", assignee: "Omar" },
  ];
  for (const t of tasks) await prisma.task.create({ data: t });

  const members = [
    { name: "Ali Khan", email: "ali@example.com", role: "Full Stack Developer", department: "Engineering" },
    { name: "Ahmed Raza", email: "ahmed@example.com", role: "Backend Developer", department: "Engineering" },
    { name: "Sara Iqbal", email: "sara@example.com", role: "Frontend Developer", department: "Engineering" },
    { name: "Fatima Noor", email: "fatima@example.com", role: "UI/UX Designer", department: "Design" },
    { name: "Omar Farooq", email: "omar@example.com", role: "DevOps Engineer", department: "Engineering" },
  ];
  for (const m of members) await prisma.teamMember.create({ data: m });

  await prisma.blocker.create({
    data: { projectId: p3.id, description: "Email server down — waiting on hosting provider", severity: "high", assignedTo: "Ali" },
  });

  console.log("Seed completed");
}

main().catch(console.error).finally(() => prisma.$disconnect());
