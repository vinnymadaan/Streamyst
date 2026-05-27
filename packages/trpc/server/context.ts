import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

import { validateSession } from "@repo/services/src/auth/validate-session";

type TRPCContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: any;
  session: any;
};

export const createContext = async ({
  req,
  res,
}: CreateExpressContextOptions): Promise<TRPCContext> => {
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
    user: {
      id: sessionData.userId,
    },
    session: sessionData,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;