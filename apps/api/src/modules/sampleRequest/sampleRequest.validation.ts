import { z } from "zod";

export const createSampleRequestSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  quantity: z.number().positive("Quantity must be positive"),
  unit: z.string().min(1, "Unit required"),
  deliveryAddress: z.string().min(5, "Delivery address required"),
  message: z.string().optional(),
});

export const updateSampleStatusSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "SHIPPED", "DELIVERED", "REJECTED"]),
  notes: z.string().optional(),
});

export const submitFeedbackSchema = z.object({
  rating: z.number().min(1, "Rating must be between 1-5").max(5, "Rating must be between 1-5"),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
});

export const listSampleSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default("1"),
  limit: z.string().regex(/^\d+$/).transform(Number).default("10"),
  status: z.enum(["PENDING", "APPROVED", "SHIPPED", "DELIVERED", "REJECTED"]).optional(),
  sort: z.enum(["createdAt", "updatedAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateSampleRequestInput = z.infer<typeof createSampleRequestSchema>;
export type UpdateSampleStatusInput = z.infer<typeof updateSampleStatusSchema>;
export type SubmitFeedbackInput = z.infer<typeof submitFeedbackSchema>;
export type ListSampleInput = z.infer<typeof listSampleSchema>;
