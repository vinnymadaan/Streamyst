import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { forms } from "./forms";

export const responses = pgTable("responses", {
  id: uuid("id").defaultRandom().primaryKey(),

  formId: uuid("form_id")
    .references(() => forms.id, {
      onDelete: "cascade",
    })
    .notNull(),

  respondentIdentifier: text("respondent_identifier"),

  completionTime: integer("completion_time"),

  submittedAt: timestamp("submitted_at").defaultNow().notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});