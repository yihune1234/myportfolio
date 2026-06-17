import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  AlertCircle
} from 'lucide-react';
import { API_ENDPOINTS, apiFetch } from '../../lib/api';
import { useToast } from '../../hooks/use-toast';

export function AdminSettings() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    email: '',
    username: ''
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const adminData = localStorage.getItem('adminUser');
    if (adminData) {
      const parsed = JSON.parse(adminData);
      setAdmin(parsed);
      setProfileData({
        email: parsed.email || '',
        username: parsed.username || 'Administrator'
      });
    }
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await apiFetch(API_ENDPOINTS.ADMIN_UPDATE_PROFILE, {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
      if (result.success) {
        localStorage.setItem('adminUser', JSON.stringify({ ...admin, ...profileData }));
        toast({
          title: "Updated",
          description: "Profile has been updated successfully."
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update profile.",
          variant: "destructive"
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
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      const result = await apiFetch(API_ENDPOINTS.ADMIN_CHANGE_PASSWORD, {
        method: 'PUT',
        body: JSON.stringify(securityData)
      });
      if (result.success) {
        toast({
          title: "Updated",
          description: "Password has been changed successfully."
        });
        setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to change password.",
          variant: "destructive"
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
      className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm"
    >
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="lg:w-1/3 space-y-3 sm:space-y-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-600">
            <Icon size={24} />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">{title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">{desc}</p>
          </div>
        </div>
        <div className="lg:w-2/3">
          {children}
        </div>
      </div>
    </motion.div>
  );

  const InputField = ({ label, icon: Icon, ...props }) => (
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-700 block">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon size={16} className="text-slate-400" />
        </div>
        <input
          {...props}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-900 placeholder-slate-400"
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Settings</h2>
        <p className="text-sm text-slate-600">Manage your admin account and security</p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Profile Settings */}
        <FormSection 
          title="Profile" 
          desc="Update your admin profile information"
          icon={User}
        >
          <form onSubmit={handleUpdateProfile} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <InputField
                label="Name"
                icon={User}
                placeholder="Admin"
                value={profileData.username}
                onChange={e => setProfileData({ ...profileData, username: e.target.value })}
              />
              <InputField
                label="Email"
                icon={Mail}
                type="email"
                placeholder="admin@example.com"
                value={profileData.email}
                onChange={e => setProfileData({ ...profileData, email: e.target.value })}
              />
            </div>
            
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold text-sm hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 w-full sm:w-fit"
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
          <form onSubmit={handleChangePassword} className="space-y-4 sm:space-y-6">
            <InputField
              label="Current Password"
              icon={Key}
              type="password"
              placeholder="••••••••"
              value={securityData.currentPassword}
              onChange={e => setSecurityData({ ...securityData, currentPassword: e.target.value })}
            />
            
            <div className="h-px bg-slate-200" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <InputField
                label="New Password"
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={securityData.newPassword}
                onChange={e => setSecurityData({ ...securityData, newPassword: e.target.value })}
              />
              <InputField
                label="Confirm Password"
                icon={Shield}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={securityData.confirmPassword}
                onChange={e => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                <span>{showPassword ? 'Hide' : 'Show'} Password</span>
              </button>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold text-sm hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 w-full sm:w-fit"
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
          className="p-4 sm:p-6 rounded-lg bg-amber-50 border border-amber-200 flex gap-4"
        >
          <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-900 mb-1 text-sm">Security Notice</h4>
            <p className="text-xs sm:text-sm text-amber-800">
              Keep your password secure and never share it with anyone. Always use a strong password with a mix of letters, numbers, and symbols.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
