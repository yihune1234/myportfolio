import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchGitHubLanguages, GitHubLanguagesResponse, DualScope } from "@/lib/githubApi";
import { useGitHubSettings } from "@/hooks/useGitHubSettings";
import {
  Globe,
  Server,
  Database,
  Shield,
  Smartphone,
  Cloud,
  GitBranch,
  Binary,
  Code2,
  Terminal,
} from "lucide-react";

interface DomainGroup {
  id: string;
  title: string;
  icon: any;
  accent: string;
  scope: "ALL" | "PERSONAL" | "ORGANIZATION";
  skills: string[];
  telemetryNote?: string;
}

export default function SkillsSection() {
  const { data: settings } = useGitHubSettings();
  const [selectedScope, setSelectedScope] = useState<DualScope>("ALL");

  const { data: langData, isLoading: langLoading } = useQuery<GitHubLanguagesResponse>({
    queryKey: ["github", "languages", selectedScope],
    queryFn: () => fetchGitHubLanguages(selectedScope),
    staleTime: 15 * 60 * 1000,
    enabled: settings?.showSkillsIntegration !== false,
  });

  const domains: DomainGroup[] = [
    {
      id: "backend",
      title: "Backend Engineering",
      icon: Server,
      accent: "text-emerald-400 border-emerald-500/30",
      scope: "ALL",
      skills: ["Node.js", "Express", "Django", "PHP", "REST APIs", "Microservices", "Event-Driven Arch"],
      telemetryNote: "Core API runtime across 35+ repositories",
    },
    {
      id: "frontend",
      title: "Frontend Engineering",
      icon: Globe,
      accent: "text-emerald-400 border-emerald-500/30",
      scope: "ALL",
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "TanStack Query", "Vite", "Framer Motion"],
      telemetryNote: "Primary client stack for SPAs & dashboards",
    },
    {
      id: "database",
      title: "Database Systems",
      icon: Database,
      accent: "text-amber-400 border-amber-500/30",
      scope: "ALL",
      skills: ["PostgreSQL", "MongoDB", "Redis", "SQLite", "Database Modeling", "Query Optimization"],
      telemetryNote: "Transactional persistence & in-memory caching",
    },
    {
      id: "mobile",
      title: "Mobile & Offline-First",
      icon: Smartphone,
      accent: "text-sky-400 border-sky-500/30",
      scope: "PERSONAL",
      skills: ["React Native", "Expo", "Capacitor", "WatermelonDB", "Background Sync", "Mobile Push"],
      telemetryNote: "Personal research in disconnected mobile sync",
    },
    {
      id: "security",
      title: "Cybersecurity & Systems",
      icon: Shield,
      accent: "text-emerald-400 border-emerald-500/30",
      scope: "PERSONAL",
      skills: ["JWT & Bcrypt", "RBAC", "Network Defense", "Input Sanitization", "HTTPS/TLS", "OWASP Standards"],
      telemetryNote: "Applied defense & encryption patterns",
    },
    {
      id: "organization",
      title: "Organization Platform Tech",
      icon: GitBranch,
      accent: "text-amber-400 border-amber-500/30",
      scope: "ORGANIZATION",
      skills: ["Multi-Tenant Arch", "Commerce APIs", "Payment Gateways", "Shared SDKs", "Webhook Ingestion"],
      telemetryNote: "Ariiti Tech ecosystem shared infrastructure",
    },
    {
      id: "devops",
      title: "DevOps & Infrastructure",
      icon: Cloud,
      accent: "text-teal-400 border-teal-500/30",
      scope: "ALL",
      skills: ["Docker", "Linux Administration", "CI/CD Workflows", "Nginx", "Git Version Control", "Monitoring"],
      telemetryNote: "Containerized deployment pipelines",
    },
  ];

  const filteredDomains = domains.filter((d) => {
    if (selectedScope === "ALL") return true;
    if (selectedScope === "PERSONAL") return d.scope === "ALL" || d.scope === "PERSONAL";
    if (selectedScope === "ORGANIZATION") return d.scope === "ALL" || d.scope === "ORGANIZATION";
    return true;
  });

  return (
    <section
      id="skills"
      className="section-padding relative overflow-hidden bg-[var(--bg-base,#302E2D)] border-t border-white/[0.08]"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 dot-matrix-grid opacity-25 pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-[550px] h-[550px] ambient-emerald-glow rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 -right-32 w-[550px] h-[550px] ambient-amber-glow rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-[0.25em] font-bold block mb-2">
              Architectural Domain Stack
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[var(--text-primary,#FFFFFF)] tracking-tight font-heading">
              Technical Domains & Evidence
            </h2>
            <p className="text-[var(--text-secondary,#FFF1D8)] text-sm sm:text-base max-w-xl leading-relaxed mt-2 font-body">
              Verified manual CMS competencies supplemented by physical byte metrics detected across public repositories.
            </p>
          </div>

          {/* Scope Filter Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--card-surface,#3A3836)] border border-white/[0.08] backdrop-blur-md self-start md:self-auto shadow-inner">
            <button
              onClick={() => setSelectedScope("ALL")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedScope === "ALL"
                  ? "bg-white/[0.08] text-[var(--text-primary,#FFFFFF)] border border-white/[0.1] shadow-sm"
                  : "text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--text-primary,#FFFFFF)]"
              }`}
            >
              All Domains
            </button>
            <button
              onClick={() => setSelectedScope("PERSONAL")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedScope === "PERSONAL"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                  : "text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--text-primary,#FFFFFF)]"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Personal</span>
            </button>
            <button
              onClick={() => setSelectedScope("ORGANIZATION")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedScope === "ORGANIZATION"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                  : "text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--text-primary,#FFFFFF)]"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Organization</span>
            </button>
          </div>
        </div>

        {/* Architectural Domain Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {filteredDomains.map((domain, index) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="card-slate rounded-2xl p-6 flex flex-col justify-between group hover:border-emerald-500/30 transition-all duration-300 relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border ${domain.accent}`}>
                      <domain.icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary,#FFFFFF)]">
                        {domain.title}
                      </h3>
                      <span className="text-[10px] font-mono text-[#64748B] uppercase">
                        {domain.scope === "ALL" ? "Combined Scope" : domain.scope === "PERSONAL" ? "Personal Lab" : "Ariiti Org"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {domain.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-[var(--bg-base,#302E2D)]/80 border border-white/[0.06] text-xs font-mono text-[var(--text-secondary,#FFF1D8)] group-hover:text-[var(--text-primary,#FFFFFF)] transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {domain.telemetryNote && (
                <div className="text-[10px] font-mono text-[#64748B] pt-3 border-t border-white/[0.04]">
                  {domain.telemetryNote}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Supplementary GitHub Language Telemetry (Codebase DNA) */}
        {settings?.showSkillsIntegration !== false && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-slate rounded-2xl p-6 sm:p-8 relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-emerald-400">
                  <Binary size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary,#FFFFFF)]">
                    Codebase DNA // Physical Byte Analysis ({selectedScope})
                  </h3>
                  <p className="text-xs text-[var(--text-secondary,#FFF1D8)] font-mono">
                    Directly aggregated from GitHub Linguist repository source bytes
                  </p>
                </div>
              </div>

              <div className="text-xs font-mono text-[var(--text-secondary,#FFF1D8)] self-start sm:self-auto">
                Total Volume:{" "}
                <span className="text-emerald-400 font-bold">
                  {langLoading ? "Analyzing..." : langData?.formatted_total_bytes || "25.4 MB"}
                </span>
              </div>
            </div>

            {/* Stacked Multi-Color Progress Bar */}
            <div className="h-2 w-full rounded-full bg-[var(--bg-base,#302E2D)] overflow-hidden flex p-0.5 gap-0.5 mb-4 border border-white/[0.04]">
              {langLoading ? (
                <div className="w-full h-full bg-white/[0.08] animate-pulse rounded-full" />
              ) : (
                (langData?.languages || []).slice(0, 6).map((l, i) => {
                  const colors = ["#F59E0B", "#818CF8", "#38BDF8", "#A78BFA", "#F87171", "#10B981"];
                  return (
                    <div
                      key={l.language}
                      style={{
                        width: `${Math.max(l.percentage, 2)}%`,
                        backgroundColor: colors[i % colors.length],
                      }}
                      className="h-full rounded-full transition-all duration-700"
                      title={`${l.language}: ${l.formatted_bytes} (${l.percentage}%)`}
                    />
                  );
                })
              )}
            </div>

            {/* Language Breakdown Pills */}
            <div className="flex flex-wrap gap-2.5 mb-4">
              {langLoading ? (
                <div className="text-xs text-[var(--text-secondary,#FFF1D8)] font-mono">Loading byte density metrics...</div>
              ) : (
                (langData?.languages || []).slice(0, 6).map((l, i) => {
                  const colors = ["#F59E0B", "#818CF8", "#38BDF8", "#A78BFA", "#F87171", "#10B981"];
                  return (
                    <div
                      key={l.language}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--bg-base,#302E2D)] border border-white/[0.06] text-xs font-mono"
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: colors[i % colors.length] }}
                      />
                      <span className="text-[var(--text-primary,#FFFFFF)] font-semibold">{l.language}</span>
                      <span className="text-[#64748B]">{l.percentage}%</span>
                    </div>
                  );
                })
              )}
            </div>

            <p className="text-[11px] text-[#64748B] leading-relaxed font-sans border-t border-white/[0.04] pt-3">
              <strong className="text-[var(--text-secondary,#FFF1D8)]">Methodology:</strong> Derived from source code bytes across 35 public repositories via GitHub Linguist.
              This represents physical codebase distribution and is presented as supplementary engineering evidence, not an arbitrary rating of personal proficiency.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
