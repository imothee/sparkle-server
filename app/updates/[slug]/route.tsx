import type { NextRequest } from "next/server";
import { notFound } from "next/navigation";
import { getApp, insertSystemProfile } from "@/lib/actions";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: { slug: string };
  }
) {
  const app = await getApp(params.slug.split(".")[0]);

  if (!app) {
    notFound();
  }

  const searchParams = req.nextUrl.searchParams;

  await insertSystemProfile({
    appId: app.id,
    appVersion: searchParams.get("version"),
    cpu64Bit: searchParams.get("cpu64Bit")
      ? searchParams.get("cpu64bit") === "1"
      : null,
    ncpu: searchParams.get("ncpu")
      ? parseInt(searchParams.get("ncpu") || "0")
      : null,
    cpuFreqMhz: searchParams.get("cpuFreqMhz"),
    cputype: searchParams.get("cpuType"),
    cpusubtype: searchParams.get("cpuSubType"),
    model: searchParams.get("model"),
    ramMb: searchParams.get("ramMb"),
    osVersion: searchParams.get("osVersion"),
    lang: searchParams.get("lang"),
  });

  const versions = app.versions.map(
    (version) => `<item>
  <title>${version.version}</title>
  <pubDate>${version.updatedAt}</pubDate>
  <sparkle:version>${version.build}</sparkle:version>
  <sparkle:shortVersionString>${version.version}</sparkle:shortVersionString>
  <sparkle:minimumSystemVersion>${version.minSystemVersion}</sparkle:minimumSystemVersion>
  <description>${version.description}</description>
  <enclosure url="${version.url}" length="${version.length}" type="application/octet-stream" sparkle:dsaSignature="${version.dsaSignature}" sparkle:edSignature="${version.edSignature}"/>
</item>`
  );

  const xmlContent = `<?xml version="1.0" standalone="yes"?>
<rss xmlns:sparkle="http://www.andymatuschak.org/xml-namespaces/sparkle" version="2.0">
  <channel>
    <title>${app.name}</title>
    ${versions.join("\n")}
  </channel>
</rss>
`;

  return new Response(xmlContent, { headers: { "Content-Type": "text/xml" } });
}
