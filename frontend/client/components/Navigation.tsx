import { useState, useEffect } from "react";
import { Menu, X, Code2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
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
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-2xl py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-8">
          {/* Logo with Icon */}
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
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-75"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center group-hover:shadow-2xl group-hover:shadow-primary/50 group-hover:scale-110 transition-all duration-300 border border-white/10">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="hidden sm:flex flex-col gap-0.5 text-left">
                <span className="font-black text-lg leading-tight gradient-text">
                  Yihune
                </span>
                <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  Software Engineer
                </span>
              </div>
            </button>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => scrollToSection(item.id)}
                className="relative px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary transition-colors duration-300 group"
              >
                <span className="relative z-10">{item.name}</span>
                <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
              </motion.button>
            ))}
          </div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <button
              onClick={() => scrollToSection("contact")}
              className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-bold text-sm hover:shadow-[0_0_20px_rgba(var(--primary),0.4)] hover:scale-105 transition-all duration-300"
            >
              Contact Me
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl bg-muted/50 text-foreground hover:bg-primary/10 transition-all"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-4 py-4 text-lg font-bold text-foreground hover:text-primary hover:bg-primary/5 rounded-2xl transition-all"
                >
                  {item.name}
                </button>
              ))}
              <button
                onClick={() => scrollToSection("contact")}
                className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                Let's Talk
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
