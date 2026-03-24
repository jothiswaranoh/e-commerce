import { useState } from "react";
import { Package, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { toast } from "react-toastify";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { TableRowSkeleton } from "../../components/ui/Skeleton";

import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../../hooks/useProduct";

import { useCategories } from "../../hooks/useCategory";

import ProductDataGrid from "../../components/products/ProductDataGrid";
import ProductViewModal from "../../components/products/ProductViewModal";

export default function AdminProducts() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /* =========================
     DATA
  ========================= */
  const { data, isLoading } = useProducts(page, pageSize);

  const products = (data as any)?.data ?? [];
  const meta = (data as any)?.meta;

  const { data: categoriesResponse } = useCategories(1, 100);
  const categories = (categoriesResponse as any)?.data ?? [];

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<any>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");

  const handleCreate = async (payload: any) => {
    try {
    await createMutation.mutateAsync(payload);
    toast.success("Product created");
    setIsCreateOpen(false);
  } catch (err: any) {
    const message = err?.message || "Validation failed";
    message.split(",").forEach((msg: string) => {
      toast.error(msg.trim());
    });
  }
};

  const handleUpdate = async (payload: any) => {
    if (!payload?.id) {
      toast.error("Missing product ID");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: payload.id,
        data: payload,
      });

      toast.success("Product updated");
      setIsViewOpen(false);
      setViewProduct(null);
    } catch (err: any) {
        const messages =
          Array.isArray(err?.message)
            ? err.message
            : typeof err?.message === "string"
            ? err.message.split(",")
            : ["Validation failed"];

        messages.forEach((msg: string) => {
          toast.error(msg.trim());
        });
      }
  };

  const handleView = (product: any) => {
    setViewProduct(product);
    setModalMode("view");
    setIsViewOpen(true);
  };

  const handleEdit = (product: any) => {
    setViewProduct(product);
    setModalMode("edit");
    setIsViewOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      await deleteMutation.mutateAsync(selectedProduct.id);

      toast.success("Product deleted");
      setIsDeleteOpen(false);
      setSelectedProduct(null);

    } catch (err: any) {
      const message =
        err?.message ||
        err?.error ||
        err?.response?.data?.message ||
        "Cannot delete product";

      toast.error(message);
    }
};

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category_id: '',
    description: '',
    images: [],
    variants: [
      { sku: '', price: '', stock: '' }
    ],
  });

  // Calculate statistics
const activeProducts = products.filter(
  (p: any) => p?.status === "active"
).length;

const lowStockProducts = products.filter((p: any) => {
  const totalStock =
    p?.variants?.reduce(
      (sum: number, v: any) => sum + (v?.stock ?? 0),
      0
    ) ?? 0;

  return totalStock > 0 && totalStock < 20;
}).length;

const outOfStockProducts = products.filter((p: any) => {
  const variants = p?.variants ?? [];

  if (variants.length === 0) return true;

  return variants.every((v: any) => (v?.stock ?? 0) === 0);
}).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-900 tracking-tight">Products</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage your product catalog
          </p>
        </div>

        <Button onClick={() => setIsCreateOpen(true)}>
          <Package className="w-5 h-5" />
          Add Product
        </Button>
      </div>

      {meta && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="group relative bg-white rounded-2xl p-6 border border-neutral-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-400 opacity-80`} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500 mb-1">Total Products</p>
                <p className="text-3xl font-display font-bold text-neutral-900 tracking-tight">
                  {meta.total_count}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-primary-50 transition-transform duration-300 group-hover:scale-110">
                <Package className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl p-6 border border-neutral-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-80`} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500 mb-1">Active</p>
                <p className="text-3xl font-display font-bold text-neutral-900 tracking-tight">
                  {activeProducts}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 transition-transform duration-300 group-hover:scale-110">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl p-6 border border-neutral-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-400 opacity-80`} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500 mb-1">Low Stock</p>
                <p className="text-3xl font-display font-bold text-neutral-900 tracking-tight">
                  {lowStockProducts}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 transition-transform duration-300 group-hover:scale-110">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl p-6 border border-neutral-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-400 opacity-80`} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500 mb-1">Out of Stock</p>
                <p className="text-3xl font-display font-bold text-neutral-900 tracking-tight">
                  {outOfStockProducts}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-red-50 transition-transform duration-300 group-hover:scale-110">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      <Card padding="none">
        {isLoading ? (
          <div className="p-6">
            <table className="w-full">
              <tbody>
                {[...Array(Number(pageSize) || 5)].map((_, i) => (
                  <TableRowSkeleton key={i} cols={5} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <ProductDataGrid
            autoHeight
            rows={products}
            page={page}
            pageSize={pageSize}
            rowCount={meta?.total_count ?? 0}
            loading={isLoading}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            onEdit={handleEdit}
            onDelete={(product) => {
              setSelectedProduct(product);
              setIsDeleteOpen(true);
            }}
            onView={handleView}
          />
        )}
      </Card>

      <ProductViewModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        product={{
          name: "",
          slug: "",
          description: "",
          status: "active",
          images: [],
          variants: [
            {
              price: "",
              sku: "",
              stock: "",
            }
          ],
        }}
        categories={categories}
        initialMode="edit"
        onSave={handleCreate}
      />


      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Delete "${selectedProduct?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />

      <ProductViewModal
        isOpen={isViewOpen}
        onClose={() => {
          setIsViewOpen(false);
          setViewProduct(null);
        }}
        product={viewProduct}
        categories={categories}
        initialMode={modalMode}
        onSave={handleUpdate}
      />

    </div>
  );
}