import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

import { validateSession } from "@repo/services/src/auth/validate-session";

export async function createContext({
  req,
  res,
}: CreateExpressContextOptions): Promise<{
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: any;
  session: any;
}> {
  const sessionToken = req.cookies?.session_token;

  if (!sessionToken) {
    return {
      req,
      res,
      user: null,
      session: null,
    };
  }

  const sessionData = await validateSession(sessionToken);

  if (!sessionData) {
    return {
      req,
      res,
      user: null,
      session: null,
    };
  }

  return {
    req,
    res,
    user: sessionData.user,
    session: sessionData,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;