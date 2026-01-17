import type { Theme } from "@/services/theme";

export default function bootstrapTheme() {
    const savedTheme = localStorage.getItem("theme") as Theme | null
    document.documentElement.classList.add(savedTheme || "light")
}