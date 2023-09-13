"use client";
import "./styles.css";
export * from "./Inputs";
import { setForm } from "@/AddMenu";
import { CoordField } from "./coordfield";
import { Input, Language } from "../utility/Language";
import { TextField, VoltField, Selection } from "./Inputs";

interface _ {
  write: Language;
}
const AddingForm = ({ write }: _) => {
  const formIndex = setForm.useListener()
  return (
    <form
      style={{
        top:0,
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
        const formDataAsJson = formDataToJson(formData, write, formIndex);
        console.log(formDataAsJson);
        try {
          const response = await fetch("/R_", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: formDataAsJson,
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
        setForm.to(undefined);
      }}
    >
      <h2 className="title">
        {write.register} <br />
        {write.Map_object[formIndex!]}
      </h2>
      <TextField {...write._name} />
      <CoordField {...write} {...{ index: formIndex }} />
      <TextField {...write._country} />
      <TextField {...write._province} />
      <TextField {...write._district} />
      <TextField {...write._city} />
      <TextField {...write._street} />
      {formIndex! !== 2 && <TextField {...write._company} />}
      {formIndex! !== 1 ? (
        <Selection {...Input.instalation_type(write)} />
      ) : (
        <>
          <TextField {...write._manufacturer} />
          <TextField {...Input.year()} />
          <Selection {...Input.trafo_type(write)} />
          <VoltField {...{ ...write, index: 0 }} />
          <VoltField {...{ ...write, index: 1 }} />
        </>
      )}
      <TextField {...Input.power(write, formIndex!)} />
      <TextField {...Input.frequency(write, formIndex!)} />{" "}
      <input
        type="submit"
        value={write.register}
        className="selected"
        style={{ float: "left" }}
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
export default AddingForm;
