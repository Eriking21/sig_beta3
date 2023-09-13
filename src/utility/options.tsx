export type TuppleOf<
  T,
  N extends number,
  R extends any[] = []
> = R["length"] extends N ? R : TuppleOf<T, N, [...R, T]>;

export type StrVec<N extends number> = TuppleOf<string, N>;
export type ERIM_BASEMAP_NUMBER = 3;
export type ERIM_OBJECT_NUMBER = 3;

export const PowerItem: TuppleOf<{ src: string }, ERIM_OBJECT_NUMBER> = [
  { src: "/Power/Substation.png" },
  { src: "/Power/Transformer.png" },
  { src: "/Power/Home.png" },
];

export const basemap: TuppleOf<{ title: string; image: string }, ERIM_BASEMAP_NUMBER> =
  [
    { title: "streets-vector", image: "/BaseMapImages/streets.jpeg" },
    { title: "topo-vector", image: "/BaseMapImages/top-vector.jpeg" },
    { title: "hybrid", image: "/BaseMapImages/hybrid.jpeg" },
  ];

