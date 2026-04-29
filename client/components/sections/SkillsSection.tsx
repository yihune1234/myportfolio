import { Laptop, Code2, Database, Smartphone, Wrench, GitBranch } from "lucide-react";

export default function SkillsSection() {
  const skillCategories = [
    {
      title: "Programming Languages",
      skills: [
        { name: "Python", color: "bg-blue-500/20 text-blue-600 dark:text-blue-400" },
        { name: "JavaScript", color: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400" },
        { name: "PHP", color: "bg-purple-500/20 text-purple-600 dark:text-purple-400" },
        { name: "SQL", color: "bg-slate-500/20 text-slate-600 dark:text-slate-400" },
      ],
      icon: Laptop,
      borderColor: "border-blue-500/30",
      bgColor: "from-blue-500/10 to-blue-500/5",
    },
    {
      title: "Frameworks & Technologies",
      skills: [
        { name: "Django", color: "bg-green-500/20 text-green-600 dark:text-green-400" },
        { name: "Node.js", color: "bg-green-500/20 text-green-600 dark:text-green-400" },
        { name: "React Native", color: "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400" },
        { name: "REST APIs", color: "bg-purple-500/20 text-purple-600 dark:text-purple-400" },
      ],
      icon: Code2,
      borderColor: "border-green-500/30",
      bgColor: "from-green-500/10 to-green-500/5",
    },
    {
      title: "Databases",
      skills: [
        { name: "PostgreSQL", color: "bg-blue-500/20 text-blue-600 dark:text-blue-400" },
        { name: "MySQL", color: "bg-orange-500/20 text-orange-600 dark:text-orange-400" },
        { name: "SQL Server", color: "bg-red-500/20 text-red-600 dark:text-red-400" },
      ],
      icon: Database,
      borderColor: "border-slate-500/30",
      bgColor: "from-slate-500/10 to-slate-500/5",
    },
    {
      title: "Web & Mobile Development",
      skills: [
        { name: "HTML", color: "bg-orange-500/20 text-orange-600 dark:text-orange-400" },
        { name: "CSS", color: "bg-blue-500/20 text-blue-600 dark:text-blue-400" },
        { name: "JavaScript", color: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400" },
        { name: "Cross-platform Apps", color: "bg-pink-500/20 text-pink-600 dark:text-pink-400" },
      ],
      icon: Smartphone,
      borderColor: "border-pink-500/30",
      bgColor: "from-pink-500/10 to-pink-500/5",
    },
    {
      title: "Tools & Practices",
      skills: [
        { name: "Git", color: "bg-orange-500/20 text-orange-600 dark:text-orange-400" },
        { name: "Docker", color: "bg-blue-500/20 text-blue-600 dark:text-blue-400" },
        { name: "API Integration", color: "bg-purple-500/20 text-purple-600 dark:text-purple-400" },
        { name: "System Design", color: "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400" },
      ],
      icon: Wrench,
      borderColor: "border-orange-500/30",
      bgColor: "from-orange-500/10 to-orange-500/5",
    },
    {
      title: "Version Control & DevOps",
      skills: [
        { name: "Version Control", color: "bg-slate-500/20 text-slate-600 dark:text-slate-400" },
        { name: "CI/CD", color: "bg-green-500/20 text-green-600 dark:text-green-400" },
        { name: "Deployment", color: "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400" },
        { name: "Cloud Services", color: "bg-blue-500/20 text-blue-600 dark:text-blue-400" },
      ],
      icon: GitBranch,
      borderColor: "border-slate-500/30",
      bgColor: "from-slate-500/10 to-slate-500/5",
    },
  ];

  return (
    <section
      id="skills"
      className="py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Technical Skills</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
        </div>

        <p className="text-lg text-foreground/80 leading-relaxed mb-16">
          Over the years, I've developed a comprehensive skill set across modern development technologies, from backend systems to mobile applications. Here's what I work with.
        </p>

        {/* Modern Card Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div
                key={index}
                className={`group relative p-8 rounded-2xl border ${category.borderColor} bg-gradient-to-br ${category.bgColor} to-transparent backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
              >
                {/* Background gradient accent */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl pointer-events-none"></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Header with icon and title */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>
                    </div>
                    <div className="flex-shrink-0 ml-3 p-3 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:shadow-lg group-hover:scale-110 transition-all">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                  </div>

                  {/* Skills Badges */}
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <div
                        key={skillIndex}
                        className={`px-4 py-2.5 rounded-full font-semibold text-sm border transition-all cursor-default hover:scale-105 ${skill.color} border-current border-opacity-40 hover:border-opacity-60`}
                      >
                        {skill.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Expertise Overview */}
        <div className="mt-16 p-8 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            Proficiency Levels
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Backend Development", value: "Expert", color: "text-blue-600 dark:text-blue-400" },
              { label: "API Design", value: "Advanced", color: "text-purple-600 dark:text-purple-400" },
              { label: "Database Design", value: "Advanced", color: "text-cyan-600 dark:text-cyan-400" },
              { label: "Mobile Dev", value: "Intermediate", color: "text-green-600 dark:text-green-400" },
              { label: "System Architecture", value: "Advanced", color: "text-orange-600 dark:text-orange-400" },
              { label: "Cloud Services", value: "Intermediate", color: "text-pink-600 dark:text-pink-400" },
              { label: "Security", value: "Advanced", color: "text-red-600 dark:text-red-400" },
              { label: "Performance", value: "Advanced", color: "text-indigo-600 dark:text-indigo-400" },
            ].map((comp, idx) => (
              <div key={idx} className="text-center p-4 rounded-lg border border-primary/20 hover:border-primary/50 transition-all hover:bg-primary/5">
                <p className="text-xs md:text-sm text-muted-foreground mb-2 uppercase font-bold tracking-wide">
                  {comp.label}
                </p>
                <p className={`font-black text-lg md:text-2xl ${comp.color}`}>{comp.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
