import { useState } from "react";
import { api } from "@/services/api";
import { Brain, Sun, Send, Loader2 } from "lucide-react";

export default function AICopilot() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [briefing, setBriefing] = useState("");
  const [loading, setLoading] = useState(false);
  const [briefingLoading, setBriefingLoading] = useState(false);

  const getMorningBriefing = async () => {
    setBriefingLoading(true);
    try {
      const res = await api.get("/ai/briefing");
      setBriefing(res.briefing);
    } catch (err: any) {
      setBriefing("Failed to generate briefing: " + err.message);
    } finally {
      setBriefingLoading(false);
    }
  };

  const askQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    try {
      const res = await api.post("/ai/ask", { question });
      setAnswer(res.answer);
    } catch (err: any) {
      setAnswer("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Brain className="w-6 h-6 text-primary" />
        AI Co-Pilot
      </h1>

      <div className="bg-white rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Sun className="w-4 h-4 text-warning" />
            Morning Briefing
          </h2>
          <button
            onClick={getMorningBriefing}
            disabled={briefingLoading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {briefingLoading ? "Generating..." : "Generate Briefing"}
          </button>
        </div>
        {briefing && (
          <div className="bg-accent rounded-lg p-4 text-sm whitespace-pre-wrap">{briefing}</div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-border p-5">
        <h2 className="font-semibold mb-4">Ask Your PM Assistant</h2>
        <form onSubmit={askQuestion} className="flex gap-3">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about your projects, tasks, team workload..."
            className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Ask
          </button>
        </form>
        {answer && (
          <div className="mt-4 bg-accent rounded-lg p-4 text-sm whitespace-pre-wrap">{answer}</div>
        )}
      </div>
    </div>
  );
}
