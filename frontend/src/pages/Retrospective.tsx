import { useState } from "react";
import { RotateCcw, Plus, ThumbsUp, ThumbsDown, Lightbulb } from "lucide-react";

interface RetroItem { id: number; type: "good" | "improve" | "action"; text: string }

export default function Retrospective() {
  const [items, setItems] = useState<RetroItem[]>([]);
  const [newText, setNewText] = useState("");
  const [newType, setNewType] = useState<"good" | "improve" | "action">("good");

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    setItems([...items, { id: Date.now(), type: newType, text: newText }]);
    setNewText("");
  };

  const columns = [
    { type: "good" as const, label: "What went well", icon: ThumbsUp, color: "text-success", bg: "bg-success/10" },
    { type: "improve" as const, label: "What to improve", icon: ThumbsDown, color: "text-destructive", bg: "bg-destructive/10" },
    { type: "action" as const, label: "Action items", icon: Lightbulb, color: "text-warning", bg: "bg-warning/10" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <RotateCcw className="w-6 h-6 text-primary" />
        Sprint Retrospective
      </h1>

      <form onSubmit={addItem} className="bg-white rounded-xl border border-border p-5 flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1.5">Add Item</label>
          <input value={newText} onChange={(e) => setNewText(e.target.value)} placeholder="Type your retrospective item..." className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <select value={newType} onChange={(e) => setNewType(e.target.value as any)} className="px-3 py-2 border border-border rounded-lg text-sm">
          <option value="good">Went Well</option>
          <option value="improve">To Improve</option>
          <option value="action">Action Item</option>
        </select>
        <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      <div className="grid lg:grid-cols-3 gap-4">
        {columns.map((col) => (
          <div key={col.type} className="bg-white rounded-xl border border-border p-5">
            <h2 className={`font-semibold mb-4 flex items-center gap-2 ${col.color}`}>
              <col.icon className="w-4 h-4" />
              {col.label}
            </h2>
            <div className="space-y-2">
              {items.filter((i) => i.type === col.type).map((item) => (
                <div key={item.id} className={`${col.bg} rounded-lg p-3 text-sm`}>{item.text}</div>
              ))}
              {items.filter((i) => i.type === col.type).length === 0 && (
                <p className="text-sm text-muted text-center py-4">No items yet</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
