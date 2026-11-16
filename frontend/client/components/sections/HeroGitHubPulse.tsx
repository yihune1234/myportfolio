import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchGitHubOverview, GitHubOverview } from '@/lib/githubApi';
import { useGitHubSettings } from '@/hooks/useGitHubSettings';
import { ExternalLink, Terminal, GitCommit, ShieldCheck, Activity, Building2, User } from 'lucide-react';

export function HeroGitHubPulse() {
  const { data: settings } = useGitHubSettings();
  const [activeTab, setActiveTab] = useState<'PERSONAL' | 'ORGANIZATION'>('PERSONAL');

  const { data: overview, isLoading, isError } = useQuery<GitHubOverview>({
    queryKey: ['github', 'overview'],
    queryFn: () => fetchGitHubOverview(),
    staleTime: 5 * 60 * 1000,
    enabled: settings?.showHeroPulse !== false,
  });

  if (settings && settings.showHeroPulse === false) {
    return null;
  }

  const personalEvent = overview?.recent_activity?.find((e) => e.source_scope === 'PERSONAL');
  const orgEvent = overview?.recent_activity?.find((e) => e.source_scope === 'ORGANIZATION');
  const personalConnected = overview?.status?.personal === 'ok';
  const orgConnected = overview?.status?.organization === 'ok';
  const lastSync = overview?.last_synchronized_at;

  const activeEvent = activeTab === 'PERSONAL' ? (personalEvent || overview?.recent_activity?.[0]) : (orgEvent || overview?.recent_activity?.[0]);
  const isPersonal = activeTab === 'PERSONAL';

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
        <span>Checking verified dual-identity GitHub pulse...</span>
      </div>
    );
  }

  const repoName = activeEvent?.repo?.name?.split('/')[1] || activeEvent?.repo?.name || (isPersonal ? 'myportfolio' : 'ariiti-platform');
  const repoUrl = activeEvent?.repo?.html_url || (isPersonal ? 'https://github.com/yihune1234' : 'https://github.com/AriitiMarket');

  return (
    <div className="inline-flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-[#0B1637]/90 border border-white/[0.08] backdrop-blur-md shadow-lg shadow-black/20">
      {/* Switcher pills */}
      <div className="flex items-center gap-1 bg-[#050816]/70 p-0.5 rounded-full border border-white/[0.04]">
        <button
          type="button"
          onClick={() => setActiveTab('PERSONAL')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all ${
            activeTab === 'PERSONAL'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-[#B7C0D1]/70 hover:text-[#F5F7FA]'
          }`}
          title="Personal Engineering Identity"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${personalConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span>PERSONAL</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ORGANIZATION')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all ${
            activeTab === 'ORGANIZATION'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-[#B7C0D1]/70 hover:text-[#F5F7FA]'
          }`}
          title="Organization Platform Identity"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${orgConnected ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
          <span>ARIITI ORG</span>
        </button>
      </div>

      {/* Verified Event link */}
      <a
        href={repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2 px-3 py-1 text-xs font-mono text-[#B7C0D1] hover:text-[#F5F7FA] transition-colors"
        title="View verified public repository"
      >
        <span className="truncate max-w-[170px] sm:max-w-[220px] text-[11px]">
          {activeEvent ? (
            <>
              <span className="text-[#B7C0D1]/60">Active: </span>
              <span className="text-[#F5F7FA] font-medium group-hover:text-[#FF8A00] transition-colors">{repoName}</span>
            </>
          ) : (
            <span>Verified repository connected</span>
          )}
        </span>

        <span className="text-[10px] text-[#B7C0D1]/50 hidden sm:inline">
          • {formatTime(activeEvent?.created_at || lastSync)}
        </span>

        <ExternalLink className="w-3 h-3 text-[#B7C0D1]/40 group-hover:text-[#FF8A00] transition-colors flex-shrink-0" />
      </a>
    </div>
  );
}
