import { useState, useEffect } from "react";
import { Menu, X, ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchGitHubHealth } from "@/lib/githubApi";
import { PublicThemeSwitcher } from "./PublicThemeSwitcher";
import { YBLogo } from "./YBLogo";

interface NavSubItem {
  name: string;
  id: string;
  description: string;
}

interface NavItem {
  name: string;
  id: string;
  subItems?: NavSubItem[];
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(true);

  const { data: health, isLoading: healthLoading } = useQuery({
    queryKey: ["github", "health"],
    queryFn: fetchGitHubHealth,
    staleTime: 60 * 1000,
    retry: 1,
  });

  const isConnected = health?.status === "healthy" || health?.sources?.personal?.status === "ok";
  const isSyncing = healthLoading;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = [
        "home",
        "about",
        "skills",
        "my-projects",
        "ariitii-tech-projects",
        "repositories",
        "engineering",
        "experience",
        "education",
        "contact",
      ];

      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 140 && rect.bottom >= 140;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { name: "Home", id: "home" },
    { name: "Approach", id: "about" },
    { name: "Technologies", id: "skills" },
    {
      name: "Projects",
      id: "projects",
      subItems: [
        {
          name: "My Projects",
          id: "my-projects",
          description: "Personal software & lab tools",
        },
        {
          name: "Ariitii Tech",
          id: "ariitii-tech-projects",
          description: "Initiative & digital platforms",
        },
      ],
    },
    { name: "Repositories", id: "repositories" },
    { name: "Terminal", id: "engineering" },
    { name: "Experience", id: "experience" },
    { name: "Education", id: "education" },
    { name: "Contact", id: "contact" },
  ];

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    setDropdownOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 75;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const isProjectsActive =
    activeSection === "my-projects" ||
    activeSection === "ariitii-tech-projects" ||
    activeSection === "projects";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--bg-base,#302E2D)]/95 backdrop-blur-xl border-b border-[var(--border-color,rgba(255,221,155,0.18))] shadow-xl shadow-black/30 py-2.5"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Brand Logo & Name */}
          <div className="flex-shrink-0">
            <button
              onClick={() => scrollToSection("home")}
              className="flex items-center gap-3 group text-left"
            >
              <YBLogo />
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-black text-base sm:text-lg leading-tight text-white tracking-tight">
                    Yihune Belay
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                      isSyncing
                        ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                        : isConnected
                        ? "bg-[var(--primary-accent,#FFDD9B)]/15 text-[var(--primary-accent,#FFDD9B)] border border-[var(--primary-accent,#FFDD9B)]/30"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}
                    title={isSyncing ? "Syncing GitHub" : "Online"}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-accent,#FFDD9B)] animate-pulse" />
                    <span>ONLINE</span>
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]/80 uppercase">
                  Software Engineer
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--card-surface,#403C38)] border border-[var(--border-color,rgba(255,221,155,0.18))] shadow-inner">
            {navItems.map((item) => {
              if (item.subItems) {
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className={`relative px-3.5 py-1.5 text-xs font-bold transition-all duration-200 rounded-full flex items-center gap-1 ${
                        isProjectsActive
                          ? "text-[#302E2D] bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] shadow-md shadow-[var(--primary-accent,#FFDD9B)]/20"
                          : "text-[var(--text-secondary,#FFF1D8)] hover:text-white hover:bg-white/[0.05]"
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        size={12}
                        className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 p-1.5 rounded-2xl bg-[var(--card-surface,#403C38)] border border-[var(--border-color,rgba(255,221,155,0.18))] shadow-2xl z-50 space-y-1"
                        >
                          {item.subItems.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => scrollToSection(sub.id)}
                              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs transition-all flex flex-col ${
                                activeSection === sub.id
                                  ? "bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] font-bold"
                                  : "text-white hover:bg-white/[0.08]"
                              }`}
                            >
                              <span className="font-heading font-black text-xs">
                                {sub.name}
                              </span>
                              <span className={`text-[10px] mt-0.5 ${
                                activeSection === sub.id ? "text-[#302E2D]/80" : "text-[var(--text-secondary,#FFF1D8)]/70"
                              }`}>
                                {sub.description}
                              </span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-3.5 py-1.5 text-xs font-bold transition-all duration-200 rounded-full ${
                    activeSection === item.id
                      ? "text-[#302E2D] bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] shadow-md shadow-[var(--primary-accent,#FFDD9B)]/20"
                      : "text-[var(--text-secondary,#FFF1D8)] hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action & Theme Switcher */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => scrollToSection("contact")}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] hover:brightness-105 text-[#302E2D] rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[var(--primary-accent,#FFDD9B)]/20 active:scale-95"
            >
              <span>Contact</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl bg-[var(--card-surface,#403C38)] text-[var(--text-secondary,#FFF1D8)] hover:text-white transition-all border border-[var(--border-color,rgba(255,221,155,0.18))]"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <PublicThemeSwitcher />
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden fixed inset-x-0 top-[70px] mx-4 border border-[var(--border-color,rgba(255,221,155,0.18))] bg-[var(--card-surface,#403C38)]/98 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl z-50 max-h-[85vh] overflow-y-auto"
          >
            <div className="p-4 space-y-1">
              {navItems.map((item) => {
                if (item.subItems) {
                  return (
                    <div key={item.id} className="space-y-1 py-1">
                      <button
                        onClick={() => setMobileProjectsOpen(!mobileProjectsOpen)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-xl ${
                          isProjectsActive ? "text-[var(--primary-accent,#FFDD9B)]" : "text-[var(--text-secondary,#FFF1D8)]"
                        }`}
                      >
                        <span className="font-heading font-black">{item.name}</span>
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${mobileProjectsOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      {mobileProjectsOpen && (
                        <div className="pl-3 space-y-1 border-l border-[var(--primary-accent,#FFDD9B)]/20 ml-3">
                          {item.subItems.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => scrollToSection(sub.id)}
                              className={`block w-full text-left px-3 py-2 text-xs font-bold rounded-xl ${
                                activeSection === sub.id
                                  ? "text-[#302E2D] bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8]"
                                  : "text-[var(--text-secondary,#FFF1D8)]/80 hover:text-white"
                              }`}
                            >
                              {sub.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl ${
                      activeSection === item.id
                        ? "text-[#302E2D] bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8]"
                        : "text-[var(--text-secondary,#FFF1D8)] hover:text-white"
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}

              <div className="pt-2">
                <button
                  onClick={() => scrollToSection("contact")}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  Contact Me
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
