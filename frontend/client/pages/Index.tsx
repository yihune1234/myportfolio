import Navigation from "@/components/Navigation";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import PlatformShowcase from "@/components/sections/PlatformShowcase";
import ExperienceSection from "@/components/sections/ExperienceSection";
import EducationSection, {
  ContactSection,
} from "@/components/sections/EducationSection";
import { useState } from "react";
import { AdminLogin } from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AIChatWidget from "@/components/AIChatWidget";
import { Lock, Github, Linkedin, Sparkles } from "lucide-react";

export default function Index() {
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(
    localStorage.getItem("adminToken")
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
        <ProjectsSection />
        <PlatformShowcase />
        <ExperienceSection />
        <EducationSection />
        <ContactSection />
      </main>

      {/* Premium Footer */}
      <footer className="relative overflow-hidden border-t border-white/[0.06] bg-background">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-full bg-gradient-to-b from-[#FF8A00]/5 via-[#FF6B00]/5 to-transparent blur-[100px]" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FF8A00] to-[#FF6B00] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF8A00]/20">
                  <Sparkles className="w-5 h-5 text-[#050816]" />
                </div>
                <span className="font-black text-xl text-[#F5F7FA] tracking-tight">Yihune Belay</span>
              </div>
              <p className="text-sm text-[#B7C0D1] leading-relaxed max-w-sm">
                Full-stack software engineer specializing in backend systems,
                API architecture, and scalable digital infrastructure.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-[#F5F7FA] uppercase tracking-widest text-xs mb-6">Navigate</h4>
              <ul className="space-y-3">
                {[
                  { name: "Home", id: "home" },
                  { name: "Projects", id: "projects" },
                  { name: "Experience", id: "experience" },
                  { name: "Contact", id: "contact" },
                ].map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() =>
                        document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" })
                      }
                      className="text-sm text-[#B7C0D1] hover:text-[#FF8A00] transition-colors font-medium"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="font-bold text-[#F5F7FA] uppercase tracking-widest text-xs mb-6">Connect</h4>
              <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <a
                    href="https://github.com/yihune1234"
                    target="_blank"
                    className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[#B7C0D1] hover:text-[#FF8A00] hover:bg-white/[0.06] hover:border-[#FF8A00]/20 transition-all duration-300"
                    title="GitHub"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href="https://linkedin.com/in/yihune-belay"
                    target="_blank"
                    className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[#B7C0D1] hover:text-[#FF8A00] hover:bg-white/[0.06] hover:border-[#FF8A00]/20 transition-all duration-300"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => setShowAdminPortal(true)}
                    className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[#B7C0D1] hover:text-[#FF8A00] hover:bg-white/[0.06] hover:border-[#FF8A00]/20 transition-all duration-300"
                    title="Admin Portal"
                  >
                    <Lock className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.06] pt-8 text-center">
            <p className="text-xs text-muted-foreground font-medium">
              © 2024 Yihune Belay. Designed & Built with precision.
            </p>
          </div>
        </div>
      </footer>

      <AIChatWidget />
    </div>
  );
}
