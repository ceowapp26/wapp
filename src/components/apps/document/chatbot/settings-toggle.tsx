import React from 'react';
import { Switch, cn } from "@nextui-org/react";
import { ToggleLeft, ToggleRight } from 'lucide-react';

const SettingToggle = ({
  label,
  isChecked,
  setIsChecked,
}: {
  label: string;
  isChecked: boolean;
  setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Switch
      defaultSelected
      size="lg"
      color="success"
      onChange={() => setIsChecked((prev) => !prev)}
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <ToggleLeft className={className} />
        ) : (
          <ToggleRight className={className} />
        )
      }
      classNames={{
        base: cn(
          "inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center",
          "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary",
        ),
        thumb: cn("w-6 h-6 border-2 shadow-lg",
          "group-data-[hover=true]:border-primary",
          //selected
          "group-data-[selected=true]:ml-6",
          // pressed
          "group-data-[pressed=true]:w-7",
          "group-data-[selected]:group-data-[pressed]:ml-4",
        ),
        thumbIcon: "bg-violet-500/80 rounded-full text-white",
        label: "text-black font-bold"
      }}
    >
      {label}
    </Switch>
  );
};

export default SettingToggle;