import { Settings as SettingsIcon, Link2, Brain, Mail, User, CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const tools = [
  { name: "ClickUp", status: false, desc: "Project management & task tracking" },
  { name: "Jira", status: false, desc: "Issue tracking & agile boards" },
  { name: "Asana", status: false, desc: "Team collaboration & workflows" },
  { name: "Odoo", status: false, desc: "All-in-one business management" },
  { name: "Manual", status: true, desc: "Direct database — always available" },
];

const aiProviders = [
  { name: "Gemini", status: true, desc: "Google's AI — fast and capable" },
  { name: "OpenAI", status: false, desc: "GPT-4 and GPT-3.5 models" },
  { name: "Anthropic", status: false, desc: "Claude — nuanced reasoning" },
];

export default function Settings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3 animate-fade-in">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <SettingsIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Settings</h1>
          <p className="text-[13px] text-muted">Configure integrations, AI providers, and profile</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* PM Tool Integrations */}
        <div className="bg-white rounded-2xl border border-border p-6 animate-slide-in-up">
          <div className="flex items-center gap-2 mb-5">
            <Link2 className="w-4 h-4 text-primary" />
            <h2 className="font-bold text-[15px]">PM Tool Integration</h2>
          </div>
          <div className="space-y-3">
            {tools.map((tool) => (
              <div key={tool.name} className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:bg-surface/50 transition-colors">
                <div>
                  <p className="text-[14px] font-semibold">{tool.name}</p>
                  <p className="text-[11px] text-muted mt-0.5">{tool.desc}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {tool.status ? (
                    <><CheckCircle className="w-4 h-4 text-success" /><span className="text-[11px] font-semibold text-success">Active</span></>
                  ) : (
                    <><Circle className="w-4 h-4 text-muted-foreground" /><span className="text-[11px] font-medium text-muted">Connect</span></>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Provider */}
        <div className="bg-white rounded-2xl border border-border p-6 animate-slide-in-up" style={{ animationDelay: "50ms" }}>
          <div className="flex items-center gap-2 mb-5">
            <Brain className="w-4 h-4 text-primary" />
            <h2 className="font-bold text-[15px]">AI Provider</h2>
          </div>
          <div className="space-y-3">
            {aiProviders.map((ai) => (
              <div key={ai.name} className={cn(
                "flex items-center justify-between p-3.5 rounded-xl border transition-colors",
                ai.status ? "border-primary/30 bg-primary/5" : "border-border hover:bg-surface/50"
              )}>
                <div>
                  <p className="text-[14px] font-semibold">{ai.name}</p>
                  <p className="text-[11px] text-muted mt-0.5">{ai.desc}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {ai.status ? (
                    <><CheckCircle className="w-4 h-4 text-primary" /><span className="text-[11px] font-semibold text-primary">Active</span></>
                  ) : (
                    <><Circle className="w-4 h-4 text-muted-foreground" /><span className="text-[11px] font-medium text-muted">Setup</span></>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gmail */}
        <div className="bg-white rounded-2xl border border-border p-6 animate-slide-in-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-2 mb-5">
            <Mail className="w-4 h-4 text-primary" />
            <h2 className="font-bold text-[15px]">Gmail Integration</h2>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
            <p className="text-[13px] text-amber-800 font-medium">Draft-Only Mode</p>
            <p className="text-[12px] text-amber-700 mt-1">All emails are saved as Gmail Drafts. You review and send manually — no automatic sending.</p>
          </div>
          <button className="px-5 py-2.5 bg-gradient-to-r from-gradient-start to-gradient-end text-white rounded-xl text-[13px] font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all">
            Connect Gmail
          </button>
        </div>

        {/* Profile */}
        <div className="bg-white rounded-2xl border border-border p-6 animate-slide-in-up" style={{ animationDelay: "150ms" }}>
          <div className="flex items-center gap-2 mb-5">
            <User className="w-4 h-4 text-primary" />
            <h2 className="font-bold text-[15px]">Profile</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: "Name", value: "Muhammad Abdullah Rafique" },
              { label: "Email", value: "abdullahrafique1@gmail.com" },
              { label: "Role", value: "Project Manager" },
              { label: "Company", value: "HST" },
            ].map((f) => (
              <div key={f.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <span className="text-[12px] font-medium text-muted">{f.label}</span>
                <span className="text-[13px] font-semibold">{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
