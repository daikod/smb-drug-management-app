"use client";

import { useTransition } from "react";
import { deleteStaff, updateRole } from "./actions";

export default function StaffTable({ staff }: { staff: any[] }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteStaff(id);
      window.location.reload();
    });
  }

  function handleRoleChange(id: string, newRole: string) {
    startTransition(async () => {
      await updateRole(id, newRole);
    });
  }

  return (
    <div>
      <h2 className="font-semibold text-lg mb-2">All Staff</h2>
      <table className="w-full text-sm border-collapse border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">
                <select
                  defaultValue={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="border rounded p-1"
                >
                  <option>ADMIN</option>
                  <option>PHARMACIST</option>
                  <option>STOREKEEPER</option>
                  <option>ACCOUNTANT</option>
                  <option>USER</option>
                </select>
              </td>
              <td className="p-2">
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isPending && <p className="text-gray-500 mt-2">Updating...</p>}
    </div>
  );
}
