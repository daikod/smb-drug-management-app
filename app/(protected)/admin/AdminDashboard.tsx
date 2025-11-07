"use client";

import { useEffect, useState, FormEvent } from "react";
import { UserRole } from "@prisma/client";

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

  // ✅ Create user (admin only, handled by /api/users POST)
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
        setForm({ firstName: "", lastName: "", email: "", role: "PHARMACIST", phone: "" });

        // Refresh list
        const updated = await fetch("/api/users", { credentials: "include" }).then(r => r.json());
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
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg"
      >
        <input
          type="text"
          placeholder="First Name"
          className="p-2 border rounded"
          aria-label="First Name"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          className="p-2 border rounded"
          aria-label="Last Name"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="p-2 border rounded"
          aria-label="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Phone"
          className="p-2 border rounded"
          aria-label="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <select
          className="p-2 border rounded"
          aria-label="Select Role"
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
          Add Staff
        </button>
      </form>

      <h2 className="text-xl mb-4">Existing Users</h2>
      <table className="w-full text-left border border-gray-200 rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Phone</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="p-2 border">{u.firstName} {u.lastName}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.role}</td>
              <td className="p-2 border">{u.phone || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
