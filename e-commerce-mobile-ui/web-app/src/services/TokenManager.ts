const AUTH_TOKEN_KEY = 'shophub_auth_token';

export const TokenManager = {
    getAccessToken: async (): Promise<string | null> => {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    },
    setToken: async (token: string): Promise<void> => {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    },
    clearToken: async (): Promise<void> => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
    },
    hasValidToken: (): boolean => {
        return !!localStorage.getItem(AUTH_TOKEN_KEY);
    },
    debugTokenStorage: async (): Promise<void> => {
        console.info('Token from storage:', localStorage.getItem(AUTH_TOKEN_KEY));
    },
};
