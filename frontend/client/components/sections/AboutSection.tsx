import { motion } from "framer-motion";
import {
  Layers,
  ShieldCheck,
  Building2,
  Smartphone,
  Github,
  Binary,
  GitBranch,
  Terminal,
  ExternalLink,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchGitHubOverview } from "@/lib/githubApi";

export default function AboutSection() {
  const { data: overview } = useQuery({
    queryKey: ["github", "overview"],
    queryFn: () => fetchGitHubOverview(),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section
      id="about"
      className="section-padding relative overflow-hidden bg-[var(--bg-base,#302E2D)] border-t border-white/[0.08]"
    >
      {/* Subtle Dot Matrix & Ambient Glows */}
      <div className="absolute inset-0 dot-matrix-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] ambient-emerald-glow rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-[500px] h-[500px] ambient-amber-glow rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center lg:text-left"
        >
          <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-[0.25em] font-bold">
            Engineering Identity & Bento Overview
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[var(--text-primary,#FFFFFF)] mt-2 mb-3 tracking-tight font-heading">
            Architectural Focus & Organization
          </h2>
          <p className="text-[var(--text-secondary,#FFF1D8)] text-sm sm:text-base max-w-2xl leading-relaxed mx-auto lg:mx-0 font-body">
            Software engineer based in Addis Ababa, Ethiopia, pursuing Software Engineering
            at Haramaya University. Constructing resilient backend systems, secure APIs, and organizational technology at scale.
          </p>
        </motion.div>

        {/* Refined Bento Grid (4 Primary Content Areas) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 mb-10">
          {/* Bento Card 1: Full-Stack & Security Engineering (Span 7) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 card-slate rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                    Domain 01 // Core Specialization
                  </span>
                  <h3 className="text-xl font-bold text-[var(--text-primary,#FFFFFF)]">
                    Full-Stack & Security Architecture
                  </h3>
                </div>
              </div>

              <p className="text-sm text-[var(--text-secondary,#FFF1D8)] leading-relaxed mb-6">
                Specialized in architecting hardened REST APIs, token authentication flows (JWT/Bcrypt),
                and decoupled microservice pipelines. Designing database schemas with MongoDB and PostgreSQL
                optimized for sub-50ms execution times and strict isolation barriers.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-4 border-t border-white/[0.06] text-xs font-mono">
              <div className="p-2 rounded-lg bg-[var(--bg-base,#302E2D)]/60 border border-white/[0.04]">
                <span className="text-[10px] text-[#64748B] block">AUTH SPEC</span>
                <span className="text-[var(--text-primary,#FFFFFF)] font-semibold">JWT + Argon2</span>
              </div>
              <div className="p-2 rounded-lg bg-[var(--bg-base,#302E2D)]/60 border border-white/[0.04]">
                <span className="text-[10px] text-[#64748B] block">API STYLE</span>
                <span className="text-[var(--text-primary,#FFFFFF)] font-semibold">RESTful / RPC</span>
              </div>
              <div className="p-2 rounded-lg bg-[var(--bg-base,#302E2D)]/60 border border-white/[0.04] col-span-2 sm:col-span-1">
                <span className="text-[10px] text-[#64748B] block">DEFENSE</span>
                <span className="text-emerald-400 font-semibold">CORS & RateLimit</span>
              </div>
            </div>
          </motion.div>

          {/* Bento Card 2: Organization & Venture Development (Span 5) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 card-slate card-org-hover rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors" />

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Building2 size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                    Domain 02 // Venture Ecosystem
                  </span>
                  <h3 className="text-xl font-bold text-[var(--text-primary,#FFFFFF)]">
                    Ariiti Tech Platform
                  </h3>
                </div>
              </div>

              <p className="text-sm text-[var(--text-secondary,#FFF1D8)] leading-relaxed mb-6">
                Directing open platform repositories under <code className="text-amber-300 font-mono bg-amber-500/10 px-1 rounded">@AriitiMarket</code>.
                Building modular digital commerce infrastructure, developer integration SDKs, and high-concurrency payment gateways.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-base,#302E2D)]/80 border border-amber-500/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#64748B] block">CONTRIBUTOR ROLE</span>
                <span className="text-xs font-bold text-[var(--text-primary,#FFFFFF)]">Platform Architecture Lead</span>
              </div>
              <a
                href="https://github.com/AriitiMarket"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-colors"
                title="View Organization on GitHub"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>

          {/* Bento Card 3: Offline-First & Mobile Systems (Span 5) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-5 card-slate rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-500/10 transition-colors" />

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                  <Smartphone size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-bold block">
                    Domain 03 // Edge & Mobile
                  </span>
                  <h3 className="text-xl font-bold text-[var(--text-primary,#FFFFFF)]">
                    Offline-First Systems
                  </h3>
                </div>
              </div>

              <p className="text-sm text-[var(--text-secondary,#FFF1D8)] leading-relaxed mb-6">
                Creating cross-platform mobile experiences with React Native, Expo, and Capacitor.
                Engineering local SQLite and WatermelonDB synchronization routines to operate seamlessly
                in intermittent internet environments across East Africa.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded bg-[var(--bg-base,#302E2D)] border border-white/[0.05] text-[var(--text-primary,#FFFFFF)]">
                SQLite Cache
              </span>
              <span className="px-2.5 py-1 rounded bg-[var(--bg-base,#302E2D)] border border-white/[0.05] text-[var(--text-primary,#FFFFFF)]">
                Conflict Resolution
              </span>
              <span className="px-2.5 py-1 rounded bg-[var(--bg-base,#302E2D)] border border-white/[0.05] text-[var(--text-primary,#FFFFFF)]">
                React Native
              </span>
            </div>
          </motion.div>

          {/* Bento Card 4: Live GitHub Engineering Summary (Span 7) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-7 card-slate rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Binary size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                      Domain 04 // Verified Telemetry
                    </span>
                    <h3 className="text-xl font-bold text-[var(--text-primary,#FFFFFF)]">
                      Contribution Distinction & Scale
                    </h3>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-[var(--text-secondary,#FFF1D8)] border border-white/[0.06]">
                  25.4 MB LINGUIST
                </span>
              </div>

              <p className="text-sm text-[var(--text-secondary,#FFF1D8)] leading-relaxed mb-4">
                A transparent separation between individual engineering experiments and organization infrastructure.
                Public activities are fetched via verified GitHub telemetry without inflating commit metrics:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-[var(--bg-base,#302E2D)]/80 border border-emerald-500/20">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 mb-1">
                    <CheckCircle2 size={13} />
                    <span>Personal Lab (@yihune1234)</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary,#FFF1D8)]">
                    100% individual authorship, autonomous prototyping, and dedicated research repositories.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[var(--bg-base,#302E2D)]/80 border border-amber-500/20">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 mb-1">
                    <CheckCircle2 size={13} />
                    <span>Ariiti Tech (@AriitiMarket)</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary,#FFF1D8)]">
                    Multi-contributor platform engineering, shared pull request reviews, and ecosystem tooling.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-[#64748B] pt-3 border-t border-white/[0.06]">
              <span>ETag-Cached Multi-Source Aggregation</span>
              <span className="text-emerald-400 font-semibold">Zero Fake Metrics</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
