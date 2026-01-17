import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
} from "lucide-react";
import { api } from "../services/apiClient";
import GoogleBtn from "@/components/atoms/GoogleBtn";
import checkLogin from "@/services/checkLogin";

const SignUp = () => {
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const navigate = useNavigate();

  // Basic validation check
  const isEmailValid = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      setLoading(true);
      await api.auth.signup({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        otp: otp,
      });
      checkLogin();
    } catch (error: any) {
      console.error("Signup failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (message: string) => {
    setMessage(message);
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handleSendOtp = async () => {
    showMessage("OTP service is currently not available, Please try again later");
    return;
    if (!email || !isEmailValid) {
      showMessage("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      await api.auth.getOtp({ email, password, purpose: "signup" });

      setOtpSent(true);
      showMessage("OTP sent successfully!");
    } catch (error: any) {
      console.log("Error sending OTP:", error);
      showMessage(error.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-bg-app transition-colors duration-300">
      {/* Main Card Container */}
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-surface-raised rounded-3xl shadow-2xl overflow-hidden border border-border-subtle">

        {/* Left Side - Visual/Hero */}
        <div
          className="relative hidden md:flex flex-col justify-end p-12 text-white overflow-hidden bg-cover bg-center bg-[url('/login_bg.png')]"
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

          {/* Content */}
          <div className="relative z-10">
            <h1 className="text-4xl font-bold font-serif mb-4 leading-tight">
              Start Your Journey
            </h1>
            <p className="text-lg opacity-90 max-w-xs font-light">
              Create an account to begin capturing your daily moments and memories.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-surface-default relative">
          {/* Mobile Header */}
          <div className="md:hidden mb-8 text-center">
            <h1 className="text-3xl font-bold font-serif text-text-primary">DayCache</h1>
            <p className="text-text-muted">Create Account</p>
          </div>

          <div className="space-y-6 max-w-sm mx-auto w-full">
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-2 hidden md:block">Sign Up</h2>
              <p className="text-text-muted text-sm">
                Join our community and start journaling today
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="relative group">
                <input
                  name="email"
                  type="email"
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`peer w-full pl-10 pr-4 py-3 rounded-xl bg-bg-muted border outline-none focus:ring-1 transition-all text-text-primary placeholder-transparent ${isEmailValid && email
                    ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                    : "border-border-subtle focus:border-accent-primary focus:ring-accent-primary"
                    }`}
                />
                <label className="absolute left-10 top-3 text-text-muted text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-accent-primary peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-accent-primary pointer-events-none bg-surface-default px-1">
                  Email Address
                </label>
                <Mail className={`absolute left-3 top-3.5 h-5 w-5 transition-colors ${isEmailValid && email ? "text-green-500" : "text-text-muted peer-focus:text-accent-primary"}`} />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <input
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder=" "
                  required
                  className="peer w-full pl-10 pr-4 py-3 rounded-xl bg-bg-muted border border-border-subtle outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all text-text-primary placeholder-transparent"
                />
                <label className="absolute left-10 top-3 text-text-muted text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-accent-primary peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-accent-primary pointer-events-none bg-surface-default px-1">
                  Password
                </label>
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-text-muted transition-colors peer-focus:text-accent-primary" />
              </div>

              {/* Get OTP button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSendOtp}
                  className="w-fit px-4 py-1 rounded-lg bg-accent-primary text-surface-default hover:bg-accent-soft font-semibold transition-all inline-flex items-center group/btn"
                >
                  GET OTP
                </button>
              </div>
              {message && <p className="text-red-500 mt-2">{message}</p>}

              {/* After OTP is sent -> OTP Input box */}
              <div className={otpSent ? "block" : "hidden"}>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-6 py-2 rounded-lg bg-bg-muted border outline-none focus:ring-1 transition-all text-text-primary placeholder-transparent"
                />
              </div>

              {/* Submit button */}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-2 rounded-lg bg-accent-primary text-surface-default hover:bg-accent-soft font-semibold transition-all group/btn"
              >
                SIGN UP
              </button>
            </form>

            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-border-subtle" />
              <span className="text-xs uppercase text-text-muted">
                Or login with
              </span>
              <div className="flex-1 border-t border-border-subtle" />
            </div>

            <GoogleBtn />

            <div className="pt-4 text-center">
              <p className="flex items-center justify-center gap-2 text-text-secondary text-sm">
                Already have an account?
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm text-accent-primary cursor-pointer font-semibold transition-all inline-flex items-center"
                >
                  SIGN IN
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 bg-bg-subtle pointer-events-none" />
      <div className="fixed -bottom-32 -left-32 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl -z-10" />
      <div className="fixed -top-32 -right-32 w-96 h-96 bg-accent-secondary/5 rounded-full blur-3xl -z-10" />
    </div>
  );
};

export default SignUp;