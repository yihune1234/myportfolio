import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Palette,
  Check,
  RotateCcw,
  Save,
  Eye,
  Sparkles,
  Sliders,
  CheckCircle2,
  Shield,
  Layers,
} from "lucide-react";
import { usePortfolioTheme } from "../../hooks/usePortfolioTheme";
import { useToast } from "../../hooks/use-toast";
import { DEFAULT_THEME, THEME_PRESETS } from "../../lib/theme";

export function ThemeSelector() {
  const {
    theme,
    isSaving,
    presets,
    defaultTheme,
    previewTheme,
    saveTheme,
    resetToDefault,
  } = usePortfolioTheme();

  const { toast } = useToast();
  const [selectedPreset, setSelectedPreset] = useState(theme.preset || "warm-charcoal");
  const [customColors, setCustomColors] = useState({
    background: theme.background || DEFAULT_THEME.background,
    primary: theme.primary || DEFAULT_THEME.primary,
    primaryText: theme.primaryText || DEFAULT_THEME.primaryText,
    secondaryText: theme.secondaryText || DEFAULT_THEME.secondaryText,
    secondaryAccent: theme.secondaryAccent || DEFAULT_THEME.secondaryAccent,
    cardSurface: theme.cardSurface || DEFAULT_THEME.cardSurface,
    cardElevated: theme.cardElevated || DEFAULT_THEME.cardElevated,
    border: theme.border || DEFAULT_THEME.border,
  });

  const [activeTab, setActiveTab] = useState("presets"); // 'presets' | 'customize'

  useEffect(() => {
    if (theme) {
      setSelectedPreset(theme.preset || "warm-charcoal");
      setCustomColors({
        background: theme.background,
        primary: theme.primary,
        primaryText: theme.primaryText,
        secondaryText: theme.secondaryText,
        secondaryAccent: theme.secondaryAccent,
        cardSurface: theme.cardSurface,
        cardElevated: theme.cardElevated,
        border: theme.border,
      });
    }
  }, [theme]);

  // Handle Preset Selection
  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset.id);
    const newTheme = { ...preset.theme };
    setCustomColors({ ...newTheme });
    previewTheme(newTheme);
  };

  // Handle Custom Color Change
  const handleColorChange = (key, value) => {
    const updated = {
      ...customColors,
      [key]: value,
      preset: "custom",
    };
    setSelectedPreset("custom");
    setCustomColors(updated);
    previewTheme(updated);
  };

  // Persist Theme to Backend
  const handleSaveTheme = async () => {
    try {
      const themeToSave = {
        ...customColors,
        preset: selectedPreset,
      };
      await saveTheme(themeToSave);
      toast({
        title: "Theme Saved",
        description: "Portfolio theme successfully updated and saved to backend.",
      });
    } catch (err) {
      toast({
        title: "Save Failed",
        description: err.message || "Failed to save theme to backend.",
        variant: "destructive",
      });
    }
  };

  // Reset to Brand Default (#302E2D & #FFDD9B)
  const handleResetDefault = async () => {
    try {
      setSelectedPreset("warm-charcoal");
      setCustomColors({ ...DEFAULT_THEME });
      await resetToDefault();
      toast({
        title: "Default Theme Restored",
        description: "Portfolio reset to official Warm Charcoal & Golden Cream palette.",
      });
    } catch (err) {
      toast({
        title: "Reset Failed",
        description: err.message || "Could not reset theme.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="border border-white/[0.08] bg-[#0E131F] rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl shadow-black/40 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFDD9B] to-[#FFE8B8] flex items-center justify-center text-[#302E2D] shadow-lg shadow-[#FFDD9B]/20 flex-shrink-0">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Brand Colors & Theme Selector
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase">
                Active
              </span>
            </div>
            <p className="text-xs text-[#FFF1D8]/70 mt-0.5">
              Select or customize the public portfolio color scheme. Default: Warm Charcoal & Golden Cream.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleResetDefault}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-[#FFF1D8] transition-all"
            title="Reset to official brand default colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Default</span>
          </button>

          <button
            type="button"
            onClick={handleSaveTheme}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FFDD9B] to-[#FFE8B8] text-[#302E2D] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#FFDD9B]/20 hover:brightness-105 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : "Save Theme"}</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher: Presets vs Customizer */}
      <div className="flex gap-2 p-1 rounded-xl bg-[#07090E] border border-white/[0.06] w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("presets")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
            activeTab === "presets"
              ? "bg-[#3A3836] text-[#FFDD9B] shadow-md border border-[#FFDD9B]/20"
              : "text-[#FFF1D8]/60 hover:text-white"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Theme Presets
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("customize")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
            activeTab === "customize"
              ? "bg-[#3A3836] text-[#FFDD9B] shadow-md border border-[#FFDD9B]/20"
              : "text-[#FFF1D8]/60 hover:text-white"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          Custom Palette
        </button>
      </div>

      {/* Tab 1: Theme Presets */}
      {activeTab === "presets" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {THEME_PRESETS.map((preset) => {
              const isSelected = selectedPreset === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-[#FFDD9B] bg-[#3A3836]/60 shadow-lg shadow-[#FFDD9B]/10 ring-1 ring-[#FFDD9B]/40"
                      : "border-white/[0.08] bg-[#07090E]/60 hover:border-white/20 hover:bg-[#07090E]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">
                          {preset.name}
                        </h4>
                        {preset.isDefault && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-black bg-[#FFDD9B] text-[#302E2D] uppercase tracking-wider">
                            Default
                          </span>
                        )}
                      </div>

                      {isSelected && (
                        <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#FFDD9B]">
                          <Check className="w-3.5 h-3.5" />
                          Selected
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#FFF1D8]/70 leading-relaxed mb-4">
                      {preset.description}
                    </p>
                  </div>

                  {/* Swatch Preview Bar */}
                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-md border border-white/20 shadow-inner"
                        style={{ backgroundColor: preset.theme.background }}
                        title={`Background: ${preset.theme.background}`}
                      />
                      <div
                        className="w-6 h-6 rounded-md border border-white/20 shadow-inner"
                        style={{ backgroundColor: preset.theme.primary }}
                        title={`Primary: ${preset.theme.primary}`}
                      />
                      <div
                        className="w-6 h-6 rounded-md border border-white/20 shadow-inner"
                        style={{ backgroundColor: preset.theme.cardSurface }}
                        title={`Card: ${preset.theme.cardSurface}`}
                      />
                      <div
                        className="w-6 h-6 rounded-md border border-white/20 shadow-inner"
                        style={{ backgroundColor: preset.theme.secondaryText }}
                        title={`Secondary Text: ${preset.theme.secondaryText}`}
                      />
                    </div>

                    <span className="text-[10px] font-mono text-[#FFF1D8]/50 group-hover:text-[#FFDD9B] transition-colors">
                      Click to Preview →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Custom Palette Editor */}
      {activeTab === "customize" && (
        <div className="space-y-6">
          <p className="text-xs text-[#FFF1D8]/80 leading-relaxed">
            Customize individual theme colors. Changes preview in real-time throughout the entire portfolio.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Background */}
            <div className="p-4 rounded-xl bg-[#07090E] border border-white/[0.08] space-y-2">
              <label className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                Default Background
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={customColors.background}
                  onChange={(e) => handleColorChange("background", e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={customColors.background}
                  onChange={(e) => handleColorChange("background", e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-[#3A3836] border border-white/10 text-xs font-mono text-white"
                />
              </div>
              <span className="text-[10px] text-[#FFF1D8]/60 block font-mono">
                Standard: #302E2D (Warm Dark Charcoal)
              </span>
            </div>

            {/* Primary Accent */}
            <div className="p-4 rounded-xl bg-[#07090E] border border-white/[0.08] space-y-2">
              <label className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                Primary Theme Accent
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={customColors.primary}
                  onChange={(e) => handleColorChange("primary", e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={customColors.primary}
                  onChange={(e) => handleColorChange("primary", e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-[#3A3836] border border-white/10 text-xs font-mono text-white"
                />
              </div>
              <span className="text-[10px] text-[#FFF1D8]/60 block font-mono">
                Standard: #FFDD9B (Warm Golden Cream)
              </span>
            </div>

            {/* Primary Text */}
            <div className="p-4 rounded-xl bg-[#07090E] border border-white/[0.08] space-y-2">
              <label className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                Primary Text
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={customColors.primaryText}
                  onChange={(e) => handleColorChange("primaryText", e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={customColors.primaryText}
                  onChange={(e) => handleColorChange("primaryText", e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-[#3A3836] border border-white/10 text-xs font-mono text-white"
                />
              </div>
              <span className="text-[10px] text-[#FFF1D8]/60 block font-mono">
                Standard: #FFFFFF (White)
              </span>
            </div>

            {/* Secondary Text / Surfaces */}
            <div className="p-4 rounded-xl bg-[#07090E] border border-white/[0.08] space-y-2">
              <label className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                Secondary Text / Surfaces
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={customColors.secondaryText}
                  onChange={(e) => handleColorChange("secondaryText", e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={customColors.secondaryText}
                  onChange={(e) => handleColorChange("secondaryText", e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-[#3A3836] border border-white/10 text-xs font-mono text-white"
                />
              </div>
              <span className="text-[10px] text-[#FFF1D8]/60 block font-mono">
                Standard: #FFF1D8 (Warm Ivory)
              </span>
            </div>

            {/* Card Surface */}
            <div className="p-4 rounded-xl bg-[#07090E] border border-white/[0.08] space-y-2">
              <label className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                Card Surface
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={customColors.cardSurface}
                  onChange={(e) => handleColorChange("cardSurface", e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={customColors.cardSurface}
                  onChange={(e) => handleColorChange("cardSurface", e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-[#3A3836] border border-white/10 text-xs font-mono text-white"
                />
              </div>
              <span className="text-[10px] text-[#FFF1D8]/60 block font-mono">
                Standard: #3A3836 (Harmonious Charcoal)
              </span>
            </div>

            {/* Secondary Accent */}
            <div className="p-4 rounded-xl bg-[#07090E] border border-white/[0.08] space-y-2">
              <label className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                Secondary Accent
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={customColors.secondaryAccent}
                  onChange={(e) => handleColorChange("secondaryAccent", e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={customColors.secondaryAccent}
                  onChange={(e) => handleColorChange("secondaryAccent", e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-[#3A3836] border border-white/10 text-xs font-mono text-white"
                />
              </div>
              <span className="text-[10px] text-[#FFF1D8]/60 block font-mono">
                Standard: #FFDD9B (Golden Cream)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Card */}
      <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#07090E] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-[#FFDD9B]" />
            Active Theme Surface Preview
          </span>
          <span className="text-[10px] font-mono text-[#FFF1D8]/60">
            Preset: {selectedPreset}
          </span>
        </div>

        <div
          className="p-5 rounded-xl border transition-all flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            backgroundColor: customColors.background,
            borderColor: customColors.border,
          }}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: customColors.primary }}
              />
              <h5
                className="text-base font-bold"
                style={{ color: customColors.primaryText }}
              >
                Yihune Belay — Software Engineer
              </h5>
            </div>
            <p
              className="text-xs"
              style={{ color: customColors.secondaryText }}
            >
              Full-Stack & Distributed Systems Architecture · Haramaya University Alum
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all shadow-md"
              style={{
                backgroundColor: customColors.primary,
                color: customColors.background,
              }}
            >
              Primary Action
            </button>
            <div
              className="px-3 py-2 rounded-xl text-xs font-mono border"
              style={{
                backgroundColor: customColors.cardSurface,
                color: customColors.secondaryText,
                borderColor: customColors.border,
              }}
            >
              Surface Node
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
