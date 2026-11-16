/**
 * Design Tokens
 * Architectural Telemetry & Venture Hub Design System.
 * Centralized design tokens for the Yihune Belay & Ariiti Tech portfolio.
 */

export const DESIGN_TOKENS = {
  colors: {
    // Background and Surface System
    bg: {
      base: "#07090E",             // Deep Obsidian Base
      surface: "#0E131F",          // Card Surface
      elevatedSurface: "#161D2E",  // Elevated content surface
      secondary: "#0B0F19",        // Secondary dark section surface
      overlay: "rgba(7, 9, 14, 0.85)",
    },

    // Typography Colors
    text: {
      primary: "#F8FAFC",          // Main headings & high-contrast text
      secondary: "#94A3B8",        // Body descriptions & readable muted text
      muted: "#64748B",            // Metadata & subtle timestamps
      light: "#FFFFFF",
    },

    // Borders & Dividers
    border: {
      subtle: "rgba(255, 255, 255, 0.05)",
      default: "rgba(255, 255, 255, 0.08)",
      hover: "rgba(255, 255, 255, 0.15)",
      emerald: "rgba(16, 185, 129, 0.3)",
      amber: "rgba(245, 158, 11, 0.3)",
    },

    // Dual Identity Themes
    identity: {
      personal: {
        label: "Personal Lab",
        handle: "@yihune1234",
        accent: "#10B981",         // Personal Accent (Emerald)
        accentLight: "#34D399",    // Personal Accent Light
        badgeBg: "rgba(16, 185, 129, 0.1)",
        badgeText: "#34D399",
        badgeBorder: "rgba(16, 185, 129, 0.25)",
        scope: "PERSONAL",
      },
      organization: {
        label: "Ariiti Tech Platform",
        handle: "@AriitiMarket",
        accent: "#F59E0B",         // Organization Accent (Amber)
        accentLight: "#FBBF24",    // Organization Accent Light
        badgeBg: "rgba(245, 158, 11, 0.1)",
        badgeText: "#FBBF24",
        badgeBorder: "rgba(245, 158, 11, 0.25)",
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
      heroTitle: "font-heading font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.05] text-[#F8FAFC]",
      sectionTitle: "font-heading font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#F8FAFC]",
      cardTitle: "font-heading font-bold text-lg sm:text-xl text-[#F8FAFC]",
      body: "font-body text-sm sm:text-base text-[#94A3B8] leading-relaxed",
      bodySmall: "font-body text-xs sm:text-sm text-[#94A3B8] leading-relaxed",
      metadata: "font-mono text-xs text-[#64748B]",
      technical: "font-mono text-xs font-semibold text-[#F8FAFC]",
      tag: "font-mono text-[11px] font-medium tracking-wide",
    },
  },
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;
