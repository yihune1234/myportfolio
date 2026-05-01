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
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-purple-50 to-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Professional Journey
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6"></div>
          <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
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
              className={`p-8 md:p-12 rounded-xl border-2 ${index === 0 ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-white' : 'border-purple-200 bg-gradient-to-br from-purple-50 to-white'} hover:shadow-lg transition-all group`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-6">
                  <div className={`p-3 rounded-lg ${exp.color} text-blue-600`}>
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`text-2xl md:text-3xl font-black text-slate-900 group-hover:${index === 0 ? 'text-blue-600' : 'text-purple-600'} transition-colors`}>
                      {exp.position}
                    </h3>
                    <p className="text-lg font-bold text-slate-600">
                      {exp.company}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${index === 0 ? 'bg-blue-50 border-blue-200' : 'bg-purple-50 border-purple-200'}`}>
                  <Calendar className={`w-4 h-4 ${index === 0 ? 'text-blue-600' : 'text-purple-600'}`} />
                  <span className={`text-sm font-bold ${index === 0 ? 'text-blue-600' : 'text-purple-600'}`}>
                    {exp.period}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exp.responsibilities.map((resp, rIdx) => (
                  <div key={rIdx} className={`flex items-start gap-3 p-3 rounded-lg border-2 ${index === 0 ? 'bg-blue-50 border-blue-100 hover:border-blue-200' : 'bg-purple-50 border-purple-100 hover:border-purple-200'} transition-all`}>
                    <CheckCircle2 className={`w-5 h-5 ${index === 0 ? 'text-blue-600' : 'text-purple-600'} mt-0.5 flex-shrink-0`} />
                    <p className="text-slate-700 leading-relaxed text-sm font-medium">
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
