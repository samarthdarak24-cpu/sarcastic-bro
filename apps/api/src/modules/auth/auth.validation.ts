import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number"),
  role: z.enum(["FARMER", "BUYER"]),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number").optional().or(z.literal('')),
  district: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
});

export const loginSchema = z
  .object({
    identifier: z.string().trim().min(1, "Email or phone is required").optional(),
    email: z.string().trim().toLowerCase().email("Invalid email address").optional(),
    password: z.string().min(1, "Password is required"),
  })
  .superRefine((data, ctx) => {
    if (!data.identifier && !data.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email or phone is required",
        path: ["identifier"],
      });
    }
  });

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().regex(/^[6-9]\d{9}$/).optional(),
  district: z.string().optional(),
  state: z.string().optional(),
});

export const submitKYCSchema = z.object({
  role: z.enum(["FARMER", "BUYER"]),
  // Farmer specific
  aadharNumber: z.string().regex(/^\d{12}$/).optional(),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).optional(),
  landAreaInHectares: z.number().positive().optional(),
  soilType: z.string().optional(),
  mainCrops: z.string().optional(),
  // Buyer specific
  companyName: z.string().optional(),
  gstNumber: z.string().optional(),
  businessLicense: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type SubmitKYCInput = z.infer<typeof submitKYCSchema>;
