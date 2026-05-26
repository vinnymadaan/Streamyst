import { relations } from "drizzle-orm";

import { forms } from "./forms";
import { formFields } from "./form-fields";

export const formsRelations =
  relations(forms, ({ many }) => ({
    fields: many(formFields),
  }));

export const formFieldsRelations =
  relations(formFields, ({ one }) => ({
    form: one(forms, {
      fields: [formFields.formId],

      references: [forms.id],
    }),
  }));