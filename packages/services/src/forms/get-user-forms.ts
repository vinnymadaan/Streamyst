import { eq } from 'drizzle-orm';

import { db } from '@repo/database/src/client';

import { forms } from '@repo/database/src/schema/forms';



export async function getUserForms(userId: string) {
  return db.query.forms.findMany({
    where: eq(forms.creatorId, userId),

    orderBy: (forms, { desc }) => [desc(forms.createdAt)],
  });
}
