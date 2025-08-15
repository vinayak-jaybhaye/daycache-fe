import { useState, useEffect, useCallback } from "react";
import { googleLogout } from "@react-oauth/google";

interface Session {
    email: string;
    name: string;
    picture?: string;
}

export function useAuth() {
    const [session, setSession] = useState<Session | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Load session from localStorage when app starts
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            setToken(storedToken);
            setSession(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Handle login success from Google
    const login = useCallback(async (googleToken: string) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: googleToken }),
                credentials: "include"
            });

            if (!res.ok) throw new Error("Login failed");

            const data = await res.json();
            console.log(data)

            // Save your app's token + user info
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));

            setToken(data.access_token);
            setSession(data.user);
        } catch (err) {
            console.error("Login error:", err);
        }
    }, []);

    const logout = useCallback(() => {
        googleLogout(); // clears Google session
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setSession(null);
        setToken(null);
    }, []);

    return { session, token, login, logout, loading, isAuthenticated: !!session };
}
