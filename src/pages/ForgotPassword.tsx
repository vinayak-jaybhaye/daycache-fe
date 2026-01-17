import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, KeyRound } from "lucide-react";
import { api } from "@/services/apiClient";

const ForgotPassword = () => {
    const [otpSent, setOtpSent] = useState<boolean>(false);
    const [otp, setOtp] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [isError, setIsError] = useState<boolean>(false);

    const navigate = useNavigate();

    // Basic validation check
    const isEmailValid = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email);

    const showMessage = (msg: string, isErr = false) => {
        setMessage(msg);
        setIsError(isErr);
        setTimeout(() => {
            setMessage("");
            setIsError(false);
        }, 3000);
    };

    const handleSendOtp = async () => {
        showMessage("OTP service is currently unavailable. Please try again later.", true);
        return;
        if (!email || !isEmailValid) {
            showMessage("Please enter a valid email address", true);
            return;
        }
        if (!password || password.length < 6) {
            showMessage("Please enter a new password (min 6 chars)", true);
            return;
        }

        try {
            setLoading(true);
            await api.auth.getOtp({ email, password, purpose : "reset_password" });

            setOtpSent(true);
            showMessage("OTP sent successfully to your email!", false);
        } catch (error: any) {
            console.error("Error sending OTP:", error);
            showMessage(error.message || "Failed to send OTP", true);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: FormEvent) => {
        e.preventDefault();
        if (!otp) {
            showMessage("Please enter the OTP", true);
            return;
        }

        try {
            setLoading(true);
            await api.auth.resetPassword({
                email,
                password,
                otp,
            });
            showMessage("Password reset successfully! Redirecting...", false);
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error: any) {
            console.error("Reset failed:", error);
            showMessage(error.message || "Failed to reset password", true);
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
                            Reset Password
                        </h1>
                        <p className="text-lg opacity-90 max-w-xs font-light">
                            Secure your account with a new password.
                        </p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="p-8 md:p-12 flex flex-col justify-center bg-surface-default relative">
                    {/* Mobile Header */}
                    <div className="md:hidden mb-8 text-center">
                        <h1 className="text-3xl font-bold font-serif text-text-primary">DayCache</h1>
                        <p className="text-text-muted">Reset Password</p>
                    </div>

                    <div className="space-y-6 max-w-sm mx-auto w-full">
                        <div>
                            <h2 className="text-2xl font-bold text-text-primary mb-2 hidden md:block">Reset Password</h2>
                            <p className="text-text-muted text-sm">
                                Enter your email and new password to get an OTP
                            </p>
                        </div>

                        <form onSubmit={handleResetPassword} className="space-y-4">
                            {/* Email Input */}
                            <div className="relative group">
                                <input
                                    name="email"
                                    type="email"
                                    placeholder=" "
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    // disabled={otpSent} // Optional: Lock email after OTP sent? Usually better to allow editing in case of typo.
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

                            {/* New Password Input */}
                            <div className="relative group">
                                <input
                                    name="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    placeholder=" "
                                    minLength={6}
                                    value={password}
                                    className="peer w-full pl-10 pr-4 py-3 rounded-xl bg-bg-muted border border-border-subtle outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all text-text-primary placeholder-transparent"
                                />
                                <label className="absolute left-10 top-3 text-text-muted text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-accent-primary peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-accent-primary pointer-events-none bg-surface-default px-1">
                                    New Password
                                </label>
                                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-text-muted transition-colors peer-focus:text-accent-primary" />
                            </div>

                            {/* Get OTP button */}
                            {!otpSent && (
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        disabled={loading || !email || !password}
                                        onClick={handleSendOtp}
                                        className="w-fit px-4 py-1.5 rounded-lg bg-accent-primary text-surface-default hover:bg-accent-soft font-semibold transition-all inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? "Sending..." : "GET OTP"}
                                    </button>
                                </div>
                            )}

                            {message && (
                                <p className={`text-sm mt-2 ${isError ? "text-red-500" : "text-green-500"}`}>
                                    {message}
                                </p>
                            )}

                            {/* After OTP is sent -> OTP Input box */}
                            {otpSent && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            placeholder=" "
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="peer w-full pl-10 pr-4 py-3 rounded-xl bg-bg-muted border border-border-subtle outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all text-text-primary placeholder-transparent"
                                        />
                                        <label className="absolute left-10 top-3 text-text-muted text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-accent-primary peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-accent-primary pointer-events-none bg-surface-default px-1">
                                            Enter OTP
                                        </label>
                                        <KeyRound className="absolute left-3 top-3.5 h-5 w-5 text-text-muted transition-colors peer-focus:text-accent-primary" />
                                    </div>

                                    <div className="flex justify-between items-center text-xs">
                                        <button
                                            type="button"
                                            disabled={loading}
                                            onClick={handleSendOtp}
                                            className="text-accent-primary hover:underline disabled:opacity-50"
                                        >
                                            Resend OTP
                                        </button>
                                    </div>

                                    {/* Submit button */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full px-6 py-2 rounded-lg bg-accent-primary text-surface-default hover:bg-accent-soft font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent-primary/20"
                                    >
                                        {loading ? "Resetting..." : "RESET PASSWORD"}
                                    </button>
                                </div>
                            )}
                        </form>

                        <div className="pt-4 text-center">
                            <p className="flex items-center justify-center gap-2 text-text-secondary text-sm">
                                Remember your password?
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

export default ForgotPassword;