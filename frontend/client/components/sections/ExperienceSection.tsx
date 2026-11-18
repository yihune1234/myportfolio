import { motion } from "framer-motion";
import { useGitHubSettings } from "@/hooks/useGitHubSettings";
import { Briefcase, Building2, Calendar, MapPin, CheckCircle2 } from "lucide-react";

export default function ExperienceSection() {
  const { data: settings } = useGitHubSettings();
  const orgLogin = settings?.githubOrg || "AriitiMarket";
  const orgUrl = `https://github.com/${orgLogin}`;

  const experiences = [
    {
      position: "Software Engineering Intern",
      company: "INSA — Information Network Security Administration",
      period: "2024 — Present",
      location: "Addis Ababa, Ethiopia",
      type: "Industry Internship",
      badgeColor: "bg-[var(--primary-accent,#FFDD9B)]/15 text-[var(--primary-accent,#FFDD9B)] border-[var(--primary-accent,#FFDD9B)]/30",
      responsibilities: [
        "Architecting backend services and hardened RESTful API endpoints using Node.js and Express.",
        "Developing cross-platform mobile application modules with React Native and native bridges.",
        "Designing relational and document database schemas with PostgreSQL and MongoDB.",
        "Implementing secure authentication flows, token management, and defensive API validation.",
      ],
      technologies: ["Node.js", "Express", "React Native", "PostgreSQL", "Cybersecurity", "REST APIs"],
    },
    {
      position: "Full Stack Developer Intern",
      company: "Nile Tech",
      period: "2023 — 2024",
      location: "Addis Ababa, Ethiopia",
      type: "Industry Internship",
      badgeColor: "bg-[var(--primary-accent,#FFDD9B)]/15 text-[var(--primary-accent,#FFDD9B)] border-[var(--primary-accent,#FFDD9B)]/30",
      responsibilities: [
        "Engineered responsive user interfaces and full-stack web applications with React and TypeScript.",
        "Designed RESTful service endpoints and integrated asynchronous data synchronization.",
        "Managed database query performance and data modeling with MongoDB and relational databases.",
        "Participated in agile code reviews, component styling, and unit test implementations.",
      ],
      technologies: ["React", "TypeScript", "Node.js", "MongoDB", "Tailwind CSS"],
    },
    {
      position: "Co-Founder and Lead",
      company: `Ariitii Tech (@${orgLogin})`,
      period: "2024 — Present",
      location: "Haramaya University",
      type: "Initiative Leadership",
      url: orgUrl,
      badgeColor: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      responsibilities: [
        "Co-founding and leading the technology initiative originating at Haramaya University alongside three co-founders.",
        "Directing software product architecture, backend service design, and cross-platform mobile strategy.",
        "Leading development for campus commerce, marketplace platforms, and digital tools.",
        "Establishing engineering standards, code review workflows, and platform delivery pipelines.",
      ],
      technologies: ["System Architecture", "React", "Node.js", "Cloud Platforms", "Distributed Systems"],
    },
  ];

  return (
    <section
      id="experience"
      className="section-padding relative overflow-hidden bg-[var(--bg-base,#302E2D)] border-t border-white/[0.08]"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 dot-matrix-grid opacity-20 pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-[450px] h-[450px] bg-[var(--primary-accent,#FFDD9B)]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-accent,#FFDD9B)]/10 border border-[var(--primary-accent,#FFDD9B)]/25 text-[var(--primary-accent,#FFDD9B)] text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Briefcase size={13} />
            <span>Career &amp; Leadership</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-heading">
            Experience
          </h2>
          <p className="text-[var(--text-secondary,#FFF1D8)] text-sm sm:text-base max-w-2xl leading-relaxed mt-2 font-body mx-auto lg:mx-0">
            Professional software engineering internships alongside initiative leadership as Co-Founder and Lead at Ariitii Tech.
          </p>
        </motion.div>

        {/* Experience Timeline Cards */}
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-6 sm:p-8 rounded-2xl bg-[var(--card-surface,#403C38)] hover:bg-[var(--card-elevated,#4A4642)] border border-white/[0.08] hover:border-[var(--primary-accent,#FFDD9B)]/35 transition-all duration-300 shadow-xl"
            >
              {/* Header: Title, Company, Period, Location */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-5 border-b border-white/[0.06]">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg sm:text-xl font-bold text-white font-heading">
                      {exp.position}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${exp.badgeColor}`}>
                      {exp.type}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[var(--text-secondary,#FFF1D8)]">
                    {exp.company}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--text-secondary,#FFF1D8)]/70 self-start sm:self-center">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-[var(--primary-accent,#FFDD9B)]" />
                    <span>{exp.period}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} />
                    <span>{exp.location}</span>
                  </span>
                </div>
              </div>

              {/* Responsibilities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-6">
                {exp.responsibilities.map((resp, rIdx) => (
                  <div key={rIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--text-secondary,#FFF1D8)] leading-relaxed">
                    <CheckCircle2 size={15} className="text-[var(--primary-accent,#FFDD9B)] flex-shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </div>
                ))}
              </div>

              {/* Technologies */}
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/[0.06]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary,#FFF1D8)]/60 mr-2">
                  Technologies:
                </span>
                {exp.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-0.5 rounded-lg bg-[var(--bg-base,#302E2D)] border border-white/[0.06] text-xs font-mono text-[var(--text-secondary,#FFF1D8)]"
                  >
                    {tech}
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
