"use client"
import { FaCircle } from "react-icons/fa";
import { MutableRefObject, useRef } from "react";
import { PowerItem } from "../utility/options";
import { TRAFO, SUB } from "../../data/types";
import { map } from "@/Map/utility";
import Point_ from "@arcgis/core/geometry/Point";

interface _ {
  activeNode: MutableRefObject<HTMLDivElement | null>;
  index: number;
  attributes: TRAFO["attributes"] | SUB["attributes"];
  geometry: Point_;
}

const SearchItem = ({
  activeNode,
  index,
  attributes,
  geometry,
}: _) => {
  const imgStyle = {
    alignSelf: "center",
    margin: ".5rem",
    height: "60%",
    width: "1.35rem",
  };

  function ag(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    if (
      activeNode?.current !== event.currentTarget &&
      activeNode?.current?.classList.contains("active")
    ) {
      activeNode.current.classList.remove("active");
    }

    if (event.currentTarget.classList.contains("active")) {
      event.currentTarget.classList.remove("active");
      map.view?.popup.close();
    } else {
      event.currentTarget.classList.add("active");
      map.layers!.forEach((fl) => {
        fl.queryFeatures({
          where: `identificação = '${attributes.identificação}'`,
        }).then((found) => {
          found.features.forEach((feature) => {
            map.view?.popup.open({
              features: [feature],
              location: geometry,
            });
          });
        }).catch((error)=>{});
      });
    }

    activeNode.current = event.currentTarget;
  }

  return (
    <div
      ref={activeNode.current === null && index === 0 ? activeNode : undefined}
      className="SearchItem"
      style={{
        display: "flex",
        flexDirection: "row",
        alignSelf: "stretch",
        alignItems: "flex-start",
        fontSize: "1rem",
      }}
      onClick={ag}
    >
      {/* eslint-disable-next-line @next/next/no-img-element*/}
      <img
        style={imgStyle}
        alt={index.toString()}
        src={PowerItem[attributes.Object_type].src}
      />
      <span
        style={{
          flex: "1",
          textAlign: "start",
          alignSelf: "center",
          overflow: "hidden",
        }}
      >
        {attributes.identificação}
      </span>
      <FaCircle style={imgStyle} color="#80ed80" />
    </div>
  );
};
export default SearchItem;
