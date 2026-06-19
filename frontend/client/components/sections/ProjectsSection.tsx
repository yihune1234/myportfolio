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



// ─── Main Projects Section ────────────────────────────────
export default function ProjectsSection() {
  const { projects, loading, error, refetch } = useProjects();
  const [hoveredId, setHoveredId] = useState(null);

  const sorted = [...(projects || [])].sort(
    (a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0),
  );

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
                        window.location.href = `/project/${project._id}`;
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
                        onClick={() => window.location.href = `/project/${project._id}`}
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
    </section>
  );
}