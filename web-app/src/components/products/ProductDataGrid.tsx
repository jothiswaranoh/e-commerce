import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Edit, Trash2, Package, Image as ImageIcon } from "lucide-react";

type Product = {
    id: number;
    name: string;
    slug: string;
    description?: string;
    status: string;
    category?: {
        id: number;
        name: string;
    };
    variants?: Array<{
        id: number;
        sku: string;
        price: number;
        stock: number;
    }>;
    images?: string[];
    created_at: string;
};

type Props = {
    rows: Product[];
    page: number;
    pageSize: number;
    rowCount: number;
    loading: boolean;
    autoHeight?: boolean;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
    onView: (product: Product) => void;
};

export default function ProductDataGrid({
    rows,
    page,
    pageSize,
    rowCount,
    loading,
    autoHeight,
    onPageChange,
    onPageSizeChange,
    onEdit,
    onDelete,
    onView,

}: Props) {
    const columns: GridColDef[] = [
        {
            field: "product",
            headerName: "Product",
            flex: 1,
            minWidth: 300,
            renderCell: (params) => {
                const product = params.row;
                const primaryImage = product.images?.[0];

                return (
                    <div className="flex items-center gap-3" onClick={() => onView(product)}>
                        <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden shadow-sm border border-neutral-200">
                            {primaryImage ? (
                                <img
                                    src={primaryImage}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <ImageIcon className="w-6 h-6 text-neutral-400" />
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-neutral-900 truncate">
                                {product.name}
                            </p>
                            <p className="text-xs text-neutral-500 truncate">
                                {product.images?.length || 0} image{product.images?.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                );
            },
        },
        {
            field: "category",
            headerName: "Category",
            width: 150,
            renderCell: (params) => (
                <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-700">
                        {params.row.category?.name || "N/A"}
                    </span>
                </div>
            ),
        },
        {
            field: "price",
            headerName: "Price",
            width: 120,
            renderCell: (params) => {
                const variant = params.row.variants?.[0];
                const price = variant?.price;
                return (
                    <span className="font-semibold text-neutral-900">
                        {price !== undefined && price !== null ? `₹${Number(price).toFixed(2)}` : "N/A"}
                    </span>
                );
            },
        },
        {
            field: "stock",
            headerName: "Stock",
            width: 140,
            renderCell: (params) => {
                const variant = params.row.variants?.[0];
                const stock = variant?.stock ?? 0;

                let badgeClass = "";
                let badgeText = "";

                if (stock <= 0) {
                    badgeClass = "bg-red-100 text-red-700 border-red-200";
                    badgeText = "Out of Stock";
                } else if (stock < 20) {
                    badgeClass = "bg-amber-100 text-amber-700 border-amber-200";
                    badgeText = `Low (${stock})`;
                } else {
                    badgeClass = "bg-green-100 text-green-700 border-green-200";
                    badgeText = `In Stock (${stock})`;
                }

                return (
                    <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeClass}`}
                    >
                        {badgeText}
                    </span>
                );
            },
        },
        {
            field: "status",
            headerName: "Status",
            width: 120,
            renderCell: (params) => {
                const isActive = params.value === "active";

                return (
                    <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${isActive
                            ? "bg-blue-100 text-blue-700 border-blue-200"
                            : "bg-neutral-100 text-neutral-600 border-neutral-200"
                            }`}
                    >
                        {isActive ? "Active" : "Inactive"}
                    </span>
                );
            },
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
                        title="Edit product"
                    >
                        <Edit className="w-4 h-4 text-primary-600 group-hover:text-primary-700" />
                    </button>
                    <button
                        onClick={() => onDelete(params.row)}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group"
                        title="Delete product"
                    >
                        <Trash2 className="w-4 h-4 text-red-600 group-hover:text-red-700" />
                    </button>
                </div>
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
