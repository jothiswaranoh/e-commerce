import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, AuthResponse } from '../types';
import authService from '../api/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (identifier: string, password: string) => Promise<AuthResponse>;
  register: (userData: { name: string; email: string; password: string; phone?: string }) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* -----------------------------
   THEME HELPERS
------------------------------ */

function darken(r: number, g: number, b: number, percent: number): number[] {
  return [
    Math.max(0, r - Math.round(255 * percent / 100)),
    Math.max(0, g - Math.round(255 * percent / 100)),
    Math.max(0, b - Math.round(255 * percent / 100)),
  ];
}

function lighten(r: number, g: number, b: number, percent: number): number[] {
  return [
    Math.min(255, r + Math.round(255 * percent / 100)),
    Math.min(255, g + Math.round(255 * percent / 100)),
    Math.min(255, b + Math.round(255 * percent / 100)),
  ];
}

const applyTheme = (org: any) => {
  if (!org?.primary_color) return;

  const hex = org.primary_color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  const toRgb = ([rv, gv, bv]: number[]) => `${rv} ${gv} ${bv}`;
  const root = document.documentElement;

  root.style.setProperty("--color-primary-50", toRgb(lighten(r, g, b, 45)));
  root.style.setProperty("--color-primary-100", toRgb(lighten(r, g, b, 38)));
  root.style.setProperty("--color-primary-200", toRgb(lighten(r, g, b, 28)));
  root.style.setProperty("--color-primary-300", toRgb(lighten(r, g, b, 18)));
  root.style.setProperty("--color-primary-400", toRgb(lighten(r, g, b, 10)));
  root.style.setProperty("--color-primary-500", toRgb(lighten(r, g, b, 5)));
  root.style.setProperty("--color-primary-600", `${r} ${g} ${b}`);
  root.style.setProperty("--color-primary-700", toRgb(darken(r, g, b, 10)));
  root.style.setProperty("--color-primary-800", toRgb(darken(r, g, b, 20)));
  root.style.setProperty("--color-primary-900", toRgb(darken(r, g, b, 30)));

  if (org.store_name) document.title = org.store_name;
};

const resetTheme = () => {
  const root = document.documentElement;

  root.style.removeProperty("--color-primary-50");
  root.style.removeProperty("--color-primary-100");
  root.style.removeProperty("--color-primary-200");
  root.style.removeProperty("--color-primary-300");
  root.style.removeProperty("--color-primary-400");
  root.style.removeProperty("--color-primary-500");
  root.style.removeProperty("--color-primary-600");
  root.style.removeProperty("--color-primary-700");
  root.style.removeProperty("--color-primary-800");
  root.style.removeProperty("--color-primary-900");

  document.title = "ShopHub";
};

/* -----------------------------
   AUTH PROVIDER
------------------------------ */

export function AuthProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session once on mount
  useEffect(() => {

    const loadUser = async () => {
      try {
        const result = await authService.getCurrentUser();

        if (result?.user) {
          setUser(result.user);

          if (result.user.organization) {
            applyTheme(result.user.organization);
          }

        } else {
          setUser(null);
          resetTheme();
        }

      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    // Handle forced logout (e.g. API 401)
    const handleAuthLogout = () => {
      setUser(null);
      resetTheme();
    };

    window.addEventListener("auth-logout", handleAuthLogout);

    return () => {
      window.removeEventListener("auth-logout", handleAuthLogout);
    };

  }, []);

  const login = async (identifier: string, password: string): Promise<AuthResponse> => {

    setIsLoading(true);

    try {
      const response = await authService.loginUser(identifier, password);

      if (response.success && response.user) {
        setUser(response.user);

        if (response.user.organization) {
          applyTheme(response.user.organization);
        }
      }

      return response;

    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    userData: { name: string; email: string; password: string; phone?: string }
  ): Promise<AuthResponse> => {

    setIsLoading(true);

    try {
      const response = await authService.registerUser(userData);

      if (response.success && response.user) {
        setUser(response.user);

        if (response.user.organization) {
          applyTheme(response.user.organization);
        }
      }

      return response;

    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {

    setIsLoading(true);

    try {
      await authService.logoutUser();
      setUser(null);
      resetTheme();
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (updatedUser: User) => {

    setUser(updatedUser);

    if (updatedUser.organization) {
      applyTheme(updatedUser.organization);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: authService.isAdmin(user),
        isLoading,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}