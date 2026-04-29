import { useState } from "react";
import { Menu, X, Code2 } from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

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
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background via-background to-transparent backdrop-blur-xl border-b border-border/50 shadow-lg">
      {/* Animated gradient line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 py-2">
          {/* Logo with Icon */}
          <div className="flex-shrink-0">
            <button
              onClick={() => scrollToSection("home")}
              className="flex items-center gap-3 group"
            >
              {/* Logo Badge */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-75"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center group-hover:shadow-2xl group-hover:shadow-primary/50 group-hover:scale-110 transition-all duration-300 border border-white/10">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Brand Text */}
              <div className="hidden sm:flex flex-col gap-0.5 group-hover:-translate-y-0.5 transition-transform">
                <span className="font-black text-xl leading-tight bg-gradient-to-r from-primary via-secondary to-primary bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-300 bg-clip-text text-transparent">
                  Yihune
                </span>
                <span className="text-xs font-bold tracking-widest text-primary/80 uppercase">
                  Full Stack Dev
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Menu with enhanced styling */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="relative px-4 py-2 text-sm font-semibold text-foreground/80 hover:text-primary transition-colors duration-200 group"
                style={{
                  transitionDelay: `${index * 50}ms`,
                }}
              >
                {/* Animated background */}
                <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></span>

                {/* Text */}
                <span className="relative z-10">{item.name}</span>

                {/* Bottom line animation */}
                <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
              </button>
            ))}
          </div>

          {/* Right Side - CTA Button */}
          <div className="flex items-center gap-4">
            {/* Desktop CTA */}
            <button
              onClick={() => scrollToSection("contact")}
              className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:shadow-xl hover:shadow-primary/40 hover:scale-105 transition-all duration-300 border border-white/10"
            >
              <span>Let's Talk</span>
              <span className="text-lg">→</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-foreground hover:bg-primary/10 transition-all duration-300 border border-primary/20"
            >
              {isOpen ? (
                <X className="h-6 w-6 text-primary" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Enhanced */}
        {isOpen && (
          <div className="md:hidden border-t border-border/50 bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-lg animate-slideInRight">
            <div className="px-2 pt-3 pb-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-4 py-3 text-base font-semibold text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200 border border-transparent hover:border-primary/30"
                >
                  {item.name}
                </button>
              ))}
              <button
                onClick={() => scrollToSection("contact")}
                className="w-full mt-3 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 border border-white/10"
              >
                Let's Talk
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
