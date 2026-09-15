import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/projects": "Projects",
  "/ai-copilot": "AI Co-Pilot",
  "/progress": "Progress Hub",
  "/daily-log": "Daily Log",
  "/tasks": "AI Task Creator",
  "/team": "Team Workload",
  "/risks": "Risk Register",
  "/communication": "Communication Hub",
  "/meetings": "Smart Notes",
  "/retro": "Retrospective",
  "/settings": "Settings",
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

function formatToday() {
  return new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

export default function AppLayout() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Dashboard";

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-white/70 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h1 className="text-lg font-bold text-card-foreground">{title}</h1>
          </div>
          <div className="text-right">
            <p className="text-[13px] font-medium text-card-foreground">{getGreeting()}</p>
            <p className="text-[11px] text-muted">{formatToday()}</p>
          </div>
        </header>
        <main className="flex-1 p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
