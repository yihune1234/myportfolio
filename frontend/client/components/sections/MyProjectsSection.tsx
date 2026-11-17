import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Github,
  Loader,
  ArrowUpRight,
  Pin,
  User,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Search,
  X,
} from "lucide-react";
import { useProjects, Project } from "@/hooks/useProjects";
import { ProjectCardCarousel } from "@/components/ProjectCardCarousel";

type ProjectTypeFilter = "all" | "completed" | "ongoing" | "proposed";

export default function MyProjectsSection() {
  const { projects, loading, error, refetch } = useProjects("PERSONAL");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<ProjectTypeFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const projectList = useMemo(() => {
    const list = Array.isArray(projects) ? projects : [];
    // Strictly isolate personal projects
    return list.filter((p) => {
      const isOrg =
        p.ownership === "ARIITII_TECH" ||
        p.sourceType === "organization" ||
        p.githubSourceScope === "ORGANIZATION" ||
        /ariiti/i.test(p.clientOrPartner || "");
      return !isOrg;
    });
  }, [projects]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    projectList.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [projectList]);

  const filteredProjects = useMemo(() => {
    return projectList.filter((p) => {
      if (typeFilter !== "all") {
        const itemType = p.projectType || "completed";
        if (itemType !== typeFilter) return false;
      }
      if (selectedCategory !== "ALL" && p.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title?.toLowerCase().includes(q);
        const matchDesc = p.description?.toLowerCase().includes(q);
        const matchTech = (p.technologies || []).some((t) =>
          t.toLowerCase().includes(q)
        );
        if (!matchTitle && !matchDesc && !matchTech) return false;
      }
      return true;
    });
  }, [projectList, typeFilter, selectedCategory, searchQuery]);

  const sorted = [...filteredProjects].sort(
    (a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)
  );

  const getSlides = (project: Project) =>
    project.images?.length
      ? project.images
      : project.image
      ? [{ url: project.image, title: "Cover Image" }]
      : [];

  const getTypeBadge = (type?: string) => {
    switch (type) {
      case "proposed":
        return {
          label: "Proposed Initiative",
          icon: Sparkles,
          className: "bg-purple-500/20 text-purple-300 border-purple-500/40",
        };
      case "ongoing":
        return {
          label: "Ongoing Development",
          icon: Clock,
          className: "bg-sky-500/20 text-sky-300 border-sky-500/40",
        };
      case "completed":
      default:
        return {
          label: "Completed Project",
          icon: CheckCircle2,
          className: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
        };
    }
  };

  const counts = useMemo(() => {
    return {
      all: projectList.length,
      completed: projectList.filter(
        (p) => (p.projectType || "completed") === "completed"
      ).length,
      ongoing: projectList.filter((p) => p.projectType === "ongoing").length,
      proposed: projectList.filter((p) => p.projectType === "proposed").length,
    };
  }, [projectList]);

  const filterTabs = useMemo(() => {
    const tabs: { id: ProjectTypeFilter; label: string; count: number; icon: any }[] = [
      { id: "all", label: "All Projects", count: counts.all, icon: Layers },
    ];
    if (counts.completed > 0 || (counts.ongoing === 0 && counts.proposed === 0)) {
      tabs.push({ id: "completed", label: "Completed", count: counts.completed, icon: CheckCircle2 });
    }
    if (counts.ongoing > 0) {
      tabs.push({ id: "ongoing", label: "In Progress", count: counts.ongoing, icon: Clock });
    }
    if (counts.proposed > 0) {
      tabs.push({ id: "proposed", label: "Initiatives & Proposals", count: counts.proposed, icon: Sparkles });
    }
    return tabs;
  }, [counts]);

  const hasActiveFilters = searchQuery.trim() !== "" || selectedCategory !== "ALL" || typeFilter !== "all";

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("ALL");
    setTypeFilter("all");
  };

  return (
    <section
      id="my-projects"
      className="section-padding relative overflow-hidden bg-[var(--bg-base,#302E2D)] border-t border-white/[0.08]"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 dot-matrix-grid opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[550px] h-[550px] ambient-amber-glow rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] ambient-emerald-glow rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-accent,#FFDD9B)]/15 border border-[var(--primary-accent,#FFDD9B)]/30 text-[var(--primary-accent,#FFDD9B)] text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <User size={13} />
              Personal Engineering Lab
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[var(--text-primary,#FFFFFF)] tracking-tight font-heading">
              My Projects
            </h2>
            <p className="text-[var(--text-secondary,#FFF1D8)] text-sm sm:text-base max-w-2xl leading-relaxed mt-2 font-body">
              Personal software projects, applications, experiments, and solutions that I independently develop and maintain.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary,#FFF1D8)]/60 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search my projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-8 py-2 rounded-xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] text-xs text-[var(--text-primary,#FFFFFF)] placeholder-[var(--text-secondary,#FFF1D8)]/50 focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-[var(--text-secondary,#FFF1D8)]/60 hover:text-white hover:bg-white/10 transition-colors"
                  title="Clear search"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {categories.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] text-xs font-mono text-[var(--text-secondary,#FFF1D8)] focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)] cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 transition-all whitespace-nowrap self-start sm:self-auto"
                title="Clear all filters"
              >
                <X size={12} />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Project Type Filter Tabs */}
        {filterTabs.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap mb-8 pb-2 border-b border-white/[0.06]">
            {filterTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = typeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setTypeFilter(tab.id)}
                  className={`whitespace-nowrap flex-shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    isActive
                      ? "bg-[var(--primary-accent,#FFDD9B)] text-[#302E2D] shadow-md shadow-[var(--primary-accent,#FFDD9B)]/20"
                      : "text-[var(--text-secondary,#FFF1D8)] hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04]"
                  }`}
                >
                  <Icon size={13} className="flex-shrink-0" />
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] leading-none ${
                      isActive ? "bg-black/20 text-[#302E2D]" : "bg-white/10 text-white/70"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Projects Grid */}
        {loading ? (
          <div className="py-24 text-center rounded-2xl bg-[var(--card-surface,#403C38)]/40 border border-white/[0.06]">
            <Loader className="w-8 h-8 mx-auto animate-spin text-[var(--primary-accent,#FFDD9B)] mb-3" />
            <p className="text-sm font-mono text-[var(--text-secondary,#FFF1D8)]">
              Loading personal projects...
            </p>
          </div>
        ) : error ? (
          <div className="py-16 text-center rounded-2xl bg-red-500/10 border border-red-500/20 p-6 space-y-3">
            <p className="text-sm text-red-300">{error}</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg text-xs font-mono transition-all"
            >
              Retry
            </button>
          </div>
        ) : sorted.length === 0 ? (
          <div className="py-16 sm:py-20 text-center rounded-2xl bg-[var(--card-surface,#403C38)]/40 border border-white/[0.06] p-6 sm:p-8 space-y-4">
            <User className="w-12 h-12 mx-auto text-[var(--primary-accent,#FFDD9B)]/40 mb-2" />
            <p className="text-lg font-bold text-[var(--text-primary,#FFFFFF)] font-heading">
              {hasActiveFilters ? "No matching projects found" : "No personal projects found"}
            </p>
            <p className="text-xs sm:text-sm text-[var(--text-secondary,#FFF1D8)] max-w-md mx-auto leading-relaxed">
              {hasActiveFilters
                ? "No personal projects match your current search and filter criteria. Try clearing filters to see all available projects."
                : "Personal projects published by the administrator will be showcased here."}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary-accent,#FFDD9B)] text-[#302E2D] font-mono font-bold rounded-xl text-xs hover:opacity-90 transition-all shadow-md shadow-[var(--primary-accent,#FFDD9B)]/20"
              >
                <X size={14} />
                <span>Clear All Filters</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {sorted.map((project) => {
              const slides = getSlides(project);
              const typeBadge = getTypeBadge(project.projectType);
              const TypeIcon = typeBadge.icon;
              const isHovered = hoveredId === project._id;
              const canShowGithub = project.showGithubLink !== false && project.githubUrl;

              return (
                <motion.div
                  key={project._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  onMouseEnter={() => setHoveredId(project._id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => {
                    window.location.href = `/project/${project._id}`;
                  }}
                  className="card-slate rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 cursor-pointer hover:border-[var(--primary-accent,#FFDD9B)]/40 shadow-xl"
                >
                  {/* Screenshot Carousel Frame */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-[var(--bg-base,#302E2D)]">
                    <ProjectCardCarousel
                      images={slides}
                      title={project.title}
                      isHovered={isHovered}
                      onOpenModal={() => {
                        window.location.href = `/project/${project._id}`;
                      }}
                    />

                    {/* Featured / Pinned Badge */}
                    {project.pinned && (
                      <div className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2.5 py-1 bg-[var(--primary-accent,#FFDD9B)] text-[10px] font-mono font-bold text-[#302E2D] uppercase tracking-wider rounded-md shadow-lg shadow-[var(--primary-accent,#FFDD9B)]/30">
                        <Pin size={10} className="fill-current" />
                        Featured
                      </div>
                    )}

                    {/* Ownership & Type Badges */}
                    <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded backdrop-blur-md uppercase tracking-wider flex items-center gap-1 border ${typeBadge.className}`}
                      >
                        <TypeIcon size={10} />
                        {typeBadge.label}
                      </span>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded backdrop-blur-md uppercase tracking-wider bg-[var(--primary-accent,#FFDD9B)]/20 text-[var(--primary-accent,#FFDD9B)] border border-[var(--primary-accent,#FFDD9B)]/40">
                        My Project
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary,#FFFFFF)] group-hover:text-[var(--primary-accent,#FFDD9B)] transition-colors leading-snug mb-2 font-heading">
                      {project.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[var(--text-secondary,#FFF1D8)] leading-relaxed line-clamp-2 mb-4 flex-1 font-body">
                      {project.shortSummary || project.description}
                    </p>

                    {/* Technology Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.technologies?.slice(0, 3).map((tech: string, i: number) => (
                        <span
                          key={i}
                          className="text-[11px] font-mono px-2 py-0.5 bg-[var(--bg-base,#302E2D)] border border-white/[0.06] rounded text-[var(--text-secondary,#FFF1D8)] font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies?.length > 3 && (
                        <span className="text-[11px] font-mono px-2 py-0.5 bg-[var(--primary-accent,#FFDD9B)]/10 border border-[var(--primary-accent,#FFDD9B)]/25 rounded text-[var(--primary-accent,#FFDD9B)] font-medium">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/project/${project._id}`;
                        }}
                        className="flex-1 py-2 bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] hover:from-[#FFE8B8] hover:to-[var(--primary-accent,#FFDD9B)] text-[#302E2D] rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[var(--primary-accent,#FFDD9B)]/15"
                      >
                        <span>View Project Details</span>
                        <ArrowUpRight size={13} />
                      </button>

                      <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {canShowGithub && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-[var(--bg-base,#302E2D)] text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--text-primary,#FFFFFF)] hover:bg-white/[0.06] border border-white/[0.08] rounded-xl transition-all"
                            title="Repository Information"
                          >
                            <Github size={14} />
                          </a>
                        )}
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-[var(--bg-base,#302E2D)] text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--text-primary,#FFFFFF)] hover:bg-white/[0.06] border border-white/[0.08] rounded-xl transition-all"
                            title="Live Demonstration"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
