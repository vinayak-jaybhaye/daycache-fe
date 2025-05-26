import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/userSlice";
import type { RootState } from "../store/store";
import { ActivityCalendar } from "../components";
import {
  Calendar,
  BookOpen,
  Clock,
  TrendingUp,
  Award,
  Target,
} from "lucide-react";

interface User {
  id: string;
  email: string;
  username: string;
  profile_image?: string;
  created_at: string;
}

function Profile() {
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

  if (!userData)
    return (
      <div className="flex justify-center items-center min-h-screen theme-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-current theme-text"></div>
      </div>
    );

  return (
    <div className="min-h-screen theme-bg py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Header */}
        <div className="theme-card rounded-2xl theme-shadow overflow-hidden theme-border border mb-8">
          <div className="pt-10 px-8 pb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-6">
                {/* User Avatar */}
                <div className="theme-border border-4 theme-shadow rounded-full">
                  {userData?.profile_image ? (
                    <img
                      src={userData?.profile_image || "/placeholder.svg"}
                      alt="User Avatar"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 theme-button-secondary rounded-full flex items-center justify-center">
                      <span className="text-3xl theme-text font-bold">
                        {userData.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="text-4xl font-serif font-bold theme-text">
                    {userData.username || userData.email.split("@")[0]}
                  </h1>
                  <p className="theme-text-secondary mt-2 text-lg">
                    {userData.email}
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 theme-text-muted" />
                      <span className="text-sm theme-text-muted">
                        Joined{" "}
                        {new Date(userData.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 theme-text-muted" />
                      <span className="text-sm theme-text-muted">
                        Active today
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="theme-entry p-4 rounded-xl theme-border border flex items-center gap-3 min-w-[140px]">
                  <TrendingUp className="h-6 w-6 theme-text-secondary" />
                  <div>
                    <p className="theme-text-muted text-sm">Current Streak</p>
                    <p className="text-2xl font-bold theme-text">7 days</p>
                  </div>
                </div>
                <div className="theme-entry p-4 rounded-xl theme-border border flex items-center gap-3 min-w-[140px]">
                  <BookOpen className="h-6 w-6 theme-text-secondary" />
                  <div>
                    <p className="theme-text-muted text-sm">Total Entries</p>
                    <p className="text-2xl font-bold theme-text">42</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats and Activity Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Journal Stats */}
          <div className="lg:col-span-1">
            <div className="theme-card p-6 rounded-2xl theme-shadow theme-border border">
              <h3 className="text-xl font-serif font-semibold theme-text mb-6 flex items-center gap-2">
                <BookOpen className="h-5 w-5 theme-text-secondary" />
                Journal Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 theme-entry rounded-lg theme-border border">
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 theme-text-secondary" />
                    <span className="theme-text font-medium">
                      Total Entries
                    </span>
                  </div>
                  <span className="theme-text font-bold theme-card px-3 py-1 rounded-md theme-shadow text-lg">
                    42
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 theme-entry rounded-lg theme-border border">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 theme-text-secondary" />
                    <span className="theme-text font-medium">
                      Current Streak
                    </span>
                  </div>
                  <span className="theme-text font-bold theme-card px-3 py-1 rounded-md theme-shadow text-lg">
                    7 days
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 theme-entry rounded-lg theme-border border">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 theme-text-secondary" />
                    <span className="theme-text font-medium">
                      Longest Streak
                    </span>
                  </div>
                  <span className="theme-text font-bold theme-card px-3 py-1 rounded-md theme-shadow text-lg">
                    21 days
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 theme-entry rounded-lg theme-border border">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 theme-text-secondary" />
                    <span className="theme-text font-medium">This Month</span>
                  </div>
                  <span className="theme-text font-bold theme-card px-3 py-1 rounded-md theme-shadow text-lg">
                    12 entries
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="theme-card p-6 rounded-2xl theme-shadow theme-border border mt-6">
              <h3 className="text-xl font-serif font-semibold theme-text mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 theme-text-secondary" />
                Recent Achievements
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 theme-entry rounded-lg theme-border border">
                  <div className="w-8 h-8 theme-button-primary rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">🔥</span>
                  </div>
                  <div>
                    <p className="theme-text font-medium text-sm">
                      Week Warrior
                    </p>
                    <p className="theme-text-muted text-xs">
                      7-day writing streak
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 theme-entry rounded-lg theme-border border">
                  <div className="w-8 h-8 theme-button-secondary rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">📝</span>
                  </div>
                  <div>
                    <p className="theme-text font-medium text-sm">
                      Prolific Writer
                    </p>
                    <p className="theme-text-muted text-xs">
                      50+ entries written
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 theme-entry rounded-lg theme-border border">
                  <div className="w-8 h-8 theme-button-secondary rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">⭐</span>
                  </div>
                  <div>
                    <p className="theme-text font-medium text-sm">Early Bird</p>
                    <p className="theme-text-muted text-xs">
                      Morning writing habit
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Calendar */}
          <div className="lg:col-span-2">
            <div className="h-full">
              <ActivityCalendar date={new Date().toISOString().slice(0, 10)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
