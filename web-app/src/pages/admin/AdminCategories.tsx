import { useState } from "react";
import { Plus, Layers, CheckCircle, Clock } from "lucide-react";
import { toast } from "react-toastify";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { TableRowSkeleton } from "../../components/ui/Skeleton";

import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../../hooks/useCategory";

import CategoryModal from "../../components/categories/CategoryModal";
import { CategoryPayload } from "../../api/category";
import CategoryDataGrid from "../../components/categories/CategoryDataGrid";

export default function AdminCategories() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useCategories(page, pageSize);
  const { data: allCategoriesData } = useCategories(1, 200);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const rawCategories = data?.data ?? [];
    const categories = rawCategories
      .map((c: any) => ({
        ...c,
        images: c.image_url ? [c.image_url] : [],
      }))
      .sort((a: any, b: any) => {
        const aOrder = a.sort_order ?? 0;
        const bOrder = b.sort_order ?? 0;
        return aOrder - bOrder;
      });
  const meta = data?.meta;
  const activeCategoryCount =
    allCategoriesData?.data?.filter((category) => category.is_active).length ?? 0;
  const inactiveCategoryCount =
    allCategoriesData?.data?.filter((category) => !category.is_active).length ?? 0;

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<any>(null);

  const handleCreate = async (payload: CategoryPayload) => {
    try {
      await createMutation.mutateAsync(payload);
      toast.success("Category created");
      setIsCreateOpen(false);
    } catch (err: any) {
        const message = err?.message || "Validation failed";
        message.split(",").forEach((msg: string) => {
          toast.error(msg.trim());
        });
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
      setIsViewOpen(false); 
      setSelectedCategory(null);
    } catch (err: any) {
        const message = err?.message || "Validation failed";
        message.split(",").forEach((msg: string) => {
          toast.error(msg.trim());
        });
      }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    try {
      await deleteMutation.mutateAsync(selectedCategory.id);
      toast.success("Category deleted");
      setIsDeleteOpen(false);
      setSelectedCategory(null);
    } catch (error: any) {
        const message =
          error?.message ||
          error?.error?.error ||
          error?.error?.message ||
          "Failed to delete category";

        toast.error(message);
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
          <h1 className="text-3xl font-display font-bold text-neutral-900 tracking-tight">Categories</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage product categories and hierarchy
          </p>
        </div>

        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-5 h-5" />
          Add Category
        </Button>
      </div>

      {meta && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="group relative bg-white rounded-2xl p-6 border border-neutral-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-400 opacity-80`} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500 mb-1">Total Categories</p>
                <p className="text-3xl font-display font-bold text-neutral-900 tracking-tight">
                  {meta.total_count}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 transition-transform duration-300 group-hover:scale-110">
                <Layers className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl p-6 border border-neutral-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-80`} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500 mb-1">Active Categories</p>
                <p className="text-3xl font-display font-bold text-neutral-900 tracking-tight">
                  {activeCategoryCount}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 transition-transform duration-300 group-hover:scale-110">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl p-6 border border-neutral-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neutral-500 to-neutral-400 opacity-80`} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500 mb-1">Inactive Categories</p>
                <p className="text-3xl font-display font-bold text-neutral-900 tracking-tight">
                  {inactiveCategoryCount}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-neutral-100 transition-transform duration-300 group-hover:scale-110">
                <Clock className="w-6 h-6 text-neutral-600" />
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
                {[...Array(5)].map((_, i) => (
                  <TableRowSkeleton key={i} cols={5} />
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
              setSelectedCategory({
                ...cat,
                images: cat.image_url ? [cat.image_url] : [],
                sort_order: cat.sort_order ?? 0,
              });
              setIsEditOpen(true);
            }}
            onDelete={(cat) => {
              setSelectedCategory(cat);
              setIsDeleteOpen(true);
            }}
            onView={(cat) => {
              setSelectedCategory({
                ...cat,
                images: cat.image_url ? [cat.image_url] : [],
                sort_order: cat.sort_order ?? 0,
              });
              setIsViewOpen(true);
            }}
          />
        )}
      </Card>

      <CategoryModal
        category={{
          name: "",
          slug: "",
          is_active: true,
          sort_order: 0,
          parent_id: null,
          images: [],
        }}
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleCreate}
        categories={categories}
        initialMode="edit"
      />

      <CategoryModal
        category={selectedCategory}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleUpdate}
        categories={categories}
        initialMode="edit"
      />

      <CategoryModal
        category={selectedCategory}
        isOpen={isViewOpen}
        onClose={() => {
          setIsViewOpen(false);
          setSelectedCategory(null);
        }}
        onSave={handleUpdate}
        categories={categories}
        initialMode="view"
      />

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