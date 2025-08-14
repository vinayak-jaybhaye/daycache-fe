import { ArrowLeft,} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
type AppearanceSettingsProps = {
    setActiveTab: (tab: "entries" | "") => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ setActiveTab }: AppearanceSettingsProps) => {

    return (
        <div className="space-y-8">
            {/* Mobile header */}
            <div className="flex items-center mb-8 gap-3 md:hidden">
                <button
                    onClick={() => setActiveTab("")}
                    className="p-2 rounded-lg border transition-colors"
                    style={{
                        backgroundColor: "var(--color-surface-secondary)",
                        borderColor: "var(--color-border-primary)",
                        color: "var(--color-text-secondary)",
                    }}
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h2 className="text-xl font-serif font-semibold" style={{ color: "var(--color-text-primary)" }}>
                    Settings
                </h2>
            </div>

            {/* Page header */}
            <div className="flex items-center gap-4 mb-8">
                <div>
                    <h1 className="text-xl md:text-xl font-serif font-bold" style={{ color: "var(--color-text-primary)" }}>
                        Appearance
                    </h1>
                    <p className="text-md" style={{ color: "var(--color-text-secondary)" }}>
                        Customize the look and feel of your journal
                    </p>
                </div>
            </div>

            <div
                className="rounded-2xl border p-4"
                style={{
                    backgroundColor: "var(--color-surface-primary)",
                    borderColor: "var(--color-border-primary)",
                    boxShadow: "var(--shadow-xl)",
                }}
            >
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-3" style={{ color: "var(--color-text-primary)" }}>
                    Theme Preferences
                </h3>

                <div className="space-y-8">
                    {/* Theme Mode */}
                    <div
                        className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-xl border gap-4"
                        style={{
                            backgroundColor: "var(--color-surface-secondary)",
                            borderColor: "var(--color-border-primary)",
                        }}
                    >
                        <div className="flex items-center gap-4">

                            <div>
                                <h4 className="font-semibold text-lg" style={{ color: "var(--color-text-primary)" }}>
                                    Theme Mode
                                </h4>
                                <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                                    Switch between light and dark themes
                                </p>
                            </div>
                        </div>
                        <ThemeToggle />
                    </div>

                    {/* Font Size */}
                    <div
                        className="p-6 rounded-xl border"
                        style={{
                            backgroundColor: "var(--color-surface-secondary)",
                            borderColor: "var(--color-border-primary)",
                        }}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div>
                                <h4 className="font-semibold text-lg" style={{ color: "var(--color-text-primary)" }}>
                                    Font Size
                                </h4>
                                <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                                    Adjust text size for better readability
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {["Small", "Medium", "Large"].map((size, index) => (
                                <button
                                    key={size}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${index === 1 ? "transform scale-105" : ""
                                        }`}
                                    style={{
                                        backgroundColor: index === 1
                                            ? "var(--color-primary)"
                                            : "var(--color-surface-tertiary)",
                                        color: index === 1
                                            ? "var(--color-text-inverse)"
                                            : "var(--color-text-primary)",
                                        border: `2px solid ${index === 1 ? "var(--color-primary)" : "var(--color-border-primary)"}`,
                                    }}
                                    onMouseEnter={(e) => {
                                        if (index !== 1) {
                                            e.currentTarget.style.backgroundColor = "var(--color-primary-100)";
                                            e.currentTarget.style.borderColor = "var(--color-primary)";
                                            e.currentTarget.style.transform = "scale(1.05)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (index !== 1) {
                                            e.currentTarget.style.backgroundColor = "var(--color-surface-tertiary)";
                                            e.currentTarget.style.borderColor = "var(--color-border-primary)";
                                            e.currentTarget.style.transform = "scale(1)";
                                        }
                                    }}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Journal Style */}
                    <div
                        className="p-6 rounded-xl border"
                        style={{
                            backgroundColor: "var(--color-surface-secondary)",
                            borderColor: "var(--color-border-primary)",
                        }}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div>
                                <h4 className="font-semibold text-lg" style={{ color: "var(--color-text-primary)" }}>
                                    Journal Style
                                </h4>
                                <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                                    Choose your preferred visual style
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {["Classic", "Modern", "Vintage"].map((style, index) => (
                                <button
                                    key={style}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${index === 0 ? "transform scale-105" : ""
                                        }`}
                                    style={{
                                        backgroundColor: index === 0
                                            ? "var(--color-primary)"
                                            : "var(--color-surface-tertiary)",
                                        color: index === 0
                                            ? "var(--color-text-inverse)"
                                            : "var(--color-text-primary)",
                                        border: `2px solid ${index === 0 ? "var(--color-primary)" : "var(--color-border-primary)"}`,
                                    }}
                                    onMouseEnter={(e) => {
                                        if (index !== 0) {
                                            e.currentTarget.style.backgroundColor = "var(--color-primary-100)";
                                            e.currentTarget.style.borderColor = "var(--color-primary)";
                                            e.currentTarget.style.transform = "scale(1.05)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (index !== 0) {
                                            e.currentTarget.style.backgroundColor = "var(--color-surface-tertiary)";
                                            e.currentTarget.style.borderColor = "var(--color-border-primary)";
                                            e.currentTarget.style.transform = "scale(1)";
                                        }
                                    }}
                                >
                                    {style}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AppearanceSettings;