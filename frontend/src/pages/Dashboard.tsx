import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { BarChart3, CheckCircle, AlertTriangle, Clock, Folder, Users } from "lucide-react";

interface DashboardData {
  summary: { totalProjects: number; activeTasks: number; completedTasks: number; blockers: number; teamMembers: number; overdueTasks: number };
  projectHealth: { id: string; name: string; status: string; progress: number; tasksDone: number; tasksTotal: number }[];
  blockers: { id: string; description: string; projectName: string; severity: string; createdAt: string }[];
  recentLogs: { id: string; summary: string; date: string; projectName: string }[];
}

const kpis = [
  { key: "totalProjects", label: "Projects", icon: Folder, color: "text-primary" },
  { key: "activeTasks", label: "Active Tasks", icon: Clock, color: "text-warning" },
  { key: "completedTasks", label: "Completed", icon: CheckCircle, color: "text-success" },
  { key: "overdueTasks", label: "Overdue", icon: AlertTriangle, color: "text-destructive" },
  { key: "blockers", label: "Blockers", icon: BarChart3, color: "text-destructive" },
  { key: "teamMembers", label: "Team", icon: Users, color: "text-primary" },
];

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    api.get("/dashboard").then(setData).catch(console.error);
  }, []);

  if (!data) return <div className="flex items-center justify-center h-64 text-muted">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((k) => (
          <div key={k.key} className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <k.icon className={`w-4 h-4 ${k.color}`} />
              <span className="text-xs text-muted">{k.label}</span>
            </div>
            <p className="text-2xl font-bold">{(data.summary as any)[k.key]}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-border p-5">
          <h2 className="font-semibold mb-4">Project Health</h2>
          <div className="space-y-3">
            {data.projectHealth.length === 0 && <p className="text-sm text-muted">No projects yet</p>}
            {data.projectHealth.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-accent rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${p.progress}%` }} />
                    </div>
                    <span className="text-xs text-muted">{p.progress}%</span>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "ON_TRACK" ? "bg-success/10 text-success" : p.status === "AT_RISK" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>
                  {p.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5">
          <h2 className="font-semibold mb-4">Active Blockers</h2>
          <div className="space-y-3">
            {data.blockers.length === 0 && <p className="text-sm text-muted">No blockers</p>}
            {data.blockers.map((b) => (
              <div key={b.id} className="flex items-start gap-3 p-3 bg-destructive/5 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm">{b.description}</p>
                  <p className="text-xs text-muted mt-1">{b.projectName} &middot; {b.severity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-5">
        <h2 className="font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-2">
          {data.recentLogs.length === 0 && <p className="text-sm text-muted">No recent activity</p>}
          {data.recentLogs.map((l) => (
            <div key={l.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
              <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
              <p className="text-sm flex-1">{l.summary}</p>
              <span className="text-xs text-muted whitespace-nowrap">{l.projectName}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
