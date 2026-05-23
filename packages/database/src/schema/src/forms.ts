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

  label: z.string().min(1).max(200),

  placeholder: z.string().max(200).optional(),

  helperText: z.string().max(500).optional(),

  required: z.boolean(),

  fieldOrder: z.number().int().min(0),

  options: z.array(z.string()).optional(),

  validation: z
    .object({
      minLength: z.number().optional(),
      maxLength: z.number().optional(),
      min: z.number().optional(),
      max: z.number().optional(),
      regex: z.string().optional(),
    })
    .optional(),
});


export const formVisibilityEnum = z.enum([
  "public",
  "unlisted",
]);

export const formStatusEnum = z.enum([
  "draft",
  "published",
  "archived",
]);

export const createFormSchema = z.object({
  title: z.string().min(3).max(200),

  description: z.string().max(2000).optional(),

  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9-]+$/),

  visibility: formVisibilityEnum.default("unlisted"),

  status: formStatusEnum.default("draft"),

  theme: z.string().max(100).optional(),

  isTemplate: z.boolean().default(false),

  responseLimit: z.number().int().positive().optional(),

  expiresAt: z.string().datetime().optional(),

  fields: z.array(fieldSchema).min(1),
});