import SideBar from "../SideBar";
import ArcGISMap from "@/Map";
import AddMenu from "@/AddMenu";

export default async function HomePage() {
  const val = (
    await fetch("http://localhost:3000/api/data", {
      method: "GET",
      next: { revalidate: 3 },
    })
  ).json;
  console.log(val);

  return (
    <>
      <ArcGISMap></ArcGISMap>
      <SideBar></SideBar>
      <AddMenu />
    </>
  );
}
