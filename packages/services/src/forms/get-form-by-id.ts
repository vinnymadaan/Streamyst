import { eq } from "drizzle-orm";

import { db } from "@repo/database/src/client";

import { forms } from "@repo/database";

export async function getFormById(id: string) {
  return db.query.forms.findFirst({
    where: eq(forms.id, id),

    with: {
      fields: true,
    },
  });
}