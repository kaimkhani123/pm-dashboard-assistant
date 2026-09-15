import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { BarChart3, TrendingUp, Plus, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeeklyData {
  weekStart: string;
  weekEnd: string;
  summary: { completed: number; added: number; inProgress: number };
  completedByProject: { projectName: string; tasks: string[] }[];
}

export default function ProgressHub() {
  const [data, setData] = useState<WeeklyData | null>(null);

  useEffect(() => {
    api.get("/dashboard/weekly").then(setData).catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="skeleton h-20 rounded-2xl" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Completed", value: data.summary.completed, icon: CheckCircle, gradient: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50", text: "text-emerald-600" },
    { label: "New Tasks", value: data.summary.added, icon: Plus, gradient: "from-indigo-500 to-indigo-600", bg: "bg-indigo-50", text: "text-indigo-600" },
    { label: "In Progress", value: data.summary.inProgress, icon: TrendingUp, gradient: "from-amber-500 to-orange-500", bg: "bg-amber-50", text: "text-amber-600" },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Weekly Progress</h1>
            <p className="text-[13px] text-muted">{data.weekStart} — {data.weekEnd}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 stagger-children">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-border p-5 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", s.bg)}>
              <s.icon className={cn("w-5 h-5", s.text)} />
            </div>
            <p className="text-3xl font-bold tabular-nums">{s.value}</p>
            <p className="text-[12px] text-muted font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-border p-6 animate-slide-in-up">
        <h2 className="font-bold text-[15px] mb-5 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-success" />
          Completed This Week
        </h2>
        <div className="space-y-5">
          {data.completedByProject.length === 0 && (
            <div className="text-center py-8">
              <BarChart3 className="w-8 h-8 text-muted mx-auto mb-2 opacity-40" />
              <p className="text-[13px] text-muted">No completed tasks this week</p>
            </div>
          )}
          {data.completedByProject.map((p) => (
            <div key={p.projectName}>
              <h3 className="text-[13px] font-bold text-primary mb-2">{p.projectName}</h3>
              <div className="space-y-1.5 pl-4">
                {p.tasks.map((t, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-[13px]">
                    <CheckCircle className="w-3.5 h-3.5 text-success shrink-0" />
                    <span className="text-card-foreground">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
