/**
 * Portfolio Brand Colors & Theme Engine
 * 
 * Default Theme Requirements:
 * - Default background: #302E2D (warm dark charcoal)
 * - Primary theme/accent: #FFDD9B (warm golden cream)
 * - Primary text: #FFFFFF (white)
 * - Secondary text / light surfaces: #FFF1D8 (warm ivory)
 * - Secondary accent: #FFDD9B (golden cream)
 */

export interface ThemeConfig {
  preset: string;
  background: string;
  primary: string;
  primaryText: string;
  secondaryText: string;
  secondaryAccent: string;
  cardSurface: string;
  cardElevated: string;
  border: string;
}

export const DEFAULT_THEME: ThemeConfig = {
  preset: "warm-charcoal",
  background: "#302E2D",      // Warm Dark Charcoal (Default)
  primary: "#FFDD9B",         // Warm Golden Cream
  primaryText: "#FFFFFF",     // White
  secondaryText: "#FFF1D8",   // Warm Ivory
  secondaryAccent: "#FFDD9B", // Golden Cream
  cardSurface: "#403C38",     // Card Surface
  cardElevated: "#4A4642",    // Elevated Charcoal Surface
  border: "rgba(255, 221, 155, 0.18)",
};

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  theme: ThemeConfig;
  isDefault?: boolean;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "warm-charcoal",
    name: "Warm Charcoal & Golden Cream (Default)",
    description: "Official default brand palette. Warm dark charcoal with radiant golden cream and ivory typography.",
    isDefault: true,
    theme: { ...DEFAULT_THEME },
  },
  {
    id: "architectural-obsidian",
    name: "Architectural Obsidian & Emerald",
    description: "Deep obsidian black with vivid neon emerald personal lab and amber organization venture accents.",
    theme: {
      preset: "architectural-obsidian",
      background: "#07090E",
      primary: "#10B981",
      primaryText: "#F8FAFC",
      secondaryText: "#94A3B8",
      secondaryAccent: "#F59E0B",
      cardSurface: "#0E131F",
      cardElevated: "#161D2E",
      border: "rgba(255, 255, 255, 0.08)",
    },
  },
  {
    id: "midnight-slate",
    name: "Midnight Slate & Sky Cyan",
    description: "Cool slate navy base with electric sky cyan highlights and crisp text.",
    theme: {
      preset: "midnight-slate",
      background: "#0F172A",
      primary: "#38BDF8",
      primaryText: "#F8FAFC",
      secondaryText: "#94A3B8",
      secondaryAccent: "#818CF8",
      cardSurface: "#1E293B",
      cardElevated: "#334155",
      border: "rgba(56, 189, 248, 0.15)",
    },
  },
  {
    id: "pure-dark",
    name: "Pure Dark & Neon Mint",
    description: "Ultra-dark contrast background paired with luminous teal accents.",
    theme: {
      preset: "pure-dark",
      background: "#0B0C10",
      primary: "#66FCF1",
      primaryText: "#FFFFFF",
      secondaryText: "#C5C6C7",
      secondaryAccent: "#45A29E",
      cardSurface: "#1F2833",
      cardElevated: "#2D3748",
      border: "rgba(102, 252, 241, 0.18)",
    },
  },
];

/**
 * Converts a hex color (#RRGGBB) to HSL values "h s% l%"
 */
function hexToHsl(hex: string): string {
  let cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map((c) => c + c).join("");
  }
  if (cleanHex.length !== 6) {
    return "0 0% 0%";
  }

  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h = h / 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/**
 * Applies the given theme configuration to the document root element
 */
export function applyThemeToDom(theme: ThemeConfig): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const body = document.body;

  // Direct CSS custom properties
  root.style.setProperty("--bg-base", theme.background);
  root.style.setProperty("--card-surface", theme.cardSurface);
  root.style.setProperty("--card-elevated", theme.cardElevated);
  root.style.setProperty("--primary-accent", theme.primary);
  root.style.setProperty("--secondary-accent", theme.secondaryAccent);
  root.style.setProperty("--text-primary", theme.primaryText);
  root.style.setProperty("--text-secondary", theme.secondaryText);
  root.style.setProperty("--border-color", theme.border);

  // Tailwind HSL variable mappings for maximum compatibility
  root.style.setProperty("--background", hexToHsl(theme.background));
  root.style.setProperty("--foreground", hexToHsl(theme.primaryText));
  root.style.setProperty("--card", hexToHsl(theme.cardSurface));
  root.style.setProperty("--card-foreground", hexToHsl(theme.primaryText));
  root.style.setProperty("--popover", hexToHsl(theme.background));
  root.style.setProperty("--popover-foreground", hexToHsl(theme.primaryText));
  root.style.setProperty("--primary", hexToHsl(theme.primary));
  // High contrast button text: if primary is light (e.g. #FFDD9B), button text should be dark background
  root.style.setProperty("--primary-foreground", hexToHsl(theme.background));
  root.style.setProperty("--secondary", hexToHsl(theme.secondaryAccent));
  root.style.setProperty("--secondary-foreground", hexToHsl(theme.background));
  root.style.setProperty("--muted", hexToHsl(theme.cardElevated));
  root.style.setProperty("--muted-foreground", hexToHsl(theme.secondaryText));
  root.style.setProperty("--ring", hexToHsl(theme.primary));

  // Sync body background directly to prevent flashes
  if (body) {
    body.style.backgroundColor = theme.background;
    body.style.color = theme.primaryText;
  }

  // Persist locally for instant hydration
  try {
    localStorage.setItem("portfolio_active_theme", JSON.stringify(theme));
  } catch (e) {
    // ignore in private browsing modes
  }
}

/**
 * Retrieves the cached theme or defaults to Warm Charcoal
 */
export function getStoredTheme(): ThemeConfig {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const raw = localStorage.getItem("portfolio_active_theme");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.background && parsed.primary) {
        return {
          preset: parsed.preset || DEFAULT_THEME.preset,
          background: parsed.background || DEFAULT_THEME.background,
          primary: parsed.primary || DEFAULT_THEME.primary,
          primaryText: parsed.primaryText || DEFAULT_THEME.primaryText,
          secondaryText: parsed.secondaryText || DEFAULT_THEME.secondaryText,
          secondaryAccent: parsed.secondaryAccent || DEFAULT_THEME.secondaryAccent,
          cardSurface: parsed.cardSurface || DEFAULT_THEME.cardSurface,
          cardElevated: parsed.cardElevated || DEFAULT_THEME.cardElevated,
          border: parsed.border || DEFAULT_THEME.border,
        };
      }
    }
  } catch (e) {
    // fallback
  }
  return DEFAULT_THEME;
}
