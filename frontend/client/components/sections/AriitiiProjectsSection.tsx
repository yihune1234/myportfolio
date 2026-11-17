import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Github,
  Loader,
  ArrowUpRight,
  Pin,
  Building2,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Search,
  GraduationCap,
} from "lucide-react";
import { useProjects, Project } from "@/hooks/useProjects";
import { ProjectCardCarousel } from "@/components/ProjectCardCarousel";

type ProjectTypeFilter = "all" | "completed" | "ongoing" | "proposed";

export default function AriitiiProjectsSection() {
  const { projects, loading, error, refetch } = useProjects("ARIITII_TECH");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<ProjectTypeFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const projectList = useMemo(() => {
    const list = Array.isArray(projects) ? projects : [];
    // Strictly isolate Ariitii Tech organization projects
    return list.filter((p) => {
      const isOrg =
        p.ownership === "ARIITII_TECH" ||
        p.sourceType === "organization" ||
        p.githubSourceScope === "ORGANIZATION" ||
        /ariiti/i.test(p.clientOrPartner || "");
      return isOrg;
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
          label: "Ongoing Platform",
          icon: Clock,
          className: "bg-sky-500/20 text-sky-300 border-sky-500/40",
        };
      case "completed":
      default:
        return {
          label: "Completed Product",
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

  return (
    <section
      id="ariitii-tech-projects"
      className="section-padding relative overflow-hidden bg-[var(--bg-base,#302E2D)] border-t border-white/[0.08]"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 dot-matrix-grid opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--primary-accent,#FFDD9B)]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Building2 size={13} />
              Ariitii Tech Initiative &bull; Haramaya University
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[var(--text-primary,#FFFFFF)] tracking-tight font-heading">
              Ariitii Tech Projects
            </h2>
            <p className="text-[var(--text-secondary,#FFF1D8)] text-sm sm:text-base max-w-2xl leading-relaxed mt-2 font-body">
              Software products, digital platforms, and technology solutions developed under Ariitii Tech.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 self-start md:self-auto">
            <div className="relative min-w-[200px]">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary,#FFF1D8)]/60"
              />
              <input
                type="text"
                placeholder="Search Ariitii projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] text-xs text-[var(--text-primary,#FFFFFF)] placeholder-[var(--text-secondary,#FFF1D8)]/50 focus:outline-none focus:border-amber-400"
              />
            </div>

            {categories.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] text-xs font-mono text-[var(--text-secondary,#FFF1D8)] focus:outline-none focus:border-amber-400"
              >
                <option value="ALL">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Origin & Leadership Brief Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--card-surface,#403C38)]/60 border border-amber-500/20 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 flex-shrink-0 mt-0.5">
              <GraduationCap size={18} />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-[var(--text-secondary,#FFF1D8)] leading-relaxed">
                <strong className="text-[var(--text-primary,#FFFFFF)]">Ariitii Tech</strong> is a technology initiative originating at Haramaya University, established by three co-founders, including me as Co-Founder and Lead. It focuses on developing software products, digital platforms, and technology-driven solutions.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Co-Founder and Lead
            </span>
          </div>
        </div>

        {/* Project Type Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-2 border-b border-white/[0.06]">
          {[
            { id: "all", label: "All Ariitii Projects", count: counts.all, icon: Layers },
            { id: "completed", label: "Completed Products", count: counts.completed, icon: CheckCircle2 },
            { id: "ongoing", label: "Ongoing Platforms", count: counts.ongoing, icon: Clock },
            { id: "proposed", label: "Proposed Solutions", count: counts.proposed, icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = typeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTypeFilter(tab.id as ProjectTypeFilter)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-amber-400 to-amber-500 text-[#302E2D] shadow-md shadow-amber-500/20"
                    : "text-[var(--text-secondary,#FFF1D8)] hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04]"
                }`}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] ${
                    isActive ? "bg-black/20 text-[#302E2D]" : "bg-white/10 text-white/70"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="py-24 text-center rounded-2xl bg-[var(--card-surface,#403C38)]/40 border border-white/[0.06]">
            <Loader className="w-8 h-8 mx-auto animate-spin text-amber-400 mb-3" />
            <p className="text-sm font-mono text-[var(--text-secondary,#FFF1D8)]">
              Loading Ariitii Tech projects...
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
          <div className="py-20 text-center rounded-2xl bg-[var(--card-surface,#403C38)]/40 border border-white/[0.06] p-8 space-y-3">
            <Building2 className="w-12 h-12 mx-auto text-amber-400/40 mb-2" />
            <p className="text-lg font-bold text-[var(--text-primary,#FFFFFF)] font-heading">
              No Ariitii Tech projects found
            </p>
            <p className="text-xs sm:text-sm text-[var(--text-secondary,#FFF1D8)] max-w-md mx-auto">
              Organization software products published by the administrator will be showcased here.
            </p>
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
                  className="card-slate rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 cursor-pointer hover:border-amber-500/40 shadow-xl"
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
                      <div className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2.5 py-1 bg-amber-400 text-[10px] font-mono font-bold text-[#302E2D] uppercase tracking-wider rounded-md shadow-lg shadow-amber-400/30">
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
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded backdrop-blur-md uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        Ariitii Tech
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-400">
                        Ariitii Tech Solution
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary,#FFFFFF)] group-hover:text-amber-300 transition-colors leading-snug mb-2 font-heading">
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
                        <span className="text-[11px] font-mono px-2 py-0.5 bg-amber-500/10 border border-amber-500/25 rounded text-amber-300 font-medium">
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
                        className="flex-1 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 text-[#302E2D] rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-400/15"
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
