"use client";
import { useState, useRef, useEffect, use, useMemo, useCallback } from "react";
import SearchItem from "./SearchItem";
import { map } from "../Map/utility";

export default function SearchBox() {
  map.search.item = useRef<HTMLDivElement | null>(null);
  const [, setToogle] = useState(false);
  useEffect(() => {
    map.updateListeners.add(setToogle);
    return () => {
      map.updateListeners.delete(setToogle);
    };
  }, []);

  const items = map.objects
    .flat()
    ?.filter((point) =>
      point.attributes.identificação
        .toLowerCase()
        .includes(map.search.getValue())
    )
    .map((point, index) => {
      return (
        <SearchItem
          key={index}
          {...{ ...point, activeNode: map.search.item!, index }}
        />
      );
    });

  // console.log("rebuild",map.objects,items);
  return (
    <div className="scrollable" style={{ padding: "0 1.25rem 0 1.75rem" }}>
      <div>{items}</div>
    </div>
  );
}
