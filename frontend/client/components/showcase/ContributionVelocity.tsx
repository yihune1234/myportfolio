import React from 'react';
import { motion } from 'framer-motion';
import { GitHubActivityEvent, DualScope } from '@/lib/githubApi';
import { GitCommit, GitPullRequest, GitFork, Star, Flame, Calendar, AlertCircle } from 'lucide-react';

interface ContributionVelocityProps {
  events: GitHubActivityEvent[];
  isLoading: boolean;
  scope: DualScope;
}

export function ContributionVelocity({ events, isLoading, scope }: ContributionVelocityProps) {
  // Aggregate public actions from the real event stream
  const counts = React.useMemo(() => {
    let pushes = 0;
    let creates = 0;
    let stars = 0;
    let prs = 0;
    let others = 0;

    events.forEach((ev) => {
      switch (ev.type) {
        case 'PushEvent':
          pushes++;
          break;
        case 'CreateEvent':
          creates++;
          break;
        case 'WatchEvent':
          stars++;
          break;
        case 'PullRequestEvent':
        case 'PullRequestReviewEvent':
          prs++;
          break;
        default:
          others++;
          break;
      }
    });

    return { pushes, creates, stars, prs, others, total: events.length };
  }, [events]);

  const metrics = [
    {
      label: 'Push Events',
      value: counts.pushes,
      icon: GitCommit,
      color: 'text-[var(--primary-accent,#FFDD9B)]',
      bg: 'bg-[var(--primary-accent,#FFDD9B)]/10 border-[var(--primary-accent,#FFDD9B)]/25',
    },
    {
      label: 'New Repos / Branches',
      value: counts.creates,
      icon: GitFork,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      label: 'Code Collaborations',
      value: counts.prs,
      icon: GitPullRequest,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      label: 'Community Starred',
      value: counts.stars,
      icon: Star,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
  ];

  return (
    <div className="relative p-6 sm:p-7 rounded-2xl bg-[var(--card-surface,#3A3836)]/90 border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between overflow-hidden">
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-emerald-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary,#FFFFFF)] tracking-tight">
                Contribution Velocity
              </h3>
              <p className="text-xs text-[var(--text-secondary,#FFF1D8)] font-mono">
                Public Activity Action Streams ({scope})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] font-mono text-[var(--text-secondary,#FFF1D8)]">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Real REST Stream</span>
          </div>
        </div>

        {/* Action Metric Cards */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {metrics.map((m) => (
            <div
              key={m.label}
              className={`p-3.5 rounded-xl border backdrop-blur-sm ${m.bg} flex flex-col justify-between transition-all`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-medium text-[var(--text-secondary,#FFF1D8)]">
                  {m.label}
                </span>
                <m.icon className={`w-3.5 h-3.5 ${m.color}`} />
              </div>
              <div className={`text-xl sm:text-2xl font-bold font-mono ${m.color}`}>
                {isLoading ? '...' : m.value}
              </div>
            </div>
          ))}
        </div>

        {/* Honest Disclosure notice */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-start gap-2.5 text-xs text-[var(--text-secondary,#FFF1D8)] leading-relaxed">
          <AlertCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p>
            <strong className="text-[var(--text-primary,#FFFFFF)]">Honest Disclosure:</strong> These metrics reflect
            verified GitHub public REST event streams. GitHub limits public event feeds to the 300 most recent events.
            Values are never simulated or extrapolated into arbitrary historical commit graphs.
          </p>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary,#FFF1D8)]/70">
        <span>Verified Public Events: {counts.total}</span>
        <span>Scope: {scope}</span>
      </div>
    </div>
  );
}
