export default function SkillsSection() {
  const skillCategories = [
    {
      title: "Programming Languages",
      skills: ["Python", "JavaScript", "PHP", "SQL"],
    },
    {
      title: "Frameworks & Technologies",
      skills: ["Django", "Node.js", "React Native", "RESTful APIs"],
    },
    {
      title: "Databases",
      skills: ["PostgreSQL", "MySQL", "SQL Server"],
    },
    {
      title: "Web & Mobile Development",
      skills: ["HTML", "CSS", "JavaScript", "Cross-platform Apps"],
    },
    {
      title: "Tools & Practices",
      skills: ["Git", "Version Control", "API Integration", "System Design"],
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
