"use client";

import { useEffect, useState, FormEvent } from "react";
import { UserRole } from "@prisma/client";
import Link from "next/link";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone?: string | null;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "PHARMACIST",
    phone: "",
  });

  // ✅ Fetch users from authenticated API route
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/users", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load users");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  // ✅ Create user (admin only)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("Staff created successfully!");
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          role: "PHARMACIST",
          phone: "",
        });

        // Refresh user list
        const updated = await fetch("/api/users", {
          credentials: "include",
        }).then((r) => r.json());
        setUsers(updated);
      } else {
        const msg = await res.text();
        alert("Failed to create user: " + msg);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong creating staff");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

        {/* ✅ Navigation Buttons */}
        <div className="space-x-2">
          <Link
            href="/admin/manage-staff"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            👥 Manage Staff
          </Link>
          <Link
            href="/reports"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            📊 View Reports
          </Link>
        </div>
      </div>

      {/* Create New Staff */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg shadow-sm"
      >
        <input
          type="text"
          placeholder="First Name"
          className="p-2 border rounded"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          className="p-2 border rounded"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="p-2 border rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Phone"
          className="p-2 border rounded"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <select
          className="p-2 border rounded"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          required
        >
          {Object.values(UserRole).map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          ➕ Add Staff
        </button>
      </form>

      {/* Existing Users */}
      <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
        <h2 className="text-lg font-semibold px-4 py-3 bg-gray-50 border-b">
          Existing Users
        </h2>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Phone</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="p-2 border">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="p-2 border">{u.email}</td>
                  <td className="p-2 border">{u.role}</td>
                  <td className="p-2 border">{u.phone || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
