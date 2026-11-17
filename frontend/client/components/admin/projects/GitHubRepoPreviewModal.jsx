import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, RefreshCw, X } from "lucide-react";

export function GitHubRepoPreviewModal({
  previewRepo,
  previewDetails,
  previewLoading,
  onClose,
  onImport,
}) {
  if (!previewRepo) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-3xl rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-[var(--bg-base,#302E2D)]">
            <div className="flex items-center gap-3">
              <Github className="w-6 h-6 text-[var(--primary-accent,#FFDD9B)]" />
              <div>
                <h3 className="font-heading font-black text-lg text-[var(--text-primary,#FFFFFF)]">
                  {previewRepo.full_name}
                </h3>
                <p className="text-xs font-mono text-[var(--text-secondary,#FFF1D8)]/70">
                  Telemetry & Documentation Preview
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/[0.08] text-white/60 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-[var(--text-secondary,#FFF1D8)]">
            {previewLoading ? (
              <div className="py-20 text-center">
                <RefreshCw className="w-8 h-8 mx-auto animate-spin text-[var(--primary-accent,#FFDD9B)] mb-2" />
                <p className="font-mono text-xs text-[var(--text-secondary,#FFF1D8)]">
                  Fetching languages & README from GitHub API...
                </p>
              </div>
            ) : (
              <>
                {/* Repository Telemetry Overview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.06]">
                    <span className="text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]/60 block">
                      Primary Lang
                    </span>
                    <span className="text-sm font-bold text-white font-mono">
                      {previewRepo.primary_language || "None"}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.06]">
                    <span className="text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]/60 block">
                      Stars / Forks
                    </span>
                    <span className="text-sm font-bold text-white font-mono">
                      {previewRepo.stars} / {previewRepo.forks}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.06]">
                    <span className="text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]/60 block">
                      Default Branch
                    </span>
                    <span className="text-sm font-bold text-white font-mono">
                      {previewRepo.default_branch || "main"}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.06]">
                    <span className="text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]/60 block">
                      Scope
                    </span>
                    <span className="text-sm font-bold text-white font-mono">
                      {previewRepo.source_scope}
                    </span>
                  </div>
                </div>

                {/* Languages Breakdown */}
                {previewDetails?.languages && Object.keys(previewDetails.languages).length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold text-[var(--primary-accent,#FFDD9B)] uppercase tracking-wider">
                      Languages Breakdown
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(previewDetails.languages).map(([lang, bytes]) => (
                        <span
                          key={lang}
                          className="px-3 py-1 rounded-lg bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs font-mono flex items-center gap-2"
                        >
                          <span className="w-2 h-2 rounded-full bg-[var(--primary-accent,#FFDD9B)]" />
                          <span className="font-bold text-white">{lang}</span>
                          <span className="text-white/40 text-[10px]">
                            {(bytes / 1024).toFixed(1)} KB
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* README Content or Summary */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-[var(--primary-accent,#FFDD9B)] uppercase tracking-wider">
                    README Documentation
                  </h4>
                  {previewDetails?.readme?.content ? (
                    <div className="p-4 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] font-mono text-xs text-[var(--text-secondary,#FFF1D8)] leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto">
                      {previewDetails.readme.content}
                    </div>
                  ) : (
                    <p className="text-xs font-mono text-white/50 italic">
                      No README file detected in this repository default branch.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-white/[0.08] bg-[var(--bg-base,#302E2D)] flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/[0.06] text-white text-xs font-bold font-mono hover:bg-white/[0.1]"
            >
              Close Preview
            </button>
            <button
              onClick={() => onImport(previewRepo, true)}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] text-xs font-bold font-mono shadow-lg shadow-[#FFDD9B]/20"
            >
              Import into Portfolio
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default GitHubRepoPreviewModal;
