import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit3,
  Plus,
  Image as ImageIcon,
  X,
  Sparkles,
  Github,
  Upload,
  RefreshCw,
  Save,
} from "lucide-react";
import ProjectImageManagerModal from "./ProjectImageManagerModal.jsx";

export function ProjectFormModal({
  showModal,
  editingProject,
  formData,
  setFormData,
  savingProject,
  showImageManager,
  setShowImageManager,
  projectImages,
  uploadingImages,
  imagePreview,
  onSubmit,
  onClose,
  onImageChange,
  onUploadImages,
  onSetFeatured,
  onDeleteImage,
}) {
  if (!showModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-3xl rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.1] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Modal Header */}
          <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-[var(--bg-base,#302E2D)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary-accent,#FFDD9B)]/10 border border-[var(--primary-accent,#FFDD9B)]/30 flex items-center justify-center text-[var(--primary-accent,#FFDD9B)] font-bold">
                {editingProject ? <Edit3 size={18} /> : <Plus size={18} />}
              </div>
              <div>
                <h3 className="font-heading font-black text-lg text-[var(--text-primary,#FFFFFF)]">
                  {editingProject ? `Edit: ${editingProject.title}` : "Create Portfolio Project"}
                </h3>
                <p className="text-xs font-mono text-[var(--text-secondary,#FFF1D8)]/70">
                  {formData.githubRepoFullName
                    ? `Linked to GitHub: ${formData.githubRepoFullName}`
                    : "Manual portfolio entry"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {editingProject && (
                <button
                  type="button"
                  onClick={() => setShowImageManager(!showImageManager)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                    showImageManager
                      ? "bg-[var(--primary-accent,#FFDD9B)] text-[#302E2D]"
                      : "bg-white/[0.06] text-[var(--text-secondary,#FFF1D8)] hover:text-white"
                  }`}
                >
                  <ImageIcon size={14} />
                  <span>{showImageManager ? "Back to Edit" : "Screenshots"}</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/[0.08] text-white/60 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto flex-1 p-6">
            {showImageManager && editingProject ? (
              <ProjectImageManagerModal
                projectImages={projectImages}
                uploadingImages={uploadingImages}
                onUploadImages={onUploadImages}
                onSetFeatured={onSetFeatured}
                onDeleteImage={onDeleteImage}
              />
            ) : (
              <form id="project-form" onSubmit={onSubmit} className="space-y-6">
                {/* Publication & Status Bar */}
                <div className="p-4 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Publication Status Selector */}
                    <div>
                      <span className="text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]/70 uppercase tracking-wider block mb-1">
                        Publication Lifecycle Status
                      </span>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[var(--card-surface,#403C38)] border border-white/[0.08] text-xs font-mono text-[var(--text-primary,#FFFFFF)] focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
                      >
                        <option value="draft">Draft (Hidden from public)</option>
                        <option value="under_review">Under Review (Admin only)</option>
                        <option value="published">Published (Visible to public)</option>
                        <option value="unpublished">Unpublished (Hidden)</option>
                        <option value="archived">Archived (Internal record)</option>
                      </select>
                    </div>

                    {/* Project Type Selector */}
                    <div>
                      <span className="text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]/70 uppercase tracking-wider block mb-1">
                        Project Classification
                      </span>
                      <select
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[var(--card-surface,#403C38)] border border-white/[0.08] text-xs font-mono text-[var(--text-primary,#FFFFFF)] focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
                      >
                        <option value="completed">Completed Project</option>
                        <option value="ongoing">Ongoing Deployment</option>
                        <option value="proposed">Proposed Project (Proposal)</option>
                      </select>
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-white/[0.06]">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[var(--text-secondary,#FFF1D8)]">
                      <input
                        type="checkbox"
                        checked={formData.pinned}
                        onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
                        className="w-4 h-4 accent-[var(--primary-accent,#FFDD9B)] rounded cursor-pointer"
                      />
                      <span>Pin to top (Featured)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[var(--text-secondary,#FFF1D8)]">
                      <input
                        type="checkbox"
                        checked={formData.showGithubLink}
                        onChange={(e) => setFormData({ ...formData, showGithubLink: e.target.checked })}
                        className="w-4 h-4 accent-[var(--primary-accent,#FFDD9B)] rounded cursor-pointer"
                      />
                      <span>Show GitHub link publicly</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[var(--text-secondary,#FFF1D8)]">
                      <input
                        type="checkbox"
                        checked={formData.isMini}
                        onChange={(e) => setFormData({ ...formData, isMini: e.target.checked })}
                        className="w-4 h-4 accent-[var(--primary-accent,#FFDD9B)] rounded cursor-pointer"
                      />
                      <span>Mini / Research utility</span>
                    </label>
                  </div>
                </div>

                {/* Proposal Specific Controls (When projectType === 'proposed') */}
                {formData.projectType === "proposed" && (
                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles size={14} />
                        <span>Proposal Governance & Details</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-purple-200">Review Status:</span>
                        <select
                          value={formData.proposalStatus}
                          onChange={(e) => setFormData({ ...formData, proposalStatus: e.target.value })}
                          className="px-2.5 py-1 rounded bg-[var(--bg-base,#302E2D)] border border-purple-500/30 text-xs font-mono text-purple-300 focus:outline-none"
                        >
                          <option value="pending">Pending Review</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-mono font-bold text-purple-200 block">
                          Objectives (one per line)
                        </label>
                        <textarea
                          rows={2}
                          value={formData.objectives}
                          onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                          placeholder="Objective 1&#10;Objective 2"
                          className="w-full px-3 py-2 rounded-lg bg-[var(--bg-base,#302E2D)] border border-purple-500/20 text-xs text-white focus:outline-none resize-none font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-mono font-bold text-purple-200 block">
                          Expected Outcomes (one per line)
                        </label>
                        <textarea
                          rows={2}
                          value={formData.expectedOutcomes}
                          onChange={(e) => setFormData({ ...formData, expectedOutcomes: e.target.value })}
                          placeholder="Outcome 1&#10;Outcome 2"
                          className="w-full px-3 py-2 rounded-lg bg-[var(--bg-base,#302E2D)] border border-purple-500/20 text-xs text-white focus:outline-none resize-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-mono font-bold text-purple-200 block">
                          Challenge / Problem Statement
                        </label>
                        <textarea
                          rows={2}
                          value={formData.challenges}
                          onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                          placeholder="Background and critical problem being solved..."
                          className="w-full px-3 py-2 rounded-lg bg-[var(--bg-base,#302E2D)] border border-purple-500/20 text-xs text-white focus:outline-none resize-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-mono font-bold text-purple-200 block">
                          Proposed Solution Architecture
                        </label>
                        <textarea
                          rows={2}
                          value={formData.proposedSolution}
                          onChange={(e) => setFormData({ ...formData, proposedSolution: e.target.value })}
                          placeholder="Proposed technical solution and delivery plan..."
                          className="w-full px-3 py-2 rounded-lg bg-[var(--bg-base,#302E2D)] border border-purple-500/20 text-xs text-white focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Title, Category & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5 sm:col-span-1">
                    <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Ariiti Marketplace"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Distributed Systems"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                      Engineering Role
                    </label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="e.g. Full-Stack Architect"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                    Portfolio Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Comprehensive summary of the problem, architecture, throughput, and impact..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50 leading-relaxed resize-none"
                  />
                </div>

                {/* Short Summary */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                    Brief Executive Summary (for cards & quick view)
                  </label>
                  <input
                    type="text"
                    value={formData.shortSummary}
                    onChange={(e) => setFormData({ ...formData, shortSummary: e.target.value })}
                    placeholder="e.g. Multi-tenant retail engine processing 50k daily transactions with 99.98% uptime."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
                  />
                </div>

                {/* Client, Location & Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                      Client or Partner
                    </label>
                    <input
                      type="text"
                      value={formData.clientOrPartner}
                      onChange={(e) => setFormData({ ...formData, clientOrPartner: e.target.value })}
                      placeholder="e.g. Ariiti Tech Ltd"
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Addis Ababa / Remote"
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                      Start Date
                    </label>
                    <input
                      type="text"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      placeholder="e.g. Jan 2024"
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                      Completion Date
                    </label>
                    <input
                      type="text"
                      value={formData.completionDate}
                      onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                      placeholder="e.g. Present / Nov 2024"
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50 font-mono"
                    />
                  </div>
                </div>

                {/* Technologies (Comma-Separated) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                    Technologies & Stack (comma-separated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    placeholder="TypeScript, Node.js, Express, MongoDB, Docker, TailwindCSS"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50 font-mono"
                  />
                </div>

                {/* Results, Impact & Equipment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                      Results & Key Impact (one per line)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.resultsAndImpact}
                      onChange={(e) => setFormData({ ...formData, resultsAndImpact: e.target.value })}
                      placeholder="Reduced order checkout latency by 64%&#10;Onboarded 12,000 active merchants"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50 leading-relaxed resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                      Tools, Hardware & Equipment (comma-separated)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.equipment}
                      onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                      placeholder="AWS EC2, Nginx, Redis Clusters, Docker Swarm, Linux Ubuntu Server"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50 leading-relaxed resize-none font-mono"
                    />
                  </div>
                </div>

                {/* Highlights / Bullet points */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                    Architectural Highlights (one per line)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.highlights}
                    onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                    placeholder="High-throughput GraphQL gateway with sub-15ms response times&#10;Integrated multi-tier role-based access control"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50 font-mono text-xs leading-relaxed resize-none"
                  />
                </div>

                {/* URLs: GitHub & Live Demo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                      GitHub Repository URL
                    </label>
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                      Live Demo / Production URL
                    </label>
                    <input
                      type="url"
                      value={formData.demoUrl}
                      onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50 font-mono"
                    />
                  </div>
                </div>

                {/* GitHub Integration Drawer */}
                <div className="p-4 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Github className="w-5 h-5 text-[var(--primary-accent,#FFDD9B)]" />
                      <h4 className="text-sm font-bold text-white font-mono">
                        GitHub Repository Linkage
                      </h4>
                    </div>

                    {formData.githubRepoFullName && (
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            githubRepoFullName: "",
                            githubOwnerLogin: "",
                            githubRepoId: null,
                            sourceType: "manual",
                          })
                        }
                        className="text-xs text-red-400 hover:text-red-300 font-mono font-bold"
                      >
                        Disconnect Repo
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-[var(--text-secondary,#FFF1D8)]/80 block">
                        Repository full_name (owner/repo)
                      </label>
                      <input
                        type="text"
                        value={formData.githubRepoFullName}
                        onChange={(e) => {
                          const val = e.target.value.trim();
                          const [owner] = val.split("/");
                          const isOrg = owner && owner.toLowerCase().includes("ariiti");
                          setFormData({
                            ...formData,
                            githubRepoFullName: val,
                            githubOwnerLogin: owner || "",
                            githubSourceScope: isOrg ? "ORGANIZATION" : "PERSONAL",
                            sourceType: isOrg ? "organization" : val ? "personal" : "manual",
                          });
                        }}
                        placeholder="e.g. yihune1234/mybot or AriitiMarket/platform"
                        className="w-full px-3.5 py-2 rounded-lg bg-[var(--card-surface,#403C38)] border border-white/[0.08] text-xs font-mono text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
                      />
                    </div>

                    {/* Source Scope */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-[var(--text-secondary,#FFF1D8)]/80 block">
                        Source Ownership Scope
                      </label>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              githubSourceScope: "PERSONAL",
                              sourceType: "personal",
                            })
                          }
                          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-mono font-bold transition-all ${
                            formData.sourceType === "personal" || formData.githubSourceScope === "PERSONAL"
                              ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                              : "bg-white/[0.04] text-[var(--text-secondary,#FFF1D8)]/60"
                          }`}
                        >
                          Personal Lab
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              githubSourceScope: "ORGANIZATION",
                              sourceType: "organization",
                            })
                          }
                          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-mono font-bold transition-all ${
                            formData.sourceType === "organization" || formData.githubSourceScope === "ORGANIZATION"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                              : "bg-white/[0.04] text-[var(--text-secondary,#FFF1D8)]/60"
                          }`}
                        >
                          Ariiti Org
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              githubSourceScope: null,
                              sourceType: "manual",
                            })
                          }
                          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-mono font-bold transition-all ${
                            formData.sourceType === "manual" && !formData.githubRepoFullName
                              ? "bg-white/20 text-white border border-white/40"
                              : "bg-white/[0.04] text-[var(--text-secondary,#FFF1D8)]/60"
                          }`}
                        >
                          Manual
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/[0.06]">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[var(--text-secondary,#FFF1D8)]">
                      <input
                        type="checkbox"
                        checked={formData.showGithubMetrics}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            showGithubMetrics: e.target.checked,
                          })
                        }
                        className="w-4 h-4 accent-[var(--primary-accent,#FFDD9B)] rounded cursor-pointer"
                      />
                      <span>Show Live Stars, Forks & Language Badges</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[var(--text-secondary,#FFF1D8)]">
                      <input
                        type="checkbox"
                        checked={formData.autoSyncMetrics}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            autoSyncMetrics: e.target.checked,
                          })
                        }
                        className="w-4 h-4 accent-[var(--primary-accent,#FFDD9B)] rounded cursor-pointer"
                      />
                      <span>Auto-sync metrics on schedule</span>
                    </label>
                  </div>
                </div>

                {/* Primary Cover Image Upload */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                    Project Cover Image
                  </label>
                  <label className="flex flex-col items-center justify-center aspect-video rounded-xl bg-[var(--bg-base,#302E2D)] border-2 border-dashed border-white/[0.1] hover:border-[var(--primary-accent,#FFDD9B)]/40 cursor-pointer overflow-hidden transition-all group">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Cover Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-6 space-y-2">
                        <Upload className="w-8 h-8 mx-auto text-[var(--primary-accent,#FFDD9B)]/40 group-hover:scale-110 transition-transform" />
                        <div>
                          <span className="text-xs font-bold text-white block">
                            Choose or drop cover image
                          </span>
                          <span className="text-[10px] text-white/40 font-mono">
                            PNG, JPG, WebP up to 10MB
                          </span>
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onImageChange}
                    />
                  </label>
                </div>
              </form>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-white/[0.08] bg-[var(--bg-base,#302E2D)] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/[0.06] text-white text-xs font-bold font-mono hover:bg-white/[0.1] transition-all"
            >
              Cancel
            </button>

            {!showImageManager && (
              <button
                type="submit"
                form="project-form"
                disabled={savingProject}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] text-xs font-bold font-mono shadow-lg shadow-[#FFDD9B]/20 flex items-center gap-2 disabled:opacity-50"
              >
                {savingProject ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                <span>{editingProject ? "Update Project" : "Create Project"}</span>
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ProjectFormModal;
