import { motion } from "framer-motion";
import {
  ShieldCheck,
  Layers,
  Smartphone,
  CheckCircle2,
  Code2,
  Database,
  Terminal,
} from "lucide-react";

export default function AboutSection() {
  const principles = [
    {
      icon: ShieldCheck,
      title: "Resilient System Architecture",
      subtitle: "Backend Services & APIs",
      description:
        "Designing modular, maintainable server-side architectures and clean RESTful APIs with structured data models, token security, and predictable performance.",
      practices: ["Clean Architecture", "RESTful API Standards", "Security Best Practices", "Database Optimization"],
    },
    {
      icon: Layers,
      title: "Scalable Full-Stack Development",
      subtitle: "Web & Distributed Systems",
      description:
        "Bridging intuitive user interfaces with robust server logic. Delivering reliable end-to-end features through clean TypeScript codebases and modern frameworks.",
      practices: ["React & Modern Frontend", "Node.js & Express / NestJS", "PostgreSQL & MongoDB", "Component Systems"],
    },
    {
      icon: Smartphone,
      title: "Practical & Offline-First Solutions",
      subtitle: "Mobile & Real-World Reliability",
      description:
        "Engineering cross-platform applications and data synchronization workflows that function dependably even with intermittent network connectivity.",
      practices: ["React Native Cross-Platform", "Local SQLite Storage", "Data Conflict Handling", "Responsive UI/UX"],
    },
  ];

  return (
    <section
      id="about"
      className="section-padding relative overflow-hidden bg-[var(--bg-base,#302E2D)] border-t border-white/[0.08]"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 dot-matrix-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] bg-[var(--primary-accent,#FFDD9B)]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-[500px] h-[500px] bg-[var(--primary-accent,#FFDD9B)]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-accent,#FFDD9B)]/10 border border-[var(--primary-accent,#FFDD9B)]/25 text-[var(--primary-accent,#FFDD9B)] text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Terminal size={13} />
            <span>Core Principles</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-heading">
            Engineering Approach
          </h2>
          <p className="text-[var(--text-secondary,#FFF1D8)] text-sm sm:text-base max-w-2xl leading-relaxed mt-2 font-body mx-auto lg:mx-0">
            Core principles and technical standards that guide how I design, construct, and maintain scalable software applications.
          </p>
        </motion.div>

        {/* 3 Principles Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {principles.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group p-6 sm:p-7 rounded-2xl bg-[var(--card-surface,#403C38)] hover:bg-[var(--card-elevated,#4A4642)] border border-white/[0.08] hover:border-[var(--primary-accent,#FFDD9B)]/35 transition-all duration-300 flex flex-col justify-between shadow-lg"
              >
                <div>
                  {/* Icon & Subtitle */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.06] text-[var(--primary-accent,#FFDD9B)] group-hover:scale-105 transition-transform">
                      <Icon size={22} />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--primary-accent,#FFDD9B)] font-bold block">
                        {principle.subtitle}
                      </span>
                      <h3 className="text-lg font-bold text-white font-heading leading-tight">
                        {principle.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[var(--text-secondary,#FFF1D8)] leading-relaxed font-body mb-5">
                    {principle.description}
                  </p>
                </div>

                {/* Practices checklist */}
                <div className="pt-4 border-t border-white/[0.06] space-y-2">
                  {principle.practices.map((practice) => (
                    <div
                      key={practice}
                      className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary,#FFF1D8)]/90"
                    >
                      <CheckCircle2 size={13} className="text-[var(--primary-accent,#FFDD9B)] flex-shrink-0" />
                      <span>{practice}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
