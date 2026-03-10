import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { User, UserPayload } from "../../api/users";
import { Mail, ChevronDown, Lock } from "lucide-react";

interface Props {
    initialData?: User;
    onSubmit: (payload: Partial<UserPayload>) => void;
    submitText: string;
    isLoading?: boolean;
}

type FormData = {
    name: string;
    email_address: string;
    password: string;
    role: "admin" | "manager" | "user" | "customer";
};

type FormErrors = {
    [K in keyof FormData]?: string;
};

export default function UserForm({
    initialData,
    onSubmit,
    submitText,
    isLoading = false,
}: Props) {
    const [form, setForm] = useState<FormData>({
        name: initialData?.name || "",
        email_address: initialData?.email_address || "",
        password: "",
        role: initialData?.role || "customer",
    });

    const [errors, setErrors] = useState<FormErrors>({});

    /* ----------------------------------------
       Validation
    ---------------------------------------- */
    const validate = () => {
        const nextErrors: FormErrors = {};

        if (!form.name.trim()) nextErrors.name = "Name is required";
        if (!form.email_address.trim()) nextErrors.email_address = "Email is required";

        // Password is only required for new users
        if (!initialData && !form.password.trim()) {
            nextErrors.password = "Password is required";
        }

        // Password validation if provided
        if (form.password && form.password.length < 6) {
            nextErrors.password = "Password must be at least 6 characters";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    /* ----------------------------------------
       Handlers
    ---------------------------------------- */
    const handleChange = <K extends keyof FormData>(
        key: K,
        value: FormData[K]
    ) => setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const payload: Partial<UserPayload> = {
            name: form.name,
            email_address: form.email_address,
            role: form.role,
        };

        // Only include password if it's provided
        if (form.password) {
            payload.password = form.password;
        }

        onSubmit(payload);
    };

    /* ----------------------------------------
       Render
    ---------------------------------------- */
    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <Field label="Full Name" required error={errors.name}>
                <input
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="e.g. John Doe"
                    className={inputClass(!!errors.name)}
                />
            </Field>

            {/* Email */}
            <Field label="Email Address" required error={errors.email_address}>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="email"
                        value={form.email_address}
                        onChange={(e) => handleChange("email_address", e.target.value)}
                        placeholder="user@example.com"
                        className={`${inputClass(!!errors.email_address)} pl-10`}
                    />
                </div>
            </Field>

            {/* Password */}
            <Field
                label={initialData ? "New Password" : "Password"}
                required={!initialData}
                error={errors.password}
                hint={initialData ? "Leave blank to keep current password" : undefined}
            >
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="password"
                        value={form.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        placeholder={initialData ? "New password (optional)" : "Enter password"}
                        className={`${inputClass(!!errors.password)} pl-10`}
                    />
                </div>
            </Field>

            {/* Role */}
            <Field label="Role" required>
                <div className="relative">
                    <select
                        value={form.role}
                        onChange={(e) =>
                            handleChange("role", e.target.value as FormData["role"])
                        }
                        className={`${inputClass(false)} appearance-none pr-8 cursor-pointer`}
                    >
                        <option value="customer">Customer</option>
                        <option value="user">User</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </Field>

            {/* Submit */}
            <div className="pt-1">
                <Button type="submit" fullWidth isLoading={isLoading}>
                    {submitText}
                </Button>
            </div>
        </form>
    );
}

/* ----------------------------------------
   Field wrapper
---------------------------------------- */
function Field({
    label,
    children,
    required,
    error,
    hint,
}: {
    label: string;
    children: React.ReactNode;
    required?: boolean;
    error?: string;
    hint?: string;
}) {
    return (
        <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                {label}
                {required && <span className="text-indigo-500">*</span>}
            </label>
            {children}
            {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </div>
    );
}

/* ----------------------------------------
   Shared input class
---------------------------------------- */
function inputClass(hasError: boolean) {
    return [
        "w-full h-10 px-3 rounded-xl text-sm text-gray-800 bg-white",
        "border transition-colors outline-none",
        "placeholder:text-gray-300",
        hasError
            ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
    ].join(" ");
}
