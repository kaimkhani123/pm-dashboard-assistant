import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { FolderKanban, Plus, X, Loader2, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  id: string; name: string; category: string; status: string; clientName: string;
  startDate: string; targetDate: string; totalTasks: number; completedTasks: number;
  overdueTasks: number; progress: number;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", category: "implementation", clientName: "", startDate: "", targetDate: "" });

  const load = () => {
    api.get("/projects").then((p: any[]) => {
      setProjects(p);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(load, []);

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/projects", form);
      setForm({ name: "", category: "implementation", clientName: "", startDate: "", targetDate: "" });
      setShowForm(false);
      load();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const statusIcon = (p: Project) => {
    if (p.overdueTasks > 0) return <AlertTriangle className="w-4 h-4 text-destructive" />;
    if (p.progress >= 100) return <CheckCircle className="w-4 h-4 text-success" />;
    return <Clock className="w-4 h-4 text-amber-500" />;
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl">
        <div className="skeleton h-16 rounded-2xl" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <FolderKanban className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Projects</h1>
            <p className="text-[13px] text-muted">{projects.length} projects</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 bg-gradient-to-r from-gradient-start to-gradient-end text-white rounded-xl text-[13px] font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "New Project"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={createProject} className="bg-white rounded-2xl border border-border p-6 animate-scale-in">
          <h2 className="font-bold text-[15px] mb-4">Create Project</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-[12px] font-semibold mb-1.5">Project Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., CRM Implementation Phase 2"
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="implementation">Implementation</option>
                <option value="support">Support</option>
                <option value="internal">Internal</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-semibold mb-1.5">Client Name</label>
              <input
                value={form.clientName}
                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                placeholder="Client or stakeholder"
                className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold mb-1.5">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold mb-1.5">Target Date</label>
              <input
                type="date"
                value={form.targetDate}
                onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
                className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button type="submit" disabled={saving} className="px-5 py-2.5 bg-primary text-white rounded-xl text-[13px] font-semibold flex items-center gap-2 disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Create Project
            </button>
          </div>
        </form>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {projects.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-border p-5 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-[14px] font-bold truncate">{p.name}</h3>
                <p className="text-[11px] text-muted mt-0.5">{p.clientName || p.category}</p>
              </div>
              {statusIcon(p)}
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    p.progress >= 70 ? "bg-gradient-to-r from-emerald-400 to-emerald-500" :
                    p.progress >= 40 ? "bg-gradient-to-r from-amber-400 to-orange-400" :
                    "bg-gradient-to-r from-rose-400 to-red-400"
                  )}
                  style={{ width: `${p.progress}%` }}
                />
              </div>
              <span className="text-[12px] font-semibold text-muted tabular-nums">{p.progress}%</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-surface rounded-lg py-2">
                <p className="text-[16px] font-bold tabular-nums">{p.totalTasks}</p>
                <p className="text-[10px] text-muted">Total</p>
              </div>
              <div className="bg-emerald-50 rounded-lg py-2">
                <p className="text-[16px] font-bold text-emerald-600 tabular-nums">{p.completedTasks}</p>
                <p className="text-[10px] text-emerald-600">Done</p>
              </div>
              <div className={cn("rounded-lg py-2", p.overdueTasks > 0 ? "bg-rose-50" : "bg-surface")}>
                <p className={cn("text-[16px] font-bold tabular-nums", p.overdueTasks > 0 ? "text-destructive" : "")}>{p.overdueTasks}</p>
                <p className={cn("text-[10px]", p.overdueTasks > 0 ? "text-destructive" : "text-muted")}>Overdue</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-border">
          <FolderKanban className="w-12 h-12 text-muted mx-auto mb-3 opacity-30" />
          <p className="text-[14px] font-medium text-muted mb-1">No projects yet</p>
          <p className="text-[12px] text-muted-foreground">Create your first project to start tracking work</p>
        </div>
      )}
    </div>
  );
}
