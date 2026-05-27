import { relations } from 'drizzle-orm';

import { forms } from './forms';
import { formFields } from './form-fields';
import { responses } from './responses';
import { responseAnswers } from './response_answers';


export const formsRelations = relations(forms, ({ many }) => ({
  fields: many(formFields),

  responses: many(responses),
}));

export const formFieldsRelations = relations(formFields, ({ one }) => ({
  form: one(forms, {
    fields: [formFields.formId],

    references: [forms.id],
  }),
}));

export const responsesRelations = relations(responses, ({ many }) => ({
  answers: many(responseAnswers),
}));

export const responseAnswersRelations = relations(
  responseAnswers,
  ({ one }) => ({
    response: one(responses, {
      fields: [responseAnswers.responseId],

      references: [responses.id],
    }),

    field: one(formFields, {
      fields: [responseAnswers.fieldId],

      references: [formFields.id],
    }),
  })
);