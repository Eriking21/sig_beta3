"use client";
import MapView_ from "@arcgis/core/views/MapView";
import Map_ from "@arcgis/core/Map";
import Point_ from "@arcgis/core/geometry/Point";
import Polyline_ from "@arcgis/core/geometry/Polyline";
import FeatureLayer_ from "@arcgis/core/layers/FeatureLayer";
import SimpleRenderer_ from "@arcgis/core/renderers/SimpleRenderer";
import UniqueValueRenderer_ from "@arcgis/core/renderers/UniqueValueRenderer";
import PictureMarkerSymbol_ from "@arcgis/core/symbols/PictureMarkerSymbol";
import SimpleMarkerSymbol_ from "@arcgis/core/symbols/SimpleMarkerSymbol";
import SimpleLineSymbol_ from "@arcgis/core/symbols/SimpleLineSymbol";
import CIMSymbol_ from "@arcgis/core/symbols/CIMSymbol";
import Graphic_ from "@arcgis/core/Graphic";
import ColorVariable_ from "@arcgis/core/renderers/visualVariables/ColorVariable";
import { loadModules } from "esri-loader";
import { getFields, getLineFields, map, updateSelection } from "./utility";
import { PowerItem, basemap } from "../utility/options";
import { erimServerData, erimClientData } from "@/app/api/data/types";
import { useEffect } from "react";

const mapInterface: {
  afterLoad?: () => void | Promise<void>;
  promises: { [key: number | string]: Promise<void> };
  updateFeatures: (response: erimServerData) => Promise<void>;
  buildMap: ([Map, MapView]: [typeof Map_, typeof MapView_]) => Promise<void>;
  useMap: (dataProps: Promise<erimServerData>) => void;
  buildPopPup: () => void;
} = {
  promises: {},
  updateFeatures: (response) => {
    const data = new erimClientData(response);
    map.objects = [data.subs, data.trafos.flat()];
    const lineColors: { value: number; color: number[] | string }[] = [];
    function addColor({
      FID,
      cor_da_linha,
    }: {
      FID: number;
      cor_da_linha: number[] | string;
    }) {
      const index = lineColors.findIndex(({ value }) => value == FID);
      if (index != -1) {
        lineColors[index] = {
          value: FID,
          color: cor_da_linha,
        };
      } else {
        lineColors.push({
          value: FID,
          color: cor_da_linha,
        });
      }
      return FID;
    }
    const loadFeatures = async ([
      FeatureLayer,
      Point,
      Polyline,
      SimpleRenderer,
      UniqueValueRenderer,
      PictureMarkerSymbol,
      SimpleMarkerSymbol,
      SimpleLineSymbol,
      CIMSymbol,
      Graphic,
      ColorVariable,
    ]: FeaturesT): Promise<void> => {
      map.Point = Point;
      map.Graphic = Graphic;
      map.Polyline = Polyline;
      //if (!data.trafos || !data.trafos[0]) return;
      map.layers = [
        new FeatureLayer({
          title: "lines",
          objectIdField: "FID",
          fields: getLineFields(),
          source: [
            ...data.subs.flatMap((sub) => {
              addColor(sub.attributes);
              return data.trafos[sub.attributes.FID].map(
                ({ attributes: trafo, geometry: trafo_geometry }) => ({
                  geometry: new Polyline({
                    paths: [
                      [
                        [sub.geometry.longitude, sub.geometry.latitude],
                        [trafo_geometry.longitude, trafo_geometry.latitude],
                      ],
                    ],
                  }),
                  attributes: {
                    identificação: "alimentação " + trafo.identificação,
                    FID: `${trafo.FID}`,
                    power: trafo.Potência,
                    lineColor: sub.attributes.FID,
                  },
                })
              );
            }),
            ...data.CON_SE.map(({ 0: sub_0, 1: sub_1, power }) => {
              const s0 = data.subs.at(sub_0)!;
              const s1 = data.subs.at(sub_1)!;
              return {
                geometry: new Polyline({
                  paths: [
                    [
                      [s0.geometry.longitude, s0.geometry.latitude],
                      [s1.geometry.longitude, s1.geometry.latitude],
                    ],
                  ],
                }),
                attributes: {
                  identificação: `de ${s0.attributes.identificação} para ${s1.attributes.identificação}`,
                  FID: `${s0.attributes.FID} to ${s1.attributes.FID}`,
                  power: power,
                  lineColor: addColor({
                    FID: 2 * 21,
                    cor_da_linha: [255, 0, 0],
                  }),
                },
              };
            }),
            ...data.CON_TRAFO.map(({ 0: trafo_0, 1: trafo_1, power }) => {
              const T0 = data.trafos.at(trafo_0[0])!.at(trafo_0[1])!;
              const T1 = data.trafos.at(trafo_1[0])!.at(trafo_1[1])!;
              return {
                geometry: new Polyline({
                  paths: [
                    [
                      [T0.geometry.longitude, T0.geometry.latitude],
                      [T1.geometry.longitude, T1.geometry.latitude],
                    ],
                  ],
                }),
                attributes: {
                  identificação: `de ${T0.attributes.identificação} para ${T1.attributes.identificação}`,
                  FID: `${T0.attributes.FID} to ${T1.attributes.FID}`,
                  power: power,
                  lineColor: addColor({
                    FID: 2 * 42,
                    cor_da_linha: [255, 0, 255],
                  }),
                },
              };
            }),
          ],
          renderer: new SimpleRenderer({
            symbol: new SimpleLineSymbol({
              width: 3,
            }),
            visualVariables: [
              new ColorVariable({
                field: "lineColor",
                stops: lineColors,
              }),
            ],
          }),
        }),
        ...map.objects.flatMap((vec) => {
          const fields = getFields(vec[0].attributes);
          const type = vec[0].attributes.ObjectType_id;
          return [
            new FeatureLayer({
              title: "background",
              objectIdField: "FID",
              fields: fields,
              source: vec.map((item) => {
                return {
                  geometry: new Point(item.geometry),
                  attributes: item.attributes,
                };
              }),
              renderer: new SimpleRenderer({
                symbol: new SimpleMarkerSymbol({
                  color: [255, 255, 255],
                  size: 16,
                }),
              }),
            }),
            new FeatureLayer({
              title: "type",
              objectIdField: "FID",
              fields: fields,
              source: vec.map((item) => ({
                geometry: new Point(item.geometry),
                attributes: item.attributes,
              })),
              renderer: new SimpleRenderer({
                symbol: new PictureMarkerSymbol({
                  url: PowerItem[type].src,
                  color: [128, 128, 255],
                  width: 14,
                  height: 14,
                }),
              }),
            }),
          ];
        }),
      ];
      //replace old layers
    };
    mapInterface.promises["FeaturesLoad"] = loadModules<FeaturesT>(
      FeaturesUrl,
      {
        css: true,
      }
    )
      .then(loadFeatures)
      .catch((err) => console.error("Erro no carregamento de info", err));

    mapInterface.promises["firstFeaturesLoad"] ??=
      mapInterface.promises["FeaturesLoad"];

    mapInterface.promises["FeaturesLoad"].then(() => {
      map.updateListeners.forEach((listener) => {
        listener((toogle) => !toogle);
      });
      Object.keys(mapInterface.promises).includes("firstBuild") &&
        mapInterface.promises["firstBuild"].then(() => {
          map.view!.map.layers.removeAll();
          map.view!.map.layers.addMany(map.layers!);
          mapInterface.buildPopPup();
        });
    });
    return mapInterface.promises["FeaturesLoad"];
  },
  buildPopPup: () => {
    map.layers
      ?.filter((fl) => fl.fields !== undefined)
      .forEach((fl) => {
        fl.popupTemplate = fl.createPopupTemplate({
          ignoreFieldTypes: ["global-id", "guid", "oid"],
        });
      });
    map.layers
      ?.filter((fl) => fl.popupTemplate ?? false)
      .forEach((fl) => {
        //console.log(fl.fields);
        fl.popupTemplate.title = "{identificação}";
      });
    map.view?.popup.watch(["visible", "selectedFeature"], updateSelection);
    mapInterface.promises["firstBuild"] ??= Promise.resolve();
  },
  buildMap: async ([Map, MapView]: [
    typeof Map_,
    typeof MapView_
  ]): Promise<void> => {
    //console.log("buildMap");
    await mapInterface.promises["firstFeaturesLoad"]; //it will thrown an error if called first
    const view = new MapView({
      container: "map",
      map: new Map({
        basemap: basemap[0].title,
        layers: map.layers,
      }),
      center: [13.234444, -8.838333],
      zoom: 13,
    });

    map.view = view;
    return view.when(mapInterface.buildPopPup);
  },
  useMap: (dataProps) => {
    //console.log("usemap");
    useEffect(() => {
      dataProps.then(mapInterface.updateFeatures, (err) =>
        console.error("Erro no carregamento de info", err)
      );
    }, [dataProps]);
    useEffect(() => {
      loadModules<[typeof Map_, typeof MapView_]>(ArcGisMapPath, { css: true })
        .then(mapInterface.buildMap)
        .then(mapInterface.afterLoad)
        .catch((err: any) => console.error("Erro no Map", err));
      //map.update();;
      return ()=>{
        mapInterface.promises = {};
      }
    }, []);
  },
};
const ArcGisMapPath = ["esri/Map", "esri/views/MapView"];

type FeaturesT = [
  typeof FeatureLayer_,
  typeof Point_,
  typeof Polyline_,
  typeof SimpleRenderer_,
  typeof UniqueValueRenderer_,
  typeof PictureMarkerSymbol_,
  typeof SimpleMarkerSymbol_,
  typeof SimpleLineSymbol_,
  typeof CIMSymbol_,
  typeof Graphic_,
  typeof ColorVariable_
];

const FeaturesUrl = [
  "esri/layers/FeatureLayer",
  "esri/geometry/Point",
  "esri/geometry/Polyline",
  "esri/renderers/SimpleRenderer",
  "esri/renderers/UniqueValueRenderer",
  "esri/symbols/PictureMarkerSymbol",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/CIMSymbol",
  "esri/Graphic",
  "esri/renderers/visualVariables/ColorVariable",
];
export default mapInterface.useMap;
export { mapInterface };
