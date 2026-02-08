import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  CheckCircle2,
  AlertCircle,
  Package,
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../config/routes.constants';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { toast } from 'react-toastify';
import { validatePassword } from '../utils/validators';
import PasswordStrengthIndicator from '../components/auth/PasswordStrengthIndicator';
import authService from '../api/authService';

type Tab = 'profile' | 'security' | 'orders';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTab = (searchParams.get('tab') as Tab) || 'profile';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  if (!user) return null;

  const [profileData, setProfileData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authService.updateUserProfile(profileData);
      if (response.success && response.user) {
        updateUser(response.user);
        toast.success('Profile updated');
      } else {
        toast.error(response.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!validatePassword(passwordData.newPassword)) {
      toast.error('Weak password');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.changeUserPassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      if (res.success) {
        toast.success('Password updated');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(res.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-64 space-y-2">
          {(['profile', 'security', 'orders'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                activeTab === tab
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {tab === 'profile' && <User className="w-5 h-5" />}
              {tab === 'security' && <Shield className="w-5 h-5" />}
              {tab === 'orders' && <Package className="w-5 h-5" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <Card variant="elevated" padding="lg">
              <h3 className="text-lg font-bold mb-6">Profile</h3>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <Input
                  label="Name"
                  value={profileData.name}
                  onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                />
                <Input label="Email" value={profileData.email} disabled />
                <Button type="submit" isLoading={isLoading}>
                  Save Changes
                </Button>
              </form>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card variant="elevated" padding="lg">
              <h3 className="text-lg font-bold mb-6">Security</h3>
              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                <Input
                  type="password"
                  label="Current Password"
                  value={passwordData.currentPassword}
                  onChange={e =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                />
                <Input
                  type="password"
                  label="New Password"
                  value={passwordData.newPassword}
                  onChange={e =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                />
                <PasswordStrengthIndicator password={passwordData.newPassword} />
                <Input
                  type="password"
                  label="Confirm Password"
                  value={passwordData.confirmPassword}
                  onChange={e =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                />
                <Button type="submit" isLoading={isLoading}>
                  Update Password
                </Button>
              </form>
            </Card>
          )}

          {activeTab === 'orders' && (
            <Card variant="elevated" padding="lg">
              <h3 className="text-lg font-bold mb-6">Orders</h3>
              <div className="text-center py-12 text-neutral-500">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No orders yet</p>
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