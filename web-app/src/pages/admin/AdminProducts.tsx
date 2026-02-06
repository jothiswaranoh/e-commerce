import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../../hooks/useProduct';
import { Product, ProductFormData } from '../../types';
import { useCategories } from '../../hooks/useCategory';



const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'archived', label: 'Archived' },
];

export default function AdminProducts() {
    const { data: products = [] } = useProducts();
    const { data: categories = [] } = useCategories();
    const createMutation = useCreateProduct();
    const updateMutation = useUpdateProduct();
    const deleteMutation = useDeleteProduct();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [selectedStatus, setSelectedStatus] = useState<any>(statusOptions[0]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
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

    const categoryOptions = categories.map(cat => ({
        value: cat.id,
        label: cat.name,
    }));

    const isLoading = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

    const getStatusBadge = (status: string, stock: number) => {
        if (status === 'archived') return <Badge variant="neutral">Archived</Badge>;
        if (stock === 0) return <Badge variant="error">Out of Stock</Badge>;
        if (stock < 20) return <Badge variant="warning">Low Stock</Badge>;
        return <Badge variant="success">In Stock</Badge>;
    };

    const handleAddProduct = async () => {
        const data: ProductFormData = {
            name: formData.name,
            slug: formData.slug || formData.name.toLowerCase().replace(/ /g, '-'),
            category_id: Number(formData.category_id),
            status: formData.status,
            description: formData.description,
            variants_attributes: [{
                sku: `${formData.name.substring(0, 3).toUpperCase()}-${Date.now()}`,
                price: Number(formData.price),
                stock: Number(formData.stock)
            }]
        };

        try {
            await createMutation.mutateAsync(data);
            setIsAddModalOpen(false);
            setFormData({ name: '', slug: '', category_id: '', price: '', stock: '', description: '', status: 'active' });
            toast.success('Product added successfully!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to add product');
        }
    };

    const handleEditProduct = async () => {
        if (!selectedProduct) return;

        const data: ProductFormData = {
            name: formData.name,
            slug: formData.slug,
            category_id: Number(formData.category_id),
            status: formData.status,
            description: formData.description,
            variants_attributes: selectedProduct.variants.map(v => ({
                id: v.id,
                sku: v.sku,
                price: Number(formData.price),
                stock: Number(formData.stock)
            }))
        };

        try {
            await updateMutation.mutateAsync({ id: selectedProduct.id, data });
            setIsEditModalOpen(false);
            setSelectedProduct(null);
            toast.success('Product updated successfully!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to update product');
        }
    };

    const handleDeleteProduct = async () => {
        if (!selectedProduct) return;
        try {
            await deleteMutation.mutateAsync(selectedProduct.id);
            setIsDeleteDialogOpen(false);
            setSelectedProduct(null);
            toast.success('Product deleted successfully!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete product');
        }
    };

    const openEditModal = (product: Product) => {
        setSelectedProduct(product);
        const mainVariant = product.variants[0];
        setFormData({
            name: product.name,
            slug: product.slug,
            category_id: String(product.category_id),
            price: String(mainVariant?.price || 0),
            stock: String(mainVariant?.stock || 0),
            description: product.description || '',
            status: product.status as any,
        });
        setIsEditModalOpen(true);
    };

    const openViewModal = (product: Product) => {
        setSelectedProduct(product);
        setIsViewModalOpen(true);
    };

    const openDeleteDialog = (product: Product) => {
        setSelectedProduct(product);
        setIsDeleteDialogOpen(true);
    };

  const filteredProducts = Array.isArray(products)
    ? products.filter(product => {
        const matchesSearch = product.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());

        const matchesCategory =
            !selectedCategory || product.category_id === selectedCategory.value;

        const mainVariant = product.variants?.[0];
        const stock = mainVariant?.stock ?? 0;

        const matchesStatus =
            selectedStatus.value === 'all' ||
            product.status === selectedStatus.value;

        return matchesSearch && matchesCategory && matchesStatus;
    })
    : [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">Products</h1>
                    <p className="text-neutral-600">Manage your product inventory</p>
                </div>
                <Button size="lg" onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="w-5 h-5" />
                    Add Product
                </Button>
            </div>

            {/* Filters & Search */}
            <Card variant="elevated" padding="lg">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            leftIcon={<Search className="w-5 h-5" />}
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <Select
                            options={[{ value: '', label: 'All Categories' }, ...categoryOptions]}
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            placeholder="Category"
                            isClearable
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    borderColor: '#d4d4d4',
                                    '&:hover': { borderColor: '#7c3aed' },
                                }),
                                option: (base, state) => ({
                                    ...base,
                                    backgroundColor: state.isSelected ? '#7c3aed' : state.isFocused ? '#f5f3ff' : 'white',
                                    color: state.isSelected ? 'white' : '#171717',
                                }),
                            }}
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <Select
                            options={statusOptions}
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                            placeholder="Status"
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    borderColor: '#d4d4d4',
                                    '&:hover': { borderColor: '#7c3aed' },
                                }),
                                option: (base, state) => ({
                                    ...base,
                                    backgroundColor: state.isSelected ? '#7c3aed' : state.isFocused ? '#f5f3ff' : 'white',
                                    color: state.isSelected ? 'white' : '#171717',
                                }),
                            }}
                        />
                    </div>
                </div>
            </Card>

            {/* Products Table */}
            <Card variant="elevated" padding="none">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-neutral-50 border-b border-neutral-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={product.images?.[0] || '/placeholder.png'}
                                                alt={product.name}
                                                className="w-12 h-12 rounded-lg object-cover bg-neutral-100"
                                                />  
                                            <div>
                                                <p className="font-semibold text-neutral-900">{product.name}</p>
                                                <p className="text-sm text-neutral-500">ID: {product.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-neutral-700">
                                        {product.category?.name ?? 'Uncategorized'}
                                        </td>

                                        <td className="px-6 py-4 font-semibold text-neutral-900">
                                        ₹{product.variants?.[0]?.price?.toLocaleString() ?? 0}
                                        </td>

                                        <td className="px-6 py-4 text-neutral-700">
                                        {product.variants?.[0]?.stock ?? 0} units
                                        </td>

                                        <td className="px-6 py-4">
                                        {getStatusBadge(
                                            product.status,
                                            product.variants?.[0]?.stock ?? 0
                                        )}
                                        </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openViewModal(product)}
                                                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                                title="View"
                                            >
                                                <Eye className="w-4 h-4 text-neutral-600" />
                                            </button>
                                            <button
                                                onClick={() => openEditModal(product)}
                                                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4 text-primary-600" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteDialog(product)}
                                                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200">
                    <p className="text-sm text-neutral-600">
                        Showing {filteredProducts.length} of {products.length} products
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            Previous
                        </Button>
                        <Button variant="outline" size="sm">
                            Next
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Add Product Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Product"
            >
                <ProductForm
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleAddProduct}
                    submitText="Add Product"
                    isLoading={isLoading}
                    categoryOptions={categoryOptions}
                    />
            </Modal>

            {/* Edit Product Modal */}
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
                    isLoading={isLoading}
                    categoryOptions={categoryOptions}
                />
            </Modal>

            {/* View Product Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Product Details"
            >
                {selectedProduct && (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-neutral-600">Product Name</label>
                            <p className="text-lg font-semibold text-neutral-900">{selectedProduct.name}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-neutral-600">Category</label>
                                <p className="text-neutral-900">{selectedProduct.category}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-neutral-600">Status</label>
                                <div className="mt-1">{getStatusBadge(selectedProduct.status, selectedProduct.stock)}</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-neutral-600">Price</label>
                                <p className="text-lg font-bold text-primary-600">₹{selectedProduct.price.toLocaleString()}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-neutral-600">Stock</label>
                                <p className="text-neutral-900">{selectedProduct.stock} units</p>
                            </div>
                        </div>
                        {selectedProduct.description && (
                            <div>
                                <label className="text-sm font-medium text-neutral-600">Description</label>
                                <p className="text-neutral-700">{selectedProduct.description}</p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteProduct}
                title="Delete Product"
                message={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                variant="danger"
                isLoading={isLoading}
            />
        </div>
    );
}
function ProductForm({
  formData,
  setFormData,
  onSubmit,
  submitText,
  isLoading,
  categoryOptions
}: {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: () => void;
  submitText: string;
  isLoading: boolean;
  categoryOptions: { value: number; label: string }[];
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-5"
    >
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Product Name"
          placeholder="Enter product name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev: any) => ({ ...prev, name: e.target.value }))
          }
          required
        />
        <Input
          label="Slug (optional)"
          placeholder="product-slug"
          value={formData.slug}
          onChange={(e) =>
            setFormData((prev: any) => ({ ...prev, slug: e.target.value }))
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Category
          </label>
          <Select
            options={categoryOptions}
            value={categoryOptions.find(
              (opt) => opt.value === Number(formData.category_id)
            )}
            onChange={(option) =>
              setFormData((prev: any) => ({
                ...prev,
                category_id: String(option?.value || ''),
              }))
            }
            placeholder="Select category"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Status
          </label>
          <Select
            options={statusOptions.filter((opt) => opt.value !== 'all')}
            value={statusOptions.find(
              (opt) => opt.value === formData.status
            )}
            onChange={(option: any) =>
              setFormData((prev: any) => ({
                ...prev,
                status: option?.value || 'active',
              }))
            }
            placeholder="Select status"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Price (₹)"
          type="number"
          value={formData.price}
          onChange={(e) =>
            setFormData((prev: any) => ({ ...prev, price: e.target.value }))
          }
          required
        />
        <Input
          label="Initial Stock"
          type="number"
          value={formData.stock}
          onChange={(e) =>
            setFormData((prev: any) => ({ ...prev, stock: e.target.value }))
          }
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          rows={3}
          className="w-full px-4 py-2.5 border rounded-lg"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" fullWidth isLoading={isLoading}>
          {submitText}
        </Button>
      </div>
    </form>
  );
}