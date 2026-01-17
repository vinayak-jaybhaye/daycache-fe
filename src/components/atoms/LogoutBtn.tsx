import { api } from "@/services/apiClient";
import useAuthStore from "@/store/auth.store";

export default function LogoutBtn() {
  const logoutStore = useAuthStore((s) => s.logout);

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Always clear client state
      logoutStore();
    }
  };

  return (
    <button
      className="w-full py-3.5 rounded-xl font-bold text-white bg-accent-primary hover:bg-accent-strong active:scale-[0.98] transition-all shadow-lg shadow-accent-primary/20 flex items-center justify-center gap-2"
      onClick={logout}
    >
      LOGOUT
    </button>
  );
}

