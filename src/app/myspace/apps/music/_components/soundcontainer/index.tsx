import React from "react";
import Badge from "../badge";
import Card from "../card";
import { sounds } from "@/data/soundData";

const SoundContainer = () => {
  return (
    <div>
      <Badge title="effect" classNameIcon="ri-bubble-chart-line" />
      <div className="mt-10 mr-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {sounds.map((value) => (
            <Card key={value.name} {...value} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SoundContainer;
