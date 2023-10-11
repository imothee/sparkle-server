import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import {
  deleteSystemProfilesBefore,
  getAppSystemProfileSummary,
  getAppSystemProfilesBetween,
  getApps,
  insertSystemProfileSummary,
  updateSystemProfileSummary,
} from "@/lib/actions";

type Count = {
  users: number;
  app_version: Record<string, number>;
  cpu64bit: Record<string, number>;
  cpu_freq_mhz: Record<string, number>;
  cputype: Record<string, number>;
  cpusubtype: Record<string, number>;
  model: Record<string, number>;
  ncpu: Record<string, number>;
  os_version: Record<string, number>;
  ram_mb: Record<string, number>;
};

const countBooleanField = (
  obj: Record<string, number>,
  field: boolean | null
) => {
  if (field === null) {
    return;
  }

  const key = field ? "true" : "false";

  if (obj[key]) {
    obj[key] += 1;
  } else {
    obj[key] = 1;
  }
};

const countField = (
  obj: Record<string, number>,
  field: string | number | null
) => {
  if (field === null) {
    return;
  }

  if (obj[field]) {
    obj[field] += 1;
  } else {
    obj[field] = 1;
  }
};

export async function GET() {
  const now = DateTime.utc();
  const start = now.startOf("week");
  const end = now.endOf("week");

  console.log(start.toISO(), end.toISO());

  const apps = await getApps();

  for (const app of apps) {
    const profiles = await getAppSystemProfilesBetween(
      app.id,
      start.toJSDate(),
      end.toJSDate()
    );

    const summary = await getAppSystemProfileSummary(app.id, start.toJSDate());

    const counts: Count = summary
      ? (summary.counts as Count)
      : {
          users: 0,
          app_version: {},
          cpu64bit: {},
          cpu_freq_mhz: {},
          cputype: {},
          cpusubtype: {},
          model: {},
          ncpu: {},
          os_version: {},
          ram_mb: {},
        };

    for (const profile of profiles) {
      counts.users += 1;
      countField(counts.app_version, profile.appVersion);
      countBooleanField(counts.cpu64bit, profile.cpu64Bit);
      countField(counts.cpu_freq_mhz, profile.cpuFreqMhz);
      countField(counts.cputype, profile.cputype);
      countField(counts.cpusubtype, profile.cpusubtype);
      countField(counts.model, profile.model);
      countField(counts.ncpu, profile.ncpu);
      countField(counts.os_version, profile.osVersion);
      countField(counts.ram_mb, profile.ramMb);
    }

    if (summary) {
      summary.counts = counts;
      await updateSystemProfileSummary(summary.id, summary);
    } else {
      await insertSystemProfileSummary({
        appId: app.id,
        dateStart: start.toJSDate(),
        dateEnd: end.toJSDate(),
        period: "weekly",
        counts,
      });
    }

    await deleteSystemProfilesBefore(app.id, end.toJSDate());
  }

  return NextResponse.json({ message: `Done` }, { status: 200 });
}
