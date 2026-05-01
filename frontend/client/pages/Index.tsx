import Navigation from "@/components/Navigation";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import EducationSection, {
  ContactSection,
} from "@/components/sections/EducationSection";
import { useState } from "react";
import { AdminLogin } from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { Lock } from "lucide-react";

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

  // Show admin dashboard if logged in
  if (adminToken && showAdminPortal) {
    return (
      <AdminDashboard
        onLogout={handleAdminLogout}
        onBack={() => setShowAdminPortal(false)}
      />
    );
  }

  // Show admin login if portal is open but not logged in
  if (showAdminPortal && !adminToken) {
    return (
      <AdminLogin
        onLogin={handleAdminLogin}
        onBack={() => setShowAdminPortal(false)}
      />
    );
  }

  // Show normal portfolio
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
        <ExperienceSection />
        <EducationSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50%] h-[100%] bg-primary/5 rounded-full blur-[100px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div className="text-center md:text-left">
              <h3 className="font-black text-2xl mb-6 text-slate-900 tracking-tight">Yihune Belay</h3>
              <p className="text-slate-600 text-base leading-relaxed max-w-xs mx-auto md:mx-0">
                Full Stack Software Developer specializing in backend systems and
                API architecture.
              </p>
            </div>
            <div className="text-center md:text-left">
              <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs mb-8">Quick Links</h4>
              <ul className="space-y-4 text-base">
                <li>
                  <button
                    onClick={() =>
                      document.getElementById("home")?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="text-slate-600 hover:text-primary transition-colors duration-300 font-bold"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="text-slate-600 hover:text-primary transition-colors duration-300 font-bold"
                  >
                    Projects
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="text-slate-600 hover:text-primary transition-colors duration-300 font-bold"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            <div className="text-center md:text-left">
              <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs mb-8">Connect</h4>
              <div className="flex flex-col gap-6 items-center md:items-start">
                <div className="flex gap-6">
                  <a
                    href="https://github.com/yihune1234"
                    target="_blank"
                    className="p-3 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-primary hover:shadow-lg transition-all duration-300"
                    title="GitHub"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com/in/yihune-belay"
                    target="_blank"
                    className="p-3 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-primary hover:shadow-lg transition-all duration-300"
                    title="LinkedIn"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554v-11h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 8.855c-1.144 0-2.083-.931-2.083-2.076 0-1.144.92-2.083 2.083-2.083 1.144 0 2.084.92 2.084 2.083 0 1.144-.94 2.076-2.084 2.076zm1.782 11.597H3.555v-11h3.564v11zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
                {/* Admin Portal Button */}
                <button
                  onClick={() => setShowAdminPortal(true)}
                  className="p-3 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-primary hover:shadow-lg transition-all duration-300 flex items-center gap-2 group"
                  title="Admin Portal"
                >
                  <Lock className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Admin</span>
                </button>
              </div>
            </div>
          </div>
 
          <div className="border-t border-slate-100 pt-10 text-center text-sm text-slate-400">
            <p className="font-medium">
              © 2024 Yihune Belay. All rights reserved. Designed & Built with
              care.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
