import { motion } from "framer-motion";
import { Briefcase, Building2, ExternalLink } from "lucide-react";

export default function ExperienceSection() {
  const personalExperiences = [
    {
      position: "Software Engineering Intern",
      company: "INSA — Information Network Security Administration",
      scope: "Personal Professional Experience",
      gradient: "from-emerald-500 to-teal-400",
      accentColor: "text-emerald-400",
      bulletColor: "bg-emerald-400",
      responsibilities: [
        "Backend system development and RESTful API integration",
        "Mobile application development with React Native",
        "Database design, optimization, and maintenance",
        "Secure system implementation and debugging",
      ],
    },
    {
      position: "Full Stack Developer Intern",
      company: "Nile Tech",
      scope: "Personal Professional Experience",
      gradient: "from-teal-500 to-cyan-400",
      accentColor: "text-teal-400",
      bulletColor: "bg-teal-400",
      responsibilities: [
        "Full stack web application development and maintenance",
        "RESTful API design and integration",
        "Modern UI/UX implementation",
        "Database management and optimization",
      ],
    },
  ];

  const organizationExperience = {
    role: "Platform Architecture & Engineering Contributor",
    organization: "Ariiti Tech Ecosystem (@AriitiMarket)",
    scope: "Organization Development Activities",
    url: "https://github.com/AriitiMarket",
    gradient: "from-amber-500 to-orange-500",
    activities: [
      "Modular repository structure and distributed API architecture design",
      "E-commerce backend services, database schema modeling, and endpoint security",
      "Automated CI/CD workflows and multi-service deployment pipelines",
      "Collaborative pull request reviews and public repository documentation",
    ],
  };

  return (
    <section
      id="experience"
      className="section-padding relative overflow-hidden bg-background border-t border-white/[0.08]"
    >
      <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 dot-matrix-grid opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center lg:text-left"
        >
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-[0.25em] font-bold">
            Career Timeline & Involvements
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-[var(--text-primary,#FFFFFF)] mt-2 mb-4">
            Engineering Experience
          </h2>
          <p className="text-[var(--text-secondary,#FFF1D8)] text-base max-w-2xl leading-relaxed mx-auto lg:mx-0">
            Professional industry internships alongside verified technical contributions to the Ariiti Tech organization.
          </p>
        </motion.div>

        {/* Section 1: Personal Industry Experience */}
        <div className="space-y-6 mb-12">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
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
              className="group relative p-6 sm:p-8 rounded-2xl bg-[var(--card-surface,#3A3836)] border border-white/[0.08] hover:border-emerald-500/30 transition-all duration-300"
            >
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${exp.gradient} shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300`}
                    >
                      <Briefcase className="w-5 h-5 text-[var(--bg-base,#302E2D)]" />
                    </div>
                    <div>
                      <h4 className="text-lg sm:text-xl font-bold text-[var(--text-primary,#FFFFFF)] group-hover:text-emerald-400 transition-colors">
                        {exp.position}
                      </h4>
                      <p className="text-sm font-bold text-[var(--text-secondary,#FFF1D8)] mt-0.5">
                        {exp.company}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {exp.responsibilities.map((resp, rIdx) => (
                    <div
                      key={rIdx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${exp.bulletColor} mt-1.5 flex-shrink-0`} />
                      <p className="text-xs text-[var(--text-secondary,#FFF1D8)] leading-relaxed font-medium">
                        {resp}
                      </p>
                    </div>
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
            className="group relative p-6 sm:p-8 rounded-2xl bg-[var(--card-surface,#3A3836)] border border-white/[0.08] hover:border-amber-500/30 transition-all duration-300"
          >
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-105 transition-transform duration-300">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold text-[var(--text-primary,#FFFFFF)] group-hover:text-amber-300 transition-colors">
                      {organizationExperience.role}
                    </h4>
                    <p className="text-sm font-bold text-[var(--text-secondary,#FFF1D8)] mt-0.5">
                      {organizationExperience.organization}
                    </p>
                  </div>
                </div>

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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {organizationExperience.activities.map((act, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    <p className="text-xs text-[var(--text-secondary,#FFF1D8)] leading-relaxed font-medium">
                      {act}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
