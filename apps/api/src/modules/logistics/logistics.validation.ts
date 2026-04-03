import { z } from "zod";

export const bookShipmentSchema = z.object({
  orderId: z.string().uuid("Invalid order ID"),
  provider: z.string().min(2, "Provider name required"),
  fromLocation: z.string().min(5, "Pickup location required"),
  toLocation: z.string().min(5, "Delivery location required"),
  estimatedDeliveryDate: z.string().datetime().optional(),
  temperature: z.number().optional(),
  humidity: z.number().optional(),
});

export const updateShipmentStatusSchema = z.object({
  status: z.enum(["PENDING", "PICKUP", "IN_TRANSIT", "DELIVERED", "CANCELLED"]),
  trackingId: z.string().optional(),
  temperature: z.number().optional(),
  humidity: z.number().optional(),
  notes: z.string().optional(),
});

export const listShipmentsSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default("1"),
  limit: z.string().regex(/^\d+$/).transform(Number).default("10"),
  status: z.enum(["PENDING", "PICKUP", "IN_TRANSIT", "DELIVERED", "CANCELLED"]).optional(),
  provider: z.string().optional(),
  sort: z.enum(["createdAt", "estimatedDeliveryDate"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type BookShipmentInput = z.infer<typeof bookShipmentSchema>;
export type UpdateShipmentStatusInput = z.infer<typeof updateShipmentStatusSchema>;
export type ListShipmentsInput = z.infer<typeof listShipmentsSchema>;
