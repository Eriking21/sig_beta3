"use client";
import "./styles.css";
import useMap, { mapInterface } from "./interface";
import SelectMap from "./selectMap";
import erimServerData from "../app/api/data/types";
import LoadingScreen from "./loading";
import { CSSProperties } from "react";

interface _ {
  information: Promise<erimServerData>;
}
export default function ArcGISMap({ information }: _) {
  "use client";
  //console.log("build main");
  useMap(information);
  return (
    <main style={mainMapStyle}>
      <div id="map" style={{ minWidth: "100%", minHeight: "100%" }}></div>
      <SelectMap />
      <LoadingScreen style={{ position: "absolute" }} id="map_is_loading" />
    </main>
  );
}
mapInterface.afterLoad = () => {
  //console.log("fully loaded");

  setTimeout(() => {
    document.getElementById("map_is_loading")?.remove();
    document.getElementById("add-menu")!.style.opacity = "1";
  }, 10000);
};

const mainMapStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  overflow: "hidden",
  position: "relative",
};
