"use client"

import clsx from "clsx";

type MenuWrapperProps = {
  className?: string;
  index: number;
  hovering: number | null;
  children: React.ReactNode;
};

export function MenuWrapper({ className, index, hovering, children }: MenuWrapperProps) {
  return (
    <div
      className={clsx(
        "absolute transition-all duration-300",
        className,
        hovering === index ? "opacity-100" : "opacity-0 pointer-events-none",
        (hovering === index || hovering === null) ? "transform-none" : (hovering! > index ? "-translate-x-24" : "translate-x-24")
      )}
    >
      {children}
    </div>
  );
}
