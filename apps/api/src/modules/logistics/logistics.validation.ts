import { z } from 'zod';

/**
 * Validation schemas for Logistics API endpoints
 */

// Farmer requests pickup
export const requestPickupSchema = z.object({
  orderId: z.string().uuid('Invalid order ID format'),
  pickupLocation: z.string().min(5, 'Pickup location must be at least 5 characters'),
  pickupLat: z.number().optional(),
  pickupLng: z.number().optional(),
  dropLocation: z.string().min(5, 'Drop location must be at least 5 characters'),
  dropLat: z.number().optional(),
  dropLng: z.number().optional(),
  contactPhone: z.string().min(10, 'Valid phone number required'),
  notes: z.string().max(500).optional(),
});

// FPO assigns driver
export const assignDriverSchema = z.object({
  logisticsId: z.string().uuid('Invalid logistics ID format'),
  driverName: z.string().min(2, 'Driver name required'),
  driverPhone: z.string().min(10, 'Valid driver phone required'),
  vehicleNumber: z.string().min(6, 'Valid vehicle number required'),
  estimatedDelivery: z.string().datetime('Valid estimated delivery date required'),
  notes: z.string().max(500).optional(),
});

// Update driver location
export const updateLocationSchema = z.object({
  logisticsId: z.string().uuid('Invalid logistics ID format'),
  lat: z.number().min(-90).max(90, 'Invalid latitude'),
  lng: z.number().min(-180).max(180, 'Invalid longitude'),
  status: z.enum(['PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY']).optional(),
});

// Mark as delivered
export const markDeliveredSchema = z.object({
  logisticsId: z.string().uuid('Invalid logistics ID format'),
  deliveryProof: z.array(z.string()).max(10).optional(), // URLs of photos
  deliveryNotes: z.string().max(1000).optional(),
});

// Update logistics status
export const updateStatusSchema = z.object({
  logisticsId: z.string().uuid('Invalid logistics ID format'),
  status: z.enum(['REQUESTED', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']),
  reason: z.string().max(500).optional(), // Required for CANCELLED
});

// Type exports
export type RequestPickupInput = z.infer<typeof requestPickupSchema>;
export type AssignDriverInput = z.infer<typeof assignDriverSchema>;
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;
export type MarkDeliveredInput = z.infer<typeof markDeliveredSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
