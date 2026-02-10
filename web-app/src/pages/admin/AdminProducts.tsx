import { useState } from "react";
import { Package } from "lucide-react";
import { toast } from "react-toastify";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { TableRowSkeleton } from "../../components/ui/Skeleton";

import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../../hooks/useProduct";

import { useCategories } from "../../hooks/useCategory";

import ProductForm from "../../components/products/ProductForm";
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
    } catch {
      toast.error("Failed to create product");
    }
  };

  const handleUpdate = async (payload: any) => {
    const productId = payload.id || viewProduct?.id;
    if (!productId) return;

    try {
      await updateMutation.mutateAsync({
        id: productId,
        data: payload,
      });
      toast.success("Product updated");
      setIsViewOpen(false);
      setViewProduct(null);
    } catch {
      toast.error("Failed to update product");
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
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  // Calculate statistics
  const activeProducts = products.filter((p: any) => p?.status === "active").length;
  const lowStockProducts = products.filter((p: any) => {
    const stock = p?.variants?.[0]?.stock;
    return stock !== undefined && stock !== null && stock < 20 && stock > 0;
  }).length;
  const outOfStockProducts = products.filter((p: any) => {
    const stock = p?.variants?.[0]?.stock;
    return stock === 0 || stock === undefined || stock === null;
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Products</h1>
          <p className="text-neutral-600 mt-1">
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
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Products</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {meta.total_count}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Active</p>
                <p className="text-2xl font-bold text-green-700 mt-1">
                  {activeProducts}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Low Stock</p>
                <p className="text-2xl font-bold text-amber-700 mt-1">
                  {lowStockProducts}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-700 mt-1">
                  {outOfStockProducts}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Card padding="none">
        {isLoading ? (
          <div className="p-6">
            <table className="w-full">
              <tbody>
                {[...Array(pageSize)].map((_, i) => (
                  <TableRowSkeleton key={i} columns={5} />
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

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add New Product"
      >
        <ProductForm
          categories={categories}
          submitText="Create Product"
          isLoading={createMutation.isPending}
          onSubmit={handleCreate}
        />
      </Modal>


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