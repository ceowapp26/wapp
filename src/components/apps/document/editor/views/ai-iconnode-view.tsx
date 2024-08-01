"use client"
import React from "react";
import { AIFallbackView } from "./ai-fallback-view";
import { FaBeer } from "react-icons/fa";
import { FaCoffee } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

const AIIconNodeView = ({ data }: string) => {
  if (!data) {
    return <AIFallbackView data={"There is no available data!"} />;
  }

  let iconComponent: JSX.Element | null = null;

  switch (data.value) {
    case "FaBeer":
      iconComponent = <FaBeer />;
      break;
    case "FaCoffee":
      iconComponent = <FaCoffee />;
      break;
    case "FaHeart":
      iconComponent = <FaHeart />;
      break;
      break;
    default:
      break;
  }

  return iconComponent;
}

AIIconNode.displayName = "AIIconNode";

export { AIIconNodeView };
