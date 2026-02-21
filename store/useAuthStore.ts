import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/services/auth.service";

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    isAdmin: boolean;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    login: (credentials: any) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (credentials) => {
                set({ isLoading: true, error: null });
                try {
                    const data = await authService.login(credentials);
                    set({
                        user: {
                            _id: data._id,
                            firstName: data.firstName,
                            lastName: data.lastName,
                            email: data.email,
                            isAdmin: data.isAdmin,
                        },
                        token: data.token,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        isLoading: false,
                        error: error.response?.data?.message || "Failed to login"
                    });
                    throw error;
                }
            },

            register: async (userData) => {
                set({ isLoading: true, error: null });
                try {
                    const data = await authService.register(userData);
                    set({
                        user: {
                            _id: data._id,
                            firstName: data.firstName,
                            lastName: data.lastName,
                            email: data.email,
                            isAdmin: data.isAdmin,
                        },
                        token: data.token,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        isLoading: false,
                        error: error.response?.data?.message || "Failed to register"
                    });
                    throw error;
                }
            },

            logout: () => {
                set({ user: null, token: null, isAuthenticated: false });
            },

            clearError: () => set({ error: null })
        }),
        {
            name: "auth-storage", // local storage key
        }
    )
);
