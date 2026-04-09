import { z } from "zod";

export const submitRatingSchema = z.object({
  orderId: z.string().uuid("Invalid order ID"),
  toUserId: z.string().uuid("Invalid user ID"),
  stars: z.number().int().min(1).max(5),
  review: z.string().max(500, "Review must be 500 characters or less").optional(),
});

export type SubmitRatingInput = z.infer<typeof submitRatingSchema>;
