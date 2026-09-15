import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Zap, ArrowRight, Loader2 } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — gradient */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-sidebar via-primary-dark to-gradient-end items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/20"
              style={{
                width: `${120 + i * 80}px`, height: `${120 + i * 80}px`,
                top: `${10 + i * 12}%`, left: `${-5 + i * 15}%`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
        <div className="relative z-10 max-w-md text-white">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mb-8 shadow-2xl">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Your AI-Powered<br />Project Command Center
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Morning briefings, smart task creation, risk detection, and meeting intelligence — all in one place.
          </p>
          <div className="mt-10 flex gap-4">
            {["AI Co-Pilot", "Task Creator", "Smart Notes"].map((f) => (
              <span key={f} className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-[12px] font-medium text-white/80 border border-white/10">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 lg:max-w-[520px] flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-[380px] animate-fade-in">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gradient-start to-gradient-end flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">PM Assistant</span>
          </div>

          <h2 className="text-2xl font-bold text-card-foreground mb-1">Welcome back</h2>
          <p className="text-muted text-[14px] mb-8">Sign in to your dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="text-[13px] text-destructive bg-destructive/5 border border-destructive/10 rounded-xl px-4 py-3 animate-scale-in">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[13px] font-semibold text-card-foreground mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground/50 transition-all"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-card-foreground mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground/50 transition-all"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-gradient-start to-gradient-end text-white rounded-xl text-[14px] font-semibold hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
