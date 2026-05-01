import { motion } from "framer-motion";
import { Briefcase, Calendar, CheckCircle2 } from "lucide-react";

export default function ExperienceSection() {
  const experiences = [
    {
      position: "Software Engineering Intern",
      company: "Information Network Security Administration (INSA)",
      period: "2023-2024",
      color: "bg-blue-100",
      responsibilities: [
        "Contributed to backend system development and RESTful API integration",
        "Developed and tested mobile applications using React Native",
        "Assisted in database design, optimization, and maintenance",
        "Supported secure system implementation and debugging processes",
        "Collaborated with cross-functional teams on system improvements",
      ],
    },
    {
      position: "Full Stack Developer Intern",
      company: "Nile Tech",
      period: "2022-2023",
      color: "bg-purple-100",
      responsibilities: [
        "Developed and maintained full stack web applications",
        "Built and integrated RESTful APIs for various services",
        "Designed and implemented user interfaces using modern web technologies",
        "Managed and optimized relational databases",
        "Participated in testing, debugging, and performance optimization",
      ],
    },
  ];

  return (
  return (
    <section id="experience" className="section-padding bg-white relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[35%] h-[35%] bg-primary/10 rounded-full blur-[110px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[25%] h-[25%] bg-secondary/10 rounded-full blur-[90px] -z-10" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center lg:text-left"
        >
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            Professional Journey
          </h2>
          <div className="h-1.5 w-20 bg-gradient-to-r from-primary to-secondary rounded-full mb-8 mx-auto lg:mx-0"></div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
            I've had the opportunity to work with innovative teams and organizations, gaining hands-on experience in full stack development and backend systems architecture.
          </p>
        </motion.div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-8 md:p-12 rounded-[2.5rem] group relative overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] border border-slate-100"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-6">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:scale-110 group-hover:border-primary/50 transition-all duration-500">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 group-hover:text-primary transition-colors">
                      {exp.position}
                    </h3>
                    <p className="text-lg font-bold text-slate-500 mt-1">
                      {exp.company}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 w-fit">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-slate-600 tracking-wide">
                    {exp.period}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exp.responsibilities.map((resp, rIdx) => (
                  <div key={rIdx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/30 hover:bg-white hover:shadow-lg transition-all">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-slate-600 leading-relaxed text-sm font-medium">
                      {resp}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
