import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, loginUser, registerUser, logoutUser, getCurrentUser, isAuthenticated } from '../services/authService';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
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
        const currentUser = getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await loginUser(email, password);
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
            const response = await registerUser(userData);
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
            await logoutUser();
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
                isAuthenticated: isAuthenticated(),
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
