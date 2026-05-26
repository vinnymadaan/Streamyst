import { eq } from "drizzle-orm";

import { db } from "@repo/database/src/client";

import { formFields } from "@repo/database/src/schema";

export async function deleteField(
  fieldId: string,
) {
  await db
    .delete(formFields)
    .where(eq(formFields.id, fieldId));

  return {
    success: true,
  };
}