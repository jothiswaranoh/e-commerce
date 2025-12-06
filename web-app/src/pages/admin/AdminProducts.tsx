import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, X } from 'lucide-react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { TableRowSkeleton } from '../../components/ui/Skeleton';

interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    description?: string;
    status: string;
}

const categoryOptions = [
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Fashion', label: 'Fashion' },
    { value: 'Home', label: 'Home' },
    { value: 'Sports', label: 'Sports' },
];

const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'in_stock', label: 'In Stock' },
    { value: 'low_stock', label: 'Low Stock' },
    { value: 'out_of_stock', label: 'Out of Stock' },
];

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([
        { id: '1', name: 'Wireless Headphones', category: 'Electronics', price: 2999, stock: 45, status: 'active', description: 'High-quality wireless headphones' },
        { id: '2', name: 'Smart Watch', category: 'Electronics', price: 4999, stock: 23, status: 'active', description: 'Feature-rich smartwatch' },
        { id: '3', name: 'Running Shoes', category: 'Sports', price: 3499, stock: 0, status: 'out_of_stock', description: 'Comfortable running shoes' },
        { id: '4', name: 'Yoga Mat', category: 'Sports', price: 899, stock: 67, status: 'active', description: 'Non-slip yoga mat' },
        { id: '5', name: 'Coffee Maker', category: 'Home', price: 5999, stock: 12, status: 'low_stock', description: 'Automatic coffee maker' },
        { id: '6', name: 'Desk Lamp', category: 'Home', price: 1299, stock: 34, status: 'active', description: 'LED desk lamp' },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [selectedStatus, setSelectedStatus] = useState<any>(statusOptions[0]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        stock: '',
        description: '',
    });

    const getStatusBadge = (status: string, stock: number) => {
        if (status === 'out_of_stock' || stock === 0) {
            return <Badge variant="error">Out of Stock</Badge>;
        }
        if (stock < 20) {
            return <Badge variant="warning">Low Stock</Badge>;
        }
        return <Badge variant="success">In Stock</Badge>;
    };

    const handleAddProduct = () => {
        setIsLoading(true);
        setTimeout(() => {
            const newProduct: Product = {
                id: String(products.length + 1),
                name: formData.name,
                category: formData.category,
                price: Number(formData.price),
                stock: Number(formData.stock),
                description: formData.description,
                status: Number(formData.stock) > 0 ? 'active' : 'out_of_stock',
            };
            setProducts([...products, newProduct]);
            setIsAddModalOpen(false);
            setFormData({ name: '', category: '', price: '', stock: '', description: '' });
            setIsLoading(false);
            toast.success('Product added successfully!');
        }, 1000);
    };

    const handleEditProduct = () => {
        if (!selectedProduct) return;
        setIsLoading(true);
        setTimeout(() => {
            setProducts(products.map(p =>
                p.id === selectedProduct.id
                    ? {
                        ...p,
                        name: formData.name,
                        category: formData.category,
                        price: Number(formData.price),
                        stock: Number(formData.stock),
                        description: formData.description,
                        status: Number(formData.stock) > 0 ? 'active' : 'out_of_stock',
                    }
                    : p
            ));
            setIsEditModalOpen(false);
            setSelectedProduct(null);
            setFormData({ name: '', category: '', price: '', stock: '', description: '' });
            setIsLoading(false);
            toast.success('Product updated successfully!');
        }, 1000);
    };

    const handleDeleteProduct = () => {
        if (!selectedProduct) return;
        setIsLoading(true);
        setTimeout(() => {
            setProducts(products.filter(p => p.id !== selectedProduct.id));
            setIsDeleteDialogOpen(false);
            setSelectedProduct(null);
            setIsLoading(false);
            toast.success('Product deleted successfully!');
        }, 1000);
    };

    const openEditModal = (product: Product) => {
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            price: String(product.price),
            stock: String(product.stock),
            description: product.description || '',
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

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || product.category === selectedCategory.value;
        const matchesStatus =
            selectedStatus.value === 'all' ||
            (selectedStatus.value === 'in_stock' && product.stock >= 20) ||
            (selectedStatus.value === 'low_stock' && product.stock > 0 && product.stock < 20) ||
            (selectedStatus.value === 'out_of_stock' && product.stock === 0);
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const ProductForm = ({ onSubmit, submitText }: { onSubmit: () => void; submitText: string }) => (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            className="space-y-5"
        >
            <Input
                label="Product Name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
            />

            <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Category</label>
                <Select
                    options={categoryOptions}
                    value={categoryOptions.find(opt => opt.value === formData.category)}
                    onChange={(option) => setFormData({ ...formData, category: option?.value || '' })}
                    placeholder="Select category"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={{
                        control: (base) => ({
                            ...base,
                            borderColor: '#d4d4d4',
                            '&:hover': { borderColor: '#7c3aed' },
                            boxShadow: 'none',
                        }),
                        option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isSelected ? '#7c3aed' : state.isFocused ? '#f5f3ff' : 'white',
                            color: state.isSelected ? 'white' : '#171717',
                        }),
                    }}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Price (₹)"
                    type="number"
                    placeholder="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                />
                <Input
                    label="Stock"
                    type="number"
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter product description"
                    rows={3}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
            </div>

            <div className="flex gap-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    fullWidth
                    onClick={() => {
                        setIsAddModalOpen(false);
                        setIsEditModalOpen(false);
                        setFormData({ name: '', category: '', price: '', stock: '', description: '' });
                    }}
                >
                    Cancel
                </Button>
                <Button type="submit" fullWidth isLoading={isLoading}>
                    {submitText}
                </Button>
            </div>
        </form>
    );

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
                                            <div className="w-12 h-12 bg-neutral-100 rounded-lg"></div>
                                            <div>
                                                <p className="font-semibold text-neutral-900">{product.name}</p>
                                                <p className="text-sm text-neutral-500">ID: {product.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-neutral-700">{product.category}</td>
                                    <td className="px-6 py-4 font-semibold text-neutral-900">₹{product.price.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-neutral-700">{product.stock} units</td>
                                    <td className="px-6 py-4">{getStatusBadge(product.status, product.stock)}</td>
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
                <ProductForm onSubmit={handleAddProduct} submitText="Add Product" />
            </Modal>

            {/* Edit Product Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Product"
            >
                <ProductForm onSubmit={handleEditProduct} submitText="Update Product" />
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
