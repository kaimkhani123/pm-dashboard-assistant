import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { FileText, Sparkles, Loader2, CheckCircle, Calendar, Users, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Meeting { id: string; title: string; date: string; attendees: string; notes: string; actionItems: string[] }

export default function MeetingNotes() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [rawNotes, setRawNotes] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [actions, setActions] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    api.get("/ai/meetings").then(setMeetings).catch(console.error);
  }, []);

  const extractActions = async () => {
    if (!rawNotes.trim()) return;
    setExtracting(true);
    try {
      const res = await api.post("/ai/meeting-actions", { notes: rawNotes });
      setActions(res.actions || []);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setExtracting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-gradient-start to-gradient-end rounded-2xl p-6 text-white relative overflow-hidden animate-fade-in">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5" />
            <h1 className="text-xl font-bold">Smart Notes</h1>
          </div>
          <p className="text-white/70 text-[14px] max-w-lg">Paste meeting notes and AI extracts action items, decisions, and follow-ups automatically.</p>
        </div>
      </div>

      {/* Input */}
      <div className="bg-white rounded-2xl border border-border p-6 animate-slide-in-up">
        <div className="mb-4">
          <label className="block text-[12px] font-semibold mb-1.5">Meeting Title</label>
          <input
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            placeholder="e.g., Sprint Review - Sep 15"
            className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div className="mb-4">
          <label className="block text-[12px] font-semibold mb-1.5">Meeting Notes</label>
          <textarea
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
            rows={8}
            placeholder="Paste your meeting notes here... AI will extract action items, decisions, and key takeaways."
            className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none placeholder:text-muted-foreground/50"
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[12px] text-muted">AI will analyze and extract structured action items</p>
          <button
            onClick={extractActions}
            disabled={extracting || !rawNotes.trim()}
            className="px-6 py-2.5 bg-gradient-to-r from-gradient-start to-gradient-end text-white rounded-xl text-[13px] font-semibold hover:shadow-lg hover:shadow-primary/20 disabled:opacity-40 transition-all flex items-center gap-2"
          >
            {extracting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Extract Actions
          </button>
        </div>
      </div>

      {/* Extracted actions */}
      {actions.length > 0 && (
        <div className="bg-white rounded-2xl border border-border p-6 animate-scale-in">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <h2 className="font-bold text-[15px]">{actions.length} Action Items Extracted</h2>
          </div>
          <div className="space-y-2">
            {actions.map((a, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl bg-surface border border-border/50">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[11px] font-bold text-primary">{i + 1}</span>
                </div>
                <p className="text-[13px] text-card-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past meetings */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden animate-slide-in-up" style={{ animationDelay: "100ms" }}>
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-bold text-[15px]">Past Meetings</h2>
        </div>
        <div className="divide-y divide-border/50">
          {meetings.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Calendar className="w-8 h-8 text-muted mx-auto mb-2 opacity-40" />
              <p className="text-[13px] text-muted">No meetings recorded yet</p>
            </div>
          )}
          {meetings.map((m) => (
            <div key={m.id} className="px-6 py-4 hover:bg-surface/30 transition-colors">
              <button
                onClick={() => setExpanded(expanded === m.id ? null : m.id)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div>
                    <p className="text-[14px] font-semibold">{m.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[11px] text-muted flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {m.date}
                      </span>
                      {m.attendees && (
                        <span className="text-[11px] text-muted flex items-center gap-1">
                          <Users className="w-3 h-3" /> {m.attendees}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {expanded === m.id ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
              </button>
              {expanded === m.id && (
                <div className="mt-3 pl-5 text-[13px] text-muted animate-fade-in">{m.notes || "No notes recorded"}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
