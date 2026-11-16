import { useState, useEffect } from "react";
import { Menu, X, ArrowRight, Sparkles, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchGitHubHealth } from "@/lib/githubApi";

function ArchitecturalMonogram() {
  return (
    <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-[var(--card-surface,#3A3836)] border border-[var(--primary-accent,#FFDD9B)]/30 group-hover:border-[var(--primary-accent,#FFDD9B)]/60 transition-colors shadow-lg shadow-black/20">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 text-[var(--primary-accent,#FFDD9B)] group-hover:scale-105 transition-transform"
      >
        {/* Architectural node bracket frame */}
        <path
          d="M3 7V3H7M17 3H21V7M21 17V21H17M7 21H3V17"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-50"
        />
        {/* Geometric Y */}
        <path
          d="M6.5 7.5L9.5 12V16.5"
          stroke="var(--primary-accent, #FFDD9B)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.5 7.5L9.5 12"
          stroke="var(--primary-accent, #FFDD9B)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Geometric B */}
        <path
          d="M13 7.5H16.5C17.6 7.5 18.5 8.4 18.5 9.5C18.5 10.6 17.6 11.5 16.5 11.5H13V16.5H16.8C17.9 16.5 18.8 15.6 18.8 14.5C18.8 13.4 17.9 12.5 16.8 12.5"
          stroke="var(--secondary-accent, #FFDD9B)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const { data: health, isLoading: healthLoading, isError: healthError } = useQuery({
    queryKey: ['github', 'health'],
    queryFn: fetchGitHubHealth,
    staleTime: 60 * 1000,
    retry: 1,
  });

  const isConnected = !healthError && (health?.status === 'healthy' || health?.sources?.personal?.status === 'ok');
  const isSyncing = healthLoading;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = [
        "home",
        "about",
        "skills",
        "projects",
        "engineering",
        "platforms",
        "experience",
        "education",
        "contact",
      ];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", id: "home" },
    { name: "About", id: "about" },
    { name: "Skills", id: "skills" },
    { name: "Projects", id: "projects" },
    { name: "Engineering", id: "engineering" },
    { name: "Experience", id: "experience" },
    { name: "Education", id: "education" },
    { name: "Contact", id: "contact" },
  ];

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[var(--bg-base,#302E2D)]/90 backdrop-blur-2xl border-b border-[var(--border-color,rgba(255,221,155,0.18))] shadow-2xl shadow-black/40 py-2.5"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-6">
          {/* Brand Logo & Telemetry Indicator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0"
          >
            <button
              onClick={() => scrollToSection("home")}
              className="flex items-center gap-3 group text-left"
            >
              <ArchitecturalMonogram />

              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-black text-lg leading-tight text-[var(--text-primary,#FFFFFF)] tracking-tight">
                    Yihune Belay
                  </span>
                  {/* Live Status Indicator */}
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                      isSyncing
                        ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                        : isConnected
                        ? "bg-[var(--primary-accent,#FFDD9B)]/15 text-[var(--primary-accent,#FFDD9B)] border border-[var(--primary-accent,#FFDD9B)]/30"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                    title={isSyncing ? "GitHub Telemetry Syncing" : isConnected ? "GitHub Telemetry Connected" : "Telemetry Cached"}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSyncing
                          ? "bg-sky-400 animate-pulse"
                          : isConnected
                          ? "bg-[var(--primary-accent,#FFDD9B)] animate-ping"
                          : "bg-amber-400"
                      }`}
                    />
                    <span className="hidden sm:inline">
                      {isSyncing ? "SYNC" : isConnected ? "LIVE" : "CACHED"}
                    </span>
                  </span>
                </div>
                <span className="text-[10px] font-mono font-semibold tracking-wider text-[var(--text-secondary,#FFF1D8)] uppercase">
                  Full-Stack Systems Engineer
                </span>
              </div>
            </button>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-2 flex-1 justify-center">
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[var(--card-surface,#3A3836)] border border-[var(--border-color,rgba(255,221,155,0.18))] backdrop-blur-md shadow-inner">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-4 py-1.5 text-xs font-bold transition-all duration-300 rounded-full ${
                    activeSection === item.id
                      ? "text-[#302E2D] bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] shadow-lg shadow-[var(--primary-accent,#FFDD9B)]/25"
                      : "text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--text-primary,#FFFFFF)] hover:bg-white/[0.04]"
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Contact Action & Mobile Menu Toggle */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <button
              onClick={() => scrollToSection("contact")}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] hover:brightness-105 text-[#302E2D] rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-[var(--primary-accent,#FFDD9B)]/25 active:scale-95"
            >
              <span>Let's Talk</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-[var(--card-surface,#3A3836)] text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--text-primary,#FFFFFF)] hover:bg-white/[0.08] transition-all border border-[var(--border-color,rgba(255,221,155,0.18))]"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="lg:hidden fixed inset-x-0 top-[72px] mx-4 border border-[var(--border-color,rgba(255,221,155,0.18))] bg-[var(--bg-base,#302E2D)]/95 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl z-50"
          >
            <div className="p-5 space-y-1.5">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                    activeSection === item.id
                      ? "text-[#302E2D] bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] shadow-md shadow-[var(--primary-accent,#FFDD9B)]/20"
                      : "text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--text-primary,#FFFFFF)] hover:bg-white/[0.04]"
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-3">
                <button
                  onClick={() => scrollToSection("contact")}
                  className="w-full px-5 py-3 bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[var(--primary-accent,#FFDD9B)]/20"
                >
                  Let's Talk
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
