import { eq } from 'drizzle-orm';

import { db } from '@repo/database/src/client';

import { forms } from '@repo/database/src/schema/forms';

export async function deleteForm(formId: string, userId: string) {
  const form = await db.query.forms.findFirst({
    where: eq(forms.id, formId),
  });

  if (!form) {
    throw new Error('Form not found');
  }

  if (form.creatorId !== userId) {
    throw new Error('Unauthorized');
  }

  await db.delete(forms).where(eq(forms.id, formId));

  return {
    success: true,
  };
}
