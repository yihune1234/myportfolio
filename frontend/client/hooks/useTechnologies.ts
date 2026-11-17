import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS, apiFetch } from "@/lib/api";

export interface Technology {
  _id?: string;
  name: string;
  slug: string;
  category:
    | "Programming Languages"
    | "Frontend Development"
    | "Backend Development"
    | "Mobile Development"
    | "Databases"
    | "DevOps and Cloud"
    | "Development Tools"
    | "Design and Prototyping"
    | "Frameworks and Libraries";
  icon: string;
  description: string;
  experienceLevel?: string;
  source: "manual" | "github_detected";
  featured?: boolean;
  visible?: boolean;
  order?: number;
}

export const FALLBACK_TECHNOLOGIES: Technology[] = [
  // Programming Languages
  {
    slug: "typescript",
    name: "TypeScript",
    category: "Programming Languages",
    icon: "typescript",
    description: "Typed JavaScript superset for scalable, enterprise-grade architecture",
    experienceLevel: "Primary Stack",
    source: "manual",
    featured: true,
    visible: true,
    order: 1,
  },
  {
    slug: "javascript",
    name: "JavaScript",
    category: "Programming Languages",
    icon: "javascript",
    description: "Modern ES6+ for full-stack web and cross-platform native logic",
    experienceLevel: "Primary Stack",
    source: "manual",
    featured: true,
    visible: true,
    order: 2,
  },
  {
    slug: "python",
    name: "Python",
    category: "Programming Languages",
    icon: "python",
    description: "Scripting, backend asynchronous APIs, automation, and data operations",
    experienceLevel: "Advanced",
    source: "manual",
    featured: true,
    visible: true,
    order: 3,
  },
  {
    slug: "php",
    name: "PHP",
    category: "Programming Languages",
    icon: "php",
    description: "Server-side web engineering and enterprise application backend solutions",
    experienceLevel: "Production",
    source: "manual",
    featured: false,
    visible: true,
    order: 4,
  },
  {
    slug: "html5",
    name: "HTML5",
    category: "Programming Languages",
    icon: "html5",
    description: "Semantic document markup, accessibility standards, and web structure",
    experienceLevel: "Semantic Core",
    source: "manual",
    featured: false,
    visible: true,
    order: 5,
  },
  {
    slug: "css3",
    name: "CSS3",
    category: "Programming Languages",
    icon: "css3",
    description: "Modern CSS Grid, Flexbox, responsive layouts, and fluid transitions",
    experienceLevel: "Advanced Layouts",
    source: "manual",
    featured: false,
    visible: true,
    order: 6,
  },

  // Frontend Development
  {
    slug: "react",
    name: "React",
    category: "Frontend Development",
    icon: "react",
    description: "Component architecture, custom hooks, and high-performance SPA state",
    experienceLevel: "Primary Stack",
    source: "manual",
    featured: true,
    visible: true,
    order: 1,
  },
  {
    slug: "nextjs",
    name: "Next.js",
    category: "Frontend Development",
    icon: "nextjs",
    description: "Hybrid SSR/SSG framework with API routes and edge performance",
    experienceLevel: "Production Framework",
    source: "manual",
    featured: true,
    visible: true,
    order: 2,
  },
  {
    slug: "tailwindcss",
    name: "Tailwind CSS",
    category: "Frontend Development",
    icon: "tailwindcss",
    description: "Utility-first CSS architecture for custom responsive design systems",
    experienceLevel: "Daily Driver",
    source: "manual",
    featured: true,
    visible: true,
    order: 3,
  },

  // Backend Development
  {
    slug: "nodejs",
    name: "Node.js",
    category: "Backend Development",
    icon: "nodejs",
    description: "Asynchronous event-driven JavaScript/TypeScript backend runtime",
    experienceLevel: "Primary Runtime",
    source: "manual",
    featured: true,
    visible: true,
    order: 1,
  },
  {
    slug: "express",
    name: "Express.js",
    category: "Backend Development",
    icon: "express",
    description: "Lightweight RESTful API framework with modular middleware routing",
    experienceLevel: "Production Core",
    source: "manual",
    featured: true,
    visible: true,
    order: 2,
  },
  {
    slug: "nestjs",
    name: "NestJS",
    category: "Backend Development",
    icon: "nestjs",
    description: "Structured enterprise TypeScript backend with dependency injection",
    experienceLevel: "Enterprise Tier",
    source: "manual",
    featured: true,
    visible: true,
    order: 3,
  },

  // Mobile Development
  {
    slug: "reactnative",
    name: "React Native",
    category: "Mobile Development",
    icon: "reactnative",
    description: "Native cross-platform mobile application development for Android & iOS",
    experienceLevel: "Production",
    source: "manual",
    featured: true,
    visible: true,
    order: 1,
  },
  {
    slug: "expo",
    name: "Expo",
    category: "Mobile Development",
    icon: "expo",
    description: "Managed workflow, native OTA updates, and universal build ecosystem",
    experienceLevel: "Production Toolchain",
    source: "manual",
    featured: true,
    visible: true,
    order: 2,
  },

  // Databases
  {
    slug: "postgresql",
    name: "PostgreSQL",
    category: "Databases",
    icon: "postgresql",
    description: "Relational ACID persistence with advanced indexing and JSONB queries",
    experienceLevel: "Primary Relational",
    source: "manual",
    featured: true,
    visible: true,
    order: 1,
  },
  {
    slug: "mongodb",
    name: "MongoDB",
    category: "Databases",
    icon: "mongodb",
    description: "Document database for flexible schemas, aggregation, and distributed models",
    experienceLevel: "Document Store",
    source: "manual",
    featured: true,
    visible: true,
    order: 2,
  },
  {
    slug: "mysql",
    name: "MySQL",
    category: "Databases",
    icon: "mysql",
    description: "High-performance transactional relational database storage",
    experienceLevel: "Relational Standard",
    source: "manual",
    featured: false,
    visible: true,
    order: 3,
  },
  {
    slug: "redis",
    name: "Redis",
    category: "Databases",
    icon: "redis",
    description: "In-memory data store, high-speed cache, and pub/sub message broker",
    experienceLevel: "Caching & State",
    source: "manual",
    featured: true,
    visible: true,
    order: 4,
  },

  // DevOps and Cloud
  {
    slug: "docker",
    name: "Docker",
    category: "DevOps and Cloud",
    icon: "docker",
    description: "Containerization, reproducible environment manifests, and microservices",
    experienceLevel: "Daily Driver",
    source: "manual",
    featured: true,
    visible: true,
    order: 1,
  },
  {
    slug: "git",
    name: "Git",
    category: "DevOps and Cloud",
    icon: "git",
    description: "Distributed version control, branching strategies, and repository hygiene",
    experienceLevel: "Core Standard",
    source: "manual",
    featured: true,
    visible: true,
    order: 2,
  },
  {
    slug: "github",
    name: "GitHub",
    category: "DevOps and Cloud",
    icon: "github",
    description: "Collaborative engineering workflows, actions, and repository governance",
    experienceLevel: "Daily Driver",
    source: "manual",
    featured: true,
    visible: true,
    order: 3,
  },
  {
    slug: "linux",
    name: "Linux",
    category: "DevOps and Cloud",
    icon: "linux",
    description: "Server environment administration, shell scripting, and service security",
    experienceLevel: "Production Environment",
    source: "manual",
    featured: true,
    visible: true,
    order: 4,
  },

  // Development Tools
  {
    slug: "vscode",
    name: "VS Code",
    category: "Development Tools",
    icon: "vscode",
    description: "Configured developer environment with TypeScript language servers",
    experienceLevel: "Primary Editor",
    source: "manual",
    featured: true,
    visible: true,
    order: 1,
  },
  {
    slug: "postman",
    name: "Postman",
    category: "Development Tools",
    icon: "postman",
    description: "API endpoint inspection, mock servers, and automated integration tests",
    experienceLevel: "Testing & QA",
    source: "manual",
    featured: true,
    visible: true,
    order: 2,
  },

  // Design and Prototyping
  {
    slug: "figma",
    name: "Figma",
    category: "Design and Prototyping",
    icon: "figma",
    description: "Product wireframing, high-fidelity UI design, and responsive prototyping",
    experienceLevel: "UI/UX Prototyping",
    source: "manual",
    featured: true,
    visible: true,
    order: 1,
  },

  // Frameworks and Libraries
  {
    slug: "vite",
    name: "Vite",
    category: "Frameworks and Libraries",
    icon: "vite",
    description: "Next-generation ES-module frontend build tool and hot module replacement",
    experienceLevel: "Primary Bundler",
    source: "manual",
    featured: true,
    visible: true,
    order: 1,
  },
  {
    slug: "framermotion",
    name: "Framer Motion",
    category: "Frameworks and Libraries",
    icon: "framermotion",
    description: "Production-ready declarative physics animations and page transition engine",
    experienceLevel: "UI Animation",
    source: "manual",
    featured: true,
    visible: true,
    order: 2,
  },
];

export function useTechnologies(includeAll = false) {
  return useQuery({
    queryKey: ["technologies", { includeAll }],
    queryFn: async (): Promise<Technology[]> => {
      try {
        const res = (await apiFetch(API_ENDPOINTS.TECHNOLOGIES_LIST(includeAll))) as any;
        const list = res?.technologies || res?.data?.technologies || (Array.isArray(res?.data) ? res.data : null);
        if (res?.success && Array.isArray(list) && list.length > 0) {
          return list;
        }
        return includeAll
          ? FALLBACK_TECHNOLOGIES
          : FALLBACK_TECHNOLOGIES.filter((t) => t.visible !== false);
      } catch (err) {
        console.warn("Using fallback technology stack:", err);
        return includeAll
          ? FALLBACK_TECHNOLOGIES
          : FALLBACK_TECHNOLOGIES.filter((t) => t.visible !== false);
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}
