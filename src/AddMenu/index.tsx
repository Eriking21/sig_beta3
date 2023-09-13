"use client";
import { useEffect, useMemo, useState } from "react";
import SplashButton from "../utility/SplashButton";
import { PowerItem } from "../utility/options";
import { FaPlus, FaTimes } from "react-icons/fa";

export const filterForm = (form: any, result = form) =>
  typeof form === "number" && form < PowerItem.length ? result : undefined;

interface AddMenuButton {
  src: string;
  action: () => void;
}

interface Props {
  onRight?: Boolean;
  R?: number;
  buttons?: AddMenuButton[];
}
type FormIndex = number | undefined;

export const setForm = {
  _list: [(i: FormIndex | null) => {}],
  to: (i: FormIndex | null) => setForm._list.forEach((setTo) => setTo(i)),
  useInit: () => {
    const [formIndex, setFormIndex] = useState<FormIndex | null>(undefined);
    useEffect(() => {
      setForm._list[0] = setFormIndex;
    }, []);
    return formIndex;
  },
  useListener: () => {
    const [formIndex, setFormIndex] = useState<FormIndex>(undefined);
    useEffect(() => {
      const elem = setForm._list.push((i) => setFormIndex(i ?? undefined)) - 1;
      return () => {
        setForm._list.splice(elem, 1);
      };
    }, []);
    return formIndex;
  },
  useNumber: () => {
    const [isNumber, setIsNumber] = useState<boolean>(false);
    useEffect(() => {
      const elem =
        setForm._list.push((i) => setIsNumber(typeof i === "number")) - 1;
      return () => {
        setForm._list.splice(elem, 1);
      };
    }, []);
    return isNumber;
  },
};

const AddMenu = ({ onRight = true, R = 90 }: Props) => {
  const formIndex = setForm.useInit();

  const is_adding = () => typeof formIndex === "number";
  const right = onRight ? 0 : undefined;
  const childs = useMemo(() => {
    return PowerItem.map(({ src }, index) => {
      const arc = Math.PI / 2 / (PowerItem.length - 1);
      const angle = -arc! * index;
      const X = R * Math.cos(angle) * (onRight ? -1 : 1);
      const Y = R * Math.sin(angle);
      const t = formIndex === null ? `translate(${X}px, ${Y}px)` : "none";

      return (
        <SplashButton
          backgroundColor={filterForm(formIndex, ["#93cbdd", "#ff0000e3"])}
          imgPadding={["16%", "13%"]}
          key={"M" + index}
          bottom={0}
          right={right}
          translate={t}
          content={src}
          action={() => setTimeout(() => setForm.to(index), 300)}
        />
      );
    });
  }, [R, formIndex, onRight, right]).concat(
    <SplashButton
      key={"M" + PowerItem.length}
      backgroundColor={filterForm(formIndex, ["#93cbdd", "#ff0000e3"])}
      className={is_adding() ? "mainButton adding" : "mainButton"}
      content={filterForm(formIndex, <FaTimes color="white" />) ?? <FaPlus />}
      right={right}
      bottom={0}
      action={
        formIndex === undefined
          ? () => setForm.to(null)
          : formIndex === null
          ? () => setForm.to(undefined)
          : () => setTimeout(() => setForm.to(undefined), 100)
      }
    />
  );
  return (
    <div
      style={{
        right: right,
        bottom: 0,
        position: "absolute",
      }}
    >
      {childs}
    </div>
  );
};

export default AddMenu;
