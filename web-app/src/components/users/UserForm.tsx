import { useState } from "react";
import { z } from "zod";
import { User, UserPayload } from "../../api/users";
import { Mail, ChevronDown, Lock, User as UserIcon, Shield, AlertCircle, Check } from "lucide-react";

const userSchemaBase = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email_address: z.string().email("Invalid email address"),
  role: z.enum(["admin", "manager", "user", "customer"]),
});

const userSchemaNew = userSchemaBase.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const userSchemaEdit = userSchemaBase.extend({
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal('')),
});

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
  [K in keyof FormData]?: string[];
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

  const validate = () => {
    const schema = initialData ? userSchemaEdit : userSchemaNew;
    const result = schema.safeParse(form);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleChange = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: Partial<UserPayload> = {
      name: form.name,
      email_address: form.email_address,
      role: form.role,
    };

    if (form.password) {
      payload.password = form.password;
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <Field label="Full Name" required error={errors.name}>
        <div className="relative">
          <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-accent-500 transition-colors" />
          <input
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g. John Doe"
            className={`${inputClass(!!errors.name)} pl-10`}
          />
        </div>
      </Field>

      {/* Email */}
      <Field label="Email Address" required error={errors.email_address}>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-accent-500 transition-colors" />
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
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-accent-500 transition-colors" />
          <input
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder={initialData ? "New password (optional)" : "••••••••"}
            className={`${inputClass(!!errors.password)} pl-10`}
          />
        </div>
      </Field>

      {/* Role */}
      <Field label="Role" required>
        <div className="relative">
          <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-accent-500 transition-colors" />
          <select
            value={form.role}
            onChange={(e) => handleChange("role", e.target.value as FormData["role"])}
            className={`${inputClass(false)} pl-10 appearance-none pr-10 cursor-pointer`}
          >
            <option value="customer">Customer</option>
            <option value="user">User</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </Field>

      {/* Submit */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 font-bold text-white transition-all duration-300 bg-gradient-to-r from-accent-600 to-pink-600 rounded-xl hover:from-accent-500 hover:to-pink-500 hover:shadow-lg hover:shadow-accent-500/25 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Processing...
            </span>
          ) : (
            <>
              <Check className="w-5 h-5" />
              <span>{submitText}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function Field({ label, children, required, error, hint }: any) {
  const errText = Array.isArray(error) ? error[0] : error;
  return (
    <div className="space-y-1.5 group">
      <label className="flex items-center gap-1 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
        {label}
        {required && <span className="text-accent-500">*</span>}
      </label>
      {children}
      {hint && !errText && <p className="text-xs font-medium text-slate-400">{hint}</p>}
      {errText && (
        <p className="flex items-center gap-1 text-[11px] font-medium text-rose-500 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {errText}
        </p>
      )}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-300 shadow-sm",
    hasError
      ? "border-rose-300 bg-rose-50/50 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
      : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20",
  ].join(" ");
}
