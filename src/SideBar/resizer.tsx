"use client";
import {
  HTMLAttributes,
  MouseEvent,
  MouseEventHandler,
  useEffect,
  useMemo,
} from "react";
import "./styles.css";
import { release } from "os";
import { setForm } from "@/AddMenu";

interface ResizerContent {
  min: number;
  max: number;
  restore: () => void;
  release: () => void;
  bar: HTMLElement | null;
  target: HTMLElement | null;
  parent: HTMLElement | null;
  resizerCenter: number | null;
  onMouseDown: MouseEventHandler<HTMLDivElement>;
  onDoubleClick: MouseEventHandler<HTMLDivElement>;
  HandleResize: (this: Window, ev: WindowEventMap["mousemove"]) => void;
}
export default function Resizer() {
  const isNumber = setForm.useNumber();
  const resizer: ResizerContent[] = useMemo(() => [], []);

  useEffect(() => {
    resizer.push({
      target: null,
      parent: null,
      bar: null,
      min: 0,
      max: 0,
      resizerCenter: 0,
      onMouseDown: (event) => {
        if ((resizer[0].parent?.clientWidth ?? 3) * 0.45 !== resizer[0].max) {
          resizer[0].bar = event.currentTarget;
          resizer[0].parent = event.currentTarget.parentNode as any;
          resizer[0].target = event.currentTarget.nextElementSibling as any;
          resizer[0].resizerCenter = event.currentTarget.clientWidth / 2;
          resizer[0].max = resizer[0].parent!.clientWidth * 0.45;
          resizer[0].min = Math.min(300, resizer[0].max);
        }
        event.detail !== 2 && event.preventDefault();

        window.addEventListener("mousemove", resizer[0].HandleResize);
        window.addEventListener("mouseup", resizer[0].release);
        window.addEventListener("mouseleave", resizer[0].release);
      },
      onDoubleClick: (event): void => {
        if (resizer[0].target!.style.transform === "none") {
          setForm.to(undefined);
          resizer[0].target!.style.transform = `translateX(-100%)`;
          resizer[0].target!.style.position = `absolute`;
          resizer[0].bar!.style.cursor = "pointer";
        } else {
          resizer[0].restore();
        }
        resizer[0].release();
      },
      HandleResize: function (this, ev): void {
        let pos = ev.clientX - resizer[0].resizerCenter!;
        if (pos < resizer[0].min) {
          pos = resizer[0].min;
          release();
        } else if (pos > resizer[0].max) {
          pos = resizer[0].max;
          release();
        }
        resizer[0].target!.style.width = `${pos}px`;
      },
      release: (): void => {
        window.removeEventListener("mousemove", resizer[0].HandleResize);
        window.removeEventListener("mouseup", resizer[0].release);
        window.removeEventListener("mouseleave", resizer[0].release);
      },
      restore: () => {
        if (!resizer.at(0)?.target) return;
        resizer[0].target!.style.transform = "none";
        resizer[0].target!.style.position = "";
        resizer[0].bar!.style.cursor = "";
      },
    });
    return () => {
      resizer[0].restore();
      resizer.pop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (isNumber) {
    resizer.at(0)?.restore();
  }
  return (
    <div
      className={"cursor-ew-resize h-full"}
      id="resizer"
      onMouseDown={resizer.at(0)?.onMouseDown}
      onDoubleClick={resizer.at(0)?.onDoubleClick}
    ></div>
  );
}
