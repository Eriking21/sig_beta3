import { MergeWithOptional } from "@/utility/options";
import { Attributes } from "react";

export const stateColorStops: {
  value: number;
  color: string;
  label: string;
}[] = [
  {
    label: "Funcional",
    value: 0,
    color: "#80ed80",
  },
  {
    label: "Defeituoso",
    value: 1,
    color: "yellow",
  },
  {
    label: "Avariado",
    value: 2,
    color: "red",
  },
  {
    label: "Inactivo",
    value: 3,
    color: "gray",
  },
];

export function getStateby(
  k: keyof (typeof stateColorStops)[any],
  item: (typeof stateColorStops)[any][typeof k]
) {
  for (const element of stateColorStops) {
    if (element[k] == item) return element;
  }
}
export const statelabels = stateColorStops.map(({ label }) => label);
export const statevalues = stateColorStops.map(({ value }) => value);
export const stateColors = stateColorStops.map(({ color }) => color);

export interface Info_type<T extends 0 | 1> {
  geometry: { type: "point"; latitude: number; longitude: number };
  attributes: {
    ObjectType_id: number & T;
    FID: number;
    identificação: string;
    estado: (typeof stateColorStops)[any]["value"];
    //token_de_actualização: number;
    País: string;
    Província: string;
    Município: string;
    Distrito: string;
    Rua: string;
    Z: number;
  };
}
export type Pils_Source_Info = Info_type<0> & {
  attributes: {
    ["Cor da Linha"]: string;
  };
};

export type Pils_Info = Info_type<1> & {
  attributes: {
    "Fluxo das Luminárias": string;
    Potência: string;
    "Nº de Luminárias": number;
    "Tipo de Lâmpada": string;
    "Marca da Lâmpada": string;
    "Vida Média": string;
    "Temperatura da Cor": string;
    Base: string;
    Referência: string;
    Tensão: string;
  };
};

export type erim_vec<T> = {
  [key: number]: T;
};

export type erimServerData = {
  sources: erim_vec<Pils_Source_Info>;
  pils: erim_vec<erim_vec<Pils_Info>>;
};
export default erimServerData;

export class erimClientData {
  sources: Pils_Source_Info[];
  pils: Pils_Info[][];
  constructor({ sources, pils }: erimServerData) {
    this.sources = Object.values(sources);
    this.pils = Object.values(pils).map((source) => Object.values(source));
  }
}

export type Info = {
  geometry: (Pils_Info | Pils_Source_Info)["geometry"];
  attributes: MergeWithOptional<
    Pils_Source_Info["attributes"],
    Pils_Info["attributes"]
  >;
};
