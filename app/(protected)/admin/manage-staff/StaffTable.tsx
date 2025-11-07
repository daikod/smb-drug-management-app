// app/(protected)/admin/manage-staff/StaffTable.tsx
import { UserRole } from "@prisma/client";

interface StaffUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function StaffTable({ users }: { users: StaffUser[] }) {
  return (
    <table className="min-w-full border border-gray-200">
      <thead>
        <tr>
          <th className="p-2">Name</th>
          <th className="p-2">Email</th>
          <th className="p-2">Role</th>
          <th className="p-2">Status</th>
          <th className="p-2">Created</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="border-t">
            <td className="p-2">{user.firstName} {user.lastName}</td>
            <td className="p-2">{user.email}</td>
            <td className="p-2">{user.role}</td>
            <td className="p-2">{user.isActive ? "Active" : "Inactive"}</td>
            <td className="p-2">{new Date(user.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
