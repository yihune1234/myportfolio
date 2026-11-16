import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Building2,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Save,
  Check,
  Eye,
  EyeOff,
  Power,
  Clock,
  Sparkles,
  Link as LinkIcon,
  Search,
  Radio,
  Sliders,
} from "lucide-react";
import { API_ENDPOINTS, apiFetch } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";

export function GitHubAccountManager() {
  const { toast } = useToast();

  // Settings & Health State
  const [settings, setSettings] = useState({
    githubUsername: "yihune1234",
    githubOrg: "AriitiMarket",
    personalVisibility: true,
    orgVisibility: true,
    personalEnabled: true,
    orgEnabled: true,
    personalValidatedUrl: "https://github.com/yihune1234",
    orgValidatedUrl: "https://github.com/AriitiMarket",
    showHeroPulse: true,
    showSkillsIntegration: true,
    showEngineeringShowcase: true,
  });

  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncingAll, setSyncingAll] = useState(false);

  // Personal Account Form State
  const [personalUsernameInput, setPersonalUsernameInput] = useState("");
  const [personalEditing, setPersonalEditing] = useState(false);
  const [personalValidating, setPersonalValidating] = useState(false);
  const [personalValidationResult, setPersonalValidationResult] = useState(null); // { valid, account, error }
  const [personalSaving, setPersonalSaving] = useState(false);

  // Organization Account Form State
  const [orgUsernameInput, setOrgUsernameInput] = useState("");
  const [orgEditing, setOrgEditing] = useState(false);
  const [orgValidating, setOrgValidating] = useState(false);
  const [orgValidationResult, setOrgValidationResult] = useState(null);
  const [orgSaving, setOrgSaving] = useState(false);

  useEffect(() => {
    loadGitHubSettings();
  }, []);

  const loadGitHubSettings = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(API_ENDPOINTS.ADMIN_GITHUB_SETTINGS);
      if (res.success && res.data) {
        if (res.data.settings) {
          setSettings(res.data.settings);
          setPersonalUsernameInput(res.data.settings.githubUsername || "");
          setOrgUsernameInput(res.data.settings.githubOrg || "");
        }
        if (res.data.health) {
          setHealth(res.data.health);
        }
      }
    } catch (err) {
      console.error("Error loading GitHub settings:", err);
      toast({
        title: "Load Error",
        description: "Failed to retrieve GitHub settings from server.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Validate Personal Username
  const handleValidatePersonal = async () => {
    if (!personalUsernameInput.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a personal GitHub username to validate.",
        variant: "destructive",
      });
      return;
    }

    setPersonalValidating(true);
    setPersonalValidationResult(null);

    try {
      const res = await apiFetch(API_ENDPOINTS.ADMIN_GITHUB_VALIDATE, {
        method: "POST",
        body: JSON.stringify({
          username: personalUsernameInput.trim(),
          expectedType: "User",
        }),
      });

      if (res.success && res.valid) {
        setPersonalValidationResult({
          valid: true,
          account: res.account,
        });
        toast({
          title: "Account Verified",
          description: `Verified personal user @${res.account.login} (${res.account.name}).`,
        });
      } else {
        setPersonalValidationResult({
          valid: false,
          error: res.message || "Failed to validate personal user account.",
        });
        toast({
          title: "Validation Failed",
          description: res.message || "Account not found or invalid type.",
          variant: "destructive",
        });
      }
    } catch (err) {
      setPersonalValidationResult({
        valid: false,
        error: err.message || "Network error validating account.",
      });
    } finally {
      setPersonalValidating(false);
    }
  };

  // Validate Organization Username
  const handleValidateOrg = async () => {
    if (!orgUsernameInput.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter an organization username to validate.",
        variant: "destructive",
      });
      return;
    }

    setOrgValidating(true);
    setOrgValidationResult(null);

    try {
      const res = await apiFetch(API_ENDPOINTS.ADMIN_GITHUB_VALIDATE, {
        method: "POST",
        body: JSON.stringify({
          username: orgUsernameInput.trim(),
          expectedType: "Organization",
        }),
      });

      if (res.success && res.valid) {
        setOrgValidationResult({
          valid: true,
          account: res.account,
        });
        toast({
          title: "Organization Verified",
          description: `Verified organization @${res.account.login} (${res.account.name}).`,
        });
      } else {
        setOrgValidationResult({
          valid: false,
          error: res.message || "Failed to validate organization account.",
        });
        toast({
          title: "Validation Failed",
          description: res.message || "Account not found or is a personal account.",
          variant: "destructive",
        });
      }
    } catch (err) {
      setOrgValidationResult({
        valid: false,
        error: err.message || "Network error validating organization.",
      });
    } finally {
      setOrgValidating(false);
    }
  };

  // Save Personal Account Settings
  const handleSavePersonal = async (overrideVisibility, overrideEnabled) => {
    setPersonalSaving(true);
    try {
      const payload = {
        githubUsername: personalUsernameInput.trim() || settings.githubUsername,
        personalValidatedUrl:
          personalValidationResult?.account?.html_url ||
          `https://github.com/${personalUsernameInput.trim() || settings.githubUsername}`,
        personalVisibility:
          overrideVisibility !== undefined
            ? overrideVisibility
            : settings.personalVisibility,
        personalEnabled:
          overrideEnabled !== undefined
            ? overrideEnabled
            : settings.personalEnabled,
      };

      const res = await apiFetch(API_ENDPOINTS.ADMIN_GITHUB_SETTINGS, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (res.success && res.settings) {
        setSettings(res.settings);
        setPersonalEditing(false);
        setPersonalValidationResult(null);
        toast({
          title: "Personal Account Saved",
          description: `Personal account set to @${res.settings.githubUsername}. Cache invalidated and sync triggered.`,
        });
        // Refresh health data
        loadGitHubSettings();
      } else {
        throw new Error(res.message || "Save failed");
      }
    } catch (err) {
      toast({
        title: "Save Failed",
        description: err.message || "Could not save personal account.",
        variant: "destructive",
      });
    } finally {
      setPersonalSaving(false);
    }
  };

  // Save Organization Account Settings
  const handleSaveOrg = async (overrideVisibility, overrideEnabled) => {
    setOrgSaving(true);
    try {
      const payload = {
        githubOrg: orgUsernameInput.trim() || settings.githubOrg,
        orgValidatedUrl:
          orgValidationResult?.account?.html_url ||
          `https://github.com/${orgUsernameInput.trim() || settings.githubOrg}`,
        orgVisibility:
          overrideVisibility !== undefined ? overrideVisibility : settings.orgVisibility,
        orgEnabled:
          overrideEnabled !== undefined ? overrideEnabled : settings.orgEnabled,
      };

      const res = await apiFetch(API_ENDPOINTS.ADMIN_GITHUB_SETTINGS, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (res.success && res.settings) {
        setSettings(res.settings);
        setOrgEditing(false);
        setOrgValidationResult(null);
        toast({
          title: "Organization Saved",
          description: `Organization set to @${res.settings.githubOrg}. Cache invalidated and sync triggered.`,
        });
        loadGitHubSettings();
      } else {
        throw new Error(res.message || "Save failed");
      }
    } catch (err) {
      toast({
        title: "Save Failed",
        description: err.message || "Could not save organization account.",
        variant: "destructive",
      });
    } finally {
      setOrgSaving(false);
    }
  };

  // Manual Full Synchronization
  const handleManualSync = async () => {
    setSyncingAll(true);
    try {
      const res = await apiFetch(API_ENDPOINTS.ADMIN_GITHUB_SYNC, {
        method: "POST",
      });
      if (res.success) {
        toast({
          title: "Synchronization Complete",
          description: "Fresh telemetry successfully fetched and cached from GitHub API.",
        });
        if (res.health) setHealth(res.health);
      } else {
        throw new Error(res.message || "Sync failed");
      }
    } catch (err) {
      toast({
        title: "Sync Error",
        description: err.message || "Failed to trigger manual sync.",
        variant: "destructive",
      });
    } finally {
      setSyncingAll(false);
    }
  };

  const formatRelativeTime = (iso) => {
    if (!iso) return "Not synchronized yet";
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    const min = Math.floor(diff / 60);
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const days = Math.floor(hr / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-8">
      {/* Header & Global Sync Action Bar */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[var(--card-surface,#403C38)] border border-[var(--border-color,rgba(255,221,155,0.18))] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--primary-accent,#FFDD9B)]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--primary-accent,#FFDD9B)]/15 text-[var(--primary-accent,#FFDD9B)] border border-[var(--primary-accent,#FFDD9B)]/30 mb-2">
              <ShieldCheck size={12} />
              Dual-Identity Account Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary,#FFFFFF)] tracking-tight font-heading">
              GitHub Account Management
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary,#FFF1D8)] max-w-2xl leading-relaxed mt-1">
              Configure independent sources for your personal engineering lab and organization venture.
              Handles are verified live with the GitHub API before persistence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleManualSync}
              disabled={syncingAll}
              className="px-5 py-2.5 bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] hover:brightness-105 text-[#302E2D] rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-[var(--primary-accent,#FFDD9B)]/20 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw size={14} className={syncingAll ? "animate-spin" : ""} />
              <span>{syncingAll ? "Synchronizing..." : "Manual Sync"}</span>
            </button>
          </div>
        </div>

        {/* Important Architectural Notice */}
        <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-start gap-2.5 text-xs text-[var(--text-secondary,#FFF1D8)]/80 font-mono">
          <AlertCircle size={15} className="text-[var(--primary-accent,#FFDD9B)] mt-0.5 flex-shrink-0" />
          <span>
            <strong>Note:</strong> Updating a username changes the GitHub data source used by your portfolio. It does not rename the account on GitHub.
          </span>
        </div>
      </div>

      {/* Two Separate Management Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ========================================================= */}
        {/* CARD 1: PERSONAL GITHUB ACCOUNT                           */}
        {/* ========================================================= */}
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

        {/* ========================================================= */}
        {/* CARD 2: ORGANIZATION GITHUB ACCOUNT                       */}
        {/* ========================================================= */}
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
      </div>
    </div>
  );
}
