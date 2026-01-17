import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/store/auth.store";

export default function PublicOnlyRoute() {
    const { status } = useAuthStore();

    if (status === "authenticated") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
