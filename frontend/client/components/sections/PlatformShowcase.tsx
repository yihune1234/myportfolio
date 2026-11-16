import { motion } from "framer-motion";
import { Monitor, Smartphone, Globe, Gauge, Cpu, Layers } from "lucide-react";

export default function PlatformShowcase() {
  const platforms = [
    {
      title: "Web Platforms & SPAs",
      icon: Monitor,
      desc: "Responsive web architectures, real-time dashboards, and full-stack administrative consoles built for high-throughput interaction.",
      features: ["React 19 / Vite", "TypeScript", "Tailwind CSS", "TanStack Query", "RESTful / WebSockets"],
      badge: "Full-Stack Client",
      accent: "text-emerald-400 border-emerald-500/30",
    },
    {
      title: "Mobile Architectures",
      icon: Smartphone,
      desc: "Cross-platform mobile applications engineered with native bridge performance, offline persistence, and seamless push synchronization.",
      features: ["React Native", "Expo SDK", "Capacitor Hybrid", "Offline SQLite", "Push Services"],
      badge: "Cross-Platform",
      accent: "text-sky-400 border-sky-500/30",
    },
    {
      title: "API & Backend Services",
      icon: Globe,
      desc: "High-resilience microservices, rate-limited RESTful gateways, and relational/document persistence layers.",
      features: ["Node.js / Express", "Django / Python", "PostgreSQL / Mongo", "Redis Cache", "Docker Compose"],
      badge: "Core Infrastructure",
      accent: "text-amber-400 border-amber-500/30",
    },
    {
      title: "Performance & Security",
      icon: Gauge,
      desc: "Optimized client bundle splitting, CDN asset distribution, and hardened authentication controls.",
      features: ["Code Splitting", "ETag Caching", "JWT / RBAC", "Network Defense", "Lighthouse 95+"],
      badge: "Engineering Standard",
      accent: "text-teal-400 border-teal-500/30",
    },
  ];

  return (
    <section
      id="platforms"
      className="section-padding relative overflow-hidden bg-[var(--bg-base,#302E2D)] border-t border-white/[0.08]"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 dot-matrix-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] ambient-emerald-glow rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-[500px] h-[500px] ambient-amber-glow rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-[0.25em] font-bold block mb-2">
            Cross-Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[var(--text-primary,#FFFFFF)] tracking-tight font-heading">
            Platform Capabilities & Infrastructure
          </h2>
          <p className="text-[var(--text-secondary,#FFF1D8)] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mt-2 font-body">
            Architecting across web clients, native mobile platforms, and distributed backend clusters with unified data contracts.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {platforms.map((platform, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="card-slate rounded-2xl p-6 sm:p-8 flex flex-col justify-between group hover:border-emerald-500/30 transition-all duration-300 relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-[var(--bg-base,#302E2D)] border ${platform.accent}`}>
                      <platform.icon size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary,#FFFFFF)]">
                        {platform.title}
                      </h3>
                      <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                        {platform.badge}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[var(--text-secondary,#FFF1D8)] leading-relaxed mb-6 font-body">
                  {platform.desc}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/[0.04]">
                {platform.features.map((feature, fIdx) => (
                  <span
                    key={fIdx}
                    className="px-2.5 py-1 rounded-lg bg-[var(--bg-base,#302E2D)] border border-white/[0.06] text-[11px] font-mono text-[var(--text-secondary,#FFF1D8)] group-hover:text-[var(--text-primary,#FFFFFF)] transition-colors"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
