import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ThemeConfig,
  DEFAULT_THEME,
  THEME_PRESETS,
  applyThemeToDom,
  getStoredTheme,
} from "@/lib/theme";
import { API_ENDPOINTS } from "@/lib/api";

async function fetchActiveTheme(): Promise<ThemeConfig> {
  try {
    const res = await fetch(API_ENDPOINTS.THEME);
    const contentType = res.headers.get("content-type") || "";
    if (!res.ok || !contentType.includes("application/json")) {
      return getStoredTheme();
    }
    const data = await res.json();
    if (data?.success && data?.theme?.background) {
      return data.theme;
    }
    return DEFAULT_THEME;
  } catch {
    return getStoredTheme();
  }
}

async function persistTheme(theme: ThemeConfig, token: string): Promise<ThemeConfig> {
  const res = await fetch(API_ENDPOINTS.ADMIN_THEME, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(theme),
  });

  const contentType = res.headers.get("content-type") || "";
  let data: any = null;

  if (contentType.includes("application/json")) {
    data = await res.json().catch(() => ({}));
  }

  if (!res.ok) {
    const errorMsg = data?.message || `Server returned error (${res.status}): ${res.statusText || 'Unable to update theme'}`;
    throw new Error(errorMsg);
  }

  return data?.theme || theme;
}

export function usePortfolioTheme() {
  const queryClient = useQueryClient();
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(() => {
    const initial = getStoredTheme();
    applyThemeToDom(initial);
    return initial;
  });

  const { data: serverTheme, isLoading } = useQuery<ThemeConfig>({
    queryKey: ["portfolio-theme"],
    queryFn: fetchActiveTheme,
    staleTime: 60 * 1000,
  });

  // Sync server theme when loaded
  useEffect(() => {
    if (serverTheme) {
      setCurrentTheme(serverTheme);
      applyThemeToDom(serverTheme);
    }
  }, [serverTheme]);

  // Live preview without saving
  const previewTheme = useCallback((theme: ThemeConfig) => {
    setCurrentTheme(theme);
    applyThemeToDom(theme);
  }, []);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: ({ theme, token }: { theme: ThemeConfig; token: string }) =>
      persistTheme(theme, token),
    onSuccess: (savedTheme) => {
      setCurrentTheme(savedTheme);
      applyThemeToDom(savedTheme);
      queryClient.setQueryData(["portfolio-theme"], savedTheme);
      queryClient.invalidateQueries({ queryKey: ["portfolio-theme"] });
    },
  });

  const saveTheme = useCallback(
    async (theme: ThemeConfig) => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("Admin authentication required to save theme");
      }
      return saveMutation.mutateAsync({ theme, token });
    },
    [saveMutation],
  );

  const resetToDefault = useCallback(async () => {
    previewTheme(DEFAULT_THEME);
    const token = localStorage.getItem("adminToken");
    if (token) {
      await saveMutation.mutateAsync({ theme: DEFAULT_THEME, token });
    }
  }, [previewTheme, saveMutation]);

  return {
    theme: currentTheme,
    serverTheme,
    isLoading,
    isSaving: saveMutation.isPending,
    saveError: saveMutation.error,
    presets: THEME_PRESETS,
    defaultTheme: DEFAULT_THEME,
    previewTheme,
    saveTheme,
    resetToDefault,
  };
}
