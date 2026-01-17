import { api } from "@/services/apiClient";
import useAuthStore from "@/store/auth.store";
import type { User } from "@/types/user";

export default async function bootstrapAuth() {
  try {
    const user = await api.user.getMe();
    useAuthStore.getState().setUser(user as unknown as User);
  } catch {
    useAuthStore.getState().logout();
  }
}
