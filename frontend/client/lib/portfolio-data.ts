export interface ProjectInfo {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  role?: string;
  isMini?: boolean;
  pinned?: boolean;
}

export interface ExperienceInfo {
  position: string;
  company: string;
  responsibilities: string[];
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface PortfolioData {
  personal: {
    name: string;
    title: string;
    tagline: string;
    location: string;
    email: string;
    phone: string;
    github: string;
    linkedin: string;
    website: string;
    availability: string;
    responseTime: string;
  };
  summary: string;
  about: {
    description: string;
    highlights: { title: string; description: string }[];
  };
  skills: SkillCategory[];
  experience: ExperienceInfo[];
  education: {
    degree: string;
    institution: string;
    status: string;
    focus: string;
    description: string;
    studyAreas: string[];
  };
  services: {
    title: string;
    description: string;
  }[];
  contact: {
    email: string;
    phone: string;
    location: string;
  };
}

export const portfolioData: PortfolioData = {
  personal: {
    name: "Yihune Belay",
    title: "Full-Stack Software Engineer",
    tagline: "Building scalable backend systems, robust APIs, and cross-platform experiences. Focused on architecture, performance, and clean code.",
    location: "Addis Ababa, Ethiopia",
    email: "yihunebelay859@gmail.com",
    phone: "+251 987 414 282",
    github: "https://github.com/yihune1234",
    linkedin: "https://linkedin.com/in/yihune-belay",
    website: "https://myportfolio-1-01m7.onrender.com",
    availability: "Open for full-time roles, freelance projects, and research collaborations",
    responseTime: "24 hours"
  },
  summary: "Software engineer based in Addis Ababa, Ethiopia. Currently pursuing Software Engineering at Haramaya University, building production systems and digital infrastructure. Specializes in backend systems, API architecture, and scalable digital infrastructure.",
  about: {
    description: "Software engineer based in Addis Ababa, Ethiopia. Currently pursuing Software Engineering at Haramaya University, building production systems and digital infrastructure.",
    highlights: [
      {
        title: "Full-Stack Engineering",
        description: "Scalable backend systems, RESTful APIs, and responsive frontends built with modern architectures."
      },
      {
        title: "Systems Thinker",
        description: "Designing distributed, fault-tolerant systems with clean separation of concerns."
      },
      {
        title: "Security Focused",
        description: "Implementing auth, encryption, and secure API patterns across the stack."
      },
      {
        title: "DevOps Mindset",
        description: "CI/CD pipelines, containerization, cloud deployment, and infrastructure automation."
      }
    ]
  },
  skills: [
    {
      category: "Frontend",
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "HTML5/CSS3", "Framer Motion", "Three.js", "React Native"]
    },
    {
      category: "API Gateway",
      skills: ["REST APIs", "GraphQL", "WebSockets", "API Design", "Express"]
    },
    {
      category: "Backend Services",
      skills: ["Node.js", "Django", "PHP", "Python", "Express", "MongoDB", "PostgreSQL"]
    },
    {
      category: "Authentication & Security",
      skills: ["JWT", "OAuth", "BCrypt", "RBAC", "Encryption"]
    },
    {
      category: "Databases",
      skills: ["PostgreSQL", "MongoDB", "Redis", "SQL", "Database Design"]
    },
    {
      category: "Cloud & DevOps",
      skills: ["Docker", "AWS", "CI/CD", "Linux", "Git", "Render", "Cloudinary"]
    },
    {
      category: "Tools & Practices",
      skills: ["Git", "VS Code", "Agile", "Testing", "Performance Optimization", "System Architecture"]
    }
  ],
  experience: [
    {
      position: "Software Engineering Intern",
      company: "INSA — Information Network Security Administration",
      responsibilities: [
        "Backend system development and RESTful API integration",
        "Mobile application development with React Native",
        "Database design, optimization, and maintenance",
        "Secure system implementation and debugging"
      ]
    },
    {
      position: "Full Stack Developer Intern",
      company: "Nile Tech",
      responsibilities: [
        "Full stack web application development and maintenance",
        "RESTful API design and integration",
        "Modern UI/UX implementation",
        "Database management and optimization"
      ]
    }
  ],
  education: {
    degree: "BSc in Software Engineering",
    institution: "Haramaya University",
    status: "In Progress",
    focus: "Software Engineering",
    description: "Rigorous curriculum in foundational computer science, advanced software development methodologies, and system architecture.",
    studyAreas: [
      "Data Structures & Algorithms",
      "Database Systems",
      "Web Development",
      "Mobile App Development",
      "Network Security",
      "Software Architecture",
      "Cloud Computing",
      "System Design",
      "Software Testing"
    ]
  },
  services: [
    {
      title: "Full-Stack Web Development",
      description: "End-to-end web application development using React, TypeScript, Node.js, and modern frameworks. From database design to responsive UI."
    },
    {
      title: "API Design & Development",
      description: "RESTful and GraphQL API architecture, documentation, and implementation with authentication, rate limiting, and caching."
    },
    {
      title: "Backend Systems Engineering",
      description: "Scalable server-side applications, microservices architecture, database optimization, and cloud deployment."
    },
    {
      title: "Mobile App Development",
      description: "Cross-platform mobile applications using React Native with native performance and responsive design."
    },
    {
      title: "DevOps & Cloud Infrastructure",
      description: "CI/CD pipeline setup, Docker containerization, cloud deployment (AWS/Render), and infrastructure automation."
    },
    {
      title: "Technical Consulting",
      description: "Architecture review, system design consultation, technology stack recommendations, and code quality assessment."
    }
  ],
  contact: {
    email: "yihunebelay859@gmail.com",
    phone: "+251 987 414 282",
    location: "Addis Ababa, Ethiopia"
  }
};

export function searchPortfolio(query: string): string {
  const q = query.toLowerCase();
  const sections: string[] = [];

  const personal = portfolioData.personal;
  if (
    q.includes("who") || q.includes("yihune") || q.includes("about") ||
    q.includes("name") || q.includes("tell me") || q.includes("introduce")
  ) {
    sections.push(`PERSONAL INFORMATION:
Name: ${personal.name}
Title: ${personal.title}
Tagline: "${personal.tagline}"
Location: ${personal.location}
Email: ${personal.email}
Phone: ${personal.phone}
GitHub: ${personal.github}
LinkedIn: ${personal.linkedin}
Website: ${personal.website}
Availability: ${personal.availability}
Response Time: ${personal.responseTime}

SUMMARY: ${portfolioData.summary}`);
  }

  if (
    q.includes("skill") || q.includes("technology") || q.includes("tech") ||
    q.includes("stack") || q.includes("language") || q.includes("framework") ||
    q.includes("tool") || q.includes("know") || q.includes("expertise")
  ) {
    const skillText = portfolioData.skills.map(s =>
      `${s.category}: ${s.skills.join(", ")}`
    ).join("\n");
    sections.push(`SKILLS & TECHNOLOGIES:\n${skillText}`);
  }

  if (
    q.includes("project") || q.includes("build") || q.includes("portfolio") ||
    q.includes("work") || q.includes("github") || q.includes("repo") ||
    q.includes("application") || q.includes("software") || q.includes("created")
  ) {
    sections.push(`PROJECTS:
Projects are loaded dynamically from the portfolio API. The visitor can view all projects in the Projects section of the portfolio. Featured projects are marked with a "FEATURED" badge. Each project includes a title, description, technologies used, GitHub link, and live demo link when available.

The portfolio itself (this website) is a full-stack application built with:
- Frontend: React, TypeScript, Vite, Tailwind CSS, Framer Motion, Three.js
- Backend: Node.js, Express, MongoDB, Mongoose
- Features: JWT authentication, Cloudinary image upload, SMTP email, admin dashboard, mobile app via Capacitor`);
  }

  if (
    q.includes("experience") || q.includes("intern") || q.includes("work history") ||
    q.includes("job") || q.includes("career") || q.includes("professional") ||
    q.includes("background")
  ) {
    const expText = portfolioData.experience.map(e =>
      `${e.position} at ${e.company}\nResponsibilities:\n${e.responsibilities.map(r => `  - ${r}`).join("\n")}`
    ).join("\n\n");
    sections.push(`EXPERIENCE:\n${expText}`);
  }

  if (
    q.includes("education") || q.includes("university") || q.includes("degree") ||
    q.includes("study") || q.includes("academic") || q.includes("learn") ||
    q.includes("haramaya") || q.includes("bsc") || q.includes("bachelor") ||
    q.includes("course")
  ) {
    const edu = portfolioData.education;
    sections.push(`EDUCATION:
Degree: ${edu.degree}
Institution: ${edu.institution}
Status: ${edu.status}
Focus: ${edu.focus}
Description: ${edu.description}
Study Areas: ${edu.studyAreas.join(", ")}`);
  }

  if (
    q.includes("service") || q.includes("offer") || q.includes("hire") ||
    q.includes("freelance") || q.includes("consult") || q.includes("provide") ||
    q.includes("help") || q.includes("do you")
  ) {
    const serviceText = portfolioData.services.map(s =>
      `${s.title}: ${s.description}`
    ).join("\n");
    sections.push(`SERVICES:\n${serviceText}`);
  }

  if (
    q.includes("contact") || q.includes("email") || q.includes("reach") ||
    q.includes("message") || q.includes("get in touch") || q.includes("phone") ||
    q.includes("call") || q.includes("hire") || q.includes("collaborate") ||
    q.includes("talk")
  ) {
    sections.push(`CONTACT INFORMATION:
Email: ${personal.email}
Phone: ${personal.phone}
Location: ${personal.location}
GitHub: ${personal.github}
LinkedIn: ${personal.linkedin}
Website: ${personal.website}

The contact form on the portfolio website can be used to send a message directly.`);
  }

  if (
    q.includes("about") || q.includes("highlight") || q.includes("what makes") ||
    q.includes("strength") || q.includes("special")
  ) {
    const highlightText = portfolioData.about.highlights.map(h =>
      `${h.title}: ${h.description}`
    ).join("\n");
    sections.push(`ABOUT HIGHLIGHTS:\n${highlightText}`);
  }

  if (sections.length === 0) {
    const fullProfile = `PERSONAL INFORMATION:
Name: ${personal.name}
Title: ${personal.title}
Location: ${personal.location}
Email: ${personal.email}

SUMMARY: ${portfolioData.summary}

SKILLS: ${portfolioData.skills.map(s => `${s.category}: ${s.skills.join(", ")}`).join(" | ")}

EXPERIENCE: ${portfolioData.experience.map(e => `${e.position} at ${e.company}`).join("; ")}

EDUCATION: ${portfolioData.education.degree} at ${portfolioData.education.institution}

SERVICES: ${portfolioData.services.map(s => s.title).join(", ")}

For more details, the visitor can browse the portfolio website.`;
    sections.push(fullProfile);
  }

  return sections.join("\n\n---\n\n");
}
