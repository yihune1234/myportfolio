import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Github,
  Star,
  ExternalLink,
  FolderGit2,
  ArrowUpRight,
} from "lucide-react";
import { useGitHubSettings } from "@/hooks/useGitHubSettings";
import { getRealGitHubRepos, RealGitHubRepo } from "@/lib/realGithubClient";

interface DisplayRepo {
  name: string;
  fullName: string;
  description: string;
  language: string | null;
  stars: number;
  forks: number;
  htmlUrl: string;
  demoUrl?: string;
  pushedAt: string;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3776AB",
  PHP: "#777BB4",
  HTML: "#E34F26",
  CSS: "#1572B6",
};

export default function RepositoriesSection() {
  const { data: settings } = useGitHubSettings();
  const username = settings?.githubUsername || "yihune1234";

  const [featuredRepos, setFeaturedRepos] = useState<DisplayRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadRealRepos() {
      setLoading(true);
      try {
        // Fetch all real public repositories directly from GitHub API
        const allRealRepos = await getRealGitHubRepos(username);

        // Filter out forks and empty repos
        const eligibleRepos = allRealRepos.filter(
          (r) => !r.fork && r.size > 0 && r.name.toLowerCase() !== username.toLowerCase()
        );

        // Check if admin has selected featured repos
        let adminSelections: any[] | null = null;
        if (Array.isArray(settings?.featuredRepos) && settings.featuredRepos.length > 0) {
          adminSelections = settings.featuredRepos
            .map((item: any) => {
              if (typeof item === "string") {
                try {
                  return JSON.parse(item);
                } catch {
                  return { name: item, visible: true };
                }
              }
              return item;
            })
            .filter((i: any) => i.visible !== false);
        } else {
          const local = localStorage.getItem("admin_featured_repos");
          if (local) {
            try {
              const parsed = JSON.parse(local);
              if (Array.isArray(parsed) && parsed.length > 0) {
                adminSelections = parsed.filter((i: any) => i.visible !== false);
              }
            } catch {}
          }
        }

        let selectedRepos: DisplayRepo[] = [];

        if (adminSelections && adminSelections.length > 0) {
          // Map admin choices to real GitHub repository data
          selectedRepos = adminSelections.slice(0, 4).map((sel) => {
            const realMatch = eligibleRepos.find(
              (r) => r.name.toLowerCase() === sel.name.toLowerCase()
            );
            return {
              name: sel.name,
              fullName: realMatch?.full_name || `${username}/${sel.name}`,
              description:
                sel.customDescription ||
                realMatch?.description ||
                "Software engineering repository on GitHub.",
              language: realMatch?.language || "TypeScript",
              stars: realMatch?.stargazers_count ?? 0,
              forks: realMatch?.forks_count ?? 0,
              htmlUrl: realMatch?.html_url || `https://github.com/${username}/${sel.name}`,
              demoUrl: sel.demoUrl || realMatch?.homepage || "",
              pushedAt: realMatch?.pushed_at || realMatch?.updated_at || new Date().toISOString(),
            };
          });
        } else {
          // Automatic selection: Take top 4 real public repos with real descriptions from GitHub
          selectedRepos = eligibleRepos.slice(0, 4).map((r) => ({
            name: r.name,
            fullName: r.full_name,
            description: r.description || "Software engineering repository on GitHub.",
            language: r.language,
            stars: r.stargazers_count,
            forks: r.forks_count,
            htmlUrl: r.html_url,
            demoUrl: r.homepage || "",
            pushedAt: r.pushed_at || r.updated_at,
          }));
        }

        if (mounted) {
          setFeaturedRepos(selectedRepos);
        }
      } catch (e) {
        console.error("Error loading real repos:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadRealRepos();
    return () => {
      mounted = false;
    };
  }, [username, settings]);

  const formatDate = (isoString?: string) => {
    if (!isoString) return "Recently updated";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section
      id="repositories"
      className="py-20 relative overflow-hidden bg-[var(--bg-base,#302E2D)] border-t border-white/[0.08]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-[var(--primary-accent,#FFDD9B)] uppercase block mb-2">
              Featured Repositories
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-heading">
              Featured Repositories
            </h2>
            <p className="text-[var(--text-secondary,#FFF1D8)] text-sm sm:text-base max-w-2xl leading-relaxed mt-2 font-body">
              Selected public repositories from my GitHub account with live repository statistics.
            </p>
          </div>

          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--primary-accent,#FFDD9B)] hover:text-white transition-colors self-start md:self-auto group"
          >
            <span>Explore all on GitHub</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>

        {/* 3 or 4 Selected Repositories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-48 rounded-2xl bg-[var(--card-surface,#403C38)]/60 border border-white/[0.06] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredRepos.map((repo, idx) => {
              const langColor = repo.language ? LANGUAGE_COLORS[repo.language] || "#FFDD9B" : "#A8A29E";

              return (
                <motion.div
                  key={repo.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="group p-5 rounded-2xl bg-[var(--card-surface,#403C38)] hover:bg-[var(--card-elevated,#4A4642)] border border-white/[0.08] hover:border-[var(--primary-accent,#FFDD9B)]/35 transition-all duration-300 flex flex-col justify-between shadow-lg"
                >
                  <div>
                    {/* Header: Name and External Link */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <FolderGit2 size={16} className="text-[var(--primary-accent,#FFDD9B)] flex-shrink-0" />
                        <a
                          href={repo.htmlUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-sm font-bold text-white hover:text-[var(--primary-accent,#FFDD9B)] transition-colors truncate"
                          title={repo.name}
                        >
                          {repo.name}
                        </a>
                      </div>

                      <a
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded text-[var(--text-secondary,#FFF1D8)]/60 hover:text-white transition-colors flex-shrink-0"
                        title="Open on GitHub"
                      >
                        <ExternalLink size={13} />
                      </a>
                    </div>

                    {/* Real GitHub Description */}
                    <p className="text-xs text-[var(--text-secondary,#FFF1D8)] leading-relaxed font-body line-clamp-3 mb-4">
                      {repo.description}
                    </p>
                  </div>

                  {/* Metadata & Actions */}
                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-1.5">
                      {repo.language && (
                        <>
                          <span
                            className="w-2 h-2 rounded-full inline-block flex-shrink-0"
                            style={{ backgroundColor: langColor }}
                          />
                          <span className="text-[11px] text-[var(--text-secondary,#FFF1D8)] font-medium">
                            {repo.language}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5">
                      {repo.stars > 0 && (
                        <span className="flex items-center gap-1 text-[11px] text-[var(--primary-accent,#FFDD9B)]">
                          <Star size={11} className="fill-current" />
                          <span>{repo.stars}</span>
                        </span>
                      )}

                      <span className="text-[10px] text-[var(--text-secondary,#FFF1D8)]/60">
                        {formatDate(repo.pushedAt)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Footer simple link */}
        <div className="mt-10 text-center">
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-secondary,#FFF1D8)]/80 hover:text-[var(--primary-accent,#FFDD9B)] transition-colors"
          >
            <Github size={14} />
            <span>View all public repositories at github.com/{username}</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </section>
  );
}
