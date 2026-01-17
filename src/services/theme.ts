export type Theme = "light" | "dark" | "sepia"

export const THEMES: Theme[] = ["light", "dark", "sepia"]

export function applyTheme(theme: Theme) {
    const root = document.documentElement

    // remove old themes
    THEMES.forEach(t => root.classList.remove(t))

    // apply new theme
    root.classList.add(theme)

    // persist
    localStorage.setItem("theme", theme)
}
