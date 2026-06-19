import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  FolderKanban,
  MessageSquare,
  Settings,
  Plus,
  Home,
  Globe,
  Menu,
  X,
  ChevronRight,
  LayoutDashboard,
  Sparkles,
  FileText,
} from "lucide-react";
import { ProjectsManager } from "./ProjectsManager";
import { MessagesManager } from "./MessagesManager";
import { AdminSettings } from "./AdminSettings";
import ProjectSectionsManager from "./ProjectSectionsManager";
import { API_ENDPOINTS, apiFetch } from "../../lib/api";

export default function AdminDashboard({ onLogout, onBack }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [admin, setAdmin] = useState(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({ projects: 0, messages: 0 });

  useEffect(() => {
    const adminData = localStorage.getItem("adminUser");
    if (adminData) {
      setAdmin(JSON.parse(adminData));
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const pResult = await apiFetch(API_ENDPOINTS.PROJECTS_LIST);
      const mResult = await apiFetch(API_ENDPOINTS.MESSAGES_LIST);
      setStats({
        projects: pResult.success ? pResult.data.length : 0,
        messages: mResult.success ? mResult.data.length : 0,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "sections", label: "Project Sections", icon: FileText },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const Overview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl border border-white/[0.08] bg-[#0B1637]"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF8A00]/60 mb-2">
            Projects
          </p>
          <h3 className="text-3xl font-black text-[#F5F7FA]">
            {stats.projects}
          </h3>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-xl border border-white/[0.08] bg-[#0B1637]"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF8A00]/60 mb-2">
            Messages
          </p>
          <h3 className="text-3xl font-black text-[#F5F7FA]">
            {stats.messages}
          </h3>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 sm:p-8 rounded-xl border border-white/[0.08] bg-[#0B1637]"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF8A00] to-[#FF6B00] flex items-center justify-center shadow-lg shadow-[#FF8A00]/20">
            <Sparkles className="w-5 h-5 text-[#050816]" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#F5F7FA]">
              Welcome back, Yihune
            </h2>
            <p className="text-sm text-[#B7C0D1]">
              Manage your portfolio from here
            </p>
          </div>
        </div>
        <motion.button
          onClick={() => setShowAddProject(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] text-[#050816] rounded-lg font-bold text-sm hover:shadow-[0_0_25px_rgba(255,138,0,0.25)] transition-all"
        >
          <Plus size={16} />
          New Project
        </motion.button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050816]">
      {/* Top blur glow */}
      <div className="fixed top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-[#FF8A00]/[0.03] to-transparent pointer-events-none" />

      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#050816]/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF8A00] to-[#FF6B00] flex items-center justify-center shadow-lg shadow-[#FF8A00]/20">
              <LayoutDashboard className="w-4 h-4 text-[#050816]" />
            </div>
            <h1 className="text-lg sm:text-xl font-black text-[#F5F7FA]">
              Admin Panel
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.05 }}
              className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors text-[#B7C0D1] hover:text-[#F5F7FA]"
              title="View Website"
            >
              <Globe size={18} />
            </motion.button>
            <motion.button
              onClick={onLogout}
              whileHover={{ scale: 1.05 }}
              className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </motion.button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-white/[0.06] rounded-lg transition-colors text-[#B7C0D1]"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          {/* Sidebar */}
          <div
            className={`lg:col-span-1 ${mobileMenuOpen ? "block" : "hidden lg:block"}`}
          >
            <nav className="space-y-1.5">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  whileHover={{ x: 4 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] text-[#050816] shadow-lg shadow-[#FF8A00]/20"
                      : "text-[#B7C0D1] hover:text-[#F5F7FA] hover:bg-white/[0.04]"
                  }`}
                >
                  <tab.icon size={18} />
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <ChevronRight size={16} className="ml-auto" />
                  )}
                </motion.button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "overview" && <Overview />}
                {activeTab === "projects" && (
                  <ProjectsManager
                    showAddProject={showAddProject}
                    setShowAddProject={setShowAddProject}
                  />
                )}
                {activeTab === "sections" && <ProjectSectionsManager />}
                {activeTab === "messages" && <MessagesManager />}
                {activeTab === "settings" && <AdminSettings />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
