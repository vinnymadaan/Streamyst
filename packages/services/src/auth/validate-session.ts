import { eq, gt } from "drizzle-orm";

import { db } from "@repo/database/src/client";

export async function validateSession(sessionToken: string) {
  const session = await db.query.sessions.findFirst({
    where: (sessionsTable, { and }) =>
      and(
        eq(sessionsTable.sessionToken, sessionToken),
        gt(sessionsTable.expiresAt, new Date()),
      ),
  });

  if (!session) {
    return null;
  }

  return {
    ...session,
    user: null,
  };
}