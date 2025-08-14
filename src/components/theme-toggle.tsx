import {
  Moon,
  Sun,
  Monitor,
  Zap,
  BookOpen,
  Eye,
  ChevronDown,
  Check
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTheme, getThemeDisplayName, getThemeDescription, type Theme } from "./theme-provider";

// Theme icon mapping
const getThemeIcon = (theme: Theme) => {
  const iconProps = { className: "h-4 w-4" };

  switch (theme) {
    case "light":
      return <Sun {...iconProps} />;
    case "dark":
      return <Moon {...iconProps} />;
    case "neon-dark":
      return <Zap {...iconProps} />;
    case "sepia":
      return <BookOpen {...iconProps} />;
    case "high-contrast":
      return <Eye {...iconProps} />;
    case "system":
      return <Monitor {...iconProps} />;
    default:
      return <Sun {...iconProps} />;
  }
};

export function ThemeToggle() {
  const { theme, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleThemeSelect = (selectedTheme: Theme) => {
    setTheme(selectedTheme);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md p-2 transition-colors hover:opacity-80"
        style={{
          backgroundColor: 'var(--color-surface-secondary)',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-border-primary)',
          transition: 'all 0.3s ease',
        }}
        aria-label="Select theme"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {getThemeIcon(theme)}
        <span className="hidden sm:inline text-sm font-medium">
          {getThemeDisplayName(theme)}
        </span>
        <ChevronDown
          className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: 'var(--color-text-secondary)' }}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-1 min-w-48 rounded-md border shadow-lg z-50"
          style={{
            backgroundColor: 'var(--color-surface-primary)',
            borderColor: 'var(--color-border-primary)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div className="py-1">
            {availableThemes.map((themeOption) => (
              <button
                key={themeOption}
                onClick={() => handleThemeSelect(themeOption)}
                className="flex items-center justify-between w-full px-3 py-2 text-left transition-colors hover:opacity-90"
                style={{
                  backgroundColor: theme === themeOption
                    ? 'var(--color-surface-secondary)'
                    : 'transparent',
                  color: 'var(--color-text-primary)',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (theme !== themeOption) {
                    e.currentTarget.style.backgroundColor = 'var(--color-surface-tertiary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (theme !== themeOption) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  {getThemeIcon(themeOption)}
                  <div>
                    <div className="text-sm font-medium">
                      {getThemeDisplayName(themeOption)}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {getThemeDescription(themeOption)}
                    </div>
                  </div>
                </div>
                {theme === themeOption && (
                  <Check
                    className="h-4 w-4"
                    style={{ color: 'var(--color-primary)' }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Alternative: Simple cycle toggle (for compact spaces)
export function SimpleThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const cycleOrder: Theme[] = ["light", "dark", "neon-dark", "sepia", "high-contrast"];
    const currentIndex = cycleOrder.indexOf(theme === "system" ? "light" : theme);
    const nextIndex = (currentIndex + 1) % cycleOrder.length;
    setTheme(cycleOrder[nextIndex]);
  };

  return (
    <button
      onClick={cycleTheme}
      className="rounded-md p-2 transition-colors hover:opacity-80"
      style={{
        backgroundColor: 'var(--color-surface-secondary)',
        color: 'var(--color-text-primary)',
        transition: 'all 0.3s ease',
      }}
      aria-label={`Current theme: ${getThemeDisplayName(theme)}. Click to cycle themes.`}
      title={`Current: ${getThemeDisplayName(theme)} - ${getThemeDescription(theme)}`}
    >
      {getThemeIcon(theme)}
    </button>
  );
}