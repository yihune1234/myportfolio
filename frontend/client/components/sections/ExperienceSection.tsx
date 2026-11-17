import { motion } from "framer-motion";
import { useGitHubSettings } from "@/hooks/useGitHubSettings";
import { Briefcase, Building2, ExternalLink, Calendar, MapPin, Tag } from "lucide-react";

export default function ExperienceSection() {
  const { data: settings } = useGitHubSettings();
  const orgLogin = settings?.githubOrg || "AriitiMarket";
  const orgUrl = `https://github.com/${orgLogin}`;

  const personalExperiences = [
    {
      position: "Software Engineering Intern",
      company: "INSA — Information Network Security Administration",
      period: "2024 — Present",
      location: "Addis Ababa, Ethiopia",
      scope: "Individual Professional Experience",
      gradient: "from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8]",
      accentColor: "text-[var(--primary-accent,#FFDD9B)]",
      bulletColor: "bg-[var(--primary-accent,#FFDD9B)]",
      responsibilities: [
        "Backend system development and hardened RESTful API architectural integration",
        "Cross-platform mobile application engineering with React Native and native bridges",
        "Database schema design, query index optimization, and persistence maintenance",
        "Secure system implementation, token rotation schemes, and vulnerability mitigation",
      ],
      technologies: ["Node.js", "Express", "React Native", "PostgreSQL", "Cybersecurity", "REST APIs"],
    },
    {
      position: "Full Stack Developer Intern",
      company: "Nile Tech",
      period: "2023 — 2024",
      location: "Addis Ababa, Ethiopia",
      scope: "Individual Professional Experience",
      gradient: "from-[var(--primary-accent,#FFDD9B)] to-[#FFF1D8]",
      accentColor: "text-[var(--primary-accent,#FFDD9B)]",
      bulletColor: "bg-[var(--primary-accent,#FFDD9B)]",
      responsibilities: [
        "Full stack web application development and production deployment pipelines",
        "RESTful API endpoint design and decoupled service integration",
        "Modern responsive UI/UX implementation with high-fidelity components",
        "Relational and NoSQL database management and transaction tuning",
      ],
      technologies: ["React", "TypeScript", "Node.js", "MongoDB", "Tailwind CSS"],
    },
  ];

  const organizationExperience = {
    role: "Co-Founder and Lead",
    organization: `Ariitii Tech (@${orgLogin})`,
    period: "2024 — Present",
    scope: "Technology Initiative & Leadership",
    url: orgUrl,
    gradient: "from-amber-400 to-amber-500",
    activities: [
      "Co-founding and leading the technology initiative originating at Haramaya University with three co-founders",
      "Leading software product architecture, digital platforms, and technology solutions",
      "Directing technical strategy, product roadmaps, and engineering execution",
      "Overseeing modern web architectures, mobile solutions, and enterprise platform delivery",
    ],
    technologies: ["Enterprise Architecture", "Cloud Platforms", "Digital Platforms", "Scalable Systems", "Security"],
  };

  return (
    <section
      id="experience"
      className="section-padding relative overflow-hidden bg-[var(--bg-base,#302E2D)] border-t border-white/[0.08]"
    >
      <div className="absolute -top-32 -right-32 w-[450px] h-[450px] bg-[var(--primary-accent,#FFDD9B)]/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 dot-matrix-grid opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center lg:text-left"
        >
          <span className="text-[11px] font-mono text-[var(--primary-accent,#FFDD9B)] uppercase tracking-[0.25em] font-bold block mb-2">
            Career Timeline & Involvements
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[var(--text-primary,#FFFFFF)] tracking-tight font-heading">
            Engineering Experience
          </h2>
          <p className="text-[var(--text-secondary,#FFF1D8)] text-sm sm:text-base max-w-2xl leading-relaxed mt-2 font-body mx-auto lg:mx-0">
            Professional industry engineering internships alongside initiative leadership as Co-Founder and Lead of Ariitii Tech.
          </p>
        </motion.div>

        {/* Section 1: Individual Industry Experience */}
        <div className="space-y-6 mb-12">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--primary-accent,#FFDD9B)] animate-pulse" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--primary-accent,#FFDD9B)] font-bold">
              Individual Industry Experience
            </h3>
          </div>

          {personalExperiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-6 sm:p-8 rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] hover:border-[var(--primary-accent,#FFDD9B)]/35 transition-all duration-300 shadow-xl"
            >
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-start sm:items-center gap-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${exp.gradient} shadow-lg shadow-[var(--primary-accent,#FFDD9B)]/15 group-hover:scale-105 transition-transform duration-300 flex-shrink-0`}
                    >
                      <Briefcase className="w-5 h-5 text-[#302E2D]" />
                    </div>
                    <div>
                      <h4 className="text-lg sm:text-xl font-bold text-[var(--text-primary,#FFFFFF)] group-hover:text-[var(--primary-accent,#FFDD9B)] transition-colors font-heading">
                        {exp.position}
                      </h4>
                      <p className="text-sm font-bold text-[var(--text-secondary,#FFF1D8)] mt-0.5">
                        {exp.company}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#A8A29E] self-start sm:self-center">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={12} className="text-[var(--primary-accent,#FFDD9B)]" />
                      {exp.period}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} />
                      {exp.location}
                    </span>
                  </div>
                </div>

                {/* Responsibilities */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
                  {exp.responsibilities.map((resp, rIdx) => (
                    <div
                      key={rIdx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-base,#302E2D)]/60 border border-white/[0.04] hover:bg-[var(--bg-base,#302E2D)] transition-all"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${exp.bulletColor} mt-1.5 flex-shrink-0`} />
                      <p className="text-xs text-[var(--text-secondary,#FFF1D8)] leading-relaxed font-medium">
                        {resp}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-white/[0.05]">
                  <span className="text-[10px] font-mono text-[#A8A29E] mr-1 uppercase">Stack:</span>
                  {exp.technologies.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--bg-base,#302E2D)] border border-white/[0.06] text-[var(--text-secondary,#FFF1D8)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Section 2: Organization Involvement Experience */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              Organization Development & Engineering Involvements
            </h3>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative p-6 sm:p-8 rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] hover:border-amber-500/35 transition-all duration-300 shadow-xl"
          >
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold text-[var(--text-primary,#FFFFFF)] group-hover:text-amber-300 transition-colors font-heading">
                      {organizationExperience.role}
                    </h4>
                    <p className="text-sm font-bold text-[var(--text-secondary,#FFF1D8)] mt-0.5">
                      {organizationExperience.organization}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-[#A8A29E]">
                    <Calendar size={12} className="text-amber-400" />
                    {organizationExperience.period}
                  </span>
                  <a
                    href={organizationExperience.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold transition-all w-fit"
                  >
                    <span>Explore Organization Repos</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* Activities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
                {organizationExperience.activities.map((act, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-base,#302E2D)]/60 border border-white/[0.04] hover:bg-[var(--bg-base,#302E2D)] transition-all"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    <p className="text-xs text-[var(--text-secondary,#FFF1D8)] leading-relaxed font-medium">
                      {act}
                    </p>
                  </div>
                ))}
              </div>

              {/* Technologies */}
              <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-white/[0.05]">
                <span className="text-[10px] font-mono text-[#A8A29E] mr-1 uppercase">Stack:</span>
                {organizationExperience.technologies.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--bg-base,#302E2D)] border border-white/[0.06] text-[var(--text-secondary,#FFF1D8)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
