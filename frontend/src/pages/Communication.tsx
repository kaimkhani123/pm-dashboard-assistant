import { useState } from "react";
import { Mail, Send, Loader2, AlertCircle, Sparkles } from "lucide-react";

export default function Communication() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  const saveDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      alert("Draft saved to Gmail (integration pending — connect Gmail in Settings)");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3 animate-fade-in">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Mail className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Communication Hub</h1>
          <p className="text-[13px] text-muted">Compose and save as Gmail Draft — you review and send manually</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-start gap-3 animate-fade-in">
        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-[13px] text-amber-800">
          <strong>Draft Only.</strong> No email is ever sent automatically. All generated emails are saved as drafts in your Gmail for manual review.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6 animate-slide-in-up">
        <form onSubmit={saveDraft} className="space-y-5">
          <div>
            <label className="block text-[12px] font-semibold mb-1.5">To</label>
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold mb-1.5">Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold mb-1.5">Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              placeholder="Compose your email..."
              className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none placeholder:text-muted-foreground/50"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="px-4 py-2.5 border border-border rounded-xl text-[13px] font-medium text-muted hover:text-primary hover:border-primary/30 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              AI Compose
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-gradient-start to-gradient-end text-white rounded-xl text-[13px] font-semibold hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Save as Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
