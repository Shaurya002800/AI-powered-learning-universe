import { z } from "zod";

export const authSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long")
});

export const noteSchema = z.object({
  title: z.string().trim().max(120).optional(),
  content: z.string().max(10000).default(""),
  category: z.string().trim().max(60).optional().nullable(),
  tags: z.array(z.string().max(30)).default([]),
  isArchived: z.boolean().optional(),
  isPublic: z.boolean().optional()
});
