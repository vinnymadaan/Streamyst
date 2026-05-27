import { eq, and } from 'drizzle-orm';

import { db } from '@repo/database/src/client';

import { forms } from '@repo/database/src/schema/forms';

export async function getFormBySlug(slug: string) {
  const form = await db.query.forms.findFirst({
    where: and(eq(forms.slug, slug), eq(forms.status, 'published')),

    with: {
      fields: true,
    },
  });

  return form ?? null;
}
