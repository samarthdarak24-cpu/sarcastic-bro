/* ========================================================================
   Product Validation — Zod schemas
   ======================================================================== */

import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().max(2000).optional(),
  category: z.string().min(1),
  price: z.number().positive("Price must be positive"),
  unit: z.string().default("kg"),
  quantity: z.number().min(0).default(0),
  district: z.string().min(1),
  state: z.string().min(1),
  isODOP: z.boolean().default(false),
  qualityGrade: z.enum(["A", "B", "C"]).default("B"),
  harvestDate: z.string().optional(), // Receive as ISO string from frontend
  lat: z.number().optional(),
  lng: z.number().optional(),
  address: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
