import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { TableRowSkeleton } from "../../components/ui/Skeleton";

import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../../hooks/useCategory";

import CategoryForm from "../../components/categories/CategoryForm";
import { Category, CategoryPayload } from "../../api/category";
import CategoryDataGrid from "../../components/categories/CategoryDataGrid";

export default function AdminCategories() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useCategories(page, pageSize);

  const categories = data?.data ?? [];
  const meta = data?.meta;

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);

  const handleCreate = async (payload: CategoryPayload) => {
    try {
      await createMutation.mutateAsync(payload);
      toast.success("Category created");
      setIsCreateOpen(false);
    } catch {
      toast.error("Failed to create category");
    }
  };

  const handleUpdate = async (payload: Partial<CategoryPayload>) => {
    if (!selectedCategory) return;

    try {
      await updateMutation.mutateAsync({
        id: selectedCategory.id,
        payload,
      });
      toast.success("Category updated");
      setIsEditOpen(false);
      setSelectedCategory(null);
    } catch {
      toast.error("Failed to update category");
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    try {
      await deleteMutation.mutateAsync(selectedCategory.id);
      toast.success("Category deleted");
      setIsDeleteOpen(false);
      setSelectedCategory(null);
    } catch {
      toast.error("Failed to delete category");
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when page size changes
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-neutral-900">Categories</h1>
          <p className="text-sm text-neutral-500">
            Manage product categories and hierarchy
          </p>
        </div>

        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-5 h-5" />
          Add Category
        </Button>
      </div>

      {meta && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Categories</p>
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
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Active Categories</p>
                <p className="text-2xl font-bold text-green-700 mt-1">
                  {categories.filter((c) => c.is_active).length}
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
        </div>
      )}

      <Card padding="none">
        {isLoading ? (
          <div className="p-6">
            <table className="w-full">
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <TableRowSkeleton key={i} columns={5} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <CategoryDataGrid
            rows={categories}
            page={page}
            pageSize={pageSize}
            rowCount={meta?.total_count ?? 0}
            loading={isLoading}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            onEdit={(cat) => {
              setSelectedCategory(cat);
              setIsEditOpen(true);
            }}
            onDelete={(cat) => {
              setSelectedCategory(cat);
              setIsDeleteOpen(true);
            }}
          />
        )}
      </Card>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add Category"
      >
        <CategoryForm
          submitText="Create"
          isLoading={createMutation.isPending}
          onSubmit={handleCreate}
        />
      </Modal>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Category"
      >
        {selectedCategory && (
          <CategoryForm
            initialData={selectedCategory}
            submitText="Update"
            isLoading={updateMutation.isPending}
            onSubmit={handleUpdate}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Delete "${selectedCategory?.name}"?`}
        confirmText="Delete"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}