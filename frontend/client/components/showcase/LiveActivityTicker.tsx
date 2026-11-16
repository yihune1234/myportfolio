import React from 'react';
import { motion } from 'framer-motion';
import { GitHubActivityEvent, DualScope } from '@/lib/githubApi';
import { Terminal, ExternalLink, GitCommit, GitBranch, Star, Tag, FolderGit2 } from 'lucide-react';

interface LiveActivityTickerProps {
  events: GitHubActivityEvent[];
  isLoading: boolean;
  scope: DualScope;
}

function getEventBadge(type: string) {
  switch (type) {
    case 'PushEvent':
      return {
        label: 'PUSH',
        color: 'text-[var(--primary-accent,#FFDD9B)] bg-[var(--primary-accent,#FFDD9B)]/10 border-[var(--primary-accent,#FFDD9B)]/25',
        icon: GitCommit,
      };
    case 'CreateEvent':
      return {
        label: 'CREATE',
        color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
        icon: GitBranch,
      };
    case 'WatchEvent':
      return {
        label: 'STAR',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        icon: Star,
      };
    case 'ReleaseEvent':
      return {
        label: 'RELEASE',
        color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        icon: Tag,
      };
    default:
      return {
        label: 'ACTIVITY',
        color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        icon: FolderGit2,
      };
  }
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function LiveActivityTicker({ events, isLoading, scope }: LiveActivityTickerProps) {
  return (
    <div className="relative rounded-2xl bg-[#070b14] border border-white/[0.08] overflow-hidden flex flex-col font-mono shadow-2xl">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg-base,#302E2D)] border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          {/* Mac Window Controls */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="ml-3 text-xs text-[var(--text-secondary,#FFF1D8)] flex items-center gap-1.5 font-mono">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>telemetry://github/events?scope={scope.toLowerCase()}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[var(--text-secondary,#FFF1D8)]/70 font-mono">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>STREAMING</span>
        </div>
      </div>

      {/* Terminal Feed Body */}
      <div className="p-4 space-y-2.5 max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/[0.1] scrollbar-track-transparent">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-white/[0.03] animate-pulse" />
          ))
        ) : events.length === 0 ? (
          <div className="py-8 text-center text-xs text-[var(--text-secondary,#FFF1D8)]/60">
            No public events recorded in the current active window.
          </div>
        ) : (
          events.slice(0, 15).map((ev, index) => {
            const badge = getEventBadge(ev.type);
            const BadgeIcon = badge.icon;
            const repoUrl = ev.repo?.html_url || `https://github.com/${ev.repo?.name}`;

            return (
              <div
                key={`${ev.source_scope}-${ev.id}-${index}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-white/[0.1] transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Badge */}
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border flex-shrink-0 ${badge.color}`}
                  >
                    <BadgeIcon className="w-3 h-3" />
                    {badge.label}
                  </span>

                  {/* Summary / Repo */}
                  <span className="text-xs text-[var(--text-primary,#FFFFFF)] truncate">
                    <span className="text-[var(--text-secondary,#FFF1D8)] mr-1.5">[{ev.source_scope}]</span>
                    {ev.summary}
                  </span>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto text-[11px] text-[var(--text-secondary,#FFF1D8)]/70 flex-shrink-0">
                  <span>{formatRelativeTime(ev.created_at)}</span>
                  <a
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded hover:text-emerald-400 transition-colors"
                    title={`Open ${ev.repo?.name} on GitHub`}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Terminal Footer Bar */}
      <div className="px-4 py-2.5 bg-[var(--bg-base,#302E2D)] border-t border-white/[0.08] flex items-center justify-between text-[11px] text-[var(--text-secondary,#FFF1D8)]/60 font-mono">
        <span>Verified Public Log Stream</span>
        <span>Buffered Events: {events.length}</span>
      </div>
    </div>
  );
}
