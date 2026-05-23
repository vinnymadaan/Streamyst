import { relations } from "drizzle-orm";

import { users } from "./users";
import { forms } from "./forms";
import { formFields } from "./form-fields";
import { responses } from "./responses";
import { responseAnswers } from "./response_answers";

export const usersRelations = relations(users, ({ many }) => ({
  forms: many(forms),
}));

export const formsRelations = relations(forms, ({ one, many }) => ({
  creator: one(users, {
    fields: [forms.creatorId],
    references: [users.id],
  }),

  fields: many(formFields),

  responses: many(responses),
}));

export const formFieldsRelations = relations(formFields,({ one, many }) => ({
    form: one(forms, {
      fields: [formFields.formId],
      references: [forms.id],
    }),

    answers: many(responseAnswers),
  })
);

export const responsesRelations = relations(responses,({ one, many }) => ({
    form: one(forms, {
      fields: [responses.formId],
      references: [forms.id],
    }),

    answers: many(responseAnswers),
  })
);

export const responseAnswersRelations = relations(responseAnswers,({ one }) => ({
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