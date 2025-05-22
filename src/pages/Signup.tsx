"use client";

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
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      {showNotification && messageType && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg text-white shadow-lg animate-fadeIn ${
            messageType === "success"
              ? "bg-green-500"
              : messageType === "error"
              ? "bg-red-500"
              : "bg-amber-500"
          }`}
        >
          {message}
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-amber-200/50 transform transition-all hover:shadow-3xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-r from-amber-500 to-amber-700 p-4 rounded-2xl mb-4 shadow-lg">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              DayCache
            </h1>
          </div>
          <h2 className="text-2xl font-serif font-semibold text-amber-900 mt-2">
            Create an Account
          </h2>
          <p className="text-amber-700 mt-2 text-sm">
            Start your journey of self-reflection today! ✨
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              name="name"
              placeholder="John Doe"
              required
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 bg-amber-50/50"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600">
              <User className="h-5 w-5" />
            </span>
          </div>

          <div className="relative">
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 bg-amber-50/50"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600">
              <Mail className="h-5 w-5" />
            </span>
          </div>

          <div className="relative">
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 bg-amber-50/50"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600">
              <Lock className="h-5 w-5" />
            </span>
          </div>

          {otpSent && (
            <div className="relative">
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 bg-amber-50/50"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600">
                <MessageSquare className="h-5 w-5" />
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={handleSendOtp}
            disabled={loading || !isEmailValid}
            className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
              loading || !isEmailValid
                ? "bg-amber-300 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800"
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

          <button
            type="submit"
            disabled={!isOtpValid || loading}
            className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
              !isOtpValid || loading
                ? "bg-amber-300 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900"
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
          </button>
        </form>

        <p className="mt-8 text-center text-amber-700 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-amber-600 font-medium hover:text-amber-800 transition-colors"
          >
            Log in here
          </a>
        </p>
      </div>
    </main>
  );
};

export default SignUp;
