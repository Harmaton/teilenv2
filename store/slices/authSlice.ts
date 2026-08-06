import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = "super_admin" | "admin" | "editor" | "viewer";

export interface AuthUser {
  // Core identity
  id: string;
  email: string;

  // Profile
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;

  // Access control
  role: UserRole;

  // Metadata
  created_at: string | null;
  last_sign_in_at: string | null;
  email_confirmed: boolean;

  // Provider info
  provider: "email" | "google" | "github" | string;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isInitialized: false,
  error: null,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Map a raw Supabase User object → AuthUser */
import type { User } from "@supabase/supabase-js";

export function toAuthUser(user: User): AuthUser {
  const meta = user.user_metadata ?? {};
  const appMeta = user.app_metadata ?? {};

  return {
    id: user.id,
    email: user.email ?? "",

    full_name: meta.full_name ?? meta.name ?? null,
    avatar_url: meta.avatar_url ?? meta.picture ?? null,
    phone: user.phone ?? null,

    role: (appMeta.role as UserRole) ?? "viewer",

    created_at: user.created_at ?? null,
    last_sign_in_at: user.last_sign_in_at ?? null,
    email_confirmed: user.email_confirmed_at != null,

    provider: user.app_metadata?.provider ?? "email",
  };
}

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
      state.isLoading = false;
      state.isInitialized = true;
      state.error = null;
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.isLoading = false;
    },

    clearAuth(state) {
      state.user = null;
      state.isLoading = false;
      state.isInitialized = true; // still initialized — just logged out
      state.error = null;
    },

    /** Patch individual fields without a full re-set (e.g. after profile update) */
    patchUser(state, action: PayloadAction<Partial<AuthUser>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setUser, setLoading, setError, clearAuth, patchUser } =
  authSlice.actions;
export default authSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────

import type { RootState } from "@/store";

export const selectUser           = (s: RootState) => s.auth.user;
export const selectIsLoading      = (s: RootState) => s.auth.isLoading;
export const selectIsInitialized  = (s: RootState) => s.auth.isInitialized;
export const selectAuthError      = (s: RootState) => s.auth.error;
export const selectRole           = (s: RootState) => s.auth.user?.role ?? null;
export const selectIsAdmin        = (s: RootState) =>
  s.auth.user?.role === "admin" || s.auth.user?.role === "super_admin";