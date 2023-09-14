"use client";
import MapView_ from "@arcgis/core/views/MapView";
import Map_ from "@arcgis/core/Map";
import Graphic_ from "@arcgis/core/Graphic";

import Point_ from "@arcgis/core/geometry/Point";
import Polyline_ from "@arcgis/core/geometry/Polyline";
import FeatureLayer_ from "@arcgis/core/layers/FeatureLayer";
import GraphicsLayer_ from "@arcgis/core/layers/GraphicsLayer";
import SimpleMarkerSymbol_ from "@arcgis/core/symbols/SimpleMarkerSymbol";
import SimpleLineSymbol_ from "@arcgis/core/symbols/SimpleLineSymbol";

//import FeatureLayer from "@arcgis/core/Map";
import { useEffect } from "react";
import { loadModules } from "esri-loader";
// import SelectMap from "./selectMap";
import { basemap } from "../utility/options";
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

          const points = data.subs.flatMap((sub) => {
            const trafoGraphics = data.trafos[`SE${sub.attributes.FID}`] ?? [];

            return [
              new Point({ ...sub.geometry }),
              ...trafoGraphics.map((t) => new Point({ ...t.geometry })),
            ];
          });

          const lines = data.subs.flatMap((sub) =>
            (data.trafos[`SE${sub.attributes.FID}`] ?? []).map(
              (trafo) =>
                [
                  new Point({ ...sub.geometry }),
                  new Point({ ...trafo.geometry }),
                ] as [Point_, Point_]
            )
          );
          lines.forEach((line) => {
            const symbol = new SimpleLineSymbol({
              color: [0, 0, 255],
              width: 2,
            });
            map.view!.graphics.add(
              new Graphic({
                geometry: new PolyLine({
                  paths: [
                    [
                      [line[0].longitude, line[0].latitude],
                      [line[1].longitude, line[1].latitude],
                    ],
                  ],
                }),
                symbol: symbol,
              })
            );
          });

          points.forEach((point) => {
            const symbol = new SimpleMarkerSymbol({
              color: [0, 255, 255],
              size: 16,
            });
            map.view!.graphics.add(
              new Graphic({
                geometry: point,
                symbol: symbol,
              })
            );
          });
          // view.when(() => {
          //   // This code will run after the view has rendered
          //   console.log("finished");
          //   render_features(data);
          // });
        }
      )
      .catch((err: any) => console.error("Error loading ArcGIS modules:", err));
    return () => {
      map.view?.graphics.removeAll();
    };
  });

  //useEffect(() => render_features(data), [data]);

  return (
    <main>
      <div id="map" style={{ minWidth: "100%", minHeight: "100%" }}></div>
      {/* <SelectMap /> */}
    </main>
  );
};

export default ArcGISMap;
// function getGraphic(point: TRAFO | SUB): Graphic {
//   return new Graphic({
//     geometry: new Point(point.coordinates),
//   });
// }

// function render_features(data: Data) {
//   //   const features = new FeatureLayer({
//   //     source: data.subs.flatMap((sub) => {
//   //       const trafoGraphics = data.trafos[`SE${sub.attributes.FID}`] ?? [];
//   //       return [getGraphic(sub), ...trafoGraphics.map(getGraphic)];
//   //     }),
//   //   });
//   //how to pass this featureLayer to the map| mapview using map.view
//   const features = data.subs.flatMap((sub) => {
//     const trafoGraphics = data.trafos[`SE${sub.attributes.FID}`] ?? [];
//     return [getGraphic(sub), ...trafoGraphics.map(getGraphic)];
//   });

//   (map.view?.map.layers.at(0) as FeatureLayer | undefined)?.applyEdits({
//     addFeatures: features,
//   });

//   //?.map.layers.add(features);
//   console.log(features);
//   return () => {
//     (map.view?.map.layers.at(0) as FeatureLayer | undefined)?.applyEdits({
//       deleteFeatures: features,
//     });
//   };
// }
