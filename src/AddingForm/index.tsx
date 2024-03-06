/* eslint-disable react/jsx-key */
"use client";
import "./styles.css";
export * from "./Inputs";
import { setForm } from "@/AddMenu";
import { CoordField } from "./coordfield";
import { Input, Language } from "../utility/Language";
import { TextField, Selection, ColorField } from "./Inputs";
import { Connector } from "./connector";
import { getPostContent, ClientContent } from "./getPostContent";
import { FormEvent, cloneElement } from "react";
import { statelabels } from "@/app/api/data/types";

function childrens(write: Language, index: number) {
  const formIndex:number = setForm.useNumeric(index);

  return (
    <>
      {[
        <h2 className="title" id="form-title">
          {setForm.isEditing ? write.modify : write.register} <br />
          {write.Map_object[formIndex!]}
        </h2>,
        <input name="FID" style={{ display: "none" }} />,
        <TextField {...write._identificação} />,
        formIndex == 0 && <ColorField {...write} />,
        <CoordField
          {...{ coordinates: write.coordinates, index: formIndex }}
        />,
        <TextField {...Input.height(write)} />,
        <TextField {...write._country} />,
        <TextField {...write._province} />,
        <TextField {...write._municipio} />,
        <TextField {...write._district} />,
        <TextField {...write._street} />,

        formIndex !== 0 && <TextField {...write.ref} />,
        formIndex !== 0 && <TextField {...write.base} />,
        formIndex !== 0 && <TextField {...write.temp} />,
        formIndex !== 0 && <TextField {...write.lampType} />,
        formIndex !== 0 && <TextField {...Input.activePower(write, 3)} />,
        formIndex !== 0 && <TextField {...Input.voltage(write)} />,
        formIndex !== 0 && <TextField {...Input.fluxo(write)} />,
        formIndex !== 0 && <TextField {...Input.vida(write)} />,
        formIndex !== 0 && <TextField {...write.brand} />,
        formIndex !== 0 && (
          <Selection
            name="Nº de Luminárias"
            prefered={0}
            options={["1", "2", "3", "4", "5", "6", "7", "8"]}
          />
        ),

        <Selection name="Estado" prefered={0} options={statelabels} />,
        formIndex !== 0 && <Connector />,
      ].map(
        (element, index) => element && cloneElement(element, { key: index })
      )}
    </>
  );
}
export default function AddingForm({ write }: { write: Language }) {
  const formIndex = setForm.useListener();

  return (
    <form
      id="adding-form"
      onSubmit={async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (formIndex === undefined) return;
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

        const content = getPostContent(formData, write, formIndex!);
        console.log(content)

        try {
          const response = await fetch("http://localhost:3000/api/data", {
            method: setForm.isEditing ? "PUT" : "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(content),
          });
          console.log(response);
          if (response.ok) {
            console.log("Data sent successfully!");
            //console.log(JSON.stringify(response.body));
          } else {
            console.error("Error sending data to the server.");
          }
        } catch (error) {
          console.error("An error occurred:", error);
        }
        setTimeout(() => {
          setForm.to(undefined); //fix
        }, 100);
      }}
      style={{
        width: "inherit",
        height: "inherit",
        position: "absolute",
        transform: formIndex === undefined ? "translateX(-100%)" : "",
        background: "#f6f5e1",
      }}
      className={`language-${write.short_name} scrollable absolute w-full h-full bg-white block text-black`}
    >
      {childrens(write, formIndex!)}
      <input
        key="10000"
        type="submit"
        value={setForm.isEditing ? write.modify : write.register}
        className="selected"
        style={{
          width: "calc(3rem + 50%)",
          borderRadius: "1.5rem",
          margin: "0 calc(25% - 1.5rem)",
        }}
      />
    </form>
  );
}
