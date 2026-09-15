import { useState } from "react";
import { AlertTriangle, Plus } from "lucide-react";

interface Risk { id: string; title: string; description: string; severity: string; status: string; mitigation: string; projectName: string }

export default function RiskRegister() {
  const [risks] = useState<Risk[]>([]);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-warning" />
          Risk Register
        </h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Risk
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-border p-5">
          <h2 className="font-semibold mb-3">New Risk</h2>
          <p className="text-sm text-muted">Risk form coming soon — connect to backend Risk model</p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-accent/50">
              <th className="text-left px-5 py-3 font-medium">Risk</th>
              <th className="text-left px-5 py-3 font-medium">Project</th>
              <th className="text-center px-5 py-3 font-medium">Severity</th>
              <th className="text-center px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Mitigation</th>
            </tr>
          </thead>
          <tbody>
            {risks.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-muted">No risks registered yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
