import {
  pgTable,
  index,
  uniqueIndex,
  bigserial,
  varchar,
  bigint,
  timestamp,
  integer,
  boolean,
  text,
  jsonb,
  customType,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const bytea = customType<{ data: Buffer; notNull: false; default: false }>({
  dataType() {
    return "bytea";
  },
});

export const versions = pgTable(
  "versions",
  {
    id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
    version: varchar("version", { length: 255 }),
    build: varchar("build", { length: 255 }),
    minSystemVersion: varchar("min_system_version", { length: 255 }),
    description: varchar("description", { length: 255 }),
    url: varchar("url", { length: 255 }),
    dsaSignature: varchar("dsa_signature", { length: 255 }),
    edSignature: varchar("ed_signature", { length: 255 }),
    length: varchar("length", { length: 255 }),
    appId: bigint("app_id", { mode: "bigint" }).references(() => apps.id),
    insertedAt: timestamp("inserted_at", { mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => {
    return {
      appIdIdx: index().on(table.appId),
      versionBuildIdx: uniqueIndex().on(table.version, table.build),
    };
  }
);

export const systemProfiles = pgTable("system_profiles", {
  id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
  appId: bigint("app_id", { mode: "bigint" }),
  appVersion: varchar("app_version", { length: 255 }),
  cpu64Bit: boolean("cpu64bit"),
  ncpu: integer("ncpu"),
  cpuFreqMhz: varchar("cpu_freq_mhz", { length: 255 }),
  cputype: varchar("cputype", { length: 255 }),
  cpusubtype: varchar("cpusubtype", { length: 255 }),
  model: varchar("model", { length: 255 }),
  ramMb: varchar("ram_mb", { length: 255 }),
  osVersion: varchar("os_version", { length: 255 }),
  lang: varchar("lang", { length: 255 }),
  insertedAt: timestamp("inserted_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});

export const apps = pgTable(
  "apps",
  {
    id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
    name: varchar("name", { length: 255 }),
    slug: varchar("slug", { length: 255 }),
    description: varchar("description", { length: 255 }),
    insertedAt: timestamp("inserted_at", { mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .notNull()
      .defaultNow(),
    details: text("details"),
    imageIcon: bytea("image_icon"),
    imageOne: bytea("image_one"),
    imageTwo: bytea("image_two"),
    imageThree: bytea("image_three"),
  },
  (table) => {
    return {
      slugIdx: uniqueIndex().on(table.slug),
    };
  }
);

export const systemProfileSummaries = pgTable(
  "system_profile_summaries",
  {
    id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
    period: varchar("period", { length: 255 }),
    dateStart: timestamp("date_start", { mode: "string" }),
    dateEnd: timestamp("date_end", { mode: "string" }),
    counts: jsonb("counts"),
    appId: bigint("app_id", { mode: "bigint" }).references(() => apps.id),
    insertedAt: timestamp("inserted_at", { mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => {
    return {
      appIdIdx: index().on(table.appId),
      appIdPeriodDateStartDateEndInde: index(
        "system_profile_summaries_app_id_period_date_start_date_end_inde"
      ).on(table.period, table.dateStart, table.dateEnd, table.appId),
    };
  }
);

export const appsRelations = relations(apps, ({ many }) => ({
  versions: many(versions),
}));

export const versionsRelations = relations(versions, ({ one }) => ({
  app: one(apps, {
    fields: [versions.appId],
    references: [apps.id],
  }),
}));
