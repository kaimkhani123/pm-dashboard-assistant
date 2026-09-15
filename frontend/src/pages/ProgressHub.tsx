import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { BarChart3 } from "lucide-react";

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

  if (!data) return <div className="flex items-center justify-center h-64 text-muted">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-primary" />
        Weekly Progress
      </h1>
      <p className="text-sm text-muted">{data.weekStart} — {data.weekEnd}</p>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Completed", value: data.summary.completed, color: "text-success" },
          { label: "New Tasks", value: data.summary.added, color: "text-primary" },
          { label: "In Progress", value: data.summary.inProgress, color: "text-warning" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-border p-4 text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-border p-5">
        <h2 className="font-semibold mb-4">Completed This Week</h2>
        <div className="space-y-4">
          {data.completedByProject.length === 0 && <p className="text-sm text-muted">No completed tasks this week</p>}
          {data.completedByProject.map((p) => (
            <div key={p.projectName}>
              <h3 className="text-sm font-medium text-primary mb-2">{p.projectName}</h3>
              <ul className="space-y-1 pl-4">
                {p.tasks.map((t, i) => (
                  <li key={i} className="text-sm text-muted flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
