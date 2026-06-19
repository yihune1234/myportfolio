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
} from "lucide-react";
import { API_ENDPOINTS, apiFetch } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";

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
  }, []);

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
      className="border border-white/[0.06] bg-[#0B1637] rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg shadow-black/20"
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
          className="w-full pl-10 pr-4 py-2.5 bg-[#050816] border border-white/[0.08] rounded-lg outline-none focus:border-[#FF8A00]/50 transition-all font-medium text-[#F5F7FA] placeholder-[#B7C0D1]/40"
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
                    className="w-full pl-10 pr-4 py-2.5 bg-[#050816]/50 border border-white/[0.06] rounded-lg text-[#B7C0D1]/60 font-medium cursor-not-allowed"
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
              className="px-6 py-2.5 bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] text-[#050816] rounded-lg font-bold text-sm hover:shadow-[0_0_25px_rgba(255,138,0,0.25)] transition-all disabled:opacity-50 flex items-center gap-2 w-full sm:w-fit"
            >
              <Save size={16} />
              Save Changes
            </motion.button>
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
                className="px-6 py-2.5 bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] text-[#050816] rounded-lg font-bold text-sm hover:shadow-[0_0_25px_rgba(255,138,0,0.25)] transition-all disabled:opacity-50 flex items-center gap-2 w-full sm:w-fit"
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
