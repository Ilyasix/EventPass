import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(1, "title is required"),
  startsAt: z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), "startsAt must be ISO date string"),
  location: z.string().min(1, "location is required"),
});

export const registerSchema = z.object({
  personId: z.string().uuid("personId must be UUID"),
});
