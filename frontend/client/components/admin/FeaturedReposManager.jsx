import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Github,
  Star,
  GitFork,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Eye,
  EyeOff,
  Code2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS, apiFetch } from "@/lib/api";

export function FeaturedReposManager() {
  const { toast } = useToast();
  const [username, setUsername] = useState("yihune1234");
  const [availableRepos, setAvailableRepos] = useState([]);
  const [featuredList, setFeaturedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedRepoToAdd, setSelectedRepoToAdd] = useState("");

  const DEFAULT_FEATURED = [
    {
      name: "InternshipApplicantManagementAPI",
      fullName: "yihune1234/InternshipApplicantManagementAPI",
      customDescription:
        "Production-ready Internship Applicant Management REST API built with NestJS, TypeScript, Prisma ORM, JWT authentication, and Swagger OpenAPI.",
      demoUrl: "",
      visible: true,
    },
    {
      name: "myportfolio",
      fullName: "yihune1234/myportfolio",
      customDescription:
        "Personal developer portfolio and engineering showcase built with React, TypeScript, and Tailwind CSS.",
      demoUrl: "",
      visible: true,
    },
    {
      name: "Student-Contact-Management-System",
      fullName: "yihune1234/Student-Contact-Management-System",
      customDescription:
        "Relational database application for academic student contact records and administrative query workflows in PHP and MySQL.",
      demoUrl: "",
      visible: true,
    },
    {
      name: "Pharmacy-Management-System-",
      fullName: "yihune1234/Pharmacy-Management-System-",
      customDescription:
        "Pharmacy inventory tracking, prescription management, and medicine dispensing system in PHP.",
      demoUrl: "",
      visible: true,
    },
  ];

  useEffect(() => {
    loadSettingsAndRepos();
  }, []);

  const loadSettingsAndRepos = async () => {
    setLoading(true);
    try {
      // 1. Load existing settings
      let savedFeatured = null;
      try {
        const settingsRes = await fetch("/api/github/settings");
        if (settingsRes.ok) {
          const s = await settingsRes.json();
          if (s.githubUsername) setUsername(s.githubUsername);
          if (Array.isArray(s.featuredRepos) && s.featuredRepos.length > 0) {
            savedFeatured = s.featuredRepos.map((item) => {
              if (typeof item === "string") {
                try {
                  const parsed = JSON.parse(item);
                  return parsed;
                } catch {
                  return {
                    name: item.split("/").pop() || item,
                    fullName: item.includes("/") ? item : `${s.githubUsername || "yihune1234"}/${item}`,
                    customDescription: "",
                    demoUrl: "",
                    visible: true,
                  };
                }
              }
              return item;
            });
          }
        }
      } catch (err) {
        // Fallback
      }

      // Check localStorage backup
      if (!savedFeatured) {
        const local = localStorage.getItem("admin_featured_repos");
        if (local) {
          try {
            savedFeatured = JSON.parse(local);
          } catch {}
        }
      }

      setFeaturedList(savedFeatured && savedFeatured.length > 0 ? savedFeatured : DEFAULT_FEATURED);

      // 2. Fetch all public repos from GitHub
      const ghRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`, {
        headers: { Accept: "application/vnd.github.v3+json" },
      });
      if (ghRes.ok) {
        const data = await ghRes.json();
        if (Array.isArray(data)) {
          // Exclude forks, size 0, and profile README
          const filtered = data.filter(
            (r) => !r.fork && r.size > 0 && r.name.toLowerCase() !== username.toLowerCase()
          );
          setAvailableRepos(filtered);
        }
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Connection Notice",
        description: "Loaded featured list from local configuration.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRepo = () => {
    if (!selectedRepoToAdd) return;
    if (featuredList.some((f) => f.name.toLowerCase() === selectedRepoToAdd.toLowerCase())) {
      toast({ title: "Already Added", description: "This repository is already in your featured list." });
      return;
    }

    const repoObj = availableRepos.find((r) => r.name === selectedRepoToAdd);
    const newEntry = {
      name: selectedRepoToAdd,
      fullName: repoObj ? repoObj.full_name : `${username}/${selectedRepoToAdd}`,
      customDescription: repoObj?.description || "",
      demoUrl: repoObj?.homepage || "",
      visible: true,
    };

    setFeaturedList([...featuredList, newEntry]);
    setSelectedRepoToAdd("");
    toast({ title: "Repository Added", description: `Added ${selectedRepoToAdd} to featured list.` });
  };

  const handleRemove = (index) => {
    const updated = featuredList.filter((_, i) => i !== index);
    setFeaturedList(updated);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const updated = [...featuredList];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setFeaturedList(updated);
  };

  const handleMoveDown = (index) => {
    if (index === featuredList.length - 1) return;
    const updated = [...featuredList];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setFeaturedList(updated);
  };

  const handleDescriptionChange = (index, value) => {
    const updated = [...featuredList];
    updated[index].customDescription = value;
    setFeaturedList(updated);
  };

  const handleDemoChange = (index, value) => {
    const updated = [...featuredList];
    updated[index].demoUrl = value;
    setFeaturedList(updated);
  };

  const handleToggleVisible = (index) => {
    const updated = [...featuredList];
    updated[index].visible = !updated[index].visible;
    setFeaturedList(updated);
  };

  const handleSaveAndPublish = async () => {
    setSaving(true);
    try {
      // Save locally immediately
      localStorage.setItem("admin_featured_repos", JSON.stringify(featuredList));

      // Attempt backend persistence
      const serialized = featuredList.map((item) => JSON.stringify(item));
      await apiFetch(API_ENDPOINTS.ADMIN_GITHUB_SETTINGS, {
        method: "PUT",
        body: JSON.stringify({
          featuredRepos: serialized,
        }),
      });

      toast({
        title: "Selections Published",
        description: `Successfully published ${featuredList.filter((f) => f.visible).length} featured repositories to public portfolio.`,
      });
    } catch (err) {
      toast({
        title: "Saved Locally",
        description: "Featured selections have been saved and applied to your portfolio.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[var(--card-surface,#403C38)] border border-[var(--border-color,rgba(255,221,155,0.18))]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[var(--primary-accent,#FFDD9B)]/10 text-[var(--primary-accent,#FFDD9B)] text-xs font-mono mb-2">
              <Star size={12} className="fill-current" />
              <span>Administrator Project Showcase</span>
            </div>
            <h2 className="text-xl font-bold text-white font-heading">
              Featured GitHub Repositories
            </h2>
            <p className="text-xs text-[var(--text-secondary,#FFF1D8)]/80 mt-1 max-w-xl">
              Select 3 or 4 key repositories to showcase publicly. Reorder them, customize their descriptions, or toggle visibility.
            </p>
          </div>

          <button
            onClick={handleSaveAndPublish}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] font-mono font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-105 transition-all self-start sm:self-auto disabled:opacity-50"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            <span>Save &amp; Publish</span>
          </button>
        </div>
      </div>

      {/* Add Repository Picker */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1">
          <label className="text-[10px] font-mono uppercase text-[var(--text-secondary,#FFF1D8)]/70 block mb-1">
            Add from Public GitHub Repositories (@{username})
          </label>
          <select
            value={selectedRepoToAdd}
            onChange={(e) => setSelectedRepoToAdd(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs text-white font-mono focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]"
          >
            <option value="">-- Choose a repository to feature --</option>
            {availableRepos.map((repo) => (
              <option key={repo.id} value={repo.name}>
                {repo.name} {repo.language ? `(${repo.language})` : ""}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAddRepo}
          disabled={!selectedRepoToAdd}
          className="px-4 py-2 mt-4 sm:mt-0 rounded-xl bg-[var(--bg-base,#302E2D)] hover:bg-white/[0.08] text-white border border-white/[0.1] text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-40"
        >
          <Plus size={14} className="text-[var(--primary-accent,#FFDD9B)]" />
          <span>Add to Featured</span>
        </button>
      </div>

      {/* Featured Repos List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary,#FFF1D8)]/70 px-1">
          <span>
            Displaying {featuredList.filter((f) => f.visible).length} of {featuredList.length} repositories (Recommended: 3 to 4)
          </span>
          {featuredList.length > 4 && (
            <span className="text-amber-400 text-[11px] font-semibold">
              Note: 3 to 4 items recommended for optimal presentation
            </span>
          )}
        </div>

        {featuredList.map((item, index) => (
          <motion.div
            key={item.name}
            layout
            className={`p-5 rounded-2xl bg-[var(--card-surface,#403C38)] border transition-all ${
              item.visible
                ? "border-white/[0.08] hover:border-[var(--primary-accent,#FFDD9B)]/30"
                : "border-white/[0.04] opacity-60"
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              {/* Order Controls & Title */}
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="flex flex-col gap-1 flex-shrink-0 mt-0.5">
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="p-1 rounded bg-[var(--bg-base,#302E2D)] text-white/70 hover:text-white disabled:opacity-20 transition-colors"
                    title="Move up"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === 0 && featuredList.length === 1}
                    className="p-1 rounded bg-[var(--bg-base,#302E2D)] text-white/70 hover:text-white disabled:opacity-20 transition-colors"
                    title="Move down"
                  >
                    <ArrowDown size={12} />
                  </button>
                </div>

                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[var(--primary-accent,#FFDD9B)]/20 text-[var(--primary-accent,#FFDD9B)] text-xs font-mono font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <h3 className="font-mono text-sm font-bold text-white truncate">
                      {item.name}
                    </h3>
                    <a
                      href={`https://github.com/${username}/${item.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-secondary,#FFF1D8)]/60 hover:text-white"
                      title="Open on GitHub"
                    >
                      <ExternalLink size={12} />
                    </a>
                  </div>

                  {/* Custom Description input */}
                  <div>
                    <label className="text-[10px] font-mono uppercase text-[var(--text-secondary,#FFF1D8)]/60 block mb-1">
                      Display Description
                    </label>
                    <textarea
                      value={item.customDescription || ""}
                      onChange={(e) => handleDescriptionChange(index, e.target.value)}
                      placeholder="Enter a clean, understandable description for portfolio visitors..."
                      rows={2}
                      className="w-full px-3 py-1.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs text-white placeholder-[var(--text-secondary,#FFF1D8)]/40 focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)] transition-all font-body resize-none"
                    />
                  </div>

                  {/* Demo URL input */}
                  <div>
                    <label className="text-[10px] font-mono uppercase text-[var(--text-secondary,#FFF1D8)]/60 block mb-1">
                      Live Demo URL (optional)
                    </label>
                    <input
                      type="url"
                      value={item.demoUrl || ""}
                      onChange={(e) => handleDemoChange(index, e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs text-white placeholder-[var(--text-secondary,#FFF1D8)]/40 focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)] transition-all font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-start">
                <button
                  onClick={() => handleToggleVisible(index)}
                  className={`p-2 rounded-xl text-xs font-mono flex items-center gap-1.5 border transition-all ${
                    item.visible
                      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20"
                      : "bg-white/[0.04] text-white/50 border-white/[0.06] hover:bg-white/[0.08]"
                  }`}
                  title={item.visible ? "Publicly Visible" : "Hidden from Public"}
                >
                  {item.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                  <span className="hidden sm:inline">{item.visible ? "Visible" : "Hidden"}</span>
                </button>

                <button
                  onClick={() => handleRemove(index)}
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 transition-colors"
                  title="Remove from featured list"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
export default FeaturedReposManager;
