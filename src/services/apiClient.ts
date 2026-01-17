const API_URL = import.meta.env.VITE_API_URL ?? "";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

interface RequestOptions {
    method?: HttpMethod;
    body?: unknown;
    params?: Record<string, string | number | boolean | undefined>;
    signal?: AbortSignal;
}

// response types
import type { User } from "@/types/user";
import type { Entry } from "@/types/diary.types";

async function request<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const { method = "GET", body, params, signal } = options;

    const url = new URL(`${API_URL}${endpoint}`, window.location.origin);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.set(key, String(value));
            }
        });
    }

    const res = await fetch(url.toString(), {
        method,
        credentials: "include", // cookie-based auth
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
        signal,
    });

    if (!res.ok) {
        let message = "Request failed";
        try {
            const err = await res.json();
            message = err.detail || err.message || message;
        } catch { }
        throw new Error(message);
    }

    // Many endpoints return `null`
    try {
        return (await res.json()) as T;
    } catch {
        return null as T;
    }
}


export const api = {
    auth: {
        signup: (data: {
            email: string;
            password: string;
            otp: string;
        }) =>
            request<null>("/auth/signup", {
                method: "POST",
                body: data,
            }),

        login: (data: { email: string; password: string }) =>
            request<null>("/auth/login", {
                method: "POST",
                body: data,
            }),

        googleAuth: (google_token: string) =>
            request<null>("/auth/google-auth", {
                method: "POST",
                body: { google_token },
            }),

        logout: () =>
            request<null>("/auth/logout", {
                method: "POST",
            }),

        getOtp: (data: { email: string; password: string, purpose: string }) =>
            request<null>("/auth/get-otp", {
                method: "POST",
                body: data,
            }),

        resetPassword: (data: {
            email: string;
            password: string;
            otp: string;
        }) =>
            request<null>("/auth/reset-password", {
                method: "POST",
                body: data,
            }),
    },
    user: {
        getMe: () =>
            request<User>("/users/me"),

        deleteMe: () =>
            request<null>("/users/me", {
                method: "DELETE",
            }),

        changePassword: (data: {
            old_password: string;
            new_password: string;
        }) =>
            request<null>("/users/me/change-password", {
                method: "POST",
                body: data,
            }),
    },
    entries: {
        create: (data: { content: string; entry_date?: string }) =>
            request<Entry>("/entries/", {
                method: "POST",
                body: data,
            }),

        list: (params?: {
            q?: string;
            start_date?: string;
            end_date?: string;
            limit?: number;
            offset?: number;
        }) =>
            request<Entry[]>("/entries", { params }),

        get: (entryId: number) =>
            request<Entry>(`/entries/${entryId}`),

        update: (entryId: number, content: string) =>
            request<Entry>(`/entries/${entryId}`, {
                method: "PATCH",
                body: { content },
            }),

        delete: (entryId: number) =>
            request<null>(`/entries/${entryId}`, {
                method: "DELETE",
            }),
    },
    days: {
        list: (params?: {
            start_date?: string;
            end_date?: string;
            limit?: number;
            offset?: number;
            include_metadata?: boolean;
        }) =>
            request<any[]>("/days/", {
                params,
            }),

        getEntriesForDay: (date: string) =>
            request<[] | [Entry]>(`/days/${date}`),

        delete: (date: string) =>
            request<null>(`/days/${date}`, {
                method: "DELETE",
                params: { day: date },
            }),

        getMetadata: (date: string) =>
            request<{
                date: string;
                summary: string;
                tags: string[];
                updated_at: string;
            }>(`/days/${date}/metadata`),

        clearMetadata: (date: string) =>
            request<null>(`/days/${date}/metadata`, {
                method: "DELETE",
            }),

        generateSummary: (date: string) =>
            request<{
                date: string;
                summary: string;
                tags: string[];
                updated_at: string;
            }>(`/days/${date}/generate-summary`),

    },
}