"use client";
import { mapInterface } from "@/Map/interface";
import { useEffect, useRef } from "react";
import { FlexWrapper, Flexible_with_border } from ".";
import { ConnectorLine } from "./connectorLine";
import { FormIndex, setForm } from "@/AddMenu";

export function Connector({key}:{key?:React.Key}) {
  //const formIndex = setForm.useListener();
  const activeNode = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    const list = document.getElementById("ConnectorList") as HTMLInputElement;
    activeNode.current = list.firstElementChild!.children.item(
      1
    ) as HTMLInputElement;
    activeNode.current.checked = true;
  }, []);
  return (
    <FlexWrapper
      key= {key}
      label={"Fonte de Alimentação"}
      style={{ gap: ".5rem", display: setForm.isEditing ? "none" : undefined }}
    >
      <input
        name="source"
        style={{ display: "none" }}
        defaultValue={mapInterface.objects[0]?.[0]?.attributes.FID ?? 0}
      />
      <div
        id="ConnectorList"
        {...Flexible_with_border}
        style={{
          paddingRight: ".2rem",
          display: "inline-flex",
          maxHeight: "20rem",
          overflow: "auto",
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
