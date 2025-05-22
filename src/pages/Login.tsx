import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../store/userSlice";
import type { RootState } from "../store/store"; // adjust based on your store setup
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
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="bg-card p-8 rounded-3xl shadow-2xl w-full max-w-md border border-border">
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-r from-primary to-primary/80 p-4 rounded-2xl mb-4 shadow-lg">
            <h1 className="text-3xl font-bold text-primary-foreground flex items-center gap-2">
              DayCache
            </h1>
          </div>
          <h2 className="text-2xl font-serif font-semibold text-foreground">
            Welcome Back
          </h2>
          <p className="text-muted-foreground text-sm mt-2">
            Continue your digital journal
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 text-sm text-center p-3 rounded-lg font-medium ${
              messageType === "error"
                ? "bg-destructive/20 text-destructive"
                : "bg-primary/20 text-primary"
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
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-input focus:border-ring focus:ring-2 focus:ring-ring/20 outline-none bg-background"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
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
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-input focus:border-ring focus:ring-2 focus:ring-ring/20 outline-none bg-background"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
              <Lock className="h-5 w-5" />
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transform transition-all hover:scale-105 shadow-md flex items-center justify-center gap-2"
          >
            <LogIn className="h-5 w-5" />
            Log In
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-muted-foreground text-sm">
            New here?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-primary cursor-pointer font-medium hover:text-primary/80 transition-colors"
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
