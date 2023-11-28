export interface Info_type<T extends 0 | 1 | any> {
  geometry: { type: "point"; latitude: number; longitude: number };
  attributes: {
    ObjectType_id: number;
    FID: number;
    identificação: string;
    estado: string;
    //token_de_actualização: number;
    País: string;
    Província: string;
    Municipio: string;
    Distrito: string;
    Rua: string;
    Z: number;
  };
}
export type Pils_Source_Info = Info_type<0> & {
  attributes: {
    cor_da_linha:string;
  };
};

export type Pils_Info = Info_type<1> & {
  attributes: {
    "Fluxo_das_Luminárias": string,
    Potência: string,
   "Nº_de_Luminárias": number,
    "Tipo_Lampâda": string,
    "Marca_da_Lampâda": string,
    "Vida_Média": string,
    "Temperatura_da_Cor": string,
    Base: string,
    Referência: string,
    Tensão: string
  }
}

export type erim_vec<T> = {
  [key: number]: T;
};


export type erimServerData = {
  sources: erim_vec<Pils_Source_Info>
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

export type Info = Pils_Info | Pils_Source_Info | Info_type<any>;