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
} from "lucide-react";
import { motion } from "framer-motion";
import { HeroGitHubPulse } from "./HeroGitHubPulse";

interface HeroSectionProps {
  onContactClick: () => void;
  onProjectsClick: () => void;
}

export default function HeroSection({
  onContactClick,
  onProjectsClick,
}: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative min-h-screen pt-28 pb-12 overflow-hidden"
      style={{
        background:
          "linear-gradient(90deg, #050816 0%, #0A1330 45%, #1A1325 100%)",
      }}
    >
      {/* Architecture Grid */}
      <div className="absolute inset-0 architecture-grid opacity-40" />

      {/* Top Right Orange Glow — main requested element */}
      <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-[#FF8A00] opacity-[0.08] rounded-full blur-[150px] animate-orange-pulse" />
      <div className="absolute top-1/4 -left-32 w-[400px] h-[400px] bg-[#0A1330] rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-32 w-[300px] h-[300px] bg-[#1A1325] rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#101B45] opacity-30 rounded-full blur-[200px]" />

      {/* Animated Rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 -left-20 w-40 h-40 border border-[#FF8A00]/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/3 -right-20 w-60 h-60 border border-[#FF8A00]/10 rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full flex items-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          {/* Content */}
          <div className="lg:col-span-7 relative z-10 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[#FF8A00] text-xs font-bold backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF8A00] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF8A00]"></span>
                  </span>
                  Available for new opportunities
                  <Sparkles className="w-3 h-3 ml-1 text-[#FF8A00]/70" />
                </div>
                <HeroGitHubPulse />
              </div>

              <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[#F5F7FA] mb-6 tracking-tighter leading-[0.9]">
                Hi, I'm{" "}
                <span className="gradient-text-accent">Yihune Belay</span>
                <br />
                <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#B7C0D1]/80">
                  Full-Stack Engineer
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#B7C0D1] leading-relaxed max-w-xl mb-10 font-medium mx-auto lg:mx-0">
                Building scalable backend systems, robust APIs, and
                cross-platform experiences. Focused on architecture,
                performance, and clean code.
              </p>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-6">
                <button
                  onClick={onContactClick}
                  className="group relative px-8 py-4 bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] text-[#050816] rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden hover:shadow-[0_0_40px_rgba(255,138,0,0.35)]"
                >
                  <span className="relative z-10">Let's Work Together</span>
                  <ArrowRight className="relative z-10 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={onProjectsClick}
                  className="px-8 py-4 bg-white/[0.03] text-[#D5D9E3] border border-white/[0.08] rounded-full font-bold hover:bg-white/[0.06] hover:text-[#F5F7FA] transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2 group"
                >
                  View My Work
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform opacity-50" />
                </button>
              </div>

              {/* Direct Profile Badges */}
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <a
                  href="https://github.com/yihune1234"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-emerald-500/30 text-xs font-mono text-[#B7C0D1] hover:text-[#F5F7FA] transition-all"
                  title="Personal GitHub Profile"
                >
                  <Github size={13} className="text-emerald-400" />
                  <span>yihune1234</span>
                </a>
                <a
                  href="https://linkedin.com/in/yihune-belay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-[#FF8A00]/30 text-xs font-mono text-[#B7C0D1] hover:text-[#F5F7FA] transition-all"
                  title="LinkedIn Profile"
                >
                  <Linkedin size={13} className="text-sky-400" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://github.com/AriitiMarket"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-amber-500/30 text-xs font-mono text-[#B7C0D1] hover:text-[#F5F7FA] transition-all"
                  title="Ariiti Tech Organization Profile"
                >
                  <Building2 size={13} className="text-amber-400" />
                  <span>AriitiMarket</span>
                </a>
              </div>
            </motion.div>
          </div>

          {/* Profile + Architecture Visual */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className="relative w-full max-w-sm"
            >
              {/* Orange glow behind card */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF8A00]/20 via-[#FF6B00]/10 to-transparent rounded-[2rem] blur-3xl" />

              {/* Main Card */}
              <div className="relative bg-[#0B1637] backdrop-blur-xl border border-white/[0.08] rounded-[2rem] p-4 shadow-2xl shadow-black/45">
                {/* Profile Photo */}
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 bg-[#050816]/50">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F729ed1e6158f4fddaa5c79dd9410d623%2F1fd6f14adfa546439d0e1614fe59db76?format=webp&width=400&height=400"
                    alt="Yihune Belay"
                    className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050816]/60 via-transparent to-transparent" />
                </div>

                {/* Architecture Icon Row */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[
                    { icon: Cpu, color: "from-[#FF8A00] to-[#FF6B00]" },
                    { icon: Database, color: "from-[#FF6B00] to-[#FF8A00]" },
                    { icon: Cpu, color: "from-[#FF8A00] to-amber-500" },
                    { icon: Code2, color: "from-amber-500 to-[#FF8A00]" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.08 }}
                      className={`p-2.5 rounded-xl bg-gradient-to-br ${item.color} shadow-lg flex items-center justify-center`}
                    >
                      <item.icon className="w-4 h-4 text-[#050816]" />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Organization Platform Identity Ribbon */}
              <div className="mt-3 p-3.5 rounded-2xl bg-[#0B1637]/90 border border-white/[0.08] backdrop-blur-xl flex items-center justify-between gap-3 shadow-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold block">
                      Organization Platform
                    </span>
                    <span className="text-xs font-bold text-[#F5F7FA]">
                      Ariiti Tech &bull; @AriitiMarket
                    </span>
                  </div>
                </div>
                <a
                  href="https://github.com/AriitiMarket"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold transition-all border border-amber-500/30 flex items-center gap-1"
                >
                  Explore
                  <ExternalLink size={10} />
                </a>
              </div>

              {/* Orbital Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-6 -right-6 w-16 h-16 border border-[#FF8A00]/20 rounded-full"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#FF8A00] rounded-full shadow-lg shadow-[#FF8A00]/50" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-bold text-[#D5D9E3] uppercase tracking-[0.2em]">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-4 h-6 rounded-full border border-white/[0.08] flex justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 bg-[#B7C0D1] rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
