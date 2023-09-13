import Language, { showSelections, _S_, _T_ } from "./Language_Helpers";
export { Input } from "./Language_Inputs";
export { CopyRight } from "./CopyRight";
export { showSelections, type Language, type _S_, type _T_ };
interface Language_type {
  PT: Language;
  EN: Language;
}

export const language: Language_type = {
  PT: {
    short_name: "PT",
    local_name: "Português",
    select_map: ["padrão", "topografica", "satelite"],
    Map_object: ["Substação", "Tranformador", "Consumidor"],
    Power_names: ["Capacidade", "Potência", "Contracto"],
    register: "Registrar",
    _name: {
      name: "Identificação",
      placeholder: "Insira a identificação",
      type: "text",
    },
    _country: {
      name: "País",
      placeholder: "Insira a País",
      type: "text",
    },
    _province: {
      name: "Província",
      placeholder: "Insira a Província",
      type: "text",
    },
    _district: {
      name: "Município",
      placeholder: "Insira o Município",
      type: "text",
    },
    _city: {
      name: "Cidade / Bairro",
      placeholder: "Insira a Cidade",
      type: "text",
    },
    _street: {
      name: "Rua",
      placeholder: "Insira a Rua",
      type: "text",
    },
    _company: {
      name: "Companhia",
      placeholder: "Insira a Companhia",
      type: "text",
    },
    _manufacturer: {
      name: "Fabricante",
      placeholder: "Insira o Fabricante",
      type: "text",
    },
    _owner: {
      type: "text",
      name: "Proprietário",
      placeholder: "Insira o Proprietário",
    },
    Phase_Type: "Instalação",
    voltage: "Tensão",
    frequency: "Frequência",
    Phase_denomination: ["Monofásica", "Bifásica", "Trifásica"],

    type: "Tipo",
    trafo_type: [
      ["Monofásico", "Bifásico", "Trifásico"],
      ["Monobloco", "Alvenaria"],
    ],
    End_trafo: ["Primário", "Secundário"],
    DEV: ["Todos os direitos reservados.", "Desenvolvido por"],
    coordinates: "Coordenadas"
  },

  EN: {
    short_name: "ENG",
    local_name: "English",
    select_map: ["Default", "Topografic", "satelite"],
    Map_object: ["Substation", "Transformer", "Consumer"],
    Power_names: ["Power", "Power", "Consume"],
    register: "Register",
    _name: {
      name: "Name",
      placeholder: "Insert a Name",
      type: "text",
    },
    _province: {
      name: "",
      placeholder: "",
      type: "text",
    },
    _city: {
      name: "",
      placeholder: "",
      type: "text",
    },
    _country: {
      name: "",
      placeholder: "",
      type: "text",
    },
    _district: {
      name: "",
      placeholder: "",
      type: "text",
    },
    _street: {
      name: "",
      placeholder: "",
      type: "text",
    },
    _company: {
      name: "",
      placeholder: "",
      type: "text",
    },
    _manufacturer: {
      name: "",
      placeholder: "",
      type: "text",
    },
    _owner: {
      type: "text",
      name: "",
    },
    voltage: "",
    frequency: "",
    type: "",
    trafo_type: [
      ["", "", ""],
      ["", ""],
    ],
    Phase_Type: "",
    End_trafo: ["", ""],
    Phase_denomination: ["", "", ""],
    DEV: ["All Rights Reserved", "Developed By"],
    coordinates: ""
  },
};

