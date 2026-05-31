import { useState, useEffect } from "react";
import { Menu, X, Code2, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ["home", "about", "skills", "projects", "platforms", "experience", "education", "contact"];
      const current = sections.find(section => {
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
          ? "bg-[#050816]/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-2xl shadow-black/30 py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0"
          >
            <button
              onClick={() => scrollToSection("home")}
              className="flex items-center gap-3 group"
            >
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-orange-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-75"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 border border-white/20 shadow-lg shadow-orange-500/20">
                  <Code2 className="w-5 h-5 text-[#050816]" />
                </div>
              </div>

              <div className="flex flex-col gap-0.5 text-left">
                <span className="font-black text-lg leading-tight text-[#F5F7FA] tracking-tight">
                  Yihune
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#D5D9E3] uppercase opacity-80">
                  Software Engineer
                </span>
              </div>
            </button>
          </motion.div>

          <div className="hidden lg:flex items-center gap-2 flex-1 justify-center">
            <div className="flex items-center gap-1 px-2 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-4 py-2 text-sm font-bold transition-all duration-300 group rounded-full ${
                    activeSection === item.id
                      ? "text-[#050816] bg-gradient-to-r from-orange-400 to-amber-400 shadow-lg shadow-orange-500/25"
                      : "text-[#D5D9E3] hover:text-[#F5F7FA] hover:bg-white/[0.05]"
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <button
              onClick={() => scrollToSection("contact")}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-[#050816] rounded-full font-bold text-sm hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
            >
              Let's Talk
              <Sparkles className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-3 rounded-xl bg-white/[0.05] text-[#D5D9E3] hover:text-[#F5F7FA] hover:bg-white/[0.1] transition-all border border-white/[0.08]"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="lg:hidden fixed inset-x-0 top-[72px] mx-4 border border-white/[0.08] bg-[#050816]/95 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl z-50"
          >
            <div className="p-6 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-5 py-4 text-lg font-bold rounded-2xl transition-all ${
                    activeSection === item.id
                      ? "text-[#050816] bg-gradient-to-r from-orange-400 to-amber-400 shadow-lg shadow-orange-500/20"
                      : "text-[#D5D9E3] hover:text-[#F5F7FA] hover:bg-white/[0.05]"
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-4">
                <button
                  onClick={() => scrollToSection("contact")}
                  className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-[#050816] rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                >
                  Let's Talk
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
