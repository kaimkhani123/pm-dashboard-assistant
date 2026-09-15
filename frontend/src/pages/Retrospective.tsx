import { useState } from "react";
import { RotateCcw, Plus, ThumbsUp, ThumbsDown, Lightbulb, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface RetroItem { id: number; type: "good" | "improve" | "action"; text: string }

const columns = [
  { type: "good" as const, label: "What went well", icon: ThumbsUp, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", accent: "from-emerald-400 to-emerald-500" },
  { type: "improve" as const, label: "What to improve", icon: ThumbsDown, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200", accent: "from-rose-400 to-rose-500" },
  { type: "action" as const, label: "Action items", icon: Lightbulb, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", accent: "from-amber-400 to-amber-500" },
];

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

  const removeItem = (id: number) => setItems(items.filter((i) => i.id !== id));

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-3 animate-fade-in">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <RotateCcw className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Sprint Retrospective</h1>
          <p className="text-[13px] text-muted">Reflect, learn, and improve as a team</p>
        </div>
      </div>

      <form onSubmit={addItem} className="bg-white rounded-2xl border border-border p-5 flex gap-3 items-end animate-slide-in-up">
        <div className="flex-1">
          <label className="block text-[12px] font-semibold mb-1.5">Add Item</label>
          <input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Type your retrospective item..."
            className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div className="flex gap-1.5">
          {columns.map((col) => (
            <button
              key={col.type}
              type="button"
              onClick={() => setNewType(col.type)}
              className={cn(
                "p-2.5 rounded-xl border transition-all",
                newType === col.type ? `${col.bg} ${col.border} ${col.color}` : "border-border text-muted hover:bg-surface"
              )}
              title={col.label}
            >
              <col.icon className="w-4 h-4" />
            </button>
          ))}
        </div>
        <button
          type="submit"
          disabled={!newText.trim()}
          className="px-5 py-2.5 bg-gradient-to-r from-gradient-start to-gradient-end text-white rounded-xl text-[13px] font-semibold hover:shadow-lg hover:shadow-primary/20 disabled:opacity-40 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      <div className="grid lg:grid-cols-3 gap-4 stagger-children">
        {columns.map((col) => {
          const colItems = items.filter((i) => i.type === col.type);
          return (
            <div key={col.type} className="bg-white rounded-2xl border border-border overflow-hidden">
              <div className={cn("px-5 py-3 border-b flex items-center gap-2", col.border, col.bg)}>
                <col.icon className={cn("w-4 h-4", col.color)} />
                <span className={cn("text-[13px] font-bold", col.color)}>{col.label}</span>
                <span className={cn("ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full", col.bg, col.color, col.border, "border")}>
                  {colItems.length}
                </span>
              </div>
              <div className="p-4 space-y-2 min-h-[200px]">
                {colItems.length === 0 && (
                  <p className="text-[12px] text-muted text-center py-12 opacity-50">No items yet</p>
                )}
                {colItems.map((item) => (
                  <div key={item.id} className={cn("group rounded-xl p-3 text-[13px] border relative", col.bg, col.border, "animate-scale-in")}>
                    {item.text}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-white/50"
                    >
                      <X className="w-3 h-3 text-muted" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
