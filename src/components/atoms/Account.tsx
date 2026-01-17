import { useState } from "react";
import { api } from "@/services/apiClient";
import useAuthStore from "@/store/auth.store";
import LogoutBtn from "./LogoutBtn";
import { User as UserIcon, Mail, Calendar, Shield, Trash2, Loader2, AlertTriangle } from "lucide-react";

export default function Account() {
    const user = useAuthStore((s) => s.user);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        if (!oldPassword || !newPassword) {
            setMessage({ type: 'error', text: 'Please fill in all fields' });
            setIsLoading(false);
            return;
        }

        try {
            await api.user.changePassword({ old_password: oldPassword, new_password: newPassword });
            setMessage({ type: 'success', text: 'Password updated successfully' });
            setOldPassword('');
            setNewPassword('');
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to update password' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            return;
        }

        setIsLoading(true);
        try {
            await api.user.deleteMe();
            useAuthStore.getState().logout();
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to delete account' });
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="space-y-6">

            {/* Profile Card */}
            <div className="bg-surface-raised border border-border-subtle rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-16 w-16 rounded-full bg-accent-soft flex items-center justify-center text-accent-strong">
                        <UserIcon size={32} />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-text-primary">
                            {user.email.split('@')[0]}
                        </h2>
                        <div className="flex items-center gap-2 text-text-secondary text-sm mt-1">
                            <Mail size={14} />
                            <span>{user.email}</span>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-border-subtle grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-text-secondary">
                        <Calendar size={18} className="text-text-muted" />
                        <div>
                            <p className="text-xs text-text-muted uppercase font-medium">Member Since</p>
                            <p className="text-sm font-medium text-text-primary">
                                {new Date(user.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Section */}
            <div className="bg-surface-raised border border-border-subtle rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <Shield className="text-accent-primary" size={24} />
                    <h3 className="text-lg font-semibold text-text-primary">Security</h3>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-text-secondary">Current Password</label>
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-bg-subtle border border-border-subtle text-text-primary focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-text-secondary">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-bg-subtle border border-border-subtle text-text-primary focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {message && (
                        <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${message.type === 'success'
                            ? 'bg-success/10 text-success border border-success/20'
                            : 'bg-destructive/10 text-destructive-foreground border border-destructive/20'
                            }`}>
                            {message.type === 'error' && <AlertTriangle size={16} />}
                            {message.text}
                        </div>
                    )}

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={isLoading || !oldPassword || !newPassword}
                            className="px-6 py-2.5 rounded-xl bg-accent-primary text-white font-medium hover:bg-accent-strong disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-accent-primary/20 flex items-center gap-2 cursor-pointer"
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
                            Update Password
                        </button>
                    </div>
                </form>
            </div>

            {/* Danger Zone */}
            <div className="border border-destructive/20 bg-destructive/5 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-error mb-2">Danger Zone</h3>
                <p className="text-sm text-text-secondary mb-6">
                    Permanently delete your account and all of your content. This action cannot be undone.
                </p>
                <div className="flex justify-between items-center">
                    <button
                        onClick={handleDeleteAccount}
                        disabled={isLoading}
                        className="px-4 py-2.5 rounded-xl border border-destructive/30 text-xs font-bold text-error hover:bg-destructive/10 transition-colors flex items-center gap-2 cursor-pointer"
                        style={{ borderColor: 'var(--bg-destructive)' }}
                    >
                        <Trash2 size={16} />
                        DELETE ACCOUNT
                    </button>
                </div>
            </div>

            <div className="pt-4 border-t border-border-subtle">
                <LogoutBtn />
            </div>
        </div>
    );
}