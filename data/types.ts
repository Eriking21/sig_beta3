export interface SUB {
  Latitude: number;
  Longitude: number;
  attributes: {
    ID: number;
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
  Latitude: number;
  Longitude: number;
  attributes: {
    ID: number;
    OBJECTID: 51;
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