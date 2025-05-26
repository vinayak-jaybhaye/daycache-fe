import type React from "react";
import {
  Calendar,
  Settings,
  BookOpen,
  NotebookPen,
  HelpCircle,
  Activity,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const RightSidebar: React.FC = () => {
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
    <div className="w-full h-full theme-sidebar p-4 flex flex-col">
      <div className="flex items-center justify-between p-2 theme-border border-b">
        <h2 className="text-xl font-semibold theme-text font-serif">
          DayCache
        </h2>
        <div
          className="cursor-pointer rounded-full p-2 hover:theme-sidebar-hover transition-all"
          onClick={() => navigate("/settings")}
        >
          <Settings className="h-5 w-5 theme-text-muted" />
        </div>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2 mt-4">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all font-medium ${
                item.path === location.pathname
                  ? "theme-button-primary theme-shadow"
                  : "hover:theme-sidebar-hover theme-text"
              }`}
              onClick={() => navigate(item.path)}
            >
              <span
                className={
                  item.path === location.pathname
                    ? "text-white"
                    : "theme-text-secondary"
                }
              >
                {item.icon}
              </span>
              <span
                className={
                  item.path === location.pathname ? "text-white" : "theme-text"
                }
              >
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-4 theme-border border-t">
        <div className="theme-card rounded-lg p-4 theme-shadow">
          <h3 className="font-medium theme-text mb-2">Pro Tip</h3>
          <p className="text-sm theme-text-muted">
            Use the "Ask Cache" feature to get insights about your journal
            entries and patterns.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
