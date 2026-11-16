import { motion } from "framer-motion";
import { Layers, Cpu, ShieldCheck, GitBranch, Github, Building2, Binary } from "lucide-react";

export default function AboutSection() {
  const highlights = [
    {
      icon: Layers,
      title: "Full-Stack Engineering",
      desc: "Scalable backend systems, RESTful APIs, and responsive frontends built with modern architectures.",
    },
    {
      icon: Cpu,
      title: "Systems Thinker",
      desc: "Designing distributed, fault-tolerant systems with clean separation of concerns.",
    },
    {
      icon: ShieldCheck,
      title: "Security Focused",
      desc: "Implementing auth, encryption, and secure API patterns across the stack.",
    },
    {
      icon: GitBranch,
      title: "DevOps Mindset",
      desc: "CI/CD pipelines, containerization, cloud deployment, and infrastructure automation.",
    },
  ];

  return (
    <section
      id="about"
      className="section-padding relative overflow-hidden border-t border-white/[0.06]"
      style={{
        background:
          "linear-gradient(90deg, #050816 0%, #0A1330 45%, #1A1325 100%)",
      }}
    >
      <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-[#FF8A00] opacity-[0.05] rounded-full blur-[150px]" />
      <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-[#0A1330] rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[200px] h-[200px] bg-[#1A1325] rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center lg:text-left"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-[#F5F7FA] mb-4">
            About Me
          </h2>
          <p className="text-[#B7C0D1] text-base max-w-2xl leading-relaxed mx-auto lg:mx-0">
            Software engineer based in Addis Ababa, Ethiopia. Currently pursuing
            Software Engineering at Haramaya University, building production
            systems and digital infrastructure.
          </p>

          {/* Verified Engineering Identity Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-8 max-w-4xl mx-auto lg:mx-0">
            <a
              href="https://github.com/yihune1234"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3.5 rounded-xl bg-[#0B1637]/80 border border-white/[0.08] hover:border-emerald-500/30 transition-all flex items-center gap-3"
            >
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
                <Github className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                  Personal Lab
                </div>
                <div className="text-xs font-bold text-[#F5F7FA]">
                  @yihune1234 &bull; 27 Public Repos
                </div>
              </div>
            </a>

            <a
              href="https://github.com/AriitiMarket"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3.5 rounded-xl bg-[#0B1637]/80 border border-white/[0.08] hover:border-amber-500/30 transition-all flex items-center gap-3"
            >
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:scale-105 transition-transform">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                  Organization Platform
                </div>
                <div className="text-xs font-bold text-[#F5F7FA]">
                  @AriitiMarket &bull; Contributor
                </div>
              </div>
            </a>

            <div className="p-3.5 rounded-xl bg-[#0B1637]/80 border border-white/[0.08] flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#FF8A00]/10 text-[#FF8A00]">
                <Binary className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#FF8A00] font-semibold">
                  Verified Codebase
                </div>
                <div className="text-xs font-bold text-[#F5F7FA]">
                  25.4 MB &bull; JS, PHP, TS Stack
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {highlights.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-6 rounded-2xl bg-[#0B1637] border border-white/[0.08] hover:bg-[#101B45] hover:border-[#FF8A00]/30 transition-all duration-500"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FF8A00]/5 to-[#FF6B00]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#FF8A00]/10 to-[#FF6B00]/10 border border-[#FF8A00]/10 w-fit mb-5 group-hover:scale-110 transition-transform duration-500">
                  <item.icon className="w-5 h-5 text-[#FF8A00]" />
                </div>
                <h3 className="text-lg font-bold text-[#F5F7FA] mb-3 group-hover:text-[#FF8A00] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#B7C0D1] leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
