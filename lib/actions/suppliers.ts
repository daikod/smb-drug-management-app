"use server";

import { prisma } from "../prisma";
import { z } from "zod";
import { redirect } from "next/navigation";

const SupplierSchema = z.object({
  name: z.string().min(1),
  contactPerson: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().optional(),
  country: z.string().min(1),
  postalCode: z.string().optional(),
  taxId: z.string().optional(),
  paymentTerms: z.string().optional(),
});

export async function createSupplier(formData: FormData) {
  const parsed = SupplierSchema.safeParse({
    name: formData.get("name"),
    contactPerson: formData.get("contactPerson"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    city: formData.get("city"),
    state: formData.get("state"),
    country: formData.get("country"),
    postalCode: formData.get("postalCode"),
    taxId: formData.get("taxId"),
    paymentTerms: formData.get("paymentTerms"),
  });

  if (!parsed.success) throw new Error("Invalid supplier data");

  await prisma.supplier.create({ data: parsed.data });
  redirect("/suppliers");
}

export async function deleteSupplier(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.supplier.delete({ where: { id } });
}

