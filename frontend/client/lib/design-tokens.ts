/**
 * Design Tokens
 * Architectural Telemetry & Venture Hub Design System.
 * Centralized design tokens for the Yihune Belay & Ariiti Tech portfolio.
 */

export const DESIGN_TOKENS = {
  colors: {
    // Background and Surface System
    bg: {
      base: "#302E2D",             // Warm Dark Charcoal (Default)
      surface: "#3A3836",          // Warm Dark Charcoal Card Surface
      elevatedSurface: "#444240",  // Elevated Charcoal Surface
      secondary: "#292726",        // Secondary dark charcoal section surface
      overlay: "rgba(48, 46, 45, 0.88)",
    },

    // Typography Colors
    text: {
      primary: "#FFFFFF",          // White Primary Text (Default)
      secondary: "#FFF1D8",        // Warm Ivory Secondary Text (Default)
      muted: "#E0D5C1",            // Metadata & subtle timestamps
      light: "#FFFFFF",
    },

    // Borders & Dividers
    border: {
      subtle: "rgba(255, 241, 216, 0.10)",
      default: "rgba(255, 221, 155, 0.18)",
      hover: "rgba(255, 221, 155, 0.35)",
      emerald: "rgba(255, 221, 155, 0.4)",
      amber: "rgba(255, 221, 155, 0.4)",
    },

    // Dual Identity Themes
    identity: {
      personal: {
        label: "Personal Lab",
        handle: "@yihune1234",
        accent: "#FFDD9B",         // Primary Theme Accent (Warm Golden Cream)
        accentLight: "#FFF1D8",    // Light Accent (Warm Ivory)
        badgeBg: "rgba(255, 221, 155, 0.12)",
        badgeText: "#FFDD9B",
        badgeBorder: "rgba(255, 221, 155, 0.25)",
        scope: "PERSONAL",
      },
      organization: {
        label: "Ariiti Tech Platform",
        handle: "@AriitiMarket",
        accent: "#FFDD9B",         // Secondary Accent (Golden Cream)
        accentLight: "#FFF1D8",
        badgeBg: "rgba(255, 221, 155, 0.12)",
        badgeText: "#FFDD9B",
        badgeBorder: "rgba(255, 221, 155, 0.25)",
        scope: "ORGANIZATION",
      },
    },

    // Status & Telemetry
    status: {
      live: "#10B981",             // Live pulsing green
      healthy: "#10B981",
      degraded: "#F59E0B",
      unavailable: "#EF4444",
      syncing: "#38BDF8",
      cached: "rgba(148, 163, 184, 0.7)",
    },
  },

  typography: {
    fontFamily: {
      heading: "'Poppins', sans-serif",
      body: "'Inter', sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
    },
    classes: {
      heroTitle: "font-heading font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.05] text-[var(--text-primary,#FFFFFF)]",
      sectionTitle: "font-heading font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[var(--text-primary,#FFFFFF)]",
      cardTitle: "font-heading font-bold text-lg sm:text-xl text-[var(--text-primary,#FFFFFF)]",
      body: "font-body text-sm sm:text-base text-[var(--text-secondary,#FFF1D8)] leading-relaxed",
      bodySmall: "font-body text-xs sm:text-sm text-[var(--text-secondary,#FFF1D8)] leading-relaxed",
      metadata: "font-mono text-xs text-[var(--text-secondary,#FFF1D8)]/70",
      technical: "font-mono text-xs font-semibold text-[var(--text-primary,#FFFFFF)]",
      tag: "font-mono text-[11px] font-medium tracking-wide",
    },
  },
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;
