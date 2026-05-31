import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";

export default function ExperienceSection() {
  const experiences = [
    {
      position: "Software Engineering Intern",
      company: "INSA — Information Network Security Administration",
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
      gradient: "from-[#FF6B00] to-[#E85D00]",
      responsibilities: [
        "Full stack web application development and maintenance",
        "RESTful API design and integration",
        "Modern UI/UX implementation",
        "Database management and optimization",
      ],
    },
  ];

  return (
    <section id="experience" className="section-padding relative overflow-hidden bg-background border-t border-white/[0.06]">
      <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-[#FF8A00] opacity-[0.05] rounded-full blur-[150px]" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-[#FF8A00]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 left-1/4 w-[200px] h-[200px] bg-[#FFB020]/5 rounded-full blur-[90px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center lg:text-left"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-[#F5F7FA] mb-4">
            Experience
          </h2>
          <p className="text-[#B7C0D1] text-base max-w-2xl leading-relaxed mx-auto lg:mx-0">
            Hands-on engineering experience building production systems.
          </p>
        </motion.div>

        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-6 sm:p-8 rounded-2xl bg-[#0B1637] border border-white/[0.08] hover:bg-[#101B45] hover:border-[#FF8A00]/20 transition-all duration-500"
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${exp.gradient} opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${exp.gradient} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <Briefcase className="w-5 h-5 text-[#050816]" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#F5F7FA] group-hover:text-[#FF8A00] transition-colors">
                        {exp.position}
                      </h3>
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
      </div>
    </section>
  );
}
