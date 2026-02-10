import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Eye, Clock, CheckCircle, Truck, Check, XCircle, CreditCard, User } from "lucide-react";
import { Order } from "../../api/order";

type Props = {
    rows: Order[];
    page: number;
    pageSize: number;
    rowCount: number;
    loading: boolean;
    autoHeight?: boolean;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    onView: (order: Order) => void;
};

export default function OrderDataGrid({
    rows,
    page,
    pageSize,
    rowCount,
    loading,
    autoHeight,
    onPageChange,
    onPageSizeChange,
    onView,
}: Props) {
    const columns: GridColDef[] = [
        {
            field: "order_number",
            headerName: "Order #",
            width: 200,
            renderCell: (params) => (
                <span className="font-mono font-medium text-primary-700">
                    {params.value}
                </span>
            ),
        },
        {
            field: "user",
            headerName: "Customer",
            flex: 1,
            minWidth: 250,
            renderCell: (params) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-500">
                        <User className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-neutral-900 truncate">
                            {params.value?.name ?? "Guest"}
                        </p>
                        <p className="text-xs text-neutral-500 truncate">
                            {params.value?.email_address ?? "No email"}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            field: "created_at",
            headerName: "Date",
            width: 150,
            renderCell: (params) => (
                <span className="text-neutral-600">
                    {params.value ? new Date(params.value).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    }) : "N/A"}
                </span>
            ),
        },
        {
            field: "total",
            headerName: "Total",
            width: 120,
            renderCell: (params) => (
                <span className="font-bold text-neutral-900">
                    ₹{Number(params.value ?? 0).toFixed(2)}
                </span>
            ),
        },
        {
            field: "status",
            headerName: "Status",
            width: 150,
            renderCell: (params) => {
                const status = params.value ?? "pending";
                let badgeClass = "";
                let Icon = Clock;

                switch (status) {
                    case "pending":
                        badgeClass = "bg-amber-100 text-amber-700 border-amber-200";
                        Icon = Clock;
                        break;
                    case "confirmed":
                        badgeClass = "bg-blue-100 text-blue-700 border-blue-200";
                        Icon = CheckCircle;
                        break;
                    case "shipped":
                        badgeClass = "bg-indigo-100 text-indigo-700 border-indigo-200";
                        Icon = Truck;
                        break;
                    case "delivered":
                        badgeClass = "bg-green-100 text-green-700 border-green-200";
                        Icon = Check;
                        break;
                    case "cancelled":
                        badgeClass = "bg-red-100 text-red-700 border-red-200";
                        Icon = XCircle;
                        break;
                    default:
                        badgeClass = "bg-neutral-100 text-neutral-700 border-neutral-200";
                        Icon = Clock;
                }

                return (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeClass}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                );
            },
        },
        {
            field: "payment_status",
            headerName: "Payment",
            width: 120,
            renderCell: (params) => {
                const isPaid = params.value === "paid";
                return (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${isPaid ? "bg-green-100 text-green-700 border-green-200" : "bg-neutral-100 text-neutral-600 border-neutral-200"
                        }`}>
                        <CreditCard className="w-3 h-3" />
                        {isPaid ? "Paid" : "Unpaid"}
                    </span>
                );
            },
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 80,
            sortable: false,
            renderCell: (params) => (
                <button
                    onClick={() => onView(params.row)}
                    className="p-1.5 hover:bg-primary-50 rounded-lg transition-colors group"
                    title="View details"
                >
                    <Eye className="w-5 h-5 text-primary-600 group-hover:text-primary-700" />
                </button>
            ),
        },
    ];

    return (
        <div style={{ height: autoHeight ? "auto" : 600, width: "100%" }}>
            <DataGrid
                autoHeight={autoHeight}
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
                        onPageChange(1);
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
