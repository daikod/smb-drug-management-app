"use client";

import { User, UserRole } from "@prisma/client";

interface StaffTableProps {
  users: User[];
}

export default function StaffTable({ users }: StaffTableProps) {
  async function handleRoleChange(id: string, role: UserRole) {
    await fetch(`/api/staff/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
  }

  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg mt-6">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 text-sm font-medium text-gray-700">Name</th>
            <th className="p-3 text-sm font-medium text-gray-700">Email</th>
            <th className="p-3 text-sm font-medium text-gray-700">Role</th>
            <th className="p-3 text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="p-3 text-sm text-gray-900">
                {user.firstName} {user.lastName}
              </td>
              <td className="p-3 text-sm text-gray-600">{user.email}</td>
              <td className="p-3 text-sm text-gray-600">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                  className="border rounded-md p-1 text-sm"
                  title="Select user role"
                >
                  {Object.values(UserRole).map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-3 text-sm">
                <button
                  onClick={() => console.log("Delete", user.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete user"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
