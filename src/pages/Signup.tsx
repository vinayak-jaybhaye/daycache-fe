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
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Sparkles,
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
      }, 4000);
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
          credentials: 'include'
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
          credentials: 'include'
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

  const getNotificationIcon = () => {
    switch (messageType) {
      case "success":
        return <CheckCircle className="h-5 w-5" />;
      case "error":
        return <XCircle className="h-5 w-5" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <main
      className="flex items-center justify-center min-h-screen p-4 relative overflow-hidden"
      style={{
        backgroundColor: "var(--color-bg-primary)",
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-10 left-10 w-32 h-32 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: "var(--color-primary)" }}
        />
        <div
          className="absolute bottom-10 right-10 w-40 h-40 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: "var(--color-accent)" }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full blur-2xl opacity-10"
          style={{ backgroundColor: "var(--color-success)" }}
        />
      </div>

      {/* Enhanced Notification Toast */}
      {showNotification && messageType && (
        <div
          className="fixed top-6 right-6 p-4 rounded-xl shadow-lg animate-slideIn z-50 border backdrop-blur-sm min-w-[300px]"
          style={{
            backgroundColor: messageType === "success"
              ? "var(--color-success-50)"
              : messageType === "error"
                ? "var(--color-error-50)"
                : "var(--color-warning-50)",
            borderColor: messageType === "success"
              ? "var(--color-success-200)"
              : messageType === "error"
                ? "var(--color-error-200)"
                : "var(--color-warning-200)",
            color: messageType === "success"
              ? "var(--color-success-700)"
              : messageType === "error"
                ? "var(--color-error-700)"
                : "var(--color-warning-700)",
            boxShadow: "var(--shadow-xl)",
          }}
        >
          <div className="flex items-center gap-3">
            {getNotificationIcon()}
            <span className="font-medium">{message}</span>
          </div>
        </div>
      )}

      {/* Main Signup Card */}
      <div
        className="w-full max-w-md rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] relative overflow-hidden"
        style={{
          backgroundColor: "var(--color-surface-primary)",
          borderColor: "var(--color-border-primary)",
          boxShadow: "var(--shadow-2xl)",
        }}
      >
        {/* Gradient overlay */}
        <div
          className="absolute top-0 left-0 right-0 h-2 rounded-t-2xl"
          style={{
            background: `linear-gradient(90deg, var(--color-primary), var(--color-accent))`,
          }}
        />

        <div className="p-8">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center p-4 rounded-2xl mb-6 relative group"
              style={{
                backgroundColor: "var(--color-primary-100)",
                color: "var(--color-primary-600)",
              }}
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: "var(--color-primary-200)" }} />
              <div className="relative flex items-center gap-3">
                <Shield className="h-8 w-8" />
                <h1 className="text-3xl font-bold font-serif">DayCache</h1>
              </div>
            </div>

            <h2
              className="text-2xl font-serif font-bold mb-2"
              style={{ color: "var(--color-text-primary)" }}
            >
              Create Your Account
            </h2>
            <div className="flex items-center justify-center gap-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              <Sparkles className="h-4 w-4" />
              <span>Start your journey of self-reflection today!</span>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div className="relative group">
              <input
                name="name"
                placeholder="John Doe"
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl outline-none transition-all duration-200 peer"
                style={{
                  backgroundColor: "var(--color-surface-secondary)",
                  borderColor: "var(--color-border-primary)",
                  color: "var(--color-text-primary)",
                  border: "2px solid var(--color-border-primary)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--color-primary)";
                  e.target.style.boxShadow = "0 0 0 3px var(--color-primary-100)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--color-border-primary)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <div
                className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                <User className="h-5 w-5" />
              </div>
            </div>

            {/* Email Input */}
            <div className="relative group">
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl outline-none transition-all duration-200"
                style={{
                  backgroundColor: "var(--color-surface-secondary)",
                  borderColor: isEmailValid && email ? "var(--color-success)" : "var(--color-border-primary)",
                  color: "var(--color-text-primary)",
                  border: `2px solid ${isEmailValid && email ? "var(--color-success)" : "var(--color-border-primary)"}`,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--color-primary)";
                  e.target.style.boxShadow = "0 0 0 3px var(--color-primary-100)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isEmailValid && email ? "var(--color-success)" : "var(--color-border-primary)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <div
                className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                <Mail className="h-5 w-5" />
              </div>
              {isEmailValid && email && (
                <div
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--color-success)" }}
                >
                  <CheckCircle className="h-5 w-5" />
                </div>
              )}
            </div>

            {/* Password Input */}
            <div className="relative group">
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl outline-none transition-all duration-200"
                style={{
                  backgroundColor: "var(--color-surface-secondary)",
                  borderColor: "var(--color-border-primary)",
                  color: "var(--color-text-primary)",
                  border: "2px solid var(--color-border-primary)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--color-primary)";
                  e.target.style.boxShadow = "0 0 0 3px var(--color-primary-100)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--color-border-primary)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <div
                className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                <Lock className="h-5 w-5" />
              </div>
            </div>

            {/* OTP Input (animated entry) */}
            {otpSent && (
              <div className="relative group animate-slideDown">
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-xl outline-none transition-all duration-200 text-center text-lg font-mono tracking-widest"
                  style={{
                    backgroundColor: "var(--color-surface-secondary)",
                    borderColor: isOtpValid ? "var(--color-success)" : "var(--color-border-primary)",
                    color: "var(--color-text-primary)",
                    border: `2px solid ${isOtpValid ? "var(--color-success)" : "var(--color-border-primary)"}`,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--color-primary)";
                    e.target.style.boxShadow = "0 0 0 3px var(--color-primary-100)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = isOtpValid ? "var(--color-success)" : "var(--color-border-primary)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <div
                  className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  <MessageSquare className="h-5 w-5" />
                </div>
                {isOtpValid && (
                  <div
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--color-success)" }}
                  >
                    <CheckCircle className="h-5 w-5" />
                  </div>
                )}
              </div>
            )}

            {/* Send OTP Button */}
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading || !isEmailValid}
              className="w-full py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 relative overflow-hidden group"
              style={{
                backgroundColor: loading || !isEmailValid
                  ? "var(--color-surface-tertiary)"
                  : "var(--color-primary)",
                color: loading || !isEmailValid
                  ? "var(--color-text-tertiary)"
                  : "var(--color-text-inverse)",
                boxShadow: loading || !isEmailValid
                  ? "var(--shadow-sm)"
                  : "var(--shadow-lg)",
                cursor: loading || !isEmailValid ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!loading && isEmailValid) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-xl)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && isEmailValid) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                }
              }}
            >
              {!loading && !isEmailValid && (
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ backgroundColor: "var(--color-primary-100)" }}
                />
              )}
              <div className="relative z-10 flex items-center gap-3">
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
                    Send Verification Code
                  </>
                )}
              </div>
            </button>

            {/* Sign Up Button */}
            {otpSent && (
              <button
                type="submit"
                disabled={!isOtpValid || loading}
                className="w-full py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 animate-slideDown relative overflow-hidden group"
                style={{
                  backgroundColor: !isOtpValid || loading
                    ? "var(--color-surface-tertiary)"
                    : "var(--color-success)",
                  color: !isOtpValid || loading
                    ? "var(--color-text-tertiary)"
                    : "var(--color-text-inverse)",
                  boxShadow: !isOtpValid || loading
                    ? "var(--shadow-sm)"
                    : "var(--shadow-lg)",
                  cursor: !isOtpValid || loading ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (isOtpValid && !loading) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "var(--shadow-xl)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (isOtpValid && !loading) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                  }
                }}
              >
                <div className="relative z-10 flex items-center gap-3">
                  {loading ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5" />
                      Create Account
                    </>
                  )}
                </div>
              </button>
            )}
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-semibold transition-colors duration-200 hover:underline"
                style={{ color: "var(--color-primary)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-primary-700)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--color-primary)";
                }}
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>

    </main>
  );
};

export default SignUp;