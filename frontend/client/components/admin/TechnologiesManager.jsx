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
  CheckCircle2,
  Sparkles,
  GitBranch,
  X,
  Code2,
  Layers,
  LayoutGrid,
  List,
} from "lucide-react";
import { API_ENDPOINTS, apiFetch } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";
import { TechIcon } from "../tech/TechIcon";

const VALID_CATEGORIES = [
  "Frontend Development",
  "Backend Development",
  "Databases",
  "Programming Languages",
  "Development Tools",
  "Mobile Development",
  "DevOps and Cloud",
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
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'icons'

  // Syncing state
  const [syncingGithub, setSyncingGithub] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingTech, setEditingTech] = useState(null);
  const [saving, setSaving] = useState(false);

  // Streamlined form without unwanted card fields (no description, no experience badges)
  const [formData, setFormData] = useState({
    name: "",
    category: "Frontend Development",
    icon: "typescript",
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
      const list =
        res?.technologies ||
        res?.data?.technologies ||
        (Array.isArray(res?.data) ? res.data : null);
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
        const matchesCat = t.category.toLowerCase().includes(q);
        if (!matchesName && !matchesCat) return false;
      }

      if (categoryFilter !== "ALL" && t.category !== categoryFilter) return false;
      if (statusFilter === "VISIBLE" && t.visible === false) return false;
      if (statusFilter === "HIDDEN" && t.visible !== false) return false;

      return true;
    });
  }, [technologies, search, categoryFilter, statusFilter]);

  const openCreateModal = () => {
    setEditingTech(null);
    setFormData({
      name: "",
      category:
        categoryFilter !== "ALL" ? categoryFilter : "Frontend Development",
      icon: "typescript",
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

      // Ensure safe defaults for legacy schema fields without unwanted card fields in UI
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        icon: formData.icon.trim().toLowerCase(),
        visible: Boolean(formData.visible),
        order: Number(formData.order) || 0,
        description: "",
        experienceLevel: "Production",
        source: "manual",
        featured: false,
      };

      const res = await apiFetch(url, {
        method: editingTech ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });

      if (res.success) {
        toast({
          title: editingTech ? "Technology Updated" : "Technology Added",
          description: `"${formData.name}" has been saved.`,
        });
        closeModal();
        fetchTechnologies();
      } else {
        toast({
          title: "Save Failed",
          description:
            res.message ||
            res.data?.message ||
            res.error ||
            "Failed to save technology.",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error(e);
      toast({
        title: "Save Failed",
        description:
          e instanceof Error ? e.message : "Error saving technology.",
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
          description: `"${tech.name}" is now ${
            newVisible ? "visible on" : "hidden from"
          } the portfolio.`,
        });
        fetchTechnologies();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (tech) => {
    if (
      !window.confirm(
        `Are you sure you want to remove "${tech.name}" from technologies?`
      )
    )
      return;

    try {
      const res = await apiFetch(API_ENDPOINTS.TECHNOLOGIES_DELETE(tech._id), {
        method: "DELETE",
      });
      if (res.success) {
        toast({
          title: "Technology Removed",
          description: `"${tech.name}" has been deleted.`,
        });
        fetchTechnologies();
      }
    } catch (e) {
      console.error(e);
      toast({
        title: "Delete Failed",
        description: "Failed to delete technology.",
        variant: "destructive",
      });
    }
  };

  const handleSyncGithub = async () => {
    try {
      setSyncingGithub(true);
      const res = await apiFetch(API_ENDPOINTS.TECHNOLOGIES_SYNC_GITHUB, {
        method: "POST",
      });
      if (res.success) {
        toast({
          title: "GitHub Sync Complete",
          description:
            res.message || "Repositories scanned and technologies updated.",
        });
        fetchTechnologies();
      } else {
        toast({
          title: "Sync Note",
          description: res.message || "Could not sync languages from GitHub.",
        });
      }
    } catch (e) {
      console.error(e);
      toast({
        title: "Sync Failed",
        description: "Network error communicating with backend sync.",
        variant: "destructive",
      });
    } finally {
      setSyncingGithub(false);
    }
  };

  const handleSeedDefaults = async () => {
    try {
      setSeeding(true);
      const res = await apiFetch(API_ENDPOINTS.TECHNOLOGIES_SEED, {
        method: "POST",
      });
      if (res.success) {
        toast({
          title: "Stack Loaded",
          description: "Verified technology stack loaded successfully.",
        });
        fetchTechnologies();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading font-black text-xl text-white">
              Technologies
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-white/[0.06] text-[var(--primary-accent,#FFDD9B)] border border-white/[0.08]">
              {technologies.length} Total
            </span>
          </div>
          <p className="text-xs font-mono text-[var(--text-secondary,#FFF1D8)]/70 mt-1">
            Manage icons and technologies displayed in your portfolio showcase
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSyncGithub}
            disabled={syncingGithub}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] text-xs font-mono font-bold transition-all disabled:opacity-50"
            title="Scan connected repositories and identify matching languages"
          >
            <GitBranch
              size={13}
              className={
                syncingGithub ? "animate-spin text-emerald-400" : "text-emerald-400"
              }
            />
            <span>{syncingGithub ? "Scanning..." : "Sync from GitHub"}</span>
          </button>

          <button
            onClick={handleSeedDefaults}
            disabled={seeding}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] text-xs font-mono font-bold transition-all disabled:opacity-50"
            title="Ensure verified core stack exists"
          >
            <Sparkles
              size={13}
              className={
                seeding
                  ? "animate-spin text-[var(--primary-accent,#FFDD9B)]"
                  : "text-[var(--primary-accent,#FFDD9B)]"
              }
            />
            <span>{seeding ? "Loading..." : "Load Verified Stack"}</span>
          </button>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] text-xs font-mono font-bold shadow-md shadow-[#FFDD9B]/20 transition-all hover:brightness-105"
          >
            <Plus size={14} />
            <span>+ Add Technology</span>
          </button>
        </div>
      </div>

      {/* Filter, Search & View Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative min-w-[260px] flex-1 max-w-md">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary,#FFF1D8)]/50"
          />
          <input
            type="text"
            placeholder="Search technology by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] text-xs text-white placeholder-[var(--text-secondary,#FFF1D8)]/50 focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
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

        {/* Dropdowns & View Toggle */}
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

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] text-xs font-mono text-[var(--text-secondary,#FFF1D8)] focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="VISIBLE">Visible Only</option>
            <option value="HIDDEN">Hidden Only</option>
          </select>

          {/* View toggle (List vs Compact Icons) */}
          <div className="flex items-center rounded-xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] p-0.5">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-white/[0.1] text-[var(--primary-accent,#FFDD9B)]"
                  : "text-white/40 hover:text-white"
              }`}
              title="Table / List View"
            >
              <List size={14} />
            </button>
            <button
              onClick={() => setViewMode("icons")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "icons"
                  ? "bg-white/[0.1] text-[var(--primary-accent,#FFDD9B)]"
                  : "text-white/40 hover:text-white"
              }`}
              title="Compact Icons View"
            >
              <LayoutGrid size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-24 text-center rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.08]">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-[var(--primary-accent,#FFDD9B)] mb-3" />
          <p className="text-sm font-mono text-[var(--text-secondary,#FFF1D8)]">
            Loading technologies...
          </p>
        </div>
      ) : filteredTechnologies.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] p-8 space-y-4">
          <Code2 className="w-10 h-10 mx-auto text-[var(--primary-accent,#FFDD9B)]/40" />
          <div>
            <p className="text-base font-bold text-white">
              No technologies found
            </p>
            <p className="text-xs text-[var(--text-secondary,#FFF1D8)]/70 max-w-sm mx-auto mt-1">
              Add a new technology icon or load the verified stack.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
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
              + Add Technology
            </button>
          </div>
        </div>
      ) : viewMode === "list" ? (
        /* CLEAN TABLE / LIST VIEW - ZERO BULKY CARDS */
        <div className="overflow-hidden rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.08]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06] bg-[var(--bg-base,#302E2D)]/60 text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary,#FFF1D8)]/60">
                  <th className="py-3 px-4">Icon</th>
                  <th className="py-3 px-4">Technology Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Order</th>
                  <th className="py-3 px-4 text-center">Visibility</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-xs">
                {filteredTechnologies.map((tech) => (
                  <tr
                    key={tech._id || tech.slug}
                    className={`hover:bg-white/[0.02] transition-colors ${
                      tech.visible === false ? "opacity-60 bg-white/[0.01]" : ""
                    }`}
                  >
                    {/* Icon */}
                    <td className="py-3 px-4">
                      <div className="w-8 h-8 rounded-lg bg-[var(--bg-base,#302E2D)] border border-white/[0.08] flex items-center justify-center p-1.5">
                        <TechIcon
                          name={tech.icon || tech.slug}
                          size={18}
                          colorMode="brand"
                        />
                      </div>
                    </td>

                    {/* Name */}
                    <td className="py-3 px-4 font-bold text-white">
                      <span>{tech.name}</span>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.05] text-[var(--text-secondary,#FFF1D8)]/80 border border-white/[0.06]">
                        {tech.category}
                      </span>
                    </td>

                    {/* Order */}
                    <td className="py-3 px-4 text-center font-mono text-[var(--text-secondary,#FFF1D8)]/60">
                      #{tech.order || 0}
                    </td>

                    {/* Visibility Toggle Button */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleVisible(tech)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold transition-all ${
                          tech.visible !== false
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20"
                        }`}
                        title={
                          tech.visible !== false
                            ? "Visible on portfolio (Click to hide)"
                            : "Hidden (Click to publish)"
                        }
                      >
                        {tech.visible !== false ? (
                          <>
                            <Eye size={12} />
                            <span>Visible</span>
                          </>
                        ) : (
                          <>
                            <EyeOff size={12} />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(tech)}
                          className="p-1.5 rounded-lg hover:bg-white/[0.08] text-white/70 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(tech)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400/80 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* COMPACT ICONS GRID VIEW - SCAN DISPLAY ONLY */
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {filteredTechnologies.map((tech) => (
            <div
              key={tech._id || tech.slug}
              className={`p-3 rounded-xl bg-[var(--card-surface,#403C38)] border flex flex-col items-center justify-center text-center relative group transition-all ${
                tech.visible === false
                  ? "opacity-50 border-dashed border-white/[0.1]"
                  : "border-white/[0.08] hover:border-[var(--primary-accent,#FFDD9B)]/30"
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-[var(--bg-base,#302E2D)] border border-white/[0.08] flex items-center justify-center p-2 mb-2">
                <TechIcon
                  name={tech.icon || tech.slug}
                  size={20}
                  colorMode="brand"
                />
              </div>
              <span className="text-[11px] font-bold text-white truncate max-w-full">
                {tech.name}
              </span>
              <span className="text-[9px] font-mono text-[var(--text-secondary,#FFF1D8)]/50 truncate max-w-full">
                {tech.category.split(" ")[0]}
              </span>

              {/* Hover quick action overlay */}
              <div className="absolute inset-0 rounded-xl bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 transition-opacity">
                <button
                  onClick={() => openEditModal(tech)}
                  className="p-1 rounded bg-white/[0.1] text-white hover:bg-white/[0.2]"
                  title="Edit"
                >
                  <Edit3 size={12} />
                </button>
                <button
                  onClick={() => handleToggleVisible(tech)}
                  className="p-1 rounded bg-white/[0.1] text-white hover:bg-white/[0.2]"
                  title="Toggle Visibility"
                >
                  {tech.visible !== false ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
                <button
                  onClick={() => handleDelete(tech)}
                  className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* STREAMLINED ADD / EDIT MODAL - NO CARD DESCRIPTIONS OR PARAGRAPHS         */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.1] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-[var(--bg-base,#302E2D)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[var(--primary-accent,#FFDD9B)]/10 border border-[var(--primary-accent,#FFDD9B)]/30 flex items-center justify-center text-[var(--primary-accent,#FFDD9B)] font-bold">
                    {editingTech ? <Edit3 size={16} /> : <Plus size={16} />}
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-base text-white">
                      {editingTech ? `Edit: ${editingTech.name}` : "Add Technology"}
                    </h3>
                    <p className="text-xs font-mono text-[var(--text-secondary,#FFF1D8)]/70">
                      Icon and technology name showcase
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-1.5 rounded-lg hover:bg-white/[0.08] text-white/60 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Streamlined Modal Form */}
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {/* Technology Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                    Technology Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. React, TypeScript, Docker"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs font-mono text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
                  >
                    {VALID_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand Logo / Icon Identifier */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                    Brand Icon Identifier *
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.1] flex items-center justify-center p-2 flex-shrink-0">
                      <TechIcon
                        name={formData.icon}
                        size={22}
                        colorMode="brand"
                      />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.icon}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          icon: e.target.value.toLowerCase().trim(),
                        })
                      }
                      placeholder="e.g. react, typescript, python, docker"
                      className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs font-mono text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
                    />
                  </div>

                  {/* Preset Quick Chips for Instant Selection */}
                  <div className="p-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.06] space-y-1.5">
                    <span className="text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]/60 block">
                      Quick select official SVG icon:
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                      {PRESET_ICONS.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setFormData({ ...formData, icon: p })}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono transition-all ${
                            formData.icon === p
                              ? "bg-[var(--primary-accent,#FFDD9B)] text-[#302E2D] font-bold"
                              : "bg-white/[0.05] text-[var(--text-secondary,#FFF1D8)] hover:bg-white/[0.1]"
                          }`}
                        >
                          <TechIcon
                            name={p}
                            size={12}
                            colorMode={
                              formData.icon === p ? "monochrome" : "brand"
                            }
                          />
                          <span>{p}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order & Visibility */}
                <div className="p-3 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-mono text-[var(--text-secondary,#FFF1D8)]/80">
                      Display Order:
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          order: Number(e.target.value),
                        })
                      }
                      className="w-16 px-2 py-1 rounded bg-[var(--card-surface,#403C38)] border border-white/[0.1] text-xs font-mono text-white text-center"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[var(--text-secondary,#FFF1D8)]">
                    <input
                      type="checkbox"
                      checked={formData.visible}
                      onChange={(e) =>
                        setFormData({ ...formData, visible: e.target.checked })
                      }
                      className="w-4 h-4 accent-[var(--primary-accent,#FFDD9B)] rounded cursor-pointer"
                    />
                    <span>Visible on Portfolio</span>
                  </label>
                </div>

                {/* Submit Row */}
                <div className="flex items-center justify-end gap-3 pt-2">
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
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] font-bold text-xs font-mono shadow-md shadow-[#FFDD9B]/20"
                  >
                    {saving
                      ? "Saving..."
                      : editingTech
                      ? "Update Technology"
                      : "Add Technology"}
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
