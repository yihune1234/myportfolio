import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Calendar,
  Building2,
  MapPin,
  AlertCircle,
  Briefcase,
  Layers,
} from "lucide-react";
import { Project, ProjectImage } from "@/hooks/useProjects";
import { API_ENDPOINTS, apiFetch } from "@/lib/api";
import { ProjectGalleryLightbox } from "@/components/project/ProjectGalleryLightbox";
import { ProjectOverviewSidebar } from "@/components/project/ProjectOverviewSidebar";
import { ProjectDetailedSections } from "@/components/project/ProjectDetailedSections";

export default function ProjectModal() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gallery & Lightbox State
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
    const list: ProjectImage[] = [];

    if (project.image) {
      list.push({
        _id: "cover-primary",
        url: project.image,
        title: project.title,
        caption: "Primary project visual architecture",
        imageType: "overview",
        isFeatured: true,
        order: 0,
      });
    }

    if (project.images && Array.isArray(project.images)) {
      project.images.forEach((img) => {
        if (!list.some((existing) => existing.url === img.url)) {
          list.push(img);
        }
      });
    }

    return list.sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [project]);

  const filteredGallery = useMemo(() => {
    if (selectedImageTypeFilter === "ALL") return allImages;
    return allImages.filter(
      (img) => (img.imageType || "general").toLowerCase() === selectedImageTypeFilter.toLowerCase()
    );
  }, [allImages, selectedImageTypeFilter]);

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
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowLeft") {
        setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
      }
      if (e.key === "ArrowRight") {
        setActiveImageIndex((prev) => (prev + 1) % allImages.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, allImages.length]);

  const handleConsultationClick = () => {
    navigate("/");
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
      {/* Top Header Bar */}
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
                  <span className="text-xs font-mono text-[var(--text-secondary,#FFF1D8)]/70 flex items-center gap-1">
                    <MapPin size={13} />
                    {project.location}
                  </span>
                </>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black text-white tracking-tight leading-[1.1]">
              {project.title}
            </h1>

            {project.shortSummary && (
              <p className="text-base sm:text-xl text-[var(--text-secondary,#FFF1D8)] leading-relaxed font-normal">
                {project.shortSummary}
              </p>
            )}

            {/* Quick Metadata Ribbon */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-[var(--text-secondary,#FFF1D8)]/80">
              {project.startDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-[var(--primary-accent,#FFDD9B)]" />
                  <span>
                    {project.startDate} {project.completionDate ? `- ${project.completionDate}` : ""}
                  </span>
                </div>
              )}

              {project.role && (
                <div className="flex items-center gap-1.5">
                  <Briefcase size={13} className="text-[var(--primary-accent,#FFDD9B)]" />
                  <span>{project.role}</span>
                </div>
              )}

              <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] text-[var(--text-secondary,#FFF1D8)] border border-white/[0.08]">
                {project.sourceType === "organization" ? "Ariiti Org" : "Personal Engineering"}
              </span>
            </div>
          </div>

          {/* Interactive Lightbox Canvas */}
          <ProjectGalleryLightbox
            allImages={allImages}
            filteredGallery={filteredGallery}
            activeImageIndex={activeImageIndex}
            setActiveImageIndex={setActiveImageIndex}
            isLightboxOpen={isLightboxOpen}
            setIsLightboxOpen={setIsLightboxOpen}
            selectedImageTypeFilter={selectedImageTypeFilter}
            setSelectedImageTypeFilter={setSelectedImageTypeFilter}
            availableImageTypes={availableImageTypes}
          />
        </section>

        {/* B. Overview & Facts */}
        <ProjectOverviewSidebar
          project={project}
          projectTypeLabel={projectTypeLabel}
          onConsultationClick={handleConsultationClick}
        />

        {/* C, D, E, F, G, H, I, J Detailed Sections */}
        <ProjectDetailedSections
          project={project}
          onConsultationClick={handleConsultationClick}
        />
      </main>
    </div>
  );
}
