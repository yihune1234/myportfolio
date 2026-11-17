import React from "react";
import {
  User,
  Building2,
  Check,
  Search,
  RefreshCw,
  Download,
  AlertCircle,
  Github,
  Star,
  GitFork,
  Calendar,
  BookOpen,
  ExternalLink,
} from "lucide-react";

export function GitHubRepoBrowser({
  repoSource,
  setRepoSource,
  currentUsername,
  currentOrg,
  repos,
  reposLoading,
  reposError,
  repoSearch,
  setRepoSearch,
  repoLanguageFilter,
  setRepoLanguageFilter,
  repoSort,
  setRepoSort,
  availableRepoLanguages,
  filteredRepos,
  selectedRepoFullNames,
  onToggleSelectRepo,
  onSelectAllFilteredRepos,
  onBulkImportSelected,
  bulkImporting,
  importedRepoMap,
  onOpenPreview,
  onImportRepo,
  onForceRefresh,
}) {
  return (
    <div className="space-y-6">
      {/* Source Selector & Account Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Personal Account Option */}
        <div
          onClick={() => setRepoSource("PERSONAL")}
          className={`p-5 rounded-2xl cursor-pointer border transition-all relative overflow-hidden ${
            repoSource === "PERSONAL"
              ? "bg-[var(--card-surface,#403C38)] border-[var(--primary-accent,#FFDD9B)] shadow-xl shadow-[var(--primary-accent,#FFDD9B)]/10"
              : "bg-[var(--card-surface,#403C38)]/60 border-white/[0.08] hover:border-white/[0.2]"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <User size={20} />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary,#FFF1D8)]/70 block">
                  Personal Account
                </span>
                <h3 className="text-base font-bold text-[var(--text-primary,#FFFFFF)] font-mono">
                  @{currentUsername}
                </h3>
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                repoSource === "PERSONAL"
                  ? "border-[var(--primary-accent,#FFDD9B)] bg-[var(--primary-accent,#FFDD9B)] text-[#302E2D]"
                  : "border-white/20"
              }`}
            >
              {repoSource === "PERSONAL" && <Check size={12} className="stroke-[3]" />}
            </div>
          </div>

          <p className="text-xs text-[var(--text-secondary,#FFF1D8)] leading-relaxed">
            Personal engineering repositories, open-source utilities, and architectural research from your primary profile.
          </p>
        </div>

        {/* Organization Account Option */}
        <div
          onClick={() => setRepoSource("ORGANIZATION")}
          className={`p-5 rounded-2xl cursor-pointer border transition-all relative overflow-hidden ${
            repoSource === "ORGANIZATION"
              ? "bg-[var(--card-surface,#403C38)] border-[var(--primary-accent,#FFDD9B)] shadow-xl shadow-[var(--primary-accent,#FFDD9B)]/10"
              : "bg-[var(--card-surface,#403C38)]/60 border-white/[0.08] hover:border-white/[0.2]"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Building2 size={20} />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary,#FFF1D8)]/70 block">
                  Organization Platform
                </span>
                <h3 className="text-base font-bold text-[var(--text-primary,#FFFFFF)] font-mono">
                  @{currentOrg}
                </h3>
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                repoSource === "ORGANIZATION"
                  ? "border-[var(--primary-accent,#FFDD9B)] bg-[var(--primary-accent,#FFDD9B)] text-[#302E2D]"
                  : "border-white/20"
              }`}
            >
              {repoSource === "ORGANIZATION" && <Check size={12} className="stroke-[3]" />}
            </div>
          </div>

          <p className="text-xs text-[var(--text-secondary,#FFF1D8)] leading-relaxed">
            Production ecosystem microservices, multi-tenant ventures, and team platforms under the organization umbrella.
          </p>
        </div>
      </div>

      {/* Browser Filter & Search Controls */}
      <div className="p-4 rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary,#FFF1D8)]/60"
            />
            <input
              type="text"
              placeholder={`Search ${repoSource === "ORGANIZATION" ? currentOrg : currentUsername} repositories by name or description...`}
              value={repoSearch}
              onChange={(e) => setRepoSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-sm text-[var(--text-primary,#FFFFFF)] placeholder-[var(--text-secondary,#FFF1D8)]/40 focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50 transition-all font-mono"
            />
            {repoSearch && (
              <button
                onClick={() => setRepoSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/40 hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          {/* Language Filter */}
          <select
            value={repoLanguageFilter}
            onChange={(e) => setRepoLanguageFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs font-mono text-[var(--text-secondary,#FFF1D8)] focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
          >
            <option value="ALL">All Languages</option>
            {availableRepoLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={repoSort}
            onChange={(e) => setRepoSort(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs font-mono text-[var(--text-secondary,#FFF1D8)] focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
          >
            <option value="updated">Recently Updated</option>
            <option value="pushed">Recently Pushed</option>
            <option value="name">Name (A-Z)</option>
            <option value="stars">Most Stars</option>
          </select>

          {/* Force Refresh Button */}
          <button
            onClick={() => onForceRefresh(true)}
            disabled={reposLoading}
            className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[var(--text-secondary,#FFF1D8)] border border-white/[0.08] text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            title="Bypass cache and force refresh from GitHub API"
          >
            <RefreshCw size={13} className={reposLoading ? "animate-spin text-[var(--primary-accent,#FFDD9B)]" : ""} />
            <span>Refresh Repos</span>
          </button>
        </div>

        {/* Bulk Selection Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.06] text-xs font-mono text-[var(--text-secondary,#FFF1D8)]">
          <div className="flex items-center gap-3">
            <button
              onClick={onSelectAllFilteredRepos}
              className="hover:text-white transition-colors underline underline-offset-4"
            >
              {selectedRepoFullNames.size === filteredRepos.length && filteredRepos.length > 0
                ? "Deselect All"
                : `Select All Filtered (${filteredRepos.length})`}
            </button>
            <span>&bull;</span>
            <span>
              {selectedRepoFullNames.size} repository(s) selected
            </span>
          </div>

          {selectedRepoFullNames.size > 0 && (
            <button
              onClick={onBulkImportSelected}
              disabled={bulkImporting}
              className="px-4 py-1.5 rounded-lg bg-[var(--primary-accent,#FFDD9B)] text-[#302E2D] font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#FFDD9B]/20 disabled:opacity-50"
            >
              {bulkImporting ? (
                <RefreshCw size={12} className="animate-spin" />
              ) : (
                <Download size={12} />
              )}
              <span>
                Bulk Import {selectedRepoFullNames.size} Repos as Drafts
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Repositories List / Grid */}
      {reposLoading ? (
        <div className="py-24 text-center rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.08]">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-[var(--primary-accent,#FFDD9B)] mb-3" />
          <p className="text-sm font-mono text-[var(--text-secondary,#FFF1D8)]">
            Querying official GitHub REST API for @{repoSource === "ORGANIZATION" ? currentOrg : currentUsername}...
          </p>
        </div>
      ) : reposError ? (
        <div className="py-16 text-center rounded-2xl bg-[var(--card-surface,#403C38)] border border-red-500/30 p-8 space-y-4">
          <AlertCircle className="w-12 h-12 mx-auto text-red-400" />
          <div>
            <p className="text-lg font-bold text-red-400">
              Failed to fetch GitHub repositories
            </p>
            <p className="text-sm text-[var(--text-secondary,#FFF1D8)] max-w-md mx-auto mt-1">
              {reposError}
            </p>
          </div>
          <button
            onClick={() => onForceRefresh(true)}
            className="px-6 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/20 text-xs font-mono font-bold"
          >
            Retry Request
          </button>
        </div>
      ) : filteredRepos.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] p-8 space-y-3">
          <Github className="w-12 h-12 mx-auto text-[var(--primary-accent,#FFDD9B)]/40" />
          <p className="text-lg font-bold text-[var(--text-primary,#FFFFFF)]">
            No repositories found
          </p>
          <p className="text-sm text-[var(--text-secondary,#FFF1D8)]">
            Try clearing your search query or language filter.
          </p>
          {(repoSearch || repoLanguageFilter !== "ALL") && (
            <button
              onClick={() => {
                setRepoSearch("");
                setRepoLanguageFilter("ALL");
              }}
              className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-mono text-white"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRepos.map((repo) => {
            const isSelected = selectedRepoFullNames.has(repo.full_name);
            const existingProject = importedRepoMap.get(repo.full_name.toLowerCase());

            return (
              <div
                key={repo.id}
                className={`p-5 rounded-2xl bg-[var(--card-surface,#403C38)] border transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-[var(--primary-accent,#FFDD9B)] shadow-md shadow-[var(--primary-accent,#FFDD9B)]/10"
                    : "border-white/[0.08] hover:border-white/[0.18]"
                }`}
              >
                <div>
                  {/* Top Row: Selection Checkbox, Avatar, Name & Badges */}
                  <div className="flex items-start gap-3 mb-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelectRepo(repo.full_name)}
                      className="w-4 h-4 mt-1 accent-[var(--primary-accent,#FFDD9B)] rounded cursor-pointer flex-shrink-0"
                    />

                    <img
                      src={repo.owner?.avatar_url || "https://github.com/identicons/default.png"}
                      alt={repo.owner?.login}
                      className="w-9 h-9 rounded-xl border border-white/10 flex-shrink-0 object-cover"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-heading font-black text-sm text-[var(--text-primary,#FFFFFF)] truncate">
                          {repo.name}
                        </h4>

                        <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/[0.06] text-[var(--text-secondary,#FFF1D8)] border border-white/10">
                          {repo.visibility || "public"}
                        </span>

                        {existingProject && (
                          <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <Check size={10} />
                            In Portfolio ({existingProject.status})
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] font-mono text-[var(--text-secondary,#FFF1D8)]/60 truncate">
                        {repo.full_name}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[var(--text-secondary,#FFF1D8)] leading-relaxed line-clamp-2 mb-3">
                    {repo.description || "No description provided for this repository."}
                  </p>

                  {/* Topics */}
                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {repo.topics.slice(0, 4).map((topic, i) => (
                        <span
                          key={i}
                          className="text-[9px] font-mono px-2 py-0.5 rounded bg-[var(--primary-accent,#FFDD9B)]/10 text-[var(--primary-accent,#FFDD9B)] border border-[var(--primary-accent,#FFDD9B)]/20"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Metadata Chips: Language, Stars, Forks, Updated */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-[var(--text-secondary,#FFF1D8)]/75 py-2 border-t border-white/[0.06]">
                    {repo.primary_language && (
                      <span className="flex items-center gap-1.5 font-bold text-[var(--text-primary,#FFFFFF)]">
                        <span className="w-2 h-2 rounded-full bg-[var(--primary-accent,#FFDD9B)]" />
                        {repo.primary_language}
                      </span>
                    )}

                    <span className="flex items-center gap-1">
                      <Star size={11} className="text-amber-400" />
                      {repo.stars ?? 0}
                    </span>

                    <span className="flex items-center gap-1">
                      <GitFork size={11} className="text-sky-400" />
                      {repo.forks ?? 0}
                    </span>

                    <span className="flex items-center gap-1 text-[10px] text-[var(--text-secondary,#FFF1D8)]/50 ml-auto">
                      <Calendar size={10} />
                      {new Date(repo.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06] mt-2">
                  <button
                    onClick={() => onImportRepo(repo, true)}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md ${
                      existingProject
                        ? "bg-white/[0.08] hover:bg-white/[0.15] text-white"
                        : "bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] shadow-[#FFDD9B]/20"
                    }`}
                  >
                    <Download size={13} />
                    <span>{existingProject ? "Re-import / Edit" : "Import as Project"}</span>
                  </button>

                  <button
                    onClick={() => onOpenPreview(repo)}
                    className="py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-mono font-bold flex items-center gap-1"
                    title="Preview README and languages"
                  >
                    <BookOpen size={13} />
                    <span>Preview</span>
                  </button>

                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-[var(--text-secondary,#FFF1D8)] hover:text-white transition-colors"
                    title="View on GitHub"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default GitHubRepoBrowser;
