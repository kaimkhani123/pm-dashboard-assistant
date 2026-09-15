import { useState } from "react";
import { Mail, Send, Loader2 } from "lucide-react";

export default function Communication() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  const saveDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Gmail draft creation will go through backend
      alert("Draft saved to Gmail (integration pending)");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Mail className="w-6 h-6 text-primary" />
        Communication Hub
      </h1>
      <p className="text-sm text-muted">Compose emails — all emails are saved as Gmail Drafts for manual review before sending.</p>

      <div className="bg-white rounded-xl border border-border p-5">
        <form onSubmit={saveDraft} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">To</label>
            <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="recipient@example.com" className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Subject</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Email subject" className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Body</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} placeholder="Email body..." className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" required />
          </div>
          <button type="submit" disabled={saving} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Save as Draft
          </button>
        </form>
      </div>
    </div>
  );
}
