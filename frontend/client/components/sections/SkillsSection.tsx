import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchGitHubLanguages, GitHubLanguagesResponse, DualScope } from "@/lib/githubApi";
import { useGitHubSettings } from "@/hooks/useGitHubSettings";
import { useTechnologies, Technology } from "@/hooks/useTechnologies";
import { TechIcon } from "@/components/tech/TechIcon";
import {
  Code2,
  Layout,
  Server,
  Smartphone,
  Database,
  Cloud,
  Wrench,
  Palette,
  Boxes,
  Sparkles,
  GitBranch,
  Binary,
  Layers,
  CheckCircle2,
} from "lucide-react";

export const CATEGORIES = [
  "All Technologies",
  "Programming Languages",
  "Frontend Development",
  "Backend Development",
  "Mobile Development",
  "Databases",
  "DevOps and Cloud",
  "Development Tools",
  "Design and Prototyping",
  "Frameworks and Libraries",
] as const;

export type CategoryFilter = (typeof CATEGORIES)[number];

const CATEGORY_ICONS: Record<string, any> = {
  "Programming Languages": Code2,
  "Frontend Development": Layout,
  "Backend Development": Server,
  "Mobile Development": Smartphone,
  Databases: Database,
  "DevOps and Cloud": Cloud,
  "Development Tools": Wrench,
  "Design and Prototyping": Palette,
  "Frameworks and Libraries": Boxes,
};

export default function SkillsSection() {
  const { data: settings } = useGitHubSettings();
  const { data: technologies = [], isLoading: techLoading } = useTechnologies(false);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All Technologies");
  const [selectedScope, setSelectedScope] = useState<DualScope>("ALL");

  // GitHub Language Telemetry query
  const { data: langData, isLoading: langLoading } = useQuery<GitHubLanguagesResponse>({
    queryKey: ["github", "languages", selectedScope],
    queryFn: () => fetchGitHubLanguages(selectedScope),
    staleTime: 15 * 60 * 1000,
    enabled: settings?.showSkillsIntegration !== false,
  });

  const filteredTechnologies = useMemo(() => {
    if (activeCategory === "All Technologies") {
      return technologies;
    }
    return technologies.filter((t) => t.category === activeCategory);
  }, [technologies, activeCategory]);

  const categoriesWithTech = useMemo(() => {
    const map = new Map<string, Technology[]>();
    CATEGORIES.filter((c) => c !== "All Technologies").forEach((cat) => {
      map.set(cat, []);
    });

    technologies.forEach((tech) => {
      if (map.has(tech.category)) {
        map.get(tech.category)!.push(tech);
      }
    });

    return map;
  }, [technologies]);

  const featuredTechs = useMemo(() => {
    return technologies.filter((t) => t.featured);
  }, [technologies]);

  return (
    <section
      id="skills"
      className="section-padding relative overflow-hidden bg-[var(--bg-base,#302E2D)] border-t border-white/[0.08]"
    >
      {/* Background Ambience & Grid */}
      <div className="absolute inset-0 dot-matrix-grid opacity-25 pointer-events-none" />
      <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-[var(--primary-accent,#FFDD9B)]/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-[600px] h-[600px] bg-[var(--primary-accent,#FFDD9B)]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-accent,#FFDD9B)]/10 border border-[var(--primary-accent,#FFDD9B)]/25 mb-4">
            <Sparkles size={13} className="text-[var(--primary-accent,#FFDD9B)] animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--primary-accent,#FFDD9B)] font-bold">
              Technical Arsenal & Tooling
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-[var(--text-primary,#FFFFFF)] tracking-tight font-heading">
            Technologies Behind My Work
          </h2>

          <p className="text-[var(--text-secondary,#FFF1D8)] text-sm sm:text-base max-w-2xl leading-relaxed mt-3 font-body">
            Exploring and building digital solutions through modern programming languages, frameworks, and development tools.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const IconComponent = CATEGORY_ICONS[cat] || Layers;
            const count =
              cat === "All Technologies"
                ? technologies.length
                : (categoriesWithTech.get(cat) || []).length;
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 whitespace-nowrap transition-all duration-200 border ${
                  isActive
                    ? "bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] border-[var(--primary-accent,#FFDD9B)] shadow-md shadow-[#FFDD9B]/20"
                    : "bg-[var(--card-surface,#403C38)] text-[var(--text-secondary,#FFF1D8)] border-white/[0.08] hover:border-white/20 hover:text-white"
                }`}
              >
                <IconComponent size={14} className={isActive ? "text-[#302E2D]" : "text-[var(--primary-accent,#FFDD9B)]"} />
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? "bg-black/15 text-[#302E2D]"
                      : "bg-white/[0.06] text-[var(--text-secondary,#FFF1D8)]/70"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Technology Cards Grid */}
        {activeCategory === "All Technologies" ? (
          /* Grouped by Distinctive Categories */
          <div className="space-y-12">
            {Array.from(categoriesWithTech.entries()).map(([catName, techList]) => {
              if (techList.length === 0) return null;
              const CatIcon = CATEGORY_ICONS[catName] || Layers;

              return (
                <div key={catName} className="space-y-4">
                  {/* Category Title Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[var(--primary-accent,#FFDD9B)]/10 border border-[var(--primary-accent,#FFDD9B)]/30 flex items-center justify-center text-[var(--primary-accent,#FFDD9B)]">
                        <CatIcon size={16} />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold font-heading text-white">
                        {catName}
                      </h3>
                      <span className="text-xs font-mono text-[var(--text-secondary,#FFF1D8)]/60">
                        ({techList.length})
                      </span>
                    </div>
                  </div>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {techList.map((tech, idx) => (
                      <TechCard
                        key={tech.slug || idx}
                        tech={tech}
                        colorMode="brand"
                        idx={idx}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Single Category Filtered Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTechnologies.map((tech, idx) => (
              <TechCard
                key={tech.slug || idx}
                tech={tech}
                colorMode="brand"
                idx={idx}
              />
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* GITHUB REPOSITORY LANGUAGE METRICS ACCORDION                              */}
        {/* ========================================================================= */}
        {settings?.showSkillsIntegration !== false && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 p-6 sm:p-8 rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] shadow-xl relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--primary-accent,#FFDD9B)]/10 border border-[var(--primary-accent,#FFDD9B)]/30 flex items-center justify-center text-[var(--primary-accent,#FFDD9B)] font-bold">
                  <Binary size={20} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-heading text-white">
                    Verified Repository Language Distribution
                  </h3>
                  <p className="text-xs text-[var(--text-secondary,#FFF1D8)] font-mono">
                    Direct telemetry aggregated across connected personal and organizational GitHub repositories
                  </p>
                </div>
              </div>

              {/* Scope Switcher */}
              <div className="inline-flex p-1 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs font-mono self-start sm:self-auto">
                <button
                  onClick={() => setSelectedScope("ALL")}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    selectedScope === "ALL"
                      ? "bg-white/[0.1] text-white"
                      : "text-[var(--text-secondary,#FFF1D8)]/70 hover:text-white"
                  }`}
                >
                  Combined
                </button>
                <button
                  onClick={() => setSelectedScope("PERSONAL")}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    selectedScope === "PERSONAL"
                      ? "bg-sky-500/20 text-sky-300"
                      : "text-[var(--text-secondary,#FFF1D8)]/70 hover:text-white"
                  }`}
                >
                  Personal
                </button>
                <button
                  onClick={() => setSelectedScope("ORGANIZATION")}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    selectedScope === "ORGANIZATION"
                      ? "bg-amber-500/20 text-amber-300"
                      : "text-[var(--text-secondary,#FFF1D8)]/70 hover:text-white"
                  }`}
                >
                  Ariitii Tech
                </button>
              </div>
            </div>

            {/* Language Distribution Progress Bar */}
            <div className="h-2.5 w-full rounded-full bg-[var(--bg-base,#302E2D)] overflow-hidden flex p-0.5 gap-0.5 mb-4 border border-white/[0.06]">
              {langLoading ? (
                <div className="w-full h-full bg-white/[0.1] animate-pulse rounded-full" />
              ) : (
                (langData?.languages || []).slice(0, 8).map((l, i) => {
                  const colors = [
                    "#3178C6", // TypeScript Blue
                    "#F7DF1E", // JS Yellow
                    "#3776AB", // Python Blue
                    "#777BB4", // PHP Purple
                    "#E34F26", // HTML Orange
                    "#1572B6", // CSS Blue
                    "#06B6D4", // Cyan
                    "#10B981", // Emerald
                  ];
                  return (
                    <div
                      key={l.language}
                      style={{
                        width: `${Math.max(l.percentage, 2)}%`,
                        backgroundColor: colors[i % colors.length],
                      }}
                      className="h-full rounded-full transition-all duration-500"
                      title={`${l.language}: ${l.percentage}%`}
                    />
                  );
                })
              )}
            </div>

            {/* Language Breakdown Pills */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              {langLoading ? (
                <span className="text-xs text-[var(--text-secondary,#FFF1D8)] font-mono">
                  Loading language telemetry...
                </span>
              ) : (
                (langData?.languages || []).slice(0, 8).map((l, i) => {
                  const colors = [
                    "#3178C6",
                    "#F7DF1E",
                    "#3776AB",
                    "#777BB4",
                    "#E34F26",
                    "#1572B6",
                    "#06B6D4",
                    "#10B981",
                  ];
                  return (
                    <div
                      key={l.language}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-base,#302E2D)] border border-white/[0.06] text-xs font-mono"
                    >
                      <TechIcon name={l.language} size={16} colorMode="brand" />
                      <span className="text-white font-bold">{l.language}</span>
                      <span className="text-[var(--text-secondary,#FFF1D8)]/60">{l.percentage}%</span>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// Subcomponent: Individual Bento Tech Card
interface TechCardProps {
  tech: Technology;
  colorMode: "brand" | "warm";
  idx: number;
}

function TechCard({ tech, colorMode, idx }: TechCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (idx % 6) * 0.04 }}
      className={`group relative p-5 rounded-2xl bg-[var(--card-surface,#403C38)] border transition-all duration-300 flex flex-col justify-between shadow-lg hover:-translate-y-1 ${
        tech.featured
          ? "border-[var(--primary-accent,#FFDD9B)]/30 ring-1 ring-[var(--primary-accent,#FFDD9B)]/10"
          : "border-white/[0.08] hover:border-white/25"
      }`}
    >
      <div>
        {/* Top Icon & Badges Row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] flex items-center justify-center p-2.5 group-hover:scale-105 group-hover:border-[var(--primary-accent,#FFDD9B)]/40 transition-all duration-300 shadow-inner">
            <TechIcon
              name={tech.icon || tech.slug}
              size={30}
              colorMode={colorMode}
              title={tech.name}
            />
          </div>

          <div className="flex flex-col items-end gap-1">
            {tech.experienceLevel && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-[var(--primary-accent,#FFDD9B)]/10 text-[var(--primary-accent,#FFDD9B)] border border-[var(--primary-accent,#FFDD9B)]/25">
                {tech.experienceLevel}
              </span>
            )}

            {tech.source === "github_detected" && (
              <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-300/80">
                <CheckCircle2 size={10} className="text-emerald-400" />
                <span>Verified Repo</span>
              </span>
            )}
          </div>
        </div>

        {/* Title & Category */}
        <div className="mb-2">
          <h4 className="text-base font-black font-heading text-white group-hover:text-[var(--primary-accent,#FFDD9B)] transition-colors">
            {tech.name}
          </h4>
          <span className="text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]/60">
            {tech.category}
          </span>
        </div>

        {/* Short Description */}
        {tech.description && (
          <p className="text-xs text-[var(--text-secondary,#FFF1D8)]/80 leading-relaxed font-body mt-2 line-clamp-2">
            {tech.description}
          </p>
        )}
      </div>

      {/* Subtle Bottom Accent Indicator */}
      <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]/50">
        <span>Production Ready</span>
        {tech.featured && (
          <span className="text-[var(--primary-accent,#FFDD9B)] flex items-center gap-1">
            <Sparkles size={10} />
            <span>Featured</span>
          </span>
        )}
      </div>
    </motion.div>
  );
}
