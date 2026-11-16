import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchGitHubOverview, GitHubOverview } from '@/lib/githubApi';
import { useGitHubSettings } from '@/hooks/useGitHubSettings';
import { ExternalLink, Terminal, GitCommit, ShieldCheck, Activity } from 'lucide-react';

export function HeroGitHubPulse() {
  const { data: settings } = useGitHubSettings();
  const { data: overview, isLoading, isError } = useQuery<GitHubOverview>({
    queryKey: ['github', 'overview'],
    queryFn: () => fetchGitHubOverview(),
    staleTime: 5 * 60 * 1000,
    enabled: settings?.showHeroPulse !== false,
  });

  if (settings && settings.showHeroPulse === false) {
    return null;
  }

  const latestEvent = overview?.recent_activity?.[0];
  const lastSync = overview?.last_synchronized_at;
  const isHealthy = overview?.status?.personal === 'ok';

  // Format relative time safely
  const formatTime = (iso?: string) => {
    if (!iso) return 'recently';
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    const min = Math.floor(diff / 60);
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const days = Math.floor(hr / 24);
    return `${days}d ago`;
  };

  if (isError) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.02] border border-white/[0.06] text-[11px] font-mono text-[#B7C0D1]/60">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
        <span>GitHub telemetry cached / reconnecting</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.02] border border-white/[0.06] text-[11px] font-mono text-[#B7C0D1]/60 animate-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A00]/50" />
        <span>Checking verified GitHub pulse...</span>
      </div>
    );
  }

  const isPersonal = latestEvent?.source_scope !== 'ORGANIZATION';
  const repoName = latestEvent?.repo?.name?.split('/')[1] || latestEvent?.repo?.name || 'myportfolio';
  const repoUrl = latestEvent?.repo?.html_url || `https://github.com/${latestEvent?.repo?.name || 'yihune1234'}`;

  return (
    <a
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-[#FF8A00]/30 transition-all duration-300 text-xs font-mono text-[#B7C0D1] backdrop-blur-md"
      title="Verified live GitHub activity"
    >
      {/* Dynamic Status Dot */}
      <span className="relative flex h-2 w-2 flex-shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
      </span>

      {/* Scope Badge */}
      <span
        className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
          isPersonal
            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
            : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
        }`}
      >
        {isPersonal ? 'PERSONAL LAB' : 'ARIITI MARKET'}
      </span>

      {/* Activity description */}
      <span className="truncate max-w-[200px] sm:max-w-[280px] text-[#F5F7FA] font-medium text-[11px]">
        {latestEvent ? (
          <>
            <span className="text-[#B7C0D1]">Active in</span> {repoName}
          </>
        ) : (
          <span>Verified active repository telemetry</span>
        )}
      </span>

      {/* Timestamp */}
      <span className="text-[10px] text-[#B7C0D1]/60 flex-shrink-0 hidden sm:inline">
        • {formatTime(latestEvent?.created_at || lastSync)}
      </span>

      <ExternalLink className="w-3 h-3 text-[#B7C0D1]/40 group-hover:text-[#FF8A00] transition-colors flex-shrink-0" />
    </a>
  );
}
