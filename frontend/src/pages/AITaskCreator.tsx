import { useState } from "react";
import { api } from "@/services/api";
import { ListTodo, Sparkles, Plus, Loader2 } from "lucide-react";

interface GeneratedTask { title: string; description: string; priority: string; estimatedHours: number }

export default function AITaskCreator() {
  const [prompt, setPrompt] = useState("");
  const [tasks, setTasks] = useState<GeneratedTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [projectId, setProjectId] = useState("");

  const generate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await api.post("/ai/generate-tasks", { prompt });
      setTasks(res.tasks || []);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveAll = async () => {
    if (!projectId) return alert("Select a project first");
    setSaving(true);
    try {
      await api.post("/tasks/bulk", {
        projectId,
        tasks: tasks.map((t) => ({ title: t.title, description: t.description, priority: t.priority.toUpperCase(), estimatedHours: t.estimatedHours })),
      });
      setTasks([]);
      setPrompt("");
      alert("Tasks created successfully!");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <ListTodo className="w-6 h-6 text-primary" />
        AI Task Creator
      </h1>

      <div className="bg-white rounded-xl border border-border p-5">
        <h2 className="font-semibold mb-3">Describe what needs to be done</h2>
        <form onSubmit={generate} className="space-y-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder="e.g., Build user authentication with login, registration, password reset, and email verification"
            className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate Tasks
          </button>
        </form>
      </div>

      {tasks.length > 0 && (
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">{tasks.length} Tasks Generated</h2>
            <div className="flex items-center gap-3">
              <input
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="Project ID"
                className="px-3 py-2 border border-border rounded-lg text-sm w-48"
              />
              <button
                onClick={saveAll}
                disabled={saving}
                className="px-4 py-2 bg-success text-white rounded-lg text-sm font-medium hover:bg-success/90 disabled:opacity-50 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {saving ? "Saving..." : "Save All"}
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {tasks.map((t, i) => (
              <div key={i} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                <span className="text-xs font-mono text-muted mt-0.5">{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t.title}</p>
                  <p className="text-xs text-muted mt-1">{t.description}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${t.priority === "HIGH" || t.priority === "URGENT" ? "bg-destructive/10 text-destructive" : t.priority === "MEDIUM" ? "bg-warning/10 text-warning" : "bg-accent text-muted"}`}>
                  {t.priority}
                </span>
                <span className="text-xs text-muted">{t.estimatedHours}h</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
