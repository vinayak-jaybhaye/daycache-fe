import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user";
import { useDiaryStore } from "@/store/diary.store";


interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  status: "idle" | "authenticated" | "unauthenticated";
  setUser: (user: User) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      status: "idle",

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
          status: "authenticated",
        }),

      logout: () => {
        useDiaryStore.getState().clearAll()
        set({
          user: null,
          isAuthenticated: false,
          status: "unauthenticated",
        })
      }
    }),
    {
      name: "auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        const isAuthenticated = Boolean(state?.isAuthenticated)

        if (!isAuthenticated) {
          useDiaryStore.getState().clearAll()
        }

        useAuthStore.setState({
          status: isAuthenticated ? "authenticated" : "unauthenticated",
        })
      },
    }
  )
);

export default useAuthStore;
