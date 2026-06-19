import { useState, useCallback, useEffect, useRef } from "react";
import {
  ExternalLink,
  Github,
  Loader,
  Layers,
  Pin,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  ZoomIn,
  X,
  ArrowUpRight,
  Maximize2,
} from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { motion, AnimatePresence } from "framer-motion";

// ─── Auto-Sliding Carousel ───────────────────────────────
function ProjectCardCarousel({ images, title, isHovered, onOpenModal }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const intervalRef = useRef(null);

  const slides = images && images.length > 0 ? images : [];

  // Auto-slide when not hovered
  useEffect(() => {
    if (slides.length <= 1) return;
    if (isHovered) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, slides.length]);

  const goTo = useCallback(
    (index) => {
      if (slides.length === 0) return;
      setCurrentIndex((index + slides.length) % slides.length);
    },
    [slides.length],
  );

  const goNext = useCallback(
    (e?: React.MouseEvent | React.TouchEvent) => {
      e?.stopPropagation();
      goTo(currentIndex + 1);
    },
    [goTo, currentIndex],
  );

  const goPrev = useCallback(
    (e?: React.MouseEvent | React.TouchEvent) => {
      e?.stopPropagation();
      goTo(currentIndex - 1);
    },
    [goTo, currentIndex],
  );

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart - e.changedTouches[0]?.clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  if (slides.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#050816]">
        <Layers className="w-14 h-14 text-[#FF8A00]/15" />
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-[#050816]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentIndex]?.url || slides[currentIndex]}
            alt={slides[currentIndex]?.title || title || "Screenshot"}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/15 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050816]/3 via-transparent to-[#050816]/70 pointer-events-none" />

      {/* Navigation arrows on hover */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-[#FF8A00] hover:text-[#050816] transition-all duration-300 border border-white/[0.08] ${
              isHovered
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-3"
            }`}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={goNext}
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-[#FF8A00] hover:text-[#050816] transition-all duration-300 border border-white/[0.08] ${
              isHovered
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-3"
            }`}
          >
            <ChevronRight size={14} />
          </button>
        </>
      )}

      {/* Image counter */}
      {slides.length > 1 && (
        <div className="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md text-[9px] font-bold text-white/70 border border-white/[0.06]">
          {currentIndex + 1}/{slides.length}
        </div>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                goTo(idx);
              }}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? "w-4 h-1.5 bg-[#FF8A00] shadow-[0_0_6px_rgba(255,138,0,0.6)]"
                  : "w-1.5 h-1.5 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      )}

      {/* Zoom button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenModal(currentIndex);
        }}
        className={`absolute top-3 left-3 z-10 p-1.5 rounded-md bg-black/50 backdrop-blur-sm text-white/70 hover:text-white hover:bg-[#FF8A00]/80 transition-all duration-300 border border-white/[0.06] ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <ZoomIn size={12} />
      </button>
    </div>
  );
}

// ─── Project Detail Modal ─────────────────────────────────
function ProjectDetailModal({ project, slides, onClose }) {
  const [heroIndex, setHeroIndex] = useState(0);
  const [galleryFullscreen, setGalleryFullscreen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (!galleryFullscreen) return;
      if (e.key === "ArrowLeft")
        setGalleryIndex((prev) => (prev - 1 + slides.length) % slides.length);
      if (e.key === "ArrowRight")
        setGalleryIndex((prev) => (prev + 1) % slides.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [galleryFullscreen, slides.length, onClose]);

  const goToHero = (index) =>
    setHeroIndex((index + slides.length) % slides.length);

  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-xl overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="min-h-full w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="fixed top-4 right-4 z-50 p-2.5 rounded-full bg-white/[0.06] backdrop-blur-md text-white hover:bg-red-500/80 transition-all border border-white/[0.08]"
        >
          <X size={20} />
        </button>

        {/* Hero carousel inside modal */}
        {slides.length > 0 && (
          <div className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[65vh] bg-[#0B1637]">
            <AnimatePresence mode="wait">
              <motion.div
                key={heroIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <img
                  src={slides[heroIndex]?.url}
                  alt={slides[heroIndex]?.title || project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Hero arrows */}
            {slides.length > 1 && (
              <>
                <button
                  onClick={() => goToHero(heroIndex - 1)}
                  className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-[#FF8A00] hover:text-[#050816] transition-all border border-white/[0.1]"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => goToHero(heroIndex + 1)}
                  className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-[#FF8A00] hover:text-[#050816] transition-all border border-white/[0.1]"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Hero content overlay */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-5 sm:p-8 lg:p-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
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
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  {project.title}
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-[#B7C0D1] max-w-2xl mt-1 sm:mt-2 line-clamp-2 sm:line-clamp-3">
                  {project.description}
                </p>
              </motion.div>
            </div>

            {/* Counter */}
            {slides.length > 1 && (
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg text-xs font-bold text-white/80 border border-white/[0.08]">
                {heroIndex + 1} / {slides.length}
              </div>
            )}

            {/* Dots */}
            {slides.length > 1 && (
              <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
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
        )}

        {/* Details section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Description */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#F5F7FA] mb-4">
                  About This Project
                </h2>
                <div className="text-sm sm:text-base text-[#B7C0D1] leading-relaxed whitespace-pre-line">
                  {project.description}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-[#0B1637] border border-white/[0.08] rounded-xl p-5 lg:p-6">
                <h3 className="text-xs sm:text-sm font-bold text-[#FF8A00] mb-4 uppercase tracking-wider">
                  Project Info
                </h3>
                <div className="space-y-4">
                  {project.role && (
                    <div>
                      <span className="text-[10px] sm:text-xs font-bold text-[#B7C0D1]/60 uppercase tracking-wider block mb-1">
                        Role
                      </span>
                      <span className="text-sm font-bold text-[#F5F7FA]">{project.role}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] sm:text-xs font-bold text-[#B7C0D1]/60 uppercase tracking-wider block mb-1.5">
                      Technologies
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies?.map((tech, i) => (
                        <span
                          key={i}
                          className="text-[11px] sm:text-xs px-2 py-0.5 bg-[#FF8A00]/10 text-[#FF8A00] rounded-md font-medium border border-[#FF8A00]/20"
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
                    <span className="text-sm font-bold text-[#F5F7FA]">
                      {slides.length} image{slides.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-5 border-t border-white/[0.08] flex flex-col gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 bg-white/[0.05] hover:bg-white/[0.1] text-[#B7C0D1] hover:text-[#F5F7FA] rounded-lg text-xs sm:text-sm font-bold text-center transition-all flex items-center justify-center gap-2"
                    >
                      <Github size={16} />
                      Source Code
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

          {/* Gallery */}
          {slides.length > 0 && (
            <div className="mt-10 sm:mt-14">
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#FF8A00] to-[#FF6B00] flex items-center justify-center flex-shrink-0">
                  <ImageIcon size={16} className="text-[#050816]" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#F5F7FA]">
                    Gallery
                  </h2>
                  <p className="text-xs sm:text-sm text-[#B7C0D1]">
                    {slides.length} screenshot{slides.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                {slides.map((img, index) => (
                  <motion.div
                    key={img._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.3) }}
                    viewport={{ once: true, margin: "-30px" }}
                    className={`relative group cursor-pointer rounded-lg sm:rounded-xl overflow-hidden bg-[#0B1637] border border-white/[0.08] hover:border-[#FF8A00]/30 transition-all duration-500 ${
                      index === 0 && slides.length >= 3 ? "sm:col-span-2" : ""
                    }`}
                    onClick={() => {
                      setGalleryIndex(index);
                      setGalleryFullscreen(true);
                    }}
                  >
                    <div className="aspect-video overflow-hidden">
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
                            <span className="inline-block mt-1 text-[9px] sm:text-[10px] px-1.5 py-0.5 bg-[#FF8A00]/20 text-[#FF8A00] rounded border border-[#FF8A00]/30 font-bold">
                              FEATURED
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-2 bg-[#FF8A00]/90 rounded-full shadow-lg">
                          <ZoomIn size={14} className="text-[#050816]" />
                        </div>
                      </div>
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[9px] font-bold text-[#B7C0D1] border border-white/[0.08]">
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

      {/* Gallery fullscreen */}
      <AnimatePresence>
        {galleryFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/95 backdrop-blur-lg flex items-center justify-center"
            onClick={() => setGalleryFullscreen(false)}
          >
            <div
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={galleryIndex}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full flex items-center justify-center p-3 sm:p-8"
              >
                <img
                  src={slides[galleryIndex]?.url}
                  alt={slides[galleryIndex]?.title || "Preview"}
                  className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
                />
              </motion.div>

              {slides.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setGalleryIndex(
                        (galleryIndex - 1 + slides.length) % slides.length,
                      );
                    }}
                    className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/[0.06] backdrop-blur-md text-white hover:bg-[#FF8A00] hover:text-[#050816] transition-all border border-white/[0.08]"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setGalleryIndex(
                        (galleryIndex + 1) % slides.length,
                      );
                    }}
                    className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/[0.06] backdrop-blur-md text-white hover:bg-[#FF8A00] hover:text-[#050816] transition-all border border-white/[0.08]"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}

              {slides.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    {slides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setGalleryIndex(idx);
                        }}
                        className={`transition-all duration-300 rounded-full ${
                          idx === galleryIndex
                            ? "w-6 h-2 bg-[#FF8A00]"
                            : "w-2 h-2 bg-white/30 hover:bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {slides[galleryIndex]?.title && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/[0.08] max-w-[80%]">
                  <p className="text-sm font-bold text-white truncate">
                    {slides[galleryIndex].title}
                  </p>
                </div>
              )}

              <button
                onClick={() => setGalleryFullscreen(false)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/[0.06] backdrop-blur-md text-white hover:bg-red-500/80 transition-all border border-white/[0.08]"
              >
                <X size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Projects Section ────────────────────────────────
export default function ProjectsSection() {
  const { projects, loading, error, refetch } = useProjects();
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const sorted = [...(projects || [])].sort(
    (a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0),
  );

  const openDetailModal = (project) => {
    document.body.style.overflow = "hidden";
    setSelectedProject(project);
  };

  const closeDetailModal = () => {
    document.body.style.overflow = "";
    setSelectedProject(null);
  };

  const getSlides = (project) =>
    project.images?.length
      ? project.images
      : project.image
      ? [{ url: project.image, title: "Cover Image" }]
      : [];

  return (
    <section
      id="projects"
      className="section-padding relative overflow-hidden bg-background"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF8A00] opacity-[0.03] rounded-full blur-[200px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FFB020] opacity-[0.025] rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 sm:mb-14 text-center"
        >
          <span className="text-[10px] sm:text-xs font-bold text-[#FF8A00]/70 uppercase tracking-[0.35em] font-mono">
            Portfolio Showcase
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F5F7FA] mt-2 mb-3 leading-tight">
            Featured <span className="text-[#FF8A00]">Projects</span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#B7C0D1] max-w-2xl mx-auto leading-relaxed">
            Production-grade systems and applications — from backend
            infrastructure to full-stack platforms.
          </p>
        </motion.div>

        {error ? (
          <div className="text-center py-20 px-8 bg-[#0B1637] border border-white/[0.08] max-w-2xl mx-auto">
            <p className="text-xl text-red-400 font-black mb-4">Failed to load projects</p>
            <p className="text-red-400/70 mb-8 font-medium">{error}</p>
            <button
              onClick={() => refetch()}
              className="px-8 py-3 bg-white/[0.05] border border-white/[0.08] text-[#F5F7FA] font-bold hover:bg-white/[0.1] transition-all tracking-wider uppercase text-sm"
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-28">
            <Loader className="w-8 h-8 animate-spin text-[#FF8A00]" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-28 bg-[#0B1637] border border-white/[0.08]">
            <p className="text-[#B7C0D1] font-medium">No projects yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {sorted.map((project, index) => {
              const slides = getSlides(project);
              const isHovered = hoveredId === project._id;

              return (
                <motion.div
                  key={project._id || index}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  onMouseEnter={() => setHoveredId(project._id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group relative bg-[#0B1637] border border-white/[0.08] hover:border-[#FF8A00]/35 transition-all duration-500 rounded-xl overflow-hidden flex flex-col"
                >
                  {/* Screenshot-focused carousel — takes most of the card */}
                  <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-[#050816]">
                    <ProjectCardCarousel
                      images={slides}
                      title={project.title}
                      isHovered={isHovered}
                      onOpenModal={(index) => {
                        openDetailModal(project);
                      }}
                    />

                    {/* Pinned badge */}
                    {project.pinned && (
                      <div className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2.5 py-1 bg-[#FF8A00] text-[9px] font-black text-[#050816] uppercase tracking-wider rounded-md shadow-lg shadow-[#FF8A00]/30">
                        <Pin size={9} className="fill-current" />
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Card content - compact */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    {/* Title */}
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-[#F5F7FA] group-hover:text-[#FF8A00] transition-colors leading-snug mb-1.5">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#B7C0D1] leading-relaxed line-clamp-2 mb-3 flex-1">
                      {project.description}
                    </p>

                    {/* Tech badges */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.technologies?.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="text-[10px] sm:text-xs px-2 py-0.5 bg-white/[0.05] border border-white/[0.08] rounded text-[#B7C0D1] font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies?.length > 3 && (
                        <span className="text-[10px] sm:text-xs px-2 py-0.5 bg-[#FF8A00]/10 border border-[#FF8A00]/20 rounded text-[#FF8A00] font-medium">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Actions row */}
                    <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
                      <button
                        onClick={() => openDetailModal(project)}
                        className="flex-1 py-2 bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] text-[#050816] rounded-lg text-xs sm:text-sm font-bold hover:shadow-[0_0_20px_rgba(255,138,0,0.3)] transition-all flex items-center justify-center gap-1.5"
                      >
                        View Details
                        <ArrowUpRight size={14} />
                      </button>
                      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white/[0.04] text-[#B7C0D1] hover:text-[#F5F7FA] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg transition-all"
                          >
                            <Github size={14} />
                          </a>
                        )}
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white/[0.04] text-[#B7C0D1] hover:text-[#F5F7FA] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg transition-all"
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

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailModal
            project={selectedProject}
            slides={getSlides(selectedProject)}
            onClose={closeDetailModal}
          />
        )}
      </AnimatePresence>
    </section>
  );
}