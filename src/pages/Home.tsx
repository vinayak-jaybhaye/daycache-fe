"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/userSlice";
import Day from "../components/Day";
import { Calendar, ListIcon } from "lucide-react";
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

interface DayData {
  id: string;
  user_id: string;
  date: string;
  latest_summary: string;
  created_at: string;
}

const Home: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showList, setShowList] = useState(true);

  const [userData, setUserData] = useState<UserData | null>(user);
  const [sidebarHidden, setSidebarHidden] = useState(window.innerWidth < 768);
  const [selectedDay, setSelectedDay] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [days, setDays] = useState<DayData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // controls pagination

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

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => setSidebarHidden(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchDays = async () => {
    if (!userData?.id || isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      let url = `${import.meta.env.VITE_API_URL}/users/${
        userData.id
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

      const data: DayData[] = await response.json();
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

  return (
    <div className="flex justify-center gap-4 h-[89vh] rounded-2xl overflow-auto scrollbar-hide bg-gradient-to-br from-amber-50 to-amber-100/50">
      {/* Sidebar */}
      <div>
        <div className="p-3 border-b border-amber-200 bg-amber-50 rounded-t-2xl flex items-center justify-around">
          <ListIcon
            className="h-5 w-5 cursor-pointer hover:bg-amber-200 rounded-sm"
            onClick={() => setShowList(true)}
          />
          <Calendar
            className="h-5 w-5 cursor-pointer hover:bg-amber-200 rounded-sm"
            onClick={() => setShowList(false)}
          />
        </div>
        <div className={`${!showList && "hidden"}`}>
          <ListDays setSelectedDay={setSelectedDay} selectedDay={selectedDay} userData = {userData} />
        </div>
        <div
          className={`${
            showList && "hidden"
          } h-full overflow-y-auto scrollbar-hide`}
        >
          <CalendarView gridCols={1} />
        </div>
      </div>

      {/* Main content */}
      <div
        className="flex-1 h-full overflow-auto scrollbar-hide p-4 rounded-sm shadow-inner"
        style={{
          backgroundColor: "#FFF8E7",
          fontFamily: "'Times New Roman', serif",
        }}
      >
        {userData && <Day date={selectedDay} userId={userData.id} />}
      </div>
    </div>
  );
};

export default Home;
