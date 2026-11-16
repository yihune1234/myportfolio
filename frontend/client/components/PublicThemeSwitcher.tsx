import { motion } from "framer-motion";
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

/**
 * Ultra-clean, icon-only Theme Switcher
 * Placed top right-most with zero unwanted text or writing.
 * Instant 1-click icon selection.
 */
export function PublicThemeSwitcher() {
  const { theme, previewTheme } = usePortfolioTheme();
  const activePresetId = theme?.preset || "warm-charcoal";

  return (
    <div
      className="flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-full bg-[var(--card-surface,#3A3836)]/90 border border-[var(--border-color,rgba(255,221,155,0.2))] backdrop-blur-xl shadow-lg shadow-black/20"
      title="Select Theme Palette"
    >
      <Palette className="w-3.5 h-3.5 text-[var(--primary-accent,#FFDD9B)] ml-1 mr-0.5 opacity-80 hidden sm:block" />

      {THEME_ICONS.map((item) => {
        const isSelected = activePresetId === item.id;
        return (
          <motion.button
            key={item.id}
            type="button"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => previewTheme(item.preset.theme)}
            className={`relative w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all duration-200 border ${
              isSelected
                ? "border-[var(--primary-accent,#FFDD9B)] ring-2 ring-[var(--primary-accent,#FFDD9B)]/40 shadow-md scale-105"
                : "border-white/20 hover:border-white/50 opacity-75 hover:opacity-100"
            }`}
            style={{ backgroundColor: item.bg }}
            title={item.title}
            aria-label={item.title}
          >
            {isSelected ? (
              <Check
                className="w-3 h-3 stroke-[3]"
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
