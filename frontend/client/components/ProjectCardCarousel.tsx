import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Layers, ZoomIn } from "lucide-react";

export interface ProjectCardCarouselProps {
  images?: any[];
  title?: string;
  isHovered?: boolean;
  onOpenModal?: (index: number) => void;
}

export function ProjectCardCarousel({
  images,
  title,
  isHovered = false,
  onOpenModal,
}: ProjectCardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const slides = Array.isArray(images) && images.length > 0 ? images : [];

  // Auto-slide when not hovered
  useEffect(() => {
    if (slides.length <= 1) return;
    if (isHovered) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3200);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, slides.length]);

  const goTo = useCallback(
    (index: number) => {
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
      <div className="w-full h-full flex items-center justify-center bg-[var(--bg-base,#302E2D)]">
        <Layers className="w-12 h-12 text-[var(--text-secondary,#FFF1D8)]/20" />
      </div>
    );
  }

  const currentSlide = slides[currentIndex];
  const imageUrl = typeof currentSlide === "string" ? currentSlide : currentSlide?.url;
  const imageAlt = typeof currentSlide === "string" ? title || "Screenshot" : currentSlide?.title || title || "Screenshot";

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-[var(--bg-base,#302E2D)]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[var(--bg-base,#302E2D)]">
              <Layers className="w-10 h-10 text-emerald-500/20" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Architectural subtle gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0E131F] via-[#07090E]/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#07090E]/60 via-transparent to-transparent pointer-events-none" />

      {/* Navigation arrows on hover */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className={`absolute left-2.5 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-lg bg-[var(--bg-base,#302E2D)]/80 backdrop-blur-md text-[var(--text-primary,#FFFFFF)] hover:bg-emerald-500 hover:text-[var(--bg-base,#302E2D)] transition-all duration-200 border border-white/10 ${
              isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"
            }`}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            onClick={goNext}
            className={`absolute right-2.5 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-lg bg-[var(--bg-base,#302E2D)]/80 backdrop-blur-md text-[var(--text-primary,#FFFFFF)] hover:bg-emerald-500 hover:text-[var(--bg-base,#302E2D)] transition-all duration-200 border border-white/10 ${
              isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"
            }`}
          >
            <ChevronRight size={14} />
          </button>
        </>
      )}

      {/* Image counter */}
      {slides.length > 1 && (
        <div className="absolute top-3 right-3 z-10 bg-[var(--bg-base,#302E2D)]/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-mono font-bold text-[var(--text-secondary,#FFF1D8)] border border-white/10">
          {currentIndex + 1}/{slides.length}
        </div>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
          {slides.map((_, idx) => (
            <button
              type="button"
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                goTo(idx);
              }}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? "w-4 h-1 bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.7)]"
                  : "w-1 h-1 bg-white/20 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      )}

      {/* Zoom / Fullscreen preview trigger */}
      {onOpenModal && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal(currentIndex);
          }}
          className={`absolute top-3 left-3 z-10 p-1.5 rounded-lg bg-[var(--bg-base,#302E2D)]/80 backdrop-blur-md text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--bg-base,#302E2D)] hover:bg-emerald-400 transition-all duration-200 border border-white/10 ${
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          title="Inspect details"
        >
          <ZoomIn size={12} />
        </button>
      )}
    </div>
  );
}
