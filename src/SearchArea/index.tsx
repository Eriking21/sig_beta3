import { CSSProperties, ReactNode } from "react";
export { SearchBar } from "./SearchBar";
export { SearchBox } from "./SearchBox";

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
  return <div {...{style}}>
    {children}
  </div>;
};
