import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/services/api";

interface User { id: string; email: string; name: string; }
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, login: async () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("pm_token");
    if (token) {
      api.get("/auth/me").then(setUser).catch(() => localStorage.removeItem("pm_token")).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user: u } = await api.post("/auth/login", { email, password });
    localStorage.setItem("pm_token", token);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("pm_token");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
