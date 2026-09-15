import { useState, useEffect } from "react";
import { AlertTriangle, Plus, Shield, X, Loader2 } from "lucide-react";
import { api } from "@/services/api";
import { cn } from "@/lib/utils";

interface Risk { id: string; title: string; description: string; severity: string; status: string; mitigation: string; projectName: string }
interface Project { id: string; name: string }

export default function RiskRegister() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ description: "", projectId: "", severity: "medium", mitigation: "" });

  useEffect(() => {
    api.get("/projects").then((p: any[]) => setProjects(p.map((x) => ({ id: x.id, name: x.name })))).catch(() => {});
    api.get("/dashboard").then((d: any) => {
      if (d.blockers) {
        setRisks(d.blockers.map((b: any) => ({
          id: b.id, title: b.description, description: b.description,
          severity: b.severity, status: "open", mitigation: "", projectName: b.projectName,
        })));
      }
    }).catch(() => {});
  }, []);

  const addRisk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim()) return;
    setSaving(true);
    try {
      const project = projects.find((p) => p.id === form.projectId);
      const newRisk: Risk = {
        id: Date.now().toString(),
        title: form.description,
        description: form.description,
        severity: form.severity,
        status: "open",
        mitigation: form.mitigation,
        projectName: project?.name || "General",
      };
      setRisks([newRisk, ...risks]);
      setForm({ description: "", projectId: "", severity: "medium", mitigation: "" });
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const severityConfig: Record<string, { bg: string; text: string }> = {
    critical: { bg: "bg-rose-50 border-rose-200", text: "text-rose-700" },
    high: { bg: "bg-orange-50 border-orange-200", text: "text-orange-700" },
    medium: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700" },
    low: { bg: "bg-sky-50 border-sky-200", text: "text-sky-700" },
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Risk Register</h1>
            <p className="text-[13px] text-muted">Track, assess, and mitigate project risks</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 bg-gradient-to-r from-gradient-start to-gradient-end text-white rounded-xl text-[13px] font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Add Risk"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addRisk} className="bg-white rounded-2xl border border-border p-6 animate-scale-in">
          <h2 className="font-bold text-[15px] mb-4">New Risk</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-[12px] font-semibold mb-1.5">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What could go wrong?"
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold mb-1.5">Project</label>
              <select
                value={form.projectId}
                onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select project...</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-semibold mb-1.5">Severity</label>
              <select
                value={form.severity}
                onChange={(e) => setForm({ ...form, severity: e.target.value })}
                className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-[12px] font-semibold mb-1.5">Mitigation Plan</label>
              <textarea
                rows={2}
                value={form.mitigation}
                onChange={(e) => setForm({ ...form, mitigation: e.target.value })}
                placeholder="How will you mitigate this risk?"
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-primary text-white rounded-xl text-[13px] font-semibold flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add Risk
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-border overflow-hidden animate-slide-in-up">
        {risks.length === 0 ? (
          <div className="text-center py-16">
            <Shield className="w-12 h-12 text-muted mx-auto mb-3 opacity-30" />
            <p className="text-[14px] font-medium text-muted mb-1">No risks registered</p>
            <p className="text-[12px] text-muted-foreground">Add risks to track and mitigate potential project issues</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border bg-surface/50">
                  <th className="text-left px-6 py-3.5 font-semibold text-muted text-[12px] uppercase tracking-wider">Risk</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-muted text-[12px] uppercase tracking-wider">Project</th>
                  <th className="text-center px-6 py-3.5 font-semibold text-muted text-[12px] uppercase tracking-wider">Severity</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-muted text-[12px] uppercase tracking-wider">Mitigation</th>
                </tr>
              </thead>
              <tbody>
                {risks.map((r) => {
                  const sev = severityConfig[r.severity] || severityConfig.medium;
                  return (
                    <tr key={r.id} className="border-b border-border/50 last:border-0 hover:bg-surface/30 transition-colors">
                      <td className="px-6 py-4 font-medium">{r.description}</td>
                      <td className="px-6 py-4 text-muted">{r.projectName}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={cn("text-[11px] px-2.5 py-1 rounded-full font-semibold border", sev.bg, sev.text)}>{r.severity}</span>
                      </td>
                      <td className="px-6 py-4 text-muted">{r.mitigation || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
