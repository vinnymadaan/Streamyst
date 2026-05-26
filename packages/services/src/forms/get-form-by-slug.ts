import { eq } from 'drizzle-orm';

import { db } from '@repo/database/src/client';

import { forms } from '@repo/database/src/schema/forms';

export async function getFormBySlug(slug: string) {
  const form = await db.query.forms.findFirst({
    where: eq(forms.slug, slug),

    with: {
      fields: true,
    },
  });

  return form ?? null;
}
