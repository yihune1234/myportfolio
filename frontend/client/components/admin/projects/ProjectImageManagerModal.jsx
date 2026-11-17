import React from "react";
import { Upload, Camera, Star, Trash2, Tag } from "lucide-react";

export function ProjectImageManagerModal({
  projectImages,
  uploadingImages,
  onUploadImages,
  onSetFeatured,
  onDeleteImage,
}) {
  const imageTypes = [
    { id: "overview", label: "Overview" },
    { id: "infrastructure", label: "Infrastructure" },
    { id: "screenshot", label: "UI Screenshot" },
    { id: "installation", label: "Installation" },
    { id: "implementation", label: "Implementation" },
    { id: "before_after", label: "Before / After" },
    { id: "general", label: "General" },
  ];

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-white text-sm">
            Screenshot Gallery ({projectImages.length})
          </h4>
          <p className="text-xs text-[var(--text-secondary,#FFF1D8)]/70 mt-0.5">
            Upload high-resolution screenshots. Select cover image and categorize views.
          </p>
        </div>

        <label className="px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-[#FFDD9B]/20">
          <Upload size={14} />
          <span>{uploadingImages ? "Uploading..." : "Upload Screenshots"}</span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={onUploadImages}
            disabled={uploadingImages}
          />
        </label>
      </div>

      {projectImages.length === 0 ? (
        <div className="py-16 text-center rounded-xl bg-[var(--bg-base,#302E2D)] border border-dashed border-white/[0.08]">
          <Camera className="w-10 h-10 mx-auto text-white/30 mb-2" />
          <p className="text-sm font-bold text-white">No extra screenshots yet</p>
          <p className="text-xs text-[var(--text-secondary,#FFF1D8)]/60 mt-1">
            Upload platform previews, architecture diagrams, or UI captures.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projectImages.map((img) => (
            <div
              key={img._id}
              className="p-3 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] space-y-2 relative group"
            >
              <div className="aspect-video rounded-lg overflow-hidden bg-black/40 relative">
                <img
                  src={img.url}
                  alt={img.title || "Screenshot"}
                  className="w-full h-full object-cover"
                />
                {img.isFeatured && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[var(--primary-accent,#FFDD9B)] text-[#302E2D] text-[9px] font-bold font-mono uppercase">
                    Cover Image
                  </span>
                )}
                {img.imageType && (
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[var(--primary-accent,#FFDD9B)] text-[9px] font-mono uppercase border border-white/10">
                    {img.imageType}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-mono text-[var(--text-secondary,#FFF1D8)] truncate block font-bold">
                    {img.title || "Screenshot"}
                  </span>
                  {img.caption && (
                    <span className="text-[10px] text-white/50 truncate block">
                      {img.caption}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {!img.isFeatured && (
                    <button
                      type="button"
                      onClick={() => onSetFeatured(img._id)}
                      className="p-1.5 rounded-lg hover:bg-white/[0.08] text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--primary-accent,#FFDD9B)]"
                      title="Set as featured cover image"
                    >
                      <Star size={14} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onDeleteImage(img._id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400"
                    title="Delete screenshot"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectImageManagerModal;
