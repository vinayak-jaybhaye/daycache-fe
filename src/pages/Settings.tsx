import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser, clearUser } from "../store/userSlice";
import type { RootState } from "../store/store";
import { LogOut, Edit, Calendar, Clock, ArrowLeft } from "lucide-react";

// Define the User type if not already imported
type User = {
  id: string;
  username: string;
  email: string;
  profile_image?: string;
  created_at: string;
  // Add other fields as needed
};

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "account" | "entries" | "appearance"
  >("account");

  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User | null>(null);

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

          const data: User = await response.json();
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
      dispatch(clearUser());
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
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9f9f9" }}>
      {/* Sidebar */}
      <div
        style={{
          width: 200,
          padding: "24px 16px",
          background: "#fff",
          borderRight: "1px solid #eee",
        }}
      >
        <div className="flex items-center mb-8 justify-around">
          <button>
            <ArrowLeft
              onClick={() => navigate("/")}
              style={{ marginRight: 8 }}
            />
          </button>
          <h2>Settings</h2>
        </div>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {["account", "entries", "appearance"].map((tab) => (
            <li key={tab} style={{ marginBottom: 12 }}>
              <button
                onClick={() => setActiveTab(tab as any)}
                style={{
                  background: activeTab === tab ? "#e0f2fe" : "transparent",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: 4,
                  width: "100%",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                {tab[0].toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          padding: "40px 32px",
          background: "#fff",
        }}
      >
        {activeTab === "account" && (
          <>
            <h1 className="text-2xl">Account</h1>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-200">
              <div className="pt-10 px-8 pb-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-6">
                    <div className="border-4 border-amber-100 shadow-lg rounded-full">
                      {userData?.profile_image ? (
                        <img
                          src={userData?.profile_image}
                          alt="User Avatar"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
                          <span className="text-4xl text-amber-600 font-bold">
                            {userData?.username?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h1 className="text-3xl font-serif font-bold text-amber-900">
                        {userData?.username || userData?.email.split("@")[0]}
                      </h1>
                      <p className="text-amber-700 mt-1">{userData?.email}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={handleLogout}
                      className="px-6 py-3 bg-amber-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all hover:bg-amber-700 flex items-center gap-2"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </button>
                    <button className="px-6 py-3 bg-amber-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all hover:bg-amber-700 flex items-center gap-2">
                      <Edit className="h-5 w-5" />
                      Edit Profile
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-6">
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-center gap-3">
                    <Calendar className="h-6 w-6 text-amber-600" />
                    <div>
                      <p className="text-amber-700 text-sm">Member Since</p>
                      <p className="text-xl font-bold text-amber-900">
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
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-center gap-3">
                    <Clock className="h-6 w-6 text-amber-600" />
                    <div>
                      <p className="text-amber-700 text-sm">Last Active</p>
                      <p className="text-xl font-bold text-amber-900">Today</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "entries" && (
          <>
            <h1>Entries</h1>
            <p>
              You can customize how your entries are saved, sorted, and
              displayed here.
            </p>
            {/* Add options as needed */}
          </>
        )}

        {activeTab === "appearance" && (
          <>
            <h1>Appearance</h1>
            <label>
              <input type="checkbox" />
              &nbsp;Dark Mode
            </label>
          </>
        )}

        <button
          style={{
            marginTop: 32,
            padding: "8px 24px",
            background: "#0078d4",
            color: "#fff",
            border: "none",
            borderRadius: 4,
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
