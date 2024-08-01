"use client"
import React from "react";
import { FaBeer } from "react-icons/fa";
import { FaCoffee } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

const AIIconNode = ({ data }: any) => {
  if (!data) return null;

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

export { AIIconNode };
