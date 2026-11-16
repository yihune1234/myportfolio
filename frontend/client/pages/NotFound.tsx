import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base,#302E2D)] relative overflow-hidden px-6">
      <div className="absolute inset-0 dot-matrix-grid opacity-15 pointer-events-none" />
      <div className="absolute w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center relative z-10 p-8 rounded-2xl bg-[var(--card-surface,#3A3836)] border border-white/[0.08] max-w-md w-full shadow-2xl shadow-black/60">
        <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-2">
          Telemetry Error 404
        </span>
        <h1 className="text-5xl font-black text-[var(--text-primary,#FFFFFF)] mb-3 tracking-tight font-mono">
          404
        </h1>
        <p className="text-sm text-[var(--text-secondary,#FFF1D8)] mb-6 leading-relaxed">
          The requested telemetry endpoint or route does not exist in the architecture registry.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-[var(--bg-base,#302E2D)] font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-300 transition-all"
        >
          Return to Registry
        </a>
      </div>
    </div>
  );
};

export default NotFound;
