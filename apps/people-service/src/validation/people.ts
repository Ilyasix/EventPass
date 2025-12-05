import { z } from "zod";

export const createPersonSchema = z.object({
  fullName: z.string().min(1, "fullName is required"),
  email: z.string().email("email must be valid"),
  phone: z.string().regex(/^[+0-9]{7,20}$/, "phone must be valid"),
});

export const patchPersonSchema = z
  .object({
    fullName: z.string().min(1, "fullName must be non-empty").optional(),
    email: z.string().email("email must be valid").optional(),
    phone: z
      .string()
      .regex(/^[+0-9]{7,20}$/, "phone must be valid")
      .optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "At least one field is required" });
