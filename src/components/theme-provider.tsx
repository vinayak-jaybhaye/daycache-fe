import type * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "light" | "neon-dark" | "sepia" | "high-contrast" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  availableThemes: Theme[];
};

const availableThemes: Theme[] = ["light", "dark", "neon-dark", "sepia", "high-contrast", "system"];

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
  availableThemes,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "daycache-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => {
      const stored = localStorage.getItem(storageKey) as Theme;
      return stored && availableThemes.includes(stored) ? stored : defaultTheme;
    }
  );

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all possible theme classes
    root.classList.remove("light", "dark", "neon-dark", "sepia", "high-contrast");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark", "neon-dark", "sepia", "high-contrast");

      const systemTheme = mediaQuery.matches ? "dark" : "light";
      root.classList.add(systemTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const value = {
    theme,
    availableThemes,
    setTheme: (newTheme: Theme) => {
      if (!availableThemes.includes(newTheme)) {
        console.warn(`Theme "${newTheme}" is not available. Available themes:`, availableThemes);
        return;
      }
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};

// Helper function to get theme display names
export const getThemeDisplayName = (theme: Theme): string => {
  const displayNames: Record<Theme, string> = {
    light: "Light",
    dark: "Dark",
    "neon-dark": "Neon Dark",
    sepia: "Sepia",
    "high-contrast": "High Contrast",
    system: "System",
  };

  return displayNames[theme] || theme;
};

// Helper function to get theme descriptions
export const getThemeDescription = (theme: Theme): string => {
  const descriptions: Record<Theme, string> = {
    light: "Clean and bright interface",
    dark: "Easy on the eyes in low light",
    "neon-dark": "Cyberpunk aesthetic with glowing effects",
    sepia: "Vintage, warm reading experience",
    "high-contrast": "Maximum accessibility and contrast",
    system: "Follows your system preference",
  };

  return descriptions[theme] || "";
};

// Helper function to check if a theme is dark-based
export const isDarkTheme = (theme: Theme): boolean => {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return ["dark", "neon-dark"].includes(theme);
};

// Helper function to get the actual applied theme (resolves system)
export const getResolvedTheme = (theme: Theme): Exclude<Theme, "system"> => {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
};