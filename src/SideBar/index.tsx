"use client";
import { SearchArea, SearchBar, SearchBox} from "@/SearchArea";
import { CopyRight, language, Language } from "@/utility/Language";
import { useState } from "react";
import Resizer from "./resizer";
import AddingForm from "@/AddingForm";

const Logo = ({ isLarge = true }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/powerTrace.png"
    alt="Power Trace"
    style={{
      height: isLarge ? "11%" : "2.5em",
      margin: isLarge
        ? "calc(1rem + 5%) 1em calc(1rem + 1%)"
        : "1rem 0px 1rem 1rem",
      boxSizing: "border-box",
    }}
  />
);

interface _ {
  children?: React.ReactNode;
}
export default function SideBar({ children }: _) {
  const [write, setLanguage] = useState<Language>(language["PT"]);
  return (
    <>
      <Resizer />
      <aside
        className="bg-grad-erim flex flex-col overflow-hidden "
        style={{
          display: "flex",
          transform: "none",
          width: "350px",
          height: "100% ",
          flexDirection: "column",
          left: 0,
        }}
      >
        <Logo />
        <SearchArea>
          <SearchBar />
          <SearchBox />
        </SearchArea>
        {<CopyRight {...write} />}
        <AddingForm write={write} />
      </aside>
    </>
  );
}
