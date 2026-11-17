import React from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Project } from "@/hooks/useProjects";

interface ProjectOverviewSidebarProps {
  project: Project;
  projectTypeLabel: string;
  onConsultationClick: () => void;
}

export function ProjectOverviewSidebar({
  project,
  projectTypeLabel,
  onConsultationClick,
}: ProjectOverviewSidebarProps) {
  return (
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
              onClick={onConsultationClick}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#FFDD9B]/20 hover:brightness-105 transition-all flex items-center justify-center gap-2"
            >
              <span>Inquire About This Solution</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProjectOverviewSidebar;
