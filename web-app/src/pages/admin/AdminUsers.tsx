import { useState } from "react";
import { ShieldCheck, Sparkles, UserPlus, Users as UsersIcon } from "lucide-react";
import { toast } from "react-toastify";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
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
import { User, UserPayload } from "../../api/users";

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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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
    <div className="space-y-8">
      <div className="admin-hero-panel p-6 md:p-8">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="admin-kicker">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Access Management
            </span>
            <h1 className="admin-title mt-4 text-4xl font-semibold text-neutral-900 md:text-5xl">Users</h1>
            <p className="admin-copy mt-3 text-base md:text-lg">
              Manage user accounts and permissions with the same premium layout as the rest of the admin.
            </p>
          </div>

          <Button onClick={() => setIsCreateOpen(true)} className="self-start lg:self-auto">
            <UserPlus className="w-5 h-5" />
            Add User
          </Button>
        </div>
      </div>

      {meta && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="rounded-[28px] border border-white/80 bg-white/80 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Total Users</p>
                <p className="mt-2 text-3xl font-bold text-neutral-900">
                  {meta.total_count}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-600">
                <UsersIcon className="h-6 w-6" />
              </div>
            </div>
          </Card>

          <Card className="rounded-[28px] border border-white/80 bg-white/80 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Admins</p>
                <p className="mt-2 text-3xl font-bold text-primary-700">
                  {users.filter((u) => u.role === "admin").length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                <ShieldCheck className="h-6 w-6" />
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
                  <TableRowSkeleton key={i} cols={4} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <UserDataGrid
            autoHeight
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
