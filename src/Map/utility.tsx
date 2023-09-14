
import MapView_ from "@arcgis/core/views/MapView";
import FeatureLayer_ from "@arcgis/core/layers/FeatureLayer";

import Point_ from "@arcgis/core/geometry/Point";
import GraphicsLayer_ from "@arcgis/core/layers/GraphicsLayer";
import { TRAFO, SUB } from "../../data/types";

export const map = {
  view: undefined as MapView_ | undefined,
  layer: undefined as GraphicsLayer_ | undefined,
  points: undefined as
    | {
        geometry: Point_;
        attributes: TRAFO["attributes"] | SUB["attributes"];
      }[]
    | undefined,
  setters: [] as (()=>any)[],
  update: ()=>map.setters.forEach(setter=>setter())
};