import React from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Github,
  ExternalLink,
  Star,
  GitFork,
  Pin,
  Eye,
  EyeOff,
  RefreshCw,
  Edit3,
  Trash2,
} from "lucide-react";
import CloudinaryImage from "../../CloudinaryImage.jsx";

export function ProjectCard({
  project,
  idx,
  isSyncing,
  onTogglePublish,
  onTogglePin,
  onSyncProject,
  onEditProject,
  onDeleteProject,
}) {
  const isPublished = project.status === "published";
  const isOrg =
    project.sourceType === "organization" ||
    project.githubSourceScope === "ORGANIZATION";
  const isPersonal =
    project.sourceType === "personal" ||
    project.githubSourceScope === "PERSONAL";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.03 }}
      className={`group rounded-2xl bg-[var(--card-surface,#403C38)] border transition-all flex flex-col overflow-hidden shadow-lg ${
        project.pinned
          ? "border-[var(--primary-accent,#FFDD9B)]/40 ring-1 ring-[var(--primary-accent,#FFDD9B)]/20"
          : "border-white/[0.08] hover:border-white/[0.2]"
      }`}
    >
      {/* Media Cover */}
      <div className="relative aspect-video bg-[var(--bg-base,#302E2D)] overflow-hidden">
        {project.image ? (
          <CloudinaryImage
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            width={400}
            height={225}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#302E2D] to-[#252322]">
            <Code2 className="w-10 h-10 text-[var(--primary-accent,#FFDD9B)]/40 mb-2" />
            <span className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)]">
              {project.githubRepoFullName || project.title}
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
          {/* Project Type Badge */}
          <span
            className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider shadow-md backdrop-blur-md border ${
              project.projectType === "proposed"
                ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                : project.projectType === "ongoing"
                ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
                : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
            }`}
          >
            {project.projectType === "proposed"
              ? "Proposed"
              : project.projectType === "ongoing"
              ? "Ongoing"
              : "Completed"}
          </span>

          {/* Status Badge */}
          <span
            className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider shadow-md ${
              project.status === "published"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md"
                : project.status === "under_review"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 backdrop-blur-md"
                : "bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md"
            }`}
          >
            {project.status === "published"
              ? "Published"
              : project.status === "under_review"
              ? "Under Review"
              : "Draft"}
          </span>

          {/* Source Badge */}
          <span
            className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider border shadow-md backdrop-blur-md ${
              isOrg
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : isPersonal
                ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
                : "bg-white/10 text-white/80 border-white/20"
            }`}
          >
            {isOrg ? "Ariiti Org" : isPersonal ? "Personal Lab" : "Manual"}
          </span>
        </div>

        {/* Pinned & Image Count Badges */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {project.pinned && (
            <span className="px-2 py-0.5 rounded-full bg-[var(--primary-accent,#FFDD9B)] text-[#302E2D] text-[9px] font-bold font-mono uppercase tracking-wider shadow-md flex items-center gap-1">
              <Pin size={10} className="fill-current" />
              Pinned
            </span>
          )}

          <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white/80 border border-white/10 text-[9px] font-mono font-bold">
            {project.images?.length || 0} pics
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-heading font-black text-base text-[var(--text-primary,#FFFFFF)] group-hover:text-[var(--primary-accent,#FFDD9B)] transition-colors line-clamp-1">
            {project.title}
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-[var(--text-secondary,#FFF1D8)] border border-white/[0.08] flex-shrink-0">
            {project.category || "Full-Stack"}
          </span>
        </div>

        <p className="text-xs text-[var(--text-secondary,#FFF1D8)] leading-relaxed line-clamp-2 mb-4 flex-1">
          {project.shortSummary || project.description}
        </p>

        {/* Technologies Chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(project.technologies || []).slice(0, 3).map((tech, i) => (
            <span
              key={i}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--primary-accent,#FFDD9B)]/10 text-[var(--primary-accent,#FFDD9B)] border border-[var(--primary-accent,#FFDD9B)]/20"
            >
              {tech}
            </span>
          ))}
          {(project.technologies || []).length > 3 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-white/60">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* GitHub Linkage & Live Metrics */}
        {project.githubRepoFullName ? (
          <div className="p-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] mb-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-1.5 truncate text-[var(--text-primary,#FFFFFF)]">
                <Github size={13} className="text-[var(--primary-accent,#FFDD9B)] flex-shrink-0" />
                <span className="truncate font-bold">{project.githubRepoFullName}</span>
              </div>

              <a
                href={project.githubUrl || `https://github.com/${project.githubRepoFullName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary,#FFF1D8)]/60 hover:text-[var(--primary-accent,#FFDD9B)] ml-1"
                title="Open on GitHub"
              >
                <ExternalLink size={12} />
              </a>
            </div>

            {project.githubMetadata && (
              <div className="flex items-center gap-3 text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]/80">
                <span className="flex items-center gap-1">
                  <Star size={10} className="text-amber-400" />
                  {project.githubMetadata.stars ?? 0}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork size={10} className="text-sky-400" />
                  {project.githubMetadata.forks ?? 0}
                </span>
                {project.githubMetadata.primaryLanguage && (
                  <span className="truncate">
                    {project.githubMetadata.primaryLanguage}
                  </span>
                )}
                {project.lastSyncedAt && (
                  <span className="ml-auto text-[9px] text-[var(--text-secondary,#FFF1D8)]/50">
                    Synced {new Date(project.lastSyncedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-[var(--bg-base,#302E2D)]/60 border border-dashed border-white/[0.08] mb-4 text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]/60 flex items-center justify-between">
            <span>Manual project &bull; No GitHub link</span>
            <button
              onClick={() => onEditProject(project)}
              className="text-[var(--primary-accent,#FFDD9B)] hover:underline"
            >
              Link Repo
            </button>
          </div>
        )}

        {/* Action Bar */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-1">
          {/* Status Toggle Button */}
          <button
            onClick={() => onTogglePublish(project)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              isPublished
                ? "bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30"
                : "bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30"
            }`}
            title={isPublished ? "Unpublish to draft" : "Publish to live portfolio"}
          >
            {isPublished ? <Eye size={13} /> : <EyeOff size={13} />}
            <span>{isPublished ? "Published" : "Draft"}</span>
          </button>

          <div className="flex items-center gap-1">
            {/* Sync Button */}
            {project.githubRepoFullName && (
              <button
                onClick={() => onSyncProject(project)}
                disabled={isSyncing}
                className="p-1.5 rounded-lg hover:bg-white/[0.08] text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--primary-accent,#FFDD9B)] transition-colors"
                title="Sync with GitHub"
              >
                <RefreshCw
                  size={14}
                  className={isSyncing ? "animate-spin text-[var(--primary-accent,#FFDD9B)]" : ""}
                />
              </button>
            )}

            {/* Pin Toggle */}
            <button
              onClick={() => onTogglePin(project)}
              className={`p-1.5 rounded-lg transition-colors ${
                project.pinned
                  ? "text-[var(--primary-accent,#FFDD9B)] bg-[var(--primary-accent,#FFDD9B)]/10"
                  : "text-[var(--text-secondary,#FFF1D8)] hover:bg-white/[0.08]"
              }`}
              title={project.pinned ? "Unpin from top" : "Pin to top"}
            >
              <Pin size={14} />
            </button>

            {/* Edit Details */}
            <button
              onClick={() => onEditProject(project)}
              className="p-1.5 rounded-lg hover:bg-white/[0.08] text-[var(--text-secondary,#FFF1D8)] hover:text-white transition-colors"
              title="Edit Project"
            >
              <Edit3 size={14} />
            </button>

            {/* Delete */}
            <button
              onClick={() => onDeleteProject(project)}
              className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-secondary,#FFF1D8)] hover:text-red-400 transition-colors"
              title="Delete Project"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProjectCard;
