import { API_BASE_URL } from './constants';

//APi responses
export interface AuthResponse {
  success: boolean;
  token?: string;
  email?: string;
  role?: string;
  message?: string;
  error?: string;
  errors?: string[];
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

//helper function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const data = await response.json() as T;

  if (!response.ok) {
    const errorData = data as AuthResponse;
    throw new Error(errorData.error || errorData.errors?.join(', ') || 'Request failed');
  }

  return data;
}

//auth API
export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({
        email_address: email,
        password: password,
      }),
    });
  },

  signup: async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/signup', {
      method: 'POST',
      body: JSON.stringify({
        user: {
          name: name,
          email_address: email,
          password: password,
          password_confirmation: password,
        },
      }),
    });
  },

  logout: async (token: string): Promise<void> => {
    await apiRequest('/logout', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

