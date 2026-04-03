import { z } from "zod";

export const exportOrdersSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  status: z.enum(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]).optional(),
});

export const exportProductsSchema = z.object({
  category: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const exportAnalyticsSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  metrics: z.array(z.enum(["orders", "revenue", "products", "reviews"])).optional(),
});

export type ExportOrdersInput = z.infer<typeof exportOrdersSchema>;
export type ExportProductsInput = z.infer<typeof exportProductsSchema>;
export type ExportAnalyticsInput = z.infer<typeof exportAnalyticsSchema>;
