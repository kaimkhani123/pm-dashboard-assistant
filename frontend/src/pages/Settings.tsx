import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <SettingsIcon className="w-6 h-6 text-primary" />
        Settings
      </h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-border p-5">
          <h2 className="font-semibold mb-4">PM Tool Integration</h2>
          <div className="space-y-3">
            {["ClickUp", "Jira", "Asana", "Odoo", "Manual"].map((tool) => (
              <div key={tool} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <span className="text-sm font-medium">{tool}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${tool === "Manual" ? "bg-success/10 text-success" : "bg-accent text-muted"}`}>
                  {tool === "Manual" ? "Active" : "Not Connected"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5">
          <h2 className="font-semibold mb-4">AI Provider</h2>
          <div className="space-y-3">
            {["Gemini", "OpenAI", "Anthropic"].map((ai) => (
              <div key={ai} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <span className="text-sm font-medium">{ai}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${ai === "Gemini" ? "bg-success/10 text-success" : "bg-accent text-muted"}`}>
                  {ai === "Gemini" ? "Active" : "Not Configured"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5">
          <h2 className="font-semibold mb-4">Gmail Integration</h2>
          <p className="text-sm text-muted mb-3">All emails are saved as Gmail Drafts. You review and send manually.</p>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
            Connect Gmail
          </button>
        </div>

        <div className="bg-white rounded-xl border border-border p-5">
          <h2 className="font-semibold mb-4">Profile</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-muted">Email:</span> abdullah.rafique@hstadvantage.com</p>
            <p><span className="text-muted">Role:</span> Project Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
}
