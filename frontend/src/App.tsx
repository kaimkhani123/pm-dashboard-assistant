import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import AICopilot from "@/pages/AICopilot";
import ProgressHub from "@/pages/ProgressHub";
import AITaskCreator from "@/pages/AITaskCreator";
import TeamWorkload from "@/pages/TeamWorkload";
import RiskRegister from "@/pages/RiskRegister";
import Communication from "@/pages/Communication";
import MeetingNotes from "@/pages/MeetingNotes";
import Retrospective from "@/pages/Retrospective";
import Settings from "@/pages/Settings";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen text-muted">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen text-muted">Loading...</div>;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="ai-copilot" element={<AICopilot />} />
        <Route path="progress" element={<ProgressHub />} />
        <Route path="tasks" element={<AITaskCreator />} />
        <Route path="team" element={<TeamWorkload />} />
        <Route path="risks" element={<RiskRegister />} />
        <Route path="communication" element={<Communication />} />
        <Route path="meetings" element={<MeetingNotes />} />
        <Route path="retro" element={<Retrospective />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
