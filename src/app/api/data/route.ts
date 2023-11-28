"use server";
import lockfile from "proper-lockfile";
import fs, { promises as fs2 } from "fs";
import { revalidateTag } from "next/cache";
import { newPostType } from "@/AddingForm";
import { NextRequest, NextResponse } from "next/server";
import { Pils_Info, Pils_Source_Info, erimServerData, erim_vec } from "./types";
import { triggerRefresh } from "./refresh/route";
import { json } from "stream/consumers";

export async function getData(): Promise<erimServerData> {
  "use server";
  let sources: erimServerData["sources"] = JSON.parse(
    await fs2.readFile(`./data/Pils_Sources.json`, { encoding: "utf8" })
  );
  console.log;
  const pils: Promise<erim_vec<Pils_Info>>[] = [
    ...Object.keys(sources).map(async (k) => {
      const file = `./data/Pils${sources[parseInt(k)].attributes.FID}.json`;
      if (fs.existsSync(file)) {
        return JSON.parse(await fs2.readFile(file, { encoding: "utf8" }));
      } else return Promise.resolve({});
    }),
  ];

  return {
    sources: sources,
    pils: await Promise.all(pils),
  };
}

export async function GET(request: NextRequest) {
  "use server";
  return new NextResponse(JSON.stringify(await getData()));
}

export async function POST(request: NextRequest) {
  const a: newPostType = await request.json();
  let source = a.source;
  let file = "Pils";
  const encoding = { encoding: "utf8" as BufferEncoding };

  if (source === undefined) {
    a.info.attributes.FID = 0;
    file += "_Sources";
  } else if (source < 1000) {
    a.info.attributes.FID = 1000;
    file += source;
  } else {
    console.log("invalid data");
    return;
  }

  await lockfile.lock("./data/index.json").catch((err) => {
    console.log("locking Error");
  });

  const max: { [key: string]: number } = JSON.parse(
    await fs2.readFile("./data/index.json", encoding)
  );

  max[file] ??= 0;
  a.info.attributes.FID += (source ?? 0) * 1000 + max[file]++;

  let list: newPostType["info"][] = fs.existsSync(`./data/${file}.json`)
    ? JSON.parse(await fs2.readFile(`./data/${file}.json`, encoding))
    : [];

  list.push(a.info);

  await Promise.all([
    fs2.writeFile("./data/index.json", JSON.stringify(max)),
    fs2.writeFile(`./data/${file}.json`, JSON.stringify(list)),
  ]);

  await lockfile.unlock("./data/index.json");
  revalidateTag("update_features");
  triggerRefresh();
  return new NextResponse("ok");
}
