import { THEMES, applyTheme, type Theme } from "@/services/theme";
import { useEffect, useState } from "react";

export default function Appearance() {
    const [currentTheme, setCurrentTheme] = useState<Theme>("light");

    useEffect(() => {
        const saved = localStorage.getItem("theme") as Theme;
        if (saved && THEMES.includes(saved)) {
            setCurrentTheme(saved);
        }
    }, []);

    const handleThemeChange = (theme: Theme) => {
        applyTheme(theme);
        setCurrentTheme(theme);
    };

    return (
        <div className="bg-surface-raised border border-border-subtle rounded-2xl p-4 shadow-sm">
            <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Theme Preference</label>
                <div className="grid grid-cols-3 gap-3 mt-4">
                    {THEMES.map((theme) => (
                        <button
                            key={theme}
                            onClick={() => handleThemeChange(theme)}
                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 capitalize
                                ${currentTheme === theme
                                    ? "bg-accent-soft text-accent-strong ring-2 ring-accent-primary ring-offset-2 ring-offset-surface-raised"
                                    : "bg-bg-subtle text-text-secondary hover:bg-surface-selected hover:text-text-primary"
                                }`}
                        >
                            {theme}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}