import { CSSProperties, ReactNode, useRef } from "react";
import { SearchBar } from "./SearchBar";
import { SearchBox } from "./searchBox";
import "./styles.css";
interface _ {
  children?: ReactNode;
}

export const SearchArea = ({ children }: _) => {
  const style: CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignSelf: "stretch",
    alignItems: "center",
    overflow: "hidden",
  };
  return (
    <div {...{ style }}>
      <SearchBar />
      <SearchBox />
    </div>
  );
};
