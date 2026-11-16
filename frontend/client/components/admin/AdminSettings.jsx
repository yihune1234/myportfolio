import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Lock,
  ShieldCheck,
  Save,
  Mail,
  Shield,
  Eye,
  EyeOff,
  Key,
  RotateCcw,
  AlertCircle,
  Sparkles,
  Github,
  Activity,
  RefreshCw,
  CheckCircle2,
  Clock,
  Radio,
} from "lucide-react";
import { API_ENDPOINTS, apiFetch } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";
import { ThemeSelector } from "./ThemeSelector";

export function AdminSettings() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const [profileData, setProfileData] = useState({
    email: "",
    username: "",
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [githubSettings, setGithubSettings] = useState({
    githubUsername: "yihune1234",
    githubOrg: "AriitiMarket",
    personalVisibility: true,
    orgVisibility: true,
    showHeroPulse: true,
    showSkillsIntegration: true,
    showEngineeringShowcase: true,
    autoSyncEnabled: true,
    syncIntervalMs: 3600000,
  });
  const [githubHealth, setGithubHealth] = useState(null);
  const [syncingGithub, setSyncingGithub] = useState(false);
  const [savingGithub, setSavingGithub] = useState(false);

  useEffect(() => {
    const adminData = localStorage.getItem("adminUser");
    if (adminData) {
      const parsed = JSON.parse(adminData);
      setAdmin(parsed);
      setProfileData({
        email: parsed.email || "",
        username: parsed.name || "Yihune Belay",
      });
    }
    fetchGithubSettings();
  }, []);

  const fetchGithubSettings = async () => {
    try {
      const result = await apiFetch(API_ENDPOINTS.ADMIN_GITHUB_SETTINGS);
      if (result.success && result.data) {
        if (result.data.settings) {
          setGithubSettings(result.data.settings);
        }
        if (result.data.health) {
          setGithubHealth(result.data.health);
        }
      }
    } catch (err) {
      console.error("Error loading GitHub settings:", err);
    }
  };

  const handleUpdateGithubSettings = async (e) => {
    e.preventDefault();
    setSavingGithub(true);
    try {
      const result = await apiFetch(API_ENDPOINTS.ADMIN_GITHUB_SETTINGS, {
        method: "PUT",
        body: JSON.stringify(githubSettings),
      });
      if (result.success) {
        toast({
          title: "Settings Saved",
          description: "GitHub integration settings updated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update GitHub settings.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating GitHub settings:", error);
    } finally {
      setSavingGithub(false);
    }
  };

  const handleTriggerSync = async () => {
    setSyncingGithub(true);
    try {
      const result = await apiFetch(API_ENDPOINTS.ADMIN_GITHUB_SYNC, {
        method: "POST",
      });
      if (result.success) {
        toast({
          title: "Sync Triggered",
          description: "Live GitHub telemetry synchronized successfully.",
        });
        if (result.data?.health) {
          setGithubHealth(result.data.health);
        }
      } else {
        toast({
          title: "Sync Error",
          description: result.error || "Failed to sync GitHub data.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error triggering sync:", error);
    } finally {
      setSyncingGithub(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await apiFetch(API_ENDPOINTS.ADMIN_UPDATE_USERNAME, {
        method: "PUT",
        body: JSON.stringify({ username: profileData.username }),
      });
      if (result.success) {
        localStorage.setItem(
          "adminUser",
          JSON.stringify({ ...admin, ...profileData }),
        );
        toast({
          title: "Updated",
          description: "Profile has been updated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update profile.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const result = await apiFetch(API_ENDPOINTS.ADMIN_UPDATE_PASSWORD, {
        method: "PUT",
        body: JSON.stringify({
          currentPassword: securityData.currentPassword,
          newPassword: securityData.newPassword,
        }),
      });
      if (result.success) {
        toast({
          title: "Updated",
          description: "Password has been changed successfully.",
        });
        setSecurityData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to change password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const FormSection = ({ title, desc, icon: Icon, children }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-white/[0.06] bg-[#0E131F] rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg shadow-black/20"
    >
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="lg:w-1/3 space-y-3 sm:space-y-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#FF8A00]/20 to-[#FF6B00]/10 flex items-center justify-center text-[#FF8A00] border border-[#FF8A00]/20">
            <Icon size={24} />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#F5F7FA]">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-[#B7C0D1] mt-2">{desc}</p>
          </div>
        </div>
        <div className="lg:w-2/3">{children}</div>
      </div>
    </motion.div>
  );

  const InputField = ({ label, icon: Icon, ...props }) => (
    <div className="space-y-2">
      <label className="text-xs font-bold text-[#B7C0D1] block">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon size={16} className="text-[#B7C0D1]/40" />
        </div>
        <input
          {...props}
          className="w-full pl-10 pr-4 py-2.5 bg-[#07090E] border border-white/[0.08] rounded-lg outline-none focus:border-[#FF8A00]/50 transition-all font-medium text-[#F5F7FA] placeholder-[#B7C0D1]/40"
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-[#F5F7FA]">
          Settings
        </h2>
        <p className="text-sm text-[#B7C0D1]">
          Manage your admin account and security
        </p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Profile Settings */}
        <FormSection
          title="Profile"
          desc="Update your admin profile information"
          icon={User}
        >
          <form
            onSubmit={handleUpdateProfile}
            className="space-y-4 sm:space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <InputField
                label="Name"
                icon={User}
                placeholder="Yihune Belay"
                value={profileData.username}
                onChange={(e) =>
                  setProfileData({ ...profileData, username: e.target.value })
                }
              />
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#B7C0D1] block">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-[#B7C0D1]/40" />
                  </div>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 bg-[#07090E]/50 border border-white/[0.06] rounded-lg text-[#B7C0D1]/60 font-medium cursor-not-allowed"
                  />
                </div>
                <p className="text-[10px] text-[#B7C0D1]/40">
                  Contact support to change email
                </p>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2.5 bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] text-[#07090E] rounded-lg font-bold text-sm hover:shadow-[0_0_25px_rgba(255,138,0,0.25)] transition-all disabled:opacity-50 flex items-center gap-2 w-full sm:w-fit"
            >
              <Save size={16} />
              Save Changes
            </motion.button>
          </form>
        </FormSection>

        {/* Brand Theme Selector */}
        <ThemeSelector />

        {/* GitHub Integration Settings */}
        <FormSection
          title="GitHub Integration"
          desc="Configure dual-identity accounts, public visibility flags, and automatic telemetry synchronization"
          icon={Github}
        >
          <form onSubmit={handleUpdateGithubSettings} className="space-y-6">
            {/* Account Identifiers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <InputField
                label="Personal GitHub Account"
                icon={Github}
                placeholder="yihune1234"
                value={githubSettings.githubUsername}
                onChange={(e) =>
                  setGithubSettings({
                    ...githubSettings,
                    githubUsername: e.target.value,
                  })
                }
                required
              />
              <InputField
                label="Organization Account"
                icon={Github}
                placeholder="AriitiMarket"
                value={githubSettings.githubOrg}
                onChange={(e) =>
                  setGithubSettings({
                    ...githubSettings,
                    githubOrg: e.target.value,
                  })
                }
                required
              />
            </div>

            {/* Visibility Controls */}
            <div className="space-y-3 p-4 bg-[#07090E] rounded-xl border border-white/[0.06]">
              <h4 className="text-xs font-bold text-[#F5F7FA] uppercase tracking-wider mb-2">
                Public Portfolio Visibility Flags
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={githubSettings.personalVisibility}
                    onChange={(e) =>
                      setGithubSettings({
                        ...githubSettings,
                        personalVisibility: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-[#FF8A00] rounded cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#B7C0D1]">
                    Show Personal Lab Repositories
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={githubSettings.orgVisibility}
                    onChange={(e) =>
                      setGithubSettings({
                        ...githubSettings,
                        orgVisibility: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-[#FF8A00] rounded cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#B7C0D1]">
                    Show Ariiti Tech Org Repositories
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={githubSettings.showHeroPulse}
                    onChange={(e) =>
                      setGithubSettings({
                        ...githubSettings,
                        showHeroPulse: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-[#FF8A00] rounded cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#B7C0D1]">
                    Hero Live GitHub Pulse Indicator
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={githubSettings.showSkillsIntegration}
                    onChange={(e) =>
                      setGithubSettings({
                        ...githubSettings,
                        showSkillsIntegration: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-[#FF8A00] rounded cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#B7C0D1]">
                    Skills Section Codebase DNA
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={githubSettings.showEngineeringShowcase}
                    onChange={(e) =>
                      setGithubSettings({
                        ...githubSettings,
                        showEngineeringShowcase: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-[#FF8A00] rounded cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#B7C0D1]">
                    Engineering Showcase Section (Inline between Projects & Platform Showcase)
                  </span>
                </label>
              </div>
            </div>

            {/* Sync Configuration & Status Monitor */}
            <div className="p-4 bg-[#07090E] rounded-xl border border-white/[0.06] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-[#F5F7FA] uppercase tracking-wider">
                    Synchronization & Health Monitor
                  </h4>
                  <p className="text-[11px] text-[#B7C0D1]/60 font-mono mt-0.5">
                    ETag-cached synchronization with rate limit protection
                  </p>
                </div>

                {/* Health Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#B7C0D1]">Status:</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                      githubHealth?.status === "healthy" || githubHealth?.status === "ok" || githubHealth?.sources?.personal?.status === "ok"
                        ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {githubHealth?.status === "healthy" || githubHealth?.sources?.personal?.status === "ok" ? "HEALTHY" : "OPERATIONAL"}
                  </span>
                </div>
              </div>

              {/* Status metrics grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
                  <span className="text-[10px] text-[#B7C0D1]/60 block mb-0.5">PERSONAL</span>
                  <span className="text-[#F5F7FA] font-bold">
                    {githubHealth?.sources?.personal?.reposCount || 10} repos
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
                  <span className="text-[10px] text-[#B7C0D1]/60 block mb-0.5">ORGANIZATION</span>
                  <span className="text-[#F5F7FA] font-bold">
                    {githubHealth?.sources?.organization?.reposCount || 20} repos
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
                  <span className="text-[10px] text-[#B7C0D1]/60 block mb-0.5">RATE LIMIT</span>
                  <span className="text-emerald-400 font-bold">
                    {githubHealth?.rateLimit?.remaining ?? 59}/60
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
                  <span className="text-[10px] text-[#B7C0D1]/60 block mb-0.5">AUTO-SYNC</span>
                  <span className="text-[#FF8A00] font-bold">Hourly</span>
                </div>
              </div>

              {/* Actions row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={handleTriggerSync}
                  disabled={syncingGithub}
                  className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-[#B7C0D1] hover:text-[#F5F7FA] rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/[0.06]"
                >
                  <RefreshCw size={14} className={syncingGithub ? "animate-spin text-[#FF8A00]" : ""} />
                  {syncingGithub ? "Synchronizing Telemetry..." : "Sync GitHub Now"}
                </button>

                <motion.button
                  type="submit"
                  disabled={savingGithub}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] text-[#07090E] rounded-lg font-bold text-sm hover:shadow-[0_0_25px_rgba(255,138,0,0.25)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  {savingGithub ? "Saving..." : "Save GitHub Settings"}
                </motion.button>
              </div>
            </div>
          </form>
        </FormSection>

        {/* Security Settings */}
        <FormSection
          title="Security"
          desc="Change your password and manage security settings"
          icon={ShieldCheck}
        >
          <form
            onSubmit={handleChangePassword}
            className="space-y-4 sm:space-y-6"
          >
            <InputField
              label="Current Password"
              icon={Key}
              type="password"
              placeholder="••••••••"
              value={securityData.currentPassword}
              onChange={(e) =>
                setSecurityData({
                  ...securityData,
                  currentPassword: e.target.value,
                })
              }
            />

            <div className="h-px bg-white/[0.06]" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <InputField
                label="New Password"
                icon={Lock}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={securityData.newPassword}
                onChange={(e) =>
                  setSecurityData({
                    ...securityData,
                    newPassword: e.target.value,
                  })
                }
              />
              <InputField
                label="Confirm Password"
                icon={Shield}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={securityData.confirmPassword}
                onChange={(e) =>
                  setSecurityData({
                    ...securityData,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="flex items-center gap-2 text-sm font-bold text-[#B7C0D1] hover:text-[#FF8A00] transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                <span>{showPassword ? "Hide" : "Show"} Password</span>
              </button>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] text-[#07090E] rounded-lg font-bold text-sm hover:shadow-[0_0_25px_rgba(255,138,0,0.25)] transition-all disabled:opacity-50 flex items-center gap-2 w-full sm:w-fit"
              >
                <RotateCcw size={16} />
                Update Password
              </motion.button>
            </div>
          </form>
        </FormSection>

        {/* Security Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-6 rounded-lg bg-[#FF8A00]/5 border border-[#FF8A00]/20 flex gap-4"
        >
          <AlertCircle
            size={20}
            className="text-[#FF8A00] flex-shrink-0 mt-0.5"
          />
          <div>
            <h4 className="font-bold text-[#F5F7FA] mb-1 text-sm">
              Security Notice
            </h4>
            <p className="text-xs sm:text-sm text-[#B7C0D1]">
              Keep your password secure and never share it with anyone. Always
              use a strong password with a mix of letters, numbers, and symbols.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
