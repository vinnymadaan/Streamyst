/*
1. loads variables from .env
2. This imports Drizzle ORM. Drizzle helps us use database easily with TypeScript.
3. This imports the PostgreSQL client. This is the actual connector talking to Neon.
4. This reads your database URL from .env. The ! means: "I promise this value exists"
5. This creates actual connection to Neon. app ↔ Neon
6. reusable database object:
    db.insert(...)
    db.select(...)
    db.update(...)
*/

import "dotenv/config"; 
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client);