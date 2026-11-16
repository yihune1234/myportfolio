import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitHubRepository, DualScope } from '@/lib/githubApi';
import { Search, Star, GitFork, ExternalLink, Filter, ArrowUpDown, Code, Sparkles, Building2, User } from 'lucide-react';

interface RepositoryExplorerProps {
  repos: GitHubRepository[];
  isLoading: boolean;
  scope: DualScope;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  sortBy: 'stars' | 'updated' | 'name';
  onSortChange: (sort: 'stars' | 'updated' | 'name') => void;
}

export function RepositoryExplorer({
  repos,
  isLoading,
  scope,
  searchQuery,
  onSearchChange,
  selectedLanguage,
  onLanguageChange,
  sortBy,
  onSortChange,
}: RepositoryExplorerProps) {
  // Extract distinct languages from the repo set
  const availableLanguages = useMemo(() => {
    const set = new Set<string>();
    repos.forEach((r) => {
      if (r.primary_language) set.add(r.primary_language);
    });
    return Array.from(set).sort();
  }, [repos]);

  // Filtered and sorted repos
  const filteredRepos = useMemo(() => {
    return repos
      .filter((r) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = r.name.toLowerCase().includes(q);
          const matchesDesc = (r.description || '').toLowerCase().includes(q);
          const matchesTopics = (r.topics || []).some((t) => t.toLowerCase().includes(q));
          if (!matchesName && !matchesDesc && !matchesTopics) return false;
        }

        // Language filter
        if (selectedLanguage !== 'ALL' && r.primary_language !== selectedLanguage) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'stars') return (b.stars || 0) - (a.stars || 0);
        if (sortBy === 'updated') return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
        return a.name.localeCompare(b.name);
      });
  }, [repos, searchQuery, selectedLanguage, sortBy]);

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--card-surface,#3A3836)] border border-white/[0.08] backdrop-blur-md">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary,#FFF1D8)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search repositories by name, topic, or description..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs sm:text-sm text-[var(--text-primary,#FFFFFF)] placeholder-[var(--text-secondary,#FFF1D8)]/50 focus:outline-none focus:border-emerald-500/50 transition-all font-sans"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Language filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08]">
            <Code className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-transparent text-xs text-[var(--text-primary,#FFFFFF)] focus:outline-none cursor-pointer font-sans"
            >
              <option value="ALL" className="bg-[var(--card-surface,#3A3836)] text-[var(--text-primary,#FFFFFF)]">All Languages</option>
              {availableLanguages.map((lang) => (
                <option key={lang} value={lang} className="bg-[var(--card-surface,#3A3836)] text-[var(--text-primary,#FFFFFF)]">
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Sort order */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[var(--text-secondary,#FFF1D8)]" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="bg-transparent text-xs text-[var(--text-primary,#FFFFFF)] focus:outline-none cursor-pointer font-sans"
            >
              <option value="stars" className="bg-[var(--card-surface,#3A3836)] text-[var(--text-primary,#FFFFFF)]">Sort by Stars</option>
              <option value="updated" className="bg-[var(--card-surface,#3A3836)] text-[var(--text-primary,#FFFFFF)]">Sort by Last Pushed</option>
              <option value="name" className="bg-[var(--card-surface,#3A3836)] text-[var(--text-primary,#FFFFFF)]">Sort by Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Repositories Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 rounded-2xl bg-[var(--card-surface,#3A3836)] border border-white/[0.06] animate-pulse" />
          ))}
        </div>
      ) : filteredRepos.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-[var(--card-surface,#3A3836)] border border-white/[0.08]">
          <p className="text-sm text-[var(--text-primary,#FFFFFF)] font-medium">No repositories matched your criteria.</p>
          <p className="text-xs text-[var(--text-secondary,#FFF1D8)] mt-1">Try clearing filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRepos.map((repo) => {
            const isOrg = repo.source_scope === 'ORGANIZATION';
            return (
              <div
                key={`${repo.source_scope}-${repo.id}`}
                className={`group relative p-5 rounded-2xl bg-[var(--card-surface,#3A3836)] hover:bg-[var(--card-elevated,#444240)] border border-white/[0.08] transition-all duration-300 flex flex-col justify-between ${
                  isOrg ? 'hover:border-amber-500/40' : 'hover:border-emerald-500/40'
                }`}
              >
                <div>
                  {/* Top Bar: Scope Badge & GitHub Link */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                        isOrg
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {isOrg ? <Building2 className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {repo.source_scope}
                    </span>

                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-[var(--text-secondary,#FFF1D8)] transition-colors ${
                        isOrg ? 'hover:text-amber-400' : 'hover:text-emerald-400'
                      }`}
                      title={`Open ${repo.full_name} on GitHub`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Repository Name */}
                  <h4 className={`text-base font-bold text-[var(--text-primary,#FFFFFF)] transition-colors leading-snug mb-1.5 truncate ${
                    isOrg ? 'group-hover:text-amber-400' : 'group-hover:text-emerald-400'
                  }`}>
                    {repo.name}
                  </h4>

                  {/* Description */}
                  <p className="text-xs text-[var(--text-secondary,#FFF1D8)] leading-relaxed line-clamp-2 mb-4">
                    {repo.description || 'Public software engineering repository.'}
                  </p>

                  {/* Topics */}
                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {repo.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]"
                        >
                          #{topic}
                        </span>
                      ))}
                      {repo.topics.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-white/[0.02] text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]/60">
                          +{repo.topics.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer: Language, Stars, Forks, Timestamp */}
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-[var(--text-secondary,#FFF1D8)]">
                  <div className="flex items-center gap-3">
                    {repo.primary_language && (
                      <span className="flex items-center gap-1.5 text-xs text-[var(--text-primary,#FFFFFF)] font-sans font-medium">
                        <span className={`w-2 h-2 rounded-full ${isOrg ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                        {repo.primary_language}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[11px]">
                      <Star className="w-3 h-3 text-amber-400" />
                      {repo.stars}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <GitFork className="w-3 h-3 text-[var(--text-secondary,#FFF1D8)]/80" />
                      {repo.forks}
                    </span>
                  </div>

                  <span className="text-[10px] text-[var(--text-secondary,#FFF1D8)]/60">
                    {new Date(repo.pushed_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
