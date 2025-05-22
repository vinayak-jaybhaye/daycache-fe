import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { setUser } from "../store/userSlice";
import DraggableDialog from "./DraggableDialog";
import DayCacheChat from "./DayCacheChat";
import { MessageSquare, LogIn, UserPlus } from "lucide-react";
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
      <div className="h-16 bg-background animate-pulse flex items-center justify-center">
        <div className="w-32 h-8 bg-muted rounded"></div>
      </div>
    );

  return (
    <div className="sticky top-0 z-50 bg-card shadow-md border-b border-border font-serif">
      <div className="flex items-center justify-between px-4 py-3">
        <h1
          className="text-2xl font-extrabold text-primary cursor-pointer hover:text-primary/90 transition duration-300 flex items-center gap-2"
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
              <button
                onClick={toggleDialog}
                className="bg-primary text-primary-foreground px-3 py-2 rounded-lg hover:bg-primary/90 transition flex items-center gap-1 shadow-sm"
              >
                <MessageSquare className="h-4 w-4" />
                Ask Cache
              </button>

              <button
                className="flex items-center justify-center h-8 w-8 cursor-pointer hover:bg-accent rounded-md transition-colors"
                onClick={() => setShowRightSidebar((prev) => !prev)}
              >
                <img src="sidebar.svg" alt="" />
              </button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <button
                onClick={handleLogin}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition flex items-center gap-2 shadow-sm"
              >
                <LogIn className="h-4 w-4" />
                Login
              </button>
              <button
                onClick={handleSignup}
                className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/90 transition flex items-center gap-2 shadow-sm"
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
