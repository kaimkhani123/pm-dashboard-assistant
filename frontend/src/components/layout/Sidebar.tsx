import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Brain, BarChart3, ListTodo, Users, AlertTriangle,
  Mail, FileText, RotateCcw, Settings, LogOut, Sparkles
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/ai-copilot", icon: Brain, label: "AI Co-Pilot" },
  { to: "/progress", icon: BarChart3, label: "Progress Hub" },
  { to: "/tasks", icon: ListTodo, label: "AI Task Creator" },
  { to: "/team", icon: Users, label: "Team Workload" },
  { to: "/risks", icon: AlertTriangle, label: "Risk Register" },
  { to: "/communication", icon: Mail, label: "Communication" },
  { to: "/meetings", icon: FileText, label: "Meeting Notes" },
  { to: "/retro", icon: RotateCcw, label: "Retrospective" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-border flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-border flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-primary" />
        <span className="font-bold text-lg">PM Assistant</span>
      </div>

      <nav className="flex-1 py-3 overflow-y-auto">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-5 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-medium border-r-2 border-primary"
                  : "text-muted hover:bg-accent hover:text-accent-foreground"
              )
            }
          >
            <l.icon className="w-4 h-4" />
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
            <p className="text-xs text-muted truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-sm text-muted hover:text-destructive transition-colors w-full">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
