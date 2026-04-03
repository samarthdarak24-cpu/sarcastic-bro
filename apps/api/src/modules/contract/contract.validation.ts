import { z } from "zod";

export const createContractSchema = z.object({
  farmerId: z.string().uuid("Invalid farmer ID"),
  buyerId: z.string().uuid("Invalid buyer ID"),
  orderId: z.string().uuid("Invalid order ID").optional(),
  terms: z.string().min(10, "Terms must be at least 10 characters"),
  totalValue: z.number().positive("Total value must be positive"),
  expiresAt: z.string().datetime().optional(),
  isPreBooking: z.boolean().optional().default(false),
  productName: z.string().optional().default("Agri Product"),
  targetDate: z.string().datetime().optional(),
});

export const updateContractSchema = z.object({
  terms: z.string().min(10).optional(),
  totalValue: z.number().positive().optional(),
  expiresAt: z.string().datetime().optional(),
});

export const signContractSchema = z.object({
  signed: z.boolean().default(true),
});

export const listContractSchema = z.object({
  page: z.string().regex(/^\d+$/, "Page must be a number").transform(Number).default("1"),
  limit: z.string().regex(/^\d+$/, "Limit must be a number").transform(Number).default("10"),
  status: z.enum(["DRAFT", "ACTIVE", "COMPLETED", "TERMINATED"]).optional(),
  sort: z.enum(["createdAt", "expiresAt", "totalValue"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  isPreBooking: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
});

export type CreateContractInput = z.infer<typeof createContractSchema>;
export type UpdateContractInput = z.infer<typeof updateContractSchema>;
export type SignContractInput = z.infer<typeof signContractSchema>;
export type ListContractInput = z.infer<typeof listContractSchema>;
