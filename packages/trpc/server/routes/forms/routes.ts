import { TRPCError } from "@trpc/server";

import { router, publicProcedure } from "../../trpc";

import { createFormSchema } from "@repo/schemas";

import { createForm } from "@repo/services/src/forms/create-form";

export const formsRouter = router({
  create: publicProcedure
    
    .input(createFormSchema)
    .mutation(async ({ input }) => {
      try {
        const mockUserId = "temp-user-id";

        return await createForm(mockUserId, input);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create form",
        });
      }
    }),
});