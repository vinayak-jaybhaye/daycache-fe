import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import {
  Mail,
  Lock,
  User,
  MessageSquare,
  UserPlus,
  RefreshCw,
} from "lucide-react";

type NotificationType = "success" | "error" | "warning";

const SignUp = () => {
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<NotificationType | null>(null);
  const [showNotification, setShowNotification] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isEmailValid = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email);
  const isOtpValid = otp.length === 6;

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
        setMessageType(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const showMessage = (type: NotificationType, message: string) => {
    setMessageType(type);
    setMessage(message);
    setShowNotification(true);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.get("name") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            otp: otp,
          }),
        }
      );

      if (!response.ok) {
        showMessage("error", "Invalid OTP");
        throw new Error("Invalid OTP");
      }

      const { user } = await response.json();
      dispatch(setUser(user));
      navigate("/");
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        showMessage("error", "Failed to send OTP");
        throw new Error("Failed to send OTP");
      }

      setOtpSent(true);
      showMessage("success", "OTP sent successfully!");
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center h-[90vh] theme-bg">
      {/* Notification Toast */}
      {showNotification && messageType && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg animate-fadeIn z-50 theme-border border ${messageType === "success"
            ? "bg-green-500 text-white border-green-600"
            : messageType === "error"
              ? "bg-red-500 text-white border-red-600"
              : "theme-button-primary"
            }`}
        >
          {message}
        </div>
      )}

      {/* Main Signup Card */}
      <div className="theme-card p-8 theme-shadow-hover w-full max-w-md theme-border border transform transition-all hover:theme-shadow">
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="theme-button-primary p-4 rounded-2xl mb-4 theme-shadow">
            <h1 className="text-3xl font-bold flex items-center gap-2 font-serif">
              DayCache
            </h1>
          </div>
          <h2 className="text-2xl font-serif font-semibold theme-text mt-2">
            Create an Account
          </h2>
          <p className="theme-text-muted mt-2 text-sm text-center">
            Start your journey of self-reflection today! ✨
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div className="relative">
            <input
              name="name"
              placeholder="John Doe"
              required
              className="w-full pl-12 pr-4 py-3 rounded-xl theme-input theme-border border outline-none transition-all"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 theme-text-secondary">
              <User className="h-5 w-5" />
            </span>
          </div>

          {/* Email Input */}
          <div className="relative">
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 rounded-xl theme-input theme-border border outline-none transition-all"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 theme-text-secondary">
              <Mail className="h-5 w-5" />
            </span>
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full pl-12 pr-4 py-3 rounded-xl theme-input theme-border border outline-none transition-all"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 theme-text-secondary">
              <Lock className="h-5 w-5" />
            </span>
          </div>

          {/* OTP Input (shown after OTP is sent) */}
          {otpSent && (
            <div className="relative">
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl theme-input theme-border border outline-none transition-all"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 theme-text-secondary">
                <MessageSquare className="h-5 w-5" />
              </span>
            </div>
          )}

          {/* Send OTP Button */}
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={loading || !isEmailValid}
            className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 theme-shadow ${loading || !isEmailValid
              ? "opacity-50 cursor-not-allowed theme-button-secondary"
              : "theme-button-primary hover:opacity-90"
              }`}
          >
            {loading ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                Sending OTP...
              </>
            ) : otpSent ? (
              <>
                <RefreshCw className="h-5 w-5" />
                Resend OTP
              </>
            ) : (
              <>
                <Mail className="h-5 w-5" />
                Send OTP
              </>
            )}
          </button>

          {/* Sign Up Button */}
          {otpSent && <button
            type="submit"
            disabled={!isOtpValid || loading}
            className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 theme-shadow ${!isOtpValid || loading
              ? "opacity-50 cursor-not-allowed theme-button-secondary"
              : "theme-button-primary hover:opacity-90"
              }`}
          >
            {loading ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5" />
                Sign Up Now
              </>
            )}
          </button>}
        </form>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="theme-text-muted text-sm">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="theme-text-secondary font-medium hover:opacity-80 transition-colors cursor-pointer"
            >
              Log in here
            </button>
          </p>
        </div>
      </div>
    </main>
  );
};

export default SignUp;
