import { eq } from 'drizzle-orm';

import { db } from '@repo/database/src/client';

import { formFields } from '@repo/database/src/schema';

export async function deleteField(fieldId: string, userId: string) {
  const field = await db.query.formFields.findFirst({
    where: eq(formFields.id, fieldId),

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

  await db.delete(formFields).where(eq(formFields.id, fieldId));

  return {
    success: true,
  };
}
