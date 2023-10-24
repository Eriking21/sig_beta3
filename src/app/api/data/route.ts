"use server";
import { NextRequest, NextResponse } from "next/server";
import fs, { promises as fs2 } from "fs";
import {
  CON_SE_Info,
  CON_TRAFO_Info,
  Sub_Info,
  Trafo_Info,
  erimServerData,
} from "./types";
import { revalidateTag } from "next/cache";
import { newPostType } from "@/AddingForm";

export async function getData(): Promise<erimServerData> {
  "use server";
  let subs: erimServerData["subs"] = await JSON.parse(
    await fs2.readFile("./data/SE_info.json", { encoding: "utf8" })
  );

  let trafos: erimServerData["trafos"] = {};
  const [CON_SE, CON_TRAFO, ..._trafos] = await Promise.all([
    JSON.parse(
      await fs2.readFile("./data/CON_SE.json", { encoding: "utf8" })
    ) as Promise<erimServerData["CON_SE"]>,
    JSON.parse(
      await fs2.readFile("./data/CON_TRAFO.json", { encoding: "utf8" })
    ) as Promise<erimServerData["CON_TRAFO"]>,
    ...Object.keys(subs).map(async (k) => {
      const key = parseInt(k);
      const file = `./data/SE${subs[key].attributes.FID}.json`;
      if (fs.existsSync(file)) {
        const trafoData: (typeof trafos)[any] = await JSON.parse(
          await fs2.readFile(file, { encoding: "utf8" })
        );
        trafos[key] = trafoData;
      }
      return trafos[key];
    }),
  ]);
  return {
    subs: subs,
    trafos: trafos,
    CON_SE: CON_SE,
    CON_TRAFO: CON_TRAFO,
  };
}

export async function GET(request: NextRequest) {
  "use server";
  return new NextResponse(JSON.stringify(await getData()));
}

export async function POST(request: NextRequest) {
  const a: newPostType = await request.json();
  let num = a.mainLine;
  let file = "SE";

  if (num === undefined) {
    file += "_info";
  } else if (num < 1000) {
    file += num;
  } else {
    file += Math.floor(num / 1000) + "PT" + (num % 1000);
  }

  const max: { [key: string]: number } = await JSON.parse(
    await fs2.readFile("./data/index.json", { encoding: "utf8" })
  );
  max[file] ??= 0;
  a.info.attributes.FID = max[file]++ + (num ?? 0) * 1000;
  await fs2.writeFile("./data/index.json", JSON.stringify(max));

  let list: newPostType["info"][] = [];

  if (fs.existsSync(`./data/${file}.json`)) {
    list = await JSON.parse(
      await fs2.readFile(`./data/${file}.json`, { encoding: "utf8" })
    );
  }
  list.push(a.info);

  const [, CON_SE, CON_TRAFO]: [void, CON_SE_Info[], CON_TRAFO_Info[]] =
    await Promise.all([
      fs2.writeFile(`./data/${file}.json`, JSON.stringify(list)),
      JSON.parse(
        await fs2.readFile("./data/CON_SE.json", { encoding: "utf8" })
      ),
      JSON.parse(
        await fs2.readFile("./data/CON_TRAFO.json", { encoding: "utf8" })
      ),
    ]);

  a.connections.forEach((conn) => {
    if (conn > 1000) {
      CON_TRAFO.push({
        "0": [Math.floor(conn / 1000), conn % 1000],
        "1": [
          Math.floor(a.info.attributes.FID / 1000),
          a.info.attributes.FID % 1000,
        ],
        power: "0W",
      });
    } else {
      CON_SE.push({ "0": conn, "1": a.info.attributes.FID, power: "0W" });
    }
  });

  await Promise.all([
    fs2.writeFile("./data/CON_SE.json", JSON.stringify(CON_SE)),
    fs2.writeFile("./data/CON_TRAFO.json", JSON.stringify(CON_TRAFO)),
  ]);
  revalidateTag("update_features");
  return new NextResponse("ok");
}
