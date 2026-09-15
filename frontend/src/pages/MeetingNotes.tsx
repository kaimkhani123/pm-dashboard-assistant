import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { FileText, Sparkles, Loader2 } from "lucide-react";

interface Meeting { id: string; title: string; date: string; attendees: string; notes: string; actionItems: string[] }

export default function MeetingNotes() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [rawNotes, setRawNotes] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [actions, setActions] = useState<string[]>([]);

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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <FileText className="w-6 h-6 text-primary" />
        Meeting Notes
      </h1>

      <div className="bg-white rounded-xl border border-border p-5">
        <h2 className="font-semibold mb-3">Extract Action Items from Notes</h2>
        <textarea
          value={rawNotes}
          onChange={(e) => setRawNotes(e.target.value)}
          rows={6}
          placeholder="Paste your meeting notes here and AI will extract action items..."
          className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none mb-3"
        />
        <button
          onClick={extractActions}
          disabled={extracting || !rawNotes.trim()}
          className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
        >
          {extracting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Extract Actions
        </button>
        {actions.length > 0 && (
          <div className="mt-4 bg-accent rounded-lg p-4">
            <h3 className="text-sm font-medium mb-2">Action Items</h3>
            <ul className="space-y-1">
              {actions.map((a, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-border p-5">
        <h2 className="font-semibold mb-4">Past Meetings</h2>
        <div className="space-y-3">
          {meetings.length === 0 && <p className="text-sm text-muted">No meeting notes yet</p>}
          {meetings.map((m) => (
            <div key={m.id} className="p-3 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium">{m.title}</p>
                <span className="text-xs text-muted">{m.date}</span>
              </div>
              <p className="text-xs text-muted">{m.attendees}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
