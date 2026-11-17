import React from "react";
import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { Project } from "@/hooks/useProjects";

interface ProjectDetailedSectionsProps {
  project: Project;
  onConsultationClick: () => void;
}

export function ProjectDetailedSections({
  project,
  onConsultationClick,
}: ProjectDetailedSectionsProps) {
  return (
    <>
      {/* Problem / Challenge & Solution / Implementation */}
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

      {/* Technologies & Equipment */}
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

      {/* Results and Achievements */}
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
                {Array.isArray(project.resultsAndImpact) ? project.resultsAndImpact.join("\n") : project.resultsAndImpact}
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

      {/* Flexible Content Sections */}
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

      {/* Related Published Projects */}
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

      {/* Professional Call to Action */}
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
            Whether engineering an enterprise distributed backend, modernizing legacy systems, or deploying high-availability cloud infrastructure, we are available for technical leadership and custom implementation.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 relative z-10">
          <button
            onClick={onConsultationClick}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] font-bold text-xs uppercase tracking-wider shadow-xl shadow-[#FFDD9B]/20 hover:brightness-105 transition-all"
          >
            Schedule Technical Consultation
          </button>
        </div>
      </section>
    </>
  );
}

export default ProjectDetailedSections;
