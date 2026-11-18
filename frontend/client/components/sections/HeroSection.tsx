import { useState, useEffect } from "react";
import {
  ArrowRight,
  ExternalLink,
  Github,
  Linkedin,
  Building2,
  FolderGit2,
  CheckCircle2,
  Mail,
  MapPin,
  Sparkles,
  GitCommit,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useGitHubSettings } from "@/hooks/useGitHubSettings";
import {
  getRealGitHubProfile,
  getRealGitHubEvents,
  RealGitHubProfile,
  RealGitHubEvent,
} from "@/lib/realGithubClient";

interface HeroSectionProps {
  onContactClick: () => void;
  onProjectsClick: () => void;
}

export default function HeroSection({
  onContactClick,
  onProjectsClick,
}: HeroSectionProps) {
  const { data: settings } = useGitHubSettings();
  const personalLogin = settings?.githubUsername || "yihune1234";
  const personalUrl = `https://github.com/${personalLogin}`;
  const orgLogin = settings?.githubOrg || "AriitiMarket";
  const orgUrl = `https://github.com/${orgLogin}`;

  const [profile, setProfile] = useState<RealGitHubProfile | null>(null);
  const [latestEvent, setLatestEvent] = useState<RealGitHubEvent | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadRealData() {
      try {
        const [profData, eventsData] = await Promise.all([
          getRealGitHubProfile(personalLogin),
          getRealGitHubEvents(personalLogin),
        ]);
        if (mounted) {
          setProfile(profData);
          if (eventsData && eventsData.length > 0) {
            setLatestEvent(eventsData[0]);
          }
        }
      } catch (e) {
        console.error("Hero GitHub fetch error:", e);
      }
    }
    loadRealData();
    return () => {
      mounted = false;
    };
  }, [personalLogin]);

  const scrollToRepositories = () => {
    const el = document.getElementById("repositories");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.open(personalUrl, "_blank");
    }
  };

  const formatEventTime = (isoString?: string) => {
    if (!isoString) return "recently";
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
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
      className="relative min-h-[92vh] pt-32 pb-20 flex items-center overflow-hidden bg-[var(--bg-base,#302E2D)]"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 dot-matrix-grid opacity-25 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-[var(--primary-accent,#FFDD9B)]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-[var(--primary-accent,#FFDD9B)]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Personal Introduction & Core Actions */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Role & Location Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--card-surface,#403C38)] border border-[var(--primary-accent,#FFDD9B)]/30 text-[var(--primary-accent,#FFDD9B)] text-xs font-mono mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[var(--primary-accent,#FFDD9B)] animate-pulse" />
                <span className="font-semibold tracking-wider uppercase">
                  Software Engineer &bull; Full-Stack &amp; Systems
                </span>
              </div>

              {/* Primary Name & Profession Heading */}
              <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] mb-4">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] via-[#FFF1D8] to-[var(--primary-accent,#FFDD9B)]">
                  Yihune Belay
                </span>
                <span className="block text-2xl sm:text-4xl lg:text-4xl font-bold text-white mt-2">
                  Building Scalable Software Systems
                </span>
              </h1>

              {/* Focused, Professional Description */}
              <p className="text-base sm:text-lg text-[var(--text-secondary,#FFF1D8)] leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 font-body">
                Full-stack software engineer and Co-Founder at Ariitii Tech. I design and build reliable backend services, intuitive web platforms, and cross-platform mobile applications with clean architecture and modern engineering practices.
              </p>

              {/* Action Buttons: View Projects, Explore GitHub, Contact Me */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 mb-8">
                {/* 1. View Projects */}
                <button
                  onClick={onProjectsClick}
                  className="px-6 py-3.5 bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] hover:brightness-105 text-[#302E2D] rounded-xl font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 shadow-lg shadow-[var(--primary-accent,#FFDD9B)]/20 active:scale-95"
                >
                  <span>View Projects</span>
                  <ArrowRight size={15} />
                </button>

                {/* 2. Explore GitHub */}
                <button
                  onClick={scrollToRepositories}
                  className="px-6 py-3.5 bg-[var(--card-surface,#403C38)] hover:bg-[var(--card-elevated,#4A4642)] text-white border border-white/[0.1] hover:border-[var(--primary-accent,#FFDD9B)]/40 rounded-xl font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 active:scale-95"
                >
                  <Github size={15} className="text-[var(--primary-accent,#FFDD9B)]" />
                  <span>Explore GitHub</span>
                </button>

                {/* 3. Contact Me */}
                <button
                  onClick={onContactClick}
                  className="px-6 py-3.5 bg-transparent hover:bg-white/[0.05] text-[var(--text-secondary,#FFF1D8)] hover:text-white border border-white/[0.1] rounded-xl font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 active:scale-95"
                >
                  <Mail size={15} />
                  <span>Contact Me</span>
                </button>
              </div>

              {/* Direct Profile Links */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <a
                  href={personalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--card-surface,#403C38)] hover:bg-[var(--card-elevated,#4A4642)] border border-white/[0.08] hover:border-[var(--primary-accent,#FFDD9B)]/30 text-xs font-mono text-[var(--text-secondary,#FFF1D8)] hover:text-white transition-all"
                  title="GitHub Profile"
                >
                  <Github size={13} className="text-[var(--primary-accent,#FFDD9B)]" />
                  <span>github.com/{personalLogin}</span>
                </a>

                <a
                  href="https://linkedin.com/in/yihune-belay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--card-surface,#403C38)] hover:bg-[var(--card-elevated,#4A4642)] border border-white/[0.08] hover:border-sky-400/40 text-xs font-mono text-[var(--text-secondary,#FFF1D8)] hover:text-white transition-all"
                  title="LinkedIn Profile"
                >
                  <Linkedin size={13} className="text-sky-400" />
                  <span>LinkedIn Profile</span>
                </a>

                <a
                  href={orgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--card-surface,#403C38)] hover:bg-[var(--card-elevated,#4A4642)] border border-white/[0.08] hover:border-amber-400/40 text-xs font-mono text-[var(--text-secondary,#FFF1D8)] hover:text-white transition-all"
                  title="Ariitii Tech Organization"
                >
                  <Building2 size={13} className="text-amber-400" />
                  <span>Ariitii Tech</span>
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Real GitHub Telemetry Profile Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="w-full max-w-md"
            >
              <div className="rounded-2xl p-6 bg-[var(--card-surface,#403C38)] border border-white/[0.08] shadow-2xl relative overflow-hidden">
                {/* Subtle Glow */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--primary-accent,#FFDD9B)]/5 rounded-full blur-3xl pointer-events-none" />

                {/* Profile Header with Real GitHub Info */}
                <div className="flex items-center gap-4 mb-5 pb-5 border-b border-white/[0.08]">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[var(--bg-base,#302E2D)] border border-[var(--primary-accent,#FFDD9B)]/40 flex-shrink-0 shadow-md">
                    <img
                      src={profile?.avatar_url || "https://avatars.githubusercontent.com/u/197728600?v=4"}
                      alt="Yihune Belay"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-lg font-bold text-white font-heading truncate">
                        {profile?.name || "Yihune Belay"}
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--primary-accent,#FFDD9B)]/15 text-[var(--primary-accent,#FFDD9B)] border border-[var(--primary-accent,#FFDD9B)]/30 flex-shrink-0">
                        <CheckCircle2 size={11} />
                        VERIFIED
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary,#FFF1D8)] font-mono truncate">
                      {profile?.company || "Software Engineering • Haramaya University"}
                    </p>
                    <p className="text-[11px] text-[var(--text-secondary,#FFF1D8)]/70 font-mono flex items-center gap-1 mt-0.5">
                      <MapPin size={11} className="text-[var(--primary-accent,#FFDD9B)]" />
                      {profile?.location || "Addis Ababa, Ethiopia"}
                    </p>
                  </div>
                </div>

                {/* Real Live Metrics from GitHub */}
                <div className="space-y-3 mb-5">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.05]">
                      <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-secondary,#FFF1D8)]/70 mb-1">
                        <FolderGit2 size={13} className="text-[var(--primary-accent,#FFDD9B)]" />
                        <span>Public Repos</span>
                      </div>
                      <span className="text-base font-bold text-white font-mono">
                        {profile?.public_repos ?? 23} Repositories
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.05]">
                      <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-secondary,#FFF1D8)]/70 mb-1">
                        <Users size={13} className="text-[var(--primary-accent,#FFDD9B)]" />
                        <span>GitHub Followers</span>
                      </div>
                      <span className="text-base font-bold text-white font-mono">
                        {profile?.followers ?? 33} Followers
                      </span>
                    </div>
                  </div>

                  {/* Real Latest GitHub Activity */}
                  <div className="p-3 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.05]">
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="text-[10px] text-[var(--primary-accent,#FFDD9B)] font-bold uppercase tracking-wider flex items-center gap-1">
                        <GitCommit size={12} />
                        Latest GitHub Activity
                      </span>
                      <span className="text-[10px] text-[#A8A29E]">
                        {formatEventTime(latestEvent?.created_at)}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-white truncate">
                      {latestEvent ? (
                        <>
                          <span className="text-emerald-400 font-bold mr-1.5">
                            {latestEvent.type === "PushEvent" ? "PUSH" : "CREATE"}
                          </span>
                          <span>{latestEvent.repo?.name}</span>
                        </>
                      ) : (
                        "PushEvent on yihune1234/myportfolio"
                      )}
                    </p>
                  </div>
                </div>

                {/* Availability Status Footer */}
                <div className="flex items-center justify-between text-xs font-mono pt-3 border-t border-white/[0.08] text-[var(--text-secondary,#FFF1D8)]/80">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Available for Work
                  </span>
                  <a
                    href={personalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[var(--primary-accent,#FFDD9B)] hover:underline flex items-center gap-1"
                  >
                    <span>@{personalLogin}</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
