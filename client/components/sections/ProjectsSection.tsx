import { ExternalLink, Github } from "lucide-react";

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {project.title}
              </h3>

              <p className="text-foreground/70 mb-4 leading-relaxed">
                {project.description}
              </p>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  Key Features:
                </h4>
                <ul className="space-y-1">
                  {project.features.map((feature, fIndex) => (
                    <li
                      key={fIndex}
                      className="text-sm text-foreground/60 flex items-start gap-2"
                    >
                      <span className="text-primary mt-1">•</span>
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
                      className="px-3 py-1 text-xs font-medium rounded-full bg-primary/5 text-primary border border-primary/20"
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
                  Live Demo
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
