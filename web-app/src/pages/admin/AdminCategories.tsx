import { useState } from "react";
import { CheckCircle2, FolderTree, Plus, Sparkles, XCircle } from "lucide-react";
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
import { Category, CategoryPayload } from "../../api/category";
import CategoryDataGrid from "../../components/categories/CategoryDataGrid";
import { extractApiErrorMessage, extractApiErrorMessages } from "../../utils/apiError";

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
    useState<Category | null>(null);

  const handleCreate = async (payload: CategoryPayload) => {
    try {
      await createMutation.mutateAsync(payload);
      toast.success("Category created");
      setIsCreateOpen(false);
    } catch (err: any) {
      extractApiErrorMessages(err, "We couldn’t save the category. Please try again.")
        .forEach((msg) => toast.error(msg));
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
      extractApiErrorMessages(err, "We couldn’t update the category. Please try again.")
        .forEach((msg) => toast.error(msg));
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
      toast.error(extractApiErrorMessage(error, "We couldn’t delete the category."));
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when page size changes
  };

  return (
    <div className="space-y-8">
      <div className="admin-hero-panel p-6 md:p-8">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="admin-kicker">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Category Management
            </span>
            <h1 className="admin-title mt-4 text-4xl font-semibold text-neutral-900 md:text-5xl">Categories</h1>
            <p className="admin-copy mt-3 text-base md:text-lg">
            Manage product categories and hierarchy
            </p>
          </div>

          <Button onClick={() => setIsCreateOpen(true)} className="self-start lg:self-auto">
            <Plus className="w-5 h-5" />
            Add Category
          </Button>
        </div>
      </div>

      {meta && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="rounded-[28px] border border-white/80 bg-white/80 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Total Categories</p>
                <p className="mt-2 text-3xl font-bold text-neutral-900">
                  {meta.total_count}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-600">
                <FolderTree className="h-6 w-6" />
              </div>
            </div>
          </Card>

          <Card className="rounded-[28px] border border-white/80 bg-white/80 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Active Categories</p>
                <p className="mt-2 text-3xl font-bold text-green-700">
                  {activeCategoryCount}
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
                <p className="text-sm text-neutral-500">Inactive Categories</p>
                <p className="mt-2 text-3xl font-bold text-amber-700">
                  {inactiveCategoryCount}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                <XCircle className="h-6 w-6" />
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