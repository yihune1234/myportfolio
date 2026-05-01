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
    <section id="skills" className="section-padding bg-background relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-secondary/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center lg:text-left"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
            Skills & Expertise
          </h2>
          <div className="h-1.5 w-20 bg-gradient-to-r from-primary to-secondary rounded-full mb-8 mx-auto lg:mx-0"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0">
            Technologies and tools I use to build modern, scalable solutions.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-8 group relative overflow-hidden"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 group-hover:border-primary/50 transition-all duration-500">
                  <category.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white">{category.title}</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, idx) => (
                  <span 
                    key={idx} 
                    className="px-4 py-2 rounded-2xl bg-white/5 border border-white/5 text-[11px] font-bold text-muted-foreground hover:text-white hover:bg-primary/20 hover:border-primary/40 transition-all duration-300"
                  >
                    {skill}
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
