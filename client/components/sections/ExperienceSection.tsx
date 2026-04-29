export default function ExperienceSection() {
  const experiences = [
    {
      position: "Software Engineering Intern",
      company: "Information Network Security Administration (INSA)",
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
      className="py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Professional Experience</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
        </div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {exp.position}
                  </h3>
                  <p className="text-primary font-semibold mt-1">
                    {exp.company}
                  </p>
                </div>
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:shadow-lg transition-all">
                  <span className="text-primary font-bold">💼</span>
                </div>
              </div>

              <ul className="space-y-3">
                {exp.responsibilities.map((resp, respIndex) => (
                  <li
                    key={respIndex}
                    className="flex items-start gap-3 text-foreground/70"
                  >
                    <span className="text-primary font-bold mt-0.5">→</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
