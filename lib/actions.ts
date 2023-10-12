import {
  db,
  apps,
  systemProfiles,
  systemProfileSummaries,
} from "@/lib/drizzle";
import { eq, and, gte, lt, inArray } from "drizzle-orm";
import type { App, SystemProfile, SystemProfileSummary } from "@/lib/drizzle";

export const getApp = async (slug: string) => {
  return db.query.apps.findFirst({
    where: eq(apps.slug, slug),
    with: {
      versions: {
        orderBy: (versions, { desc }) => [desc(versions.version)],
      },
    },
  });
};

export const getApps = async () => {
  return db.query.apps.findMany();
};

export const insertSystemProfile = async (profile: SystemProfile) => {
  return db.insert(systemProfiles).values(profile);
};

export const deleteSystemProfilesBefore = async (appId: bigint, end: Date) => {
  return db
    .delete(systemProfiles)
    .where(
      and(eq(systemProfiles.appId, appId), lt(systemProfiles.insertedAt, end))
    );
};

export const deleteSystemProfilesIn = async (systemProfilesIds: bigint[]) => {
  return db
    .delete(systemProfiles)
    .where(inArray(systemProfiles.id, systemProfilesIds));
};

export const getAppSystemProfilesBetween = async (
  appId: bigint,
  from: Date,
  to: Date
) => {
  return db.query.systemProfiles.findMany({
    where: and(
      eq(systemProfiles.appId, appId),
      gte(systemProfiles.insertedAt, from),
      lt(systemProfiles.insertedAt, to)
    ),
  });
};

export const getAppSystemProfileSummary = async (
  appId: bigint,
  start: Date
) => {
  return db.query.systemProfileSummaries.findFirst({
    where: and(
      eq(systemProfileSummaries.appId, appId),
      eq(systemProfileSummaries.dateStart, start)
    ),
  });
};

export const insertSystemProfileSummary = async (
  summary: SystemProfileSummary
) => {
  return db.insert(systemProfileSummaries);
};

export const updateSystemProfileSummary = async (
  id: bigint,
  summary: SystemProfileSummary
) => {
  return db
    .update(systemProfileSummaries)
    .set(summary)
    .where(eq(systemProfileSummaries.id, id));
};
