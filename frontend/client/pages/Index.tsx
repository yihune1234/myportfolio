import Navigation from "@/components/Navigation";
import HeroSection from "@/components/sections/HeroSection";
import YBLogo from "@/components/YBLogo";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import EngineeringShowcase from "@/components/showcase/EngineeringShowcase";
import PlatformShowcase from "@/components/sections/PlatformShowcase";
import ExperienceSection from "@/components/sections/ExperienceSection";
import EducationSection, {
  ContactSection,
} from "@/components/sections/EducationSection";
import { useState } from "react";
import { AdminLogin } from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AIChatWidget from "@/components/AIChatWidget";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Lock, Github, Linkedin, Sparkles } from "lucide-react";
import { useGitHubSettings } from "@/hooks/useGitHubSettings";

export default function Index() {
  const { data: settings } = useGitHubSettings();
  const personalUsername = settings?.githubUsername || "yihune1234";
  const orgUsername = settings?.githubOrg || "AriitiMarket";
  const personalUrl = `https://github.com/${personalUsername}`;
  const orgUrl = `https://github.com/${orgUsername}`;
  const showPersonal = settings?.personalVisibility !== false;
  const showOrg = settings?.orgVisibility !== false;

  const [showAdminPortal, setShowAdminPortal] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(
    localStorage.getItem("adminToken"),
  );

  const handleContactClick = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleProjectsClick = () => {
    const element = document.getElementById("projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAdminLogin = (token: string) => {
    setAdminToken(token);
    localStorage.setItem("adminToken", token);
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setShowAdminPortal(false);
  };

  if (adminToken && showAdminPortal) {
    return (
      <AdminDashboard
        onLogout={handleAdminLogout}
        onBack={() => setShowAdminPortal(false)}
      />
    );
  }

  if (showAdminPortal && !adminToken) {
    return (
      <AdminLogin
        onLogin={handleAdminLogin}
        onBack={() => setShowAdminPortal(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main>
        <HeroSection
          onContactClick={handleContactClick}
          onProjectsClick={handleProjectsClick}
        />
        <AboutSection />
        <SkillsSection />
        <ErrorBoundary fallbackTitle="Projects Section">
          <ProjectsSection />
        </ErrorBoundary>
        <ErrorBoundary fallbackTitle="Engineering Showcase">
          <EngineeringShowcase />
        </ErrorBoundary>
        <PlatformShowcase />
        <ExperienceSection />
        <EducationSection />
        <ContactSection />
      </main>

      {/* Architectural Telemetry Footer */}
      <footer className="relative overflow-hidden border-t border-[var(--border-color,rgba(255,221,155,0.18))] bg-[var(--bg-base,#302E2D)]">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 left-1/4 -translate-y-1/2 w-96 h-96 bg-[var(--primary-accent,#FFDD9B)]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-96 h-96 bg-[var(--secondary-accent,#FFDD9B)]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 dot-matrix-grid opacity-15 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand & Monogram */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3.5 mb-5">
                <YBLogo size="md" />
                <div>
                  <span className="font-black text-xl text-[var(--text-primary,#FFFFFF)] tracking-tight block">
                    Yihune Belay
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--primary-accent,#FFDD9B)]">
                    Architectural Telemetry & Venture Hub
                  </span>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary,#FFF1D8)] leading-relaxed max-w-sm mb-5">
                Full-stack software engineer & distributed systems architect. Specializing in high-throughput backend APIs, security engineering, and multi-tenant commerce platforms.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {showPersonal && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--card-surface,#3A3836)] border border-[var(--primary-accent,#FFDD9B)]/25 text-[11px] font-mono text-[var(--primary-accent,#FFDD9B)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-accent,#FFDD9B)] animate-pulse" />
                    Personal Lab: @{personalUsername}
                  </span>
                )}
                {showOrg && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--card-surface,#3A3836)] border border-[var(--secondary-accent,#FFDD9B)]/25 text-[11px] font-mono text-[var(--secondary-accent,#FFDD9B)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--secondary-accent,#FFDD9B)]" />
                    Org Venture: @{orgUsername}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-mono text-[var(--text-primary,#FFFFFF)] uppercase tracking-wider text-xs mb-5 font-bold">
                Telemetry Nodes
              </h4>
              <ul className="space-y-2.5">
                {[
                  { name: "Overview", id: "home" },
                  { name: "About Architecture", id: "about" },
                  { name: "System Skills", id: "skills" },
                  { name: "Projects Catalog", id: "projects" },
                  { name: "Engineering Pulse", id: "engineering" },
                  { name: "Experience Matrix", id: "experience" },
                  { name: "Contact Terminal", id: "contact" },
                ].map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() =>
                        document
                          .getElementById(link.id)
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                      className="text-xs text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--primary-accent,#FFDD9B)] transition-colors font-mono"
                    >
                      → {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect & Security */}
            <div>
              <h4 className="font-mono text-[var(--text-primary,#FFFFFF)] uppercase tracking-wider text-xs mb-5 font-bold">
                Connect & Admin
              </h4>
              <div className="flex flex-col gap-4">
                <div className="flex gap-2.5">
                  {showPersonal && (
                    <a
                      href={personalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-[var(--card-surface,#3A3836)] border border-white/[0.08] text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--primary-accent,#FFDD9B)] hover:border-[var(--primary-accent,#FFDD9B)]/30 transition-all duration-200"
                      title={`Personal GitHub: @${personalUsername}`}
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {showOrg && (
                    <a
                      href={orgUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-[var(--card-surface,#3A3836)] border border-white/[0.08] text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--secondary-accent,#FFDD9B)] hover:border-[var(--secondary-accent,#FFDD9B)]/30 transition-all duration-200"
                      title={`Organization GitHub: @${orgUsername}`}
                    >
                      <Github className="w-4 h-4 text-[var(--secondary-accent,#FFDD9B)]" />
                    </a>
                  )}
                  <a
                    href="https://linkedin.com/in/yihune-belay"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[var(--card-surface,#3A3836)] border border-white/[0.08] text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--primary-accent,#FFDD9B)] hover:border-[var(--primary-accent,#FFDD9B)]/30 transition-all duration-200"
                    title="LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setShowAdminPortal(true)}
                    className="p-2.5 rounded-xl bg-[var(--card-surface,#3A3836)] border border-white/[0.08] text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--text-primary,#FFFFFF)] hover:border-white/20 transition-all duration-200"
                    title="Admin Access Portal"
                  >
                    <Lock className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-[var(--card-surface,#3A3836)] border border-white/[0.06] text-[11px] font-mono text-[var(--text-secondary,#FFF1D8)]/70 space-y-1">
                  <div className="flex items-center justify-between text-[var(--text-secondary,#FFF1D8)]">
                    <span>Telemetry Sync</span>
                    <span className="text-[var(--primary-accent,#FFDD9B)] font-bold">AUTOMATED</span>
                  </div>
                  <div>Stack: React · Vite · Express · Mongo</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.08] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--text-secondary,#FFF1D8)]/70">
            <p>
              © {new Date().getFullYear()} Yihune Belay. All rights reserved.
            </p>
            <p className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[var(--primary-accent,#FFDD9B)]" />
              Verified Telemetry Hub · Haramaya SE Alum
            </p>
          </div>
        </div>
      </footer>

      <AIChatWidget />
    </div>
  );
}
