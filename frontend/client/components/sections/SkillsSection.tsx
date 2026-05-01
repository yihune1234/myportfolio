import { motion } from "framer-motion";
import { Code2, Database, Smartphone, Wrench, Terminal } from "lucide-react";

export default function SkillsSection() {
  const skillCategories = [
    {
      title: "Backend",
      skills: ["Node.js", "Django", "PHP", "REST APIs", "System Architecture", "Security"],
      icon: Database,
      color: "bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600",
      border: "border-blue-200"
    },
    {
      title: "Frontend",
      skills: ["React", "TypeScript", "Tailwind CSS", "HTML5/CSS3", "Next.js", "Responsive Design"],
      icon: Code2,
      color: "bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600",
      border: "border-purple-200"
    },
    {
      title: "DevOps",
      skills: ["PostgreSQL", "MongoDB", "Docker", "Git", "CI/CD", "Linux"],
      icon: Terminal,
      color: "bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600",
      border: "border-emerald-200"
    },
    {
      title: "Tools",
      skills: ["JavaScript", "Python", "SQL", "Postman", "VS Code", "AWS"],
      icon: Wrench,
      color: "bg-gradient-to-br from-orange-100 to-orange-50 text-orange-600",
      border: "border-orange-200"
    },
  ];

  return (
    <section id="skills" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Skills & Expertise
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6"></div>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl">
            Technologies and tools I use to build modern, scalable solutions.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 sm:p-8 rounded-xl border-2 ${category.border} ${category.color} bg-white hover:shadow-lg transition-all duration-300 group`}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className={`p-3 rounded-lg ${category.color}`}>
                  <category.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">{category.title}</h3>
              </div>

              <div className="space-y-2">
                {category.skills.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
                    <span className="text-sm text-slate-700">{skill}</span>
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
