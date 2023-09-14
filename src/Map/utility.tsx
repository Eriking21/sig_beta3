
import MapView_ from "@arcgis/core/views/MapView";
import FeatureLayer_ from "@arcgis/core/layers/FeatureLayer";

import GraphicsLayer_ from "@arcgis/core/layers/GraphicsLayer";

export const map = {
  view: undefined as MapView_ | undefined,
  layer: undefined as GraphicsLayer_ | undefined,
};