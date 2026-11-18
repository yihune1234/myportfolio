import { motion } from "framer-motion";
import { TechIcon } from "@/components/tech/TechIcon";
import { Code2, Server, Database, Smartphone, Wrench, Layers } from "lucide-react";

interface TechItem {
  name: string;
  icon: string;
}

interface TechCategory {
  title: string;
  icon: any;
  items: TechItem[];
}

const TECH_CATEGORIES: TechCategory[] = [
  {
    title: "Programming Languages",
    icon: Code2,
    items: [
      { name: "TypeScript", icon: "typescript" },
      { name: "JavaScript", icon: "javascript" },
      { name: "Python", icon: "python" },
      { name: "PHP", icon: "php" },
      { name: "HTML5", icon: "html5" },
      { name: "CSS3", icon: "css3" },
      { name: "SQL", icon: "database" },
      { name: "C++", icon: "c++" },
    ],
  },
  {
    title: "Frontend Development",
    icon: Layers,
    items: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextjs" },
      { name: "Tailwind CSS", icon: "tailwindcss" },
      { name: "Vite", icon: "vite" },
      { name: "Framer Motion", icon: "framermotion" },
    ],
  },
  {
    title: "Backend Development",
    icon: Server,
    items: [
      { name: "Node.js", icon: "nodejs" },
      { name: "Express", icon: "express" },
      { name: "NestJS", icon: "nestjs" },
      { name: "REST APIs", icon: "code2" },
      { name: "GraphQL", icon: "graphql" },
    ],
  },
  {
    title: "Databases",
    icon: Database,
    items: [
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "MySQL", icon: "mysql" },
      { name: "SQLite", icon: "database" },
      { name: "Redis", icon: "redis" },
    ],
  },
  {
    title: "Tools and Infrastructure",
    icon: Wrench,
    items: [
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "Docker", icon: "docker" },
      { name: "Linux", icon: "linux" },
      { name: "React Native", icon: "reactnative" },
      { name: "Postman", icon: "postman" },
      { name: "VS Code", icon: "vscode" },
    ],
  },
];

export default function SkillsSection() {
  return (
    <section
      id="skills"
      className="py-20 relative overflow-hidden bg-[var(--bg-base,#302E2D)] border-t border-white/[0.08]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center lg:text-left"
        >
          <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-[var(--primary-accent,#FFDD9B)] uppercase block mb-2">
            Technical Stack
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-heading">
            Technologies
          </h2>
          <p className="text-[var(--text-secondary,#FFF1D8)] text-sm sm:text-base max-w-2xl leading-relaxed mt-2 font-body mx-auto lg:mx-0">
            Languages, frameworks, databases, and engineering tools I work with across frontend, backend, and system architecture.
          </p>
        </motion.div>

        {/* Categories Stack: Icons Only */}
        <div className="space-y-12">
          {TECH_CATEGORIES.map((category, catIdx) => {
            const CatIcon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: catIdx * 0.05 }}
                className="space-y-4"
              >
                {/* Category Header */}
                <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
                  <CatIcon size={14} className="text-[var(--primary-accent,#FFDD9B)]" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary,#FFF1D8)]">
                    {category.title}
                  </h3>
                </div>

                {/* Compact Tech Icons Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
                  {category.items.map((tech) => (
                    <div
                      key={tech.name}
                      className="group flex flex-col items-center justify-center p-3 rounded-xl hover:bg-white/[0.03] transition-all duration-200 cursor-default"
                    >
                      <div className="w-10 h-10 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                        <TechIcon
                          name={tech.icon}
                          size={32}
                          className="w-8 h-8"
                          colorMode="brand"
                          title={tech.name}
                        />
                      </div>
                      <span className="text-xs font-medium text-white/85 group-hover:text-[var(--primary-accent,#FFDD9B)] transition-colors mt-2 text-center truncate max-w-full">
                        {tech.name}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
