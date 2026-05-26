import { db } from "@repo/database/src/client";

import { formFields } from "@repo/database/src/schema";

interface CreateFieldInput {
  formId: string;

  type:
    | "short_text"
    | "long_text"
    | "email"
    | "number";

  label: string;

  fieldOrder: number;
}

export async function createField(
  input: CreateFieldInput,
) {
  const [field] = await db
    .insert(formFields)
    .values({
      formId: input.formId,
      type: input.type,
      label: input.label,
      fieldOrder: input.fieldOrder,
      required: false,
    })
    .returning();

  return field;
}