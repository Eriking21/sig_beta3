import { useRef } from "react";
import SearchItem from "../SearchItem";

export const SearchBox = () => {
  const Props = { activeNode: useRef<HTMLDivElement | undefined>() };

  return (
    <div className="scrollable">
      <div style={{}}>
        <SearchItem {...Props} />
        <SearchItem {...Props} />
        <SearchItem {...Props} />
        <SearchItem {...Props} />
        <SearchItem {...Props} />
        <SearchItem {...Props} />
        <SearchItem {...Props} />
        <SearchItem {...Props} />
        <SearchItem {...Props} />
        <SearchItem {...Props} />
        <SearchItem {...Props} />
      </div>
    </div>
  );
};
