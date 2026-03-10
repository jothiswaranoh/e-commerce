import { useState } from "react";
import { UserPlus } from "lucide-react";
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Users</h1>
          <p className="text-neutral-600 mt-1">
            Manage user accounts and permissions
          </p>
        </div>

        <Button onClick={() => setIsCreateOpen(true)}>
          <UserPlus className="w-5 h-5" />
          Add User
        </Button>
      </div>

      {meta && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Users</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {meta.total_count}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Admins</p>
                <p className="text-2xl font-bold text-primary-700 mt-1">
                  {users.filter((u) => u.role === "admin").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Card padding="none">
        {isLoading ? (
          <div className="p-6">
            <table className="w-full">
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <TableRowSkeleton key={i} columns={4} />
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
