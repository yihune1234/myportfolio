import {
  ArrowRight,
  ChevronRight,
  Sparkles,
  Cpu,
  Database,
  Code2,
  Github,
  Linkedin,
  Building2,
  ExternalLink,
  Activity,
  GitCommit,
  GitFork,
  Star,
  Clock,
  Radio,
} from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchGitHubOverview, fetchGitHubHealth } from "@/lib/githubApi";

interface HeroSectionProps {
  onContactClick: () => void;
  onProjectsClick: () => void;
}

export default function HeroSection({
  onContactClick,
  onProjectsClick,
}: HeroSectionProps) {
  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ["github", "overview"],
    queryFn: () => fetchGitHubOverview(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: health } = useQuery({
    queryKey: ["github", "health"],
    queryFn: () => fetchGitHubHealth(),
    staleTime: 60 * 1000,
  });

  const personalEvent = overview?.recent_activity?.find(
    (e) => e.source_scope === "PERSONAL"
  );
  const orgEvent = overview?.recent_activity?.find(
    (e) => e.source_scope === "ORGANIZATION"
  );

  const personalLogin = overview?.accounts?.personal?.login || health?.sources?.personal?.username || "yihune1234";
  const personalUrl = overview?.accounts?.personal?.html_url || `https://github.com/${personalLogin}`;
  const orgLogin = overview?.accounts?.organization?.login || health?.sources?.organization?.name || "AriitiMarket";
  const orgUrl = overview?.accounts?.organization?.html_url || `https://github.com/${orgLogin}`;
  const orgName = overview?.accounts?.organization?.name || "Ariiti Tech Org";

  const formatRelativeTime = (iso?: string) => {
    if (!iso) return "recently";
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    const min = Math.floor(diff / 60);
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const days = Math.floor(hr / 24);
    return `${days}d ago`;
  };

  return (
    <section
      id="home"
      className="relative min-h-screen pt-28 pb-16 overflow-hidden bg-[var(--bg-base,#302E2D)]"
    >
      {/* Architectural Dot-Matrix Grid */}
      <div className="absolute inset-0 dot-matrix-grid opacity-30 pointer-events-none" />

      {/* Ambient Radial Glows */}
      <div className="absolute -top-32 -left-32 w-[650px] h-[650px] bg-[var(--primary-accent,#FFDD9B)]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[650px] h-[650px] bg-[var(--secondary-accent,#FFDD9B)]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Decorative Grid Lines */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-white/[0.02] pointer-events-none hidden lg:block" />
      <div className="absolute top-0 right-1/3 w-px h-full bg-white/[0.02] pointer-events-none hidden lg:block" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          {/* Left Column: Personal Identity & Engineering Focus */}
          <div className="lg:col-span-7 relative z-10 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {/* Telemetry Status Ribbon */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--card-surface,#403C38)] border border-[var(--primary-accent,#FFDD9B)]/30 text-[var(--primary-accent,#FFDD9B)] text-xs font-mono backdrop-blur-md shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary-accent,#FFDD9B)] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary-accent,#FFDD9B)]"></span>
                  </span>
                  <span>SOLUTIONS & ENGINEERING HUB</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--card-surface,#403C38)] border border-white/[0.08] text-[var(--text-secondary,#FFF1D8)] text-xs font-mono">
                  <Radio size={12} className="text-[var(--primary-accent,#FFDD9B)]" />
                  <span>Personal Lab &bull; Ariitii Tech Co-Founder & Lead</span>
                </div>
              </div>

              {/* Expressive Hero Title */}
              <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-black text-[var(--text-primary,#FFFFFF)] mb-6 tracking-tight leading-[1.08]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] via-[#FFF1D8] to-[var(--primary-accent,#FFDD9B)] block">
                  Engineer Yihune Belay
                </span>
                <span className="text-[var(--text-primary,#FFFFFF)] block text-2xl sm:text-4xl md:text-5xl font-bold mt-2 sm:mt-3 tracking-tight">
                  Engineering Scalable Systems.
                </span>
              </h1>

              {/* Subheading & Description */}
              <p className="text-base sm:text-lg text-[var(--text-secondary,#FFF1D8)] leading-relaxed max-w-xl mb-8 font-normal mx-auto lg:mx-0">
                Full-Stack Systems Engineer and Co-Founder and Lead at Ariitii Tech.
                Developing personal software projects, applications, and technology-driven solutions.
              </p>

              {/* Actions & Buttons */}
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-8">
                <button
                  onClick={onContactClick}
                  className="group relative px-7 py-3.5 bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] hover:from-[#FFE8B8] hover:to-[var(--primary-accent,#FFDD9B)] text-[#302E2D] rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[var(--primary-accent,#FFDD9B)]/20 active:scale-95"
                >
                  <span>Let's Work Together</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onProjectsClick}
                  className="px-7 py-3.5 bg-[var(--card-surface,#403C38)] text-[var(--text-primary,#FFFFFF)] border border-white/[0.08] hover:border-[var(--primary-accent,#FFDD9B)]/40 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 group hover:bg-[var(--card-elevated,#4A4642)]"
                >
                  <span>Explore Architecture</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform text-[var(--text-secondary,#FFF1D8)]" />
                </button>
              </div>

              {/* Direct Profile Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <a
                  href={personalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--card-surface,#403C38)] hover:bg-[var(--card-elevated,#4A4642)] border border-white/[0.08] hover:border-[var(--primary-accent,#FFDD9B)]/30 text-xs font-mono text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--text-primary,#FFFFFF)] transition-all"
                  title={`Personal GitHub Profile: @${personalLogin}`}
                >
                  <Github size={13} className="text-[var(--primary-accent,#FFDD9B)]" />
                  <span>@{personalLogin}</span>
                </a>

                <a
                  href="https://linkedin.com/in/yihune-belay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--card-surface,#403C38)] hover:bg-[var(--card-elevated,#4A4642)] border border-white/[0.08] hover:border-sky-500/30 text-xs font-mono text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--text-primary,#FFFFFF)] transition-all"
                  title="LinkedIn Profile"
                >
                  <Linkedin size={13} className="text-sky-400" />
                  <span>LinkedIn</span>
                </a>

                <a
                  href={orgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--card-surface,#403C38)] hover:bg-[var(--card-elevated,#4A4642)] border border-white/[0.08] hover:border-amber-500/30 text-xs font-mono text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--text-primary,#FFFFFF)] transition-all"
                  title={`Organization: @${orgLogin}`}
                >
                  <Building2 size={13} className="text-amber-400" />
                  <span>@{orgLogin}</span>
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Premium GitHub Telemetry Card */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="w-full max-w-md"
            >
              <div className="card-slate rounded-2xl p-5 sm:p-6 relative overflow-hidden backdrop-blur-xl border border-white/[0.08]">
                {/* Architectural Corner Nodes */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[var(--primary-accent,#FFDD9B)]/60" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500/60" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[var(--primary-accent,#FFDD9B)]/60" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500/60" />

                {/* Profile Overview Header */}
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-[var(--primary-accent,#FFDD9B)]" />
                    <span className="font-mono text-[11px] font-bold text-[var(--text-primary,#FFFFFF)] tracking-wider uppercase">
                      Engineering Profile & Solutions
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#A8A29E]">
                    Enterprise Services
                  </span>
                </div>

                {/* Profile Snapshot & Identifiers */}
                <div className="flex items-center gap-4 p-3 rounded-xl bg-[var(--bg-base,#302E2D)]/80 border border-white/[0.05] mb-4">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[var(--bg-base,#302E2D)] border border-[var(--primary-accent,#FFDD9B)]/40 flex-shrink-0">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets%2F729ed1e6158f4fddaa5c79dd9410d623%2F1fd6f14adfa546439d0e1614fe59db76?format=webp&width=200&height=200"
                      alt="Yihune Belay"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[var(--text-primary,#FFFFFF)] truncate">
                        Yihune Belay
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--primary-accent,#FFDD9B)]/15 text-[var(--primary-accent,#FFDD9B)] border border-[var(--primary-accent,#FFDD9B)]/30 font-bold">
                        VERIFIED
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[var(--text-secondary,#FFF1D8)] block truncate">
                      Software Engineering &bull; Haramaya Univ.
                    </span>
                    <span className="text-[10px] font-mono text-[#A8A29E]">
                      Addis Ababa, Ethiopia
                    </span>
                  </div>
                </div>

                {/* Dual Identity Status Streams */}
                <div className="space-y-2.5 mb-4">
                  {/* Personal Stream */}
                  <div className="p-3 rounded-xl bg-[var(--bg-base,#302E2D)]/70 border border-[var(--primary-accent,#FFDD9B)]/25 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-accent,#FFDD9B)]" />
                        <span className="text-[10px] font-mono font-bold text-[var(--primary-accent,#FFDD9B)] uppercase tracking-wider">
                          Personal Lab (@{personalLogin})
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]">
                        {overview?.accounts?.personal?.public_repos ?? overview?.metrics?.personal_public_repos ?? 27} Solutions
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[var(--text-primary,#FFFFFF)] font-medium truncate max-w-[200px]">
                        {personalEvent?.repo?.name?.split("/")[1] || "myportfolio"}
                      </span>
                      <span className="text-[10px] text-[#A8A29E]">
                        {formatRelativeTime(personalEvent?.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Organization Stream */}
                  <div className="p-3 rounded-xl bg-[var(--bg-base,#302E2D)]/70 border border-amber-500/25 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                          {orgName} (@{orgLogin})
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]">
                        {overview?.accounts?.organization?.public_repos ?? overview?.metrics?.organization_public_repos ?? 20} Solutions
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[var(--text-primary,#FFFFFF)] font-medium truncate max-w-[200px]">
                        {orgEvent?.repo?.name?.split("/")[1] || "ariiti-market-api"}
                      </span>
                      <span className="text-[10px] text-[#A8A29E]">
                        {formatRelativeTime(orgEvent?.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Core Stack Breakdown */}
                <div className="p-3 rounded-xl bg-[var(--bg-base,#302E2D)]/60 border border-white/[0.04] mb-4">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary,#FFF1D8)] mb-2">
                    <span>Core Technology Stack</span>
                    <span className="text-[var(--primary-accent,#FFDD9B)] font-bold">Multi-Platform</span>
                  </div>

                  {/* Multi-segment mini bar */}
                  <div className="h-1.5 w-full rounded-full bg-white/[0.05] overflow-hidden flex gap-0.5 mb-2">
                    <div className="h-full bg-[var(--primary-accent,#FFDD9B)] rounded-full" style={{ width: "42%" }} />
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: "28%" }} />
                    <div className="h-full bg-[#FFF1D8]/60 rounded-full" style={{ width: "18%" }} />
                    <div className="h-full bg-stone-500 rounded-full" style={{ width: "12%" }} />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[#A8A29E]">
                    <span>TypeScript</span>
                    <span>Node.js / Express</span>
                    <span>PostgreSQL & Mongo</span>
                    <span>Cloud Architecture</span>
                  </div>
                </div>

                {/* Overview Status Footer */}
                <div className="flex items-center justify-between text-[10px] font-mono text-[#A8A29E] pt-2 border-t border-white/[0.05]">
                  <div className="flex items-center gap-1.5">
                    <Clock size={11} className="text-[var(--primary-accent,#FFDD9B)]" />
                    <span>Updated: {formatRelativeTime(overview?.last_synchronized_at)}</span>
                  </div>
                  <span className="text-[var(--primary-accent,#FFDD9B)]/90 font-bold">Active & Available</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
