import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../store/userSlice";
import type { RootState } from "../store/store";
import { ActivityCalendar } from "../components";
import { Calendar, BookOpen, Clock } from "lucide-react";

interface User {
  email: string;
  username?: string;
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-200">
          <div className="pt-10 px-8 pb-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-6">
                {/* User Avatar */}
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
                        {userData.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="text-3xl font-serif font-bold text-amber-900">
                    {userData.username || userData.email.split("@")[0]}
                  </h1>
                  <p className="text-amber-700 mt-1">{userData.email}</p>
                </div>
              </div>

              <div className="flex justify-end gap-6">
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-amber-600" />
                  <div>
                    <p className="text-amber-700 text-sm">Member Since</p>
                    <p className="text-xl font-bold text-amber-900">
                      {new Date(userData.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                        }
                      )}
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
        </div>

        {/* Additional Sections */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-amber-200">
            <h3 className="text-lg font-serif font-semibold text-amber-900 mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-amber-600" />
              Journal Stats
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                <span className="text-amber-800 font-medium">
                  Total Entries
                </span>
                <span className="text-amber-900 font-bold bg-white px-3 py-1 rounded-md shadow-sm">
                  42
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                <span className="text-amber-800 font-medium">Streak</span>
                <span className="text-amber-900 font-bold bg-white px-3 py-1 rounded-md shadow-sm">
                  7 days
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                <span className="text-amber-800 font-medium">
                  Longest Entry
                </span>
                <span className="text-amber-900 font-bold bg-white px-3 py-1 rounded-md shadow-sm">
                  March 15
                </span>
              </div>
            </div>
          </div>
          <div className="h-100 overflow-hidden">
            <ActivityCalendar date={new Date().toISOString().slice(0, 10)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
