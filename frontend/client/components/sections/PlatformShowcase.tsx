import { motion } from "framer-motion";
import { useGitHubSettings } from "@/hooks/useGitHubSettings";
import {
  Building2,
  ExternalLink,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Smartphone,
  Server,
  Globe,
  ArrowUpRight,
  Activity,
  Cpu,
  Database,
  Lock,
} from "lucide-react";

export default function PlatformShowcase() {
  const { data: settings } = useGitHubSettings();
  const orgLogin = settings?.githubOrg || "AriitiMarket";
  const orgUrl = `https://github.com/${orgLogin}`;

  const featuredCapabilities = [
    "Multi-tenant schema isolation with tenant-scoped MongoDB & PostgreSQL clusters",
    "Sub-50ms API response latency via Redis cache indexing & ETag validations",
    "Real-time webhook dispatcher with automated idempotency & exponential backoff",
    "Granular Role-Based Access Control (RBAC) with token rotation & audit logging",
  ];

  const featuredTechStack = [
    "Node.js",
    "Express",
    "React 19",
    "TypeScript",
    "Redis",
    "PostgreSQL",
    "Docker",
    "Tailwind CSS",
  ];

  const supportingPlatforms = [
    {
      title: "Ariiti Mobile Merchant & Offline POS",
      subtitle: "Offline-First Mobile Commerce Engine",
      icon: Smartphone,
      accent: "text-[var(--primary-accent,#FFDD9B)] border-[var(--primary-accent,#FFDD9B)]/30",
      badge: "Mobile Architecture",
      desc: "Cross-platform merchant console with embedded SQLite persistence and conflict-free delta sync designed for intermittent mobile connectivity.",
      capabilities: [
        "Local SQLite cache with background transaction synchronization",
        "Deterministic conflict resolution for concurrent inventory updates",
        "Biometric merchant authentication and hardware barcode integration",
      ],
      tech: ["React Native", "Expo SDK", "SQLite", "WatermelonDB", "JWT"],
      url: orgUrl,
    },
    {
      title: "Distributed Microservices & Event Gateway",
      subtitle: "High-Throughput Ingestion & Authentication Proxy",
      icon: Server,
      accent: "text-amber-400 border-amber-500/30",
      badge: "Core Infrastructure",
      desc: "Asynchronous API gateway handling authentication verification, rate-limiting, and request routing across organization microservices.",
      capabilities: [
        "Token verification middleware and IP-based distributed rate limiting",
        "Zero-downtime containerized deploys with automated health monitoring",
        "Real-time service health monitoring and centralized audit logs",
      ],
      tech: ["Node.js", "Redis", "Nginx", "Docker Compose", "Prometheus"],
      url: orgUrl,
    },
  ];

  return (
    <section
      id="platforms"
      className="section-padding relative overflow-hidden bg-[var(--bg-base,#302E2D)] border-t border-white/[0.08]"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 dot-matrix-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 -right-32 w-[550px] h-[550px] bg-[var(--primary-accent,#FFDD9B)]/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center lg:text-left"
        >
          <span className="text-[11px] font-mono text-[var(--primary-accent,#FFDD9B)] uppercase tracking-[0.25em] font-bold block mb-2">
            Enterprise Platforms & Product Architectures
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[var(--text-primary,#FFFFFF)] tracking-tight font-heading">
            Products & Solutions
          </h2>
          <p className="text-[var(--text-secondary,#FFF1D8)] text-sm sm:text-base max-w-2xl leading-relaxed mt-2 font-body mx-auto lg:mx-0">
            Scalable digital systems and product platforms engineered for multi-tenant organizations,
            high-volume commerce, and low-latency distributed operations.
          </p>
        </motion.div>

        {/* Featured Platform Showcase (Large Heroic Card) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="card-slate rounded-3xl p-6 sm:p-10 mb-8 border border-[var(--primary-accent,#FFDD9B)]/25 relative overflow-hidden group shadow-2xl shadow-black/40"
        >
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-[var(--primary-accent,#FFDD9B)]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Platform Overview, Capabilities & Actions (Span 7) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--primary-accent,#FFDD9B)]/15 text-[var(--primary-accent,#FFDD9B)] border border-[var(--primary-accent,#FFDD9B)]/30">
                    Flagship Architecture
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                    <Building2 className="w-3 h-3" />
                    Ariiti Tech Platform
                  </span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-black text-[var(--text-primary,#FFFFFF)] tracking-tight mb-3 font-heading">
                  Ariiti Market Enterprise Platform
                </h3>

                <p className="text-sm sm:text-base text-[var(--text-secondary,#FFF1D8)] leading-relaxed mb-6 font-body">
                  A high-availability multi-tenant digital commerce infrastructure engineered for Ethiopian and East African enterprises.
                  Combines modular merchant portals, distributed order routing, telemetric inventory tracking, and unified local payment reconciliation.
                </p>

                {/* Key Capabilities */}
                <div className="space-y-2.5 mb-6">
                  {featuredCapabilities.map((cap, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[var(--primary-accent,#FFDD9B)] mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-[var(--text-secondary,#FFF1D8)] leading-relaxed">
                        {cap}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Technology Badges */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {featuredTechStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs font-mono text-[var(--text-secondary,#FFF1D8)] font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/[0.06]">
                <a
                  href={orgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] hover:brightness-105 text-[#302E2D] rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[var(--primary-accent,#FFDD9B)]/20 active:scale-95"
                >
                  <span>Explore Platform Organization</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <a
                  href="#contact"
                  className="px-6 py-3 bg-[var(--card-surface,#403C38)] hover:bg-[var(--card-elevated,#4A4642)] text-[var(--text-primary,#FFFFFF)] border border-white/[0.1] rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <span>Architecture Brief</span>
                  <ArrowUpRight className="w-4 h-4 text-[var(--text-secondary,#FFF1D8)]" />
                </a>
              </div>
            </div>

            {/* Right: Architectural Console Preview Window (Span 5) */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-[var(--bg-base,#302E2D)]/95 border border-white/[0.1] overflow-hidden shadow-2xl p-5 relative">
                {/* Console Title Bar */}
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 font-mono text-[10px] text-[#A8A29E] tracking-wider uppercase">
                      platform-core // gateway.ariiti.com
                    </span>
                  </div>
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                    ONLINE 99.98%
                  </span>
                </div>

                {/* Performance & Architecture Highlights */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-[var(--card-surface,#403C38)]/60 border border-white/[0.04]">
                    <span className="text-[10px] font-mono text-[#A8A29E] block mb-0.5">AVG LATENCY</span>
                    <span className="text-base font-bold font-mono text-[var(--primary-accent,#FFDD9B)]">38.4 ms</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--card-surface,#403C38)]/60 border border-white/[0.04]">
                    <span className="text-[10px] font-mono text-[#A8A29E] block mb-0.5">SECURITY PROTOCOL</span>
                    <span className="text-base font-bold font-mono text-[var(--text-primary,#FFFFFF)]">JWT + RBAC</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--card-surface,#403C38)]/60 border border-white/[0.04]">
                    <span className="text-[10px] font-mono text-[#A8A29E] block mb-0.5">TENANTS</span>
                    <span className="text-base font-bold font-mono text-amber-400">Partitioned</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--card-surface,#403C38)]/60 border border-white/[0.04]">
                    <span className="text-[10px] font-mono text-[#A8A29E] block mb-0.5">CACHE HIT</span>
                    <span className="text-base font-bold font-mono text-emerald-400">94.2%</span>
                  </div>
                </div>

                {/* Simulated Stream Feed */}
                <div className="space-y-2 p-3 rounded-xl bg-black/40 border border-white/[0.04] text-[11px] font-mono">
                  <div className="flex items-center justify-between text-[#A8A29E]">
                    <span className="text-[var(--primary-accent,#FFDD9B)]">&gt; GET /api/v1/merchants/catalog</span>
                    <span className="text-emerald-400">200 OK</span>
                  </div>
                  <div className="flex items-center justify-between text-[#A8A29E]">
                    <span className="text-amber-400">&gt; POST /api/v1/orders/dispatch</span>
                    <span className="text-emerald-400">201 CREATED</span>
                  </div>
                  <div className="flex items-center justify-between text-[#A8A29E]">
                    <span className="text-[#FFF1D8]">&gt; POST /api/v1/webhooks/payment</span>
                    <span className="text-emerald-400">200 VERIFIED</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-[#A8A29E]">
                  <span>Infrastructure: High-Availability Cloud</span>
                  <span className="text-[var(--primary-accent,#FFDD9B)]">Production Certified</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Supporting Platform Cards (2 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {supportingPlatforms.map((platform, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-slate rounded-2xl p-6 sm:p-8 flex flex-col justify-between group hover:border-[var(--primary-accent,#FFDD9B)]/30 transition-all duration-300 relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-[var(--bg-base,#302E2D)] border ${platform.accent}`}>
                      <platform.icon size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary,#FFFFFF)] font-heading">
                        {platform.title}
                      </h3>
                      <span className="text-[10px] font-mono text-[var(--primary-accent,#FFDD9B)] uppercase tracking-wider font-semibold">
                        {platform.badge}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[var(--text-secondary,#FFF1D8)] leading-relaxed mb-5 font-body">
                  {platform.desc}
                </p>

                {/* Capabilities list */}
                <div className="space-y-2 mb-6">
                  {platform.capabilities.map((c, cIdx) => (
                    <div key={cIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-accent,#FFDD9B)] mt-1.5 flex-shrink-0" />
                      <span className="text-xs text-[var(--text-secondary,#FFF1D8)] leading-relaxed">
                        {c}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.04] mb-4">
                  {platform.tech.map((t, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-lg bg-[var(--bg-base,#302E2D)] border border-white/[0.06] text-[11px] font-mono text-[var(--text-secondary,#FFF1D8)] group-hover:text-[var(--text-primary,#FFFFFF)] transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Action Link */}
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--primary-accent,#FFDD9B)] hover:underline"
                >
                  <span>Explore Repository Spec</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
