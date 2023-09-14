"use client";
import MapView_ from "@arcgis/core/views/MapView";
import Map_ from "@arcgis/core/Map";
import React, { useEffect } from "react";
//import { loadModules } from "esri-loader";
import SelectMap from "./selectMap";
import { basemap } from "../utility/options";
import "./styles.css";
import { map } from "./utility";

const ArcGISMap = () => {
  // Load the ArcGIS modules
  useEffect(() => {
    map.view = new MapView_({
      container: "map",
      map: new Map_({
        basemap: basemap[0].title,
      }),
      center: [13.234444, -8.838333], // Longitude, Latitude of Luanda
      zoom: 13,
    });
    
    return () => {
      map.view = undefined;
    };
  });

  return (
    <main>
      <div id="map" style={{ minWidth: "100%", minHeight: "100%" }}>
        <SelectMap />
      </div>
    </main>
  );
};

export default ArcGISMap;
