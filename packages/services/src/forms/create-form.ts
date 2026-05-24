import { z } from "zod";

import { db } from "@repo/database/src/client";
import { forms } from "@repo/database/src/schema/forms";
import { formFields } from "@repo/database/src/schema/form-fields";

import { createFormSchema } from "@repo/database/src/schema/forms";

type CreateFormInput = z.infer<typeof createFormSchema>;

export async function createForm(creatorId: string, input: CreateFormInput) {
  const parsed = createFormSchema.parse(input);

  const [createdForm] = await db
    .insert(forms)
    .values({
      creatorId,
      title: parsed.title,
      description: parsed.description,
      slug: parsed.slug,
      visibility: parsed.visibility,
      status: parsed.status,
      theme: parsed.theme,
      isTemplate: parsed.isTemplate,
      responseLimit: parsed.responseLimit,
      expiresAt: parsed.expiresAt
        ? new Date(parsed.expiresAt)
        : undefined,
    })
    .returning();

    if (!createdForm) {
        throw new Error("Failed to create form");
    }

  const fieldsToInsert = parsed.fields.map((field) => ({
    formId: createdForm.id,

    type: field.type,

    label: field.label,

    placeholder: field.placeholder,

    helperText: field.helperText,

    required: field.required.toString(),

    fieldOrder: field.fieldOrder,

    options: field.options,

    validation: field.validation,
  }));

  await db.insert(formFields).values(fieldsToInsert);

  return createdForm;
}