import { useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Shield,
} from "lucide-react";
import { API_ENDPOINTS, apiFetch } from "../../lib/api";

export function AdminLogin({ onLogin, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    try {
      const result = await apiFetch(API_ENDPOINTS.ADMIN_LOGIN, {
        method: "POST",
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      if (result.success) {
        localStorage.setItem("adminToken", result.data.token);
        localStorage.setItem("adminUser", JSON.stringify(result.data.admin));
        onLogin(result.data.token, result.data.admin);
      } else {
        setError(result.error || "Invalid credentials");
      }
    } catch (err) {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050816] p-4 sm:p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF8A00] opacity-[0.03] rounded-full blur-[200px]" />
      <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-[#FFB020] opacity-[0.02] rounded-full blur-[150px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back Button */}
        <motion.button
          onClick={onBack}
          whileHover={{ x: -4 }}
          className="flex items-center gap-2 text-sm font-bold text-[#B7C0D1] hover:text-[#FF8A00] mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Portfolio
        </motion.button>

        {/* Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0B1637] p-6 sm:p-8 shadow-2xl shadow-black/40">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#FF8A00] to-[#FF6B00] flex items-center justify-center shadow-lg shadow-[#FF8A00]/20">
              <Shield className="text-[#050816]" size={28} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#F5F7FA] mb-1">
              Admin Access
            </h1>
            <p className="text-sm text-[#B7C0D1]">
              Signed in as{" "}
              <span className="text-[#FF8A00] font-bold">Yihune Belay</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF8A00]/80">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF8A00]/50" />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#050816] border border-white/[0.08] text-[#F5F7FA] placeholder-[#B7C0D1]/40 focus:border-[#FF8A00]/50 focus:outline-none transition-all text-sm"
                  placeholder="yihune@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF8A00]/80">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF8A00]/50" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-[#050816] border border-white/[0.08] text-[#F5F7FA] placeholder-[#B7C0D1]/40 focus:border-[#FF8A00]/50 focus:outline-none transition-all text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B7C0D1]/60 hover:text-[#FF8A00] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold"
              >
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] text-[#050816] rounded-lg font-bold text-sm hover:shadow-[0_0_30px_rgba(255,138,0,0.3)] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-4 h-4 border-2 border-[#050816]/30 border-t-[#050816] rounded-full"
                  />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-xs text-[#B7C0D1]/40">
          <Sparkles size={12} className="inline mr-1" />
          Owner-only portal
        </p>
      </motion.div>
    </div>
  );
}
