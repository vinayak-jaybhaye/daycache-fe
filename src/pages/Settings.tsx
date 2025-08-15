import type React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser, clearUser } from "../store/userSlice";
import type { RootState } from "../store/store";

import EntriesSettings from "../components/EntriesSettings";
import AccountSettings from "../components/AccountSettings";
import AppearanceSettings from "../components/AppearanceSettings";
import {
  ArrowLeft,
  Palette,
  FileText,
  User,
} from "lucide-react";

import type { User as UserType } from '../types'

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "account" | "entries" | "appearance" | ""
  >("account");

  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserType | null>(null);

  useEffect(() => {
    if (user) {
      setUserData(user);
    } else {
      const fetchUser = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/users/me`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (!response.ok) throw new Error("User not authenticated");

          const data: UserType = await response.json();
          setUserData(data);
          dispatch(setUser(data));
        } catch (error) {
          console.error("Failed to fetch user:", error);
          navigate("/login");
        }
      };

      fetchUser();
    }
  }, [user, dispatch, navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to logout");
      dispatch(clearUser());
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const tabs = [
    { id: "account", label: "Account", icon: <User className="h-4 w-4" />, color: "var(--color-primary)" },
    { id: "entries", label: "Entries", icon: <FileText className="h-4 w-4" />, color: "var(--color-success)" },
    { id: "appearance", label: "Appearance", icon: <Palette className="h-4 w-4" />, color: "var(--color-accent)" },
  ];

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      {/* Enhanced Sidebar */}
      <div
        className={`w-full lg:w-102 md:w-auto border-r backdrop-blur-sm transition-all duration-300 ${activeTab == "" ? "block" : "hidden"
          } md:block relative overflow-hidden`}
        style={{
          backgroundColor: "var(--color-surface-primary)",
          borderColor: "var(--color-border-primary)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Background gradient */}
        <div
          className="absolute top-0 left-0 w-full h-32 opacity-10"
          style={{
            background: `linear-gradient(135deg, var(--color-primary), var(--color-accent))`,
          }}
        />

        <div className="p-6 relative z-10">
          <div className="flex items-center mb-8 gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-3 rounded-xl transition-all duration-200 group border"
              style={{
                backgroundColor: "var(--color-surface-secondary)",
                borderColor: "var(--color-border-primary)",
                color: "var(--color-text-secondary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-primary-100)";
                e.currentTarget.style.borderColor = "var(--color-primary)";
                e.currentTarget.style.color = "var(--color-primary)";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-surface-secondary)";
                e.currentTarget.style.borderColor = "var(--color-border-primary)";
                e.currentTarget.style.color = "var(--color-text-secondary)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            </button>
            <div className="md:hidden lg:block">
              <h2 className="text-2xl font-serif font-bold" style={{ color: "var(--color-text-primary)" }}>
                Settings
              </h2>
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                Customize your experience
              </p>
            </div>
          </div>

          <nav>
            <ul className="space-y-3">
              {tabs.map((tab, _) => {
                const isActive = activeTab === tab.id;
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 font-medium relative overflow-hidden group ${isActive ? "transform scale-105" : ""
                        }`}
                      style={{
                        backgroundColor: isActive
                          ? "var(--color-primary)"
                          : "var(--color-surface-secondary)",
                        color: isActive
                          ? "var(--color-text-inverse)"
                          : "var(--color-text-primary)",
                        boxShadow: isActive
                          ? "var(--shadow-lg)"
                          : "var(--shadow-sm)",
                        border: `2px solid ${isActive ? "var(--color-primary)" : "var(--color-border-primary)"}`,
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = "var(--color-surface-tertiary)";
                          e.currentTarget.style.transform = "translateX(8px)";
                          e.currentTarget.style.borderColor = tab.color;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = "var(--color-surface-secondary)";
                          e.currentTarget.style.transform = "translateX(0)";
                          e.currentTarget.style.borderColor = "var(--color-border-primary)";
                        }
                      }}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full"
                          style={{ backgroundColor: "var(--color-text-inverse)" }}
                        />
                      )}

                      <div
                        className={`p-2 rounded-lg ${isActive ? "bg-white bg-opacity-20" : ""}`}
                        style={{
                          color: isActive ? "var(--color-text-inverse)" : tab.color,
                        }}
                      >
                        {tab.icon}
                      </div>
                      <span className="md:hidden lg:block flex-1 text-left">{tab.label}</span>

                      {/* Hover effect */}
                      <div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{
                          background: `linear-gradient(135deg, ${tab.color}20, transparent)`,
                        }}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className={`${activeTab == "" && "hidden"} flex-1 overflow-auto`}>
        <div className="p-6 md:p-8 max-w-4xl">
          {activeTab === "account" && (
            <AccountSettings setActiveTab={setActiveTab} userData={userData} handleLogout={handleLogout} />
          )}

          {activeTab === "entries" && (
            <EntriesSettings setActiveTab={setActiveTab} />
          )}

          {activeTab === "appearance" && (
            <AppearanceSettings setActiveTab={setActiveTab} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;