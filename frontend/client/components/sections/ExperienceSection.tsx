import { motion } from "framer-motion";
import { Briefcase, Building2, ExternalLink, GitBranch, Layers } from "lucide-react";

export default function ExperienceSection() {
  const personalExperiences = [
    {
      position: "Software Engineering Intern",
      company: "INSA — Information Network Security Administration",
      scope: "Personal Professional Experience",
      gradient: "from-[#FF8A00] to-[#FF6B00]",
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
      gradient: "from-[#FF6B00] to-[#E85D00]",
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
    gradient: "from-amber-500 to-[#FF8A00]",
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
      className="section-padding relative overflow-hidden bg-background border-t border-white/[0.06]"
    >
      <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-[#FF8A00] opacity-[0.05] rounded-full blur-[150px]" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-[#FF8A00]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 left-1/4 w-[200px] h-[200px] bg-[#FFB020]/5 rounded-full blur-[90px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center lg:text-left"
        >
          <span className="text-[10px] font-mono text-[#FF8A00] uppercase tracking-[0.25em] font-bold">
            Career Timeline & Involvements
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-[#F5F7FA] mt-2 mb-4">
            Engineering Experience
          </h2>
          <p className="text-[#B7C0D1] text-base max-w-2xl leading-relaxed mx-auto lg:mx-0">
            Professional industry internships alongside verified technical contributions to the Ariiti Tech organization.
          </p>
        </motion.div>

        {/* Section 1: Personal Industry Experience */}
        <div className="space-y-6 mb-12">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
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
              className="group relative p-6 sm:p-8 rounded-2xl bg-[#0B1637] border border-white/[0.08] hover:bg-[#101B45] hover:border-[#FF8A00]/20 transition-all duration-500"
            >
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${exp.gradient} opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500`}
              />
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${exp.gradient} shadow-lg group-hover:scale-110 transition-transform duration-500`}
                    >
                      <Briefcase className="w-5 h-5 text-[#050816]" />
                    </div>
                    <div>
                      <h4 className="text-lg sm:text-xl font-bold text-[#F5F7FA] group-hover:text-[#FF8A00] transition-colors">
                        {exp.position}
                      </h4>
                      <p className="text-sm font-bold text-[#B7C0D1] mt-0.5">
                        {exp.company}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {exp.responsibilities.map((resp, rIdx) => (
                    <div
                      key={rIdx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] transition-all"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FF8A00] mt-1.5 flex-shrink-0" />
                      <p className="text-xs text-[#B7C0D1] leading-relaxed font-medium">
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
            className="group relative p-6 sm:p-8 rounded-2xl bg-[#0B1637] border border-white/[0.08] hover:bg-[#101B45] hover:border-amber-500/30 transition-all duration-500"
          >
            <div
              className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${organizationExperience.gradient} opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500`}
            />
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform duration-500">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold text-[#F5F7FA] group-hover:text-amber-300 transition-colors">
                      {organizationExperience.role}
                    </h4>
                    <p className="text-sm font-bold text-[#B7C0D1] mt-0.5">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {organizationExperience.activities.map((act, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] transition-all"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    <p className="text-xs text-[#B7C0D1] leading-relaxed font-medium">
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
