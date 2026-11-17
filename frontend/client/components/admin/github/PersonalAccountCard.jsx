import React from "react";
import { motion } from "framer-motion";
import {
  User,
  Github,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Save,
  Link as LinkIcon,
  Search,
  Clock,
} from "lucide-react";

export function PersonalAccountCard({
  settings,
  setSettings,
  health,
  personalUsernameInput,
  setPersonalUsernameInput,
  personalEditing,
  setPersonalEditing,
  personalValidating,
  personalValidationResult,
  setPersonalValidationResult,
  personalSaving,
  handleValidatePersonal,
  handleSavePersonal,
  formatRelativeTime,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 sm:p-8 rounded-2xl bg-[var(--card-surface,#403C38)] border border-[var(--primary-accent,#FFDD9B)]/30 shadow-xl flex flex-col justify-between relative overflow-hidden"
    >
      <div>
        {/* Card Header & Avatar */}
        <div className="flex items-start justify-between gap-4 mb-6 pb-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[var(--bg-base,#302E2D)] border-2 border-[var(--primary-accent,#FFDD9B)]/40 flex-shrink-0 shadow-lg">
              {personalValidationResult?.account?.avatar_url ? (
                <img
                  src={personalValidationResult.account.avatar_url}
                  alt="Personal GitHub"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[var(--bg-base,#302E2D)] text-[var(--primary-accent,#FFDD9B)]">
                  <User size={28} />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[var(--primary-accent,#FFDD9B)]">
                  Personal Lab Account
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-accent,#FFDD9B)]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary,#FFFFFF)] font-heading">
                {personalValidationResult?.account?.name || "Personal Engineer"}
              </h3>
              <p className="text-xs font-mono text-[var(--text-secondary,#FFF1D8)]">
                @{settings.githubUsername}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex flex-col items-end gap-1">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--primary-accent,#FFDD9B)]/15 text-[var(--primary-accent,#FFDD9B)] border border-[var(--primary-accent,#FFDD9B)]/30">
              User Verified
            </span>
            <span className="text-[10px] font-mono text-[#A8A29E]">
              Scope: PERSONAL
            </span>
          </div>
        </div>

        {/* Username Editing Section */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary,#FFFFFF)]">
              Personal GitHub Username
            </label>
            {!personalEditing ? (
              <button
                onClick={() => setPersonalEditing(true)}
                className="text-xs font-mono text-[var(--primary-accent,#FFDD9B)] hover:underline flex items-center gap-1"
              >
                Edit Username
              </button>
            ) : (
              <button
                onClick={() => {
                  setPersonalEditing(false);
                  setPersonalUsernameInput(settings.githubUsername);
                  setPersonalValidationResult(null);
                }}
                className="text-xs font-mono text-[#A8A29E] hover:underline"
              >
                Cancel
              </button>
            )}
          </div>

          {personalEditing ? (
            <div className="space-y-3 p-4 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08]">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono text-[#A8A29E]">
                  @
                </span>
                <input
                  type="text"
                  value={personalUsernameInput}
                  onChange={(e) => setPersonalUsernameInput(e.target.value)}
                  placeholder="e.g. yihune1234"
                  className="w-full pl-8 pr-4 py-2.5 rounded-lg bg-[var(--card-surface,#403C38)] border border-white/[0.1] text-xs font-mono text-[var(--text-primary,#FFFFFF)] focus:border-[var(--primary-accent,#FFDD9B)] focus:outline-none"
                />
              </div>

              {/* Validation Feedback Banner */}
              {personalValidationResult && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg text-xs font-mono border flex items-start gap-2 ${
                    personalValidationResult.valid
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      : "bg-red-500/10 border-red-500/30 text-red-300"
                  }`}
                >
                  {personalValidationResult.valid ? (
                    <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    {personalValidationResult.valid ? (
                      <>
                        <strong>Account Verified:</strong>{" "}
                        {personalValidationResult.account.name} (@
                        {personalValidationResult.account.login}) —{" "}
                        {personalValidationResult.account.public_repos} public repos.
                      </>
                    ) : (
                      <>
                        <strong>Error:</strong> {personalValidationResult.error}
                      </>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Action Buttons: Validate & Save */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleValidatePersonal}
                  disabled={personalValidating}
                  className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-mono font-bold text-[var(--text-primary,#FFFFFF)] border border-white/[0.1] transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Search size={13} className={personalValidating ? "animate-spin" : ""} />
                  <span>{personalValidating ? "Validating..." : "Validate Handle"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSavePersonal()}
                  disabled={personalSaving || (personalValidationResult && !personalValidationResult.valid)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] hover:brightness-105 text-[#302E2D] text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-md disabled:opacity-50"
                >
                  <Save size={13} />
                  <span>{personalSaving ? "Saving..." : "Save Account"}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.06]">
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-primary,#FFFFFF)]">
                <Github size={15} className="text-[var(--primary-accent,#FFDD9B)]" />
                <span className="font-bold">@{settings.githubUsername}</span>
              </div>
              <a
                href={settings.personalValidatedUrl || `https://github.com/${settings.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-white/[0.06] text-[var(--text-secondary,#FFF1D8)] transition-colors"
                title="Open on GitHub"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>

        {/* Profile URL Preview */}
        <div className="space-y-1.5 mb-6">
          <span className="text-[10px] font-mono text-[#A8A29E] uppercase tracking-wider block">
            Validated Profile URL
          </span>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-base,#302E2D)] border border-white/[0.04] text-xs font-mono text-[var(--text-secondary,#FFF1D8)] truncate">
            <span className="truncate">{settings.personalValidatedUrl || `https://github.com/${settings.githubUsername}`}</span>
            <LinkIcon size={12} className="text-[var(--primary-accent,#FFDD9B)] ml-2 flex-shrink-0" />
          </div>
        </div>

        {/* Toggles & Controls */}
        <div className="space-y-3 pt-4 border-t border-white/[0.06]">
          {/* Profile Visibility */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-base,#302E2D)]/80 border border-white/[0.04]">
            <div>
              <span className="text-xs font-bold text-[var(--text-primary,#FFFFFF)] block">
                Public Portfolio Visibility
              </span>
              <span className="text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]/70">
                Display personal repositories & activity in portfolio sections
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !settings.personalVisibility;
                setSettings({ ...settings, personalVisibility: next });
                handleSavePersonal(next, settings.personalEnabled);
              }}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                settings.personalVisibility
                  ? "bg-[var(--primary-accent,#FFDD9B)]"
                  : "bg-white/10"
              }`}
            >
              <motion.div
                animate={{ x: settings.personalVisibility ? 20 : 0 }}
                className={`w-5 h-5 rounded-full ${
                  settings.personalVisibility ? "bg-[#302E2D]" : "bg-white/60"
                }`}
              />
            </button>
          </div>

          {/* Enable / Disable Personal Data */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-base,#302E2D)]/80 border border-white/[0.04]">
            <div>
              <span className="text-xs font-bold text-[var(--text-primary,#FFFFFF)] block">
                Enable Personal Data Sync
              </span>
              <span className="text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]/70">
                Allow backend synchronization jobs to poll personal GitHub data
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !settings.personalEnabled;
                setSettings({ ...settings, personalEnabled: next });
                handleSavePersonal(settings.personalVisibility, next);
              }}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                settings.personalEnabled
                  ? "bg-[var(--primary-accent,#FFDD9B)]"
                  : "bg-white/10"
              }`}
            >
              <motion.div
                animate={{ x: settings.personalEnabled ? 20 : 0 }}
                className={`w-5 h-5 rounded-full ${
                  settings.personalEnabled ? "bg-[#302E2D]" : "bg-white/60"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Sync Status Footer */}
      <div className="pt-4 mt-6 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#A8A29E]">
        <div className="flex items-center gap-1.5">
          <Clock size={12} className="text-[var(--primary-accent,#FFDD9B)]" />
          <span>Sync: {formatRelativeTime(health?.sources?.personal?.last_synchronized || settings.lastPersonalSync)}</span>
        </div>
        <span className="text-[var(--primary-accent,#FFDD9B)] font-bold">STATUS: ACTIVE</span>
      </div>
    </motion.div>
  );
}

export default PersonalAccountCard;
