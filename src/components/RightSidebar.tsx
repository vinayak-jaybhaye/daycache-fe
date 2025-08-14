import type React from "react";
import {
  Calendar,
  Settings,
  BookOpen,
  NotebookPen,
  HelpCircle,
  Activity,
  XIcon,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface RightSidebarProps {
  setShowRightSidebar: (show: boolean) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ setShowRightSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = [
    {
      icon: <NotebookPen className="h-5 w-5" />,
      label: "Diary",
      path: "/",
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Calendar View",
      path: "/calendar-view",
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      label: "Journal Archive",
      path: "#",
    },
    {
      icon: <Activity className="h-5 w-5" />,
      label: "Insights",
      path: "/profile",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      path: "/settings",
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      label: "Help & Support",
      path: "#",
    },
  ];

  return (
    <div
      className="h-[100vh] w-[100vw] absolute z-50"
      style={{ backgroundColor: 'var(--color-bg-overlay)' }}
      onClick={() => setShowRightSidebar(false)}
    >
      <div
        className="h-full w-72 p-4 flex flex-col absolute top-0 right-0 z-50"
        style={{
          backgroundColor: 'var(--color-surface-primary)',
          boxShadow: 'var(--shadow-xl)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-2 border-b"
          style={{ borderColor: 'var(--color-border-primary)' }}
        >
          <button
            onClick={() => setShowRightSidebar(false)}
            className="p-2 rounded-full cursor-pointer transition-all duration-200 hover:scale-105"
            style={{
              color: 'var(--color-text-secondary)',
              backgroundColor: 'var(--color-surface-secondary)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-surface-tertiary)';
              e.currentTarget.style.color = 'var(--color-text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-surface-secondary)';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            <XIcon className="h-4 w-4" />
          </button>
          <h2
            className="text-xl font-semibold font-serif"
            style={{ color: 'var(--color-text-primary)' }}
          >
            DayCache
          </h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-2 mt-4">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 font-medium"
                style={{
                  backgroundColor: item.path === location.pathname
                    ? 'var(--color-primary)'
                    : 'transparent',
                  color: item.path === location.pathname
                    ? 'var(--color-primary-foreground)'
                    : 'var(--color-text-primary)',
                  boxShadow: item.path === location.pathname
                    ? 'var(--shadow-md)'
                    : 'none'
                }}
                onClick={
                  () => {
                    setShowRightSidebar(false);
                    navigate(item.path);
                  }}
                onMouseEnter={(e) => {
                  if (item.path !== location.pathname) {
                    e.currentTarget.style.backgroundColor = 'var(--color-surface-secondary)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (item.path !== location.pathname) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <span
                  style={{
                    color: item.path === location.pathname
                      ? 'var(--color-primary-foreground)'
                      : 'var(--color-text-secondary)'
                  }}
                >
                  {item.icon}
                </span>
                <span
                  style={{
                    color: item.path === location.pathname
                      ? 'var(--color-primary-foreground)'
                      : 'var(--color-text-primary)'
                  }}
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </nav>

        {/* Pro Tip Section */}
        <div
          className="mt-auto pt-4 border-t"
          style={{ borderColor: 'var(--color-border-primary)' }}
        >
          <div
            className="rounded-lg p-4"
            style={{
              backgroundColor: 'var(--color-surface-secondary)',
              boxShadow: 'var(--shadow-base)',
              border: '1px solid var(--color-border-primary)'
            }}
          >
            <h3
              className="font-medium mb-2"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Pro Tip
            </h3>
            <p
              className="text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Use the "Ask Cache" feature to get insights about your journal
              entries and patterns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;