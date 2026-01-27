import { apiService, service } from './apiService';
import { TokenManager } from '../services/TokenManager';
import type { User, AuthResponse } from '../types';

// Auth Service
export const authService = {
    loginUser: async (email: string, password: string): Promise<AuthResponse> => {
        try {
            const response = await service<any>({
                url: '/login',
                method: 'post',
                data: { email_address: email, password },
            });

            if (response.success && response.data?.token) {
                await TokenManager.setToken(response.data.token);

                // Fetch the user profile after login
                const userResult = await authService.getCurrentUser();

                return {
                    success: true,
                    message: 'Login successful',
                    token: response.data.token,
                    user: userResult?.user
                };
            }

            return {
                success: false,
                message: response.data?.error || 'Invalid credentials',
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.error || 'Login failed',
            };
        }
    },

    registerUser: async (userData: {
        name: string;
        email: string;
        password: string;
        phone?: string;
    }): Promise<AuthResponse> => {
        try {
            const response = await service<any>({
                url: '/signup',
                method: 'post',
                data: {
                    user: {
                        email_address: userData.email,
                        password: userData.password,
                        password_confirmation: userData.password,
                        org_id: 1,
                        role: 'customer'
                    }
                },
            });

            if (response.success && response.data?.token) {
                await TokenManager.setToken(response.data.token);

                // Fetch the user profile after signup
                const userResult = await authService.getCurrentUser();

                return {
                    success: true,
                    message: 'Registration successful',
                    token: response.data.token,
                    user: userResult?.user,
                    role: response.data.role || 'customer'
                };
            }

            return {
                success: false,
                message: response.data?.errors?.join(', ') || 'Registration failed',
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.errors?.join(', ') || 'Registration failed',
            };
        }
    },

    logoutUser: async (): Promise<void> => {
        try {
            await apiService.delete('/logout');
        } catch (error) {
            console.error('Logout request failed:', error);
        } finally {
            await TokenManager.clearToken();
            if (typeof window !== 'undefined') {
                localStorage.removeItem('shophub_current_user');
            }
        }
    },

    getCurrentUser: async (): Promise<{ success: boolean; user?: User } | null> => {
        try {
            // First check if we have cached user
            const cachedUser = localStorage.getItem('shophub_current_user');
            const hasToken = await TokenManager.hasValidToken();

            if (!hasToken) {
                return null;
            }

            const response = await apiService.get('/me');

            if (response.success && response.data?.user) {
                const userData = response.data.user;

                const user: User = {
                    id: userData.id.toString(),
                    name: userData.email_address?.split('@')[0] || 'User',
                    email: userData.email_address,
                    role: userData.role || 'customer',
                    emailVerified: true,
                    createdAt: userData.created_at || new Date().toISOString()
                };

                if (typeof window !== 'undefined') {
                    localStorage.setItem('shophub_current_user', JSON.stringify(user));
                }

                return {
                    success: true,
                    user: user
                };
            }

            // If API fails but we have cached user and valid token, return cached
            if (cachedUser) {
                return {
                    success: true,
                    user: JSON.parse(cachedUser)
                };
            }

            return null;
        } catch (error) {
            console.error('Error fetching current user:', error);

            // Fallback to cached user if available
            const cachedUser = localStorage.getItem('shophub_current_user');
            if (cachedUser) {
                return {
                    success: true,
                    user: JSON.parse(cachedUser)
                };
            }

            return null;
        }
    },

    isAuthenticated: (): boolean => {
        return TokenManager.hasValidToken();
    },

    isAdmin: (user: User | null): boolean => {
        return user?.role === 'admin';
    }
};

export default authService;
