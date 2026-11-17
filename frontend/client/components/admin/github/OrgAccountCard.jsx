import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Save,
  Link as LinkIcon,
  Search,
  Clock,
} from "lucide-react";

export function OrgAccountCard({
  settings,
  setSettings,
  health,
  orgUsernameInput,
  setOrgUsernameInput,
  orgEditing,
  setOrgEditing,
  orgValidating,
  orgValidationResult,
  setOrgValidationResult,
  orgSaving,
  handleValidateOrg,
  handleSaveOrg,
  formatRelativeTime,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="p-6 sm:p-8 rounded-2xl bg-[var(--card-surface,#403C38)] border border-amber-500/30 shadow-xl flex flex-col justify-between relative overflow-hidden"
    >
      <div>
        {/* Card Header & Avatar */}
        <div className="flex items-start justify-between gap-4 mb-6 pb-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[var(--bg-base,#302E2D)] border-2 border-amber-500/40 flex-shrink-0 shadow-lg">
              {orgValidationResult?.account?.avatar_url ? (
                <img
                  src={orgValidationResult.account.avatar_url}
                  alt="Organization GitHub"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[var(--bg-base,#302E2D)] text-amber-400">
                  <Building2 size={28} />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-400">
                  Organization Venture
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary,#FFFFFF)] font-heading">
                {orgValidationResult?.account?.name || "Ariiti Technologies"}
              </h3>
              <p className="text-xs font-mono text-[var(--text-secondary,#FFF1D8)]">
                @{settings.githubOrg}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex flex-col items-end gap-1">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Org Verified
            </span>
            <span className="text-[10px] font-mono text-[#A8A29E]">
              Scope: ORGANIZATION
            </span>
          </div>
        </div>

        {/* Username Editing Section */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary,#FFFFFF)]">
              Organization Username / Handle
            </label>
            {!orgEditing ? (
              <button
                onClick={() => setOrgEditing(true)}
                className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1"
              >
                Edit Username
              </button>
            ) : (
              <button
                onClick={() => {
                  setOrgEditing(false);
                  setOrgUsernameInput(settings.githubOrg);
                  setOrgValidationResult(null);
                }}
                className="text-xs font-mono text-[#A8A29E] hover:underline"
              >
                Cancel
              </button>
            )}
          </div>

          {orgEditing ? (
            <div className="space-y-3 p-4 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08]">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono text-[#A8A29E]">
                  @
                </span>
                <input
                  type="text"
                  value={orgUsernameInput}
                  onChange={(e) => setOrgUsernameInput(e.target.value)}
                  placeholder="e.g. AriitiMarket"
                  className="w-full pl-8 pr-4 py-2.5 rounded-lg bg-[var(--card-surface,#403C38)] border border-white/[0.1] text-xs font-mono text-[var(--text-primary,#FFFFFF)] focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Validation Feedback Banner */}
              {orgValidationResult && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg text-xs font-mono border flex items-start gap-2 ${
                    orgValidationResult.valid
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                      : "bg-red-500/10 border-red-500/30 text-red-300"
                  }`}
                >
                  {orgValidationResult.valid ? (
                    <CheckCircle2 size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    {orgValidationResult.valid ? (
                      <>
                        <strong>Organization Verified:</strong>{" "}
                        {orgValidationResult.account.name} (@
                        {orgValidationResult.account.login}) —{" "}
                        {orgValidationResult.account.public_repos} public repos.
                      </>
                    ) : (
                      <>
                        <strong>Error:</strong> {orgValidationResult.error}
                      </>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Action Buttons: Validate & Save */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleValidateOrg}
                  disabled={orgValidating}
                  className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-mono font-bold text-[var(--text-primary,#FFFFFF)] border border-white/[0.1] transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Search size={13} className={orgValidating ? "animate-spin" : ""} />
                  <span>{orgValidating ? "Validating..." : "Validate Org"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveOrg()}
                  disabled={orgSaving || (orgValidationResult && !orgValidationResult.valid)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 text-[#302E2D] text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-md disabled:opacity-50"
                >
                  <Save size={13} />
                  <span>{orgSaving ? "Saving..." : "Save Organization"}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.06]">
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-primary,#FFFFFF)]">
                <Building2 size={15} className="text-amber-400" />
                <span className="font-bold">@{settings.githubOrg}</span>
              </div>
              <a
                href={settings.orgValidatedUrl || `https://github.com/${settings.githubOrg}`}
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
            Validated Organization URL
          </span>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-base,#302E2D)] border border-white/[0.04] text-xs font-mono text-[var(--text-secondary,#FFF1D8)] truncate">
            <span className="truncate">{settings.orgValidatedUrl || `https://github.com/${settings.githubOrg}`}</span>
            <LinkIcon size={12} className="text-amber-400 ml-2 flex-shrink-0" />
          </div>
        </div>

        {/* Toggles & Controls */}
        <div className="space-y-3 pt-4 border-t border-white/[0.06]">
          {/* Organization Visibility */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-base,#302E2D)]/80 border border-white/[0.04]">
            <div>
              <span className="text-xs font-bold text-[var(--text-primary,#FFFFFF)] block">
                Public Portfolio Visibility
              </span>
              <span className="text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]/70">
                Display organization repositories & platforms in portfolio sections
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !settings.orgVisibility;
                setSettings({ ...settings, orgVisibility: next });
                handleSaveOrg(next, settings.orgEnabled);
              }}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                settings.orgVisibility
                  ? "bg-amber-400"
                  : "bg-white/10"
              }`}
            >
              <motion.div
                animate={{ x: settings.orgVisibility ? 20 : 0 }}
                className={`w-5 h-5 rounded-full ${
                  settings.orgVisibility ? "bg-[#302E2D]" : "bg-white/60"
                }`}
              />
            </button>
          </div>

          {/* Enable / Disable Org Data */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-base,#302E2D)]/80 border border-white/[0.04]">
            <div>
              <span className="text-xs font-bold text-[var(--text-primary,#FFFFFF)] block">
                Enable Organization Data Sync
              </span>
              <span className="text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]/70">
                Allow backend synchronization jobs to poll organization GitHub data
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !settings.orgEnabled;
                setSettings({ ...settings, orgEnabled: next });
                handleSaveOrg(settings.orgVisibility, next);
              }}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                settings.orgEnabled
                  ? "bg-amber-400"
                  : "bg-white/10"
              }`}
            >
              <motion.div
                animate={{ x: settings.orgEnabled ? 20 : 0 }}
                className={`w-5 h-5 rounded-full ${
                  settings.orgEnabled ? "bg-[#302E2D]" : "bg-white/60"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Sync Status Footer */}
      <div className="pt-4 mt-6 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#A8A29E]">
        <div className="flex items-center gap-1.5">
          <Clock size={12} className="text-amber-400" />
          <span>Sync: {formatRelativeTime(health?.sources?.organization?.last_synchronized || settings.lastOrgSync)}</span>
        </div>
        <span className="text-amber-400 font-bold">STATUS: ACTIVE</span>
      </div>
    </motion.div>
  );
}

export default OrgAccountCard;
