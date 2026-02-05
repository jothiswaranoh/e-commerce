import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'react-toastify';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { TableRowSkeleton } from '../../components/ui/Skeleton';
import { CategoryPayload, Category } from '../../api/category';

import {
    useCategories,
    useCreateCategory,
    useUpdateCategory,
    useDeleteCategory,
} from '../../hooks/useCategory';

import CategoryForm from '../../components/categories/CategoryForm';
import CategoryTable from '../../components/categories/CategoryTable';

/* =========================
   Helpers
========================= */

function extractErrorMessage(error: unknown, fallback: string) {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return fallback;
}

export default function AdminCategories() {
    const { data = [], isLoading } = useCategories();

    const createMutation = useCreateCategory();
    const updateMutation = useUpdateCategory();
    const deleteMutation = useDeleteCategory();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    /* =========================
       Handlers
    ========================= */

    const handleCreate = async (payload: CategoryPayload) => {
        try {
            await createMutation.mutateAsync(payload);
            toast.success('Category created');
            setIsCreateOpen(false);
        } catch (error) {
            toast.error(
                extractErrorMessage(error, 'Failed to create category')
            );
        }
    };

    const handleUpdate = async (payload: Partial<CategoryPayload>) => {
        if (!selectedCategory) return;

        try {
            await updateMutation.mutateAsync({
                id: selectedCategory.id,
                payload,
            });
            toast.success('Category updated');
            setIsEditOpen(false);
            setSelectedCategory(null);
        } catch (error) {
            toast.error(
                extractErrorMessage(error, 'Failed to update category')
            );
        }
    };

    const handleDelete = async () => {
        if (!selectedCategory) return;

        try {
            await deleteMutation.mutateAsync(selectedCategory.id);
            toast.success('Category deleted');
            setIsDeleteOpen(false);
            setSelectedCategory(null);
        } catch (error) {
            toast.error(
                extractErrorMessage(error, 'Failed to delete category')
            );
        }
    };

    /* =========================
       Render
    ========================= */

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">
                        Categories
                    </h1>
                    <p className="text-neutral-600">
                        Manage product categories
                    </p>
                </div>

                <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="w-5 h-5" />
                    Add Category
                </Button>
            </div>

            {/* Table */}
            <Card variant="elevated" padding="none">
                {isLoading ? (
                    <table className="w-full">
                        <tbody className="divide-y">
                            {[...Array(5)].map((_, i) => (
                                <TableRowSkeleton key={i} columns={4} />
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <CategoryTable
                        categories={Array.isArray(data) ? data : []}
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

            {/* Create Modal */}
            <Modal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title="Add Category"
            >
                <CategoryForm
                    onSubmit={handleCreate}
                    submitText="Create"
                    isLoading={createMutation.isPending}
                />
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title="Edit Category"
            >
                {selectedCategory && (
                    <CategoryForm
                        initialData={selectedCategory}
                        onSubmit={handleUpdate}
                        submitText="Update"
                        isLoading={updateMutation.isPending}
                    />
                )}
            </Modal>

            {/* Delete Confirm */}
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