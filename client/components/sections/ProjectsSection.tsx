import { ExternalLink, Github, Code2, Database, Smartphone, Layout } from "lucide-react";

export default function ProjectsSection() {
  const projects = [
    {
      title: "Digital Credential Wallet Platform",
      description:
        "Secure digital credential management platform enabling organizations to issue, store, and verify verifiable credentials with encrypted data storage and secure API communication.",
      technologies: [
        "Django",
        "Node.js",
        "PostgreSQL",
        "REST APIs",
        "Mobile",
      ],
      features: [
        "Secure credential issuance and verification workflows",
        "QR code-based validation system",
        "Role-based architecture (Issuer, Holder, Verifier)",
      ],
      icon: Database,
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
      github: "#",
      demo: "#",
    },
    {
      title: "Scalable Backend API System",
      description:
        "Designed and implemented a scalable backend architecture to support web and mobile applications with optimized database schema design.",
      technologies: ["Django", "Node.js", "PostgreSQL", "REST APIs"],
      features: [
        "RESTful API development and integration",
        "Authentication and authorization mechanisms",
        "Optimized database schema design",
      ],
      icon: Code2,
      color: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
      github: "#",
      demo: "#",
    },
    {
      title: "Cross-Platform Mobile Application",
      description:
        "Developed a mobile application to interact with backend services, providing a seamless user experience across platforms.",
      technologies: ["React Native", "REST APIs", "Mobile"],
      features: [
        "Cross-platform compatibility (Android & iOS)",
        "Real-time API integration",
        "User-friendly and responsive interface",
      ],
      icon: Smartphone,
      color: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500/30",
      github: "#",
      demo: "#",
    },
    {
      title: "Full Stack Web Application",
      description:
        "Built a complete web application integrating frontend and backend systems with efficient database management.",
      technologies: [
        "HTML",
        "CSS",
        "JavaScript",
        "Django",
        "PostgreSQL",
      ],
      features: [
        "Responsive and dynamic user interface",
        "Backend integration with REST APIs",
        "Efficient database management",
      ],
      icon: Layout,
      color: "from-orange-500/20 to-red-500/20",
      borderColor: "border-orange-500/30",
      github: "#",
      demo: "#",
    },
  ];

  return (
    <section
      id="projects"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Featured Projects</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
        </div>

        <p className="text-lg text-foreground/80 leading-relaxed mb-12">
          A selection of projects I've built, showcasing my expertise in backend systems, API design, mobile development, and full-stack solutions. Each project represents real-world challenges and innovative solutions.
        </p>

        {/* Large Featured Project */}
        <div className="mb-12 group p-8 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Project Info */}
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center group-hover:shadow-lg transition-all">
                  <Database className="w-6 h-6 text-blue-500" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                  Featured
                </span>
              </div>
              <h3 className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors mb-3">
                {projects[0].title}
              </h3>
              <p className="text-foreground/70 mb-6 leading-relaxed">
                {projects[0].description}
              </p>

              <div className="mb-6">
                <h4 className="text-sm font-bold uppercase tracking-widest text-foreground mb-3">
                  Key Features
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {projects[0].features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20"
                    >
                      <span className="text-primary font-bold mt-1">✓</span>
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {projects[0].technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 text-xs font-bold rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <a
                  href={projects[0].github}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-all group/link"
                >
                  <Github className="h-5 w-5 group-hover/link:translate-x-0.5 transition-transform" />
                  View on GitHub
                </a>
                <a
                  href={projects[0].demo}
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-all group/link"
                >
                  <ExternalLink className="h-5 w-5 group-hover/link:translate-x-0.5 transition-transform" />
                  Live Demo
                </a>
              </div>
            </div>

            {/* Visual Placeholder */}
            <div className="lg:col-span-1">
              <div className="relative h-80 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center group-hover:shadow-xl transition-all">
                <div className="text-center">
                  <Database className="w-20 h-20 text-blue-500/40 mx-auto mb-4" />
                  <p className="text-sm text-foreground/50">Project Visual</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.slice(1).map((project, index) => {
            const Icon = project.icon;
            return (
              <div
                key={index}
                className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Icon Header */}
                <div className="mb-4">
                  <div
                    className={`w-14 h-14 rounded-lg bg-gradient-to-br ${project.color} border ${project.borderColor} flex items-center justify-center group-hover:shadow-lg transition-all group-hover:scale-110`}
                  >
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>

                <p className="text-foreground/70 mb-4 leading-relaxed text-sm md:text-base">
                  {project.description}
                </p>

                <div className="mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-foreground mb-2">
                    Features
                  </h4>
                  <ul className="space-y-2">
                    {project.features.map((feature, fIndex) => (
                      <li
                        key={fIndex}
                        className="text-xs md:text-sm text-foreground/60 flex items-start gap-2"
                      >
                        <span className="text-primary font-bold mt-0.5">→</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-border">
                  <a
                    href={project.github}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors group/link"
                  >
                    <Github className="h-4 w-4 group-hover/link:translate-x-0.5 transition-transform" />
                    GitHub
                  </a>
                  <a
                    href={project.demo}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors group/link"
                  >
                    <ExternalLink className="h-4 w-4 group-hover/link:translate-x-0.5 transition-transform" />
                    Demo
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
