import { useDiaryStore } from "@/store/diary.store";
import {
    Menu,
    Home,
    Search,
    Settings,
    Calendar,
    RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MenuBar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const menuItems = [
        {
            label: "Home",
            icon: <Home className="w-6 h-6" />,
            href: "/",
        },
        {
            label: "Search",
            icon: <Search className="w-6 h-6" />,
            href: "/search",
        },
        {
            label: "Settings",
            icon: <Settings className="w-6 h-6" />,
            href: "/settings",
        },
        {
            label: "Activity Calendar",
            icon: <Calendar className="w-6 h-6" />,
            href: "/activity",
        },
        {
            label: "Sync",
            icon: <RefreshCw className="w-6 h-6" />,
            action: () => useDiaryStore.getState().clearAll(),
        },
    ];

    return (
        <>
            {/* Menu Button */}
            {!isOpen && (
                <button
                    className={`${isOpen && "hidden"} z-100 cursor-pointer fixed bottom-6 right-4 p-4 rounded-full shadow-lg bg-surface-selected`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(!isOpen);
                    }}
                    title="Toggle menu icons visibility"
                >
                    <Menu className="w-6 h-6" />
                </button>
            )}
            {/* Menu bar and overlay */}
            {isOpen && (
                <div
                    className="fixed right-4 z-50 flex flex-col gap-8 items-center h-full w-full"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className={`${!isOpen && "hidden"} fixed right-4 bottom-6  flex flex-col gap-6 p-4 rounded-md bg-surface-default border border-border-subtle shadow-sm`}
                    >
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    if (item.href) navigate(item.href);
                                    if (item.action) item.action();
                                }}
                                title={item.label}
                                className="text-sm text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                            >
                                {item.icon}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
