import React from 'react';
import { motion } from 'framer-motion';
import { GitHubProfile, GitHubRepository, GitHubActivityEvent } from '@/lib/githubApi';
import { useGitHubSettings } from '@/hooks/useGitHubSettings';
import { Building2, Star, GitFork, ExternalLink, ShieldCheck, Activity } from 'lucide-react';

interface OrganizationImpactProps {
  orgProfile?: GitHubProfile;
  orgRepos: GitHubRepository[];
  orgActivity: GitHubActivityEvent[];
  isLoading: boolean;
}

export function OrganizationImpact({
  orgProfile,
  orgRepos,
  orgActivity,
  isLoading
}: OrganizationImpactProps) {
  const { data: settings } = useGitHubSettings();
  const orgNameFallback = settings?.githubOrg || 'Organization';
  const orgUrlFallback = settings?.githubOrg ? `https://github.com/${settings.githubOrg}` : 'https://github.com';

  const totalStars = React.useMemo(() => {
    return orgRepos.reduce((acc, r) => acc + (r.stars || 0), 0);
  }, [orgRepos]);

  const totalForks = React.useMemo(() => {
    return orgRepos.reduce((acc, r) => acc + (r.forks || 0), 0);
  }, [orgRepos]);

  const featuredRepos = React.useMemo(() => {
    return [...orgRepos]
      .sort((a, b) => b.stars - a.stars || new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
      .slice(0, 3);
  }, [orgRepos]);

  const latestEvent = orgActivity[0];

  if (!orgProfile && !isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-[var(--card-surface,#3A3836)] border border-white/[0.08] text-center text-xs text-[var(--text-secondary,#FFF1D8)]">
        Organization details not configured or unavailable.
      </div>
    );
  }

  return (
    <div className="relative p-6 sm:p-7 rounded-2xl bg-[var(--card-surface,#3A3836)]/90 border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between overflow-hidden group">
      {/* Background amber glow */}
      <div className="absolute -top-20 -left-20 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Header with Org Avatar & Identity */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-black/40 border border-amber-500/30 flex-shrink-0">
              {orgProfile?.avatar_url ? (
                <img
                  src={orgProfile.avatar_url}
                  alt={orgProfile.name || orgProfile.login}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-amber-400">
                  <Building2 className="w-6 h-6" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary,#FFFFFF)] tracking-tight">
                  {orgProfile?.name || orgProfile?.login || orgNameFallback}
                </h3>
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-xs text-[var(--text-secondary,#FFF1D8)] font-mono">
                @{orgProfile?.login || orgNameFallback} &bull; Verified Organization
              </p>
            </div>
          </div>

          <a
            href={orgProfile?.html_url || orgUrlFallback}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-xs font-mono text-amber-300 transition-all"
          >
            <span>View Org</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Bio / Description */}
        <p className="text-xs sm:text-sm text-[var(--text-secondary,#FFF1D8)] leading-relaxed mb-5">
          {orgProfile?.bio ||
            'E-commerce, logistics, and multi-tenant marketplace platforms built for modern commerce infrastructure.'}
        </p>

        {/* Aggregate Impact Stats */}
        <div className="grid grid-cols-3 gap-2.5 mb-5 p-3 rounded-xl bg-black/30 border border-white/[0.06]">
          <div className="text-center">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary,#FFF1D8)]/70">
              Repositories
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-amber-400 mt-0.5">
              {isLoading ? '...' : orgRepos.length}
            </div>
          </div>
          <div className="text-center border-x border-white/[0.06]">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary,#FFF1D8)]/70">
              Total Stars
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-[var(--text-primary,#FFFFFF)] mt-0.5">
              {isLoading ? '...' : totalStars}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary,#FFF1D8)]/70">
              Total Forks
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-[var(--text-primary,#FFFFFF)] mt-0.5">
              {isLoading ? '...' : totalForks}
            </div>
          </div>
        </div>

        {/* Featured Organization Repositories */}
        <div className="space-y-2 mb-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary,#FFF1D8)]/70 mb-2">
            Key Organization Repositories
          </div>
          {isLoading ? (
            <div className="h-14 rounded-xl bg-white/[0.03] animate-pulse" />
          ) : featuredRepos.length === 0 ? (
            <div className="text-xs text-[var(--text-secondary,#FFF1D8)] py-2">No public repositories listed.</div>
          ) : (
            featuredRepos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-amber-500/30 transition-all text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="font-semibold text-[var(--text-primary,#FFFFFF)] truncate">{repo.name}</span>
                  {repo.primary_language && (
                    <span className="text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]/70 px-1.5 py-0.5 rounded bg-white/[0.04]">
                      {repo.primary_language}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary,#FFF1D8)] flex-shrink-0">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400" />
                    {repo.stars}
                  </span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </div>
              </a>
            ))
          )}
        </div>

        {/* Latest Activity Snippet */}
        {latestEvent && (
          <div className="p-3 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 truncate">
              <Activity className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="text-[var(--text-secondary,#FFF1D8)] truncate">
                <strong className="text-[var(--text-primary,#FFFFFF)]">Latest:</strong> {latestEvent.summary}
              </span>
            </div>
            <span className="text-[10px] font-mono text-amber-300/80 flex-shrink-0">
              {new Date(latestEvent.created_at).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-white/[0.06] text-[11px] font-mono text-[var(--text-secondary,#FFF1D8)]/60">
        Public open-source activity only &bull; Non-speculative metrics
      </div>
    </div>
  );
}
