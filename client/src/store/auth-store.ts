import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AuthRole = "CUSTOMER" | "SELLER" | "ADMIN";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
};

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) =>
        set({
          user,
          isAuthenticated: Boolean(user)
        }),
      logout: () => {
        set({
          user: null,
          isAuthenticated: false
        });
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      }
    }),
    {
      name: "jay-malhar-auth",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
