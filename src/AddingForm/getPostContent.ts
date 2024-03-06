"use client";
import { Language } from "../utility/Language";
import { Info, getStateby, statelabels } from "@/app/api/data/types";

type formType = {
  [key: string]: string;
};

type a = { FID: number };
export type ClientContent = {
  info: {
    geometry: Info["geometry"];
    attributes: Omit<Info["attributes"], "FID"> & { FID?: number };
  };
  source?: number;
};

export function getPostContent(
  formData: FormData,
  write: Language,
  formIndex: 0 | 1
): ClientContent {
  const form: formType = {
    type: formIndex.toString(),
    Language: write.short_name,
  };

  formData.forEach((value, name) => {
    form[name] = value.toString();
  });
  const info: ClientContent = {
    source: form["source"] !== "" ? parseInt(form["source"]) : undefined,

    info: {
      geometry: {
        type: "point",
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
      },
      attributes: {
        ObjectType_id: formIndex,
        FID: form["FID"] != undefined ? parseInt(form["FID"]) : undefined,
        identificação: form[write._identificação.name],
        estado: getStateby("label", form["Estado"])!.value,
        País: form[write._country.name],
        Província: form[write._province.name],
        Município: form[write._municipio.name],
        Distrito: form[write._district.name],
        Rua: form[write._street.name],
        Z: parseFloat(form[write.height]),
      },
    },
  };
  if (info.info.attributes.ObjectType_id === 0) {
    info.info.attributes = {
      ...info.info.attributes,
      ["Cor da Linha"]: form[write.lineColor],
    };
  } else if (info.info.attributes.ObjectType_id === 1) {
    info.info.attributes = {
      ...info.info.attributes,
      Base: form[write.base.name],
      Referência: form[write.ref.name],
      "Tipo de Lâmpada": form[write.lampType.name],
      ["Marca da Lâmpada"]: form[write.brand.name],
      "Temperatura da Cor": form["Temperatura da Cor"],
      "Nº de Luminárias": parseInt(form["Nº de Luminárias"]),
      "Vida Média": form["Vida Média"] + form["Vida Média" + " next 0"],

      Tensão: form[write.voltage] + form[write.voltage + " next 0"],
      Potência:
        form[write.Power_names[3]] + form[write.Power_names[3] + " next 0"],

      "Fluxo das Luminárias":
        form["Fluxo das Luminárias"] + form["Fluxo das Luminárias" + " next 0"],
    };
  }
  //console.log(form, info);
  return info;
}
