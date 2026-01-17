import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { api } from "../services/apiClient";
import GoogleBtn from "@/components/atoms/GoogleBtn";
import checkLogin from "@/services/checkLogin";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("dev1@example.com");
  const [password, setPassword] = useState<string>("devpassword");


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // Login ( sets cookiei )
      await api.auth.login({ email, password });

      // update auth store
      checkLogin();

    } catch (err: any) {
      console.error(err.message || "Invalid email or password.");
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
          {/* Dark Overlay for readability */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

          {/* Content */}
          <div className="relative z-10">
            <h1 className="text-4xl font-bold font-serif mb-4 leading-tight">
              Welcome Back!
            </h1>
            <p className="text-lg opacity-90 max-w-xs font-light">
              Your digital sanctuary awaits. Continue writing your story in DayCache.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-surface-default relative">
          {/* Mobile Header (visible only on small screens) */}
          <div className="md:hidden mb-8 text-center">
            <h1 className="text-3xl font-bold font-serif text-text-primary">DayCache</h1>
            <p className="text-text-muted">Welcome back</p>
          </div>

          <div className="space-y-6 max-w-sm mx-auto w-full">
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-2 hidden md:block">Login</h2>
              <p className="text-text-muted text-sm">
                Enter your credentials to access your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="relative group">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=" "
                    className="peer w-full pl-10 pr-4 py-3 rounded-xl bg-bg-muted border border-border-subtle outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all text-text-primary placeholder-transparent"
                  />
                  <label className="absolute left-10 -top-2.5 z-10 text-xs text-text-muted bg-surface-default px-1 transition-all pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-accent-primary">
                    Email Address
                  </label>
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-text-muted transition-colors peer-focus:text-accent-primary" />
                </div>

                <div className="relative group">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=" "
                    className="peer w-full pl-10 pr-4 py-3 rounded-xl bg-bg-muted border border-border-subtle outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all text-text-primary placeholder-transparent"
                  />
                  <label className="absolute left-10 -top-2.5 z-10 text-xs text-text-muted bg-surface-default px-1 transition-all pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-accent-primary">
                    Password
                  </label>
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-text-muted transition-colors peer-focus:text-accent-primary" />
                </div>
              </div>

              <div className="flex items-center justify-end text-sm">
                <button type="button" className="text-accent-primary hover:text-accent-strong font-medium transition-colors cursor-pointer"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-white bg-accent-primary hover:bg-accent-strong active:scale-[0.98] transition-all shadow-lg shadow-accent-primary/20 flex items-center justify-center gap-2 group"
              >
                LOGIN
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

            <div className="pt-4 flex items-center justify-center">
              <p className="flex items-center justify-center gap-2 text-text-secondary text-sm">
                Do not have an account yet?
                <button
                  onClick={() => navigate("/signup")}
                  className="text-sm text-accent-primary cursor-pointer font-semibold transition-all inline-flex items-center"
                >
                  JOIN NOW
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

export default Login;