import { eq } from 'drizzle-orm';

import { db } from '@repo/database/src/client';

import { forms } from '@repo/database/src/schema/forms';

export async function toggleFormPublish(formId: string, userId: string) {
  const form = await db.query.forms.findFirst({
    where: eq(forms.id, formId),
  });

  if (!form) {
    throw new Error('Form not found');
  }

  if (form.creatorId !== userId) {
    throw new Error('Unauthorized');
  }

  const nextStatus = form.status === 'published' ? 'draft' : 'published';

  const [updatedForm] = await db
    .update(forms)
    .set({
      status: nextStatus,
    })
    .where(eq(forms.id, formId))
    .returning();

  return updatedForm;
}
