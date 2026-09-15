import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { CalendarDays, Plus, Loader2, CheckCircle } from "lucide-react";

interface LogEntry { id: string; summary: string; date: string; projectName: string; blockers: string; mood: string }
interface Project { id: string; name: string }

export default function DailyLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const [form, setForm] = useState({ summary: "", projectId: "", blockers: "", mood: "good", date: dateStr });

  useEffect(() => {
    api.get("/projects").then((p: any[]) => setProjects(p.map((x) => ({ id: x.id, name: x.name })))).catch(() => {});
    api.get("/dashboard").then((d: any) => {
      if (d.recentLogs) {
        setLogs(d.recentLogs.map((l: any) => ({
          id: l.id, summary: l.summary, date: l.date, projectName: l.projectName, blockers: "", mood: "good",
        })));
      }
    }).catch(() => {});
  }, []);

  const addLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.summary.trim()) return;
    setSaving(true);
    try {
      const project = projects.find((p) => p.id === form.projectId);
      const newLog: LogEntry = {
        id: Date.now().toString(),
        summary: form.summary,
        date: form.date,
        projectName: project?.name || "General",
        blockers: form.blockers,
        mood: form.mood,
      };
      setLogs([newLog, ...logs]);
      setForm({ ...form, summary: "", blockers: "" });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const moodEmoji: Record<string, string> = { great: "🟢", good: "🔵", okay: "🟡", struggling: "🔴" };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3 animate-fade-in">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <CalendarDays className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Daily Log</h1>
          <p className="text-[13px] text-muted">Track what you accomplished, blockers, and team pulse</p>
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3 animate-scale-in">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <p className="text-[13px] font-medium text-emerald-800">Log entry saved!</p>
        </div>
      )}

      <form onSubmit={addLog} className="bg-white rounded-2xl border border-border p-6 animate-slide-in-up">
        <h2 className="font-bold text-[15px] mb-4">Today's Update</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold mb-1.5">Project</label>
              <select
                value={form.projectId}
                onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">General / All projects</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-semibold mb-1.5">How's it going?</label>
              <select
                value={form.mood}
                onChange={(e) => setForm({ ...form, mood: e.target.value })}
                className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="great">Great</option>
                <option value="good">Good</option>
                <option value="okay">Okay</option>
                <option value="struggling">Struggling</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-semibold mb-1.5">What did you accomplish?</label>
            <textarea
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              rows={4}
              placeholder="Completed code review for auth module, deployed staging build, updated sprint board..."
              className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none placeholder:text-muted-foreground/50"
              required
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold mb-1.5">Blockers (optional)</label>
            <input
              value={form.blockers}
              onChange={(e) => setForm({ ...form, blockers: e.target.value })}
              placeholder="Any blockers or issues?"
              className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="px-6 py-2.5 bg-gradient-to-r from-gradient-start to-gradient-end text-white rounded-xl text-[13px] font-semibold hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 transition-all flex items-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Log Entry
            </button>
          </div>
        </div>
      </form>

      <div className="bg-white rounded-2xl border border-border overflow-hidden animate-slide-in-up" style={{ animationDelay: "100ms" }}>
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-bold text-[15px]">Recent Logs</h2>
        </div>
        <div className="divide-y divide-border/50">
          {logs.length === 0 && (
            <div className="text-center py-12">
              <CalendarDays className="w-8 h-8 text-muted mx-auto mb-2 opacity-40" />
              <p className="text-[13px] text-muted">No log entries yet — add your first daily update above</p>
            </div>
          )}
          {logs.map((l) => (
            <div key={l.id} className="px-6 py-4 hover:bg-surface/30 transition-colors">
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">{moodEmoji[l.mood] || "🔵"}</span>
                <div className="flex-1">
                  <p className="text-[13px] text-card-foreground">{l.summary}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[11px] text-muted">{l.projectName}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                    <span className="text-[11px] text-muted">{l.date}</span>
                  </div>
                  {l.blockers && (
                    <p className="text-[12px] text-destructive mt-1.5">Blocker: {l.blockers}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
