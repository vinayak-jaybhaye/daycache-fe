import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  Ellipsis,
  Home,
  Plus,
  RefreshCw,
  Search,
  Settings,
  X,
} from "lucide-react";

import { useDiaryStore } from "@/store/diary.store";
import { getTodayYYYYMMDD } from "@/utils/calendar.utils";

type NavItem = {
  key: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
};

function getSection(pathname: string, todayPath: string) {
  if (pathname.startsWith("/search")) return "search";
  if (pathname.startsWith("/activity")) return "activity";
  if (pathname.startsWith("/settings")) return "settings";
  if (pathname === todayPath || pathname === `/open/${todayPath.slice(5)}`) {
    return "today";
  }
  return "home";
}

function NavButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`group flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-[11px] font-medium transition-all duration-200 cursor-pointer ${
        active
          ? "bg-accent-primary text-text-inverse shadow-sm"
          : "text-text-muted hover:bg-surface-selected hover:text-text-primary"
      }`}
    >
      <span className="transition-transform duration-200 group-hover:scale-105">
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
}

export default function AppNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const todayPath = `/day/${getTodayYYYYMMDD()}`;
  const section = getSection(location.pathname, todayPath);

  useEffect(() => {
    setIsMoreOpen(false);
  }, [location.pathname]);

  const primaryItems = useMemo<NavItem[]>(
    () => [
      {
        key: "home",
        label: "Home",
        icon: <Home className="h-5 w-5" />,
        onClick: () => navigate("/"),
      },
      {
        key: "today",
        label: "Today",
        icon: <Plus className="h-5 w-5" />,
        onClick: () => navigate(todayPath),
      },
      {
        key: "search",
        label: "Search",
        icon: <Search className="h-5 w-5" />,
        onClick: () => navigate("/search"),
      },
      {
        key: "activity",
        label: "Activity",
        icon: <Calendar className="h-5 w-5" />,
        onClick: () => navigate("/activity"),
      },
    ],
    [navigate, todayPath],
  );

  const secondaryItems = useMemo<NavItem[]>(
    () => [
      {
        key: "settings",
        label: "Settings",
        icon: <Settings className="h-5 w-5" />,
        onClick: () => navigate("/settings"),
      },
      {
        key: "sync",
        label: "Refresh",
        icon: <RefreshCw className="h-5 w-5" />,
        onClick: () => useDiaryStore.getState().clearAll(),
      },
    ],
    [navigate],
  );

  return (
    <>
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-24 lg:flex-col lg:justify-between lg:border-r lg:border-border-subtle lg:bg-bg-base/92 lg:px-3 lg:py-6 lg:backdrop-blur">
        <div className="space-y-6">
          <div className="space-y-2">
            {primaryItems.map((item) => (
              <NavButton
                key={item.key}
                label={item.label}
                icon={item.icon}
                active={section === item.key}
                onClick={item.onClick}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {secondaryItems.map((item) => (
            <NavButton
              key={item.key}
              label={item.label}
              icon={item.icon}
              active={section === item.key}
              onClick={item.onClick}
            />
          ))}
        </div>
      </aside>

      <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 lg:hidden pointer-events-none">
        <div className="pointer-events-auto relative w-full max-w-md">
          {isMoreOpen && (
            <div className="absolute bottom-full right-0 mb-3 flex min-w-44 flex-col gap-2 rounded-3xl border border-border-subtle bg-surface-default/95 p-3 shadow-lg backdrop-blur">
              {secondaryItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={item.onClick}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-colors cursor-pointer ${
                    section === item.key
                      ? "bg-accent-primary text-text-inverse"
                      : "text-text-primary hover:bg-surface-selected"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}

          <div className="flex items-stretch gap-1 rounded-[2rem] border border-border-subtle bg-surface-default/92 p-2 shadow-lg backdrop-blur">
            {primaryItems.map((item) => (
              <div key={item.key} className="flex-1">
                <NavButton
                  label={item.label}
                  icon={item.icon}
                  active={section === item.key}
                  onClick={item.onClick}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setIsMoreOpen((open) => !open)}
              title={isMoreOpen ? "Close menu" : "More actions"}
              aria-label={isMoreOpen ? "Close menu" : "More actions"}
              className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-[11px] font-medium transition-all duration-200 cursor-pointer ${
                isMoreOpen
                  ? "bg-surface-selected text-text-primary"
                  : "text-text-muted hover:bg-surface-selected hover:text-text-primary"
              }`}
            >
              {isMoreOpen ? <X className="h-5 w-5" /> : <Ellipsis className="h-5 w-5" />}
              <span>More</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
