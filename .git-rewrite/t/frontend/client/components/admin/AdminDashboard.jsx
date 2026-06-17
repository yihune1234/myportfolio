import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, FolderKanban, MessageSquare, Settings, Plus, Home, Globe, Menu, X, ChevronRight } from 'lucide-react';
import { ProjectsManager } from './ProjectsManager';
import { MessagesManager } from './MessagesManager';
import { AdminSettings } from './AdminSettings';
import { API_ENDPOINTS, apiFetch } from '../../lib/api';

export default function AdminDashboard({ onLogout, onBack }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [admin, setAdmin] = useState(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({ projects: 0, messages: 0 });

  useEffect(() => {
    const adminData = localStorage.getItem('adminUser');
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
        messages: mResult.success ? mResult.data.length : 0
      });
    } catch (e) {
      console.error(e);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const Overview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl border border-gray-200 bg-white"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Projects</p>
          <h3 className="text-3xl font-black text-gray-900">{stats.projects}</h3>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-xl border border-gray-200 bg-white"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Messages</p>
          <h3 className="text-3xl font-black text-gray-900">{stats.messages}</h3>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 sm:p-8 rounded-xl border border-gray-200 bg-white"
      >
        <h2 className="text-2xl font-black mb-2 text-gray-900">Welcome back, {admin?.email?.split('@')[0]}</h2>
        <p className="text-gray-600 mb-6">Manage your portfolio from here</p>
        <motion.button
          onClick={() => setShowAddProject(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 transition-all"
        >
          <Plus size={16} />
          New Project
        </motion.button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">Admin Panel</h1>
          <div className="flex items-center gap-3">
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.05 }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="View Website"
            >
              <Globe size={18} />
            </motion.button>
            <motion.button
              onClick={onLogout}
              whileHover={{ scale: 1.05 }}
              className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
            >
              <LogOut size={18} />
            </motion.button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6">
          <div className={`sm:col-span-1 ${mobileMenuOpen ? 'block' : 'hidden sm:block'}`}>
            <nav className="space-y-2">
              {tabs.map(tab => (
                <motion.button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  whileHover={{ x: 4 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon size={18} />
                  <span>{tab.label}</span>
                  {activeTab === tab.id && <ChevronRight size={16} className="ml-auto" />}
                </motion.button>
              ))}
            </nav>
          </div>

          <div className="sm:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'overview' && <Overview />}
                {activeTab === 'projects' && <ProjectsManager showAddProject={showAddProject} setShowAddProject={setShowAddProject} />}
                {activeTab === 'messages' && <MessagesManager />}
                {activeTab === 'settings' && <AdminSettings />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
