import React from "react";
import { FolderKanban, Github, Plus, RefreshCw, Search, Building2, User } from "lucide-react";
import ProjectCard from "./ProjectCard.jsx";

export default function PortfolioProjectsView({
  activeView = "my-projects",
  projects = [],
  allProjects = [],
  personalCount = 0,
  ariitiiCount = 0,
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
  onSwitchView,
}) {
  const isPersonalView = activeView === "my-projects";
  const isAriitiiView = activeView === "ariitii-tech";
  const isAllView = activeView === "all-projects";

  const baseFilterChips = [
    { id: "ALL", label: `All (${projects.length})` },
    ...(isAllView
      ? [
          { id: "PERSONAL", label: `My Projects (${personalCount})` },
          { id: "ORGANIZATION", label: `Ariitii Tech (${ariitiiCount})` },
        ]
      : []),
    {
      id: "PUBLISHED",
      label: `Published (${projects.filter((p) => p.status === "published").length})`,
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
  ];

  return (
    <div className="space-y-6">
      {/* Contextual Collection Header Banner */}
      <div className="p-5 rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--primary-accent,#FFDD9B)]/10 text-[var(--primary-accent,#FFDD9B)] border border-[var(--primary-accent,#FFDD9B)]/30">
                {isPersonalView && "Personal Software Portfolio"}
                {isAriitiiView && "Ariitii Tech Initiative • Haramaya University"}
                {isAllView && "Authorized Administration Registry"}
              </span>
              <span className="text-xs font-mono text-[var(--text-secondary,#FFF1D8)]/70">
                {projects.length} project{projects.length === 1 ? "" : "s"}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white font-heading tracking-tight">
              {isPersonalView && "My Projects"}
              {isAriitiiView && "Ariitii Tech Projects"}
              {isAllView && "All Projects (Authorized Administration)"}
            </h3>

            <p className="text-xs sm:text-sm text-[var(--text-secondary,#FFF1D8)] max-w-2xl leading-relaxed">
              {isPersonalView &&
                "Personal software projects, applications, experiments, and solutions that I independently develop and maintain."}
              {isAriitiiView &&
                "Software products, digital platforms, and technology solutions developed under Ariitii Tech. Originating at Haramaya University, established by three co-founders, including me as Co-Founder and Lead."}
              {isAllView &&
                "Consolidated administrative view of all personal and organizational project registries with lifecycle management."}
            </p>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            {isPersonalView && (
              <>
                <button
                  onClick={() => onSwitchToGithubBrowser("PERSONAL")}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] text-xs font-mono font-bold transition-all"
                >
                  <Github size={14} className="text-sky-300" />
                  <span>Connect Personal GitHub</span>
                </button>
                <button
                  onClick={() => onOpenCreateModal("PERSONAL")}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] text-xs font-mono font-bold shadow-md shadow-[#FFDD9B]/20 transition-all"
                >
                  <Plus size={14} />
                  <span>+ New Personal Project</span>
                </button>
              </>
            )}

            {isAriitiiView && (
              <>
                <button
                  onClick={() => onSwitchToGithubBrowser("ORGANIZATION")}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] text-xs font-mono font-bold transition-all"
                >
                  <Github size={14} className="text-amber-300" />
                  <span>Connect Ariitii Tech GitHub</span>
                </button>
                <button
                  onClick={() => onOpenCreateModal("ARIITII_TECH")}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] text-xs font-mono font-bold shadow-md shadow-[#FFDD9B]/20 transition-all"
                >
                  <Plus size={14} />
                  <span>+ New Ariitii Tech Project</span>
                </button>
              </>
            )}

            {isAllView && (
              <>
                <button
                  onClick={() => onOpenCreateModal("PERSONAL")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-mono font-bold transition-all"
                >
                  <User size={13} />
                  <span>+ Personal Project</span>
                </button>
                <button
                  onClick={() => onOpenCreateModal("ARIITII_TECH")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold transition-all"
                >
                  <Building2 size={13} />
                  <span>+ Ariitii Tech Project</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filter Bar & Counters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[var(--card-surface,#403C38)] border border-white/[0.08]">
          {baseFilterChips.map((chip) => (
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
            Loading {isPersonalView ? "personal" : isAriitiiView ? "Ariitii Tech" : "portfolio"} projects...
          </p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] p-8 space-y-4">
          <FolderKanban className="w-12 h-12 mx-auto text-[var(--primary-accent,#FFDD9B)]/40" />
          <div>
            <p className="text-lg font-bold text-[var(--text-primary,#FFFFFF)]">
              No {isPersonalView ? "personal" : isAriitiiView ? "Ariitii Tech" : ""} projects found
            </p>
            <p className="text-sm text-[var(--text-secondary,#FFF1D8)] max-w-md mx-auto mt-1">
              {isPersonalView &&
                "Browse your personal GitHub account to import repositories or create a personal project manually."}
              {isAriitiiView &&
                "Connect to the Ariitii Tech organization GitHub repository to import platform repositories or create a project manually."}
              {isAllView && "No projects match the current filter criteria."}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onSwitchToGithubBrowser(isAriitiiView ? "ORGANIZATION" : "PERSONAL")}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#FFDD9B]/20"
            >
              <Github size={14} />
              <span>
                {isAriitiiView
                  ? "Browse Ariitii Tech Repositories"
                  : "Browse Personal GitHub Repos"}
              </span>
            </button>
            <button
              onClick={() => onOpenCreateModal(isAriitiiView ? "ARIITII_TECH" : "PERSONAL")}
              className="px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] font-bold text-xs flex items-center gap-2"
            >
              <Plus size={14} />
              <span>
                {isAriitiiView
                  ? "Create Ariitii Tech Project"
                  : "Create Personal Project"}
              </span>
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
