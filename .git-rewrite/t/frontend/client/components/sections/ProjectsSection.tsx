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
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-blue-50 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Featured Projects
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6"></div>
          <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
            A selection of projects I've built, showcasing my expertise in backend systems, API design, mobile development, and full-stack solutions.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-32 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xl text-slate-600">No projects yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project: any, index: number) => {
              const Icon = getIconForTech(project.technologies?.[0] || 'Layout');
              const theme = getColorForProject(index);
              return (
                <motion.div
                  key={project._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`group rounded-xl overflow-hidden flex flex-col h-full border-2 ${theme.border} bg-white hover:shadow-2xl hover:shadow-blue-500/20 transition-all hover:-translate-y-1`}
                >
                  {/* Image/Visual Section */}
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${theme.bg}`}>
                        <Icon className={`w-20 h-20 opacity-30 ${theme.text}`} />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <div className={`p-2 rounded-lg ${theme.icon}`}>
                        <Icon className={`w-5 h-5 ${theme.text}`} />
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies?.slice(0, 2).map((tech: string, tIdx: number) => (
                        <span key={tIdx} className={`px-2 py-1 rounded text-xs font-bold bg-gradient-to-r ${theme.accent} text-white`}>
                          {tech}
                        </span>
                      ))}
                      {project.technologies?.length > 2 && (
                        <span className="px-2 py-1 rounded text-xs font-bold bg-slate-100 text-slate-600">
                          +{project.technologies.length - 2}
                        </span>
                      )}
                    </div>

                    <h3 className={`text-xl font-black text-slate-900 mb-3 group-hover:${theme.text} transition-colors`}>
                      {project.title}
                    </h3>

                    <p className="text-slate-600 text-sm line-clamp-2 mb-6 leading-relaxed flex-1">
                      {project.description}
                    </p>

                    <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className={`flex items-center gap-2 text-sm font-bold ${theme.text} hover:opacity-80 transition-opacity`}
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <div className="flex gap-2">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-gradient-to-r hover:${theme.accent} hover:text-white transition-all`}>
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {project.demoUrl && (
                          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-gradient-to-r hover:${theme.accent} hover:text-white transition-all`}>
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

        {/* Project Details Modal */}
        <AnimatePresence>
          {selectedProject && (
            <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
              <DialogContent className="max-w-4xl p-0 overflow-hidden border-none bg-white rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative h-64 md:h-full overflow-hidden bg-slate-100">
                    {selectedProject.image ? (
                      <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100">
                        <Database className="w-32 h-32 opacity-20 text-slate-400" />
                      </div>
                    )}
                  </div>

                  <div className="p-8 md:p-12 overflow-y-auto max-h-[80vh]">
                    <DialogHeader className="mb-8">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedProject.technologies?.map((tech: string, idx: number) => (
                          <span key={idx} className="px-3 py-1 rounded text-xs font-bold bg-blue-50 text-blue-600">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <DialogTitle className="text-3xl font-black text-slate-900 mb-4">
                        {selectedProject.title}
                      </DialogTitle>
                      <DialogDescription className="text-base text-slate-600 leading-relaxed">
                        {selectedProject.description}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                      {selectedProject.challenges && (
                        <div>
                          <h4 className="text-lg font-bold text-slate-900 mb-2">Key Challenges</h4>
                          <p className="text-slate-600 leading-relaxed">
                            {selectedProject.challenges}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-200">
                        {selectedProject.githubUrl && (
                          <a
                            href={selectedProject.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-900 rounded-lg font-bold hover:bg-slate-200 transition-all"
                          >
                            <Github className="w-4 h-4" />
                            GitHub
                          </a>
                        )}
                        {selectedProject.demoUrl && (
                          <a
                            href={selectedProject.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Demo
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
