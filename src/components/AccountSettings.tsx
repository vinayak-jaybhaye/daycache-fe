import { ArrowLeft, LogOut } from "lucide-react";
import { type User as UserType } from '../types';
type AccountSettingsProps = {
    setActiveTab: (tab: "account" | "entries" | "") => void;
    userData: UserType | null;
    handleLogout: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ setActiveTab, userData, handleLogout }: AccountSettingsProps) => {
    return (<>
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
                    Account Settings
                </h1>
                <p className="text-md" style={{ color: "var(--color-text-secondary)" }}>
                    Manage your account information and security
                </p>
            </div>
        </div>

        {/* Profile card */}
        <div
            className="rounded-2xl border overflow-hidden backdrop-blur-sm"
            style={{
                backgroundColor: "var(--color-surface-primary)",
                borderColor: "var(--color-border-primary)",
                boxShadow: "var(--shadow-xl)",
            }}
        >
            <div className="p-6 relative">
                <div className="flex flex-col md:flex-row gap-6 justify-between items-start mb-8">
                    <div className="flex items-end gap-6">
                        <div
                            className="border-4 rounded-full relative"
                            style={{
                                borderColor: "var(--color-surface-primary)",
                                boxShadow: "var(--shadow-lg)",
                            }}
                        >
                            {userData?.profile_image ? (
                                <img
                                    src={userData?.profile_image || "/placeholder.svg"}
                                    alt="User Avatar"
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                            ) : (
                                <div
                                    className="w-24 h-24 rounded-full flex items-center justify-center"
                                    style={{
                                        backgroundColor: "var(--color-primary-100)",
                                        color: "var(--color-primary)",
                                    }}
                                >
                                    <span className="text-3xl font-bold">
                                        {userData?.username?.charAt(0).toUpperCase() || "U"}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="pb-2">
                            <h2 className="text-2xl md:text-3xl font-serif font-bold" style={{ color: "var(--color-text-primary)" }}>
                                {userData?.username || userData?.email?.split("@")[0]}
                            </h2>
                            <p className="text-lg mt-1" style={{ color: "var(--color-text-secondary)" }}>
                                {userData?.email}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleLogout}
                            className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-3 group"
                            style={{
                                backgroundColor: "var(--color-error)",
                                color: "white",
                                boxShadow: "var(--shadow-md)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "var(--color-error-700)";
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "var(--color-error)";
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "var(--shadow-md)";
                            }}
                        >
                            <LogOut className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Stats grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div
                        className="p-6 rounded-xl border flex items-center gap-4 group transition-all duration-200 hover:scale-105"
                        style={{
                            backgroundColor: "var(--color-primary-50)",
                            borderColor: "var(--color-primary-200)",
                        }}
                    >
                        <div>
                            <p className="text-sm font-medium" style={{ color: "var(--color-primary-600)" }}>
                                Member Since
                            </p>
                            <p className="text-xl font-bold" style={{ color: "var(--color-primary-700)" }}>
                                {userData?.created_at
                                    ? new Date(userData.created_at).toLocaleDateString(
                                        "en-US",
                                        {
                                            year: "numeric",
                                            month: "long",
                                        }
                                    )
                                    : "N/A"}
                            </p>
                        </div>
                    </div>

                    <div
                        className="p-6 rounded-xl border flex items-center gap-4 group transition-all duration-200 hover:scale-105"
                        style={{
                            backgroundColor: "var(--color-success-50)",
                            borderColor: "var(--color-success-200)",
                        }}
                    >
                        <div>
                            <p className="text-sm font-medium" style={{ color: "var(--color-success-600)" }}>
                                Last Active
                            </p>
                            <p className="text-xl font-bold" style={{ color: "var(--color-success-700)" }}>
                                Today
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}

export default AccountSettings;