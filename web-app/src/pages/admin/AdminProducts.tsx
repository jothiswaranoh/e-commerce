import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ProductForm from './ProductForm';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '../../hooks/useProduct';

import { useCategories } from '../../hooks/useCategory';
import { Product, ProductFormData } from '../../types';

export default function AdminProducts() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useProducts(page, 10);
  const products = data?.data ?? [];
  const totalPages = data?.meta?.total_pages ?? 1;

  const { data: categoriesResponse } = useCategories();
  const categories = Array.isArray(categoriesResponse)
    ? categoriesResponse
    : categoriesResponse?.data ?? [];

  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.name,
  }));

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<any>({
    name: '',
    slug: '',
    category_id: '',
    price: '',
    stock: '',
    description: '',
    status: 'active',
    images: [],
  });

  const getStatusBadge = (status: string, stock: number) => {
    if (status === 'archived') return <Badge variant="neutral">Archived</Badge>;
    if (stock === 0) return <Badge variant="error">Out of Stock</Badge>;
    if (stock < 20) return <Badge variant="warning">Low Stock</Badge>;
    return <Badge variant="success">In Stock</Badge>;
  };

  const handleAddProduct = async () => {
    try {
      const payload: ProductFormData = {
        ...formData,
        slug:
          formData.slug ||
          formData.name.toLowerCase().replace(/\s+/g, '-'),
        category_id: Number(formData.category_id),
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
    } catch (e: any) {
      toast.error(e.message || 'Create failed');
    }
  };

  const openEditModal = (product: Product) => {
    const v = product.variants?.[0];
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      category_id: String(product.category_id),
      price: v?.price ?? '',
      stock: v?.stock ?? '',
      description: product.description || '',
      status: product.status,
      images: [],
    });
    setIsEditModalOpen(true);
  };

  const handleEditProduct = async () => {
    if (!selectedProduct) return;

    try {
      await updateMutation.mutateAsync({
        id: selectedProduct.id,
        data: {
          ...formData,
          category_id: Number(formData.category_id),
          variants_attributes: selectedProduct.variants.map(v => ({
            id: v.id,
            sku: v.sku,
            price: Number(formData.price),
            stock: Number(formData.stock),
          })),
        },
      });

      toast.success('Product updated');
      setIsEditModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || 'Update failed');
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    await deleteMutation.mutateAsync(selectedProduct.id);
    toast.success('Product deleted');
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-5 h-5" /> Add Product
        </Button>
      </div>

      <Card padding="none">
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
            {products.map(p => {
              const v = p.variants?.[0];
              return (
                <tr key={p.id} className="border-b">
                  <td className="px-6 py-4">{p.name}</td>
                  <td className="px-6 py-4">{p.category?.name}</td>
                  <td className="px-6 py-4">₹{v?.price}</td>
                  <td className="px-6 py-4">{v?.stock}</td>
                  <td className="px-6 py-4">{getStatusBadge(p.status, v?.stock)}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => openEditModal(p)}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => { setSelectedProduct(p); setIsDeleteDialogOpen(true); }}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Product">
        <ProductForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleAddProduct}
          submitText="Add Product"
          categoryOptions={categoryOptions}
        />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Product">
        <ProductForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleEditProduct}
          submitText="Update Product"
          categoryOptions={categoryOptions}
        />
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteProduct}
        title="Delete Product"
        message={`Delete "${selectedProduct?.name}"?`}
      />
    </div>
  );
}