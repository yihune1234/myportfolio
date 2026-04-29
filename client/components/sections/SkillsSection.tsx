export default function SkillsSection() {
  const skillCategories = [
    {
      title: "Programming Languages",
      skills: ["Python", "JavaScript", "PHP", "SQL"],
      icon: "💻",
    },
    {
      title: "Frameworks & Technologies",
      skills: ["Django", "Node.js", "React Native", "RESTful APIs"],
      icon: "⚙️",
    },
    {
      title: "Databases",
      skills: ["PostgreSQL", "MySQL", "SQL Server"],
      icon: "🗄️",
    },
    {
      title: "Web & Mobile Development",
      skills: ["HTML", "CSS", "JavaScript", "Cross-platform Apps"],
      icon: "📱",
    },
    {
      title: "Tools & Practices",
      skills: ["Git", "Version Control", "API Integration", "System Design"],
      icon: "🛠️",
    },
  ];

  return (
    <section
      id="skills"
      className="py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Technical Skills</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
        </div>

        <p className="text-lg text-foreground/80 leading-relaxed mb-12">
          Over the years, I've developed a comprehensive skill set across modern development technologies, from backend systems to mobile applications. Here's what I work with.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors flex-1">
                  {category.title}
                </h3>
                <span className="text-3xl ml-2 group-hover:scale-125 transition-transform">
                  {category.icon}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 hover:border-primary/50 transition-all cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Expertise Overview */}
        <div className="mt-16 p-8 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-secondary/5">
          <h3 className="text-2xl font-bold text-foreground mb-6">
            Core Competencies
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Backend Development", value: "Expert" },
              { label: "API Design", value: "Advanced" },
              { label: "Database Design", value: "Advanced" },
              { label: "Mobile Dev", value: "Intermediate" },
              { label: "System Architecture", value: "Advanced" },
              { label: "Cloud Services", value: "Intermediate" },
              { label: "Security", value: "Advanced" },
              { label: "Performance", value: "Advanced" },
            ].map((comp, idx) => (
              <div key={idx} className="text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  {comp.label}
                </p>
                <p className="font-bold text-primary text-lg">{comp.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
