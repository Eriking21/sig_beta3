import fs, { promises as fs2 } from "fs";
import { SUB, TRAFO } from "../../../../data/types";

//import {NextResponse} from "next/server";

export async function GET(request: Request) {
  //fs.appendFile("./oi_estou_aqui","mike")
  const subs = fs.readFileSync("./data/info.json", { encoding: "utf8" });
  const intro = "{";
  let trafos: string = intro;
  ((await JSON.parse(subs)) as SUB[]).forEach((sub) => {
    const parent = `SE${sub.attributes.FID}`;
    const file = `./data/${parent}.json`;
    if (trafos !== intro) trafos += ",";
    trafos += `"${parent}" : ${
      fs.existsSync(file) ? fs.readFileSync(file, { encoding: "utf8" }) : "[]"
    }`;
  });
  trafos += "}";

  // const trafo = await fs.readFile(
  //   `./data/SE${(JSON.parse(subs) as SUB[])[0].attributes.ID}.json`,
  //   {
  //     encoding: "utf8",
  //   }
  // );
  // const trafos = JSON.parse(subs).map(async (sub, index) => {
  //   return await fs.readFile(`./data/SE${sub.attributes.ID}/info.json`, {
  //     encoding: "utf8",
  //   });
  // });
  //console.log(`{"trafos":"${(().at(0)?.attributes.ID}"}`);
  //return new Response('{"ola":"1"}');
  //console.log(`{"trafos":{${trafos}}}`);
  return new Response(`{"subs":${subs}, "trafos":${trafos}}`);
  //return new Response("{"+subs + "," + trafos+"}");
}
