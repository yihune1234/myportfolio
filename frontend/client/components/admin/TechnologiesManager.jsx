import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  RefreshCw,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Star,
  CheckCircle2,
  Sparkles,
  GitBranch,
  X,
  Layers,
  Code2,
} from "lucide-react";
import { API_ENDPOINTS, apiFetch } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";
import { TechIcon } from "../tech/TechIcon";

const VALID_CATEGORIES = [
  "Programming Languages",
  "Frontend Development",
  "Backend Development",
  "Mobile Development",
  "Databases",
  "DevOps and Cloud",
  "Development Tools",
  "Design and Prototyping",
  "Frameworks and Libraries",
];

const PRESET_ICONS = [
  "javascript",
  "typescript",
  "python",
  "php",
  "html5",
  "css3",
  "react",
  "nextjs",
  "tailwindcss",
  "nodejs",
  "express",
  "nestjs",
  "reactnative",
  "expo",
  "postgresql",
  "mongodb",
  "mysql",
  "redis",
  "docker",
  "git",
  "github",
  "linux",
  "vscode",
  "postman",
  "figma",
  "vite",
  "framermotion",
  "graphql",
];

export function TechnologiesManager() {
  const { toast } = useToast();
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [sourceFilter, setSourceFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Syncing state
  const [syncingGithub, setSyncingGithub] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingTech, setEditingTech] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "Programming Languages",
    icon: "typescript",
    description: "",
    experienceLevel: "Production",
    source: "manual",
    featured: false,
    visible: true,
    order: 0,
  });

  React.useEffect(() => {
    fetchTechnologies();
  }, []);

  const fetchTechnologies = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(API_ENDPOINTS.TECHNOLOGIES_LIST(true));
      const list = res?.technologies || res?.data?.technologies || (Array.isArray(res?.data) ? res.data : null);
      if (res?.success && Array.isArray(list)) {
        setTechnologies(list);
      }
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Failed to load technologies.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTechnologies = useMemo(() => {
    return technologies.filter((t) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = t.name.toLowerCase().includes(q);
        const matchesDesc = (t.description || "").toLowerCase().includes(q);
        const matchesCat = t.category.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      if (categoryFilter !== "ALL" && t.category !== categoryFilter) return false;
      if (sourceFilter === "MANUAL" && t.source !== "manual") return false;
      if (sourceFilter === "GITHUB" && t.source !== "github_detected") return false;

      if (statusFilter === "FEATURED" && !t.featured) return false;
      if (statusFilter === "VISIBLE" && t.visible === false) return false;
      if (statusFilter === "HIDDEN" && t.visible !== false) return false;

      return true;
    });
  }, [technologies, search, categoryFilter, sourceFilter, statusFilter]);

  const openCreateModal = () => {
    setEditingTech(null);
    setFormData({
      name: "",
      category: categoryFilter !== "ALL" ? categoryFilter : "Programming Languages",
      icon: "typescript",
      description: "",
      experienceLevel: "Production",
      source: "manual",
      featured: false,
      visible: true,
      order: technologies.length + 1,
    });
    setShowModal(true);
  };

  const openEditModal = (tech) => {
    setEditingTech(tech);
    setFormData({
      name: tech.name,
      category: tech.category,
      icon: tech.icon || tech.slug,
      description: tech.description || "",
      experienceLevel: tech.experienceLevel || "Production",
      source: tech.source || "manual",
      featured: Boolean(tech.featured),
      visible: tech.visible !== false,
      order: tech.order || 0,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTech(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingTech
        ? API_ENDPOINTS.TECHNOLOGIES_UPDATE(editingTech._id)
        : API_ENDPOINTS.TECHNOLOGIES_CREATE;

      const res = await apiFetch(url, {
        method: editingTech ? "PUT" : "POST",
        body: JSON.stringify(formData),
      });

      if (res.success) {
        toast({
          title: editingTech ? "Technology Updated" : "Technology Created",
          description: `"${formData.name}" has been saved.`,
        });
        closeModal();
        fetchTechnologies();
      } else {
        toast({
          title: "Save Failed",
          description: res.message || res.data?.message || res.error || "Failed to save technology.",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error(e);
      toast({
        title: "Save Failed",
        description: e instanceof Error ? e.message : "Error saving technology.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleVisible = async (tech) => {
    try {
      const newVisible = !tech.visible;
      const res = await apiFetch(API_ENDPOINTS.TECHNOLOGIES_UPDATE(tech._id), {
        method: "PUT",
        body: JSON.stringify({ visible: newVisible }),
      });
      if (res.success) {
        toast({
          title: newVisible ? "Technology Visible" : "Technology Hidden",
          description: `"${tech.name}" is now ${newVisible ? "visible on" : "hidden from"} the public portfolio.`,
        });
        fetchTechnologies();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleFeatured = async (tech) => {
    try {
      const newFeatured = !tech.featured;
      const res = await apiFetch(API_ENDPOINTS.TECHNOLOGIES_UPDATE(tech._id), {
        method: "PUT",
        body: JSON.stringify({ featured: newFeatured }),
      });
      if (res.success) {
        toast({
          title: newFeatured ? "Marked Featured" : "Unfeatured",
          description: `"${tech.name}" featured status updated.`,
        });
        fetchTechnologies();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (tech) => {
    if (!confirm(`Are you sure you want to delete "${tech.name}"?`)) return;

    try {
      const res = await apiFetch(API_ENDPOINTS.TECHNOLOGIES_DELETE(tech._id), {
        method: "DELETE",
      });
      if (res.success) {
        toast({
          title: "Deleted",
          description: `"${tech.name}" was removed.`,
        });
        fetchTechnologies();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSyncGithub = async () => {
    setSyncingGithub(true);
    try {
      const res = await apiFetch(API_ENDPOINTS.TECHNOLOGIES_SYNC_GITHUB, {
        method: "POST",
      });
      if (res.success) {
        toast({
          title: "GitHub Sync Complete",
          description: res.message || res.data?.message || "Repositories scanned and matching skills tagged.",
        });
        fetchTechnologies();
      } else {
        toast({
          title: "Sync Error",
          description: res.message || res.data?.message || res.error || "Failed to scan GitHub repositories.",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSyncingGithub(false);
    }
  };

  const handleSeedDefaults = async () => {
    if (!confirm("Reset and ensure all 25+ standard verified technologies are populated?")) return;

    setSeeding(true);
    try {
      const res = await apiFetch(API_ENDPOINTS.TECHNOLOGIES_SEED, {
        method: "POST",
      });
      if (res.success) {
        toast({
          title: "Verified Stack Synchronized",
          description: res.message || res.data?.message || "Verified technologies populated.",
        });
        fetchTechnologies();
      } else {
        toast({
          title: "Seed Error",
          description: res.message || res.data?.message || res.error || "Failed to synchronize verified technologies.",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 font-body">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--primary-accent,#FFDD9B)] font-bold">
              Engineering Console
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-accent,#FFDD9B)]" />
            <span className="text-xs text-[var(--text-secondary,#FFF1D8)] font-mono">
              Technologies & Skills
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary,#FFFFFF)] font-heading tracking-tight">
            Technologies Behind My Work
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary,#FFF1D8)]/80 mt-1 max-w-xl">
            Control the programming languages, frameworks, libraries, and tools displayed publicly with recognizable brand logos.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSyncGithub}
            disabled={syncingGithub}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] text-xs font-mono font-bold transition-all disabled:opacity-50"
            title="Scan connected repositories and identify matching languages"
          >
            <GitBranch size={14} className={syncingGithub ? "animate-spin text-emerald-400" : "text-emerald-400"} />
            <span>{syncingGithub ? "Scanning Repos..." : "Sync from GitHub"}</span>
          </button>

          <button
            onClick={handleSeedDefaults}
            disabled={seeding}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] text-xs font-mono font-bold transition-all disabled:opacity-50"
            title="Ensure all 25+ verified core technologies exist"
          >
            <Sparkles size={14} className={seeding ? "animate-spin text-[var(--primary-accent,#FFDD9B)]" : "text-[var(--primary-accent,#FFDD9B)]"} />
            <span>{seeding ? "Seeding..." : "Load Verified Stack"}</span>
          </button>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] text-xs font-mono font-bold shadow-md shadow-[#FFDD9B]/20 transition-all"
          >
            <Plus size={14} />
            <span>+ Add Technology</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary,#FFF1D8)]/50"
          />
          <input
            type="text"
            placeholder="Search by name, description, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] text-xs text-[var(--text-primary,#FFFFFF)] placeholder-[var(--text-secondary,#FFF1D8)]/50 focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
            >
              ×
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] text-xs font-mono text-[var(--text-secondary,#FFF1D8)] focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
          >
            <option value="ALL">All Categories ({technologies.length})</option>
            {VALID_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c} ({technologies.filter((t) => t.category === c).length})
              </option>
            ))}
          </select>

          {/* Source Dropdown */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] text-xs font-mono text-[var(--text-secondary,#FFF1D8)] focus:outline-none"
          >
            <option value="ALL">All Sources</option>
            <option value="MANUAL">Manual Standard</option>
            <option value="GITHUB">GitHub Detected</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] text-xs font-mono text-[var(--text-secondary,#FFF1D8)] focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="VISIBLE">Visible Only</option>
            <option value="HIDDEN">Hidden Only</option>
            <option value="FEATURED">Featured Only</option>
          </select>
        </div>
      </div>

      {/* Technologies Grid */}
      {loading ? (
        <div className="py-24 text-center rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.08]">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-[var(--primary-accent,#FFDD9B)] mb-3" />
          <p className="text-sm font-mono text-[var(--text-secondary,#FFF1D8)]">
            Loading technology catalog...
          </p>
        </div>
      ) : filteredTechnologies.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] p-8 space-y-4">
          <Code2 className="w-12 h-12 mx-auto text-[var(--primary-accent,#FFDD9B)]/40" />
          <div>
            <p className="text-lg font-bold text-[var(--text-primary,#FFFFFF)]">
              No technologies match your filter
            </p>
            <p className="text-sm text-[var(--text-secondary,#FFF1D8)] max-w-md mx-auto mt-1">
              You can create a new technology entry or load the pre-configured verified technology stack with one click.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleSeedDefaults}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] font-bold text-xs"
            >
              Load Verified Stack
            </button>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] font-bold text-xs"
            >
              + Create Manually
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTechnologies.map((tech) => (
            <div
              key={tech._id || tech.slug}
              className={`p-4 rounded-2xl bg-[var(--card-surface,#403C38)] border transition-all flex flex-col justify-between shadow-md ${
                tech.visible === false
                  ? "opacity-60 border-dashed border-white/[0.1]"
                  : tech.featured
                  ? "border-[var(--primary-accent,#FFDD9B)]/40 ring-1 ring-[var(--primary-accent,#FFDD9B)]/20"
                  : "border-white/[0.08]"
              }`}
            >
              <div>
                {/* Header row: Icon & Status Badges */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] flex items-center justify-center p-2 shadow-inner">
                    <TechIcon name={tech.icon || tech.slug} size={26} colorMode="brand" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Featured toggle */}
                    <button
                      onClick={() => handleToggleFeatured(tech)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        tech.featured
                          ? "bg-[var(--primary-accent,#FFDD9B)]/20 text-[var(--primary-accent,#FFDD9B)]"
                          : "text-white/40 hover:text-white"
                      }`}
                      title={tech.featured ? "Featured (Click to unfeature)" : "Click to mark as featured"}
                    >
                      <Star size={13} className={tech.featured ? "fill-current" : ""} />
                    </button>

                    {/* Visibility toggle */}
                    <button
                      onClick={() => handleToggleVisible(tech)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        tech.visible !== false
                          ? "text-emerald-400 hover:bg-emerald-500/10"
                          : "text-amber-400 hover:bg-amber-500/10"
                      }`}
                      title={tech.visible !== false ? "Visible (Click to hide)" : "Hidden (Click to publish)"}
                    >
                      {tech.visible !== false ? <Eye size={13} /> : <EyeOff size={13} />}
                    </button>
                  </div>
                </div>

                {/* Name & Category */}
                <div className="mb-2">
                  <h4 className="font-heading font-black text-sm text-white flex items-center gap-1.5">
                    <span>{tech.name}</span>
                    {tech.featured && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-accent,#FFDD9B)]" />
                    )}
                  </h4>
                  <span className="text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]/60 block">
                    {tech.category}
                  </span>
                </div>

                {/* Description */}
                {tech.description && (
                  <p className="text-[11px] text-[var(--text-secondary,#FFF1D8)]/75 line-clamp-2 leading-relaxed mb-3">
                    {tech.description}
                  </p>
                )}
              </div>

              {/* Bottom Row: Source, Level & Actions */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[var(--text-secondary,#FFF1D8)] border border-white/[0.08]">
                    {tech.experienceLevel || "Production"}
                  </span>

                  {tech.source === "github_detected" ? (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 size={10} />
                      <span>Repo</span>
                    </span>
                  ) : (
                    <span className="text-white/40">Manual</span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(tech)}
                    className="p-1 rounded hover:bg-white/[0.08] text-white/70 hover:text-white"
                    title="Edit Technology"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(tech)}
                    className="p-1 rounded hover:bg-red-500/20 text-red-400"
                    title="Delete Technology"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT MODAL                                                          */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-[var(--bg-base,#302E2D)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--primary-accent,#FFDD9B)]/10 border border-[var(--primary-accent,#FFDD9B)]/30 flex items-center justify-center text-[var(--primary-accent,#FFDD9B)] font-bold">
                    {editingTech ? <Edit3 size={18} /> : <Plus size={18} />}
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-lg text-white">
                      {editingTech ? `Edit: ${editingTech.name}` : "Add Technology"}
                    </h3>
                    <p className="text-xs font-mono text-[var(--text-secondary,#FFF1D8)]/70">
                      Configure official brand logo and presentation details
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg hover:bg-white/[0.08] text-white/60 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
                {/* Name & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                      Technology Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. TypeScript"
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50 font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs font-mono text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
                    >
                      {VALID_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Icon Selector with Visual Presets */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                    Brand Logo / Icon Identifier *
                  </label>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.1] flex items-center justify-center p-2 flex-shrink-0 shadow-inner">
                      <TechIcon name={formData.icon} size={24} colorMode="brand" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value.toLowerCase().trim() })}
                      placeholder="e.g. typescript, react, docker"
                      className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs font-mono text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
                    />
                  </div>

                  {/* Preset Quick Chips */}
                  <div className="p-3 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.06] space-y-1.5">
                    <span className="text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]/60 block">
                      Quick select official brand SVG:
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                      {PRESET_ICONS.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setFormData({ ...formData, icon: p })}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono transition-all ${
                            formData.icon === p
                              ? "bg-[var(--primary-accent,#FFDD9B)] text-[#302E2D] font-bold"
                              : "bg-white/[0.05] text-[var(--text-secondary,#FFF1D8)] hover:bg-white/[0.1]"
                          }`}
                        >
                          <TechIcon name={p} size={14} colorMode={formData.icon === p ? "monochrome" : "brand"} />
                          <span>{p}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Experience Level & Source */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                      Experience / Usage Classification
                    </label>
                    <input
                      type="text"
                      value={formData.experienceLevel}
                      onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                      placeholder="e.g. Primary Stack, Production, Daily Driver"
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs text-white focus:outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                      Declaration Source
                    </label>
                    <select
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs font-mono text-white focus:outline-none"
                    >
                      <option value="manual">Manual Standard</option>
                      <option value="github_detected">GitHub Detected</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                    Short Description / Role
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief architectural summary of role and implementation strength..."
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs text-white focus:outline-none leading-relaxed resize-none font-sans"
                  />
                </div>

                {/* Display Order & Toggles */}
                <div className="p-4 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-mono text-[var(--text-secondary,#FFF1D8)]/80">
                      Display Order:
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                      className="w-16 px-2 py-1 rounded bg-[var(--card-surface,#403C38)] border border-white/[0.1] text-xs font-mono text-white text-center"
                    />
                  </div>

                  <div className="flex items-center gap-5">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[var(--text-secondary,#FFF1D8)]">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4 accent-[var(--primary-accent,#FFDD9B)] rounded cursor-pointer"
                      />
                      <span>Featured (Glow)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[var(--text-secondary,#FFF1D8)]">
                      <input
                        type="checkbox"
                        checked={formData.visible}
                        onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                        className="w-4 h-4 accent-[var(--primary-accent,#FFDD9B)] rounded cursor-pointer"
                      />
                      <span>Publicly Visible</span>
                    </label>
                  </div>
                </div>

                {/* Submit Row */}
                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-[var(--text-secondary,#FFF1D8)] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] font-bold text-xs font-mono shadow-md shadow-[#FFDD9B]/20"
                  >
                    {saving ? "Saving..." : editingTech ? "Update Technology" : "Create Technology"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TechnologiesManager;
