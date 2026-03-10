import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Package, ArrowRight } from 'lucide-react';
import { ROUTES } from '../../config/routes.constants';
import Button from '../../components/ui/Button';
import { authService } from '../../api/authService';

export default function EmailVerification() {
    const { token } = useParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Invalid verification token');
                return;
            }

            try {
                const response = await authService.verifyEmailToken(token);
                if (response.success) {
                    setStatus('success');
                } else {
                    setStatus('error');
                    setMessage(response.message);
                }
            } catch (error) {
                setStatus('error');
                setMessage('An error occurred during verification');
            }
        };

        verify();
    }, [token]);

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

                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    {status === 'loading' && (
                        <div className="py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                            <h2 className="text-xl font-semibold text-neutral-900">Verifying your email...</h2>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="py-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Email Verified!</h2>
                            <p className="text-neutral-600 mb-8">
                                Your email address has been successfully verified. You can now access all features.
                            </p>
                            <Link to={ROUTES.HOME}>
                                <Button fullWidth>
                                    Continue Shopping
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="py-4">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <XCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Verification Failed</h2>
                            <p className="text-neutral-600 mb-8">
                                {message || 'We could not verify your email address. The link may be invalid or expired.'}
                            </p>
                            <Link to={ROUTES.HOME}>
                                <Button variant="outline" fullWidth>
                                    Return Home
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
