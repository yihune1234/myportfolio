import Navigation from "@/components/Navigation";
import HeroSection from "@/components/sections/HeroSection";
import YBLogo from "@/components/YBLogo";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import MyProjectsSection from "@/components/sections/MyProjectsSection";
import AriitiiProjectsSection from "@/components/sections/AriitiiProjectsSection";
import RepositoriesSection from "@/components/sections/RepositoriesSection";
import EngineeringShowcase from "@/components/showcase/EngineeringShowcase";
import ExperienceSection from "@/components/sections/ExperienceSection";
import EducationSection, {
  ContactSection,
} from "@/components/sections/EducationSection";
import { useState } from "react";
import { AdminLogin } from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AIChatWidget from "@/components/AIChatWidget";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Lock, Github, Linkedin } from "lucide-react";
import { useGitHubSettings } from "@/hooks/useGitHubSettings";

export default function Index() {
  const { data: settings } = useGitHubSettings();
  const personalUsername = settings?.githubUsername || "yihune1234";
  const orgUsername = settings?.githubOrg || "AriitiMarket";
  const personalUrl = `https://github.com/${personalUsername}`;
  const orgUrl = `https://github.com/${orgUsername}`;

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
    const element = document.getElementById("my-projects");
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
    <div className="min-h-screen bg-[var(--bg-base,#302E2D)] text-foreground">
      <Navigation />

      <main>
        <HeroSection
          onContactClick={handleContactClick}
          onProjectsClick={handleProjectsClick}
        />
        <AboutSection />
        <SkillsSection />
        <ErrorBoundary fallbackTitle="My Projects Section">
          <MyProjectsSection />
        </ErrorBoundary>
        <ErrorBoundary fallbackTitle="Ariitii Tech Section">
          <AriitiiProjectsSection />
        </ErrorBoundary>
        <ErrorBoundary fallbackTitle="GitHub Repositories Section">
          <RepositoriesSection />
        </ErrorBoundary>
        <ErrorBoundary fallbackTitle="Live Engineering Showcase">
          <EngineeringShowcase />
        </ErrorBoundary>
        <ExperienceSection />
        <EducationSection />
        <ContactSection />
      </main>

      {/* Portfolio Footer */}
      <footer className="relative overflow-hidden border-t border-[var(--border-color,rgba(255,221,155,0.18))] bg-[var(--bg-base,#302E2D)]">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 left-1/4 -translate-y-1/2 w-96 h-96 bg-[var(--primary-accent,#FFDD9B)]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-96 h-96 bg-[var(--primary-accent,#FFDD9B)]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 dot-matrix-grid opacity-15 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand & Monogram */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3.5 mb-4">
                <YBLogo size="md" />
                <div>
                  <h4 className="font-heading font-black text-white text-base">
                    Yihune Belay
                  </h4>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--primary-accent,#FFDD9B)] font-bold">
                    Software Engineer &bull; Full-Stack &amp; Systems
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-secondary,#FFF1D8)] leading-relaxed max-w-sm mb-5">
                Full-stack software engineer building web applications, backend APIs, and cross-platform mobile systems with clean architecture.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={personalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[var(--card-surface,#403C38)] border border-[var(--primary-accent,#FFDD9B)]/25 text-[11px] font-mono text-[var(--primary-accent,#FFDD9B)] hover:bg-[var(--card-elevated,#4A4642)] transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-accent,#FFDD9B)] animate-pulse" />
                  GitHub: @{personalUsername}
                </a>
                <a
                  href={orgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[var(--card-surface,#403C38)] border border-amber-400/25 text-[11px] font-mono text-amber-300 hover:bg-[var(--card-elevated,#4A4642)] transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Org: @{orgUsername}
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-mono text-white uppercase tracking-wider text-xs mb-4 font-bold">
                Navigation
              </h4>
              <ul className="space-y-2">
                {[
                  { name: "Home", id: "home" },
                  { name: "Engineering Approach", id: "about" },
                  { name: "Technologies", id: "skills" },
                  { name: "My Projects", id: "my-projects" },
                  { name: "Ariitii Tech", id: "ariitii-tech-projects" },
                  { name: "Repositories", id: "repositories" },
                  { name: "Live Engineering", id: "engineering" },
                  { name: "Experience", id: "experience" },
                  { name: "Education", id: "education" },
                  { name: "Contact", id: "contact" },
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
                      &rarr; {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect & Admin */}
            <div>
              <h4 className="font-mono text-white uppercase tracking-wider text-xs mb-4 font-bold">
                Connect
              </h4>
              <div className="flex flex-col gap-4">
                <div className="flex gap-2.5">
                  <a
                    href={personalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--primary-accent,#FFDD9B)] hover:border-[var(--primary-accent,#FFDD9B)]/30 transition-all"
                    title={`Personal GitHub: @${personalUsername}`}
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href="https://linkedin.com/in/yihune-belay"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--primary-accent,#FFDD9B)] hover:border-[var(--primary-accent,#FFDD9B)]/30 transition-all"
                    title="LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setShowAdminPortal(true)}
                    className="p-2.5 rounded-xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] text-[var(--text-secondary,#FFF1D8)] hover:text-white transition-all"
                    title="Admin Access"
                  >
                    <Lock className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-[var(--card-surface,#403C38)] border border-white/[0.06] text-[11px] font-mono text-[var(--text-secondary,#FFF1D8)]/70 space-y-1">
                  <div className="flex items-center justify-between text-[var(--text-secondary,#FFF1D8)]">
                    <span>Portfolio Services</span>
                    <span className="text-[var(--primary-accent,#FFDD9B)] font-bold">ONLINE</span>
                  </div>
                  <div>React &bull; TypeScript &bull; Tailwind CSS</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.08] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--text-secondary,#FFF1D8)]/70">
            <p>
              &copy; {new Date().getFullYear()} Yihune Belay. All rights reserved.
            </p>
            <p className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[var(--primary-accent,#FFDD9B)]" />
              Software Engineering &bull; Haramaya University
            </p>
          </div>
        </div>
      </footer>

      <AIChatWidget />
    </div>
  );
}
