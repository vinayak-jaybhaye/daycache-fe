import { ArrowLeft } from "lucide-react";
import React from "react";

type EntriesSettingsProps = {
    setActiveTab: (tab: "account" | "entries" | "appearance" | "") => void;
};

const EntriesSettings: React.FC<EntriesSettingsProps> = ({ setActiveTab }) => {
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
                    <h1 className="text-xl font-serif font-bold" style={{ color: "var(--color-text-primary)" }}>
                        Entry Settings
                    </h1>
                    <p className="text-md" style={{ color: "var(--color-text-secondary)" }}>
                        Customize how your entries are saved and displayed
                    </p>
                </div>
            </div>

            {/* Preferences */}
            <div
                className="rounded-2xl border p-6"
                style={{
                    backgroundColor: "var(--color-surface-primary)",
                    borderColor: "var(--color-border-primary)",
                    boxShadow: "var(--shadow-xl)",
                }}
            >
                <h3 className="text-md font-semibold mb-6 flex items-center gap-3" style={{ color: "var(--color-text-primary)" }}>
                    Entry Preferences
                </h3>

                <div className="space-y-4">
                    {[
                        {
                            title: "Auto-save entries",
                            description: "Automatically save entries as you type",
                            color: "var(--color-primary)",
                        },
                        {
                            title: "Show timestamps",
                            description: "Display creation time for each entry",
                            color: "var(--color-info)",
                        },
                        {
                            title: "Enable suggestions",
                            description: "Show AI-powered writing suggestions",
                            color: "var(--color-accent)",
                        },
                    ].map((setting, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-4 rounded-xl border group hover:scale-[1.02] transition-all duration-200"
                            style={{
                                backgroundColor: "var(--color-surface-secondary)",
                                borderColor: "var(--color-border-primary)",
                            }}
                        >
                            <div className="flex items-center gap-4">
                                <div>
                                    <h4 className="font-semibold text-lg" style={{ color: "var(--color-text-primary)" }}>
                                        {setting.title}
                                    </h4>
                                    <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                                        {setting.description}
                                    </p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div
                                    className="relative w-12 h-6 rounded-full peer transition-all duration-200 
                                    peer-checked:after:translate-x-6 
                                    after:content-[''] after:absolute after:top-0.5 after:left-0.5 
                                    after:bg-white after:border-gray-300 after:border 
                                    after:rounded-full after:h-5 after:w-5 after:transition-all"
                                    style={{
                                        backgroundColor: "var(--color-border-secondary)",
                                    }}
                                    ref={(el) => {
                                        if (el) {
                                            const checkbox = el.previousElementSibling as HTMLInputElement;
                                            const updateColor = () => {
                                                el.style.backgroundColor = checkbox?.checked
                                                    ? setting.color
                                                    : "var(--color-border-secondary)";
                                            };
                                            checkbox?.addEventListener("change", updateColor);
                                            updateColor();
                                        }
                                    }}
                                />
                            </label>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EntriesSettings;
