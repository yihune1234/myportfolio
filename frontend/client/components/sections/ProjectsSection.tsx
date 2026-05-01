import { ExternalLink, Github, Code2, Database, Smartphone, Layout, Loader, Eye, ArrowUpRight } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function ProjectsSection() {
  const { projects, loading } = useProjects();
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const getIconForTech = (tech: string) => {
    const techLower = tech.toLowerCase();
    if (techLower.includes('database') || techLower.includes('postgres') || techLower.includes('mongodb')) return Database;
    if (techLower.includes('mobile') || techLower.includes('react native')) return Smartphone;
    if (techLower.includes('api') || techLower.includes('backend')) return Code2;
    return Layout;
  };

  const getColorForProject = (index: number) => {
    const colors = [
      { bg: "bg-gradient-to-br from-blue-50 to-blue-100", border: "border-blue-300", text: "text-blue-600", icon: "bg-blue-100", accent: "from-blue-500 to-blue-600" },
      { bg: "bg-gradient-to-br from-purple-50 to-purple-100", border: "border-purple-300", text: "text-purple-600", icon: "bg-purple-100", accent: "from-purple-500 to-purple-600" },
      { bg: "bg-gradient-to-br from-emerald-50 to-emerald-100", border: "border-emerald-300", text: "text-emerald-600", icon: "bg-emerald-100", accent: "from-emerald-500 to-emerald-600" },
      { bg: "bg-gradient-to-br from-orange-50 to-orange-100", border: "border-orange-300", text: "text-orange-600", icon: "bg-orange-100", accent: "from-orange-500 to-orange-600" },
    ];
    return colors[index % colors.length];
  };

  return (
    <section id="projects" className="section-padding bg-slate-50 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[20%] right-0 w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[10%] left-0 w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center lg:text-left"
        >
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            Featured Projects
          </h2>
          <div className="h-1.5 w-20 bg-gradient-to-r from-primary to-secondary rounded-full mb-8 mx-auto lg:mx-0"></div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
            A selection of projects I've built, showcasing my expertise in backend systems, API design, mobile development, and full-stack solutions.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-xl text-slate-500">No projects yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project: any, index: number) => {
              const Icon = getIconForTech(project.technologies?.[0] || 'Layout');
              return (
                <motion.div
                  key={project._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white group flex flex-col h-full rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                >
                  {/* Image/Visual Section */}
                  <div className="relative h-64 overflow-hidden bg-slate-50">
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
                        <Icon className="w-20 h-20 opacity-10 text-primary" />
                      </div>
                    )}
                    <div className="absolute top-6 left-6">
                      <div className="p-3 rounded-2xl bg-white shadow-xl border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies?.slice(0, 3).map((tech: string, tIdx: number) => (
                        <span key={tIdx} className="px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-slate-50 border border-slate-100 text-slate-600 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-slate-500 text-sm line-clamp-2 mb-8 leading-relaxed flex-1">
                      {project.description}
                    </p>

                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-primary transition-colors group/btn"
                      >
                        <Eye className="w-4 h-4" />
                        Details
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-all" />
                      </button>
                      <div className="flex gap-3">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-lg hover:border-slate-100 border border-transparent transition-all">
                            <Github className="w-5 h-5" />
                          </a>
                        )}
                        {project.demoUrl && (
                          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-lg hover:border-slate-100 border border-transparent transition-all">
                            <ExternalLink className="w-5 h-5" />
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

        {/* Project Details Modal */}
        <AnimatePresence>
          {selectedProject && (
            <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
              <DialogContent className="max-w-4xl p-0 overflow-hidden border border-slate-100 bg-white rounded-[2.5rem] shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                  <div className="relative h-64 md:h-full overflow-hidden bg-slate-50">
                    {selectedProject.image ? (
                      <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
                        <Database className="w-32 h-32 opacity-10 text-primary" />
                      </div>
                    )}
                  </div>

                  <div className="p-8 md:p-12 overflow-y-auto max-h-[85vh] custom-scrollbar">
                    <DialogHeader className="mb-10 text-left">
                      <div className="flex flex-wrap gap-2 mb-6">
                        {selectedProject.technologies?.map((tech: string, idx: number) => (
                          <span key={idx} className="px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-slate-50 border border-slate-100 text-slate-600">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <DialogTitle className="text-4xl font-black text-slate-900 mb-6 leading-tight">
                        {selectedProject.title}
                      </DialogTitle>
                      <DialogDescription className="text-lg text-slate-600 leading-relaxed">
                        {selectedProject.description}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-8">
                      {selectedProject.challenges && (
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Key Challenges</h4>
                          <p className="text-slate-700 leading-relaxed text-sm">
                            {selectedProject.challenges}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        {selectedProject.githubUrl && (
                          <a
                            href={selectedProject.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                          >
                            <Github className="w-5 h-5" />
                            Source Code
                          </a>
                        )}
                        {selectedProject.demoUrl && (
                          <a
                            href={selectedProject.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 hover:scale-[1.02] transition-all shadow-xl shadow-slate-200"
                          >
                            <ExternalLink className="w-5 h-5" />
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
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
