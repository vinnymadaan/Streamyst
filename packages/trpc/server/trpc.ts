import { initTRPC, TRPCError } from "@trpc/server";

import type { Context } from "./context";

export const tRPCContext = initTRPC.context<Context>().create();

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;

const enforceUserIsAuthed = tRPCContext.middleware(
  async ({ ctx, next }) => {
    if (!ctx.user || !ctx.session) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Authentication required",
      });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
        session: ctx.session,
      },
    });
  },
);

export const protectedProcedure: any =
  tRPCContext.procedure.use(enforceUserIsAuthed);