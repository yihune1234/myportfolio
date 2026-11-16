import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Github,
  Loader,
  ArrowUpRight,
  Pin,
  Star,
  GitFork,
  Radio,
  Building2,
  User,
} from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { useQuery } from "@tanstack/react-query";
import { fetchGitHubOverview, GitHubOverview, GitHubRepository } from "@/lib/githubApi";
import { ProjectCardCarousel } from "@/components/ProjectCardCarousel";

export default function ProjectsSection() {
  const { projects, loading, error, refetch } = useProjects();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedScope, setSelectedScope] = useState<"ALL" | "PERSONAL" | "ORGANIZATION">("ALL");

  const { data: githubOverview } = useQuery<GitHubOverview>({
    queryKey: ["github", "overview"],
    queryFn: () => fetchGitHubOverview(),
    staleTime: 5 * 60 * 1000,
  });

  const repoMap = useMemo(() => {
    const map = new Map<string, GitHubRepository>();
    (githubOverview?.featured_repos || []).forEach((r) => {
      map.set(r.html_url.toLowerCase(), r);
      map.set(r.name.toLowerCase(), r);
      map.set(r.full_name.toLowerCase(), r);
    });
    return map;
  }, [githubOverview]);

  const projectList = Array.isArray(projects) ? projects : [];

  const filteredProjects = useMemo(() => {
    return projectList.filter((p) => {
      if (selectedScope === "ALL") return true;
      if (selectedScope === "PERSONAL") {
        return p.githubSourceScope !== "ORGANIZATION";
      }
      if (selectedScope === "ORGANIZATION") {
        return p.githubSourceScope === "ORGANIZATION";
      }
      return true;
    });
  }, [projectList, selectedScope]);

  const sorted = [...filteredProjects].sort(
    (a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)
  );

  const getSlides = (project: any) =>
    project.images?.length
      ? project.images
      : project.image
      ? [{ url: project.image, title: "Cover Image" }]
      : [];

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
        {/* Section Header & Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[11px] font-mono text-[var(--primary-accent,#FFDD9B)] uppercase tracking-[0.25em] font-bold block mb-2">
              Production Portfolio
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[var(--text-primary,#FFFFFF)] tracking-tight font-heading">
              Featured Systems & Applications
            </h2>
            <p className="text-[var(--text-secondary,#FFF1D8)] text-sm sm:text-base max-w-xl leading-relaxed mt-2 font-body">
              Production-grade software platforms, backend microservices, and mobile architectures linked with live repository telemetry.
            </p>
          </div>

          {/* Scope Filters */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] backdrop-blur-md self-start md:self-auto shadow-inner">
            <button
              onClick={() => setSelectedScope("ALL")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedScope === "ALL"
                  ? "bg-white/[0.1] text-[var(--text-primary,#FFFFFF)] border border-white/[0.15] shadow-sm"
                  : "text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--text-primary,#FFFFFF)]"
              }`}
            >
              All Projects ({projectList.length})
            </button>
            <button
              onClick={() => setSelectedScope("PERSONAL")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
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
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
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

        {error ? (
          <div className="text-center py-20 px-8 card-slate rounded-2xl max-w-2xl mx-auto border border-red-500/30">
            <p className="text-xl text-red-400 font-bold mb-3 font-heading">Failed to load projects</p>
            <p className="text-[var(--text-secondary,#FFF1D8)] mb-6 text-sm">{error}</p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2.5 bg-white/[0.06] border border-white/[0.1] text-[var(--text-primary,#FFFFFF)] font-mono text-xs font-bold rounded-lg hover:bg-white/[0.1] transition-all uppercase"
            >
              Retry Query
            </button>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-28">
            <Loader className="w-8 h-8 animate-spin text-emerald-400" />
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-24 card-slate rounded-2xl">
            <p className="text-[var(--text-secondary,#FFF1D8)] font-mono text-sm">
              No projects found for {selectedScope.toLowerCase()} scope. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {sorted.map((project, index) => {
              const slides = getSlides(project);
              const isHovered = hoveredId === project._id;
              const isOrg = project.githubSourceScope === "ORGANIZATION";

              const linkedRepo =
                project.showGithubMetrics !== false
                  ? (project.githubRepoFullName
                      ? repoMap.get(project.githubRepoFullName.toLowerCase())
                      : null) ||
                    (project.githubUrl
                      ? repoMap.get(project.githubUrl.toLowerCase()) ||
                        repoMap.get(
                          project.githubUrl
                            .replace(/\/$/, "")
                            .split("/")
                            .slice(-1)[0]
                            ?.toLowerCase()
                        )
                      : null)
                  : null;

              return (
                <motion.div
                  key={project._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  onMouseEnter={() => setHoveredId(project._id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`card-slate rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 ${
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

                    {/* Ownership Tag */}
                    <div className="absolute top-3 right-3 z-20">
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded backdrop-blur-md uppercase tracking-wider ${
                          isOrg
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            : "bg-[var(--primary-accent,#FFDD9B)]/20 text-[var(--primary-accent,#FFDD9B)] border border-[var(--primary-accent,#FFDD9B)]/40"
                        }`}
                      >
                        {isOrg ? "Ariiti Org" : "Personal Lab"}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary,#FFFFFF)] group-hover:text-[var(--primary-accent,#FFDD9B)] transition-colors leading-snug mb-2 font-heading">
                      {project.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[var(--text-secondary,#FFF1D8)] leading-relaxed line-clamp-2 mb-4 flex-1 font-body">
                      {project.description}
                    </p>

                    {/* Technology Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.technologies?.slice(0, 3).map((tech, i) => (
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

                    {/* Live GitHub Telemetry Overlay */}
                    {linkedRepo && (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-base,#302E2D)]/90 border border-white/[0.06] mb-4 text-xs font-mono text-[var(--text-secondary,#FFF1D8)]">
                        <div className="flex items-center gap-3">
                          {linkedRepo.primary_language && (
                            <span className="flex items-center gap-1.5 text-[var(--text-primary,#FFFFFF)] font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-accent,#FFDD9B)]" />
                              {linkedRepo.primary_language}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-amber-400">
                            <Star size={11} className="fill-amber-400/40" />
                            {linkedRepo.stars}
                          </span>
                          <span className="flex items-center gap-1 text-[var(--text-secondary,#FFF1D8)]">
                            <GitFork size={11} />
                            {linkedRepo.forks}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#64748B]">
                          {new Date(linkedRepo.pushed_at).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    )}

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
                      <button
                        onClick={() => (window.location.href = `/project/${project._id}`)}
                        className="flex-1 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-[var(--bg-base,#302E2D)] rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/15"
                      >
                        <span>View Architecture</span>
                        <ArrowUpRight size={13} />
                      </button>

                      <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-[var(--bg-base,#302E2D)] text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--text-primary,#FFFFFF)] hover:bg-white/[0.06] border border-white/[0.08] rounded-xl transition-all"
                            title="GitHub Repository"
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
