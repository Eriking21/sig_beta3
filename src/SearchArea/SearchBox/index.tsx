"use client";
import { useState, useRef, useEffect } from "react";
import SearchItem from "../SearchItem";
import { map } from "../../Map/utility";

export const SearchBox = () => {
  const [toogle, setToogle] = useState(false);
  const Props = { activeNode: useRef<HTMLDivElement | undefined>() };

  useEffect(() => {
    const setter = () => setToogle(!toogle);
    map.setters.push(setter);
    return () => {
      const id = map.setters.findLastIndex(setter);
      map.setters.splice(id, 1);
    };
  }, [toogle]);

  const items = map.points?.map((point, index) => {
    return <SearchItem {...Props} key={index} attributes={point.attributes} />;
  });

  return (
    <div className="scrollable">
      <div style={{}}>{items}</div>
    </div>
  );
};
