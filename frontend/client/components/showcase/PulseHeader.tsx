import React from 'react';
import { motion } from 'framer-motion';
import { DualScope, GitHubHealthResponse } from '@/lib/githubApi';
import { Sparkles, Terminal, Activity, ShieldCheck, RefreshCw, ExternalLink } from 'lucide-react';

interface PulseHeaderProps {
  scope: DualScope;
  onScopeChange: (scope: DualScope) => void;
  health?: GitHubHealthResponse;
  lastSync?: string | null;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function PulseHeader({
  scope,
  onScopeChange,
  health,
  lastSync,
  onRefresh,
  isRefreshing
}: PulseHeaderProps) {
  const isHealthy =
    health?.status === 'healthy' ||
    health?.status === 'degraded' ||
    health?.sources?.personal?.status === 'ok';
  const orgStatus = health?.sources?.organization?.status;

  const scopes: { id: DualScope; label: string; countSuffix?: string }[] = [
    { id: 'ALL', label: 'ALL ACTIVITY' },
    { id: 'PERSONAL', label: 'PERSONAL LAB' },
    { id: 'ORGANIZATION', label: 'ORGANIZATIONS' },
  ];

  return (
    <div className="flex flex-col gap-6 mb-12">
      {/* Top Banner / Pulse Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3">
          {/* Live indicator dot */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/[0.08] text-xs font-mono">
            <span className="relative flex h-2 w-2">
              {isHealthy ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
              )}
            </span>
            <span className={isHealthy ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
              {isHealthy ? 'GITHUB PULSE ACTIVE' : 'CACHED / RECONNECTING'}
            </span>
          </div>

          {/* Account Chips */}
          <a
            href="https://github.com/yihune1234"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-300 hover:bg-emerald-500/20 transition-all"
            title="Verified Personal Account: yihune1234"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>@yihune1234</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 transition-opacity" />
          </a>

          {orgStatus !== 'unconfigured' && (
            <a
              href="https://github.com/AriitiMarket"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono text-amber-300 hover:bg-amber-500/20 transition-all"
              title="Verified Organization Account: AriitiMarket"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>@AriitiMarket</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 transition-opacity" />
            </a>
          )}
        </div>

        {/* Sync Status & Manual Refetch */}
        <div className="flex items-center gap-3 text-xs text-[#B7C0D1] font-mono">
          {lastSync && (
            <span className="hidden sm:inline-block text-[11px] opacity-80">
              Sync: {new Date(lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-[#F8FAFC] font-sans font-medium transition-all disabled:opacity-50"
            title="Refresh GitHub telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : 'text-[#94A3B8]'}`} />
            <span className="hidden sm:inline">Sync Now</span>
          </button>
        </div>
      </div>

      {/* Main Section Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-emerald-400 mb-2 font-semibold">
            <Terminal className="w-3.5 h-3.5" />
            Verified GitHub Integration
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F8FAFC] tracking-tight">
            Live Engineering & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Innovation</span>
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] mt-2 max-w-2xl leading-relaxed">
            Real-time public GitHub activity, verifiable codebase metrics, language distributions,
            and software repository activity across personal engineering research and organization projects.
          </p>
        </div>

        {/* Dual Identity Switcher Pill */}
        <div className="inline-flex p-1.5 rounded-2xl bg-[#0E131F] border border-white/[0.08] shadow-inner self-start md:self-auto">
          {scopes.map((s) => {
            const isActive = scope === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onScopeChange(s.id)}
                className={`relative px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'text-[#07090E] shadow-md'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.03]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="scopeHighlight"
                    className={`absolute inset-0 rounded-xl ${
                      s.id === 'PERSONAL'
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-400 shadow-[0_0_20px_rgba(52,211,153,0.35)]'
                        : s.id === 'ORGANIZATION'
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_20px_rgba(251,191,36,0.35)]'
                        : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                    }`}
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
