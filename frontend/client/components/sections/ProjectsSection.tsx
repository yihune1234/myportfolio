import { ExternalLink, Github, Loader, ArrowUpRight, Layers, Pin, Code2, Server, Zap, ChevronRight } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

const projectIcons = [Code2, Server, Zap, Layers];

export default function ProjectsSection() {
  const { projects, loading, error, refetch } = useProjects();
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const sorted = [...(projects || [])].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <section id="projects" className="section-padding relative overflow-hidden bg-background border-t border-white/[0.06]">
      {/* Top right orange glow */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#FF8A00] opacity-[0.05] rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 -left-32 w-[300px] h-[300px] bg-[#FFB020] opacity-[0.04] rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 sm:mb-16 text-center lg:text-left"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F5F7FA] mb-4">
            Featured Projects
          </h2>
          <p className="text-[#B7C0D1] text-sm sm:text-base max-w-2xl leading-relaxed mx-auto lg:mx-0">
            Production-grade systems and applications — from backend infrastructure to full-stack platforms.
          </p>
        </motion.div>

        {error ? (
          <div className="text-center py-20 px-8 bg-[#0B1637] rounded-2xl border border-white/[0.08] max-w-2xl mx-auto">
            <p className="text-xl text-red-400 font-black mb-4">Failed to load projects</p>
            <p className="text-red-400/70 mb-8 font-medium">{error}</p>
            <button
              onClick={() => refetch()}
              className="px-8 py-3 bg-white/[0.05] border border-white/[0.08] text-[#F5F7FA] rounded-xl font-bold hover:bg-white/[0.1] transition-all"
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader className="w-8 h-8 animate-spin text-[#FF8A00]" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-32 bg-[#0B1637] rounded-2xl border border-white/[0.08]">
            <p className="text-[#B7C0D1] font-medium">No projects yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {sorted.map((project: any, index: number) => {
              const Icon = projectIcons[index % projectIcons.length];
              return (
                <motion.div
                  key={project._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  onClick={() => setSelectedProject(project)}
                  className="group relative bg-[#0B1637] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-[#FF8A00]/25 hover:bg-[#101B45] transition-all duration-500 cursor-pointer flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-48 sm:h-52 overflow-hidden bg-[#050816]">
                    {project.image ? (
                      <>
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/30 to-transparent" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon className="w-16 h-16 text-[#FF8A00]/10" />
                      </div>
                    )}
                    {/* Pin badge */}
                    {project.pinned && (
                      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-br from-[#FF8A00] to-[#FF6B00] text-[9px] font-black text-[#050816] uppercase tracking-wider shadow-lg shadow-[#FF8A00]/30">
                        <Pin size={10} className="fill-current" />
                        <span className="hidden sm:inline">Featured</span>
                      </div>
                    )}
                    {/* Top-left icon badge */}
                    <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-[#050816]/60 backdrop-blur-md border border-white/[0.08]">
                      <Icon className="w-4 h-4 text-[#FF8A00]" />
                    </div>
                    {/* Tech tags overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5">
                      {project.technologies?.slice(0, 3).map((tech: string, tIdx: number) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 rounded-lg bg-[#050816]/70 backdrop-blur-md border border-white/[0.08] text-[10px] font-bold uppercase tracking-wider text-[#D5D9E3]"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies?.length > 3 && (
                        <span className="px-2.5 py-1 rounded-lg bg-[#050816]/70 backdrop-blur-md border border-white/[0.08] text-[10px] font-bold text-[#B7C0D1]">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <h3 className="text-base sm:text-lg font-black text-[#F5F7FA] mb-2 group-hover:text-[#FF8A00] transition-colors leading-tight">
                      {project.title}
                    </h3>
                    <p className="text-sm text-[#B7C0D1] leading-relaxed line-clamp-3 mb-4 flex-1">
                      {project.description}
                    </p>

                    {/* Links row */}
                    <div className="flex items-center gap-3 pt-4 border-t border-white/[0.08]">
                      <span className="flex items-center gap-1.5 text-sm font-bold text-[#B7C0D1] group-hover:text-[#FF8A00] transition-colors">
                        View Details
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </span>
                      <div className="ml-auto flex gap-2" onClick={(e) => e.stopPropagation()}>
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-white/[0.03] text-[#B7C0D1] hover:text-[#F5F7FA] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
                            title="View Source Code"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-white/[0.03] text-[#B7C0D1] hover:text-[#F5F7FA] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
                            title="Live Demo"
                          >
                            <ExternalLink className="w-4 h-4" />
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

        {/* Premium Detail Dialog */}
        <AnimatePresence>
          {selectedProject && (
            <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
              <DialogContent className="max-w-5xl w-[95vw] p-0 overflow-hidden border border-white/[0.08] bg-[#050816] rounded-2xl shadow-2xl shadow-black/60 max-h-[90vh]">
                <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
                  {/* Image Side */}
                  <div className="relative w-full lg:w-[55%] h-56 sm:h-72 md:h-80 lg:h-auto min-h-[240px] lg:min-h-[400px] overflow-hidden bg-[#0B1637] flex-shrink-0">
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
                      {/* Pin badge in dialog */}
                      {selectedProject.pinned && (
                        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-br from-[#FF8A00] to-[#FF6B00] text-[9px] font-black text-[#050816] uppercase tracking-wider shadow-lg shadow-[#FF8A00]/30">
                          <Pin size={10} className="fill-current" />
                          Featured
                        </div>
                      )}
                      {/* Tech badges on image */}
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 flex flex-wrap gap-1.5 sm:gap-2">
                      {selectedProject.technologies?.slice(0, 5).map((tech: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 sm:px-3 py-1 rounded-lg bg-[#050816]/70 backdrop-blur-md border border-white/[0.08] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#D5D9E3]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="w-full lg:w-[45%] p-5 sm:p-6 lg:p-8 overflow-y-auto flex flex-col">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col flex-1"
                    >
                      {/* Title */}
                      <div className="flex items-start gap-3 mb-3 sm:mb-4">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#F5F7FA] leading-[1.1] flex-1">
                          {selectedProject.title}
                        </h2>
                        {selectedProject.pinned && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-br from-[#FF8A00] to-[#FF6B00] text-[9px] font-black text-[#050816] uppercase tracking-wider shadow-lg shadow-[#FF8A00]/30 flex-shrink-0 mt-1">
                            <Pin size={10} className="fill-current" />
                            Featured
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-sm sm:text-base text-[#B7C0D1] leading-relaxed mb-6 sm:mb-8">
                        {selectedProject.description}
                      </p>

                      {/* Challenges */}
                      {selectedProject.challenges && (
                        <div className="p-4 sm:p-5 rounded-xl bg-[#0B1637] border border-white/[0.08] mb-6 sm:mb-8">
                          <h4 className="text-[10px] font-black text-[#FF8A00] uppercase tracking-[0.25em] mb-2 sm:mb-3">Key Challenges & Solutions</h4>
                          <p className="text-sm text-[#B7C0D1] leading-relaxed">
                            {selectedProject.challenges}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="mt-auto flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/[0.08]">
                        {selectedProject.githubUrl && (
                          <a
                            href={selectedProject.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-white/[0.05] border border-white/[0.08] text-[#F5F7FA] rounded-xl font-bold hover:bg-white/[0.1] transition-all text-sm"
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
                            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] text-[#050816] rounded-xl font-bold hover:shadow-[0_0_30px_rgba(255,138,0,0.3)] transition-all text-sm"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span className="sm:hidden">Demo</span>
                            <span className="hidden sm:inline">Live Demo</span>
                          </a>
                        )}
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