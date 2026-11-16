import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check, Sparkles } from "lucide-react";
import { usePortfolioTheme } from "@/hooks/usePortfolioTheme";
import { THEME_PRESETS, ThemePreset } from "@/lib/theme";

interface ThemeIconItem {
  id: string;
  name: string;
  bg: string;
  accent: string;
  preset: ThemePreset;
}

const THEME_ICONS: ThemeIconItem[] = [
  {
    id: "warm-charcoal",
    name: "Charcoal",
    bg: "#302E2D",
    accent: "#FFDD9B",
    preset: THEME_PRESETS[0],
  },
  {
    id: "architectural-obsidian",
    name: "Emerald",
    bg: "#07090E",
    accent: "#10B981",
    preset: THEME_PRESETS[1],
  },
  {
    id: "midnight-slate",
    name: "Midnight",
    bg: "#0F172A",
    accent: "#38BDF8",
    preset: THEME_PRESETS[2],
  },
  {
    id: "pure-dark",
    name: "Mint",
    bg: "#0B0C10",
    accent: "#66FCF1",
    preset: THEME_PRESETS[3],
  },
];

export function PublicThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, previewTheme } = usePortfolioTheme();

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

  const activePresetId = theme?.preset || "warm-charcoal";

  const handleSelect = (preset: ThemePreset) => {
    previewTheme(preset.theme);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Icon-Only Trigger Button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center justify-center p-2.5 rounded-full transition-all duration-200 border ${
          isOpen
            ? "bg-[var(--card-surface,#3A3836)] border-[var(--primary-accent,#FFDD9B)]/60 text-[var(--primary-accent,#FFDD9B)] shadow-md shadow-[var(--primary-accent,#FFDD9B)]/20"
            : "bg-[var(--card-surface,#3A3836)]/80 hover:bg-[var(--card-surface,#3A3836)] border-[var(--border-color,rgba(255,221,155,0.18))] text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--text-primary,#FFFFFF)]"
        }`}
        title="Switch Theme"
        aria-label="Switch Theme Palette"
      >
        <Palette className="w-4 h-4 text-[var(--primary-accent,#FFDD9B)]" />
        {/* Active Theme Color Dot Indicator */}
        <span
          className="absolute top-1 right-1 w-2 h-2 rounded-full ring-1 ring-black/40 shadow-sm"
          style={{ backgroundColor: theme?.primary || "#FFDD9B" }}
        />
      </motion.button>

      {/* Clean Icon-Based Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 p-2.5 rounded-2xl bg-[var(--card-surface,#3A3836)] border border-[var(--border-color,rgba(255,221,155,0.25))] backdrop-blur-2xl shadow-2xl shadow-black/60 z-50 min-w-[200px]"
          >
            {/* Header: minimal with sparkles icon */}
            <div className="flex items-center gap-1.5 px-1 pb-2 mb-2 border-b border-white/[0.08]">
              <Sparkles className="w-3 h-3 text-[var(--primary-accent,#FFDD9B)]" />
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[var(--text-secondary,#FFF1D8)]">
                Palette
              </span>
            </div>

            {/* 4 Icon Swatches Grid */}
            <div className="grid grid-cols-4 gap-1.5">
              {THEME_ICONS.map((item) => {
                const isSelected = activePresetId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.preset)}
                    className={`group flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200 border ${
                      isSelected
                        ? "bg-[var(--bg-base,#302E2D)] border-[var(--primary-accent,#FFDD9B)]/50 shadow-sm"
                        : "bg-white/[0.02] hover:bg-white/[0.08] border-transparent hover:border-white/10"
                    }`}
                    title={item.name}
                  >
                    {/* Dual-color Swatch Icon */}
                    <div
                      className={`relative w-8 h-8 rounded-full flex items-center justify-center border transition-transform duration-200 group-hover:scale-105 shadow-sm ${
                        isSelected
                          ? "border-[var(--primary-accent,#FFDD9B)] ring-2 ring-[var(--primary-accent,#FFDD9B)]/30"
                          : "border-white/20"
                      }`}
                      style={{ backgroundColor: item.bg }}
                    >
                      {/* Inner accent dot or checkmark */}
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
                    </div>

                    {/* Short 1-word label */}
                    <span
                      className={`text-[10px] font-mono font-semibold transition-colors ${
                        isSelected
                          ? "text-[var(--primary-accent,#FFDD9B)] font-bold"
                          : "text-[var(--text-secondary,#FFF1D8)]/70 group-hover:text-[var(--text-primary,#FFFFFF)]"
                      }`}
                    >
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
