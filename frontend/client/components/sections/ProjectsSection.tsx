import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Github,
  Loader,
  ArrowUpRight,
  Pin,
  Building2,
  User,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
} from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { ProjectCardCarousel } from "@/components/ProjectCardCarousel";

type ProjectTypeFilter = "all" | "completed" | "ongoing" | "proposed";
type ScopeFilter = "ALL" | "PERSONAL" | "ORGANIZATION";

export default function ProjectsSection() {
  const { projects, loading, error, refetch } = useProjects();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<ProjectTypeFilter>("all");
  const [selectedScope, setSelectedScope] = useState<ScopeFilter>("ALL");

  const projectList = Array.isArray(projects) ? projects : [];

  const filteredProjects = useMemo(() => {
    return projectList.filter((p) => {
      // Filter by project type
      if (typeFilter !== "all") {
        const itemType = p.projectType || "completed";
        if (itemType !== typeFilter) return false;
      }

      // Filter by scope
      if (selectedScope === "PERSONAL" && p.githubSourceScope === "ORGANIZATION") {
        return false;
      }
      if (selectedScope === "ORGANIZATION" && p.githubSourceScope !== "ORGANIZATION") {
        return false;
      }

      return true;
    });
  }, [projectList, typeFilter, selectedScope]);

  const sorted = [...filteredProjects].sort(
    (a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)
  );

  const getSlides = (project: any) =>
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
          label: "Ongoing Deployment",
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
      completed: projectList.filter((p) => (p.projectType || "completed") === "completed").length,
      ongoing: projectList.filter((p) => p.projectType === "ongoing").length,
      proposed: projectList.filter((p) => p.projectType === "proposed").length,
    };
  }, [projectList]);

  return (
    <section
      id="projects"
      className="section-padding relative overflow-hidden bg-[var(--bg-base,#302E2D)] border-t border-white/[0.08]"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 dot-matrix-grid opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[550px] h-[550px] ambient-amber-glow rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] ambient-emerald-glow rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="text-[11px] font-mono text-[var(--primary-accent,#FFDD9B)] uppercase tracking-[0.25em] font-bold block mb-2">
              Portfolio & Deliverables
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[var(--text-primary,#FFFFFF)] tracking-tight font-heading">
              Featured Solutions & Projects
            </h2>
            <p className="text-[var(--text-secondary,#FFF1D8)] text-sm sm:text-base max-w-xl leading-relaxed mt-2 font-body">
              Enterprise software platforms, cloud infrastructure, and strategic technology initiatives delivered for clients and partners.
            </p>
          </div>

          {/* Scope Selector: Personal vs Org */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] backdrop-blur-md self-start md:self-auto shadow-inner">
            <button
              onClick={() => setSelectedScope("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedScope === "ALL"
                  ? "bg-white/[0.1] text-[var(--text-primary,#FFFFFF)] border border-white/[0.15] shadow-sm"
                  : "text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--text-primary,#FFFFFF)]"
              }`}
            >
              All Scopes
            </button>
            <button
              onClick={() => setSelectedScope("PERSONAL")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedScope === "PERSONAL"
                  ? "bg-[var(--primary-accent,#FFDD9B)]/20 text-[var(--primary-accent,#FFDD9B)] border border-[var(--primary-accent,#FFDD9B)]/40 shadow-sm"
                  : "text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--text-primary,#FFFFFF)]"
              }`}
            >
              <User size={13} className="text-[var(--primary-accent,#FFDD9B)]" />
              <span>Personal</span>
            </button>
            <button
              onClick={() => setSelectedScope("ORGANIZATION")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedScope === "ORGANIZATION"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                  : "text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--text-primary,#FFFFFF)]"
              }`}
            >
              <Building2 size={13} className="text-amber-400" />
              <span>Ariiti Org</span>
            </button>
          </div>
        </div>

        {/* Project Type Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-2 border-b border-white/[0.06]">
          {[
            { id: "all", label: "All Projects", count: counts.all, icon: Layers },
            { id: "completed", label: "Completed Work", count: counts.completed, icon: CheckCircle2 },
            { id: "ongoing", label: "Ongoing Deployments", count: counts.ongoing, icon: Clock },
            { id: "proposed", label: "Approved Proposals", count: counts.proposed, icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = typeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTypeFilter(tab.id as ProjectTypeFilter)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? "bg-[var(--primary-accent,#FFDD9B)] text-[#302E2D] shadow-md shadow-[var(--primary-accent,#FFDD9B)]/20"
                    : "bg-[var(--card-surface,#403C38)]/60 text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--text-primary,#FFFFFF)] hover:bg-[var(--card-surface,#403C38)] border border-white/[0.06]"
                }`}
              >
                <Icon size={14} className={active ? "text-[#302E2D]" : "text-[var(--primary-accent,#FFDD9B)]"} />
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                    active ? "bg-black/15 text-[#302E2D]" : "bg-white/[0.08] text-[var(--text-secondary,#FFF1D8)]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {error ? (
          <div className="text-center py-20 px-8 card-slate rounded-2xl max-w-2xl mx-auto border border-red-500/30">
            <p className="text-xl text-red-400 font-bold mb-3 font-heading">Failed to load projects</p>
            <p className="text-[var(--text-secondary,#FFF1D8)] mb-6 text-sm">{error}</p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2.5 bg-white/[0.06] border border-white/[0.1] text-[var(--text-primary,#FFFFFF)] font-mono text-xs font-bold rounded-lg hover:bg-white/[0.1] transition-all uppercase"
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-28">
            <Loader className="w-8 h-8 animate-spin text-[var(--primary-accent,#FFDD9B)]" />
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-24 card-slate rounded-2xl">
            <p className="text-[var(--text-secondary,#FFF1D8)] font-mono text-sm">
              No projects found matching the selected filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {sorted.map((project, index) => {
              const slides = getSlides(project);
              const isHovered = hoveredId === project._id;
              const isOrg = project.githubSourceScope === "ORGANIZATION";
              const typeBadge = getTypeBadge(project.projectType);
              const TypeIcon = typeBadge.icon;
              const canShowGithub = project.showGithubLink !== false && Boolean(project.githubUrl);

              return (
                <motion.div
                  key={project._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  onMouseEnter={() => setHoveredId(project._id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => {
                    window.location.href = `/project/${project._id}`;
                  }}
                  className={`card-slate rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 cursor-pointer ${
                    isOrg ? "hover:border-amber-500/35" : "hover:border-[var(--primary-accent,#FFDD9B)]/35"
                  }`}
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
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded backdrop-blur-md uppercase tracking-wider ${
                          isOrg
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            : "bg-[var(--primary-accent,#FFDD9B)]/20 text-[var(--primary-accent,#FFDD9B)] border border-[var(--primary-accent,#FFDD9B)]/40"
                        }`}
                      >
                        {isOrg ? "Ariiti Org" : "Personal"}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex flex-col flex-1">
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
