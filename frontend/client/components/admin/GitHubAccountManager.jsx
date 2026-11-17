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
import { PersonalAccountCard } from "./github/PersonalAccountCard.jsx";
import { OrgAccountCard } from "./github/OrgAccountCard.jsx";

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
    showRepositoryExplorer: true,
    hiddenRepos: [],
  });

  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncingAll, setSyncingAll] = useState(false);
  const [togglingExplorer, setTogglingExplorer] = useState(false);
  const [unhidingRepo, setUnhidingRepo] = useState(null);

  const isPublicExplorerVisible =
    settings.showRepositoryExplorer !== false &&
    settings.showEngineeringShowcase !== false;

  const handleToggleRepositoryExplorer = async () => {
    setTogglingExplorer(true);
    try {
      const nextState = !isPublicExplorerVisible;
      const res = await apiFetch(API_ENDPOINTS.ADMIN_REPOSITORY_EXPLORER_TOGGLE, {
        method: "PUT",
        body: JSON.stringify({ visible: nextState }),
      });
      if (res.success) {
        setSettings((prev) => ({
          ...prev,
          showRepositoryExplorer: nextState,
          showEngineeringShowcase: nextState,
        }));
        toast({
          title: nextState ? "Repository Explorer Visible" : "Repository Explorer Hidden",
          description: res.message || (nextState
            ? "Repository Explorer is now visible on the public website."
            : "Repository Explorer is now hidden from public visitors."),
        });
      } else {
        throw new Error(res.message || "Failed to toggle visibility");
      }
    } catch (err) {
      toast({
        title: "Toggle Error",
        description: err.message || "Could not update Repository Explorer visibility.",
        variant: "destructive",
      });
    } finally {
      setTogglingExplorer(false);
    }
  };

  const handleUnsingleRepo = async (repoFullName) => {
    setUnhidingRepo(repoFullName);
    try {
      const res = await apiFetch(API_ENDPOINTS.ADMIN_REPO_VISIBILITY, {
        method: "PUT",
        body: JSON.stringify({ repoFullName, visible: true }),
      });
      if (res.success && Array.isArray(res.hiddenRepos)) {
        setSettings((prev) => ({ ...prev, hiddenRepos: res.hiddenRepos }));
        toast({
          title: "Repository Allowed",
          description: `"${repoFullName}" is now visible in the Repository Explorer.`,
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to restore repository visibility.",
        variant: "destructive",
      });
    } finally {
      setUnhidingRepo(null);
    }
  };

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

      {/* Public Repository Explorer Governance Card */}
      <div className="p-6 rounded-2xl bg-[var(--card-surface,#403C38)] border border-[var(--border-color,rgba(255,221,155,0.18))] shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary,#FFF1D8)]/80">
                Public Portfolio Visibility
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${
                  isPublicExplorerVisible
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                }`}
              >
                {isPublicExplorerVisible ? (
                  <>
                    <Eye size={13} />
                    <span>Visible to Public</span>
                  </>
                ) : (
                  <>
                    <EyeOff size={13} />
                    <span>Hidden (Admin Only)</span>
                  </>
                )}
              </span>
            </div>

            <h3 className="text-xl font-bold text-[var(--text-primary,#FFFFFF)] font-heading">
              Repository Explorer Display Control
            </h3>

            <p className="text-xs sm:text-sm text-[var(--text-secondary,#FFF1D8)] leading-relaxed">
              {isPublicExplorerVisible
                ? "The Repository Explorer and live GitHub telemetry directory are currently live and visible to public visitors at #repository-explorer."
                : "The Repository Explorer is currently hidden from the public portfolio and navigation. It remains fully accessible and operational here in the Admin Dashboard."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleToggleRepositoryExplorer}
              disabled={togglingExplorer}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 disabled:opacity-50 ${
                isPublicExplorerVisible
                  ? "bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30"
                  : "bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] hover:brightness-105 text-[#302E2D]"
              }`}
            >
              {togglingExplorer ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : isPublicExplorerVisible ? (
                <EyeOff size={14} />
              ) : (
                <Eye size={14} />
              )}
              <span>
                {togglingExplorer
                  ? "Updating..."
                  : isPublicExplorerVisible
                  ? "Hide From Public"
                  : "Allow Public Visibility"}
              </span>
            </button>

            {isPublicExplorerVisible && (
              <a
                href="/#repository-explorer"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-[var(--primary-accent,#FFDD9B)] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] transition-all flex items-center justify-center gap-1.5"
              >
                <span>Preview</span>
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>

        {/* Individually Hidden Repositories Section */}
        {settings.hiddenRepos && settings.hiddenRepos.length > 0 && (
          <div className="mt-5 pt-4 border-t border-white/[0.08] relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <EyeOff size={13} />
                Individually Hidden Repositories ({settings.hiddenRepos.length})
              </span>
              <span className="text-[11px] text-[var(--text-secondary,#FFF1D8)]/70 font-mono">
                Excluded from the public Repository Explorer
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {settings.hiddenRepos.map((r) => (
                <span
                  key={r}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs font-mono text-amber-200"
                >
                  <span className="font-bold">{r}</span>
                  <button
                    onClick={() => handleUnsingleRepo(r)}
                    disabled={unhidingRepo === r}
                    className="hover:bg-amber-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase transition-colors text-amber-400 hover:text-white flex items-center gap-1"
                    title={`Allow "${r}" back in public Repository Explorer`}
                  >
                    {unhidingRepo === r ? (
                      <RefreshCw size={10} className="animate-spin" />
                    ) : (
                      <Eye size={11} />
                    )}
                    <span>Allow</span>
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Two Separate Management Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PersonalAccountCard
          settings={settings}
          setSettings={setSettings}
          health={health}
          personalUsernameInput={personalUsernameInput}
          setPersonalUsernameInput={setPersonalUsernameInput}
          personalEditing={personalEditing}
          setPersonalEditing={setPersonalEditing}
          personalValidating={personalValidating}
          personalValidationResult={personalValidationResult}
          setPersonalValidationResult={setPersonalValidationResult}
          personalSaving={personalSaving}
          handleValidatePersonal={handleValidatePersonal}
          handleSavePersonal={handleSavePersonal}
          formatRelativeTime={formatRelativeTime}
        />

        <OrgAccountCard
          settings={settings}
          setSettings={setSettings}
          health={health}
          orgUsernameInput={orgUsernameInput}
          setOrgUsernameInput={setOrgUsernameInput}
          orgEditing={orgEditing}
          setOrgEditing={setOrgEditing}
          orgValidating={orgValidating}
          orgValidationResult={orgValidationResult}
          setOrgValidationResult={setOrgValidationResult}
          orgSaving={orgSaving}
          handleValidateOrg={handleValidateOrg}
          handleSaveOrg={handleSaveOrg}
          formatRelativeTime={formatRelativeTime}
        />
      </div>
    </div>
  );
}
