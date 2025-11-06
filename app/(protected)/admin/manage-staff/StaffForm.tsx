"use client";

import { useState } from "react";
import { addStaff } from "./actions";

const roles = ["ADMIN", "PHARMACIST", "STOREKEEPER", "ACCOUNTANT", "USER"];

export default function StaffForm() {
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await addStaff(formData);
    setMessage(`Staff added. Temp password: ${res.tempPassword}`);
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="font-semibold text-lg">Add New Staff</h2>
      <input
        name="name"
        placeholder="Full Name"
        className="w-full p-2 border rounded"
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        className="w-full p-2 border rounded"
        required
      />
      <select name="role" className="w-full p-2 border rounded" required>
        {roles.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Staff
      </button>
      {message && (
        <p className="text-sm text-green-600 bg-green-100 p-2 rounded">
          {message}
        </p>
      )}
    </form>
  );
}
