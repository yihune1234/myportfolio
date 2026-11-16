/**
 * Design Tokens
 * Centralized design system tokens for the Ariiti Tech portfolio.
 * Provides consistent colors, background layers, typography scales,
 * and dual-identity themes (Personal Lab vs. Organization Platform).
 */

export const DESIGN_TOKENS = {
  colors: {
    // Background and Surface System
    bg: {
      main: "#050816",             // Deep midnight navy
      secondary: "#0A1330",        // Subtly lighter blue-gray
      surface: "#0B1637",          // Controlled dark neutral card surface
      elevatedSurface: "#101B45",  // Elevated interactive surface
      overlay: "rgba(5, 8, 22, 0.8)",
    },

    // Typography Colors
    text: {
      primary: "#F5F7FA",          // High-contrast off-white
      secondary: "#B7C0D1",        // Readable muted gray
      muted: "rgba(183, 192, 209, 0.6)",
      accent: "#FF8A00",           // Brand highlight
    },

    // Borders & Dividers
    border: {
      subtle: "rgba(255, 255, 255, 0.06)",
      default: "rgba(255, 255, 255, 0.08)",
      hover: "rgba(255, 138, 0, 0.35)",
    },

    // Brand Accents
    brand: {
      primary: "#FF8A00",          // Vivid engineered amber-orange
      secondary: "#FF6B00",
      gradient: "from-[#FF8A00] to-[#FF6B00]",
      glow: "rgba(255, 138, 0, 0.25)",
    },

    // Dual Identity Themes
    identity: {
      personal: {
        label: "Personal Lab",
        handle: "@yihune1234",
        accent: "#10B981",         // Emerald
        accentMuted: "rgba(16, 185, 129, 0.15)",
        badgeBg: "rgba(16, 185, 129, 0.1)",
        badgeText: "#6EE7B7",
        badgeBorder: "rgba(16, 185, 129, 0.25)",
        scope: "PERSONAL",
      },
      organization: {
        label: "Ariiti Tech Platform",
        handle: "@AriitiMarket",
        accent: "#F59E0B",         // Amber
        accentMuted: "rgba(245, 158, 11, 0.15)",
        badgeBg: "rgba(245, 158, 11, 0.1)",
        badgeText: "#FCD34D",
        badgeBorder: "rgba(245, 158, 11, 0.25)",
        scope: "ORGANIZATION",
      },
    },

    // Telemetry & Status
    status: {
      live: "#10B981",             // Live pulsing green
      healthy: "#10B981",
      degraded: "#F59E0B",
      error: "#EF4444",
      cached: "rgba(183, 192, 209, 0.6)",
    },
  },

  typography: {
    fontFamily: {
      heading: "'Poppins', sans-serif",
      body: "'Inter', sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
    },
    classes: {
      display: "font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95]",
      sectionHeading: "text-3xl sm:text-4xl md:text-5xl font-black text-[#F5F7FA] tracking-tight",
      cardHeading: "text-lg sm:text-xl font-bold text-[#F5F7FA]",
      body: "text-sm sm:text-base text-[#B7C0D1] leading-relaxed",
      bodyMuted: "text-xs sm:text-sm text-[#B7C0D1]/80 leading-relaxed",
      metadata: "text-xs font-mono text-[#B7C0D1]",
      code: "font-mono text-xs text-[#F5F7FA]",
    },
  },

  transitions: {
    default: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    smooth: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
  },
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;
