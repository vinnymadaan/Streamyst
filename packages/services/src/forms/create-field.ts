import { eq } from 'drizzle-orm';

import { db } from '@repo/database/src/client';

import { forms, formFields } from '@repo/database/src/schema';

interface CreateFieldInput {
  formId: string;

  type: 'short_text' | 'long_text' | 'email' | 'number';

  label: string;

  fieldOrder: number;
}

export async function createField(input: CreateFieldInput, userId: string) {
  const form = await db.query.forms.findFirst({
    where: eq(forms.id, input.formId),
  });

  if (!form) {
    throw new Error('Form not found');
  }

  if (form.creatorId !== userId) {
    throw new Error('Unauthorized');
  }

  const [field] = await db
    .insert(formFields)
    .values({
      formId: input.formId,

      type: input.type,

      label: input.label,

      required: false,

      fieldOrder: input.fieldOrder,
    })
    .returning();

  return field;
}
