import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Folder, CheckCircle, Clock, AlertTriangle, Users, TrendingUp, ArrowUpRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardData {
  summary: { totalProjects: number; activeTasks: number; completedTasks: number; blockers: number; teamMembers: number; overdueTasks: number };
  projectHealth: { id: string; name: string; status: string; progress: number; tasksDone: number; tasksTotal: number }[];
  blockers: { id: string; description: string; projectName: string; severity: string; createdAt: string }[];
  recentLogs: { id: string; summary: string; date: string; projectName: string }[];
}

const kpis = [
  { key: "totalProjects", label: "Total Projects", icon: Folder, gradient: "from-indigo-500 to-indigo-600", bg: "bg-indigo-50", text: "text-indigo-600" },
  { key: "activeTasks", label: "Active Tasks", icon: Clock, gradient: "from-amber-500 to-orange-500", bg: "bg-amber-50", text: "text-amber-600" },
  { key: "completedTasks", label: "Completed", icon: CheckCircle, gradient: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50", text: "text-emerald-600" },
  { key: "overdueTasks", label: "Overdue", icon: AlertTriangle, gradient: "from-rose-500 to-red-500", bg: "bg-rose-50", text: "text-rose-600" },
  { key: "blockers", label: "Blockers", icon: Zap, gradient: "from-purple-500 to-violet-600", bg: "bg-purple-50", text: "text-purple-600" },
  { key: "teamMembers", label: "Team Members", icon: Users, gradient: "from-sky-500 to-blue-500", bg: "bg-sky-50", text: "text-sky-600" },
];

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    ON_TRACK: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", label: "On Track" },
    AT_RISK: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", label: "At Risk" },
    BLOCKED: { bg: "bg-rose-50 border-rose-200", text: "text-rose-700", label: "Blocked" },
  };
  const c = config[status] || config.ON_TRACK;
  return <span className={cn("text-[11px] px-2.5 py-1 rounded-full font-semibold border", c.bg, c.text)}>{c.label}</span>;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    api.get("/dashboard").then(setData).catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 stagger-children">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="skeleton h-64 rounded-2xl" />
          <div className="skeleton h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome message */}
      <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-card-foreground">
          Welcome back, <span className="gradient-text">{user?.name?.split(" ")[0] || "there"}</span>
        </h2>
        <p className="text-muted text-[14px] mt-1">Here's what's happening across your projects today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 stagger-children">
        {kpis.map((k) => {
          const value = (data.summary as any)[k.key];
          return (
            <div
              key={k.key}
              className="group bg-white rounded-2xl border border-border p-4 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300 cursor-default"
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", k.bg)}>
                <k.icon className={cn("w-5 h-5", k.text)} />
              </div>
              <p className="text-3xl font-bold text-card-foreground tabular-nums">{value}</p>
              <p className="text-[12px] text-muted font-medium mt-1">{k.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Project Health — wider */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-border p-6 animate-slide-in-up">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[15px] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Project Health
            </h2>
            <span className="text-[12px] text-muted">{data.projectHealth.length} projects</span>
          </div>
          <div className="space-y-4">
            {data.projectHealth.length === 0 && <p className="text-[13px] text-muted py-8 text-center">No projects yet — create one to get started</p>}
            {data.projectHealth.map((p) => (
              <div
                key={p.id}
                className="group flex items-center gap-4 p-4 rounded-xl border border-transparent hover:border-border hover:bg-surface transition-all duration-200"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-[14px] font-semibold truncate">{p.name}</p>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-700 ease-out",
                          p.progress >= 70 ? "bg-gradient-to-r from-emerald-400 to-emerald-500" :
                          p.progress >= 40 ? "bg-gradient-to-r from-amber-400 to-orange-400" :
                          "bg-gradient-to-r from-rose-400 to-red-400"
                        )}
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                    <span className="text-[12px] font-semibold text-muted tabular-nums w-10 text-right">{p.progress}%</span>
                  </div>
                  <p className="text-[11px] text-muted mt-1.5">{p.tasksDone} of {p.tasksTotal} tasks completed</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Blockers */}
          <div className="bg-white rounded-2xl border border-border p-6 animate-slide-in-up" style={{ animationDelay: "100ms" }}>
            <h2 className="font-bold text-[15px] flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              Active Blockers
              {data.blockers.length > 0 && (
                <span className="ml-auto text-[11px] bg-destructive/10 text-destructive font-semibold px-2 py-0.5 rounded-full">{data.blockers.length}</span>
              )}
            </h2>
            <div className="space-y-3">
              {data.blockers.length === 0 && (
                <div className="text-center py-6">
                  <CheckCircle className="w-8 h-8 text-success mx-auto mb-2 opacity-50" />
                  <p className="text-[13px] text-muted">No blockers — smooth sailing!</p>
                </div>
              )}
              {data.blockers.map((b) => (
                <div key={b.id} className="p-3.5 bg-rose-50/50 border border-rose-100 rounded-xl">
                  <p className="text-[13px] font-medium text-card-foreground">{b.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[11px] text-muted">{b.projectName}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                    <span className={cn(
                      "text-[11px] font-semibold",
                      b.severity === "high" || b.severity === "critical" ? "text-destructive" : "text-warning"
                    )}>
                      {b.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-border p-6 animate-slide-in-up" style={{ animationDelay: "200ms" }}>
            <h2 className="font-bold text-[15px] mb-4">Recent Activity</h2>
            <div className="space-y-0">
              {data.recentLogs.length === 0 && <p className="text-[13px] text-muted text-center py-6">No recent activity</p>}
              {data.recentLogs.map((l, i) => (
                <div key={l.id} className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
                  <div className="mt-1.5 relative">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    {i < data.recentLogs.length - 1 && <div className="absolute top-3 left-[3px] w-0.5 h-full bg-border" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-card-foreground">{l.summary}</p>
                    <p className="text-[11px] text-muted mt-0.5">{l.projectName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
