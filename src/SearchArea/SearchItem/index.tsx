import { FaCircle } from "react-icons/fa";
import "./styles.css";
import { useRef } from "react";
import { PowerItem } from "../../utility/options";
import { TRAFO, SUB } from "../../../data/types";

interface _ {
  activeNode: ReturnType<typeof useRef<HTMLDivElement>>;
  index?: number;
  attributes: TRAFO["attributes"] | SUB["attributes"];
}

const SearchItem = ({ activeNode, index = 0, attributes }: _) => {
  const imgStyle = { alignSelf: "center", margin: ".5rem", height: "60%", width:"1.35rem" };

  function ag(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    if (
      activeNode?.current !== event.currentTarget &&
      activeNode?.current?.classList.contains("active")
    ) {
      activeNode.current.classList.remove("active");
    }

    if (event.currentTarget.classList.contains("active")) {
      event.currentTarget.classList.remove("active");
    } else {
      event.currentTarget.classList.add("active");
    }

    activeNode.current = event.currentTarget;
  }

  return (
    <div
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
      <span style={{ flex: "1", textAlign: "start", alignSelf: "center", overflow:"hidden" }}>
        {attributes.identificação}
      </span>
      <FaCircle style={imgStyle} color="#80ed80" />
    </div>
  );
};
export default SearchItem;
