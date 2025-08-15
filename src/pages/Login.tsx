import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../store/userSlice";
import type { RootState } from "../store/store";
import { Mail, Lock, LogIn } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("user@example.com");
  const [password, setPassword] = useState<string>("string");
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const user = useSelector((state: RootState) => state.user);
  const { login } = useAuth();

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
    <div
      className="flex justify-center items-center h-[90vh]"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <div
        className="p-8 w-full max-w-md border rounded-xl"
        style={{
          backgroundColor: 'var(--color-surface-primary)',
          borderColor: 'var(--color-border-primary)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="p-4 rounded-2xl mb-4"
            style={{
              backgroundColor: 'var(--color-primary)',
              boxShadow: 'var(--shadow-base)'
            }}
          >
            <h1
              className="text-3xl font-bold flex items-center gap-2 font-serif"
              style={{ color: 'var(--color-text-inverse)' }}
            >
              DayCache
            </h1>
          </div>
          <h2
            className="text-2xl font-serif font-semibold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Welcome Back
          </h2>
          <p
            className="text-sm mt-2"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Continue your digital journal
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className="mb-6 text-sm text-center p-3 rounded-lg font-medium border"
            style={{
              backgroundColor: messageType === "error" ? 'var(--color-error-50)' : 'var(--color-success)',
              color: messageType === "error" ? 'var(--color-error-700)' : 'var(--color-text-inverse)',
              borderColor: messageType === "error" ? 'var(--color-error-200)' : 'var(--color-success)'
            }}
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
              className="w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all"
              style={{
                backgroundColor: 'var(--color-surface-secondary)',
                borderColor: 'var(--color-border-primary)',
                color: 'var(--color-text-primary)'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border-focus)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border-primary)';
              }}
            />
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--color-text-secondary)' }}
            >
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
              className="w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all"
              style={{
                backgroundColor: 'var(--color-surface-secondary)',
                borderColor: 'var(--color-border-primary)',
                color: 'var(--color-text-primary)'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border-focus)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border-primary)';
              }}
            />
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <Lock className="h-5 w-5" />
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl font-semibold transform transition-all hover:scale-105 flex items-center justify-center gap-2"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-text-inverse)',
              boxShadow: 'var(--shadow-base)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary-700)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary)';
            }}
          >
            <LogIn className="h-5 w-5" />
            Log In
          </button>
          <GoogleLogin
            onSuccess={(res) => {
              if (res.credential) login(res.credential);
            }}
            onError={() => console.log("Login Failed")}
          />
        </form>

        <div className="text-center mt-8">
          <p
            className="text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            New here?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="cursor-pointer font-medium hover:opacity-80 transition-colors"
              style={{ color: 'var(--color-text-primary)' }}
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