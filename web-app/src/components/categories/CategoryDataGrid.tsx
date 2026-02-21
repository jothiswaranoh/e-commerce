import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Edit, Trash2 } from "lucide-react";
import { Box } from "@mui/material";

type Category = {
    id: number;
    name: string;
    slug: string;
    image_url?: string | null;
    is_active: boolean;
    parent_id: number | null;
};

type Props = {
    rows: Category[];
    page: number;
    pageSize: number;
    rowCount: number;
    loading: boolean;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    onEdit: (cat: Category) => void;
    onDelete: (cat: Category) => void;
    onView: (cat: Category) => void;
};

export default function CategoryDataGrid({
    rows,
    page,
    pageSize,
    rowCount,
    loading,
    onPageChange,
    onPageSizeChange,
    onEdit,
    onDelete,
    onView, 
}: Props) {
    const columns: GridColDef[] = [
        {
            field: "image_url",
            headerName: "Image",
            width: 100,
            sortable: false,
            renderCell: (params) =>
                params.value ? (
                    <img
                        src={params.value}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover shadow-sm"
                    />
                ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-lg text-xs flex items-center justify-center text-neutral-500 font-medium">
                        No Img
                    </div>
                ),
        },
        {
            field: "name",
            headerName: "Name",
            flex: 1,
            minWidth: 200,
            renderCell: (params) => {
                const category = params.row;

                return (
                    <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => onView(category)}
                    >
                        <div className="min-w-0">
                            <p className="font-semibold text-neutral-900 truncate">
                                {category.name || "Untitled"}
                            </p>
                        </div>
                    </div>
                );
            },
        },
        {
            field: "slug",
            headerName: "Slug",
            flex: 1,
            minWidth: 180,
            renderCell: (params) => (
                <span className="text-neutral-600 font-mono text-sm">
                    {params.value}
                </span>
            ),
        },
        {
            field: "is_active",
            headerName: "Status",
            width: 130,
            renderCell: (params) => (
                <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${params.value
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                        }`}
                >
                    {params.value ? "Active" : "Inactive"}
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
                        title="Edit category"
                    >
                        <Edit className="w-4 h-4 text-primary-600 group-hover:text-primary-700" />
                    </button>
                    <button
                        onClick={() => onDelete(params.row)}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group"
                        title="Delete category"
                    >
                        <Trash2 className="w-4 h-4 text-red-600 group-hover:text-red-700" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div style={{ width: "100%" }}>
            <DataGrid
                autoHeight
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
                    border: 'none',
                    '& .MuiDataGrid-cell': {
                        borderBottom: '1px solid #f3f4f6',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#f9fafb',
                        borderBottom: '2px solid #e5e7eb',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        color: '#374151',
                    },
                    '& .MuiDataGrid-row:hover': {
                        backgroundColor: '#f9fafb',
                    },
                    '& .MuiDataGrid-footerContainer': {
                        borderTop: '2px solid #e5e7eb',
                        backgroundColor: '#fafafa',
                    },
                }}
            />
        </div>
    );
}
