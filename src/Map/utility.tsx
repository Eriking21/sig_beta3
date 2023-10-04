import MapView_ from "@arcgis/core/views/MapView";
import FeatureLayer_ from "@arcgis/core/layers/FeatureLayer";
import Graphic_ from "@arcgis/core/Graphic";

import Polyline_ from "@arcgis/core/geometry/Polyline";
import Point_ from "@arcgis/core/geometry/Point";
import { Trafo_Info, Sub_Info, erimClientData } from "../app/api/data/types";
import { MutableRefObject, SetStateAction } from "react";
type MapSearch = {
  watcher: __esri.WatchHandle | undefined;
  input: HTMLInputElement | undefined;
  item: MutableRefObject<HTMLDivElement | null> | undefined;
  listeners: (() => any)[];
  getValue: () => string;
  clear: () => void;
  update: () => void;
};

type MapType = {
  search: MapSearch;
  view: __esri.MapView | undefined;
  layers: __esri.FeatureLayer[] | undefined;
  updateListeners: Set<(setToogle: (toogle: boolean) => boolean) => void>;
  objects: (Sub_Info[] | Trafo_Info[])[];
  Point: typeof __esri.Point | undefined;
  Graphic: typeof __esri.Graphic | undefined;
  Polyline: typeof __esri.Polyline | undefined;
};

export const map: MapType = {
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
  updateListeners: new Set<(setToogle: (toogle: boolean) => boolean) => void>(),
  objects: [] as (Sub_Info[] | Trafo_Info[])[],
  Point: undefined as typeof Point_ | undefined,
  Graphic: undefined as typeof Graphic_ | undefined,
  Polyline: undefined as typeof Polyline_ | undefined,
};

export function getLineFields(): __esri.FieldProperties[] | undefined {
  return [
    {
      name: "lineColor",
      type: "guid",
    },
    {
      name: "FID",
      type: "string",
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
    type: typeof value === "number" ? "integer" : "string",
  }));
}
/*
export function updateSelection(some: any) {
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
*/

export function updateSelection(some: any) {
  "use client";
  if (some === null) return;
  const id: string =
    map.view?.popup.selectedFeature?.attributes?.identificação ?? "";
  map.search.clear();
  if (
    some === false ||
    (map.search.item?.current?.classList.contains("active") &&
      (map.search.item?.current?.childNodes.item(1) as HTMLSpanElement)
        .innerText !== id)
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
      map.search.item!.current!.scrollIntoView({ behavior: "smooth" });
      return;
    }
  });
}
