import React from "react";
import { FolderKanban, Github, Plus, RefreshCw, Search } from "lucide-react";
import ProjectCard from "./ProjectCard.jsx";

export default function PortfolioProjectsView({
  projects = [],
  projectsLoading = false,
  filteredProjects = [],
  projectSearch = "",
  setProjectSearch,
  projectStatusFilter = "ALL",
  setProjectStatusFilter,
  projectCategoryFilter = "ALL",
  setProjectCategoryFilter,
  availableCategories = [],
  syncingProjectId = null,
  onTogglePublish,
  onTogglePin,
  onSyncProject,
  onEditProject,
  onDeleteProject,
  onSwitchToGithubBrowser,
  onOpenCreateModal,
}) {
  const filterChips = [
    { id: "ALL", label: `All (${projects.length})` },
    {
      id: "PUBLISHED",
      label: `Published (${projects.filter((p) => p.status === "published").length})`,
    },
    {
      id: "COMPLETED",
      label: `Completed (${projects.filter((p) => (p.projectType || "completed") === "completed").length})`,
    },
    {
      id: "ONGOING",
      label: `Ongoing (${projects.filter((p) => p.projectType === "ongoing").length})`,
    },
    {
      id: "PROPOSALS",
      label: `Proposals (${projects.filter((p) => p.projectType === "proposed").length})`,
    },
    {
      id: "DRAFT",
      label: `Drafts (${projects.filter((p) => p.status === "draft").length})`,
    },
    {
      id: "UNDER_REVIEW",
      label: `Review (${projects.filter((p) => p.status === "under_review").length})`,
    },
    {
      id: "PERSONAL",
      label: `Personal (${projects.filter((p) => p.sourceType === "personal" || p.githubSourceScope === "PERSONAL").length})`,
    },
    {
      id: "ORGANIZATION",
      label: `Ariiti Org (${projects.filter((p) => p.sourceType === "organization" || p.githubSourceScope === "ORGANIZATION").length})`,
    },
    {
      id: "MANUAL",
      label: `Manual (${projects.filter((p) => p.sourceType === "manual" && !p.githubRepoFullName).length})`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Filter Bar & Counters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[var(--card-surface,#403C38)] border border-white/[0.08]">
          {filterChips.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setProjectStatusFilter(chip.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                projectStatusFilter === chip.id
                  ? "bg-[var(--primary-accent,#FFDD9B)] text-[#302E2D] shadow-sm"
                  : "text-[var(--text-secondary,#FFF1D8)] hover:text-white"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative min-w-[220px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary,#FFF1D8)]/60"
            />
            <input
              type="text"
              placeholder="Search projects or tags..."
              value={projectSearch}
              onChange={(e) => setProjectSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[var(--card-surface,#403C38)] border border-white/[0.08] text-xs text-[var(--text-primary,#FFFFFF)] placeholder-[var(--text-secondary,#FFF1D8)]/50 focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50 transition-all"
            />
            {projectSearch && (
              <button
                onClick={() => setProjectSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          <select
            value={projectCategoryFilter}
            onChange={(e) => setProjectCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[var(--card-surface,#403C38)] border border-white/[0.08] text-xs font-mono text-[var(--text-secondary,#FFF1D8)] focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
          >
            <option value="ALL">All Categories</option>
            {availableCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {projectsLoading ? (
        <div className="py-24 text-center rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.08]">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-[var(--primary-accent,#FFDD9B)] mb-3" />
          <p className="text-sm font-mono text-[var(--text-secondary,#FFF1D8)]">
            Loading portfolio projects...
          </p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] p-8 space-y-4">
          <FolderKanban className="w-12 h-12 mx-auto text-[var(--primary-accent,#FFDD9B)]/40" />
          <div>
            <p className="text-lg font-bold text-[var(--text-primary,#FFFFFF)]">
              No projects match your filter
            </p>
            <p className="text-sm text-[var(--text-secondary,#FFF1D8)] max-w-md mx-auto mt-1">
              You can browse your real GitHub repositories and import them with one click, or create a project manually.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onSwitchToGithubBrowser}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#FFDD9B]/20"
            >
              <Github size={14} />
              <span>Browse GitHub Repositories</span>
            </button>
            <button
              onClick={onOpenCreateModal}
              className="px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] font-bold text-xs flex items-center gap-2"
            >
              <Plus size={14} />
              <span>Create Project Manually</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, idx) => (
            <ProjectCard
              key={project._id || idx}
              project={project}
              idx={idx}
              isSyncing={syncingProjectId === project._id}
              onTogglePublish={onTogglePublish}
              onTogglePin={onTogglePin}
              onSyncProject={onSyncProject}
              onEditProject={onEditProject}
              onDeleteProject={onDeleteProject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
