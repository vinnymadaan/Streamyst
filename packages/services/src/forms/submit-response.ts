import { eq } from 'drizzle-orm';

import { db } from '@repo/database/src/client';

import {
  forms,
  formFields,
  responses,
  responseAnswers,
} from '@repo/database/src/schema';

interface SubmitResponseInput {
  formId: string;

  answers: Record<string, string>;
}

export async function submitResponse(input: SubmitResponseInput) {
  const form = await db.query.forms.findFirst({
    where: eq(forms.id, input.formId),

    with: {
      fields: true,
    },
  });

  if (!form) {
    throw new Error('Form not found');
  }

  if (form.status !== 'published') {
    throw new Error('Form is not published');
  }

  const existingResponses = await db.query.responses.findMany({
    where: eq(responses.formId, input.formId),
  });

  if (form.responseLimit && existingResponses.length >= form.responseLimit) {
    throw new Error('Response limit reached');
  }

  for (const field of form.fields) {
    if (field.required && !input.answers[field.id]) {
      throw new Error(`${field.label} is required`);
    }
  }

  const validFieldIds = form.fields.map((field) => field.id);

  const filteredAnswers = Object.entries(input.answers).filter(([fieldId]) =>
    validFieldIds.includes(fieldId)
  );

  const [response] = await db
    .insert(responses)
    .values({
      formId: input.formId,
    })
    .returning();

  if (!response) {
    throw new Error('Failed to create response');
  }

  const answersToInsert = filteredAnswers.map(([fieldId, value]) => ({
    responseId: response.id,

    fieldId,

    value: value.slice(0, 5000),
  }));

  await db.insert(responseAnswers).values(answersToInsert);

  return response;
}
