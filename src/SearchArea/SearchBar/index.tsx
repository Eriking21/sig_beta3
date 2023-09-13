import { CSSProperties } from "react";
import "./styles.css";
import { FaSearch } from "react-icons/fa";

interface _ {
  isLarge?: boolean;
}

export const SearchBar = ({isLarge =true}: _) => {
  const inputStyle: CSSProperties = {
    //margin: "0.5rem 0 0.5rem 1.5rem",
    backgroundColor: "transparent",
    fontSize: " 1.15rem",
    border: "none",
    overflow: "hidden",
    flex: 1,
    padding: 0,
  };

  const buttonStyle: CSSProperties = {
    fontSize: " 1.15rem",
    border: "none",
    backgroundColor: "transparent",
    color: "#2277EE",
    padding: 0,
  };

  return (
    <div
      style={{
        margin: `.7em ${isLarge ? "1.5em" : "1rem"}`,
        alignSelf: "stretch",
        backgroundColor: "white",
        fontSize: " 1.5rem",
        padding: `0.5rem 1.5rem`,
        borderRadius: "1.5em",
        display: "flex",
        alignItems: "center",
      }}
    >
      <input style={inputStyle} placeholder="search.." id="searchBar" />
      <button style={buttonStyle}>
        <FaSearch />
      </button>
    </div>
  );
};
