import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Brain, BarChart3, ListTodo, Users, AlertTriangle,
  Mail, FileText, RotateCcw, Settings, LogOut, Zap, ChevronRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const sections = [
  {
    title: "Overview",
    links: [
      { to: "/", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/progress", icon: BarChart3, label: "Progress Hub" },
    ],
  },
  {
    title: "AI Tools",
    links: [
      { to: "/ai-copilot", icon: Brain, label: "AI Co-Pilot" },
      { to: "/tasks", icon: ListTodo, label: "AI Task Creator" },
      { to: "/meetings", icon: FileText, label: "Smart Notes" },
    ],
  },
  {
    title: "Management",
    links: [
      { to: "/team", icon: Users, label: "Team Workload" },
      { to: "/risks", icon: AlertTriangle, label: "Risk Register" },
      { to: "/communication", icon: Mail, label: "Communication" },
      { to: "/retro", icon: RotateCcw, label: "Retrospective" },
    ],
  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-[260px] bg-sidebar flex flex-col h-screen sticky top-0 animate-slide-in-left">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gradient-start to-gradient-end flex items-center justify-center shadow-lg shadow-primary/20">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-bold text-[15px] text-white tracking-tight">PM Assistant</span>
          <span className="block text-[10px] text-sidebar-foreground/50 font-medium tracking-wider uppercase">AI-Powered</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto space-y-5">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-[0.1em] px-3 mb-2">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200",
                      isActive
                        ? "bg-sidebar-active text-white shadow-md shadow-primary/20"
                        : "text-sidebar-foreground/70 hover:text-white hover:bg-white/[0.06]"
                    )
                  }
                >
                  <l.icon className="w-[18px] h-[18px] shrink-0" />
                  <span className="flex-1">{l.label}</span>
                  <ChevronRight className={cn(
                    "w-3.5 h-3.5 opacity-0 -translate-x-1 transition-all duration-200",
                    "group-hover:opacity-50 group-hover:translate-x-0"
                  )} />
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Settings link */}
      <div className="px-3 pb-2">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200",
              isActive
                ? "bg-sidebar-active text-white"
                : "text-sidebar-foreground/70 hover:text-white hover:bg-white/[0.06]"
            )
          }
        >
          <Settings className="w-[18px] h-[18px]" />
          Settings
        </NavLink>
      </div>

      {/* User */}
      <div className="px-3 pb-4 pt-2 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-light to-gradient-end flex items-center justify-center text-white font-semibold text-sm shadow-md">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-white truncate">{user?.name || "User"}</p>
            <p className="text-[11px] text-sidebar-foreground/50 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-[12px] text-sidebar-foreground/40 hover:text-red-400 transition-colors w-full px-3 py-1.5 rounded-lg hover:bg-white/[0.04]"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
