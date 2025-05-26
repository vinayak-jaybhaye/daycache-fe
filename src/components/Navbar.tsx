import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { setUser } from "../store/userSlice";
import DraggableDialog from "./DraggableDialog";
import DayCacheChat from "./DayCacheChat";
import {
  MessageSquare,
  LogIn,
  UserPlus,
  MenuIcon,
  PlusCircle,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

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
      <div className="h-16 theme-navbar theme-text animate-pulse flex items-center justify-center theme-shadow">
        <div className="w-32 h-8 theme-card rounded"></div>
      </div>
    );

  return (
    <div className="sticky top-0 z-50 theme-navbar theme-text theme-border border-b theme-shadow">
      <div className="flex items-center justify-between px-4 py-2">
        <h1
          className="md:text-2xl font-extrabold cursor-pointer theme-text hover:opacity-80 transition duration-300 flex items-center gap-2 font-serif"
          onClick={() => {
            if (userData) navigate("/");
          }}
        >
          DayCache
        </h1>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {userData ? (
            <div className="flex items-center space-x-4">
              <div>
                <PlusCircle
                  className="h-6 w-6 theme-text cursor-pointer hover:opacity-80 transition duration-300"
                  onClick={() => navigate("/")}
                />
              </div>
              <button
                onClick={toggleDialog}
                className="theme-button-primary px-4 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2 theme-shadow text-sm font-medium p-2 md:px-4 md:py-2"
              >
                <MessageSquare className="h-4 w-4" />
                {<p className="hidden md:block">Cache Chat</p>}
              </button>

              <button
                className="flex items-center justify-center h-10 w-10 cursor-pointer theme-card theme-border border rounded-md hover:theme-sidebar-hover transition-colors theme-shadow"
                onClick={() => setShowRightSidebar((prev) => !prev)}
              >
                <MenuIcon className="h-5 w-5 theme-text" />
              </button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <button
                onClick={handleLogin}
                className="theme-button-primary rounded-lg hover:opacity-90 transition flex items-center gap-2 theme-shadow text-sm font-medium p-2 md:px-4 md:py-2"
              >
                <LogIn className="h-4 w-4" />
                Login
              </button>
              <button
                onClick={handleSignup}
                className="theme-button-secondary rounded-lg hover:opacity-90 transition flex items-center gap-2 theme-shadow text-sm font-medium p-2 md:px-4 md:py-2"
              >
                <UserPlus className="h-4 w-4" />
                Sign Up
              </button>
            </div>
          )}
        </div>
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
