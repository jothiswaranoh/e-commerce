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
import CategoryTable from "../../components/categories/CategoryTable";
import { Category, CategoryPayload } from "../../api/category";

export default function AdminCategories() {
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const { data, isLoading } = useCategories(page, PER_PAGE);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-neutral-600">Manage product categories</p>
        </div>

        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-5 h-5" />
          Add Category
        </Button>
      </div>

      <Card padding="none">
        {isLoading ? (
          <table className="w-full">
            <tbody>
              {[...Array(5)].map((_, i) => (
                <TableRowSkeleton key={i} columns={5} />
              ))}
            </tbody>
          </table>
        ) : (
          <CategoryTable
            categories={categories}
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

      {meta && meta.total_pages > 1 && (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>

          <span className="px-3 py-2 text-sm">
            Page {meta.current_page} of {meta.total_pages}
          </span>

          <Button
            variant="outline"
            disabled={page === meta.total_pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

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