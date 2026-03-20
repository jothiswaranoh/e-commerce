import { ChevronLeft, ChevronRight, Edit, Mail, Shield, Trash2 } from "lucide-react";

type User = {
    id: number;
    name: string;
    email_address: string;
    role: "admin" | "manager" | "user" | "customer";
    created_at: string;
    updated_at: string;
};

type Props = {
    rows: User[];
    page: number;
    pageSize: number;
    rowCount: number;
    loading: boolean;
    autoHeight?: boolean;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
};

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export default function UserDataGrid({
    rows,
    page,
    pageSize,
    rowCount,
    onPageChange,
    onPageSizeChange,
    onEdit,
    onDelete,
}: Props) {
    const totalPages = Math.max(1, Math.ceil(rowCount / pageSize));

    const getRoleClasses = (role: User["role"]) => {
        if (role === "admin") return "border-primary-200 bg-primary-50 text-primary-700";
        if (role === "manager") return "border-blue-200 bg-blue-50 text-blue-700";
        return "border-neutral-200 bg-neutral-100 text-neutral-600";
    };

    return (
        <div className="space-y-4 p-4 md:p-5">
            <div className="hidden grid-cols-[minmax(0,1.5fr)_220px_180px_120px] gap-4 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400 lg:grid">
                <span>User</span>
                <span>Role</span>
                <span>Joined</span>
                <span className="text-right">Actions</span>
            </div>

            <div className="space-y-3">
                {rows.map((user) => (
                    <div
                        key={user.id}
                        className="grid gap-4 rounded-[26px] border border-white/90 bg-white/88 p-4 shadow-[0_14px_34px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] lg:grid-cols-[minmax(0,1.5fr)_220px_180px_120px] lg:items-center lg:px-5"
                    >
                        <div className="flex min-w-0 items-center gap-4">
                            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br from-primary-600 to-accent-600 text-xl font-bold text-white shadow-[0_12px_28px_rgba(124,58,237,0.22)]">
                                {user.name?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-xl font-semibold text-neutral-900">{user.name}</p>
                                <p className="mt-1 flex items-center gap-2 truncate text-sm text-neutral-500">
                                    <Mail className="h-4 w-4 flex-shrink-0" />
                                    <span className="truncate">{user.email_address}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center lg:justify-start">
                            <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${getRoleClasses(user.role)}`}>
                                {user.role === "admin" && <Shield className="h-4 w-4" />}
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                        </div>

                        <div className="text-sm font-medium text-neutral-600 lg:text-base">
                            {user.created_at
                                ? new Date(user.created_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })
                                : "N/A"}
                        </div>

                        <div className="flex items-center gap-2 lg:justify-end">
                            <button
                                onClick={() => onEdit(user)}
                                className="group rounded-2xl border border-primary-100 bg-primary-50/70 p-3 transition-colors hover:bg-primary-100"
                                title="Edit user"
                            >
                                <Edit className="h-4 w-4 text-primary-600 group-hover:text-primary-700" />
                            </button>
                            <button
                                onClick={() => onDelete(user)}
                                className="group rounded-2xl border border-red-100 bg-red-50/70 p-3 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:border-neutral-100 disabled:bg-neutral-50"
                                title="Delete user"
                                disabled={user.role === "admin"}
                            >
                                <Trash2 className={`h-4 w-4 ${user.role === "admin" ? "text-neutral-300" : "text-red-600 group-hover:text-red-700"}`} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-4 rounded-[24px] border border-white/90 bg-white/78 px-4 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] lg:flex-row lg:items-center lg:justify-between">
                <div className="text-sm text-neutral-500 lg:flex-shrink-0">
                    Showing <span className="font-semibold text-neutral-900">{rows.length}</span> of{" "}
                    <span className="font-semibold text-neutral-900">{rowCount}</span> users
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
                    <label className="flex items-center gap-3 text-sm text-neutral-500">
                        <span className="font-medium">Rows</span>
                        <select
                            value={pageSize}
                            onChange={(e) => onPageSizeChange(Number(e.target.value))}
                            className="h-11 rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-700 outline-none focus:ring-2 focus:ring-primary-200"
                        >
                            {PAGE_SIZE_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="flex items-center gap-3 self-start sm:self-auto">
                        <button
                            onClick={() => onPageChange(page - 1)}
                            disabled={page <= 1}
                            className="flex h-11 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Prev
                        </button>
                        <span className="min-w-[52px] text-center text-sm font-medium text-neutral-600">
                            {page} / {totalPages}
                        </span>
                        <button
                            onClick={() => onPageChange(page + 1)}
                            disabled={page >= totalPages}
                            className="flex h-11 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
