
import MapView_ from "@arcgis/core/views/MapView";
import React, { useRef, useEffect, MutableRefObject } from "react";
import { loadModules } from "esri-loader";
import SelectMap from "./selectMap";
import { basemap } from "../utility/options";
import "./styles.css";
import { map } from "./utility";


const ArcGISMap = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    // Load the ArcGIS modules
    loadModules(["esri/Map", "esri/views/MapView", "esri/geometry/Point"], { css: true })
      .then(([Map, MapView, Point]) => {

        map.view: MapView_ = new MapView({
          container: "map",
          map: new Map({
          basemap: basemap[0].title,
        }),
          center: [13.234444, -8.838333], // Longitude, Latitude of Luanda
          zoom: 13,
        });
        // Store the map view instance
      })
      .catch((err) => console.error("Error loading ArcGIS modules:", err));
  });

  // const handleBasemapChange = (index: number) => {
  //   mapView!.current!.map.basemap = basemap[index].title as any;
  // };

  return (
    <main>
      <div id="map" style={{ minWidth: "100%", minHeight: "100%" }}>
        <SelectMap setMap={handleBasemapChange} />
      </div>
    </main>
  );
};

export default ArcGISMap;
