import { promises as fs } from "fs";
import { SUB, TRAFO } from "../../../../data/types";

//import {NextResponse} from "next/server";

export async function GET(request) {
  //fs.appendFile("./oi_estou_aqui","mike")
  const subs = await fs.readFile("./data/info.json", { encoding: "utf8" });
const trafo = await fs.readFile(`./data/SE${sub.attributes.ID}/info.json`, {
  encoding: "utf8",
});
  // const trafos = JSON.parse(subs).map(async (sub, index) => {
  //   return await fs.readFile(`./data/SE${sub.attributes.ID}/info.json`, {
  //     encoding: "utf8",
  //   });
  // });
  console.log(trafo);
  //return new Response('{"ola":"1"}');

  return new Response(`{"subs":${subs},"trafos":${trafo}}`);
  //return new Response("{"+subs + "," + trafos+"}");
}
