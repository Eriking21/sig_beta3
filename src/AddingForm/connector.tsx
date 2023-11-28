"use client";
import { mapInterface } from "@/Map/interface";
import { useRef } from "react";
import { FlexWrapper, Flexible_with_border } from ".";
import { ConnectorLine } from "./connectorLine";
import { FormIndex, setForm } from "@/AddMenu";

export function Connector() {
  //const formIndex = setForm.useListener();
  const activeNode = useRef<HTMLInputElement | null>(null);
  return (
    <FlexWrapper label={"Fonte de Alimentação"} style={{ gap: ".5rem" }}>
      <input
        name="source"
        style={{ display: "none" }}
        defaultValue={mapInterface.objects[0][0].attributes.FID}
      />
      <div
        {...Flexible_with_border}
        style={{
          paddingRight: ".2rem",
          display: "inline-flex",
          height: "20rem",
          overflow: "scroll",
        }}
      >
        {mapInterface.objects[0]
          ?.filter((point) =>
            point.attributes.identificação
              .toLowerCase()
              .includes(mapInterface.search.getValue())
          )
          .map((point, index) => {
            return (
              <ConnectorLine key={index} {...{ ...point, activeNode, index }} />
            );
          })}
      </div>
    </FlexWrapper>
  );
}
