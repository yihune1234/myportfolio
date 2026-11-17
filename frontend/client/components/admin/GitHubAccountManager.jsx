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
