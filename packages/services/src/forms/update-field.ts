import { eq } from "drizzle-orm";

import { db } from "@repo/database/src/client";

import { formFields } from "@repo/database/src/schema";

interface UpdateFieldInput {
  fieldId: string;

  label?: string;

  type?:
    | "short_text"
    | "long_text"
    | "email"
    | "number";
}

export async function updateField(
  input: UpdateFieldInput,
) {
  const [field] = await db
    .update(formFields)
    .set({
    label: input.label,

    type: input.type,
    })
    .where(
      eq(formFields.id, input.fieldId),
    )
    .returning();

  return field;
}