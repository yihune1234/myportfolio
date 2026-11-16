import Navigation from "@/components/Navigation";
import HeroSection from "@/components/sections/HeroSection";
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

export default function Index() {
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
      <footer className="relative overflow-hidden border-t border-white/[0.08] bg-[#07090E]">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 left-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 dot-matrix-grid opacity-15 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand & Monogram */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#0E131F] border border-white/10 flex items-center justify-center shadow-lg shadow-black/40 group">
                  <svg
                    className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform duration-300"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 6L16 19L25 6"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 19V26"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M16 6H25C27.5 6 27.5 12 25 12H16"
                      stroke="#F59E0B"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M16 12H26C28.5 12 28.5 18 26 18H16"
                      stroke="#F59E0B"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div>
                  <span className="font-black text-xl text-[#F8FAFC] tracking-tight block">
                    Yihune Belay
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                    Architectural Telemetry & Venture Hub
                  </span>
                </div>
              </div>
              <p className="text-sm text-[#94A3B8] leading-relaxed max-w-sm mb-5">
                Full-stack software engineer & distributed systems architect. Specializing in high-throughput backend APIs, security engineering, and multi-tenant commerce platforms.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0E131F] border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Personal Lab: @yihune1234
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0E131F] border border-amber-500/20 text-[11px] font-mono text-amber-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Org Venture: @AriitiMarket
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-mono text-[#F8FAFC] uppercase tracking-wider text-xs mb-5 font-bold">
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
                      className="text-xs text-[#94A3B8] hover:text-emerald-400 transition-colors font-mono"
                    >
                      → {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect & Security */}
            <div>
              <h4 className="font-mono text-[#F8FAFC] uppercase tracking-wider text-xs mb-5 font-bold">
                Connect & Admin
              </h4>
              <div className="flex flex-col gap-4">
                <div className="flex gap-2.5">
                  <a
                    href="https://github.com/yihune1234"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#0E131F] border border-white/[0.08] text-[#94A3B8] hover:text-emerald-400 hover:border-emerald-500/30 transition-all duration-200"
                    title="Personal GitHub: @yihune1234"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href="https://github.com/AriitiMarket"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#0E131F] border border-white/[0.08] text-[#94A3B8] hover:text-amber-400 hover:border-amber-500/30 transition-all duration-200"
                    title="Organization GitHub: @AriitiMarket"
                  >
                    <Github className="w-4 h-4 text-amber-400/80" />
                  </a>
                  <a
                    href="https://linkedin.com/in/yihune-belay"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#0E131F] border border-white/[0.08] text-[#94A3B8] hover:text-emerald-400 hover:border-emerald-500/30 transition-all duration-200"
                    title="LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setShowAdminPortal(true)}
                    className="p-2.5 rounded-xl bg-[#0E131F] border border-white/[0.08] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-white/20 transition-all duration-200"
                    title="Admin Access Portal"
                  >
                    <Lock className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-[#0E131F] border border-white/[0.06] text-[11px] font-mono text-[#64748B] space-y-1">
                  <div className="flex items-center justify-between text-[#94A3B8]">
                    <span>Telemetry Sync</span>
                    <span className="text-emerald-400 font-bold">AUTOMATED</span>
                  </div>
                  <div>Stack: React · Vite · Express · Mongo</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.08] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#64748B]">
            <p>
              © {new Date().getFullYear()} Yihune Belay. All rights reserved.
            </p>
            <p className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400/80" />
              Verified Telemetry Hub · Haramaya SE Alum
            </p>
          </div>
        </div>
      </footer>

      <AIChatWidget />
    </div>
  );
}
