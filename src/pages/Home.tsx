import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/userSlice";
import Day from "../components/Day";
import { Calendar, ListIcon, Grid3X3 } from "lucide-react";
import ListDays from "../components/ListDays";
import { CalendarView } from "../components";

interface RootState {
  user: {
    user: UserData | null;
  };
}

interface UserData {
  id: string;
  [key: string]: any;
}

import type { Day as DayType } from '../types'

const Home: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showList, setShowList] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(user);
  const [selectedDay, setSelectedDay] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const [days, setDays] = useState<DayType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Mobile sliding state
  const [isMobile, setIsMobile] = useState(false);
  const [currentView, setCurrentView] = useState<"sidebar" | "content">(
    "sidebar"
  );

  // Check if mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch or reuse logged-in user
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
          const data = await response.json();
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

  const fetchDays = async () => {
    if (!userData?.id || isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      let url = `${import.meta.env.VITE_API_URL}/users/${userData.id
        }/days?limit=5`;
      const lastDate = days[days.length - 1]?.date;
      if (lastDate) {
        url += `&last_date=${encodeURIComponent(lastDate)}`;
      }

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch days");

      const data: DayType[] = await response.json();
      setDays((prev) => [...prev, ...data]);

      if (data.length < 5) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch days:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (userData) {
      fetchDays();
    }
  }, [userData]);

  if (!isMobile)
    return (
      <div className="flex gap-6 h-[89vh] theme-bg">
        {/* Left Sidebar */}
        <div className=" md:flex flex-col w-80 theme-sidebar theme-border border rounded-2xl theme-shadow overflow-hidden">
          {/* Sidebar Header */}
          <div className="theme-card theme-border border-b p-4">
            <div className="flex items-center justify-around gap-1 theme-entry rounded-lg p-1 theme-border border">
              <button
                onClick={() => setShowList(true)}
                className={`w-full p-2 rounded-md transition-all flex items-center gap-2 text-sm font-medium ${showList
                  ? "theme-button-primary theme-shadow"
                  : "theme-text hover:theme-sidebar-hover"
                  }`}
                title="List View"
              >
                <ListIcon className="h-4 w-4" />
                <span className={showList ? "text-white" : "theme-text"}>
                  List
                </span>
              </button>
              <button
                onClick={() => setShowList(false)}
                className={`w-full p-2 rounded-md transition-all flex items-center gap-2 text-sm font-medium ${!showList
                  ? "theme-button-primary theme-shadow"
                  : "theme-text hover:theme-sidebar-hover"
                  }`}
                title="Calendar View"
              >
                <Calendar className="h-4 w-4" />
                <span className={!showList ? "text-white" : "theme-text"}>
                  Calendar
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2 mt-2 text-sm theme-text-muted">
              <Grid3X3 className="h-4 w-4" />
              <span>
                {showList
                  ? "Browse your journal entries"
                  : "View activity calendar"}
              </span>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-hidden">
            {/* List View */}
            <div className={`h-full ${!showList && "hidden"}`}>
              {userData && (
                <div className="h-full">
                  <ListDays
                    setSelectedDay={setSelectedDay}
                    selectedDay={selectedDay}
                    userData={{ id: userData.id }}
                  />
                </div>
              )}
            </div>

            {/* Calendar View */}
            <div
              className={`h-full overflow-y-auto scrollbar-hide ${showList && "hidden"}`}
            >
              <CalendarView gridCols={1} />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 theme-card rounded-2xl theme-shadow overflow-hidden theme-border border">
          <div className="h-full overflow-auto scrollbar-hide">
            {userData ? (
              <div>
                <Day date={selectedDay} userId={userData.id} setCurrentView={null} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-current theme-text mx-auto mb-4"></div>
                  <p className="theme-text-muted">Loading your journal...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );

  // Mobile view
  return (
    <div className="flex gap-6 theme-bg ">
      <div>
        {/* Left Sidebar */}
        <div
          className={`${currentView === "content" && "hidden"} theme-sidebar theme-border border theme-shadow overflow-hidden w-[100vw]`}
        >
          {/* Sidebar Header */}
          <div className="theme-card theme-border border-b p-4">
            <div className="flex items-center justify-around gap-1 theme-entry rounded-lg p-1 theme-border border">
              <button
                onClick={() => setShowList(true)}
                className={`w-full p-2 rounded-md transition-all flex items-center gap-2 text-sm font-medium ${showList
                  ? "theme-button-primary theme-shadow"
                  : "theme-text hover:theme-sidebar-hover"
                  }`}
                title="List View"
              >
                <ListIcon className="h-4 w-4" />
                <span className={showList ? "text-white" : "theme-text"}>
                  List
                </span>
              </button>
              <button
                onClick={() => setShowList(false)}
                className={`w-full p-2 rounded-md transition-all flex items-center gap-2 text-sm font-medium ${!showList
                  ? "theme-button-primary theme-shadow"
                  : "theme-text hover:theme-sidebar-hover"
                  }`}
                title="Calendar View"
              >
                <Calendar className="h-4 w-4" />
                <span className={!showList ? "text-white" : "theme-text"}>
                  Calendar
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2 mt-2 text-sm theme-text-muted">
              <Grid3X3 className="h-4 w-4" />
              <span>
                {showList
                  ? "Browse your journal entries"
                  : "View activity calendar"}
              </span>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-hidden">
            {/* List View */}
            <div className={`h-full ${!showList && "hidden"}`}>
              {userData && (
                <div className="h-full">
                  <ListDays
                    setSelectedDay={setSelectedDay}
                    selectedDay={selectedDay}
                    userData={{ id: userData.id }}
                    setCurrentView={setCurrentView}
                  />
                </div>
              )}
            </div>

            {/* Calendar View */}
            <div
              className={`h-full overflow-y-auto scrollbar-hide ${showList && "hidden"}`}
            >
              <CalendarView gridCols={1} />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div
          className={`${currentView === "sidebar" && "hidden"
            } flex-1 theme-card theme-shadow overflow-hidden theme-border border`}
        >
          <div className="h-full overflow-auto scrollbar-hide">
            {userData ? (
              <Day date={selectedDay} userId={userData.id} setCurrentView={() => setCurrentView('sidebar')} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-current theme-text mx-auto mb-4"></div>
                  <p className="theme-text-muted">Loading your journal...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
