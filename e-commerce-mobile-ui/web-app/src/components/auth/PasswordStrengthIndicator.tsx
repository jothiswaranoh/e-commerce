import { getPasswordStrength } from '../../utils/validators';

interface PasswordStrengthIndicatorProps {
    password: string;
    showRequirements?: boolean;
}

export default function PasswordStrengthIndicator({
    password,
    showRequirements = true
}: PasswordStrengthIndicatorProps) {
    const strength = getPasswordStrength(password);

    if (!password) return null;

    return (
        <div className="space-y-2">
            {/* Strength Bar */}
            <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-600">Password Strength</span>
                    <span className="font-semibold" style={{ color: strength.color }}>
                        {strength.label}
                    </span>
                </div>
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                        className="h-full transition-all duration-300 rounded-full"
                        style={{
                            width: `${(strength.score / 4) * 100}%`,
                            backgroundColor: strength.color,
                        }}
                    />
                </div>
            </div>

            {/* Requirements Checklist */}
            {showRequirements && (
                <div className="space-y-1 text-xs">
                    <RequirementItem
                        met={strength.requirements.minLength}
                        text="At least 8 characters"
                    />
                    <RequirementItem
                        met={strength.requirements.hasUppercase}
                        text="One uppercase letter"
                    />
                    <RequirementItem
                        met={strength.requirements.hasLowercase}
                        text="One lowercase letter"
                    />
                    <RequirementItem
                        met={strength.requirements.hasNumber}
                        text="One number"
                    />
                    <RequirementItem
                        met={strength.requirements.hasSpecial}
                        text="One special character (!@#$%^&*)"
                    />
                </div>
            )}
        </div>
    );
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
    return (
        <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${met ? 'bg-green-100' : 'bg-neutral-100'
                }`}>
                {met && (
                    <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>
            <span className={met ? 'text-neutral-700' : 'text-neutral-500'}>{text}</span>
        </div>
    );
}
