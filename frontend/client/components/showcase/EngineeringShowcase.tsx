import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Terminal as TerminalIcon,
  Play,
  RotateCcw,
  ExternalLink,
  Github,
  Star,
  GitFork,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Code2,
  Calendar,
} from "lucide-react";
import { useGitHubSettings } from "@/hooks/useGitHubSettings";
import {
  getRealGitHubProfile,
  getRealGitHubRepos,
  getRealRepoDetails,
  RealGitHubProfile,
  RealGitHubRepo,
} from "@/lib/realGithubClient";

interface TerminalEntry {
  command: string;
  output: React.ReactNode;
  timestamp: string;
}

export default function EngineeringShowcase() {
  const { data: settings } = useGitHubSettings();
  const username = settings?.githubUsername || "yihune1234";

  const [history, setHistory] = useState<TerminalEntry[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isExecuting, setIsExecuting] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getTimestamp = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  useEffect(() => {
    setHistory([
      {
        command: "welcome",
        output: (
          <div className="space-y-1.5 text-xs">
            <p className="text-[var(--primary-accent,#FFDD9B)] font-bold">
              Engineering Console v2.2 &bull; Connected to GitHub (@{username})
            </p>
            <p className="text-[var(--text-secondary,#FFF1D8)]/80">
              Interactive terminal retrieving live data from GitHub API. Type <span className="text-white font-bold">help</span> to view commands or click a chip below.
            </p>
          </div>
        ),
        timestamp: getTimestamp(),
      },
    ]);
  }, [username]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isExecuting]);

  const handleCommand = async (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);
    setInputVal("");

    const parts = trimmed.split(" ");
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(" ").trim();

    if (cmd === "clear") {
      setHistory([]);
      return;
    }

    setIsExecuting(true);
    let output: React.ReactNode = null;

    try {
      switch (cmd) {
        case "help":
          output = (
            <div className="space-y-1.5 text-xs font-mono">
              <p className="text-[var(--primary-accent,#FFDD9B)] font-bold">Available Commands:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                <div>
                  <span className="text-white font-bold">about</span>
                  <span className="text-[var(--text-secondary,#FFF1D8)]/70"> &mdash; Professional introduction</span>
                </div>
                <div>
                  <span className="text-white font-bold">projects</span>
                  <span className="text-[var(--text-secondary,#FFF1D8)]/70"> &mdash; Selected portfolio projects</span>
                </div>
                <div>
                  <span className="text-white font-bold">github</span>
                  <span className="text-[var(--text-secondary,#FFF1D8)]/70"> &mdash; Real GitHub profile stats</span>
                </div>
                <div>
                  <span className="text-white font-bold">repos</span>
                  <span className="text-[var(--text-secondary,#FFF1D8)]/70"> &mdash; Live repository listings</span>
                </div>
                <div>
                  <span className="text-white font-bold">repo &lt;name&gt;</span>
                  <span className="text-[var(--text-secondary,#FFF1D8)]/70"> &mdash; Real repository inspection</span>
                </div>
                <div>
                  <span className="text-white font-bold">languages</span>
                  <span className="text-[var(--text-secondary,#FFF1D8)]/70"> &mdash; Real language distribution</span>
                </div>
                <div>
                  <span className="text-white font-bold">clear</span>
                  <span className="text-[var(--text-secondary,#FFF1D8)]/70"> &mdash; Clear terminal screen</span>
                </div>
              </div>
            </div>
          );
          break;

        case "about": {
          const profile = await getRealGitHubProfile(username);
          output = (
            <div className="space-y-2 text-xs font-mono">
              <p className="text-white font-bold text-sm">{profile.name || "Yihune Belay"} &mdash; Software Engineer</p>
              <p className="text-[var(--text-secondary,#FFF1D8)] leading-relaxed">
                {profile.bio || "Full-stack software engineer and Co-Founder at Ariitii Tech. Pursuing Software Engineering at Haramaya University, based in Addis Ababa, Ethiopia."}
              </p>
              <div className="text-[var(--text-secondary,#FFF1D8)]/80 space-y-0.5">
                <p>&bull; University / Affiliation: {profile.company || "Software Engineering Student | Haramaya University"}</p>
                <p>&bull; Location: {profile.location || "Addis Ababa, Ethiopia"}</p>
                <p>&bull; Public Repositories: {profile.public_repos}</p>
                <p>&bull; Focus: Scalable backend APIs, clean architecture, web applications, mobile platforms</p>
              </div>
            </div>
          );
          break;
        }

        case "projects": {
          const repos = await getRealGitHubRepos(username);
          const topProjects = repos.slice(0, 4);

          output = (
            <div className="space-y-2 text-xs font-mono">
              <p className="text-[var(--primary-accent,#FFDD9B)] font-bold">Live Portfolio Repositories from GitHub:</p>
              <div className="space-y-2 pt-1">
                {topProjects.map((p, i) => (
                  <div key={p.id} className="p-2 rounded bg-white/[0.03] border border-white/[0.04]">
                    <div className="flex items-center justify-between">
                      <a href={p.html_url} target="_blank" rel="noopener noreferrer" className="text-white font-bold hover:text-[var(--primary-accent,#FFDD9B)]">
                        {i + 1}. {p.name}
                      </a>
                      {p.language && <span className="text-[var(--primary-accent,#FFDD9B)] text-[10px]">{p.language}</span>}
                    </div>
                    <p className="text-[var(--text-secondary,#FFF1D8)]/70 text-[11px] line-clamp-2 mt-0.5">
                      {p.description || "Software repository on GitHub."}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-[#A8A29E] mt-1">
                      <span>Stars: {p.stargazers_count}</span>
                      <span>Branch: {p.default_branch}</span>
                      {p.homepage && (
                        <a href={p.homepage} target="_blank" rel="noopener noreferrer" className="text-[var(--primary-accent,#FFDD9B)] underline">
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
          break;
        }

        case "github": {
          const profile = await getRealGitHubProfile(username);
          output = (
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-[var(--primary-accent,#FFDD9B)] font-bold">
                <Github size={14} />
                <span>GitHub Profile: @{profile.login}</span>
              </div>
              <div className="space-y-1 text-[var(--text-secondary,#FFF1D8)]">
                <p>Name: <span className="text-white font-bold">{profile.name}</span></p>
                <p>Company: <span>{profile.company}</span></p>
                <p>Bio: <span>{profile.bio}</span></p>
                <p>Location: <span>{profile.location}</span></p>
                <p>Public Repositories: <span className="text-emerald-400 font-bold">{profile.public_repos}</span></p>
                <p>Followers: <span className="text-white font-bold">{profile.followers}</span> &bull; Following: <span className="text-white font-bold">{profile.following}</span></p>
                <p>URL: <a href={profile.html_url} target="_blank" rel="noopener noreferrer" className="text-[var(--primary-accent,#FFDD9B)] underline">{profile.html_url}</a></p>
                {profile.blog && <p>Website: <a href={profile.blog} target="_blank" rel="noopener noreferrer" className="text-[var(--primary-accent,#FFDD9B)] underline">{profile.blog}</a></p>}
              </div>
            </div>
          );
          break;
        }

        case "repos": {
          const repos = await getRealGitHubRepos(username);
          const activeRepos = repos.slice(0, 6);

          output = (
            <div className="space-y-2 text-xs font-mono">
              <p className="text-[var(--primary-accent,#FFDD9B)] font-bold">
                Real Public Repositories for @{username} ({repos.length} total):
              </p>
              <div className="space-y-2 pt-1">
                {activeRepos.map((r) => (
                  <div key={r.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded bg-white/[0.03] border border-white/[0.04]">
                    <div className="min-w-0 flex-1">
                      <a href={r.html_url} target="_blank" rel="noopener noreferrer" className="text-white font-bold hover:text-[var(--primary-accent,#FFDD9B)] truncate block">
                        {r.name}
                      </a>
                      <p className="text-[11px] text-[var(--text-secondary,#FFF1D8)]/70 line-clamp-1">
                        {r.description || "Software repository on GitHub."}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-[#A8A29E] self-start sm:self-center flex-shrink-0">
                      {r.language && <span className="text-[var(--primary-accent,#FFDD9B)]">{r.language}</span>}
                      {r.stargazers_count > 0 && (
                        <span className="flex items-center gap-0.5 text-amber-300">
                          <Star size={10} className="fill-current" />
                          {r.stargazers_count}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-[#A8A29E] pt-1">
                Type <span className="text-white font-bold">repo &lt;name&gt;</span> to inspect any repository.
              </p>
            </div>
          );
          break;
        }

        case "repo": {
          if (!arg) {
            output = (
              <p className="text-amber-400 text-xs font-mono">
                Usage: <span className="text-white">repo &lt;name&gt;</span> (e.g. <span className="text-white">repo myportfolio</span> or <span className="text-white">repo InternshipApplicantManagementAPI</span>)
              </p>
            );
            break;
          }

          const repo = await getRealRepoDetails(arg, username);
          if (!repo) {
            output = (
              <p className="text-red-400 text-xs font-mono">
                Error: Repository <span className="text-white font-bold">"{arg}"</span> not found on @{username}. Type <span className="text-white font-bold">repos</span> to see available repositories.
              </p>
            );
            break;
          }

          output = (
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[var(--primary-accent,#FFDD9B)] font-bold text-sm">{repo.full_name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-emerald-400 font-bold">
                  PUBLIC
                </span>
              </div>
              <p className="text-[var(--text-secondary,#FFF1D8)] leading-relaxed">
                {repo.description || "No description provided."}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                <div className="p-1.5 rounded bg-white/[0.03]">
                  <span className="text-[#A8A29E] block text-[9px]">LANGUAGE</span>
                  <span className="text-white font-bold">{repo.language || "N/A"}</span>
                </div>
                <div className="p-1.5 rounded bg-white/[0.03]">
                  <span className="text-[#A8A29E] block text-[9px]">STARS</span>
                  <span className="text-amber-300 font-bold">{repo.stargazers_count}</span>
                </div>
                <div className="p-1.5 rounded bg-white/[0.03]">
                  <span className="text-[#A8A29E] block text-[9px]">FORKS</span>
                  <span className="text-white font-bold">{repo.forks_count}</span>
                </div>
                <div className="p-1.5 rounded bg-white/[0.03]">
                  <span className="text-[#A8A29E] block text-[9px]">DEFAULT BRANCH</span>
                  <span className="text-emerald-400 font-bold">{repo.default_branch}</span>
                </div>
              </div>
              <p className="pt-1">
                Source: <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-[var(--primary-accent,#FFDD9B)] underline">{repo.html_url}</a>
              </p>
              {repo.homepage && (
                <p>
                  Homepage: <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">{repo.homepage}</a>
                </p>
              )}
            </div>
          );
          break;
        }

        case "languages": {
          const repos = await getRealGitHubRepos(username);
          const langMap: Record<string, number> = {};
          let total = 0;

          repos.forEach((r) => {
            if (r.language && !r.fork) {
              langMap[r.language] = (langMap[r.language] || 0) + 1;
              total += 1;
            }
          });

          const sortedLangs = Object.entries(langMap).sort((a, b) => b[1] - a[1]);

          output = (
            <div className="space-y-2 text-xs font-mono">
              <p className="text-[var(--primary-accent,#FFDD9B)] font-bold">
                Language Distribution Across Real Public Repositories:
              </p>
              <div className="space-y-1.5 pt-1">
                {sortedLangs.map(([lang, count]) => {
                  const pct = Math.round((count / (total || 1)) * 100);
                  return (
                    <div key={lang} className="space-y-0.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-white font-semibold">{lang}</span>
                        <span className="text-[#A8A29E]">{count} repos ({pct}%)</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full bg-[var(--primary-accent,#FFDD9B)] rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
          break;
        }

        default:
          output = (
            <p className="text-red-400 text-xs font-mono">
              Command not recognized: <span className="text-white font-bold">"{trimmed}"</span>. Type <span className="text-white font-bold">help</span> to view available commands.
            </p>
          );
          break;
      }
    } catch (err: any) {
      output = (
        <p className="text-red-400 text-xs font-mono">
          Network Error: {err.message || "Failed to query GitHub API."}
        </p>
      );
    } finally {
      setIsExecuting(false);
      setHistory((prev) => [
        ...prev,
        { command: trimmed, output, timestamp: getTimestamp() },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(inputVal);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex =
        historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(commandHistory[nextIndex] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputVal("");
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex]);
      }
    }
  };

  return (
    <section
      id="engineering"
      className="py-20 relative overflow-hidden bg-[var(--bg-base,#302E2D)] border-t border-white/[0.08]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center lg:text-left"
        >
          <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-[var(--primary-accent,#FFDD9B)] uppercase block mb-2">
            Interactive Engineering Console
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-heading">
            Live Engineering
          </h2>
          <p className="text-[var(--text-secondary,#FFF1D8)] text-sm sm:text-base max-w-2xl leading-relaxed mt-2 font-body mx-auto lg:mx-0">
            Functional GitHub-connected terminal. Query live profile data, inspect real repositories, and explore technical telemetry.
          </p>
        </motion.div>

        {/* Quick Command Chips */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-mono text-[var(--text-secondary,#FFF1D8)]/70 mr-1">
            Quick commands:
          </span>
          {["help", "about", "projects", "github", "repos", "languages", "clear"].map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleCommand(cmd)}
              disabled={isExecuting}
              className="px-3 py-1 rounded-lg bg-[var(--card-surface,#403C38)] hover:bg-[var(--card-elevated,#4A4642)] border border-white/[0.08] hover:border-[var(--primary-accent,#FFDD9B)]/40 text-xs font-mono text-white transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <Play size={10} className="text-[var(--primary-accent,#FFDD9B)]" />
              <span>{cmd}</span>
            </button>
          ))}
        </div>

        {/* Terminal Window Container */}
        <div className="rounded-2xl bg-[#1C1A19] border border-white/[0.12] shadow-2xl overflow-hidden font-mono">
          {/* Window Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[var(--card-surface,#403C38)] border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-3 text-xs text-[var(--text-secondary,#FFF1D8)] font-semibold flex items-center gap-1.5">
                <TerminalIcon size={13} className="text-[var(--primary-accent,#FFDD9B)]" />
                <span>yihune@workstation:~ (github://api)</span>
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[var(--text-secondary,#FFF1D8)]/70">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CONNECTED</span>
            </div>
          </div>

          {/* Terminal Body Output Area */}
          <div
            onClick={() => inputRef.current?.focus()}
            className="p-5 sm:p-6 space-y-4 min-h-[320px] max-h-[500px] overflow-y-auto cursor-text scrollbar-thin scrollbar-thumb-white/[0.1]"
          >
            {history.map((entry, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[var(--primary-accent,#FFDD9B)] font-bold">yihune@workstation:~$</span>
                  <span className="text-white font-semibold">{entry.command}</span>
                  <span className="text-[10px] text-[#A8A29E] ml-auto">{entry.timestamp}</span>
                </div>
                <div className="pl-4 border-l-2 border-[var(--primary-accent,#FFDD9B)]/25 py-0.5">
                  {entry.output}
                </div>
              </div>
            ))}

            {isExecuting && (
              <div className="flex items-center gap-2 text-xs text-[var(--primary-accent,#FFDD9B)] pl-4">
                <Loader2 size={12} className="animate-spin" />
                <span>Querying GitHub API...</span>
              </div>
            )}

            {/* Input Line */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[var(--primary-accent,#FFDD9B)] font-bold text-xs flex-shrink-0">
                yihune@workstation:~$
              </span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type 'help', 'github', 'repos', 'repo myportfolio'..."
                disabled={isExecuting}
                className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder-[var(--text-secondary,#FFF1D8)]/40 font-mono"
                autoComplete="off"
                spellCheck="false"
              />
              <button
                onClick={() => handleCommand(inputVal)}
                disabled={isExecuting || !inputVal.trim()}
                className="px-2.5 py-1 rounded bg-[var(--primary-accent,#FFDD9B)] text-[#302E2D] text-[11px] font-bold disabled:opacity-40 transition-opacity"
              >
                Run
              </button>
            </div>
            <div ref={terminalEndRef} />
          </div>

          {/* Terminal Footer */}
          <div className="px-4 py-2 bg-[var(--bg-base,#302E2D)] border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[var(--text-secondary,#FFF1D8)]/70">
            <span>Terminal: Real live API calls &bull; Safe read-only scope</span>
            <span className="text-[var(--primary-accent,#FFDD9B)] font-semibold">GitHub: @{username}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
