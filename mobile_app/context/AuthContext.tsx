import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, AuthResponse, User } from '@/lib/api';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (payload: { name: string; email: string }) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

async function persistUser(user: User | null) {
  if (user) {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    return;
  }

  await AsyncStorage.removeItem(USER_KEY);
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const refreshUser = async () => {
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
      await persistUser(currentUser);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load account';
      setError(message);
      throw err;
    }
  };

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
      const storedUser = await AsyncStorage.getItem(USER_KEY);

      if (storedToken) {
        setToken(storedToken);

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        try {
          const currentUser = await authApi.getCurrentUser();
          setUser(currentUser);
          await persistUser(currentUser);
        } catch {
          await AsyncStorage.removeItem(TOKEN_KEY);
          await AsyncStorage.removeItem(USER_KEY);
          setToken(null);
          setUser(null);
        }
      }
    } catch (err) {
      console.error('Failed to load auth data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const storeAuthenticatedUser = async (response: AuthResponse, fallbackEmail: string) => {
    if (!response.success || !response.token) {
      throw new Error(response.error || 'Authentication failed');
    }

    await AsyncStorage.setItem(TOKEN_KEY, response.token);
    setToken(response.token);

    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
      await persistUser(currentUser);
    } catch {
      const fallbackUser: User = {
        id: '',
        email: response.email || fallbackEmail,
        name: response.email?.split('@')[0] || '',
        role: response.role,
      };

      setUser(fallbackUser);
      await persistUser(fallbackUser);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await authApi.login(email, password);
      await storeAuthenticatedUser(response, email);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await authApi.signup(name, email, password);
      await storeAuthenticatedUser(response, email);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (payload: { name: string; email: string }) => {
    if (!user?.id) {
      throw new Error('No authenticated user found.');
    }

    try {
      setError(null);
      const updatedUser = await authApi.updateUser(user.id, payload);
      setUser(updatedUser);
      await persistUser(updatedUser);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Profile update failed';
      setError(message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authApi.logout(token);
      }
    } catch (err) {
      console.error('Logout API call failed:', err);
    } finally {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      setToken(null);
      setUser(null);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    signup,
    logout,
    refreshUser,
    updateProfile,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
