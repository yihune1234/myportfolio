import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  ZoomIn,
  Image as ImageIcon,
  Github,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { API_ENDPOINTS, apiFetch } from "@/lib/api";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";

interface ProjectImage {
  _id: string;
  url: string;
  public_id?: string;
  title: string;
  order: number;
  isFeatured: boolean;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  images?: ProjectImage[];
  githubUrl?: string;
  demoUrl?: string;
  role?: string;
  isMini?: boolean;
  pinned?: boolean;
  createdAt: string;
}

export default function ProjectModal() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<ProjectImage | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      setIsModalOpen(true);
      saveScrollPosition();
    } else {
      setIsModalOpen(false);
    }
  }, [id]);

  const slides: ProjectImage[] = project?.images?.length
    ? [...project.images].sort((a, b) => a.order - b.order)
    : project?.image
    ? [{ _id: "cover", url: project.image, title: "Cover Image", order: 0, isFeatured: true }]
    : [];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          closeModal();
        }
      }

      if (!isFullscreen) return;
      if (e.key === "ArrowLeft") {
        setFullscreenIndex((prev) => (prev - 1 + slides.length) % slides.length);
      } else if (e.key === "ArrowRight") {
        setFullscreenIndex((prev) => (prev + 1) % slides.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, slides.length]);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (id) {
        closeModal();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [id]);

  const saveScrollPosition = () => {
    setScrollPosition(window.scrollY);
  };

  const restoreScrollPosition = () => {
    window.scrollTo(0, scrollPosition);
  };

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFetch(API_ENDPOINTS.PROJECTS_GET(id!));
      if (result.success) {
        setProject(result.data);
      } else {
        setError("Failed to fetch project");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("Error fetching project details:", err);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "";
    restoreScrollPosition();
    navigate("/", { replace: true });
  };

  const openFullscreen = (index: number) => {
    setFullscreenIndex(index);
    setIsFullscreen(true);
    document.body.style.overflow = "hidden";
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    document.body.style.overflow = "";
  };

  const handleImageClick = (img: ProjectImage, index: number) => {
    setSelectedImage(img);
    openFullscreen(index);
  };

  const goToHero = useCallback(
    (index: number) => {
      if (slides.length === 0) return;
      setHeroIndex((index + slides.length) % slides.length);
    },
    [slides.length],
  );

  if (loading) {
    return null;
  }

  if (error || !project) {
    return null;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogOverlay className="bg-black/80 backdrop-blur-sm z-[60]" />
      <DialogContent className="bg-[#050816] border-white/[0.08] z-[60] max-w-7xl w-full h-[95vh] overflow-hidden p-0 gap-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top duration-300">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-white/[0.08] bg-[#050816]/95 backdrop-blur-xl sticky top-0 z-10">
            <button
              onClick={closeModal}
              className="flex items-center gap-2 text-[#B7C0D1] hover:text-orange-400 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline text-sm font-medium">Back to Projects</span>
            </button>

            <div className="flex items-center gap-2 sm:gap-3 min-w-0 px-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-[#050816] font-bold text-xs sm:text-sm">P</span>
              </div>
              <span className="font-bold text-[#F5F7FA] text-sm sm:text-base truncate max-w-[140px] sm:max-w-sm">
                {project.title}
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              {project.githubUrl && (
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-[#B7C0D1] hover:text-orange-400 transition-colors"
                  aria-label="GitHub"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github size={18} />
                </motion.a>
              )}
              {project.demoUrl && (
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-[#B7C0D1] hover:text-orange-400 transition-colors"
                  aria-label="Live Demo"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={18} />
                </motion.a>
              )}
              <button
                onClick={closeModal}
                className="p-2 text-[#B7C0D1] hover:text-red-400 transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#F5F7FA] mb-4">
                      About This Project
                    </h2>
                    <div className="text-sm sm:text-base text-[#B7C0D1] leading-relaxed whitespace-pre-line space-y-4">
                      {project.description}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-[#0B1637] border border-white/[0.08] rounded-xl p-4 sm:p-5 lg:p-6">
                    <h3 className="text-xs sm:text-sm font-bold text-[#FF8A00] mb-3 sm:mb-4 uppercase tracking-wider">
                      Project Info
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      {project.role && (
                        <div>
                          <span className="text-[10px] sm:text-xs font-bold text-[#B7C0D1]/60 uppercase tracking-wider block mb-1">
                            Role
                          </span>
                          <span className="text-sm sm:text-base font-bold text-[#F5F7FA]">
                            {project.role}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="text-[10px] sm:text-xs font-bold text-[#B7C0D1]/60 uppercase tracking-wider block mb-1.5">
                          Technologies
                        </span>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {project.technologies?.map((tech, i) => (
                            <span
                              key={i}
                              className="text-[11px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#FF8A00]/10 text-[#FF8A00] rounded-md font-medium border border-[#FF8A00]/20"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] sm:text-xs font-bold text-[#B7C0D1]/60 uppercase tracking-wider block mb-1">
                          Screenshots
                        </span>
                        <span className="text-sm sm:text-base font-bold text-[#F5F7FA]">
                          {slides.length} image{slides.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-white/[0.08] flex flex-col gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 bg-white/[0.05] hover:bg-white/[0.1] text-[#B7C0D1] hover:text-[#F5F7FA] rounded-lg text-xs sm:text-sm font-bold text-center transition-all flex items-center justify-center gap-2"
                        >
                          <Github size={16} />
                          View Source Code
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 bg-[#FF8A00]/10 hover:bg-[#FF8A00] text-[#FF8A00] hover:text-[#050816] rounded-lg text-xs sm:text-sm font-bold text-center transition-all flex items-center justify-center gap-2"
                        >
                          <ExternalLink size={16} />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {slides.length > 0 && (
                <div className="mt-10 sm:mt-14 lg:mt-16">
                  <div className="flex items-center gap-3 mb-5 sm:mb-6 lg:mb-8">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#FF8A00] to-[#FF6B00] flex items-center justify-center flex-shrink-0">
                      <ImageIcon size={16} className="sm:w-[18px] sm:h-[18px] text-[#050816]" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#F5F7FA]">
                        Project Gallery
                      </h2>
                      <p className="text-xs sm:text-sm text-[#B7C0D1]">
                        {slides.length} screenshot{slides.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                    {slides.map((img, index) => (
                      <motion.div
                        key={img._id || index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.3) }}
                        viewport={{ once: true, margin: "-50px" }}
                        className={`relative group cursor-pointer rounded-lg sm:rounded-xl overflow-hidden bg-[#0B1637] border border-white/[0.08] hover:border-[#FF8A00]/30 transition-all duration-500 ${
                          index === 0 && slides.length >= 3
                            ? "sm:col-span-2"
                            : ""
                        }`}
                        onClick={() => handleImageClick(img, index)}
                      >
                        <div className="aspect-video sm:aspect-[16/10] md:aspect-video overflow-hidden">
                          <img
                            src={img.url}
                            alt={img.title || `Screenshot ${index + 1}`}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                              {img.title && (
                                <p className="text-xs sm:text-sm font-bold text-white truncate">
                                  {img.title}
                                </p>
                              )}
                              {img.isFeatured && (
                                <span className="inline-block mt-1 text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 bg-[#FF8A00]/20 text-[#FF8A00] rounded border border-[#FF8A00]/30 font-bold">
                                  FEATURED
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="p-2 sm:p-2.5 bg-[#FF8A00]/90 rounded-full shadow-lg transform group-hover:scale-110 transition-transform">
                              <ZoomIn size={14} className="sm:w-4 sm:h-4 text-[#050816]" />
                            </div>
                          </div>
                          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-1.5 sm:px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[9px] sm:text-[10px] font-bold text-[#B7C0D1] border border-white/[0.08]">
                            #{index + 1}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
