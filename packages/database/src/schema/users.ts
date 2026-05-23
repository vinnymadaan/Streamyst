/*
1. We are importing tools from Drizzle: 
    pgTable: "Create a PostgreSQL table"
    text: store text/string data eg name, email, image URL
    timestamp: store time/date eg: user created at, updated at
    uuid: generate unique IDs

2. We are craeting a table named users inside database.
    uuid("id") means create a column named: id, with UUID type.

    WHAT IS UUID? Instead of ids like 1,2,3 we get a82ge2r327ub...

    .defaultRandom() database auto-generates ID so we don't auto-generates ID
    .primaryKey() THIS is the main identifier. Every user MUST have unique primary key. This is the “identity” of user.

    text("name") Creates text column named: name
    .notNull() means user MUST have name, db will not rejectnull, empty, missing

    .unique() means no duplicate emails allowed
*/

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),

  email: text("email").notNull().unique(),

  image: text("image"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});