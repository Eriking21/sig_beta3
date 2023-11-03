"use client";
import { MutableRefObject, useEffect } from "react";
import { Language } from "../utility/Language";
import { FlexWrapper, Flexible_with_border } from "./Inputs";
import { mapInterface } from "../Map/interface";

import Graphic_ from "@arcgis/core/Graphic";
import {
  SimpleMarkerSymbol,
  SimpleLineSymbol,
  PictureMarkerSymbol,
} from "@arcgis/core/symbols";
import { PowerItem } from "@/utility/options";

interface _C_ extends Language {
  index: number | undefined;
}

const newLocal: ["latitude", "longitude"] = ["latitude", "longitude"];
export const CoordField = ({ coordinates, index: form }: _C_) => {
  useEffect(() => {
    if (mapInterface.view === undefined || form === undefined) return;
    const mapview = mapInterface.view!;
    //const graphics = map.getGraphics();

    const outerSymbol:
      | Partial<SimpleMarkerSymbol>
      | { outline: Partial<SimpleLineSymbol> } = {
      type: "simple-marker",
      style: "circle",
      //color: new map.Color!([226, 119, 40]),
      size: mapview.zoom * 1.8,
      outline: {
        //color: new map.Color!([255, 255, 255]),
        width: 2,
      },
    };
    /*
    const innerSymbol: Partial<PictureMarkerSymbol> = {
      type: "picture-marker",
      color: new map.Color!([226, 119, 40]),
      url: PowerItem[0].src, // URL of the PNG file
      width: mapview.zoom * 1.5,
      height: mapview.zoom * 1.5,
    };
    const location = new map.Point!({
      x: mapview.center.x,
      y: mapview.center.y,
      z: mapview.center.z,
      spatialReference: new map.SpatialReference!({
        wkid: mapview.center.spatialReference.wkid,
      }),
    });
*/
    // map.layer?.
    // points.push({[
    //   new map.Graphic!({
    //     geometry: location,
    //     symbol: outerSymbol as any,
    //     attributes: {
    //       id: "addingPoint1", // Assign a unique ID
    //     },
    //   }),
    //   new map.Graphic!({
    //     geometry: location,
    //     symbol: innerSymbol as any,
    //     attributes: {
    //       id: "addingPoint2", // Assign a unique ID
    //     },
    //   }),
    // ]});

    const point = new mapInterface.Graphic!({
      geometry: mapInterface.view!.center,
      symbol: outerSymbol as any,
      attributes: {
        id: "addingPoint", // Assign a unique ID
      },
    });

    mapview.graphics.add(point);
    //map.layer?.applyEdits({ addFeatures: [point] });
    return () => {
      mapview.graphics.remove(point);
      //map.layer?.applyEdits({ deleteFeatures: [point] });
      //console.log(point);
    };
  }, [form]);

  return (
    <FlexWrapper label={coordinates} style={{ gap: ".5rem" }}>
      {newLocal.map((coordName, index) => (
        <div
          key={index}
          style={{
            paddingRight: "1rem",
            fontSize: "1.5rem",
            display: "flex",
            flexDirection: "row",
            width: "100%",
            boxSizing: "border-box",
            gap: "1rem",
            color: "#2023238c",
            margin: "0",
            alignItems: "center",
            marginLeft: "1rem",
          }}
        >
          {coordName + ":"}
          <div
            {...Flexible_with_border}
            style={{ paddingRight: ".2rem", display: "inline-grid" }}
          >
            <input
              type="number"
              name={coordName}
              step={0.001}
              defaultValue={mapInterface.view?.center[coordName] ?? 0}
              onChange={(event) => {
                if (mapInterface.view === undefined) return;
                const mapview = mapInterface.view!;
                // Find the graphic using its ID
                const graphic = mapview.graphics.find(
                  (graphic) => graphic.attributes.id === "addingPoint"
                );
                // Create a new point geometry with updated coordinate
                const updatedGeometry = {
                  type: "point",
                  latitude: graphic.geometry.get("latitude"),
                  longitude: graphic.geometry.get("longitude"),
                  spatialReference: graphic.geometry.spatialReference,
                };
                updatedGeometry[coordName] = parseFloat(
                  event.currentTarget.value
                );
                // Update the point's geometry and refresh the view
                //map.layer?.applyEdits({ addFeatures: points });
                graphic.geometry = updatedGeometry as any;
                mapview.graphics.remove(graphic); // Remove and re-add to trigger update
                mapview.graphics.add(graphic);
                //const point = map.layer?.source.at(0)!;
                //map.layer?.applyEdits({ updateFeatures: [point] });
                //Adjust the map view to focus on the updated point
                mapview.goTo(graphic.geometry);
              }}
              onSubmit={(event) => {
                console.log(event);
              }}
            />
          </div>
        </div>
      ))}
    </FlexWrapper>
  );
};
