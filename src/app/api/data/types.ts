export interface Info_type<T extends 0 | 1 | 2 | any> {
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
    Bairro: string;
    Rua: string;
    H: number;
    Frequência: string;
    Secção: string;
    U2:string;
  };
}

export type Sub_Info = Info_type<0> & {
  attributes: {
    cor_da_linha: string;
    Empresa: string;
    Ano: number;
    P1: string;
    P2: string;
    U1: string;
  };
};
export type Trafo_Info = Info_type<0> & {
  attributes: {
    Empresa: string;
    Fabricante: string;
    Ano: number;
    Capacidade: string;
    Potência: string;
    Aproveitamento: string;
    Ligação: string;
    U1: string;
    Tipo: string;
  };
};
export type Consumer_Info = Info_type<0> & {
  attributes: {
    Potência: string;
    Tipo: string;
  };
};
export type CON_SE_Info = link_line<number>;
export type CON_TRAFO_Info = link_line<[number, number]>;
type link_line<T> = {
  0: T;
  1: T;
  power: string;
};

export type erim_vec<T> = {
  [key: number]: T;
};

export type erimServerData = {
  subs: erim_vec<Sub_Info>;
  trafos: erim_vec<erim_vec<Trafo_Info>>;
  CON_SE: erim_vec<CON_SE_Info>;
  CON_TRAFO: erim_vec<CON_TRAFO_Info>;
};
export default erimServerData;

export class erimClientData {
  subs: Sub_Info[];
  trafos: Trafo_Info[][];
  CON_SE: CON_SE_Info[];
  CON_TRAFO: CON_TRAFO_Info[];
  constructor({ subs, trafos, CON_SE, CON_TRAFO }: erimServerData) {
    this.subs = Object.values(subs);
    this.trafos = Object.values(trafos).map((subVec) => Object.values(subVec));
    this.CON_SE = Object.values(CON_SE);
    this.CON_TRAFO = Object.values(CON_TRAFO);
  }
}
