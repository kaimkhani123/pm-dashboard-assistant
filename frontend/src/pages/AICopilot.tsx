import { useState, useRef, useEffect } from "react";
import { api } from "@/services/api";
import { Brain, Sun, Send, Loader2, Sparkles, MessageSquare, Bot, User, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message { role: "user" | "ai"; content: string; timestamp: Date }

const quickActions = [
  { label: "What's overdue?", prompt: "What tasks are overdue across all projects?" },
  { label: "Team workload", prompt: "Show me the team workload distribution" },
  { label: "Risk summary", prompt: "What are the current blockers and risks?" },
  { label: "This week", prompt: "What was accomplished this week?" },
];

export default function AICopilot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [briefing, setBriefing] = useState("");
  const [loading, setLoading] = useState(false);
  const [briefingLoading, setBriefingLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getMorningBriefing = async () => {
    setBriefingLoading(true);
    try {
      const res = await api.get("/ai/briefing");
      setBriefing(res.briefing);
    } catch (err: any) {
      setBriefing("Could not generate briefing. Please check your AI provider key in Settings.");
    } finally {
      setBriefingLoading(false);
    }
  };

  const askQuestion = async (prompt?: string) => {
    const q = prompt || question;
    if (!q.trim()) return;
    const userMsg: Message = { role: "user", content: q, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setLoading(true);
    try {
      const res = await api.post("/ai/ask", { question: q });
      setMessages((prev) => [...prev, { role: "ai", content: res.answer, timestamp: new Date() }]);
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: "ai", content: "Sorry, I couldn't process that. Check your AI provider key.", timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    askQuestion();
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header card */}
      <div className="bg-gradient-to-r from-gradient-start to-gradient-end rounded-2xl p-6 text-white relative overflow-hidden animate-fade-in">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-6 h-6" />
              <h1 className="text-xl font-bold">AI Co-Pilot</h1>
            </div>
            <p className="text-white/70 text-[14px] max-w-md">
              Your intelligent PM assistant. Get daily briefings, ask questions about your projects, and get AI-powered recommendations.
            </p>
          </div>
          <button
            onClick={getMorningBriefing}
            disabled={briefingLoading}
            className="px-5 py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur rounded-xl text-[13px] font-semibold transition-all flex items-center gap-2 border border-white/10"
          >
            {briefingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sun className="w-4 h-4" />}
            Morning Briefing
          </button>
        </div>
      </div>

      {/* Briefing */}
      {briefing && (
        <div className="bg-white rounded-2xl border border-border p-6 animate-scale-in">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Sun className="w-4 h-4 text-amber-500" />
            </div>
            <h2 className="font-bold text-[15px]">Today's Briefing</h2>
          </div>
          <div className="text-[13px] text-card-foreground leading-relaxed whitespace-pre-wrap pl-10">{briefing}</div>
        </div>
      )}

      {/* Quick actions */}
      <div className="flex gap-2 flex-wrap animate-fade-in" style={{ animationDelay: "100ms" }}>
        <Lightbulb className="w-4 h-4 text-muted mt-1.5" />
        {quickActions.map((a) => (
          <button
            key={a.label}
            onClick={() => askQuestion(a.prompt)}
            disabled={loading}
            className="px-3.5 py-2 bg-white border border-border rounded-xl text-[12px] font-medium text-muted hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all disabled:opacity-50"
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Chat */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden animate-slide-in-up" style={{ animationDelay: "150ms" }}>
        <div className="border-b border-border px-6 py-3 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          <span className="text-[13px] font-semibold">Chat with your PM Assistant</span>
        </div>

        {/* Messages */}
        <div className="min-h-[300px] max-h-[500px] overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-4">
                <Sparkles className="w-7 h-7 text-primary/40" />
              </div>
              <p className="text-[14px] font-medium text-muted mb-1">Ask me anything about your projects</p>
              <p className="text-[12px] text-muted-foreground">I can help with task status, team workload, risk assessment, and more</p>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={cn("flex gap-3 animate-fade-in", m.role === "user" ? "justify-end" : "")}>
              {m.role === "ai" && (
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed",
                  m.role === "user"
                    ? "bg-gradient-to-r from-gradient-start to-gradient-end text-white rounded-br-md"
                    : "bg-surface text-card-foreground rounded-bl-md border border-border"
                )}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
                <p className={cn("text-[10px] mt-2", m.role === "user" ? "text-white/50" : "text-muted")}>
                  {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              {m.role === "user" && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gradient-start to-gradient-end flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-surface rounded-2xl rounded-bl-md px-4 py-3 border border-border">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-border p-4 flex gap-3">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about your projects, tasks, team workload..."
            className="flex-1 px-4 py-3 bg-surface border border-border rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground/50 transition-all"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="px-5 py-3 bg-gradient-to-r from-gradient-start to-gradient-end text-white rounded-xl text-[13px] font-semibold hover:shadow-lg hover:shadow-primary/20 disabled:opacity-40 transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
