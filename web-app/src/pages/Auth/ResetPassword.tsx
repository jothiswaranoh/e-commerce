import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Lock, ArrowLeft, Package, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '../../config/routes.constants';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { toast } from 'react-toastify';
import { validatePassword } from '../../utils/validators';
import PasswordStrengthIndicator from '../../components/auth/PasswordStrengthIndicator';
import authService from '../../api/authService';

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error('Invalid reset token');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (!validatePassword(password)) {
            toast.error('Password does not meet requirements');
            return;
        }

        setIsLoading(true);
        try {
            const response = await authService.resetPasswordWithToken(token, password);
            if (response.success) {
                setIsSuccess(true);
                toast.success('Password reset successfully');
                setTimeout(() => {
                    navigate(ROUTES.LOGIN);
                }, 3000);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">Password Reset!</h2>
                    <p className="text-neutral-600 mb-8">
                        Your password has been successfully reset. You will be redirected to login shortly.
                    </p>
                    <Link to={ROUTES.LOGIN}>
                        <Button fullWidth>
                            Go to Login
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Link to={ROUTES.HOME} className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold gradient-text">ShopHub</span>
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Reset Password</h1>
                        <p className="text-neutral-600">
                            Create a new strong password for your account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <Input
                                type="password"
                                label="New Password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                leftIcon={<Lock className="w-5 h-5" />}
                                required
                            />

                            <PasswordStrengthIndicator password={password} />

                            <Input
                                type="password"
                                label="Confirm Password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                leftIcon={<Lock className="w-5 h-5" />}
                                required
                            />
                        </div>

                        <Button type="submit" fullWidth isLoading={isLoading} size="lg">
                            Reset Password
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            to={ROUTES.LOGIN}
                            className="text-sm font-medium text-neutral-600 hover:text-primary-600 flex items-center justify-center gap-2 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
