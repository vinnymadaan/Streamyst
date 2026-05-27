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

import { submitResponse } from '@repo/services/src/forms/submit-response';

import { getFormResponses } from '@repo/services/src/forms/get-form-responses';

import { toggleFormPublish } from '@repo/services/src/forms/toggle-form-publish';

import { updateForm } from '@repo/services/src/forms/update-form';

import { deleteForm } from '@repo/services/src/forms/delete-form';

export const formsRouter = router({
  create: protectedProcedure
    .input(createFormSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        return await createForm(ctx.user.id, input);
      } catch (error) {
        console.error('CREATE FORM ERROR:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create form',
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
    .query(async ({ input, ctx }) => {
      return getFormById(input.id, ctx.user.id);
    }),
  createField: protectedProcedure
    .input(
      z.object({
        formId: z.string().uuid(),

        type: z.enum(['short_text', 'long_text', 'email', 'number']),

        label: z.string().min(1).max(200),

        fieldOrder: z.number().int(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return createField(input, ctx.user.id);
    }),
  updateField: protectedProcedure
    .input(
      z.object({
        fieldId: z.string().uuid(),

        label: z.string().min(1).max(200).optional(),

        type: z.enum(['short_text', 'long_text', 'email', 'number']).optional(),
        required: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return updateField(input, ctx.user.id);
    }),
  deleteField: protectedProcedure
    .input(
      z.object({
        fieldId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return deleteField(input.fieldId, ctx.user.id);
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
  submitResponse: publicProcedure
    .input(
      z.object({
        formId: z.string().uuid(),

        answers: z.record(z.string().uuid(), z.string().max(5000)),
      })
    )
    .mutation(async ({ input }) => {
      return submitResponse(input);
    }),
  getResponses: protectedProcedure
    .input(
      z.object({
        formId: z.string().uuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      return getFormResponses(input.formId, ctx.user.id);
    }),
  togglePublish: protectedProcedure
    .input(
      z.object({
        formId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return toggleFormPublish(input.formId, ctx.user.id);
    }),
  getMine: protectedProcedure.query(async ({ ctx }) => {
    try {
      console.log('SESSION:', ctx.session);

      console.log('USER:', ctx.user);

      const forms = await getUserForms(ctx.user.id);

      return forms;
    } catch (error) {
      console.error('GET MINE ERROR:');

      console.error(error);

      throw error;
    }
  }),
  update: protectedProcedure
    .input(
      z.object({
        formId: z.string().uuid(),

        title: z.string().min(3).max(200).optional(),

        description: z.string().max(2000).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return updateForm(input, ctx.user.id);
    }),
  delete: protectedProcedure
    .input(
      z.object({
        formId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return deleteForm(input.formId, ctx.user.id);
    }),
});