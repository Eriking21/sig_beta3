"use client";
import MapView_ from "@arcgis/core/views/MapView";
import Map_ from "@arcgis/core/Map";
import Point_ from "@arcgis/core/geometry/Point";
import Polyline_ from "@arcgis/core/geometry/Polyline";
import FeatureLayer_ from "@arcgis/core/layers/FeatureLayer";
import SimpleRenderer_ from "@arcgis/core/renderers/SimpleRenderer";
import PictureMarkerSymbol_ from "@arcgis/core/symbols/PictureMarkerSymbol";
import SimpleMarkerSymbol_ from "@arcgis/core/symbols/SimpleMarkerSymbol";
import SimpleLineSymbol_ from "@arcgis/core/symbols/SimpleLineSymbol";
import CIMSymbol_ from "@arcgis/core/symbols/CIMSymbol";

import "./styles.css";
import SelectMap from "./selectMap";
import { useEffect } from "react";
import { Data } from "../../data/types";
import { loadModules } from "esri-loader";
import { getFields, getLineFields, map } from "./utility";
import { PowerItem, basemap } from "../utility/options";

interface _ {
  data: Data;
}

export default function ArcGISMap({ data }: _) {
  // Load the ArcGIS modules
  useEffect(() => {
    loadModules<
      [
        typeof Map_,
        typeof MapView_,
        typeof FeatureLayer_,
        typeof Point_,
        typeof Polyline_,
        typeof SimpleRenderer_,
        typeof PictureMarkerSymbol_,
        typeof SimpleMarkerSymbol_,
        typeof SimpleLineSymbol_,
        typeof CIMSymbol_
      ]
    >(
      [
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/geometry/Point",
        "esri/geometry/Polyline",
        "esri/renderers/SimpleRenderer",
        "esri/symbols/PictureMarkerSymbol",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/CIMSymbol",
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
          SimpleRenderer,
          PictureMarkerSymbol,
          SimpleMarkerSymbol,
          SimpleLineSymbol,
          CIMSymbol,
        ]) => {
          const color: number[][] = [
            [255, 0, 0],
            [0, 0, 255],
            [255, 255, 0],
          ];

          map.objects = [
            data.subs.map((sub) => ({
              geometry: new Point({ ...sub.geometry }),
              attributes: sub.attributes,
            })),
            data.subs.flatMap((sub) => [
              ...data.trafos[`SE${sub.attributes.FID}`].map((trafo) => ({
                geometry: new Point({ ...trafo.geometry }),
                attributes: trafo.attributes,
              })),
            ]),
          ];
          const hiddenStrings: string[] = ["FID", "group_id"];

          map.layers = [
            ...data.subs.map(
              (sub) =>
                new FeatureLayer({
                  objectIdField: "FID",
                  fields: getLineFields(),
                  source: data.trafos[`SE${sub.attributes.FID}`].map(
                    ({ attributes: trafo, geometry: trafo_geometry }) => ({
                      geometry: new PolyLine({
                        paths: [
                          [
                            [sub.geometry.longitude, sub.geometry.latitude],
                            [trafo_geometry.longitude, trafo_geometry.latitude],
                          ],
                        ],
                      }),
                      attributes: {
                        identificação: "alimentação " + trafo.identificação,
                        FID: trafo.FID,
                        power: trafo.Potência,
                      },
                    })
                  ),
                  renderer: new SimpleRenderer({
                    symbol: new SimpleLineSymbol({
                      color: color[sub.attributes.FID + 1],
                      width: 2,
                    }),
                  }),
                })
            ),
            new FeatureLayer({
              objectIdField: "FID",
              source: [
                {
                  attributes: {
                    Object_type: 4,
                    FID: `${data.subs[0].attributes.FID}_${data.subs[1].attributes.FID}`,
                    power: "0W",
                  },
                  geometry: new PolyLine({
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
                },
              ],
              renderer: new SimpleRenderer({
                symbol: new SimpleLineSymbol({
                  color: color[0 % color.length],
                  width: 2,
                }),
              }),
            }),
            ...map.objects.flatMap((source, type) => [
              new FeatureLayer({
                objectIdField: "FID",
                fields: getFields(source.at(0)!.attributes),
                source: source,
                renderer: new SimpleRenderer({
                  symbol: new SimpleMarkerSymbol({
                    color: [255, 255, 255],
                    size: 16,
                  }),
                }),
              }),
              new FeatureLayer({
                objectIdField: "FID",
                fields: getFields(source.at(0)!.attributes),
                source: source,
                renderer: new SimpleRenderer({
                  symbol: new PictureMarkerSymbol({
                    url: PowerItem[type].src,
                    color: [128, 128, 255],
                    width: 14,
                    height: 14,
                  }),
                }),
              }),
            ]),
          ];
          const view = new MapView({
            container: "map",
            map: new Map({
              basemap: basemap[0].title,
              layers: map.layers,
            }),
            center: [13.234444, -8.838333], // Longitude, Latitude of Luanda
            zoom: 13,
          });

          map.view = view;
          view.when(() => {
            map.layers
              ?.filter((fl) => fl.fields !== undefined)
              .forEach((fl) => {
                fl.popupTemplate = fl.createPopupTemplate({
                  ignoreFieldTypes: ["global-id"],
                });
              });
            map.search.update();
            map.layers
              ?.filter((fl) => fl.popupTemplate ?? false)
              .forEach((fl) => {
                fl.popupTemplate.title = "{identificação}";
              });
          });
          view.popup.watch(["visible", "selectedFeature"], updateSelection);
        }
      )
      .catch((err: any) => console.error("Error loading ArcGIS modules:", err));
    //map.update();;
  });

  return (
    <main
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div id="map" style={{ minWidth: "100%", minHeight: "100%" }}></div>
      <SelectMap />
    </main>
  );
}
function updateSelection(some: any) {
  if (some === null) return;
  const id: string =
    map.view?.popup.selectedFeature?.attributes?.identificação ?? "";
  map.search.clear();
  if (
    (map.search.item?.current?.classList.contains("active") &&
      (map.search.item?.current?.childNodes.item(1) as HTMLSpanElement)
        .innerText !== id) ||
    some === false
  ) {
    map.search.item?.current?.classList.remove("active");
  }

  map.search.item?.current?.parentNode?.childNodes.forEach((child) => {
    if (
      (child.childNodes.item(1) as HTMLSpanElement).innerText === id &&
      !(child as HTMLDivElement).classList.contains("active") &&
      some !== false
    ) {
      (child as HTMLDivElement).classList.add("active");
      map.search.item!.current = child as HTMLDivElement;
      return;
    }
  });
}
