import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  Calendar,
  MapPin,
  Building2,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  Wrench,
  Check,
  Compass,
} from "lucide-react";
import { API_ENDPOINTS, apiFetch } from "@/lib/api";
import { Project, ProjectImage } from "@/hooks/useProjects";

export default function ProjectModal() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gallery & Lightbox states
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedImageTypeFilter, setSelectedImageTypeFilter] = useState<string>("ALL");

  useEffect(() => {
    if (id) {
      fetchProjectDetails(id);
    }
  }, [id]);

  const fetchProjectDetails = async (projectId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result: any = await apiFetch(API_ENDPOINTS.PROJECTS_GET(projectId));
      if (result.success && result.data) {
        setProject(result.data as Project);
      } else if (result._id) {
        setProject(result as Project);
      } else {
        setError(result.error || result.message || "This project is currently not available or is undergoing review.");
      }
    } catch (err) {
      setError("This project could not be found or has not been published for public view.");
      console.error("Error fetching project details:", err);
    } finally {
      setLoading(false);
    }
  };

  // Compile full slides gallery
  const allImages: ProjectImage[] = useMemo(() => {
    if (!project) return [];
    if (project.images && project.images.length > 0) {
      return [...project.images].sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    if (project.image) {
      return [
        {
          _id: "cover",
          url: project.image,
          title: project.title,
          caption: "Primary project overview",
          imageType: "overview",
          order: 0,
          isFeatured: true,
        },
      ];
    }
    return [];
  }, [project]);

  // Filtered gallery images
  const filteredGallery = useMemo(() => {
    if (selectedImageTypeFilter === "ALL") return allImages;
    return allImages.filter((img) => img.imageType === selectedImageTypeFilter);
  }, [allImages, selectedImageTypeFilter]);

  // Available image type categories in this project
  const availableImageTypes = useMemo(() => {
    const set = new Set<string>();
    allImages.forEach((img) => {
      if (img.imageType) set.add(img.imageType);
    });
    return Array.from(set);
  }, [allImages]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (e.key === "ArrowLeft") {
        setActiveImageIndex((prev) => (prev - 1 + filteredGallery.length) % filteredGallery.length);
      } else if (e.key === "ArrowRight") {
        setActiveImageIndex((prev) => (prev + 1) % filteredGallery.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, filteredGallery.length]);

  const handleConsultationClick = () => {
    navigate("/", { replace: false });
    setTimeout(() => {
      const contactEl = document.getElementById("contact");
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: "smooth" });
        const subjectInput = document.getElementById("subject") as HTMLInputElement;
        if (subjectInput && project?.title) {
          subjectInput.value = `Inquiry regarding ${project.title}`;
        }
      }
    }, 150);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-base,#302E2D)] flex items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl border-2 border-[var(--primary-accent,#FFDD9B)] border-t-transparent animate-spin mx-auto" />
          <p className="text-sm font-body text-[var(--text-secondary,#FFF1D8)]">
            Loading project presentation...
          </p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[var(--bg-base,#302E2D)] flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 rounded-3xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] shadow-2xl space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-300">
            <AlertCircle size={28} />
          </div>
          <div>
            <h2 className="text-xl font-heading font-black text-white mb-2">
              Project Not Available
            </h2>
            <p className="text-xs text-[var(--text-secondary,#FFF1D8)] leading-relaxed">
              {error || "The project you are looking for is either under administrative review, private, or has been archived."}
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] font-bold text-xs"
          >
            Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  // Format Status Badge
  const projectTypeLabel =
    project.projectType === "proposed"
      ? "Proposed Project"
      : project.projectType === "ongoing"
      ? "Ongoing Deployment"
      : "Completed Project";

  const projectTypeBadgeStyle =
    project.projectType === "proposed"
      ? "bg-purple-500/15 text-purple-300 border-purple-500/30"
      : project.projectType === "ongoing"
      ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
      : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";

  return (
    <div className="min-h-screen bg-[var(--bg-base,#302E2D)] text-[var(--text-primary,#FFFFFF)] font-body selection:bg-[var(--primary-accent,#FFDD9B)] selection:text-[#302E2D]">
      {/* Top Professional Header Bar */}
      <header className="sticky top-0 z-40 bg-[var(--bg-base,#302E2D)]/90 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary,#FFF1D8)] hover:text-white transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Portfolio</span>
          </button>

          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${projectTypeBadgeStyle}`}>
              {projectTypeLabel}
            </span>

            {project.showGithubLink && project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white transition-colors"
                title="View Verified GitHub Repository"
              >
                <Github size={16} />
              </a>
            )}

            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#FFDD9B]/20"
              >
                <span>Live Platform</span>
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 sm:space-y-24">
        {/* A. Project Hero */}
        <section className="space-y-8">
          <div className="space-y-4 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-[var(--primary-accent,#FFDD9B)]">
                {project.category || "Enterprise Solutions"}
              </span>

              {project.clientOrPartner && (
                <>
                  <span className="text-white/30">&bull;</span>
                  <span className="text-xs font-mono text-[var(--text-secondary,#FFF1D8)] flex items-center gap-1">
                    <Building2 size={13} className="text-[var(--primary-accent,#FFDD9B)]" />
                    {project.clientOrPartner}
                  </span>
                </>
              )}

              {project.location && (
                <>
                  <span className="text-white/30">&bull;</span>
                  <span className="text-xs font-mono text-[var(--text-secondary,#FFF1D8)] flex items-center gap-1">
                    <MapPin size={13} className="text-[var(--primary-accent,#FFDD9B)]" />
                    {project.location}
                  </span>
                </>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black text-white tracking-tight leading-[1.1]">
              {project.title}
            </h1>

            <p className="text-base sm:text-xl text-[var(--text-secondary,#FFF1D8)] font-normal leading-relaxed">
              {project.shortSummary || project.description}
            </p>

            {(project.startDate || project.completionDate) && (
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary,#FFF1D8)]/70 pt-1">
                <Calendar size={13} className="text-[var(--primary-accent,#FFDD9B)]" />
                <span>
                  {project.startDate ? `Initiated: ${project.startDate}` : ""}
                  {project.startDate && project.completionDate ? " — " : ""}
                  {project.completionDate ? `Completed: ${project.completionDate}` : "Ongoing Development"}
                </span>
              </div>
            )}
          </div>

          {/* Featured Hero Media */}
          {allImages.length > 0 && (
            <div className="relative rounded-3xl overflow-hidden aspect-video max-h-[580px] w-full bg-[var(--card-surface,#403C38)] border border-white/[0.08] shadow-2xl group">
              <img
                src={allImages[activeImageIndex]?.url || allImages[0].url}
                alt={allImages[activeImageIndex]?.title || project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
              />

              {/* Expand Lightbox Button */}
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute top-4 right-4 p-3 rounded-2xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white transition-all shadow-lg"
                title="View Fullscreen Lightbox"
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
          )}
        </section>

        {/* B. Project Overview & Objectives */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 pt-4 border-t border-white/[0.08]">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[var(--primary-accent,#FFDD9B)] block mb-1">
                Executive Summary
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
                About This Project
              </h2>
            </div>

            <div className="text-sm sm:text-base text-[var(--text-secondary,#FFF1D8)] leading-relaxed space-y-4 whitespace-pre-line font-normal">
              {project.description}
            </div>

            {/* Objectives if provided */}
            {project.objectives && project.objectives.length > 0 && (
              <div className="p-6 rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] space-y-3 mt-6">
                <h3 className="font-heading font-bold text-sm text-[var(--primary-accent,#FFDD9B)] uppercase tracking-wider">
                  Project Objectives
                </h3>
                <ul className="space-y-2">
                  {project.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--text-secondary,#FFF1D8)]">
                      <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Quick Facts Sidebar */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] shadow-xl space-y-5">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--primary-accent,#FFDD9B)]">
                Project Information
              </h3>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-[var(--text-secondary,#FFF1D8)]/60 uppercase tracking-wider block mb-1">
                    Project Category
                  </span>
                  <span className="text-sm font-bold text-white">
                    {project.category || "Enterprise Solutions"}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-[var(--text-secondary,#FFF1D8)]/60 uppercase tracking-wider block mb-1">
                    Status
                  </span>
                  <span className="text-sm font-bold text-white capitalize">
                    {projectTypeLabel}
                  </span>
                </div>

                {project.location && (
                  <div>
                    <span className="text-[10px] text-[var(--text-secondary,#FFF1D8)]/60 uppercase tracking-wider block mb-1">
                      Location
                    </span>
                    <span className="text-sm font-bold text-white">
                      {project.location}
                    </span>
                  </div>
                )}

                {project.clientOrPartner && (
                  <div>
                    <span className="text-[10px] text-[var(--text-secondary,#FFF1D8)]/60 uppercase tracking-wider block mb-1">
                      Organization / Partner
                    </span>
                    <span className="text-sm font-bold text-white">
                      {project.clientOrPartner}
                    </span>
                  </div>
                )}

                {project.role && (
                  <div>
                    <span className="text-[10px] text-[var(--text-secondary,#FFF1D8)]/60 uppercase tracking-wider block mb-1">
                      Key Role
                    </span>
                    <span className="text-sm font-bold text-white">
                      {project.role}
                    </span>
                  </div>
                )}
              </div>

              {/* Inquiry Action */}
              <div className="pt-4 border-t border-white/[0.08]">
                <button
                  onClick={handleConsultationClick}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#FFDD9B]/20 hover:brightness-105 transition-all flex items-center justify-center gap-2"
                >
                  <span>Inquire About This Solution</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* C & D. Problem / Challenge & Solution / Implementation */}
        {(project.challenges || project.proposedSolution) && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/[0.08]">
            {project.challenges && (
              <div className="p-8 rounded-3xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-amber-300">
                  The Problem
                </span>
                <h3 className="text-xl sm:text-2xl font-heading font-black text-white">
                  Background and Challenge
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary,#FFF1D8)] leading-relaxed whitespace-pre-line font-normal">
                  {project.challenges}
                </p>
              </div>
            )}

            {project.proposedSolution && (
              <div className="p-8 rounded-3xl bg-[var(--card-surface,#403C38)] border border-[var(--primary-accent,#FFDD9B)]/20 space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[var(--primary-accent,#FFDD9B)]">
                  The Architecture
                </span>
                <h3 className="text-xl sm:text-2xl font-heading font-black text-white">
                  Solution and Implementation
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary,#FFF1D8)] leading-relaxed whitespace-pre-line font-normal">
                  {project.proposedSolution}
                </p>
              </div>
            )}
          </section>
        )}

        {/* E. Project Gallery (Multiple Images & Lightbox) */}
        {allImages.length > 0 && (
          <section className="space-y-6 pt-4 border-t border-white/[0.08]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[var(--primary-accent,#FFDD9B)] block mb-1">
                  Visual Documentation
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
                  Project Gallery
                </h2>
              </div>

              {/* Gallery Category Filter Chips */}
              {availableImageTypes.length > 1 && (
                <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-[var(--card-surface,#403C38)] border border-white/[0.08]">
                  <button
                    onClick={() => setSelectedImageTypeFilter("ALL")}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      selectedImageTypeFilter === "ALL"
                        ? "bg-[var(--primary-accent,#FFDD9B)] text-[#302E2D]"
                        : "text-[var(--text-secondary,#FFF1D8)] hover:text-white"
                    }`}
                  >
                    All ({allImages.length})
                  </button>
                  {availableImageTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedImageTypeFilter(type)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold capitalize transition-all ${
                        selectedImageTypeFilter === type
                          ? "bg-[var(--primary-accent,#FFDD9B)] text-[#302E2D]"
                          : "text-[var(--text-secondary,#FFF1D8)] hover:text-white"
                      }`}
                    >
                      {type.replace("_", " ")}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Grid of Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGallery.map((img, idx) => (
                <motion.div
                  key={img._id || idx}
                  whileHover={{ y: -4 }}
                  onClick={() => {
                    setActiveImageIndex(allImages.indexOf(img));
                    setIsLightboxOpen(true);
                  }}
                  className="rounded-2xl overflow-hidden bg-[var(--card-surface,#403C38)] border border-white/[0.08] hover:border-[var(--primary-accent,#FFDD9B)]/40 transition-all cursor-pointer group shadow-lg"
                >
                  <div className="aspect-video relative overflow-hidden bg-black/40">
                    <img
                      src={img.url}
                      alt={img.title || "Project Photograph"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white">
                        <ZoomIn size={18} />
                      </span>
                    </div>

                    {img.imageType && img.imageType !== "general" && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[9px] font-mono uppercase font-bold text-[var(--primary-accent,#FFDD9B)]">
                        {img.imageType.replace("_", " ")}
                      </span>
                    )}
                  </div>

                  {(img.title || img.caption) && (
                    <div className="p-4 space-y-1">
                      {img.title && (
                        <h4 className="font-heading font-bold text-sm text-white truncate">
                          {img.title}
                        </h4>
                      )}
                      {img.caption && (
                        <p className="text-xs text-[var(--text-secondary,#FFF1D8)]/80 line-clamp-2">
                          {img.caption}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* F. Technologies & Equipment */}
        {(project.technologies?.length > 0 || project.equipment?.length > 0) && (
          <section className="space-y-6 pt-4 border-t border-white/[0.08]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[var(--primary-accent,#FFDD9B)] block mb-1">
                Tools & Capabilities
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
                Technologies and Equipment Used
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.technologies?.length > 0 && (
                <div className="p-6 rounded-3xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] space-y-3">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--primary-accent,#FFDD9B)]">
                    Software Stack & Frameworks
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.04] text-[var(--text-primary,#FFFFFF)] text-xs font-mono font-bold border border-white/[0.08]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.equipment && project.equipment.length > 0 && (
                <div className="p-6 rounded-3xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] space-y-3">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--primary-accent,#FFDD9B)]">
                    Infrastructure & Hardware Equipment
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.equipment.map((eq, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.04] text-[var(--text-primary,#FFFFFF)] text-xs font-mono font-bold border border-white/[0.08]"
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* G. Results and Achievements */}
        {(project.resultsAndImpact || (project.expectedOutcomes && project.expectedOutcomes.length > 0)) && (
          <section className="space-y-6 pt-4 border-t border-white/[0.08]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-emerald-400 block mb-1">
                Outcomes & Impact
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
                Project Results and Achievements
              </h2>
            </div>

            <div className="p-8 rounded-3xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] space-y-4">
              {project.resultsAndImpact && (
                <p className="text-sm sm:text-base text-[var(--text-secondary,#FFF1D8)] leading-relaxed whitespace-pre-line font-normal">
                  {project.resultsAndImpact}
                </p>
              )}

              {project.expectedOutcomes && project.expectedOutcomes.length > 0 && (
                <div className="pt-4 border-t border-white/[0.06] space-y-2">
                  <span className="text-xs font-mono font-bold text-[var(--primary-accent,#FFDD9B)] uppercase tracking-wider block">
                    Key Deliverables:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.expectedOutcomes.map((outcome, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[var(--text-secondary,#FFF1D8)]">
                        <Check size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* H. Flexible Content Sections */}
        {project.contentSections && project.contentSections.length > 0 && (
          <section className="space-y-6 pt-4 border-t border-white/[0.08]">
            {project.contentSections
              .filter((sec) => sec.isVisible !== false)
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((section, idx) => (
                <div key={section._id || idx} className="p-8 rounded-3xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] space-y-3">
                  <h3 className="text-xl font-heading font-black text-white">
                    {section.title}
                  </h3>
                  <div className="text-sm text-[var(--text-secondary,#FFF1D8)] leading-relaxed whitespace-pre-line font-normal">
                    {section.content}
                  </div>
                </div>
              ))}
          </section>
        )}

        {/* I. Related Published Projects */}
        {project.relatedProjects && project.relatedProjects.length > 0 && (
          <section className="space-y-6 pt-4 border-t border-white/[0.08]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[var(--primary-accent,#FFDD9B)] block mb-1">
                Portfolio Exploration
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
                Related Published Projects
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {project.relatedProjects.map((rel) => (
                <Link
                  key={rel._id}
                  to={`/project/${rel._id}`}
                  className="rounded-2xl overflow-hidden bg-[var(--card-surface,#403C38)] border border-white/[0.08] hover:border-[var(--primary-accent,#FFDD9B)]/40 transition-all flex flex-col group shadow-lg"
                >
                  <div className="aspect-video relative overflow-hidden bg-black/40">
                    <img
                      src={rel.image || rel.images?.[0]?.url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[9px] font-mono uppercase font-bold text-[var(--primary-accent,#FFDD9B)]">
                      {rel.category || "Solutions"}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-heading font-bold text-base text-white group-hover:text-[var(--primary-accent,#FFDD9B)] transition-colors line-clamp-1">
                        {rel.title}
                      </h4>
                      <p className="text-xs text-[var(--text-secondary,#FFF1D8)] line-clamp-2 mt-1">
                        {rel.shortSummary || rel.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-mono font-bold text-[var(--primary-accent,#FFDD9B)] pt-2">
                      <span>Explore Project</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* J. Professional Call to Action */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#403C38] via-[#3A3836] to-[#302E2D] border border-[var(--primary-accent,#FFDD9B)]/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--primary-accent,#FFDD9B)]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-[var(--primary-accent,#FFDD9B)]">
              Partner with Ariiti Tech
            </span>
            <h2 className="text-2xl sm:text-4xl font-heading font-black text-white tracking-tight">
              Interested in a Similar Solution?
            </h2>
            <p className="text-xs sm:text-base text-[var(--text-secondary,#FFF1D8)] leading-relaxed font-normal">
              Whether you need scalable enterprise backend systems, custom commerce platforms, or modern mobile architectures, we are ready to discuss your requirements.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10 pt-2">
            <button
              onClick={handleConsultationClick}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] font-bold text-xs uppercase tracking-wider shadow-xl shadow-[#FFDD9B]/20 hover:scale-102 active:scale-98 transition-all flex items-center gap-2"
            >
              <span>Request a Consultation</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => navigate("/")}
              className="px-6 py-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] font-bold text-xs uppercase tracking-wider transition-all"
            >
              Explore More Work
            </button>
          </div>
        </section>
      </main>

      {/* Lightbox Modal (Fullscreen Image Viewer) */}
      <AnimatePresence>
        {isLightboxOpen && allImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-5 right-5 p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white z-50 transition-colors"
              title="Close (Esc)"
            >
              <X size={20} />
            </button>

            {/* Prev Image */}
            {allImages.length > 1 && (
              <button
                onClick={() =>
                  setActiveImageIndex(
                    (prev) => (prev - 1 + allImages.length) % allImages.length
                  )
                }
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white z-50 transition-colors"
                title="Previous Image (Left Arrow)"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Image Preview */}
            <div className="max-w-5xl max-h-[85vh] flex flex-col items-center justify-center space-y-4">
              <img
                src={allImages[activeImageIndex]?.url}
                alt={allImages[activeImageIndex]?.title || project.title}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
              />

              {allImages[activeImageIndex]?.caption && (
                <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-center max-w-xl">
                  <p className="text-xs sm:text-sm text-white font-medium">
                    {allImages[activeImageIndex].caption}
                  </p>
                  <span className="text-[10px] font-mono text-white/50 block mt-1">
                    Image {activeImageIndex + 1} of {allImages.length}
                  </span>
                </div>
              )}
            </div>

            {/* Next Image */}
            {allImages.length > 1 && (
              <button
                onClick={() =>
                  setActiveImageIndex((prev) => (prev + 1) % allImages.length)
                }
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white z-50 transition-colors"
                title="Next Image (Right Arrow)"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
