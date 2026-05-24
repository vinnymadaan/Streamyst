import { z } from "zod";

export const fieldTypeEnum = z.enum([
  "short_text",
  "long_text",
  "email",
  "number",
  "single_select",
  "multi_select",
  "rating",
  "date",
]);

export const fieldSchema = z.object({
  id: z.string().uuid().optional(),

  type: fieldTypeEnum,

  label: z.string().min(1),

  placeholder: z.string().optional(),

  helperText: z.string().optional(),

  required: z.boolean().default(false),

  fieldOrder: z.number(),

  options: z.array(z.string()).optional(),

  validation: z.record(z.any()).optional(),
});

export const createFormSchema = z.object({
  title: z.string().min(1).max(120),

  description: z.string().optional(),

  slug: z
    .string()
    .min(3)
    .max(80)
    .regex(/^[a-z0-9-]+$/),

  visibility: z.enum(["public", "unlisted"]).default("unlisted"),

  status: z
    .enum(["draft", "published", "archived"])
    .default("draft"),

  theme: z.string().optional(),

  isTemplate: z.boolean().default(false),

  responseLimit: z.number().optional(),

  expiresAt: z.string().datetime().optional(),

  fields: z.array(fieldSchema).min(1),
});