"use client";
import "./styles.css";
export * from "./Inputs";
import { setForm } from "@/AddMenu";
import { CoordField } from "./coordfield";
import { Input, Language } from "../utility/Language";
import { TextField, VoltField, Selection, ColorField } from "./Inputs";
import {
  Consumer_Info,
  Info_type,
  Sub_Info,
  Trafo_Info,
} from "@/app/api/data/types";
import { Connector } from "./connector";

type Info = Sub_Info | Trafo_Info | Consumer_Info;

interface _ {
  write: Language;
}
const AddingForm = ({ write }: _) => {
  const formIndex = setForm.useListener();
  return (
    <form
      style={{
        width: "inherit",
        height: "inherit",
        position: "absolute",
        transform: formIndex === undefined ? "translateX(-100%)" : "",
        background: "white",
      }}
      className="addingForm scrollable absolute w-full h-full bg-white block text-black"
      onSubmit={async (event) => {
        if (formIndex === undefined) return;
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formData.forEach((value, name) => {
          if (
            typeof value === "string" &&
            value.trim() === "" &&
            typeof event.currentTarget[name] === "object" &&
            event.currentTarget[name].type === "number"
          ) {
            // Copy the placeholder to the input value
            formData.set(name, event.currentTarget[name].placeholder);
            event.currentTarget[name].value =
              event.currentTarget[name].placeholder;
          }
        });
        const formDataAsObj = formDataToObj(formData, write, formIndex);

        const info = getInfo(formData, write, formIndex!);
        console.log(info, formDataAsObj);

        try {
          const response = await fetch("http://localhost:3000/api/data", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(info),
          });

          if (response.ok) {
            console.log("Data sent successfully!");
            console.log(JSON.stringify(response.body));
          } else {
            console.error("Error sending data to the server.");
          }
        } catch (error) {
          console.error("An error occurred:", error);
        }
        setTimeout(() => {
          setForm.to(undefined);
        }, 2000);
      }}
    >
      <h2 className="title">
        {write.register} <br />
        {write.Map_object[formIndex!]}
      </h2>
      <TextField {...write._identificação} />
      {formIndex! === 0 && <ColorField {...write} />}
      <CoordField {...write} {...{ index: formIndex }} />
      <TextField {...Input.height(write)} />
      <TextField {...write._country} />
      <TextField {...write._province} />
      <TextField {...write._district} />
      <TextField {...write._city} />
      <TextField {...write._street} />
      {formIndex! !== 2 && <TextField {...write._company} />}

      {formIndex! === 0 && (
        <>
          <VoltField {...{ ...write, index: 1 }} />
          <TextField {...Input.power(write, 0)} />
          <TextField {...Input.power(write, 1)} />
        </>
      )}
      {formIndex! === 1 && (
        <>
          <TextField {...write._manufacturer} />
          <TextField {...Input.year(write)} />
          <Selection {...Input.trafo_type(write)} />
          <VoltField {...{ ...write, index: 0 }} />
          <VoltField {...{ ...write, index: 1 }} />
          <TextField {...Input.power(write, 2)} />
          <TextField {...Input.power(write, 3)} />
        </>
      )}

      {formIndex! === 2 && (
        <>
          <Selection {...Input.instalation_type(write)} />
          <VoltField {...{ ...write, index: 1 }} />
          <TextField {...Input.power(write, 4)} />
        </>
      )}

      <TextField {...Input.frequency(write, formIndex!)} />
      <TextField {...write._secção} />
      <Connector {...write} />
      <input
        type="submit"
        value={write.register}
        className="selected"
        style={{
          width: "calc(3rem + 50%)",
          borderRadius: "1.5rem",
          margin: "0 calc(25% - 1.5rem)",
        }}
      />
    </form>
  );
};

function formDataToJson(
  formData: FormData,
  language: Language,
  index: number
): string {
  const jsonObject: { [key: string]: string } = {};

  jsonObject["type"] = index.toString();
  jsonObject["Language"] = language.short_name;
  formData.forEach((value, name) => {
    jsonObject[name] = value.toString();
  });

  return JSON.stringify(jsonObject);
}

type formType = {
  [key: string]: string;
};
function formDataToObj(
  formData: FormData,
  language: Language,
  index: number
): formType {
  const jsonObject: formType = {};

  jsonObject["type"] = index.toString();
  jsonObject["Language"] = language.short_name;
  formData.forEach((value, name) => {
    jsonObject[name] = value.toString();
  });
  return jsonObject;
}
export default AddingForm;

export type newPostType = {
  info: Info;
  mainLine?: number;
  connections: number[];
};

function getInfo(
  formData: any,
  write: Language,
  formIndex: number
): newPostType {
  const form = formDataToObj(formData, write, formIndex);
  const info: Info = {
    geometry: {
      type: "point",
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
    },
    attributes: {
      ObjectType_id: formIndex as 0 | 1 | 2,
      FID: 0,
      identificação: form[write._identificação.name],
      estado: "funcional", // Replace with appropriate value
      País: form[write._country.name],
      Província: form[write._province.name],
      Municipio: form[write._district.name],
      Distrito: form[write._city.name],
      Bairro: form[write._street.name],
      Rua: form[write._street.name],
      H: form[write.height],
      Secção: form[write._secção.name],
      U2: form[write.End_trafo[1]] + form[write.End_trafo[1] + " next 0"],
      Frequência: form[write.frequency] + form[write.frequency + " next 0"],
    } as any,
  };
  if (formIndex === 0) {
    (info as Sub_Info).attributes.cor_da_linha = form[write.lineColor]; // Replace with appropriate value
    (info as Sub_Info).attributes.Empresa = form[write._company.name];
    (info as Sub_Info).attributes.Ano = parseInt(form[write.year]);
    (info as Sub_Info).attributes.P1 = form[write.Power_names[0]]; // Replace with appropriate value
    (info as Sub_Info).attributes.P2 = form[write.Power_names[1]]; // Replace with appropriate value
    (info as Sub_Info).attributes.U1 =
      form[write.End_trafo[0]] + form[write.End_trafo[0] + " next 0"];
    (info as Sub_Info).attributes.Secção = form[write._secção.name]; // Replace with appropriate value
  } else if (formIndex === 1) {
    (info as Trafo_Info).attributes.Empresa = form[write._manufacturer.name];
    (info as Trafo_Info).attributes.Fabricante = form[write._manufacturer.name];
    (info as Trafo_Info).attributes.Ano = parseInt(form[write.year]);
    (info as Trafo_Info).attributes.Capacidade = form[write.Power_names[2]];
    form[write.Power_names[2] + " next 0"];
    (info as Trafo_Info).attributes.Potência = form[write.Power_names[3]];
    form[write.Power_names[3] + " next 0"];
    (info as Trafo_Info).attributes.Aproveitamento = get_Aproveitamento({
      MaxPower: [
        `${form[write.Power_names[2]]}`,
        `${form[write.Power_names[2] + " next 0"]}`,
      ],
      power: [
        `${form[write.Power_names[3]]}`,
        `${form[write.Power_names[3] + " next 0"]}`,
      ],
    });
    (info as Trafo_Info).attributes.Ligação = `${
      ["estrela", "triângulo"][parseInt(form[write.End_trafo[0] + " mode"])]
    }-${
      ["estrela", "triângulo"][parseInt(form[write.End_trafo[1] + " mode"])]
    }`;
    (info as Trafo_Info).attributes.U1 = form[write.End_trafo[0]];
    form[write.End_trafo[0] + " next 0"];
    (info as Trafo_Info).attributes.U2 = form[write.End_trafo[1]];
    form[write.End_trafo[1] + " next 0"]; // Replace with appropriate value
    (info as Trafo_Info).attributes.Tipo = `${form[write.type]} ${
      form[write.type + " 0"]
    }`;
    // Replace with appropriate value
  } else if (formIndex === 2) {
    (info as Consumer_Info).attributes.Tipo = form[write.type];
    (info as Consumer_Info).attributes.Potência = form[write.Power_names[4]];
  }
  const connections: number[] = [];
  const lenght = "__E_".length;
  Object.keys(form)
    .filter((key) => key.startsWith("__E_") && form[key] === "on")
    .forEach((key) => connections.push(parseInt(key.slice(lenght))));

  return {
    info: info,
    mainLine: form["mainLine"] !== "" ? parseInt(form["mainLine"]) : undefined,
    connections: connections,
  };
}

type MP = {
  MaxPower: [string, string];
  power: [string, string];
};

export function get_Aproveitamento({ MaxPower, power }: MP) {
  return `${
    100 *
    ((parseFloat(power[0]) * 3 ** ["VA,kVA,MVA,GVA"].indexOf(power[1])) /
      (parseFloat(MaxPower[0]) * 3 ** ["VA,kVA,MVA,GVA"].indexOf(MaxPower[1])))
  }%`;
}
