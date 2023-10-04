import SideBar from "../SideBar";
import ArcGISMap from "@/Map";
import AddMenu from "@/AddMenu";
import { erimServerData } from "./api/data/types";

export default async function HomePage() {
  const val: Promise<erimServerData> = (
    await fetch("http://localhost:3000/api/data", {
      method: "GET",
      next: { tags: ["update_features"] },
      cache:"no-store"
    })
  ).json();

  return (
    <>
      <ArcGISMap information={val}></ArcGISMap>
      <SideBar></SideBar>
      <AddMenu id="add-menu" />
    </>
  );
}
