import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check } from "lucide-react";
import { usePortfolioTheme } from "@/hooks/usePortfolioTheme";
import { THEME_PRESETS, ThemePreset } from "@/lib/theme";

interface ThemeIconItem {
  id: string;
  bg: string;
  accent: string;
  title: string;
  preset: ThemePreset;
}

const THEME_ICONS: ThemeIconItem[] = [
  {
    id: "warm-charcoal",
    bg: "#302E2D",
    accent: "#FFDD9B",
    title: "Warm Charcoal & Golden Cream",
    preset: THEME_PRESETS[0],
  },
  {
    id: "architectural-obsidian",
    bg: "#07090E",
    accent: "#10B981",
    title: "Obsidian & Emerald",
    preset: THEME_PRESETS[1],
  },
  {
    id: "midnight-slate",
    bg: "#0F172A",
    accent: "#38BDF8",
    title: "Midnight & Sky Cyan",
    preset: THEME_PRESETS[2],
  },
  {
    id: "pure-dark",
    bg: "#0B0C10",
    accent: "#66FCF1",
    title: "Pure Dark & Mint",
    preset: THEME_PRESETS[3],
  },
];

interface PublicThemeSwitcherProps {
  inline?: boolean;
}

/**
 * Mobile-First, Pure Icon Theme Switcher
 * - Click the palette icon to make theme selector icons visible
 * - Zero unwanted text or writing: pure visual icons
 * - Touch-optimized 40px targets for mobile devices
 * - Can also be rendered inline in the mobile drawer
 */
export function PublicThemeSwitcher({ inline = false }: PublicThemeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, previewTheme } = usePortfolioTheme();
  const activePresetId = theme?.preset || "warm-charcoal";

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (preset: ThemePreset) => {
    previewTheme(preset.theme);
    setIsOpen(false);
  };

  // If inline mode (e.g. inside mobile navigation drawer)
  if (inline) {
    return (
      <div className="flex items-center gap-2 py-1">
        {THEME_ICONS.map((item) => {
          const isSelected = activePresetId === item.id;
          return (
            <motion.button
              key={item.id}
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => previewTheme(item.preset.theme)}
              className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border ${
                isSelected
                  ? "border-[var(--primary-accent,#FFDD9B)] ring-2 ring-[var(--primary-accent,#FFDD9B)]/40 shadow-md scale-105"
                  : "border-white/20 opacity-75 hover:opacity-100"
              }`}
              style={{ backgroundColor: item.bg }}
              title={item.title}
              aria-label={item.title}
            >
              {isSelected ? (
                <Check
                  className="w-4 h-4 stroke-[3]"
                  style={{ color: item.accent }}
                />
              ) : (
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.accent }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      {/* Click Icon to Make Selection Visible */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all duration-200 border ${
          isOpen
            ? "bg-[var(--card-surface,#3A3836)] border-[var(--primary-accent,#FFDD9B)] text-[var(--primary-accent,#FFDD9B)] shadow-md shadow-[var(--primary-accent,#FFDD9B)]/20 scale-105"
            : "bg-[var(--card-surface,#3A3836)]/90 hover:bg-[var(--card-surface,#3A3836)] border-[var(--border-color,rgba(255,221,155,0.2))] text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--text-primary,#FFFFFF)]"
        }`}
        title="Select Theme"
        aria-label="Theme Palette Switcher"
      >
        <Palette className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[var(--primary-accent,#FFDD9B)]" />
        {/* Active Theme Color Dot Indicator */}
        <span
          className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-black/40 shadow-sm"
          style={{ backgroundColor: theme?.primary || "#FFDD9B" }}
        />
      </motion.button>

      {/* Floating Pure Icon Palette Capsule (Zero text, 100% icons, mobile touch-friendly) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.92 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 p-1.5 sm:p-2 rounded-2xl bg-[var(--card-surface,#3A3836)]/95 border border-[var(--border-color,rgba(255,221,155,0.25))] backdrop-blur-2xl shadow-2xl shadow-black/70 z-50 flex items-center gap-1.5 sm:gap-2"
          >
            {THEME_ICONS.map((item) => {
              const isSelected = activePresetId === item.id;
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSelect(item.preset)}
                  className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 border ${
                    isSelected
                      ? "border-[var(--primary-accent,#FFDD9B)] ring-2 ring-[var(--primary-accent,#FFDD9B)]/40 shadow-md scale-105"
                      : "border-white/20 hover:border-white/50 opacity-80 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: item.bg }}
                  title={item.title}
                  aria-label={item.title}
                >
                  {isSelected ? (
                    <Check
                      className="w-4 h-4 stroke-[3]"
                      style={{ color: item.accent }}
                    />
                  ) : (
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.accent }}
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
