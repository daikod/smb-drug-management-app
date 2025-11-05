"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "../auth";
import { prisma } from "../prisma";
import { z } from "zod";

// Validation schema aligned with Drug model
const DrugSchema = z.object({
  name: z.string().min(1, "Name is required"),
  genericName: z.string().min(1, "Generic name is required"),
  brandName: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  form: z.string().min(1, "Form is required"),
  strength: z.string().min(1, "Strength is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  activeIngredient: z.string().min(1, "Active ingredient is required"),
  prescriptionRequired: z.enum(["YES", "NO"]),
  storageCondition: z.string().min(1, "Storage condition is required"),
  sku: z.string().min(1, "SKU is required"),
  barcode: z.string().optional(),
  description: z.string().optional(),
  minimumStockLevel: z.coerce.number().int().min(0).optional(),
  reorderLevel: z.coerce.number().int().min(0).optional(),

  // Optional batch info if creating first batch
  initialBatch: z
    .object({
      batchNumber: z.string().min(1),
      quantityReceived: z.coerce.number().int().min(0),
      unitPrice: z.coerce.number().min(0),
      sellingPrice: z.coerce.number().min(0),
      manufactureDate: z.string().datetime(),
      expiryDate: z.string().datetime(),
      supplierId: z.string().min(1),
      locationId: z.string().min(1),
    })
    .optional(),
});

/**
 * Delete a drug and its related batches safely.
 */
export async function deleteDrug(formData: FormData) {
  const id = String(formData.get("id") || "");
  try {
    await prisma.drug.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting drug:", error);
    throw new Error("Failed to delete drug.");
  }
}

/**
 * Create a drug (and optional first batch)
 */
export async function createDrug(formData: FormData) {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    throw new Error("User not authenticated.");
  }

  const parsed = DrugSchema.safeParse({
    name: formData.get("name"),
    genericName: formData.get("genericName"),
    brandName: formData.get("brandName") || undefined,
    category: formData.get("category"),
    form: formData.get("form"),
    strength: formData.get("strength"),
    manufacturer: formData.get("manufacturer"),
    description: formData.get("description") || undefined,
    activeIngredient: formData.get("activeIngredient"),
    prescriptionRequired: formData.get("prescriptionRequired") as "YES" | "NO",
    barcode: formData.get("barcode") || undefined,
    sku: formData.get("sku"),
    storageCondition: formData.get("storageCondition"),
    minimumStockLevel: formData.get("minimumStockLevel"),
    reorderLevel: formData.get("reorderLevel"),
    initialBatch: formData.get("batchNumber")
      ? {
          batchNumber: formData.get("batchNumber"),
          quantityReceived: formData.get("quantityReceived"),
          unitPrice: formData.get("unitPrice"),
          sellingPrice: formData.get("sellingPrice"),
          manufactureDate: formData.get("manufactureDate"),
          expiryDate: formData.get("expiryDate"),
          supplierId: formData.get("supplierId"),
          locationId: formData.get("locationId"),
        }
      : undefined,
  });

  if (!parsed.success) {
    console.error(parsed.error.flatten());
    throw new Error("Validation failed");
  }

  const data = parsed.data;

  try {
    await prisma.drug.create({
      data: {
        name: data.name,
        genericName: data.genericName,
        brandName: data.brandName,
        category: data.category as any,
        form: data.form as any,
        strength: data.strength,
        manufacturer: data.manufacturer,
        activeIngredient: data.activeIngredient,
        description: data.description,
        prescriptionRequired: data.prescriptionRequired as any,
        barcode: data.barcode,
        sku: data.sku,
        storageCondition: data.storageCondition as any,
        minimumStockLevel: data.minimumStockLevel ?? 10,
        reorderLevel: data.reorderLevel ?? 50,
        isActive: true,

        // ✅ connect logged-in user automatically
        user: {
          connect: { id: user.id },
        },

        // ✅ optional first batch creation
        batches: data.initialBatch
          ? {
              create: {
                batchNumber: data.initialBatch.batchNumber,
                quantityReceived: data.initialBatch.quantityReceived,
                quantityAvailable: data.initialBatch.quantityReceived,
                unitPrice: data.initialBatch.unitPrice,
                sellingPrice: data.initialBatch.sellingPrice,
                manufactureDate: new Date(data.initialBatch.manufactureDate),
                expiryDate: new Date(data.initialBatch.expiryDate),
                supplierId: data.initialBatch.supplierId,
                locationId: data.initialBatch.locationId,
                status: "IN_STOCK",
              },
            }
          : undefined,
      },
    });

    redirect("/inventory");
  } catch (error) {
    console.error("Error creating drug:", error);
    throw new Error("Failed to create drug.");
  }
}
