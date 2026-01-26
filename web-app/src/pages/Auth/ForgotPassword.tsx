import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Package } from 'lucide-react';
import { ROUTES } from '../../config/routes.constants';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { toast } from 'react-toastify';
import { authService } from '../../services/authService';
import { validateEmail } from '../../utils/validators';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        try {
            const response = await authService.sendPasswordResetEmail(email);
            if (response.success) {
                setIsSubmitted(true);
                toast.success('Reset link sent to your email');
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">Check your email</h2>
                    <p className="text-neutral-600 mb-8">
                        We've sent a password reset link to <span className="font-medium text-neutral-900">{email}</span>
                    </p>
                    <div className="space-y-4">
                        <Button
                            variant="outline"
                            fullWidth
                            onClick={() => setIsSubmitted(false)}
                        >
                            Resend email
                        </Button>
                        <Link to={ROUTES.LOGIN}>
                            <Button variant="ghost" fullWidth>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Login
                            </Button>
                        </Link>
                    </div>
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
                        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Forgot Password?</h1>
                        <p className="text-neutral-600">
                            Enter your email address and we'll send you instructions to reset your password.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            type="email"
                            label="Email Address"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            leftIcon={<Mail className="w-5 h-5" />}
                            required
                        />

                        <Button type="submit" fullWidth isLoading={isLoading} size="lg">
                            Send Reset Link
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
