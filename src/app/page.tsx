import SideBar from "../SideBar";
import ArcGISMap from "@/Map";
import AddMenu from "@/AddMenu";
import { Data } from "../../data/types";

export default async function HomePage() {
  const val:Data = await (
    await fetch("http://localhost:3000/api/data", {
      method: "GET",
      next: { revalidate: 3, },
    })
  ).json();
  
  return (
    <>
      <ArcGISMap data={val}></ArcGISMap>
      <SideBar ></SideBar>
      <AddMenu />
    </>
  );
}
