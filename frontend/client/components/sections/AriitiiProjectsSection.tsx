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
  Search,
  X,
  GraduationCap,
} from "lucide-react";
import { useProjects, Project } from "@/hooks/useProjects";
import { ProjectCardCarousel } from "@/components/ProjectCardCarousel";

export default function AriitiiProjectsSection() {
  const { projects, loading, error, refetch } = useProjects("ARIITII_TECH");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
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
      if (selectedCategory !== "ALL" && p.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title?.toLowerCase().includes(q);
        const matchDesc = (p.description || p.shortSummary || "").toLowerCase().includes(q);
        const matchTech = (p.technologies || []).some((t) =>
          t.toLowerCase().includes(q)
        );
        if (!matchTitle && !matchDesc && !matchTech) return false;
      }
      return true;
    });
  }, [projectList, selectedCategory, searchQuery]);

  const sorted = [...filteredProjects].sort(
    (a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)
  );

  const getSlides = (project: Project) =>
    project.images?.length
      ? project.images
      : project.image
      ? [{ url: project.image, title: "Cover Image" }]
      : [];

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
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Building2 size={13} />
              <span>Technology Initiative</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-heading">
              Ariitii Tech
            </h2>
            <p className="text-[var(--text-secondary,#FFF1D8)] text-sm sm:text-base max-w-2xl leading-relaxed mt-2 font-body">
              Digital platforms, marketplace solutions, and engineering initiatives developed under Ariitii Tech.
            </p>
          </div>

          {/* Search Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search
                size={13}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary,#FFF1D8)]/60 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search Ariitii projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] text-xs text-white placeholder-[var(--text-secondary,#FFF1D8)]/50 focus:outline-none focus:border-amber-400 transition-all font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[var(--text-secondary,#FFF1D8)]/60 hover:text-white"
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
                className="px-3 py-2 rounded-xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] text-xs font-mono text-[var(--text-secondary,#FFF1D8)] focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}

            {(searchQuery || selectedCategory !== "ALL") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("ALL");
                }}
                className="px-3 py-2 rounded-xl text-xs font-mono bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.08] transition-all whitespace-nowrap"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Co-Founder Involvement Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--card-surface,#403C38)] border border-amber-500/20 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-amber-500/25 text-amber-400 flex-shrink-0">
              <GraduationCap size={20} />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-[var(--text-secondary,#FFF1D8)] leading-relaxed">
                <strong className="text-white">Ariitii Tech</strong> originated at Haramaya University, established by three co-founders, including me as <strong className="text-amber-300">Co-Founder and Lead</strong>. It focuses on developing scalable software products, digital platforms, and technology-driven solutions for local commerce and enterprise operations.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Co-Founder and Lead
            </span>
          </div>
        </div>

        {/* Content States */}
        {loading ? (
          <div className="py-24 text-center rounded-2xl bg-[var(--card-surface,#403C38)]/50 border border-white/[0.06]">
            <Loader className="w-7 h-7 mx-auto animate-spin text-amber-400 mb-2" />
            <p className="text-xs font-mono text-[var(--text-secondary,#FFF1D8)]">
              Loading Ariitii Tech projects...
            </p>
          </div>
        ) : error ? (
          <div className="p-8 text-center rounded-2xl bg-red-500/10 border border-red-500/20 max-w-md mx-auto space-y-3">
            <p className="text-xs font-mono text-red-300">{error}</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg text-xs font-mono"
            >
              Retry
            </button>
          </div>
        ) : sorted.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-[var(--card-surface,#403C38)]/40 border border-white/[0.06] p-8">
            <p className="text-base font-bold text-white mb-1">No Ariitii projects found</p>
            <p className="text-xs text-[var(--text-secondary,#FFF1D8)]">
              No projects matched your search criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {sorted.map((project) => {
              const slides = getSlides(project);
              const isHovered = hoveredId === project._id;
              const isCompleted = (project.projectType || "completed") === "completed";

              return (
                <motion.div
                  key={project._id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35 }}
                  onMouseEnter={() => setHoveredId(project._id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => {
                    window.location.href = `/project/${project._id}`;
                  }}
                  className="group rounded-2xl bg-[var(--card-surface,#403C38)] hover:bg-[var(--card-elevated,#4A4642)] border border-white/[0.08] hover:border-amber-400/40 overflow-hidden flex flex-col transition-all duration-300 shadow-xl cursor-pointer"
                >
                  {/* Screenshot Frame */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-[var(--bg-base,#302E2D)]">
                    <ProjectCardCarousel
                      images={slides}
                      title={project.title}
                      isHovered={isHovered}
                      onOpenModal={() => {
                        window.location.href = `/project/${project._id}`;
                      }}
                    />

                    {/* Pinned Badge */}
                    {project.pinned && (
                      <div className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2.5 py-1 bg-amber-400 text-[10px] font-mono font-bold text-[#302E2D] uppercase tracking-wider rounded-md shadow-md">
                        <Pin size={10} className="fill-current" />
                        Featured
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3 z-20">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md border ${
                          isCompleted
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle2 size={11} />
                            Completed
                          </>
                        ) : (
                          <>
                            <Clock size={11} />
                            In Progress
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors font-heading mb-2 leading-snug">
                      {project.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[var(--text-secondary,#FFF1D8)] leading-relaxed font-body line-clamp-2 mb-4 flex-1">
                      {project.shortSummary || project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.technologies?.slice(0, 4).map((tech: string, i: number) => (
                        <span
                          key={i}
                          className="text-[11px] font-mono px-2 py-0.5 bg-[var(--bg-base,#302E2D)] border border-white/[0.06] rounded text-[var(--text-secondary,#FFF1D8)]"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies?.length > 4 && (
                        <span className="text-[11px] font-mono px-2 py-0.5 bg-amber-500/10 text-amber-300 rounded">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/project/${project._id}`;
                        }}
                        className="flex-1 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 text-[#302E2D] rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <span>View Project</span>
                        <ArrowUpRight size={13} />
                      </button>

                      <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {project.githubUrl && project.showGithubLink !== false && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-[var(--bg-base,#302E2D)] text-[var(--text-secondary,#FFF1D8)] hover:text-white border border-white/[0.08] hover:border-amber-400/30 rounded-xl transition-all"
                            title="GitHub Source"
                          >
                            <Github size={14} />
                          </a>
                        )}
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-[var(--bg-base,#302E2D)] text-[var(--text-secondary,#FFF1D8)] hover:text-white border border-white/[0.08] hover:border-amber-400/30 rounded-xl transition-all"
                            title="Live Demo"
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
