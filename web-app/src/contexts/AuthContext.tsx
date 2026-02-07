import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';
import authService from '../api/authService';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    register: (userData: { name: string; email: string; password: string; phone?: string }) => Promise<{ success: boolean; message: string }>;
    logout: () => Promise<void>;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const loadUser = async () => {
            const result = await authService.getCurrentUser();
            if (result?.user) {
                setUser(result.user);
            }
            setIsLoading(false);
        };
        loadUser();

        // Listen for force logout events (e.g. 401 from API)
        const handleAuthLogout = () => {
            setUser(null);
            // Optionally clear any other local state if needed
        };
        
        window.addEventListener('auth-logout', handleAuthLogout);
        
        return () => {
            window.removeEventListener('auth-logout', handleAuthLogout);
        };
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await authService.loginUser(email, password);
            if (response.success && response.user) {
                setUser(response.user);
            }
            return { success: response.success, message: response.message };
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (userData: { name: string; email: string; password: string; phone?: string }) => {
        setIsLoading(true);
        try {
            const response = await authService.registerUser(userData);
            if (response.success && response.user) {
                setUser(response.user);
            }
            return { success: response.success, message: response.message };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await authService.logoutUser();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: authService.isAuthenticated(),
                isAdmin: authService.isAdmin(user),
                isLoading,
                login,
                register,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
