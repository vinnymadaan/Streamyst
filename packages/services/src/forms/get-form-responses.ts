import { eq } from 'drizzle-orm';

import { db } from '@repo/database/src/client';

import { forms, responses } from '@repo/database/src/schema';

export async function getFormResponses(formId: string, userId: string) {
  const form = await db.query.forms.findFirst({
    where: eq(forms.id, formId),
  });

  if (!form) {
    throw new Error('Form not found');
  }

  if (form.creatorId !== userId) {
    throw new Error('Unauthorized');
  }

  const formResponses = await db.query.responses.findMany({
    where: eq(responses.formId, formId),

    with: {
      answers: {
        with: {
          field: true,
        },
      },
    },

    orderBy: (responses, { desc }) => [desc(responses.createdAt)],
  });

  return formResponses;
}
