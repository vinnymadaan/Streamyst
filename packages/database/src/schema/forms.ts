import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { users } from "./users";

export const formVisibilityEnum = pgEnum("form_visibility", [
  "public",
  "unlisted",
]);

export const formStatusEnum = pgEnum("form_status", [
  "draft",
  "published",
  "archived",
]);

export const forms = pgTable("forms", {
  id: uuid("id").defaultRandom().primaryKey(),

  creatorId: uuid("creator_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),

  title: text("title").notNull(),

  description: text("description"),

  slug: text("slug").unique().notNull(),

  visibility: formVisibilityEnum("visibility")
    .default("unlisted")
    .notNull(),

  status: formStatusEnum("status")
    .default("draft")
    .notNull(),

  theme: text("theme"),

  isTemplate: boolean("is_template").default(false).notNull(),

  responseLimit: integer("response_limit"),

  expiresAt: timestamp("expires_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});