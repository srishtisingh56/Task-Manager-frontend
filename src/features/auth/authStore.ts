import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthResult, User } from "./types";
import queryClient from "@/lib/queryClient";
import { parseUtc } from "@/lib/dates";

interface AuthState{
    token: string | null,
    expiresAtUtc: string | null,
    user: User | null,
    setSession: (result:AuthResult) => void
    logout:()=>void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      expiresAtUtc: null,
      user: null,
      setSession: (r) => set({ token: r.token, expiresAtUtc: r.expiresAtUtc, user: r.user }),
      logout: () => {
        set({ token: null, expiresAtUtc: null, user: null })
        queryClient.clear() // never leak one user's cached data to the next login
      },
    }),
    {
      name: 'taskmanager-auth', // localStorage key
      partialize: (s) => ({ token: s.token, expiresAtUtc: s.expiresAtUtc, user: s.user }),
    },
  ),
)
// !! -  converts type to boolean
export function isSessionValid(s: Pick<AuthState, 'token' | 'expiresAtUtc'>): boolean {
  return !!s.token && !!s.expiresAtUtc && parseUtc(s.expiresAtUtc).getTime() > Date.now()
}

