import { language } from "../utility/Language";
import { Info, getStateby } from "@/app/api/data/types";

export type formInputs = {
  [key: string]: any;
};

type languageKey = keyof typeof language;

export function fillForm(formName: string, info: Info) {
  const form_ = document.getElementById(formName) as HTMLFormElement;
  const form = form_.elements;

  const key = form_.className.match(/(language-)(\w+\b)/)![2] as languageKey;
  const write = language[key];

  setInput("FID", `${info.attributes.FID}`);
  setInput("latitude", `${info.geometry.latitude}`);
  setInput("longitude", `${info.geometry.longitude}`);
  setInput(write._identificação.name, info.attributes.identificação);
  setInput("Estado", getStateby("value", info.attributes.estado)!.label);
  setInput(write._country.name, info.attributes.País);
  setInput(write._province.name, info.attributes.Província);
  setInput(write._municipio.name, info.attributes.Município);
  setInput(write._district.name, info.attributes.Distrito);
  setInput(write._street.name, info.attributes.Rua);
  setInput(write.height, `${info.attributes.Z}`);

  if (info.attributes.ObjectType_id === 0) {
    setInput(write.lineColor, info.attributes["Cor da Linha"]!);
  } else if (info.attributes.ObjectType_id === 1) {
    setInput(write.brand.name, info.attributes["Marca da Lâmpada"]!);
    setInput(write.ref.name, info.attributes.Referência!);
    setInput(write.lampType.name, info.attributes["Tipo de Lâmpada"]!);
    setInput(write.base.name, info.attributes.Base!);
    setVar(write.Power_names[3], "Potência");
    setVar(write.voltage, "Tensão");
    setVar("Vida Média", "Vida Média");
    setVar("Fluxo das Luminárias", "Fluxo das Luminárias");
    setInput("Temperatura da Cor", info.attributes["Temperatura da Cor"]!);
    setInput("Nº de Luminárias", `${info.attributes["Nº de Luminárias"]!}`);
    const title = document.getElementById("form-title") as HTMLHeadingElement;
    title.innerText = "";
  }
  return;

  function setInput(name: string, value: string) {
    (form.namedItem(name) as HTMLInputElement).value = value;
  }

  function setVar(fieldName: string, attribute: keyof Info["attributes"]) {
    const regex = /^(\d+([.,]\d+)?)([a-zA-Z]+)$/;
    const stringPart = `${info.attributes[attribute]!}`.match(regex)!;
    setInput(fieldName, stringPart[1]! + (stringPart[2] ?? ""));
    setInput(fieldName + " next 0", stringPart[3]!);
  }
}
