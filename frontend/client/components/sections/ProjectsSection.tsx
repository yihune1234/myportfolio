import { ExternalLink, Github, Loader, ArrowUpRight, Layers, Pin, Ruler, Crosshair, DraftingCompass } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

export default function ProjectsSection() {
  const { projects, loading, error, refetch } = useProjects();
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const sorted = [...(projects || [])].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <section id="projects" className="section-padding relative overflow-hidden bg-background arch-grid-bg border-t border-white/[0.06]">
      {/* Blueprint glow accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF8A00] opacity-[0.03] rounded-full blur-[200px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FFB020] opacity-[0.025] rounded-full blur-[150px]" />

      {/* Blueprint crosshair decorations */}
      <div className="absolute top-32 left-8 opacity-[0.015] pointer-events-none hidden lg:block">
        <Crosshair className="w-40 h-40 text-[#FF8A00]" strokeWidth={0.5} />
      </div>
      <div className="absolute bottom-32 right-8 opacity-[0.015] pointer-events-none hidden lg:block rotate-45">
        <Crosshair className="w-28 h-28 text-[#FF8A00]" strokeWidth={0.5} />
      </div>
      <div className="absolute top-1/2 right-1/4 opacity-[0.01] pointer-events-none hidden xl:block">
        <DraftingCompass className="w-20 h-20 text-[#FF8A00]" strokeWidth={0.5} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 sm:mb-14"
        >
          <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
            <span className="h-px w-8 bg-[#FF8A00]/50 hidden sm:block" />
            <span className="text-[10px] font-bold text-[#FF8A00]/70 uppercase tracking-[0.35em] font-mono">Architecture // Blueprints</span>
            <span className="h-px w-8 bg-[#FF8A00]/50 hidden sm:block" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F5F7FA] mb-3 text-center lg:text-left">
            Featured<span className="text-[#FF8A00]"> Projects</span>
          </h2>
          <p className="text-[#B7C0D1] text-sm sm:text-base max-w-2xl leading-relaxed mx-auto lg:mx-0">
            Production-grade systems and applications — from backend infrastructure to full-stack platforms.
          </p>
        </motion.div>

        {error ? (
          <div className="text-center py-20 px-8 bg-[#0B1637] border border-white/[0.08] max-w-2xl mx-auto">
            <p className="text-xl text-red-400 font-black mb-4">Failed to load projects</p>
            <p className="text-red-400/70 mb-8 font-medium">{error}</p>
            <button
              onClick={() => refetch()}
              className="px-8 py-3 bg-white/[0.05] border border-white/[0.08] text-[#F5F7FA] font-bold hover:bg-white/[0.1] transition-all font-mono tracking-wider uppercase text-sm"
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader className="w-8 h-8 animate-spin text-[#FF8A00]" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-32 bg-[#0B1637] border border-white/[0.08]">
            <p className="text-[#B7C0D1] font-medium">No projects yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-7">
            {sorted.map((project: any, index: number) => (
              <motion.div
                key={project._id || index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                onClick={() => setSelectedProject(project)}
                className="group relative bg-[#0B1637] border border-white/[0.08] hover:border-[#FF8A00]/35 hover:bg-[#101B45] transition-all duration-500 cursor-pointer flex flex-col"
              >
                {/* Blueprint corner brackets — larger and more visible */}
                <span className="arch-card-bracket-tl group-hover:border-[#FF8A00]/70 transition-colors duration-500" />
                <span className="arch-card-bracket-tr group-hover:border-[#FF8A00]/70 transition-colors duration-500" />
                <span className="arch-card-bracket-bl group-hover:border-[#FF8A00]/70 transition-colors duration-500" />
                <span className="arch-card-bracket-br group-hover:border-[#FF8A00]/70 transition-colors duration-500" />

                {/* Drawing number label */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 bg-[#050816]/80 text-[8px] font-mono font-bold text-[#FF8A00]/50 border border-[#FF8A00]/15 tracking-wider">
                    DRW-{(index + 1).toString().padStart(3, "0")}
                  </span>
                </div>

                {/* Banner Image — Responsive & Prominent */}
                <div className="relative w-full h-56 sm:h-72 md:h-56 lg:h-64 overflow-hidden bg-[#050816] arch-image-frame">
                  {project.image ? (
                    <>
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {/* Gradient overlays for readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/10 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-b from-[#050816]/5 via-transparent to-[#050816]/60" />

                      {/* Measurement ticks on all edges */}
                      <span className="arch-measure-tick-t left-[12.5%]" />
                      <span className="arch-measure-tick-t left-[25%]" />
                      <span className="arch-measure-tick-t left-[37.5%]" />
                      <span className="arch-measure-tick-t left-[50%]" />
                      <span className="arch-measure-tick-t left-[62.5%]" />
                      <span className="arch-measure-tick-t left-[75%]" />
                      <span className="arch-measure-tick-t left-[87.5%]" />

                      <span className="arch-measure-tick-b left-[12.5%]" />
                      <span className="arch-measure-tick-b left-[25%]" />
                      <span className="arch-measure-tick-b left-[37.5%]" />
                      <span className="arch-measure-tick-b left-[50%]" />
                      <span className="arch-measure-tick-b left-[62.5%]" />
                      <span className="arch-measure-tick-b left-[75%]" />
                      <span className="arch-measure-tick-b left-[87.5%]" />

                      <span className="arch-measure-tick-l top-[12.5%]" />
                      <span className="arch-measure-tick-l top-[25%]" />
                      <span className="arch-measure-tick-l top-[37.5%]" />
                      <span className="arch-measure-tick-l top-[50%]" />
                      <span className="arch-measure-tick-l top-[62.5%]" />
                      <span className="arch-measure-tick-l top-[75%]" />
                      <span className="arch-measure-tick-l top-[87.5%]" />

                      <span className="arch-measure-tick-r top-[12.5%]" />
                      <span className="arch-measure-tick-r top-[25%]" />
                      <span className="arch-measure-tick-r top-[37.5%]" />
                      <span className="arch-measure-tick-r top-[50%]" />
                      <span className="arch-measure-tick-r top-[62.5%]" />
                      <span className="arch-measure-tick-r top-[75%]" />
                      <span className="arch-measure-tick-r top-[87.5%]" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Layers className="w-16 h-16 text-[#FF8A00]/10" />
                    </div>
                  )}

                  {/* Pin badge */}
                  {project.pinned && (
                    <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-[#FF8A00] text-[9px] font-black text-[#050816] uppercase tracking-wider shadow-lg shadow-[#FF8A00]/30 font-mono">
                      <Pin size={9} className="fill-current" />
                      FEATURED
                    </div>
                  )}

                  {/* Crosshair center mark on hover */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="relative w-12 h-12">
                      <span className="absolute top-1/2 left-0 right-0 h-px bg-[#FF8A00]/30" />
                      <span className="absolute left-1/2 top-0 bottom-0 w-px bg-[#FF8A00]/30" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#FF8A00]/40" />
                    </div>
                  </div>

                  {/* Spec tags overlay on image — bottom area */}
                  <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5 z-10">
                    {project.technologies?.slice(0, 3).map((tech: string, tIdx: number) => (
                      <span key={tIdx} className="arch-spec-tag">
                        {tech}
                      </span>
                    ))}
                    {project.technologies?.length > 3 && (
                      <span className="arch-spec-tag arch-spec-tag-filled">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  {/* Title with architectural title block */}
                  <div className="relative mb-3">
                    <div className="arch-title-block">
                      <h3 className="text-base sm:text-lg font-black text-[#F5F7FA] group-hover:text-[#FF8A00] transition-colors leading-tight">
                        {project.title}
                      </h3>
                    </div>
                  </div>

                  {/* Technology spec badges — visible and well-spaced */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies?.slice(0, 6).map((tech: string, tIdx: number) => (
                      <span key={tIdx} className="arch-spec-tag">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Description with annotation */}
                  <div className="arch-annotation mb-4 flex-1">
                    <p className="text-sm text-[#B7C0D1] leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  {/* Structural divider with ruler */}
                  <div className="relative pt-4 mt-auto">
                    <div className="absolute top-0 left-0 right-0 arch-divider">
                      <Ruler className="w-3 h-3 text-[#FF8A00]/30 flex-shrink-0" />
                    </div>

                    {/* Links row */}
                    <div className="flex items-center gap-3 pt-3">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-[#B7C0D1] group-hover:text-[#FF8A00] transition-colors font-mono tracking-wider uppercase">
                        View Details
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </span>
                      <div className="ml-auto flex gap-2" onClick={(e) => e.stopPropagation()}>
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-white/[0.03] text-[#B7C0D1] hover:text-[#F5F7FA] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
                            title="View Source Code"
                          >
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-white/[0.03] text-[#B7C0D1] hover:text-[#F5F7FA] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
                            title="Live Demo"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Architectural Detail Dialog */}
        <AnimatePresence>
          {selectedProject && (
            <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
              <DialogContent className="max-w-5xl w-[95vw] p-0 overflow-hidden border border-white/[0.08] bg-[#050816] shadow-2xl shadow-black/60 max-h-[90vh]">
                <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
                  {/* Image Side — Blueprint Framed */}
                  <div className="relative w-full lg:w-[55%] h-56 sm:h-72 md:h-80 lg:h-auto min-h-[260px] lg:min-h-[420px] overflow-hidden bg-[#0B1637] flex-shrink-0">
                    {/* Corner brackets */}
                    <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF8A00]/40 z-20" />
                    <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#FF8A00]/40 z-20" />
                    <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#FF8A00]/40 z-20" />
                    <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF8A00]/40 z-20" />

                    {selectedProject.image ? (
                      <>
                        <img
                          src={selectedProject.image}
                          alt={selectedProject.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#050816]/60" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Layers className="w-24 sm:w-32 h-24 sm:h-32 text-[#FF8A00]/10" />
                      </div>
                    )}

                    {/* Measurement ticks */}
                    <span className="arch-measure-tick-t left-[16.67%] z-20" />
                    <span className="arch-measure-tick-t left-[33.33%] z-20" />
                    <span className="arch-measure-tick-t left-[50%] z-20" />
                    <span className="arch-measure-tick-t left-[66.67%] z-20" />
                    <span className="arch-measure-tick-t left-[83.33%] z-20" />
                    <span className="arch-measure-tick-b left-[16.67%] z-20" />
                    <span className="arch-measure-tick-b left-[33.33%] z-20" />
                    <span className="arch-measure-tick-b left-[50%] z-20" />
                    <span className="arch-measure-tick-b left-[66.67%] z-20" />
                    <span className="arch-measure-tick-b left-[83.33%] z-20" />

                    {/* Pin badge in dialog */}
                    {selectedProject.pinned && (
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-[#FF8A00] text-[9px] font-black text-[#050816] uppercase tracking-wider shadow-lg shadow-[#FF8A00]/30 font-mono z-20">
                        <Pin size={9} className="fill-current" />
                        FEATURED
                      </div>
                    )}

                    {/* Tech badges */}
                    <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5 sm:gap-2 z-10 max-w-[90%]">
                      {selectedProject.technologies?.slice(0, 6).map((tech: string, idx: number) => (
                        <span key={idx} className="arch-spec-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="w-full lg:w-[45%] p-6 sm:p-8 lg:p-10 overflow-y-auto flex flex-col">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col flex-1"
                    >
                      {/* Title */}
                      <div className="relative mb-5">
                        <div className="arch-title-block">
                          <div className="flex items-start gap-3">
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#F5F7FA] leading-[1.1] flex-1">
                              {selectedProject.title}
                            </h2>
                            {selectedProject.pinned && (
                              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FF8A00] text-[9px] font-black text-[#050816] uppercase tracking-wider shadow-lg shadow-[#FF8A00]/30 flex-shrink-0 mt-1 font-mono">
                                <Pin size={9} className="fill-current" />
                                FEATURED
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Spec tags */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {selectedProject.technologies?.map((tech: string, idx: number) => (
                          <span key={idx} className="arch-spec-tag arch-spec-tag-filled">
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Description with annotation */}
                      <div className="arch-annotation mb-6 sm:mb-8">
                        <p className="text-sm sm:text-base text-[#B7C0D1] leading-relaxed">
                          {selectedProject.description}
                        </p>
                      </div>

                      {/* Challenges */}
                      {selectedProject.challenges && (
                        <div className="p-5 bg-[#0B1637] border border-white/[0.08] mb-6 sm:mb-8">
                          <div className="flex items-center gap-2 mb-3">
                            <Ruler className="w-3.5 h-3.5 text-[#FF8A00]" />
                            <h4 className="text-[10px] font-black text-[#FF8A00] uppercase tracking-[0.25em] font-mono">Key Challenges & Solutions</h4>
                          </div>
                          <p className="text-sm text-[#B7C0D1] leading-relaxed">
                            {selectedProject.challenges}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="mt-auto pt-5 border-t border-white/[0.08]">
                        <div className="arch-divider mb-4">
                          <Ruler className="w-3 h-3 text-[#FF8A00]/30 flex-shrink-0" />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                          {selectedProject.githubUrl && (
                            <a
                              href={selectedProject.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-white/[0.05] border border-white/[0.08] text-[#F5F7FA] font-bold hover:bg-white/[0.1] transition-all text-sm font-mono tracking-wider uppercase"
                            >
                              <Github className="w-4 h-4" />
                              <span className="sm:hidden">GitHub</span>
                              <span className="hidden sm:inline">View Source</span>
                            </a>
                          )}
                          {selectedProject.demoUrl && (
                            <a
                              href={selectedProject.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] text-[#050816] font-bold hover:shadow-[0_0_30px_rgba(255,138,0,0.3)] transition-all text-sm font-mono tracking-wider uppercase"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span className="sm:hidden">Demo</span>
                              <span className="hidden sm:inline">Live Demo</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
