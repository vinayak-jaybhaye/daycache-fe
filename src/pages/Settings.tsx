import type React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser, clearUser } from "../store/userSlice";
import type { RootState } from "../store/store";
import {
  LogOut,
  Edit,
  Calendar,
  Clock,
  ArrowLeft,
  Palette,
  FileText,
  User,
} from "lucide-react";
import { ThemeToggle } from "../components/theme-toggle";

type UserType = {
  id: string;
  username: string;
  email: string;
  profile_image?: string;
  created_at: string;
};

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "account" | "entries" | "appearance"
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
    { id: "account", label: "Account", icon: <User className="h-4 w-4" /> },
    { id: "entries", label: "Entries", icon: <FileText className="h-4 w-4" /> },
    {
      id: "appearance",
      label: "Appearance",
      icon: <Palette className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex min-h-screen theme-bg">
      {/* Sidebar */}
      <div className="w-64 theme-sidebar theme-border border-r theme-shadow">
        <div className="p-6">
          <div className="flex items-center mb-8 gap-3">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-lg theme-card hover:theme-sidebar-hover transition-colors theme-border border"
            >
              <ArrowLeft className="h-5 w-5 theme-text" />
            </button>
            <h2 className="text-xl font-serif font-semibold theme-text">
              Settings
            </h2>
          </div>

          <nav>
            <ul className="space-y-2">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all font-medium ${
                      activeTab === tab.id
                        ? "theme-button-primary theme-shadow"
                        : "theme-text hover:theme-sidebar-hover"
                    }`}
                  >
                    <span
                      className={
                        activeTab === tab.id
                          ? "text-white"
                          : "theme-text-secondary"
                      }
                    >
                      {tab.icon}
                    </span>
                    <span
                      className={
                        activeTab === tab.id ? "text-white" : "theme-text"
                      }
                    >
                      {tab.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 theme-bg">
        <div className="p-8">
          {activeTab === "account" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-serif font-bold theme-text mb-2">
                  Account Settings
                </h1>
                <p className="theme-text-muted">
                  Manage your account information and preferences
                </p>
              </div>

              <div className="theme-card rounded-2xl theme-shadow overflow-hidden theme-border border">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-6">
                      <div className="theme-border border-4 theme-shadow rounded-full">
                        {userData?.profile_image ? (
                          <img
                            src={userData?.profile_image || "/placeholder.svg"}
                            alt="User Avatar"
                            className="w-20 h-20 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 theme-button-secondary rounded-full flex items-center justify-center">
                            <span className="text-2xl font-bold theme-text">
                              {userData?.username?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h2 className="text-2xl font-serif font-bold theme-text">
                          {userData?.username || userData?.email.split("@")[0]}
                        </h2>
                        <p className="theme-text-secondary mt-1">
                          {userData?.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="px-4 py-2 theme-button-secondary rounded-lg theme-shadow hover:opacity-90 transition-all flex items-center gap-2 font-medium">
                        <Edit className="h-4 w-4" />
                        Edit Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg theme-shadow hover:bg-red-700 transition-all flex items-center gap-2 font-medium"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="theme-entry p-4 rounded-xl theme-border border flex items-center gap-3">
                      <Calendar className="h-6 w-6 theme-text-secondary" />
                      <div>
                        <p className="theme-text-muted text-sm">Member Since</p>
                        <p className="text-lg font-bold theme-text">
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
                    <div className="theme-entry p-4 rounded-xl theme-border border flex items-center gap-3">
                      <Clock className="h-6 w-6 theme-text-secondary" />
                      <div>
                        <p className="theme-text-muted text-sm">Last Active</p>
                        <p className="text-lg font-bold theme-text">Today</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "entries" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-serif font-bold theme-text mb-2">
                  Entry Settings
                </h1>
                <p className="theme-text-muted">
                  Customize how your entries are saved, sorted, and displayed
                </p>
              </div>

              <div className="theme-card rounded-2xl theme-shadow theme-border border p-6">
                <h3 className="text-lg font-semibold theme-text mb-4">
                  Entry Preferences
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 theme-entry rounded-lg theme-border border">
                    <div>
                      <h4 className="font-medium theme-text">
                        Auto-save entries
                      </h4>
                      <p className="text-sm theme-text-muted">
                        Automatically save entries as you type
                      </p>
                    </div>
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 theme-entry rounded-lg theme-border border">
                    <div>
                      <h4 className="font-medium theme-text">
                        Show timestamps
                      </h4>
                      <p className="text-sm theme-text-muted">
                        Display creation time for each entry
                      </p>
                    </div>
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 theme-entry rounded-lg theme-border border">
                    <div>
                      <h4 className="font-medium theme-text">
                        Enable suggestions
                      </h4>
                      <p className="text-sm theme-text-muted">
                        Show AI-powered writing suggestions
                      </p>
                    </div>
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-serif font-bold theme-text mb-2">
                  Appearance Settings
                </h1>
                <p className="theme-text-muted">
                  Customize the look and feel of your journal
                </p>
              </div>

              <div className="theme-card rounded-2xl theme-shadow theme-border border p-6">
                <h3 className="text-lg font-semibold theme-text mb-4">
                  Theme Preferences
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 theme-entry rounded-lg theme-border border">
                    <div>
                      <h4 className="font-medium theme-text">Theme Mode</h4>
                      <p className="text-sm theme-text-muted">
                        Switch between light and dark themes
                      </p>
                    </div>
                    <ThemeToggle />
                  </div>

                  <div className="p-4 theme-entry rounded-lg theme-border border">
                    <h4 className="font-medium theme-text mb-3">Font Size</h4>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm theme-button-secondary rounded">
                        Small
                      </button>
                      <button className="px-3 py-1 text-sm theme-button-primary rounded">
                        Medium
                      </button>
                      <button className="px-3 py-1 text-sm theme-button-secondary rounded">
                        Large
                      </button>
                    </div>
                  </div>

                  <div className="p-4 theme-entry rounded-lg theme-border border">
                    <h4 className="font-medium theme-text mb-3">
                      Journal Style
                    </h4>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm theme-button-primary rounded">
                        Classic
                      </button>
                      <button className="px-3 py-1 text-sm theme-button-secondary rounded">
                        Modern
                      </button>
                      <button className="px-3 py-1 text-sm theme-button-secondary rounded">
                        Vintage
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8">
            <button className="theme-button-primary px-6 py-3 rounded-lg theme-shadow hover:opacity-90 transition-all font-medium">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
