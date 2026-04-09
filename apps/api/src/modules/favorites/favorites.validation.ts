import { z } from "zod";

export const addFavoriteSchema = z.object({
  farmerId: z.string().uuid("Invalid farmer ID"),
  notes: z.string().max(500, "Notes must be 500 characters or less").optional(),
});

export const updateFavoriteSchema = z.object({
  notes: z.string().max(500, "Notes must be 500 characters or less").optional(),
});

export type AddFavoriteInput = z.infer<typeof addFavoriteSchema>;
export type UpdateFavoriteInput = z.infer<typeof updateFavoriteSchema>;
