export interface SUB {
  geometry: { type: "point"; latitude: number; longitude: number };
  attributes: {
    Object_type: 0 | 1 | 2;
    FID: number;
    identificação: string;
    H: number;
    País: string;
    Província: string;
    Municipio: string;
    Distrito: string;
    Bairro: string;
    Rua: string;
    Empresa: string;
    Ano: number;
    P1: string;
    P2: string;
    U1: string;
    U2: string;
    Secção?: string;
  };
}

export interface TRAFO {
  geometry: { type: "point"; latitude: number; longitude: number };
  attributes: {
    Object_type: 0 | 1 | 2;
    FID: number;
    OBJECTID: 51;
    identificação: string;
    H: number;
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
    U1: string;
    U2: string;
    Tipo: string;
    Secção: string;
  };
}

export type Data = {
  subs: SUB[];
  trafos: { [key: `SE${number}`]: TRAFO[] };
};
