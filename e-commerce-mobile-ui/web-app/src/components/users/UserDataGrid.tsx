import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Edit, Trash2, Mail, Shield } from "lucide-react";
import { Box } from "@mui/material";

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
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
};

export default function UserDataGrid({
    rows,
    page,
    pageSize,
    rowCount,
    loading,
    onPageChange,
    onPageSizeChange,
    onEdit,
    onDelete,
}: Props) {
    const columns: GridColDef[] = [
        {
            field: "name",
            headerName: "User",
            flex: 1,
            minWidth: 250,
            renderCell: (params) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                        {params.value?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                        <p className="font-semibold text-neutral-900">{params.value}</p>
                        <p className="text-sm text-neutral-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {params.row.email_address}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            field: "role",
            headerName: "Role",
            width: 140,
            renderCell: (params) => {
                const role = params.value;
                const isAdmin = role === "admin";
                const isManager = role === "manager";

                return (
                    <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${isAdmin
                                ? "bg-primary-100 text-primary-700 border border-primary-200"
                                : isManager
                                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                                    : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                            }`}
                    >
                        {isAdmin && <Shield className="w-3 h-3" />}
                        {role?.charAt(0)?.toUpperCase() + role?.slice(1) || "N/A"}
                    </span>
                );
            },
        },
        {
            field: "created_at",
            headerName: "Joined",
            width: 150,
            renderCell: (params) => (
                <span className="text-neutral-600">
                    {params.value
                        ? new Date(params.value).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })
                        : "N/A"}
                </span>
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(params.row)}
                        className="p-1.5 hover:bg-primary-50 rounded-lg transition-colors group"
                        title="Edit user"
                    >
                        <Edit className="w-4 h-4 text-primary-600 group-hover:text-primary-700" />
                    </button>
                    <button
                        onClick={() => onDelete(params.row)}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete user"
                        disabled={params.row.role === "admin"}
                    >
                        <Trash2
                            className={`w-4 h-4 ${params.row.role === "admin"
                                    ? "text-neutral-300"
                                    : "text-red-600 group-hover:text-red-700"
                                }`}
                        />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div style={{ height: 600, width: "100%" }}>
            <DataGrid
                rows={rows}
                columns={columns}
                getRowId={(row) => row.id}
                loading={loading}
                paginationMode="server"
                paginationModel={{
                    page: page - 1,
                    pageSize: pageSize,
                }}
                rowCount={rowCount}
                onPaginationModelChange={(model) => {
                    if (model.pageSize !== pageSize) {
                        onPageSizeChange(model.pageSize);
                        onPageChange(1); // Reset to first page when page size changes
                    } else if (model.page + 1 !== page) {
                        onPageChange(model.page + 1);
                    }
                }}
                pageSizeOptions={[5, 10, 20, 50]}
                disableRowSelectionOnClick
                sx={{
                    border: "none",
                    "& .MuiDataGrid-cell": {
                        borderBottom: "1px solid #f3f4f6",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#f9fafb",
                        borderBottom: "2px solid #e5e7eb",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        color: "#374151",
                    },
                    "& .MuiDataGrid-row:hover": {
                        backgroundColor: "#f9fafb",
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "2px solid #e5e7eb",
                        backgroundColor: "#fafafa",
                    },
                }}
            />
        </div>
    );
}
