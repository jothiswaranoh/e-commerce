import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Edit, Trash2 } from "lucide-react";


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

type CategoryRow = Category & {
  depth: number;
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

    const showPagination = rowCount > pageSize;

    const buildTree = (categories: Category[]): CategoryRow[] => {
        const childrenMap = new Map<number, Category[]>();
        const roots: Category[] = [];

        categories.forEach(cat => {
            if (cat.parent_id === null) {
            roots.push(cat);
            } else {
            if (!childrenMap.has(cat.parent_id)) childrenMap.set(cat.parent_id, []);
            childrenMap.get(cat.parent_id)!.push(cat);
            }
        });

        const result: CategoryRow[] = [];

        const traverse = (node: Category, depth: number) => {
            result.push({ ...node, depth });

            let children = childrenMap.get(node.id) || [];

            // leaf children first
            children = children.sort((a, b) => {
            const aHasChildren = childrenMap.has(a.id);
            const bHasChildren = childrenMap.has(b.id);
            return Number(aHasChildren) - Number(bHasChildren);
            });

            children.forEach(child => traverse(child, depth + 1));
        };

        roots.forEach(root => traverse(root, 0));

        return result;
        };

    const columns: GridColDef[] = [
        {
            field: "serial",
            headerName: "S.No",
            width: 50,
            align: "center",
            sortable: false,
            renderCell: (params) => {
                const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id);
                return (page - 1) * pageSize + rowIndex + 1;
            },
        },
        {
            field: "image_url",
            headerName: "Image",
            width: 80,
            sortable: false,
            renderCell: (params) => (
                <div className="w-full h-full flex items-center">
                    {params.value ? (
                        <img
                            src={params.value}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover shadow-sm"
                        />
                    ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-lg text-xs flex items-center justify-center text-neutral-500 font-medium">
                            No Img
                        </div>
                    )}
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
                const depth = category.depth;

                return (
                    <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => onView(category)}
                    >
                        <div className="min-w-0">
                            <p
                                className="font-semibold text-neutral-900 truncate"
                                style={{ paddingLeft: depth * 20 }}
                            >
                                {depth > 0 && "↳ "}
                                {category.name || "Untitled"}
                            </p>
                        </div>
                    </div>
                );
            },
        },
        {
            field: "is_active",
            headerName: "Status",
            sortable: false,
            width: 130,
            renderCell: (params) => (
                <div className="w-full h-full flex items-center">
                    <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                            params.value
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                        }`}
                    >
                        {params.value ? "Active" : "Inactive"}
                    </span>
                </div>
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <div className="w-full h-full flex items-center justify-center gap-1">
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

    const orderedRows = buildTree(rows);

    return (
        <div style={{ width: "100%" }}>
            <DataGrid
                autoHeight
                rows={orderedRows}
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
                pagination={showPagination || undefined}
                pageSizeOptions={showPagination ? [5, 10, 20, 50] : []}
                disableRowSelectionOnClick
                getRowHeight={() => 'auto'}
                sx={{
                    border: "none",
                    fontFamily: "inherit",
                    "& .MuiDataGrid-cell": {
                        borderBottom: "1px solid #f1f5f9",
                        paddingTop: "16px",
                        paddingBottom: "16px",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#f8fafc",
                        borderBottom: "1px solid #e2e8f0",
                        borderTop: "none",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        color: "#64748b",
                    },
                    "& .MuiDataGrid-row": {
                        transition: "background-color 0.2s, transform 0.2s",
                    },
                    "& .MuiDataGrid-row:hover": {
                        backgroundColor: "#f8fafc",
                        transform: "scale(1.001)",
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "1px solid #e2e8f0",
                        backgroundColor: "#ffffff",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: "#ffffff",
                    },
                    "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                        outline: "none",
                    },
                    "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within": {
                        outline: "none",
                    },
                }}
            />
        </div>
    );
}
