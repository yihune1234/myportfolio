import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check, Sparkles, RotateCcw } from "lucide-react";
import { usePortfolioTheme } from "@/hooks/usePortfolioTheme";
import { THEME_PRESETS, DEFAULT_THEME, ThemePreset } from "@/lib/theme";

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

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    previewTheme(DEFAULT_THEME);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-mono font-bold transition-all duration-300 border ${
          isOpen
            ? "bg-[var(--card-surface,#3A3836)] text-[var(--primary-accent,#FFDD9B)] border-[var(--primary-accent,#FFDD9B)]/50 shadow-lg shadow-[var(--primary-accent,#FFDD9B)]/20"
            : "bg-[var(--card-surface,#3A3836)]/80 text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--text-primary,#FFFFFF)] border-[var(--border-color,rgba(255,221,155,0.18))] hover:border-[var(--primary-accent,#FFDD9B)]/40 hover:bg-[var(--card-surface,#3A3836)]"
        }`}
        title="Change portfolio theme"
        aria-label="Theme Selector"
      >
        <Palette className="w-3.5 h-3.5 text-[var(--primary-accent,#FFDD9B)]" />
        <span className="hidden sm:inline text-[11px] font-sans font-medium">Theme</span>
        {/* Active Theme Color Swatch Pill */}
        <span
          className="w-2.5 h-2.5 rounded-full border border-white/20 shadow-sm"
          style={{ backgroundColor: theme?.primary || DEFAULT_THEME.primary }}
        />
      </motion.button>

      {/* Popover Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-72 sm:w-80 p-3 rounded-2xl bg-[var(--card-surface,#3A3836)] border border-[var(--border-color,rgba(255,221,155,0.25))] backdrop-blur-2xl shadow-2xl shadow-black/60 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/[0.08]">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--primary-accent,#FFDD9B)]" />
                <span className="text-xs font-bold text-[var(--text-primary,#FFFFFF)]">
                  Portfolio Color Theme
                </span>
              </div>
              {activePresetId !== "warm-charcoal" && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 text-[10px] font-mono text-[var(--primary-accent,#FFDD9B)] hover:underline"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  Reset
                </button>
              )}
            </div>

            {/* Presets List */}
            <div className="space-y-1.5">
              {THEME_PRESETS.map((preset) => {
                const isSelected = activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelect(preset)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all duration-200 text-left border ${
                      isSelected
                        ? "bg-[var(--bg-base,#302E2D)] border-[var(--primary-accent,#FFDD9B)]/40 shadow-sm"
                        : "bg-white/[0.02] hover:bg-white/[0.06] border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Color Preview Swatch */}
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/10 shadow-sm"
                        style={{ backgroundColor: preset.theme.background }}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: preset.theme.primary }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[var(--text-primary,#FFFFFF)] truncate">
                            {preset.name.split(" (")[0]}
                          </span>
                          {preset.isDefault && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[var(--primary-accent,#FFDD9B)]/20 text-[var(--primary-accent,#FFDD9B)]">
                              Official
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[var(--text-secondary,#FFF1D8)]/70 truncate">
                          {preset.id === "warm-charcoal"
                            ? "Warm Charcoal & Golden Cream"
                            : preset.id === "architectural-obsidian"
                            ? "Obsidian & Emerald Green"
                            : preset.id === "midnight-slate"
                            ? "Midnight Navy & Sky Cyan"
                            : "Pure Dark & Neon Mint"}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[var(--primary-accent,#FFDD9B)] flex items-center justify-center flex-shrink-0 ml-2">
                        <Check className="w-3 h-3 text-[#302E2D] stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick footnote */}
            <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]/60">
              <span>Instant preview</span>
              <span className="text-[var(--primary-accent,#FFDD9B)]">One-click switch</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
