"use client"
import { useState, useRef } from "react";
import SplashButton from "../../utility/SplashButton";
import { basemap } from "../../utility/options";

interface Props {
  onRight?: Boolean;
  R?: number;
}

const SelectMap = ({ onRight = true, setMap}: Props) => {
  const index = useRef(0);
  const [toggle, setToggle] = useState(true);
  const right = onRight ? 0 : undefined;

  const childs = () =>
    basemap.map(({ image: src }, __index) => {
      const Y = (__index + 1) * 60;
      const t = toggle ? "none" : `translate(0px, ${Y}px)`;

      const work = () => {
        setTimeout(() => {
          index.current = __index;
          setMap(__index);
          setToggle(!toggle);
        }, 500);
      };

      return (
        <SplashButton
          key={__index}
          className="button_Border Selection_Map"
          translate={t}
          content={src}
          action={work}
          borderRadius={"15%"}
          border={{ width: "4px", color: ["#DDDDDD", "#93cbdd"] }}
        />
      );
    });

  return (
    <div style={{ right: right, maxHeight: window.innerHeight - 250 }}>
      {childs()}
      <SplashButton
        key={basemap.length}
        className="button_Border Selected_Map"
        action={() => setToggle(!toggle)}
        content={basemap.at(index.current)!.image}
        borderRadius={"15%"}
        border={{ width: "4px", color: ["#cffcff", "#93cbdd"] }}
      />
    </div>
  );
};

export default SelectMap;
