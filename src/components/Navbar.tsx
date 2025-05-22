"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { setUser } from "../store/userSlice";
import DraggableDialog from "./DraggableDialog";
import DayCacheChat from "./DayCacheChat";
import { MessageSquare, Home, Menu, LogIn, UserPlus } from "lucide-react";

interface NavbarProps {
  setShowRightSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ setShowRightSidebar }) => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleDialog = () => setVisible((prev) => !prev);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/users/me`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Unauthorized");

        const data = await response.json();
        setUserData(data);
        dispatch(setUser(data));
      } catch (error) {
        dispatch(setUser(null));
        setUserData(null);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchUser();
    } else {
      setUserData(user);
      setLoading(false);
    }
  }, [user, dispatch, navigate]);

  const handleLogin = () => navigate("/login");
  const handleSignup = () => navigate("/signup");

  if (loading)
    return (
      <div className="h-16 bg-amber-50 animate-pulse flex items-center justify-center">
        <div className="w-32 h-8 bg-amber-200 rounded"></div>
      </div>
    );

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-amber-50 to-amber-100 shadow-md border-b border-amber-200 font-serif">
      <div className="flex items-center justify-between px-4 py-3">
        <h1
          className="text-2xl font-extrabold text-amber-800 cursor-pointer hover:text-amber-900 transition duration-300 flex items-center gap-2"
          onClick={() => {
            if (userData) navigate("/");
          }}
        >
          DayCache
        </h1>

        {userData ? (
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDialog}
              className="bg-amber-600 text-white px-3 py-2 rounded-lg hover:bg-amber-700 transition flex items-center gap-1 shadow-sm"
            >
              <MessageSquare className="h-4 w-4" />
              Ask Cache
            </button>

            <button
              className="flex items-center justify-center h-8 w-8 cursor-pointer hover:bg-amber-200 rounded-md transition-colors"
              onClick={() => setShowRightSidebar((prev) => !prev)}
            >
              {/* <Menu className="h-5 w-5 text-amber-800" /> */}
              <img src="sidebar.svg" alt="" />
            </button>
          </div>
        ) : (
          <div className="flex space-x-4">
            <button
              onClick={handleLogin}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition flex items-center gap-2 shadow-sm"
            >
              <LogIn className="h-4 w-4" />
              Login
            </button>
            <button
              onClick={handleSignup}
              className="bg-amber-800 text-white px-4 py-2 rounded-lg hover:bg-amber-900 transition flex items-center gap-2 shadow-sm"
            >
              <UserPlus className="h-4 w-4" />
              Sign Up
            </button>
          </div>
        )}
      </div>

      <DraggableDialog
        title="Cache Chat"
        toggleDialog={toggleDialog}
        visible={visible}
        props={{}}
        Component={DayCacheChat}
      />
    </div>
  );
};

export default Navbar;
