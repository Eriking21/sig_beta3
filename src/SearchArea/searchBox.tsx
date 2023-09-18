"use client";
import { useState, useRef, useEffect } from "react";
import SearchItem from "./SearchItem";
import { map } from "../Map/utility";

export const SearchBox = () => {
  const [toogle, setToogle] = useState(false);
  map.search.item = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const setter = () => setToogle(!toogle);
    map.search.listeners.push(setter);
    return () => {
      const id = map.search.listeners.findLastIndex(setter);
      map.search.listeners.splice(id, 1);
    };
  }, [toogle]);

  const items = map.objects
    .flat()
    ?.filter((point) =>
      point.attributes.identificação.toLowerCase().includes(map.search.getValue())
    )
    .map((point, index) => {
      return (
        <SearchItem
          key={index}
          {...{ ...point, activeNode: map.search.item!, index }}
        />
      );
    });

  return (
    <div className="scrollable" style={{ padding: "0 1.25rem 0 1.75rem" }}>
      <div>{items}</div>
    </div>
  );
};
