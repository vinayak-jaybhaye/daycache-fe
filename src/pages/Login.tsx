import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../store/userSlice";
import type { RootState } from "../store/store";
import { Mail, Lock, LogIn } from "lucide-react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("user@example.com");
  const [password, setPassword] = useState<string>("string");
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (user?.user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
          mode: "cors",
        }
      );

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();

      dispatch(setUser(data.user));
      setMessage("Login successful!");
      setMessageType("success");
      navigate("/");

      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage("Invalid email or password.");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="flex justify-center items-center h-[90vh] theme-bg">
      <div className="theme-card p-8 theme-shadow-hover w-full max-w-md theme-border border">
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="theme-button-primary p-4 rounded-2xl mb-4 theme-shadow">
            <h1 className="text-3xl font-bold flex items-center gap-2 font-serif">
              DayCache
            </h1>
          </div>
          <h2 className="text-2xl font-serif font-semibold theme-text">
            Welcome Back
          </h2>
          <p className="theme-text-muted text-sm mt-2">
            Continue your digital journal
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 text-sm text-center p-3 rounded-lg font-medium ${messageType === "error"
              ? "bg-red-100 text-red-700 border border-red-200"
              : "theme-button-primary"
              }`}
          >
            {message}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full pl-12 pr-4 py-3 rounded-xl theme-input theme-border border outline-none transition-all"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 theme-text-secondary">
              <Mail className="h-5 w-5" />
            </span>
          </div>

          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-12 pr-4 py-3 rounded-xl theme-input theme-border border outline-none transition-all"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 theme-text-secondary">
              <Lock className="h-5 w-5" />
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl font-semibold theme-button-primary transform transition-all hover:scale-105 theme-shadow flex items-center justify-center gap-2"
          >
            <LogIn className="h-5 w-5" />
            Log In
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="theme-text-muted text-sm">
            New here?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="theme-text-secondary cursor-pointer font-medium hover:opacity-80 transition-colors"
            >
              Create account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
