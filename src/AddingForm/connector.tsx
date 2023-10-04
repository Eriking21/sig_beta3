"use client";
import { map } from "@/Map/utility";
import { useRef, useState, useEffect } from "react";
import { FlexWrapper, Flexible_with_border } from ".";
import { ConnectorLine } from "./connectorLine";
import { FormIndex, setForm } from "@/AddMenu";

export function Connector({ connections }: { connections: string }) {
  const formIndex = setForm.useListener();
  const activeNode = useRef<HTMLInputElement | null>(null);
  const [, setToogle] = useState(false);
  useEffect(() => {
    map.updateListeners.add(setToogle);
    return () => {
      map.updateListeners.delete(setToogle);
    };
  }, []);
  const checks: [boolean, boolean] = [formIndex !== 0, formIndex !== 2];

  const items = map.objects
    .flat()
    ?.filter((point) =>
      point.attributes.identificação
        .toLowerCase()
        .includes(map.search.getValue())
    )
    .map((point, index) => {
      const check: [boolean | null, boolean | null] = checks.map(
        (check, index) => {
          if (
            check &&
            formIndex &&
            ((index === 0 && point.attributes.ObjectType_id >= formIndex) ||
              (index === 1 && point.attributes.ObjectType_id !== formIndex))
          ) {
            return null;
          }
          return check;
        }
      ) as any;

      return (
        <ConnectorLine
          key={index}
          {...{ ...point, activeNode, index, check }}
        />
      );
    });

  return (
    <FlexWrapper label={connections} style={{ gap: ".5rem" }}>
      <input name="mainLine" style={{ display: "none" }} />
      <div
        {...Flexible_with_border}
        style={{
          paddingRight: ".2rem",
          display: "inline-flex",
          height: "20rem",
          overflow: "scroll",
        }}
      >
        {items}
      </div>
    </FlexWrapper>
  );
}
