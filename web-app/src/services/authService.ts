export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    role: 'customer' | 'admin';
    emailVerified: boolean;
    createdAt: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user?: User;
    token?: string;
}

// Simulated user database (in real app, this would be backend)
const USERS_KEY = 'shophub_users';
const CURRENT_USER_KEY = 'shophub_current_user';
const AUTH_TOKEN_KEY = 'shophub_auth_token';

// Helper to get all users
const getUsers = (): User[] => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
};

// Helper to save users
const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Generate simple token
const generateToken = (): string => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Simulate API delay
const delay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// Login user
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
    await delay();

    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        return {
            success: false,
            message: 'Invalid email or password',
        };
    }

    // In real app, verify password hash
    // For simulation, we'll just check if user exists

    const token = generateToken();
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_TOKEN_KEY, token);

    return {
        success: true,
        message: 'Login successful',
        user,
        token,
    };
};

// Register new user
export const registerUser = async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
}): Promise<AuthResponse> => {
    await delay();

    const users = getUsers();

    // Check if email already exists
    if (users.some(u => u.email === userData.email)) {
        return {
            success: false,
            message: 'Email already registered',
        };
    }

    const newUser: User = {
        id: generateToken(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: 'customer',
        emailVerified: false,
        createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    // Auto-login after registration
    const token = generateToken();
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    localStorage.setItem(AUTH_TOKEN_KEY, token);

    return {
        success: true,
        message: 'Registration successful',
        user: newUser,
        token,
    };
};

// Logout user
export const logoutUser = async (): Promise<void> => {
    await delay(500);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
};

// Get current logged-in user
export const getCurrentUser = (): User | null => {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
};

// Send password reset email (simulated)
export const sendPasswordResetEmail = async (email: string): Promise<AuthResponse> => {
    await delay();

    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        // For security, don't reveal if email exists
        return {
            success: true,
            message: 'If an account exists with this email, you will receive a password reset link.',
        };
    }

    // In real app, send email with reset token
    const resetToken = generateToken();
    console.log(`Password reset token for ${email}: ${resetToken}`);
    console.log(`Reset link: /reset-password/${resetToken}`);

    return {
        success: true,
        message: 'Password reset link sent to your email',
    };
};

// Reset password with token
export const resetPasswordWithToken = async (token: string, newPassword: string): Promise<AuthResponse> => {
    await delay();

    // In real app, verify token from database
    // For simulation, we'll accept any token

    return {
        success: true,
        message: 'Password reset successful',
    };
};

// Verify email with token
export const verifyEmailToken = async (token: string): Promise<AuthResponse> => {
    await delay();

    const currentUser = getCurrentUser();
    if (!currentUser) {
        return {
            success: false,
            message: 'User not found',
        };
    }

    // Update user's email verification status
    const users = getUsers();
    const updatedUsers = users.map(u =>
        u.id === currentUser.id ? { ...u, emailVerified: true } : u
    );
    saveUsers(updatedUsers);

    const updatedUser = { ...currentUser, emailVerified: true };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

    return {
        success: true,
        message: 'Email verified successfully',
        user: updatedUser,
    };
};

// Update user profile
export const updateUserProfile = async (userData: Partial<User>): Promise<AuthResponse> => {
    await delay();

    const currentUser = getCurrentUser();
    if (!currentUser) {
        return {
            success: false,
            message: 'User not authenticated',
        };
    }

    const users = getUsers();
    const updatedUser = { ...currentUser, ...userData, id: currentUser.id };
    const updatedUsers = users.map(u =>
        u.id === currentUser.id ? updatedUser : u
    );

    saveUsers(updatedUsers);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

    return {
        success: true,
        message: 'Profile updated successfully',
        user: updatedUser,
    };
};

// Change password
export const changeUserPassword = async (oldPassword: string, newPassword: string): Promise<AuthResponse> => {
    await delay();

    // In real app, verify old password
    // For simulation, we'll just accept it

    return {
        success: true,
        message: 'Password changed successfully',
    };
};

// Resend verification email
export const resendVerificationEmail = async (): Promise<AuthResponse> => {
    await delay();

    const currentUser = getCurrentUser();
    if (!currentUser) {
        return {
            success: false,
            message: 'User not authenticated',
        };
    }

    const verificationToken = generateToken();
    console.log(`Verification token for ${currentUser.email}: ${verificationToken}`);
    console.log(`Verification link: /verify-email/${verificationToken}`);

    return {
        success: true,
        message: 'Verification email sent',
    };
};
