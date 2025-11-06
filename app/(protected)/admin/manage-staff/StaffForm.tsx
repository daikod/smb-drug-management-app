"use client";

import { useState } from "react";

export default function StaffForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "PHARMACIST",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your API call here (e.g., POST /api/staff)
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-lg shadow-md"
      aria-label="Add new staff member"
    >
      <h2 className="text-lg font-semibold mb-4">Add New Staff</h2>

      {/* First Name */}
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
          First Name
        </label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          placeholder="Enter first name"
          title="Enter first name"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md"
          required
        />
      </div>

      {/* Last Name */}
      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
          Last Name
        </label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          placeholder="Enter last name"
          title="Enter last name"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="staff@example.com"
          title="Enter staff email address"
          value={formData.email}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md"
          required
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="e.g. +2348012345678"
          title="Enter phone number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md"
        />
      </div>

      {/* Role */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <select
          id="role"
          name="role"
          title="Select staff role"
          value={formData.role}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md"
          required
        >
          <option value="PHARMACIST">Pharmacist</option>
          <option value="DISPENSER">Dispenser</option>
          <option value="ACCOUNTANT">Accountant</option>
          <option value="INVENTORY_OFFICER">Inventory Officer</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        title="Add new staff member"
      >
        Add Staff
      </button>
    </form>
  );
}
