import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Users, Plus, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Member { id: string; name: string; role: string; email: string; activeTasks: number; completedTasks: number; totalHours: number }

function LoadBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const color = pct > 80 ? "from-rose-400 to-red-500" : pct > 50 ? "from-amber-400 to-orange-400" : "from-emerald-400 to-emerald-500";
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-surface rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] text-muted tabular-nums">{value}/{max}</span>
    </div>
  );
}

export default function TeamWorkload() {
  const [team, setTeam] = useState<Member[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "", department: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/team").then(setTeam).catch(console.error);
  }, []);

  const addMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const member = await api.post("/team", form);
      setTeam([...team, { ...member, activeTasks: 0, completedTasks: 0, totalHours: 0 }]);
      setForm({ name: "", email: "", role: "", department: "" });
      setShowAdd(false);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Team Workload</h1>
            <p className="text-[13px] text-muted">{team.length} team members</p>
          </div>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2.5 bg-gradient-to-r from-gradient-start to-gradient-end text-white rounded-xl text-[13px] font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {showAdd && (
        <form onSubmit={addMember} className="bg-white rounded-2xl border border-border p-6 animate-scale-in">
          <h2 className="font-bold text-[15px] mb-4">New Team Member</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: "name", label: "Full Name", placeholder: "John Doe" },
              { key: "email", label: "Email", placeholder: "john@example.com" },
              { key: "role", label: "Role", placeholder: "Frontend Developer" },
              { key: "department", label: "Department", placeholder: "Engineering" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-[12px] font-semibold mb-1.5">{f.label}</label>
                <input
                  value={(form as any)[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required={f.key === "name" || f.key === "email"}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 text-[13px] text-muted hover:text-card-foreground transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2 bg-primary text-white rounded-xl text-[13px] font-semibold disabled:opacity-50 flex items-center gap-2">
              <Plus className="w-4 h-4" />{saving ? "Saving..." : "Add"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-border overflow-hidden animate-slide-in-up">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-surface/50">
              <th className="text-left px-6 py-3.5 font-semibold text-muted text-[12px] uppercase tracking-wider">Member</th>
              <th className="text-left px-6 py-3.5 font-semibold text-muted text-[12px] uppercase tracking-wider">Role</th>
              <th className="text-center px-6 py-3.5 font-semibold text-muted text-[12px] uppercase tracking-wider">Active</th>
              <th className="text-center px-6 py-3.5 font-semibold text-muted text-[12px] uppercase tracking-wider">Done</th>
              <th className="text-left px-6 py-3.5 font-semibold text-muted text-[12px] uppercase tracking-wider">Workload</th>
            </tr>
          </thead>
          <tbody>
            {team.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-muted">No team members yet — add one to get started</td></tr>
            )}
            {team.map((m) => (
              <tr key={m.id} className="border-b border-border/50 last:border-0 hover:bg-surface/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-light to-gradient-end flex items-center justify-center text-white text-[12px] font-bold">
                      {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold">{m.name}</p>
                      <p className="text-[11px] text-muted">{m.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted">{m.role || "—"}</td>
                <td className="px-6 py-4 text-center font-semibold tabular-nums">{m.activeTasks}</td>
                <td className="px-6 py-4 text-center font-semibold text-success tabular-nums">{m.completedTasks}</td>
                <td className="px-6 py-4"><LoadBar value={m.activeTasks} max={8} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
