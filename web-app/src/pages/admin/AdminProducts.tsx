import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

import ProductForm from './ProductForm';

import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '../../hooks/useProduct';

import { useCategories } from '../../hooks/useCategory';
import { Product, ProductFormData } from '../../types';

const PER_PAGE = 10;

export default function AdminProducts() {
  /* =========================
     PAGINATION STATE
  ========================= */
  const [page, setPage] = useState(1);

  /* =========================
     DATA
  ========================= */
  const { data, isLoading } = useProducts(page, PER_PAGE);

  const products = data?.data ?? [];
  const meta = data?.meta;

  const totalPages = meta?.total_pages ?? 1;

  const { data: categoriesResponse } = useCategories();
  const categories = Array.isArray(categoriesResponse)
    ? categoriesResponse
    : categoriesResponse?.data ?? [];

  /* =========================
     MUTATIONS
  ========================= */
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  /* =========================
     UI STATE
  ========================= */
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category_id: '',
    price: '',
    stock: '',
    description: '',
    status: 'active' as const,
  });

  /* =========================
     HELPERS
  ========================= */
  const getStatusBadge = (status: string, stock: number) => {
    if (status === 'archived') return <Badge variant="neutral">Archived</Badge>;
    if (stock === 0) return <Badge variant="error">Out of Stock</Badge>;
    if (stock < 20) return <Badge variant="warning">Low Stock</Badge>;
    return <Badge variant="success">In Stock</Badge>;
  };

  /* =========================
     CREATE
  ========================= */
  const handleAddProduct = async () => {
    try {
      const payload: ProductFormData = {
        name: formData.name,
        slug:
          formData.slug ||
          formData.name.toLowerCase().replace(/\s+/g, '-'),
        category_id: Number(formData.category_id),
        status: formData.status,
        description: formData.description,
        variants_attributes: [
          {
            sku: `${formData.name.slice(0, 3).toUpperCase()}-${Date.now()}`,
            price: Number(formData.price),
            stock: Number(formData.stock),
          },
        ],
      };

      await createMutation.mutateAsync(payload);
      toast.success('Product added');
      setIsAddModalOpen(false);
    } catch {
      toast.error('Failed to add product');
    }
  };

  /* =========================
     EDIT
  ========================= */
  const openEditModal = (product: Product) => {
    const v = product.variants?.[0];

    setSelectedProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      category_id: String(product.category_id),
      price: String(v?.price ?? ''),
      stock: String(v?.stock ?? ''),
      description: product.description || '',
      status: product.status as any,
    });
    setIsEditModalOpen(true);
  };

  const handleEditProduct = async () => {
    if (!selectedProduct) return;

    try {
      await updateMutation.mutateAsync({
        id: selectedProduct.id,
        data: {
          name: formData.name,
          slug: formData.slug,
          category_id: Number(formData.category_id),
          status: formData.status,
          description: formData.description,
          variants_attributes:
            selectedProduct.variants?.map(v => ({
              id: v.id,
              sku: v.sku,
              price: Number(formData.price),
              stock: Number(formData.stock),
            })) ?? [],
        },
      });

      toast.success('Product updated');
      setIsEditModalOpen(false);
    } catch {
      toast.error('Update failed');
    }
  };

  /* =========================
     DELETE
  ========================= */
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      await deleteMutation.mutateAsync(selectedProduct.id);
      toast.success('Product deleted');
      setIsDeleteDialogOpen(false);
    } catch {
      toast.error('Delete failed');
    }
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-5 h-5" />
          Add Product
        </Button>
      </div>

      <Card padding="none">
        {isLoading ? (
          <div className="p-6 text-center text-neutral-500">
            Loading products…
          </div>
        ) : products.length === 0 ? (
          <div className="p-6 text-center text-neutral-500">
            No products found
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left">Product</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                const v = product.variants?.[0];
                return (
                  <tr key={product.id} className="border-b hover:bg-neutral-50">
                    <td className="px-6 py-4 font-medium">{product.name}</td>
                    <td className="px-6 py-4">
                      {product.category?.name ?? '-'}
                    </td>
                    <td className="px-6 py-4">₹{v?.price ?? '-'}</td>
                    <td className="px-6 py-4">{v?.stock ?? '-'}</td>
                    <td className="px-6 py-4">
                      {getStatusBadge(product.status, v?.stock ?? 0)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => openEditModal(product)}>
                        <Edit className="w-4 h-4 text-primary-600" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4">
            <p className="text-sm">
              Page {page} of {totalPages}
            </p>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </Button>

              <Button
                size="sm"
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* MODALS */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Product"
      >
        <ProductForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleAddProduct}
          submitText="Add Product"
          isLoading={createMutation.isPending}
          categoryOptions={categories.map(c => ({
            value: c.id,
            label: c.name,
          }))}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Product"
      >
        <ProductForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleEditProduct}
          submitText="Update Product"
          isLoading={updateMutation.isPending}
          categoryOptions={categories.map(c => ({
            value: c.id,
            label: c.name,
          }))}
        />
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteProduct}
        title="Delete Product"
        message={`Delete "${selectedProduct?.name}"?`}
        confirmText="Delete"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}