import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/store/auth.store";

export default function ProtectedRoute() {
    const { status } = useAuthStore();

    // 1. Still checking auth block routing
    if (status === "idle") {
        return (
            <div className="h-screen flex items-center justify-center">
                Checking session...
            </div>
        );
    }

    // 2. Not logged in redirect
    if (status === "unauthenticated") {
        return <Navigate to="/login" replace />;
    }

    // 3. Authenticated allow route
    return <Outlet />;
}
