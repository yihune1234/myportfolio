import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<ProjectImage | null>(null);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      if (e.key === "ArrowLeft") {
        setFullscreenIndex((prev) => (prev - 1 + slides.length) % slides.length);
      } else if (e.key === "ArrowRight") {
        setFullscreenIndex((prev) => (prev + 1) % slides.length);
      } else if (e.key === "Escape") {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

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

  const slides: ProjectImage[] = project?.images?.length
    ? [...project.images].sort((a, b) => a.order - b.order)
    : project?.image
    ? [{ _id: "cover", url: project.image, title: "Cover Image", order: 0, isFeatured: true }]
    : [];

  const goToHero = useCallback(
    (index: number) => {
      if (slides.length === 0) return;
      setHeroIndex((index + slides.length) % slides.length);
    },
    [slides.length],
  );

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="text-center px-4">
          <div className="animate-spin rounded-full h-12 sm:h-16 w-12 sm:w-16 border-b-2 border-orange-500 mx-auto mb-4" />
          <p className="text-sm sm:text-base text-[#B7C0D1]">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle size={40} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-[#F5F7FA] mb-2">Error</h2>
          <p className="text-sm sm:text-base text-[#B7C0D1] mb-6">{error || "Project not found."}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-[#050816] rounded-lg font-bold text-sm mx-auto"
          >
            <ArrowLeft size={16} />
            Go Back
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816]">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050816]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-[#B7C0D1] hover:text-orange-400 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline text-sm font-medium">Back</span>
            </motion.button>

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
                >
                  <ExternalLink size={18} />
                </motion.a>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-14 sm:pt-16">
        {/* ===== HERO CAROUSEL ===== */}
        {slides.length > 0 && (
          <div className="relative bg-[#0B1637]">
            <div className="relative w-full h-[45vh] sm:h-[55vh] md:h-[65vh] lg:h-[75vh] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <img
                    src={slides[heroIndex]?.url}
                    alt={slides[heroIndex]?.title || project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#050816]/40 via-transparent to-[#050816]/40" />
                </motion.div>
              </AnimatePresence>

              {/* Hero Nav Arrows */}
              {slides.length > 1 && (
                <>
                  <button
                    onClick={() => goToHero(heroIndex - 1)}
                    className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-[#FF8A00] hover:text-[#050816] transition-all border border-white/[0.1] hover:shadow-lg hover:shadow-[#FF8A00]/20"
                  >
                    <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => goToHero(heroIndex + 1)}
                    className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-[#FF8A00] hover:text-[#050816] transition-all border border-white/[0.1] hover:shadow-lg hover:shadow-[#FF8A00]/20"
                  >
                    <ChevronRight size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </>
              )}

              {/* Hero Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-4 sm:p-6 md:p-8 lg:p-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="max-w-4xl"
                >
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                    {project.technologies?.slice(0, 4).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white/[0.08] backdrop-blur-sm border border-white/[0.12] rounded-full text-[10px] sm:text-xs text-[#B7C0D1]"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies?.length > 4 && (
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-[#FF8A00]/10 backdrop-blur-sm border border-[#FF8A00]/20 rounded-full text-[10px] sm:text-xs text-[#FF8A00]">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                    {project.title}
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base text-[#B7C0D1] max-w-2xl mt-1 sm:mt-2 line-clamp-1 sm:line-clamp-2 md:line-clamp-3">
                    {project.description}
                  </p>
                </motion.div>
              </div>

              {/* Hero Controls */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-6 lg:right-6 z-20 flex items-center gap-2">
                {slides.length > 1 && (
                  <div className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-black/60 backdrop-blur-sm rounded-lg text-[10px] sm:text-xs font-bold text-[#B7C0D1] border border-white/[0.08]">
                    {heroIndex + 1} / {slides.length}
                  </div>
                )}
                <button
                  onClick={() => openFullscreen(heroIndex)}
                  className="p-1.5 sm:p-2 bg-black/60 backdrop-blur-sm rounded-lg border border-white/[0.08] text-white/70 hover:text-white hover:bg-[#FF8A00]/80 transition-all"
                >
                  <Maximize2 size={14} className="sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Hero Dots */}
              {slides.length > 1 && (
                <div className="absolute bottom-2 sm:bottom-3 lg:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToHero(idx)}
                      className={`transition-all duration-300 rounded-full ${
                        idx === heroIndex
                          ? "w-5 sm:w-6 h-1.5 sm:h-2 bg-[#FF8A00] shadow-[0_0_8px_rgba(255,138,0,0.5)]"
                          : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/40 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== PROJECT DETAILS SECTION ===== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Description - 2/3 width */}
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

            {/* Sidebar - 1/3 width */}
            <div className="space-y-4 sm:space-y-6">
              {/* Project Info Card */}
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

                {/* Action Buttons */}
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

          {/* ===== GALLERY SECTION ===== */}
          {slides.length > 0 && (
            <div className="mt-10 sm:mt-14 lg:mt-16">
              {/* Gallery Header */}
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

              {/* Gallery Grid - Responsive Masonry */}
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
                      {/* Hover overlay */}
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
                      {/* Zoom icon */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="p-2 sm:p-2.5 bg-[#FF8A00]/90 rounded-full shadow-lg transform group-hover:scale-110 transition-transform">
                          <ZoomIn size={14} className="sm:w-4 sm:h-4 text-[#050816]" />
                        </div>
                      </div>
                      {/* Badge */}
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

      {/* ===== FULLSCREEN MODAL ===== */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-lg flex items-center justify-center"
            onClick={closeFullscreen}
          >
            <div
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={fullscreenIndex}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full flex items-center justify-center p-3 sm:p-6 md:p-10"
              >
                <img
                  src={slides[fullscreenIndex]?.url}
                  alt={slides[fullscreenIndex]?.title || "Fullscreen preview"}
                  className="max-w-full max-h-[85vh] sm:max-h-[90vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
                />
              </motion.div>

              {/* Fullscreen nav */}
              {slides.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFullscreenIndex(
                        (fullscreenIndex - 1 + slides.length) % slides.length,
                      );
                    }}
                    className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/[0.06] backdrop-blur-md text-white hover:bg-[#FF8A00] hover:text-[#050816] transition-all border border-white/[0.08] hover:shadow-lg hover:shadow-[#FF8A00]/20"
                  >
                    <ChevronLeft size={22} className="sm:w-6 sm:h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFullscreenIndex(
                        (fullscreenIndex + 1) % slides.length,
                      );
                    }}
                    className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/[0.06] backdrop-blur-md text-white hover:bg-[#FF8A00] hover:text-[#050816] transition-all border border-white/[0.08] hover:shadow-lg hover:shadow-[#FF8A00]/20"
                  >
                    <ChevronRight size={22} className="sm:w-6 sm:h-6" />
                  </button>
                </>
              )}

              {/* Fullscreen dots */}
              {slides.length > 1 && (
                <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 sm:px-4 py-2 rounded-full border border-white/[0.08]">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {slides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setFullscreenIndex(idx);
                        }}
                        className={`transition-all duration-300 rounded-full ${
                          idx === fullscreenIndex
                            ? "w-5 sm:w-6 h-1.5 sm:h-2 bg-[#FF8A00]"
                            : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/30 hover:bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Image title */}
              {slides[fullscreenIndex]?.title && (
                <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-white/[0.08] max-w-[80%]">
                  <p className="text-xs sm:text-sm font-bold text-white truncate">
                    {slides[fullscreenIndex].title}
                  </p>
                </div>
              )}

              {/* Close */}
              <button
                onClick={closeFullscreen}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-6 lg:right-6 p-2 sm:p-2.5 rounded-full bg-white/[0.06] backdrop-blur-md text-white hover:bg-red-500/80 transition-all border border-white/[0.08]"
                aria-label="Close fullscreen"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}