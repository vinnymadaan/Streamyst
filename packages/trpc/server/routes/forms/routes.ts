import { z } from "zod";

import { getFormById } from "@repo/services/src/forms/get-form-by-id";

import { TRPCError } from "@trpc/server";

import { router, protectedProcedure, publicProcedure } from "../../trpc";

import { createFormSchema } from "@repo/schemas";

import { createForm } from "@repo/services/src/forms/create-form";

import { getUserForms } from "@repo/services/src/forms/get-user-forms";

import { createField } from "@repo/services/src/forms/create-field";

import { updateField } from "@repo/services/src/forms/update-field";

import { deleteField } from "@repo/services/src/forms/delete-field";

import { getFormBySlug } from '@repo/services/src/forms/get-form-by-slug';

export const formsRouter = router({
  create: protectedProcedure
    .input(createFormSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        return await createForm(ctx.user.id, input);
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create form',
        });
      }
    }),
  list: protectedProcedure.query(async ({ ctx }) => {
    return getUserForms(ctx.user.id);
  }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      return getFormById(input.id);
    }),
  createField: protectedProcedure
    .input(
      z.object({
        formId: z.string(),

        type: z.enum(['short_text', 'long_text', 'email', 'number']),

        label: z.string(),

        fieldOrder: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return createField(input);
    }),
  updateField: protectedProcedure
    .input(
      z.object({
        fieldId: z.string(),

        label: z.string().optional(),

        type: z.enum(['short_text', 'long_text', 'email', 'number']).optional(),
      })
    )
    .mutation(async ({ input }) => {
      return updateField(input);
    }),
  deleteField: protectedProcedure
    .input(
      z.object({
        fieldId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return deleteField(input.fieldId);
    }),
  getBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ input }) => {
      const form = await getFormBySlug(input.slug);

      return form ?? null;
    }),
});