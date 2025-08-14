import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { setUser } from "../store/userSlice";
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

  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();


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
      <div
        className="h-16 animate-pulse flex items-center justify-center"
        style={{
          backgroundColor: 'var(--color-surface-primary)',
          color: 'var(--color-text-primary)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          className="w-32 h-8 rounded"
          style={{
            backgroundColor: 'var(--color-surface-secondary)',
          }}
        />
      </div>
    );

  return (
    <div
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: 'var(--color-surface-primary)',
        borderColor: 'var(--color-border-primary)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="flex items-center justify-between px-4 py-2">
        <h1
          className="md:text-2xl font-extrabold cursor-pointer hover:opacity-80 transition duration-300 flex items-center gap-2 font-serif"
          style={{
            color: 'var(--color-text-primary)',
            transition: 'opacity 0.3s ease',
          }}
          onClick={() => {
            if (userData) navigate("/");
          }}
        >
          DayCache
          {/* <div className="h-8 w-8">
            <img src="/notebook.png" alt="" />
          </div> */}
        </h1>

        <div className="flex items-center space-x-4">
          {/* <ThemeToggle /> */}

          {userData ? (
            <div className="flex items-center space-x-4">
              <div>
                <PlusCircle
                  className="h-6 w-6 cursor-pointer hover:opacity-80 transition duration-300"
                  style={{
                    color: 'var(--color-text-primary)',
                    transition: 'opacity 0.3s ease',
                  }}
                  onClick={() => navigate(`/day/${new Date().toISOString().split("T")[0]}`)}
                />
              </div>

              <button
                onClick={() => navigate('/cache-chat')}
                className="rounded-lg hover:opacity-90 transition flex items-center gap-2 text-sm font-medium p-2 md:px-4 md:py-2"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-text-inverse)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'opacity 0.3s ease',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <MessageSquare className="h-4 w-4" />
                <span className="hidden md:block">Cache Chat</span>
              </button>

              <button
                className="flex items-center justify-center h-10 w-10 cursor-pointer border rounded-md transition-colors"
                style={{
                  backgroundColor: 'var(--color-surface-secondary)',
                  borderColor: 'var(--color-border-primary)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'background-color 0.3s ease',
                }}
                onClick={() => setShowRightSidebar((prev) => !prev)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-surface-tertiary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-surface-secondary)';
                }}
              >
                <MenuIcon
                  className="h-5 w-5"
                  style={{
                    color: 'var(--color-text-primary)',
                  }}
                />
              </button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <button
                onClick={handleLogin}
                className="rounded-lg hover:opacity-90 transition flex items-center gap-2 text-sm font-medium p-2 md:px-4 md:py-2"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-text-inverse)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'opacity 0.3s ease',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <LogIn className="h-4 w-4" />
                Login
              </button>

              <button
                onClick={handleSignup}
                className="rounded-lg hover:opacity-90 transition flex items-center gap-2 text-sm font-medium p-2 md:px-4 md:py-2 border"
                style={{
                  backgroundColor: 'var(--color-surface-secondary)',
                  color: 'var(--color-text-primary)',
                  borderColor: 'var(--color-border-primary)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'background-color 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-surface-tertiary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-surface-secondary)';
                }}
              >
                <UserPlus className="h-4 w-4" />
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;