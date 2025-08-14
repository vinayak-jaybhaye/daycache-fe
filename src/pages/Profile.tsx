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

import type { User } from '../types'
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
      <div
        className="flex justify-center items-center min-h-screen"
        style={{ backgroundColor: 'var(--color-bg-primary)' }}
      >
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: 'var(--color-primary)' }}
        ></div>
      </div>
    );

  return (
    <div
      className="min-h-screen py-8"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div
          className="rounded-2xl overflow-hidden border mb-8"
          style={{
            backgroundColor: 'var(--color-surface-primary)',
            borderColor: 'var(--color-border-primary)',
            boxShadow: 'var(--shadow-base)'
          }}
        >
          <div className="pt-10 px-8 pb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-6">
                {/* User Avatar */}
                <div
                  className="border-4 rounded-full"
                  style={{
                    borderColor: 'var(--color-border-primary)',
                    boxShadow: 'var(--shadow-base)'
                  }}
                >
                  {userData?.profile_image ? (
                    <img
                      src={userData?.profile_image || "/placeholder.svg"}
                      alt="User Avatar"
                      className="size-22 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="size-22 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'var(--color-surface-secondary)' }}
                    >
                      <span
                        className="text-3xl font-bold"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {userData.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <h1
                    className="text-4xl font-serif font-bold"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {userData.username || userData.email.split("@")[0]}
                  </h1>
                  <p
                    className="mt-2 text-lg"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {userData.email}
                  </p>
                  <div className="md:flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2">
                      <Calendar
                        className="h-4 w-4"
                        style={{ color: 'var(--color-text-tertiary)' }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: 'var(--color-text-tertiary)' }}
                      >
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
                      <Clock
                        className="h-4 w-4"
                        style={{ color: 'var(--color-text-tertiary)' }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: 'var(--color-text-tertiary)' }}
                      >
                        Active today
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div
                  className="p-4 rounded-xl border flex items-center gap-3 min-w-[140px]"
                  style={{
                    backgroundColor: 'var(--color-surface-secondary)',
                    borderColor: 'var(--color-border-primary)'
                  }}
                >
                  <TrendingUp
                    className="h-6 w-6"
                    style={{ color: 'var(--color-text-secondary)' }}
                  />
                  <div>
                    <p
                      className="text-sm"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
                      Current Streak
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      7 days
                    </p>
                  </div>
                </div>
                <div
                  className="p-4 rounded-xl border flex items-center gap-3 min-w-[140px]"
                  style={{
                    backgroundColor: 'var(--color-surface-secondary)',
                    borderColor: 'var(--color-border-primary)'
                  }}
                >
                  <BookOpen
                    className="h-6 w-6"
                    style={{ color: 'var(--color-text-secondary)' }}
                  />
                  <div>
                    <p
                      className="text-sm"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
                      Total Entries
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      42
                    </p>
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
            <div
              className="p-6 rounded-2xl border"
              style={{
                backgroundColor: 'var(--color-surface-primary)',
                borderColor: 'var(--color-border-primary)',
                boxShadow: 'var(--shadow-base)'
              }}
            >
              <h3
                className="text-xl font-serif font-semibold mb-6 flex items-center gap-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                <BookOpen
                  className="h-5 w-5"
                  style={{ color: 'var(--color-text-secondary)' }}
                />
                Journal Statistics
              </h3>
              <div className="space-y-4">
                <div
                  className="flex items-center justify-between p-4 rounded-lg border"
                  style={{
                    backgroundColor: 'var(--color-surface-secondary)',
                    borderColor: 'var(--color-border-primary)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Award
                      className="h-5 w-5"
                      style={{ color: 'var(--color-text-secondary)' }}
                    />
                    <span
                      className="font-medium"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      Total Entries
                    </span>
                  </div>
                  <span
                    className="font-bold px-3 py-1 rounded-md text-lg"
                    style={{
                      backgroundColor: 'var(--color-surface-primary)',
                      color: 'var(--color-text-primary)',
                      boxShadow: 'var(--shadow-base)'
                    }}
                  >
                    42
                  </span>
                </div>
                <div
                  className="flex items-center justify-between p-4 rounded-lg border"
                  style={{
                    backgroundColor: 'var(--color-surface-secondary)',
                    borderColor: 'var(--color-border-primary)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <TrendingUp
                      className="h-5 w-5"
                      style={{ color: 'var(--color-text-secondary)' }}
                    />
                    <span
                      className="font-medium"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      Current Streak
                    </span>
                  </div>
                  <span
                    className="font-bold px-3 py-1 rounded-md text-lg"
                    style={{
                      backgroundColor: 'var(--color-surface-primary)',
                      color: 'var(--color-text-primary)',
                      boxShadow: 'var(--shadow-base)'
                    }}
                  >
                    7 days
                  </span>
                </div>
                <div
                  className="flex items-center justify-between p-4 rounded-lg border"
                  style={{
                    backgroundColor: 'var(--color-surface-secondary)',
                    borderColor: 'var(--color-border-primary)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Target
                      className="h-5 w-5"
                      style={{ color: 'var(--color-text-secondary)' }}
                    />
                    <span
                      className="font-medium"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      Longest Streak
                    </span>
                  </div>
                  <span
                    className="font-bold px-3 py-1 rounded-md text-lg"
                    style={{
                      backgroundColor: 'var(--color-surface-primary)',
                      color: 'var(--color-text-primary)',
                      boxShadow: 'var(--shadow-base)'
                    }}
                  >
                    21 days
                  </span>
                </div>
                <div
                  className="flex items-center justify-between p-4 rounded-lg border"
                  style={{
                    backgroundColor: 'var(--color-surface-secondary)',
                    borderColor: 'var(--color-border-primary)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Calendar
                      className="h-5 w-5"
                      style={{ color: 'var(--color-text-secondary)' }}
                    />
                    <span
                      className="font-medium"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      This Month
                    </span>
                  </div>
                  <span
                    className="font-bold px-3 py-1 rounded-md text-lg"
                    style={{
                      backgroundColor: 'var(--color-surface-primary)',
                      color: 'var(--color-text-primary)',
                      boxShadow: 'var(--shadow-base)'
                    }}
                  >
                    12 entries
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div
              className="p-6 rounded-2xl border mt-6"
              style={{
                backgroundColor: 'var(--color-surface-primary)',
                borderColor: 'var(--color-border-primary)',
                boxShadow: 'var(--shadow-base)'
              }}
            >
              <h3
                className="text-xl font-serif font-semibold mb-4 flex items-center gap-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                <Award
                  className="h-5 w-5"
                  style={{ color: 'var(--color-text-secondary)' }}
                />
                Recent Achievements
              </h3>
              <div className="space-y-3">
                <div
                  className="flex items-center gap-3 p-3 rounded-lg border"
                  style={{
                    backgroundColor: 'var(--color-surface-secondary)',
                    borderColor: 'var(--color-border-primary)'
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    <span className="text-sm font-bold text-white">🔥</span>
                  </div>
                  <div>
                    <p
                      className="font-medium text-sm"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      Week Warrior
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
                      7-day writing streak
                    </p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-3 p-3 rounded-lg border"
                  style={{
                    backgroundColor: 'var(--color-surface-secondary)',
                    borderColor: 'var(--color-border-primary)'
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-surface-tertiary)' }}
                  >
                    <span className="text-sm font-bold">📝</span>
                  </div>
                  <div>
                    <p
                      className="font-medium text-sm"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      Prolific Writer
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
                      50+ entries written
                    </p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-3 p-3 rounded-lg border"
                  style={{
                    backgroundColor: 'var(--color-surface-secondary)',
                    borderColor: 'var(--color-border-primary)'
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-surface-tertiary)' }}
                  >
                    <span className="text-sm font-bold">⭐</span>
                  </div>
                  <div>
                    <p
                      className="font-medium text-sm"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      Early Bird
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
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