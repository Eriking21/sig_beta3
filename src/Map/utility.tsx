import MapView_ from "@arcgis/core/views/MapView";
import FeatureLayer_ from "@arcgis/core/layers/FeatureLayer";

import Polyline_ from "@arcgis/core/geometry/Polyline";
import Point_ from "@arcgis/core/geometry/Point";
import { TRAFO, SUB } from "../../data/types";
import { ChangeEvent, MutableRefObject } from "react";

export const map = {
  search: {
    watcher: undefined as __esri.WatchHandle | undefined,
    input: undefined as HTMLInputElement | undefined,
    item: undefined as MutableRefObject<HTMLDivElement | null> | undefined,
    listeners: [] as (() => any)[],
    getValue: () => map.search?.input?.value ?? "",
    clear: () => {
      if (map.search?.input || false) {
        map.search!.input!.value = "";
        map.search.update();
      }
    },
    update: () => map.search.listeners.forEach((setter) => setter()),
  },
  view: undefined as MapView_ | undefined,
  layers: undefined as FeatureLayer_[] | undefined,
  objects: [] as {
    geometry: Point_;
    attributes: TRAFO["attributes"] | SUB["attributes"];
  }[][],
};

export function getLineFields(): __esri.FieldProperties[] | undefined {
  return [
    {
      name: "FID",
      type: "oid",
    },
    {
      name: "power",
      alias: "potência",
      type: "string",
    },
    {
      name: "identificação",
      type: "global-id",
    },
  ];
}

export function getFields<T extends {}>(
  attributes: T
): __esri.FieldProperties[] | undefined {
  return Object.entries(attributes).map(([key, value]) => ({
    name: key,
    alias: key,
    type: typeof value === "string" ? "string" : "integer",
  }));
}
