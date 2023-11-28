"use client";
import { FaCircle } from "react-icons/fa";
import { CSSProperties, MutableRefObject, useRef } from "react";
import { PowerItem } from "../utility/options";
import { Info } from "../app/api/data/types";
import { mapInterface } from "@/Map/interface";

type _ = Info & {
  activeNode: MutableRefObject<HTMLDivElement | null>;
  index: number;
};

const SearchItem = ({ activeNode, index, attributes, geometry }: _) => {
  const imgStyle: CSSProperties = {
    alignSelf: "center",
    margin: ".5rem",
    height: "60%",
    width: "1.35rem",
  };

  function alternate(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (
      activeNode?.current !== event.currentTarget &&
      activeNode?.current?.classList.contains("active")
    ) {
      activeNode.current.classList.remove("active");
    }

    if (event.currentTarget.classList.contains("active")) {
      event.currentTarget.classList.remove("active");
      mapInterface.view?.popup.close();
    } else {
      event.currentTarget.classList.add("active");
      activeNode.current = event.currentTarget;
      console.log(attributes.FID);
      const i = Promise.all(
        mapInterface.layers!.map((fl) =>
          fl.queryFeatures({
            where: `identificação = '${attributes.identificação}'`,
            //geometry: geometry,
          })
        )
      );
      i.catch((err) => console.log(err));
      i.then((R) => {
        const features = [...R.map((K) => K.features)].flat().reverse();
        console.log(features);
        mapInterface.view?.popup.open({
          features: features,
          location: geometry as __esri.Point,
        });
      });
    }
  }

  async function personalize(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {}

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
      onClick={alternate}
      onDoubleClick={personalize}
    >
      {/* eslint-disable-next-line @next/next/no-img-element*/}
      <img
        style={imgStyle}
        alt={index.toString()}
        src={PowerItem[attributes.ObjectType_id].src}
      />
      <span
        style={{
          flex: "1",
          textAlign: "start",
          alignSelf: "center",
          overflow: "hidden",
          display: "block",
          whiteSpace: "nowrap",
        }}
      >
        {attributes.identificação}
      </span>
      <FaCircle
        style={imgStyle}
        color={
          stateColor[
            attributes.estado as
              | "funcional"
              | "defeituoso"
              | "avariado"
              | "inactivo"
          ]
        }
      />
    </div>
  );
};

export const stateColor = {
  funcional: "#80ed80",
  defeituoso: "yellow",
  avariado: "red",
  inactivo: "gray",
};
export default SearchItem;
