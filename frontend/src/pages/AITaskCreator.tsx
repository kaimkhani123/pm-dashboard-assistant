import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { ListTodo, Sparkles, Plus, Loader2, CheckCircle, Clock, AlertTriangle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GeneratedTask { title: string; description: string; priority: string; estimatedHours: number }
interface Project { id: string; name: string }

const templates = [
  { label: "Sprint Planning", prompt: "Break down a 2-week sprint for a web app feature including frontend, backend, testing, and deployment tasks" },
  { label: "Bug Fix Workflow", prompt: "Create a bug fix workflow with investigation, root cause analysis, fix implementation, code review, and testing" },
  { label: "Onboarding", prompt: "Create onboarding tasks for a new team member: setup environment, access requests, documentation review, and first ticket" },
  { label: "Release Checklist", prompt: "Create a release checklist: code freeze, QA testing, staging deployment, documentation update, production deploy, monitoring" },
];

export default function AITaskCreator() {
  const [prompt, setPrompt] = useState("");
  const [tasks, setTasks] = useState<GeneratedTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get("/projects").then((p: any[]) => {
      setProjects(p.map((x) => ({ id: x.id, name: x.name })));
      if (p.length > 0) setSelectedProject(p[0].id);
    }).catch(() => {});
  }, []);

  const generate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setSaved(false);
    try {
      const res = await api.post("/ai/generate-tasks", { prompt });
      setTasks(res.tasks || []);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeTask = (i: number) => setTasks(tasks.filter((_, idx) => idx !== i));

  const saveAll = async () => {
    if (!selectedProject) return alert("Select a project first");
    setSaving(true);
    try {
      await api.post("/tasks/bulk", {
        tasks: tasks.map((t) => ({ title: t.title, description: t.description, projectId: selectedProject, priority: t.priority.toUpperCase(), estimatedHours: t.estimatedHours })),
      });
      setTasks([]);
      setPrompt("");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const priorityConfig: Record<string, { icon: typeof Clock; bg: string; text: string }> = {
    URGENT: { icon: AlertTriangle, bg: "bg-rose-50 border-rose-200", text: "text-rose-700" },
    HIGH: { icon: AlertTriangle, bg: "bg-orange-50 border-orange-200", text: "text-orange-700" },
    MEDIUM: { icon: Clock, bg: "bg-amber-50 border-amber-200", text: "text-amber-700" },
    NORMAL: { icon: Clock, bg: "bg-sky-50 border-sky-200", text: "text-sky-700" },
    LOW: { icon: CheckCircle, bg: "bg-slate-50 border-slate-200", text: "text-slate-600" },
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-gradient-start to-gradient-end rounded-2xl p-6 text-white relative overflow-hidden animate-fade-in">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <ListTodo className="w-5 h-5" />
            <h1 className="text-xl font-bold">AI Task Creator</h1>
          </div>
          <p className="text-white/70 text-[14px] max-w-lg">Describe what needs to be done in natural language. AI will break it down into structured, actionable tasks.</p>
        </div>
      </div>

      {/* Templates */}
      <div className="flex gap-2 flex-wrap animate-fade-in" style={{ animationDelay: "50ms" }}>
        <span className="text-[12px] text-muted font-medium py-2">Templates:</span>
        {templates.map((t) => (
          <button
            key={t.label}
            onClick={() => { setPrompt(t.prompt); }}
            className="px-3.5 py-2 bg-white border border-border rounded-xl text-[12px] font-medium text-muted hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all"
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={generate} className="bg-white rounded-2xl border border-border p-6 animate-slide-in-up">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          placeholder="e.g., Build user authentication with login, registration, password reset, and email verification..."
          className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none placeholder:text-muted-foreground/50 transition-all"
        />
        <div className="flex items-center justify-between mt-4">
          <p className="text-[12px] text-muted">AI will generate structured tasks with priorities and time estimates</p>
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="px-6 py-2.5 bg-gradient-to-r from-gradient-start to-gradient-end text-white rounded-xl text-[13px] font-semibold hover:shadow-lg hover:shadow-primary/20 disabled:opacity-40 transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate Tasks
          </button>
        </div>
      </form>

      {/* Success message */}
      {saved && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3 animate-scale-in">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <p className="text-[13px] font-medium text-emerald-800">Tasks created successfully!</p>
        </div>
      )}

      {/* Generated tasks */}
      {tasks.length > 0 && (
        <div className="bg-white rounded-2xl border border-border overflow-hidden animate-scale-in">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-bold text-[15px]">{tasks.length} Tasks Generated</h2>
              <p className="text-[12px] text-muted mt-0.5">Review, edit, and save to a project</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="px-3 py-2 bg-surface border border-border rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select project...</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <button
                onClick={saveAll}
                disabled={saving || !selectedProject}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[13px] font-semibold disabled:opacity-40 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {saving ? "Saving..." : "Save All"}
              </button>
            </div>
          </div>
          <div className="divide-y divide-border">
            {tasks.map((t, i) => {
              const p = priorityConfig[t.priority.toUpperCase()] || priorityConfig.NORMAL;
              return (
                <div key={i} className="flex items-start gap-4 px-6 py-4 hover:bg-surface/50 transition-colors group">
                  <span className="text-[12px] font-mono text-muted-foreground mt-1 w-6 text-center">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-card-foreground">{t.title}</p>
                    <p className="text-[12px] text-muted mt-1 leading-relaxed">{t.description}</p>
                  </div>
                  <span className={cn("text-[11px] px-2.5 py-1 rounded-full font-semibold border shrink-0", p.bg, p.text)}>
                    {t.priority}
                  </span>
                  <span className="text-[12px] text-muted font-medium tabular-nums shrink-0">{t.estimatedHours}h</span>
                  <button onClick={() => removeTask(i)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
