import { TRPCError } from "@trpc/server";

import { router, protectedProcedure } from "../../trpc";

import { createFormSchema } from "@repo/schemas";

import { createForm } from "@repo/services/src/forms/create-form";

export const formsRouter = router({
  create: protectedProcedure
    .input(createFormSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        return await createForm(
          ctx.user.id,
          input,
        );
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create form",
        });
      }
    }),
});