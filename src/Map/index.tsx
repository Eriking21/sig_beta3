"use client";
import MapView_ from "@arcgis/core/views/MapView";
import Map_ from "@arcgis/core/Map";
import Graphic_ from "@arcgis/core/Graphic";

import Point_ from "@arcgis/core/geometry/Point";
import Polyline_ from "@arcgis/core/geometry/Polyline";
import FeatureLayer_ from "@arcgis/core/layers/FeatureLayer";
import GraphicsLayer_ from "@arcgis/core/layers/GraphicsLayer";

import PictureMarkerSymbol_ from "@arcgis/core/symbols/PictureMarkerSymbol";
import SimpleMarkerSymbol_ from "@arcgis/core/symbols/SimpleMarkerSymbol";
import SimpleLineSymbol_ from "@arcgis/core/symbols/SimpleLineSymbol";

//import FeatureLayer from "@arcgis/core/Map";
import { useEffect } from "react";
import { loadModules } from "esri-loader";
import SelectMap from "./selectMap";
import { PowerItem, basemap } from "../utility/options";
import "./styles.css";
import { map } from "./utility";
import { Data, TRAFO, SUB } from "../../data/types";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

interface _ {
  data: Data;
}
//i want to store the contructors
let FeatureLayer_t: typeof FeatureLayer_ | undefined = undefined;
let Point_t: typeof Point_ | undefined = undefined;

const ArcGISMap = ({ data }: _) => {
  // Load the ArcGIS modules
  useEffect(() => {
    loadModules<
      [
        typeof Map_,
        typeof MapView_,
        typeof FeatureLayer_,
        typeof Point_,
        typeof Polyline_,
        typeof Graphic_,
        typeof GraphicsLayer_,
        typeof PictureMarkerSymbol_,
        typeof SimpleMarkerSymbol_,
        typeof SimpleLineSymbol_
      ]
    >(
      [
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/geometry/Point",
        "esri/geometry/Polyline",
        "esri/Graphic",
        "esri/layers/GraphicsLayer",
        "esri/symbols/PictureMarkerSymbol",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
      ],
      {
        css: true,
      }
    )
      .then(
        ([
          Map,
          MapView,
          FeatureLayer,
          Point,
          PolyLine,
          Graphic,
          GraphicsLayer,
          PictureMarkerSymbol,
          SimpleMarkerSymbol,
          SimpleLineSymbol,
        ]) => {
          map.layer = new GraphicsLayer();

          const view = new MapView({
            container: "map",
            map: new Map({
              basemap: basemap[0].title,
              layers: [map.layer!],
            }),
            center: [13.234444, -8.838333], // Longitude, Latitude of Luanda
            zoom: 13,
          });
          map.view = view;
          view.when(() => {
            console.log(map);
          });

          map.points = data.subs.flatMap((sub) => {
            const trafoGraphics = data.trafos[`SE${sub.attributes.FID}`] ?? [];

            return [
              {
                geometry: new Point({ ...sub.geometry }),
                attributes: sub.attributes,
              },
              ...trafoGraphics.map((t) => ({
                geometry: new Point({ ...t.geometry }),
                attributes: t.attributes,
              })),
            ];
          });

          const lines_per_map = data.subs.map((sub) =>
            (data.trafos[`SE${sub.attributes.FID}`] ?? []).map(
              (trafo) =>
                new PolyLine({
                  paths: [
                    [
                      [sub.geometry.longitude, sub.geometry.latitude],
                      [trafo.geometry.longitude, trafo.geometry.latitude],
                    ],
                  ],
                })
            )
          );

          const color: number[][] = [
            [255, 0, 0],
            [0, 0, 255],
            [255, 255, 0],
          ];

          const Linked_lines = [
            [
              new PolyLine({
                paths: [
                  [
                    [
                      data.subs[0].geometry.longitude,
                      data.subs[0].geometry.latitude,
                    ],
                    [
                      data.subs[1].geometry.longitude,
                      data.subs[1].geometry.latitude,
                    ],
                  ],
                ],
              }),
            ],
          ];

          Linked_lines.concat(lines_per_map).forEach(
            (lines_per_trafo, index) => {
              const symbol = new SimpleLineSymbol({
                color: color[index % color.length],
                width: 2,
              });
              lines_per_trafo.forEach((line) =>
                map.view!.graphics.add(
                  new Graphic({
                    geometry: line,
                    symbol: symbol,
                  })
                )
              );
            }
          );

          map.points.forEach((point) => {
            const type = point.attributes["Object_type"] as 0 | 1 | 2;

            const symbol = new SimpleMarkerSymbol({
              color: [255, 255, 255],
              size: 16,
            });

            const symbol1 = new PictureMarkerSymbol({
              url: PowerItem[type].src,
              color: [128, 128, 255],
              width: 14,
              height: 14,
            });

            map.view!.graphics.add(
              new Graphic({
                ...point,
                symbol: symbol,
              })
            );

            map.view!.graphics.add(
              new Graphic({
                ...point,
                symbol: symbol1,
              })
            );
          });
          map.view!.when(map.update);
        }
      )
      .catch((err: any) => console.error("Error loading ArcGIS modules:", err));
    //map.update();
    return () => {
      map.view?.graphics.removeAll();
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
