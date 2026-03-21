import { useState } from "react";
import { UserPlus, Users, Crown } from "lucide-react";
import { toast } from "react-toastify";

import Card from "../../components/ui/Card";

import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { TableRowSkeleton } from "../../components/ui/Skeleton";

import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "../../hooks/useUsers";

import UserForm from "../../components/users/UserForm";
import UserDataGrid from "../../components/users/UserDataGrid";
import { UserPayload } from "../../api/users";

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useUsers(page, pageSize);

  const users = data?.data ?? [];
  const meta = data?.meta;

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleCreate = async (payload: Partial<UserPayload>) => {
    try {
      await createMutation.mutateAsync(payload as UserPayload);
      toast.success("User created");
      setIsCreateOpen(false);
    } catch {
      toast.error("Failed to create user");
    }
  };

  const handleUpdate = async (payload: Partial<UserPayload>) => {
    if (!selectedUser) return;

    try {
      await updateMutation.mutateAsync({
        id: selectedUser.id,
        payload,
      });
      toast.success("User updated");
      setIsEditOpen(false);
      setSelectedUser(null);
    } catch {
      toast.error("Failed to update user");
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      await deleteMutation.mutateAsync(selectedUser.id);
      toast.success("User deleted");
      setIsDeleteOpen(false);
      setSelectedUser(null);
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when page size changes
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-900 tracking-tight">Users</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage user accounts and permissions
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 font-bold text-white transition-all duration-300 bg-accent-600 rounded-xl hover:bg-accent-500 hover:shadow-lg hover:shadow-accent-500/20 hover:-translate-y-0.5 active:translate-y-0"
        >
          <UserPlus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
          <span>Add User</span>
        </button>
      </div>

      {meta && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="group relative bg-white rounded-2xl p-6 border border-neutral-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-500 to-accent-400 opacity-80`} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500 mb-1">Total Users</p>
                <p className="text-3xl font-display font-bold text-neutral-900 tracking-tight">
                  {meta.total_count}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-accent-50 transition-transform duration-300 group-hover:scale-110">
                <Users className="w-6 h-6 text-accent-600" />
              </div>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl p-6 border border-neutral-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-400 opacity-80`} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500 mb-1">Admins</p>
                <p className="text-3xl font-display font-bold text-neutral-900 tracking-tight">
                  {users.filter((u) => u.role === "admin").length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 transition-transform duration-300 group-hover:scale-110">
                <Crown className="w-6 h-6 text-amber-600" />
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
                {[...Array(pageSize)].map((_, i) => (
                  <TableRowSkeleton key={i} cols={4} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <UserDataGrid
            rows={users}
            page={page}
            pageSize={pageSize}
            rowCount={meta?.total_count ?? 0}
            loading={isLoading}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            onEdit={(user) => {
              setSelectedUser(user);
              setIsEditOpen(true);
            }}
            onDelete={(user) => {
              setSelectedUser(user);
              setIsDeleteOpen(true);
            }}
          />
        )}
      </Card>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add New User"
      >
        <UserForm
          submitText="Create User"
          isLoading={createMutation.isPending}
          onSubmit={handleCreate}
        />
      </Modal>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit User"
      >
        {selectedUser && (
          <UserForm
            initialData={selectedUser}
            submitText="Update User"
            isLoading={updateMutation.isPending}
            onSubmit={handleUpdate}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Delete "${selectedUser?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
