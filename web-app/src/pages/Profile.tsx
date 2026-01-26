import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Shield, CheckCircle2, AlertCircle, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../config/routes.constants';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { toast } from 'react-toastify';
import { validatePassword } from '../utils/validators';
import PasswordStrengthIndicator from '../components/auth/PasswordStrengthIndicator';
import { authService } from '../services/authService';

export default function Profile() {
    const { user, updateUser } = authService;
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'orders'>('profile');
    const [isLoading, setIsLoading] = useState(false);

    // Profile Form State
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
    });

    // Password Form State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await updateUserProfile(profileData);
            if (response.success && response.user) {
                updateUser(response.user);
                toast.success('Profile updated successfully');
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        if (!validatePassword(passwordData.newPassword)) {
            toast.error('New password does not meet requirements');
            return;
        }

        setIsLoading(true);
        try {
            const response = await authService.changeUserPassword(passwordData.currentPassword, passwordData.newPassword);
            if (response.success) {
                toast.success('Password changed successfully');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error('Failed to change password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendVerification = async () => {
        try {
            const response = await authService.resendVerificationEmail();
            if (response.success) {
                toast.success('Verification email sent');
            }
        } catch (error) {
            toast.error('Failed to send verification email');
        }
    };

    if (!user) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-8">My Account</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full lg:w-64 space-y-2">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'profile'
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'text-neutral-600 hover:bg-neutral-50'
                            }`}
                    >
                        <User className="w-5 h-5" />
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'security'
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'text-neutral-600 hover:bg-neutral-50'
                            }`}
                    >
                        <Shield className="w-5 h-5" />
                        Security
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders'
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'text-neutral-600 hover:bg-neutral-50'
                            }`}
                    >
                        <Package className="w-5 h-5" />
                        Orders
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1">
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            {/* Profile Header */}
                            <Card variant="elevated" padding="lg">
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-neutral-900">{user.name}</h2>
                                        <p className="text-neutral-600">{user.email}</p>
                                        <div className="mt-2">
                                            {user.emailVerified ? (
                                                <Badge variant="success">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                    Verified
                                                </Badge>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="warning">
                                                        <AlertCircle className="w-3 h-3 mr-1" />
                                                        Unverified
                                                    </Badge>
                                                    <button
                                                        onClick={handleResendVerification}
                                                        className="text-sm text-primary-600 hover:underline"
                                                    >
                                                        Resend Email
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Edit Profile Form */}
                            <Card variant="elevated" padding="lg">
                                <h3 className="text-lg font-bold text-neutral-900 mb-6">Personal Information</h3>
                                <form onSubmit={handleProfileUpdate} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input
                                            label="Full Name"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            leftIcon={<User className="w-5 h-5" />}
                                        />
                                        <Input
                                            label="Email Address"
                                            value={profileData.email}
                                            disabled
                                            leftIcon={<Mail className="w-5 h-5" />}
                                            helperText="Contact support to change email"
                                        />
                                        <Input
                                            label="Phone Number"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            leftIcon={<Phone className="w-5 h-5" />}
                                        />
                                        <Input
                                            label="Address"
                                            value={profileData.address}
                                            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                            leftIcon={<MapPin className="w-5 h-5" />}
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="submit" isLoading={isLoading}>
                                            Save Changes
                                        </Button>
                                    </div>
                                </form>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <Card variant="elevated" padding="lg">
                            <h3 className="text-lg font-bold text-neutral-900 mb-6">Change Password</h3>
                            <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
                                <Input
                                    type="password"
                                    label="Current Password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    required
                                />

                                <div className="space-y-4">
                                    <Input
                                        type="password"
                                        label="New Password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        required
                                    />
                                    <PasswordStrengthIndicator password={passwordData.newPassword} />
                                </div>

                                <Input
                                    type="password"
                                    label="Confirm New Password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    required
                                />

                                <div className="flex justify-end">
                                    <Button type="submit" isLoading={isLoading}>
                                        Update Password
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    )}

                    {activeTab === 'orders' && (
                        <Card variant="elevated" padding="lg">
                            <h3 className="text-lg font-bold text-neutral-900 mb-6">Order History</h3>
                            <div className="text-center py-12 text-neutral-500">
                                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No orders found</p>
                                <Link to={ROUTES.PRODUCTS}>
                                    <Button variant="outline" className="mt-4">
                                        Start Shopping
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
