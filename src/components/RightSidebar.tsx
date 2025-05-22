"use client";

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
    <div className="w-full h-full bg-card p-4 flex flex-col">
      <div className="flex items-center justify-between p-2 border-b border-border">
        <h2 className="text-xl font-serif font-semibold text-foreground">
          DayCache
        </h2>
        <div
          className="cursor-pointer rounded-full hover:bg-accent transition-all"
          onClick={() => navigate("/settings")}
        >
          <Settings className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2 mt-4">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${
                item.path === location.pathname
                  ? "bg-accent text-accent-foreground font-medium"
                  : "hover:bg-accent/50 text-foreground"
              }`}
              onClick={() => navigate(item.path)}
            >
              <span className="text-primary">{item.icon}</span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t border-border">
        <div className="bg-accent/50 rounded-lg p-4">
          <h3 className="font-medium text-foreground mb-2">Pro Tip</h3>
          <p className="text-sm text-muted-foreground">
            Use the "Ask Cache" feature to get insights about your journal
            entries and patterns.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
