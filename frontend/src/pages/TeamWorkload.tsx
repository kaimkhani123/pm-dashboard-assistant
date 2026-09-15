import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Users } from "lucide-react";

interface Member { id: string; name: string; role: string; email: string; activeTasks: number; completedTasks: number; totalHours: number }

export default function TeamWorkload() {
  const [team, setTeam] = useState<Member[]>([]);

  useEffect(() => {
    api.get("/team").then(setTeam).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Users className="w-6 h-6 text-primary" />
        Team Workload
      </h1>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-accent/50">
              <th className="text-left px-5 py-3 font-medium">Name</th>
              <th className="text-left px-5 py-3 font-medium">Role</th>
              <th className="text-center px-5 py-3 font-medium">Active</th>
              <th className="text-center px-5 py-3 font-medium">Completed</th>
              <th className="text-center px-5 py-3 font-medium">Hours</th>
              <th className="text-center px-5 py-3 font-medium">Load</th>
            </tr>
          </thead>
          <tbody>
            {team.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-muted">No team members yet</td></tr>
            )}
            {team.map((m) => {
              const load = m.activeTasks > 8 ? "high" : m.activeTasks > 4 ? "medium" : "low";
              return (
                <tr key={m.id} className="border-b border-border last:border-0 hover:bg-accent/30">
                  <td className="px-5 py-3 font-medium">{m.name}</td>
                  <td className="px-5 py-3 text-muted">{m.role}</td>
                  <td className="px-5 py-3 text-center">{m.activeTasks}</td>
                  <td className="px-5 py-3 text-center text-success">{m.completedTasks}</td>
                  <td className="px-5 py-3 text-center">{m.totalHours}h</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${load === "high" ? "bg-destructive/10 text-destructive" : load === "medium" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}`}>
                      {load}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
