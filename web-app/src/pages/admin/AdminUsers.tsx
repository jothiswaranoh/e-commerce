import { useState } from 'react';
import { Search, UserPlus, Mail, Shield, Edit, Trash2, Eye } from 'lucide-react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import UserForm from './UserForm'
interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    orders: number;
    joined: string;
    status: string;
    phone?: string;
    address?: string;
}

const roleOptions = [
    { value: 'customer', label: 'Customer' },
    { value: 'admin', label: 'Admin' },
];

const statusFilterOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

const roleFilterOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'customer', label: 'Customer' },
];

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([
        { id: '1', name: 'John Doe', email: 'john@example.com', role: 'customer', orders: 12, joined: '2024-01-15', status: 'active', phone: '+91 98765 43210', address: 'Mumbai, India' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'customer', orders: 8, joined: '2024-02-20', status: 'active', phone: '+91 98765 43211', address: 'Delhi, India' },
        { id: '3', name: 'Admin User', email: 'admin@shophub.com', role: 'admin', orders: 0, joined: '2023-12-01', status: 'active', phone: '+91 98765 43212', address: 'Bangalore, India' },
        { id: '4', name: 'Bob Johnson', email: 'bob@example.com', role: 'customer', orders: 5, joined: '2024-03-10', status: 'active', phone: '+91 98765 43213', address: 'Chennai, India' },
        { id: '5', name: 'Alice Williams', email: 'alice@example.com', role: 'customer', orders: 15, joined: '2024-01-05', status: 'inactive', phone: '+91 98765 43214', address: 'Pune, India' },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState<any>(roleFilterOptions[0]);
    const [selectedStatus, setSelectedStatus] = useState<any>(statusFilterOptions[0]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        phone: '',
        address: '',
        status: 'active',
    });

    const getRoleBadge = (role: string) => {
        return role === 'admin' ? (
            <Badge variant="primary">
                <Shield className="w-3 h-3" />
                Admin
            </Badge>
        ) : (
            <Badge variant="neutral">Customer</Badge>
        );
    };

    const getStatusBadge = (status: string) => {
        return status === 'active' ? (
            <Badge variant="success">Active</Badge>
        ) : (
            <Badge variant="neutral">Inactive</Badge>
        );
    };

    const handleAddUser = () => {
        setIsLoading(true);
        setTimeout(() => {
            const newUser: User = {
                id: String(users.length + 1),
                name: formData.name,
                email: formData.email,
                role: formData.role,
                phone: formData.phone,
                address: formData.address,
                status: formData.status,
                orders: 0,
                joined: new Date().toISOString().split('T')[0],
            };
            setUsers([...users, newUser]);
            setIsAddModalOpen(false);
            setFormData({ name: '', email: '', role: '', phone: '', address: '', status: 'active' });
            setIsLoading(false);
            toast.success('User added successfully!');
        }, 1000);
    };

    const handleEditUser = () => {
        if (!selectedUser) return;
        setIsLoading(true);
        setTimeout(() => {
            setUsers(users.map(u =>
                u.id === selectedUser.id
                    ? {
                        ...u,
                        name: formData.name,
                        email: formData.email,
                        role: formData.role,
                        phone: formData.phone,
                        address: formData.address,
                        status: formData.status,
                    }
                    : u
            ));
            setIsEditModalOpen(false);
            setSelectedUser(null);
            setFormData({ name: '', email: '', role: '', phone: '', address: '', status: 'active' });
            setIsLoading(false);
            toast.success('User updated successfully!');
        }, 1000);
    };

    const handleDeleteUser = () => {
        if (!selectedUser) return;
        setIsLoading(true);
        setTimeout(() => {
            setUsers(users.filter(u => u.id !== selectedUser.id));
            setIsDeleteDialogOpen(false);
            setSelectedUser(null);
            setIsLoading(false);
            toast.success('User deleted successfully!');
        }, 1000);
    };

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone || '',
            address: user.address || '',
            status: user.status,
        });
        setIsEditModalOpen(true);
    };

    const openViewModal = (user: User) => {
        setSelectedUser(user);
        setIsViewModalOpen(true);
    };

    const openDeleteDialog = (user: User) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = selectedRole.value === 'all' || user.role === selectedRole.value;
        const matchesStatus = selectedStatus.value === 'all' || user.status === selectedStatus.value;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const stats = [
        { label: 'Total Users', value: users.length },
        { label: 'Active Users', value: users.filter(u => u.status === 'active').length },
        { label: 'Admins', value: users.filter(u => u.role === 'admin').length },
    ];

    const UserForm = ({ onSubmit, submitText }: { onSubmit: () => void; submitText: string }) => (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            className="space-y-5"
        >
            <Input
                label="Full Name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
            />

            <Input
                type="email"
                label="Email Address"
                placeholder="user@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                leftIcon={<Mail className="w-5 h-5" />}
                required
            />

            <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Role</label>
                <Select
                    options={roleOptions}
                    value={roleOptions.find(opt => opt.value === formData.role)}
                    onChange={(option) => setFormData({ ...formData, role: option?.value || '' })}
                    placeholder="Select role"
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

            <Input
                label="Phone Number"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <Input
                label="Address"
                placeholder="City, Country"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />

            <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Status</label>
                <Select
                    options={[
                        { value: 'active', label: 'Active' },
                        { value: 'inactive', label: 'Inactive' },
                    ]}
                    value={{ value: formData.status, label: formData.status === 'active' ? 'Active' : 'Inactive' }}
                    onChange={(option) => setFormData({ ...formData, status: option?.value || 'active' })}
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

            <div className="flex gap-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    fullWidth
                    onClick={() => {
                        setIsAddModalOpen(false);
                        setIsEditModalOpen(false);
                        setFormData({ name: '', email: '', role: '', phone: '', address: '', status: 'active' });
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
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">Users</h1>
                    <p className="text-neutral-600">Manage user accounts and permissions</p>
                </div>
                <Button size="lg" onClick={() => setIsAddModalOpen(true)}>
                    <UserPlus className="w-5 h-5" />
                    Add User
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                    <Card key={index} variant="elevated" padding="lg">
                        <p className="text-sm text-neutral-600 mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-bold text-neutral-900">{stat.value}</h3>
                    </Card>
                ))}
            </div>

            {/* Filters & Search */}
            <Card variant="elevated" padding="lg">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            leftIcon={<Search className="w-5 h-5" />}
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <Select
                            options={roleFilterOptions}
                            value={selectedRole}
                            onChange={setSelectedRole}
                            placeholder="Role"
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
                            options={statusFilterOptions}
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

            {/* Users Table */}
            <Card variant="elevated" padding="none">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-neutral-50 border-b border-neutral-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                    Orders
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-neutral-900">{user.name}</p>
                                                <p className="text-sm text-neutral-500 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                                    <td className="px-6 py-4 text-neutral-700">{user.orders} orders</td>
                                    <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                                    <td className="px-6 py-4 text-neutral-600">{user.joined}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openViewModal(user)}
                                                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                                title="View"
                                            >
                                                <Eye className="w-4 h-4 text-neutral-600" />
                                            </button>
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4 text-primary-600" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteDialog(user)}
                                                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                                title="Delete"
                                                disabled={user.role === 'admin'}
                                            >
                                                <Trash2 className={`w-4 h-4 ${user.role === 'admin' ? 'text-neutral-300' : 'text-red-600'}`} />
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
                        Showing {filteredUsers.length} of {users.length} users
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

            {/* Add User Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New User"
            >
                <UserForm onSubmit={handleAddUser} submitText="Add User" />
            </Modal>

            {/* Edit User Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit User"
            >
                <UserForm onSubmit={handleEditUser} submitText="Update User" />
            </Modal>

            {/* View User Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="User Details"
            >
                {selectedUser && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 pb-4 border-b border-neutral-200">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                {selectedUser.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-neutral-900">{selectedUser.name}</h3>
                                <p className="text-neutral-600">{selectedUser.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-neutral-600">Role</label>
                                <div className="mt-1">{getRoleBadge(selectedUser.role)}</div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-neutral-600">Status</label>
                                <div className="mt-1">{getStatusBadge(selectedUser.status)}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-neutral-600">Total Orders</label>
                                <p className="text-lg font-bold text-primary-600">{selectedUser.orders}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-neutral-600">Joined Date</label>
                                <p className="text-neutral-900">{selectedUser.joined}</p>
                            </div>
                        </div>

                        {selectedUser.phone && (
                            <div>
                                <label className="text-sm font-medium text-neutral-600">Phone</label>
                                <p className="text-neutral-900">{selectedUser.phone}</p>
                            </div>
                        )}

                        {selectedUser.address && (
                            <div>
                                <label className="text-sm font-medium text-neutral-600">Address</label>
                                <p className="text-neutral-900">{selectedUser.address}</p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteUser}
                title="Delete User"
                message={`Are you sure you want to delete "${selectedUser?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                variant="danger"
                isLoading={isLoading}
            />
        </div>
    );
}
