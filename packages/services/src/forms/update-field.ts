import { eq } from 'drizzle-orm';

import { db } from '@repo/database/src/client';

import { formFields } from '@repo/database/src/schema';

interface UpdateFieldInput {
  fieldId: string;

  label?: string;

  type?: 'short_text' | 'long_text' | 'email' | 'number';
  required?: boolean;
}

export async function updateField(input: UpdateFieldInput, userId: string) {
  const field = await db.query.formFields.findFirst({
    where: eq(formFields.id, input.fieldId),

    with: {
      form: true,
    },
  });

  if (!field) {
    throw new Error('Field not found');
  }

  if (field.form.creatorId !== userId) {
    throw new Error('Unauthorized');
  }

  const [updatedField] = await db
    .update(formFields)
    .set({
      label: input.label,

      type: input.type,

      required: input.required,
    })
    .where(eq(formFields.id, input.fieldId))
    .returning();

  return updatedField;
}
