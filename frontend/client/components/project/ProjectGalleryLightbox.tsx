import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Layers,
} from "lucide-react";
import { ProjectImage } from "@/hooks/useProjects";

interface ProjectGalleryLightboxProps {
  allImages: ProjectImage[];
  filteredGallery: ProjectImage[];
  activeImageIndex: number;
  setActiveImageIndex: (index: number) => void;
  isLightboxOpen: boolean;
  setIsLightboxOpen: (open: boolean) => void;
  selectedImageTypeFilter: string;
  setSelectedImageTypeFilter: (filter: string) => void;
  availableImageTypes: string[];
}

export function ProjectGalleryLightbox({
  allImages,
  filteredGallery,
  activeImageIndex,
  setActiveImageIndex,
  isLightboxOpen,
  setIsLightboxOpen,
  selectedImageTypeFilter,
  setSelectedImageTypeFilter,
  availableImageTypes,
}: ProjectGalleryLightboxProps) {
  if (allImages.length === 0) return null;

  return (
    <>
      <div className="space-y-4">
        {/* Gallery Type Filter Tabs */}
        {availableImageTypes.length > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary,#FFF1D8)]/60 mr-2 flex items-center gap-1">
              <Layers size={12} />
              Filter Views:
            </span>
            <button
              onClick={() => setSelectedImageTypeFilter("ALL")}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedImageTypeFilter === "ALL"
                  ? "bg-[var(--primary-accent,#FFDD9B)] text-[#302E2D]"
                  : "bg-white/[0.04] text-[var(--text-secondary,#FFF1D8)] hover:text-white"
              }`}
            >
              All Images ({allImages.length})
            </button>
            {availableImageTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedImageTypeFilter(type)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold capitalize transition-all ${
                  selectedImageTypeFilter === type
                    ? "bg-[var(--primary-accent,#FFDD9B)] text-[#302E2D]"
                    : "bg-white/[0.04] text-[var(--text-secondary,#FFF1D8)] hover:text-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}

        {/* Primary Selected Image Canvas */}
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-[var(--card-surface,#403C38)] border border-white/[0.08] shadow-2xl group">
          <img
            src={allImages[activeImageIndex]?.url}
            alt={allImages[activeImageIndex]?.title || "Project Screenshot"}
            className="w-full h-full object-cover object-top transition-transform duration-700 cursor-zoom-in"
            onClick={() => setIsLightboxOpen(true)}
          />

          {/* Navigation Arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(
                    (activeImageIndex - 1 + allImages.length) % allImages.length
                  );
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/90 transition-all shadow-xl"
                aria-label="Previous screenshot"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((activeImageIndex + 1) % allImages.length);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/90 transition-all shadow-xl"
                aria-label="Next screenshot"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Top Badge: Image Type & Counter */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-[var(--primary-accent,#FFDD9B)] font-bold uppercase tracking-wider border border-white/10">
              {allImages[activeImageIndex]?.imageType || "Overview"} &bull; {activeImageIndex + 1} / {allImages.length}
            </span>
          </div>

          {/* Zoom Button */}
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/70 backdrop-blur-md text-white/80 hover:text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-all"
            title="Expand Fullscreen Lightbox"
          >
            <Maximize2 size={18} />
          </button>

          {/* Caption Overlay */}
          {allImages[activeImageIndex]?.caption && (
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent backdrop-blur-[2px]">
              <p className="text-xs sm:text-sm text-white/90 font-medium max-w-2xl">
                {allImages[activeImageIndex].caption}
              </p>
            </div>
          )}
        </div>

        {/* Thumbnail Carousel Strip */}
        {filteredGallery.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none pt-1">
            {filteredGallery.map((img, idx) => {
              const fullIdx = allImages.findIndex((item) => item.url === img.url);
              const isActive = activeImageIndex === fullIdx;

              return (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(fullIdx !== -1 ? fullIdx : 0)}
                  className={`relative flex-shrink-0 w-24 sm:w-32 aspect-video rounded-xl overflow-hidden border transition-all ${
                    isActive
                      ? "border-[var(--primary-accent,#FFDD9B)] ring-2 ring-[var(--primary-accent,#FFDD9B)]/30 scale-105"
                      : "border-white/[0.08] opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.title || "Thumbnail"}
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Fullscreen Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Lightbox Header */}
          <div className="flex items-center justify-between text-white z-10">
            <span className="text-xs font-mono text-[var(--primary-accent,#FFDD9B)]">
              {allImages[activeImageIndex]?.title || "Gallery View"} ({activeImageIndex + 1} of {allImages.length})
            </span>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Lightbox Center Image */}
          <div
            className="flex-1 flex items-center justify-center p-2 sm:p-6 relative max-h-[82vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={allImages[activeImageIndex]?.url}
              alt={allImages[activeImageIndex]?.title || "Expanded Screenshot"}
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
            />

            {allImages.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImageIndex(
                      (activeImageIndex - 1 + allImages.length) % allImages.length
                    )
                  }
                  className="absolute left-2 sm:left-6 p-3 rounded-full bg-black/60 text-white hover:bg-black/90 transition-all"
                  aria-label="Previous"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() =>
                    setActiveImageIndex((activeImageIndex + 1) % allImages.length)
                  }
                  className="absolute right-2 sm:right-6 p-3 rounded-full bg-black/60 text-white hover:bg-black/90 transition-all"
                  aria-label="Next"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {/* Lightbox Footer Caption */}
          <div className="text-center z-10 max-w-xl mx-auto" onClick={(e) => e.stopPropagation()}>
            {allImages[activeImageIndex]?.caption ? (
              <p className="text-xs sm:text-sm text-white/90 font-medium">
                {allImages[activeImageIndex].caption}
              </p>
            ) : (
              <p className="text-xs text-white/40 font-mono">
                Press Esc or click anywhere outside the image to close.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ProjectGalleryLightbox;
