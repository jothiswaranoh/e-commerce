const AUTH_TOKEN_KEY = 'shophub_auth_token';

export const TokenManager = {

    getAccessToken: (): string | null => {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    },

    setToken: (token: string): void => {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    },

    clearToken: (): void => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
    },

    hasValidToken: (): boolean => {
        return !!localStorage.getItem(AUTH_TOKEN_KEY);
    },

    debugTokenStorage: (): void => {
        console.info('Token from storage:', localStorage.getItem(AUTH_TOKEN_KEY));
    },
};