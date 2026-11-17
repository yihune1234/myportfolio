interface YBLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Custom YB Architectural Brand Monogram
 * Clean, bold, unmistakable "YB" identity with architectural corner marks
 */
export function YBLogo({ size = "md", className = "" }: YBLogoProps) {
  const containerSize =
    size === "sm" ? "w-8 h-8" : size === "lg" ? "w-12 h-12" : "w-10 h-10";
  const fontSize =
    size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm";

  return (
    <div
      className={`relative ${containerSize} flex-shrink-0 flex items-center justify-center rounded-xl bg-[var(--card-surface,#3A3836)] border border-[var(--primary-accent,#FFDD9B)]/40 group-hover:border-[var(--primary-accent,#FFDD9B)]/80 transition-all duration-300 shadow-lg shadow-black/30 group-hover:shadow-[var(--primary-accent,#FFDD9B)]/20 ${className}`}
    >
      {/* Micro-grid architectural corner marks */}
      <div className="absolute inset-1 rounded-lg border border-white/[0.04] pointer-events-none" />
      <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-[var(--primary-accent,#FFDD9B)]/50 pointer-events-none" />
      <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-[var(--primary-accent,#FFDD9B)]/50 pointer-events-none" />
      <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-[var(--primary-accent,#FFDD9B)]/50 pointer-events-none" />
      <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-[var(--primary-accent,#FFDD9B)]/50 pointer-events-none" />

      {/* Bold, crystal clear YB Monogram */}
      <span
        className={`font-heading font-black tracking-tight ${fontSize} leading-none text-transparent bg-clip-text bg-gradient-to-br from-[var(--primary-accent,#FFDD9B)] via-[#FFF1D8] to-[var(--primary-accent,#FFDD9B)] select-none group-hover:scale-105 transition-transform duration-200`}
      >
        YB
      </span>
    </div>
  );
}

export default YBLogo;
