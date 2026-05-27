import { eq } from 'drizzle-orm';

import { db } from '@repo/database/src/client';

import { sessions } from '@repo/database/src/schema';

export async function logout(sessionToken: string) {
  await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));

  return {
    success: true,
  };
}
