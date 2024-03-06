export type TuppleOf<
  T,
  N extends number,
  R extends any[] = []
> = R["length"] extends N ? R : TuppleOf<T, N, [...R, T]>;

export type MergeWithOptional<T, U> = {
  [K in keyof T & keyof U]: T[K] | U[K];
} & {
  [K in Exclude<keyof T, keyof U>]?: T[K];
} & {
  [K in Exclude<keyof U, keyof T>]?: U[K];
};

export type StrVec<N extends number> = TuppleOf<string, N>;
export type ERIM_BASEMAP_NUMBER = 3;
export type ERIM_OBJECT_NUMBER = 2;

export const PowerItem: TuppleOf<{ src: string }, ERIM_OBJECT_NUMBER> = [
  { src: "/Power/blue_source.png" },
  { src: "/Power/PIL.png" },
];

export const basemap: TuppleOf<{ title: string; image: string }, ERIM_BASEMAP_NUMBER> =
  [
    { title: "streets-vector", image: "/BaseMapImages/streets.jpeg" },
    { title: "topo-vector", image: "/BaseMapImages/top-vector.jpeg" },
    { title: "hybrid", image: "/BaseMapImages/hybrid.jpeg" },
  ];

