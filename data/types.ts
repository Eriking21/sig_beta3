export interface SUB {
  geometry: { type: "point"; latitude: number; longitude: number };
  attributes: {
    Object_type: 0|1|2;
    FID: number;
    identificação: string;
    H?: number;
    País: string;
    Província: string;
    Municipio: string;
    Distrito: string;
    Bairro: string;
    Rua: string;
    Empresa: string;
    Ano: string;
    P: [string, string];
    U: [string, string];
    Seccão?: [string, string] | string;
  };
}

export interface TRAFO {
  geometry: { type: "point"; latitude: number; longitude: number };
  attributes: {
    Object_type: 0 | 1 | 2;
    FID: number;
    OBJECTID: 51;
    parent_id: number;
    identificação: string;
    H?: number;
    País: string;
    Província: string;
    Municipio: string;
    Distrito: string;
    Bairro: string;
    Rua: string;
    Empresa: string;
    Fabricante: string;
    Ano: number;
    Potência: string;
    Frequência: string;
    Ligação: string;
    U: [string, string];
    Tipo: [string, string];
    secção: [string, string] | string;
  };
}

export type Data = {
  subs: SUB[];
  trafos: { [key: `SE${number}`]: TRAFO[] };
};
