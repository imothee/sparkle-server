import {
  apps,
  appsRelations,
  systemProfiles,
  systemProfileSummaries,
  versions,
  versionsRelations,
} from "./schema";

import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export {
  apps,
  appsRelations,
  systemProfiles,
  systemProfileSummaries,
  versions,
  versionsRelations,
};

export type App = InferSelectModel<typeof apps>;
export type SystemProfile = InferInsertModel<typeof systemProfiles>;
export type SystemProfileSummary = InferInsertModel<
  typeof systemProfileSummaries
>;
export type Version = InferInsertModel<typeof versions>;

const client = postgres({
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  database: process.env.PG_DB,
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  ssl: { rejectUnauthorized: false },
});
export const db = drizzle(client, {
  schema: {
    apps,
    appsRelations,
    systemProfiles,
    systemProfileSummaries,
    versions,
    versionsRelations,
  },
});
