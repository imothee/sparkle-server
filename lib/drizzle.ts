import {
  apps,
  appsRelations,
  systemProfiles,
  systemProfileSummaries,
  versions,
  versionsRelations,
} from "./schema";

import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

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

export const db = drizzle(sql, {
  schema: {
    apps,
    appsRelations,
    systemProfiles,
    systemProfileSummaries,
    versions,
    versionsRelations,
  },
});
