import { z } from "zod";

import { fieldSchema } from "./forms";

type Field = z.infer<typeof fieldSchema>;

export function generateResponseSchema(fields: Field[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    let validator: z.ZodTypeAny;

    switch (field.type) {
      case "short_text":
      case "long_text":
        validator = z.string();
        break;

      case "email":
        validator = z.string().email();
        break;

      case "number":
        validator = z.number();
        break;

      case "single_select":
        validator = z.string();
        break;

      case "multi_select":
        validator = z.array(z.string());
        break;

      case "rating":
        validator = z.number().min(1).max(5);
        break;

      case "date":
        validator = z.string().date();
        break;

      default:
        validator = z.any();
    }

    if (!field.required) {
      validator = validator.optional();
    }

    shape[field.id ?? crypto.randomUUID()] = validator;
  }

  return z.object(shape);
}