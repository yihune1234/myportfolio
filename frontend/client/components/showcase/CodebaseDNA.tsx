import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitHubLanguagesResponse, DualScope } from '@/lib/githubApi';
import { Binary, Info, CheckCircle2, X } from 'lucide-react';

interface CodebaseDNAProps {
  data?: GitHubLanguagesResponse;
  isLoading: boolean;
  scope: DualScope;
}

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  PHP: '#777BB4',
  Python: '#3776AB',
  CSS: '#563D7C',
  HTML: '#E34F26',
  Shell: '#89E051',
  Blade: '#F05340',
  Vue: '#41B883',
  Java: '#B07219',
  Go: '#00ADD8',
  Rust: '#DEA584',
};

function getLangColor(lang: string): string {
  return LANGUAGE_COLORS[lang] || '#10B981';
}

export function CodebaseDNA({ data, isLoading, scope }: CodebaseDNAProps) {
  const [showMethodology, setShowMethodology] = useState(false);

  const languages = data?.languages || [];
  const totalBytes = data?.total_bytes || 0;
  const formattedTotal = data?.formatted_total_bytes || '0 Bytes';
  const reposCount = data?.repos_analyzed || 0;

  return (
    <div className="relative p-6 sm:p-7 rounded-2xl bg-[var(--card-surface,#3A3836)]/90 border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between overflow-hidden group">
      {/* Subtle background glow */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Header with info button */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[var(--primary-accent,#FFDD9B)]">
              <Binary className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary,#FFFFFF)] tracking-tight">
                Core Technologies & Languages
              </h3>
              <p className="text-xs text-[var(--text-secondary,#FFF1D8)] font-mono">
                Verified Technology Distribution ({scope})
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowMethodology(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-[11px] font-mono text-[#B7C0D1] hover:text-[#F5F7FA] transition-all"
            title="View calculation methodology"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Methodology</span>
          </button>
        </div>

        {/* Total Languages & Repos Analyzed Highlight */}
        <div className="grid grid-cols-2 gap-3 p-3 mb-5 rounded-xl bg-black/30 border border-white/[0.06]">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#B7C0D1]/70">
              Tracked Technologies
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-[#F5F7FA] mt-0.5">
              {isLoading ? '...' : `${languages.length} Languages`}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary,#FFF1D8)]/70">
              Active Repositories
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400 mt-0.5">
              {isLoading ? '...' : `${reposCount} Repositories`}
            </div>
          </div>
        </div>

        {/* Multi-segment stacked bar */}
        <div className="space-y-2 mb-6">
          <div className="h-3 w-full rounded-full bg-white/[0.04] overflow-hidden flex p-0.5 gap-0.5">
            {isLoading ? (
              <div className="w-full h-full bg-white/[0.06] animate-pulse rounded-full" />
            ) : languages.length === 0 ? (
              <div className="w-full h-full bg-white/[0.05] rounded-full" />
            ) : (
              languages.slice(0, 7).map((l) => (
                <div
                  key={l.language}
                  style={{
                    width: `${Math.max(l.percentage, 1.5)}%`,
                    backgroundColor: getLangColor(l.language),
                  }}
                  className="h-full rounded-full transition-all duration-700"
                  title={`${l.language}: ${l.percentage}% distribution`}
                />
              ))
            )}
          </div>
        </div>

        {/* Language Breakdown Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-white/[0.03] animate-pulse" />
            ))
          ) : languages.length === 0 ? (
            <div className="col-span-full text-center py-4 text-xs text-[#B7C0D1]">
              No language data detected for current scope.
            </div>
          ) : (
            languages.slice(0, 6).map((l) => {
              const color = getLangColor(l.language);
              return (
                <div
                  key={l.language}
                  className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-[#F5F7FA] truncate">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      {l.language}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#B7C0D1]">
                      {l.percentage}%
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-[#B7C0D1]/60 truncate">
                    {l.percentage >= 25 ? 'Primary Focus' : l.percentage >= 10 ? 'Core Language' : 'Active Stack'}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#B7C0D1]/70">
        <span>Verified Production Repositories</span>
        <span>Real Codebase Telemetry</span>
      </div>

      {/* Methodology Modal */}
      <AnimatePresence>
        {showMethodology && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setShowMethodology(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="relative max-w-lg w-full p-6 sm:p-7 rounded-2xl bg-[var(--card-surface,#3A3836)] border border-white/[0.12] shadow-2xl shadow-black/80 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowMethodology(false)}
                className="absolute top-4 right-4 p-2 text-[#B7C0D1] hover:text-[#F5F7FA] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h4 className="text-lg font-bold text-[#F5F7FA]">
                  Technology Distribution Methodology
                </h4>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-[var(--text-secondary,#FFF1D8)] leading-relaxed">
                <p>
                  <strong>Verified Language Distribution:</strong> Percentages are computed directly from public GitHub repositories using language detection to accurately represent code written across your repositories.
                </p>
                <p>
                  <strong>Deduplication:</strong> Every distinct public repository is analyzed once without double-counting forks or duplicate codebases.
                </p>
                <p>
                  <strong>Realistic Focus vs Estimates:</strong> Accurately reflects real-world technical stack usage and production implementations rather than subjective self-ratings.
                </p>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] font-mono text-[11px] text-[var(--text-secondary,#FFF1D8)]">
                  Scope: {languages.length} active languages analyzed across {reposCount} public repositories.
                </div>
              </div>

              <button
                onClick={() => setShowMethodology(false)}
                className="w-full mt-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-[var(--bg-base,#302E2D)] rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20"
              >
                Understood
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
