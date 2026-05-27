import { eq } from 'drizzle-orm';

import { db } from '@repo/database/src/client';

import { forms } from '@repo/database/src/schema/forms';

interface UpdateFormInput {
  formId: string;

  title?: string;

  description?: string;
}

export async function updateForm(input: UpdateFormInput, userId: string) {
  const form = await db.query.forms.findFirst({
    where: eq(forms.id, input.formId),
  });

  if (!form) {
    throw new Error('Form not found');
  }

  if (form.creatorId !== userId) {
    throw new Error('Unauthorized');
  }

  const [updatedForm] = await db
    .update(forms)
    .set({
      title: input.title,

      description: input.description,
    })
    .where(eq(forms.id, input.formId))
    .returning();

  return updatedForm;
}
