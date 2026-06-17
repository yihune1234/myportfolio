export default function ExperienceSection() {
  const experiences = [
    {
      position: "Software Engineering Intern",
      company: "Information Network Security Administration (INSA)",
      period: "2023-2024",
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
    <section
      id="experience"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30"
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Professional Experience</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
        </div>

        <p className="text-lg text-foreground/80 leading-relaxed mb-12">
          I've had the opportunity to work with innovative teams and organizations, gaining hands-on experience in full stack development and backend systems architecture.
        </p>

        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
            >
              {/* Timeline dot */}
              <div className="absolute -left-4 top-8 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary border-4 border-background group-hover:shadow-lg transition-all"></div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {exp.position}
                  </h3>
                  <p className="text-primary font-semibold text-lg mt-1">
                    {exp.company}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-muted-foreground">
                    {exp.period}
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h4 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">
                  Key Responsibilities
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {exp.responsibilities.map((resp, respIndex) => (
                    <li
                      key={respIndex}
                      className="flex items-start gap-3 text-foreground/70"
                    >
                      <span className="text-primary font-bold mt-1">✓</span>
                      <span className="text-sm md:text-base">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
