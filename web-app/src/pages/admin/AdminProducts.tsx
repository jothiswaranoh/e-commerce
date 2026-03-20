import { useState } from "react";
import { AlertTriangle, CheckCircle2, Package, Sparkles, Boxes } from "lucide-react";
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
    <div className="space-y-8">
      <div className="admin-hero-panel p-6 md:p-8">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="admin-kicker">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Catalog Control
            </span>
            <h1 className="admin-title mt-4 text-4xl font-semibold text-neutral-900 md:text-5xl">Products</h1>
            <p className="admin-copy mt-3 text-base md:text-lg">
              Manage your product catalog with the same premium control surface as the dashboard.
            </p>
          </div>

          <Button onClick={() => setIsCreateOpen(true)} className="self-start lg:self-auto">
            <Package className="w-5 h-5" />
            Add Product
          </Button>
        </div>
      </div>

      {meta && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="rounded-[28px] border border-white/80 bg-white/80 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Total Products</p>
                <p className="mt-2 text-3xl font-bold text-neutral-900">
                  {meta.total_count}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-600">
                <Boxes className="h-6 w-6" />
              </div>
            </div>
          </Card>

          <Card className="rounded-[28px] border border-white/80 bg-white/80 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Active</p>
                <p className="mt-2 text-3xl font-bold text-green-700">
                  {activeProducts}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
          </Card>

          <Card className="rounded-[28px] border border-white/80 bg-white/80 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Low Stock</p>
                <p className="mt-2 text-3xl font-bold text-amber-700">
                  {lowStockProducts}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
          </Card>

          <Card className="rounded-[28px] border border-white/80 bg-white/80 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Out of Stock</p>
                <p className="mt-2 text-3xl font-bold text-red-700">
                  {outOfStockProducts}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                <Package className="h-6 w-6" />
              </div>
            </div>
          </Card>
        </div>
      )}

      <Card padding="none" className="rounded-[30px] border border-white/80 bg-white/78 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
        {isLoading ? (
          <div className="p-6">
            <table className="w-full">
              <tbody>
                {[...Array(pageSize)].map((_, i) => (
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