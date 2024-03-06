"use client";
import { FaCircle } from "react-icons/fa";
import { MutableRefObject, useEffect } from "react";
import { PowerItem } from "../utility/options";
import { Info, stateColors } from "../app/api/data/types";

interface _ {
  activeNode: MutableRefObject<HTMLInputElement | null>;
  index: number;
  attributes: Info["attributes"];
}

const imgStyle = {
  alignSelf: "stretch",
  widt: "",
  width: "1.1rem",
  margin: ".1rem",
  display: "inline",
  flex: "0 0 auto",
};

export const ConnectorLine = ({ activeNode, index, attributes }: _) => {
  function ag(event: React.ChangeEvent<HTMLInputElement>): void {
    const master = event.target!.parentNode!.parentNode!
      .previousSibling as HTMLInputElement;

    if (event.target.checked) {
      if (event.target !== activeNode.current) {
        console.log(attributes.FID, event.target.checked);
        activeNode.current!.checked = false;
        activeNode.current = event.target;
        master.value = `${attributes.FID}`;
      }
    } else if (event.target === activeNode.current) {
      activeNode.current!.checked = true;
    }
  }

  return (
    <div
      ref={activeNode.current === null && index === 0 ? activeNode : undefined}
      className="item"
      style={{
        display: "inline-flex",
        flexDirection: "row",
        alignSelf: "stretch",
        alignItems: "flex-start",
        fontSize: "1rem",
        width: "100%",
        boxSizing: "border-box",
        margin: "0 .15rem",
        height: "1.5rem",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element*/}
      <img
        style={{ ...imgStyle, width: "1.35rem", height: "1.35rem" }}
        alt={index.toString()}
        src={PowerItem[attributes.ObjectType_id].src}
      />

      <input type="checkbox" style={imgStyle} onChange={ag} />

      <FaCircle
        style={{ ...imgStyle, alignSelf: "center" }}
        color={stateColors[attributes.estado]}
      />
      <span
        style={{
          flex: "1",
          fontSize: ".8rem",
          textAlign: "start",
          alignSelf: "center",
          paddingRight: "1rem",
          overflow: "inherit",
          display: "block",
          whiteSpace: "nowrap",
        }}
      >
        {attributes.identificação}
      </span>
    </div>
  );
};
