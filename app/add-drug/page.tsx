import Sidebar from "@/components/sidebar";
import { createDrug } from "@/lib/actions/drugs";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

export default async function AddDrug() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/add-drug" />

      <main className="ml-64 p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Add Drug
              </h1>
              <p className="text-sm text-gray-500">
                Add a new drug to your inventory
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-3xl">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <form className="space-y-6" action={createDrug}>
              {/* DRUG NAME */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Drug Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-100"
                  placeholder="Enter Drug Name"
                />
              </div>

              {/* GENERIC + BRAND NAME */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="genericName" className="block text-sm font-medium text-gray-700 mb-2">
                    Generic Name
                  </label>
                  <input
                    type="text"
                    id="genericName"
                    name="genericName"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g. Paracetamol"
                  />
                </div>
                <div>
                  <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    id="brandName"
                    name="brandName"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g. Panadol"
                  />
                </div>
              </div>

              {/* CATEGORY & FORM */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Category</option>
                    <option value="ANTIBIOTIC">Antibiotic</option>
                    <option value="ANALGESIC">Analgesic</option>
                    <option value="ANTIMALARIAL">Antimalarial</option>
                    <option value="ANTIHYPERTENSIVE">Antihypertensive</option>
                    <option value="SUPPLEMENT">Supplement</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="form" className="block text-sm font-medium text-gray-700 mb-2">
                    Form *
                  </label>
                  <select
                    id="form"
                    name="form"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Form</option>
                    <option value="TABLET">Tablet</option>
                    <option value="CAPSULE">Capsule</option>
                    <option value="SYRUP">Syrup</option>
                    <option value="INJECTION">Injection</option>
                    <option value="CREAM">Cream</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              {/* STRENGTH / ACTIVE INGREDIENT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="strength" className="block text-sm font-medium text-gray-700 mb-2">
                    Strength
                  </label>
                  <input
                    type="text"
                    id="strength"
                    name="strength"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g. 500mg"
                  />
                </div>
                <div>
                  <label htmlFor="activeIngredient" className="block text-sm font-medium text-gray-700 mb-2">
                    Active Ingredient
                  </label>
                  <input
                    type="text"
                    id="activeIngredient"
                    name="activeIngredient"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g. Amoxicillin"
                  />
                </div>
              </div>

              {/* MANUFACTURER / STORAGE CONDITION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700 mb-2">
                    Manufacturer
                  </label>
                  <input
                    type="text"
                    id="manufacturer"
                    name="manufacturer"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g. GSK, Emzor Pharma"
                  />
                </div>
                <div>
                  <label htmlFor="storageCondition" className="block text-sm font-medium text-gray-700 mb-2">
                    Storage Condition *
                  </label>
                  <select
                    id="storageCondition"
                    name="storageCondition"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Condition</option>
                    <option value="ROOM_TEMPERATURE">Room Temperature</option>
                    <option value="REFRIGERATED">Refrigerated</option>
                    <option value="FROZEN">Frozen</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              {/* PRESCRIPTION REQUIRED */}
              <div>
                <label htmlFor="prescriptionRequired" className="block text-sm font-medium text-gray-700 mb-2">
                  Prescription Required *
                </label>
                <select
                  id="prescriptionRequired"
                  name="prescriptionRequired"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Option</option>
                  <option value="YES">Yes</option>
                  <option value="NO">No</option>
                </select>
              </div>

              {/* PRICE, QUANTITY, SKU */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₦) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    step="0.01"
                    min="0"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="0"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Unique code e.g. DRG-001"
                  />
                </div>
              </div>

              {/* REORDER + MINIMUM STOCK */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="minimumStockLevel" className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Stock Level
                  </label>
                  <input
                    type="number"
                    id="minimumStockLevel"
                    name="minimumStockLevel"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label htmlFor="reorderLevel" className="block text-sm font-medium text-gray-700 mb-2">
                    Reorder Level
                  </label>
                  <input
                    type="number"
                    id="reorderLevel"
                    name="reorderLevel"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="50"
                  />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Short notes about the drug..."
                ></textarea>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-5">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Drug
                </button>
                <Link
                  href="/inventory"
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
