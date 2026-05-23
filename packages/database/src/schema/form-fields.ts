import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { forms } from "./forms";

export const fieldTypeEnum = pgEnum("field_type", [
  "short_text",
  "long_text",
  "email",
  "number",
  "single_select",
  "multi_select",
  "rating",
  "date",
]);

export const formFields = pgTable("form_fields", {
  id: uuid("id").defaultRandom().primaryKey(),

  formId: uuid("form_id")
    .references(() => forms.id, {
      onDelete: "cascade",
    })
    .notNull(),

  type: fieldTypeEnum("type").notNull(),

  label: text("label").notNull(),

  placeholder: text("placeholder"),

  helperText: text("helper_text"),

  required: text("required").default("false").notNull(),

  fieldOrder: integer("field_order").notNull(),

  options: jsonb("options"),

  validation: jsonb("validation"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});