import {
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { responses } from "./responses";
import { formFields } from "./form-fields";

export const responseAnswers = pgTable("response_answers", {
  id: uuid("id").defaultRandom().primaryKey(),

  responseId: uuid("response_id")
    .references(() => responses.id, {
      onDelete: "cascade",
    })
    .notNull(),

  fieldId: uuid("field_id")
    .references(() => formFields.id, {
      onDelete: "cascade",
    })
    .notNull(),

  value: text("value").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});