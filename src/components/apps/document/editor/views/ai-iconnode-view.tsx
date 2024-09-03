// AIIconNodeView.js
"use client"
import React from "react";
import { AIFallbackView } from "./ai-fallback-view";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as GiIcons from "react-icons/gi";
import * as IoIcons from "react-icons/io";
import * as AiIcons from "react-icons/ai";
import * as BiIcons from "react-icons/bi";
import * as BsIcons from "react-icons/bs";
import * as CgIcons from "react-icons/cg";
import * as DiIcons from "react-icons/di";
import * as FiIcons from "react-icons/fi";

const iconPacks = {
  Fa: FaIcons,
  Md: MdIcons,
  Gi: GiIcons,
  Io: IoIcons,
  Ai: AiIcons,
  Bi: BiIcons,
  Bs: BsIcons,
  Cg: CgIcons,
  Di: DiIcons,
  Fi: FiIcons,
};

const AIIconNodeView = ({ data, color, size, sizeRatio, effect }) => {
  if (!data) {
    return <AIFallbackView data={"There is no available data!"} />;
  }

  const iconName = data;
  const packPrefix = iconName.slice(0, 2);
  const IconComponent = iconPacks[packPrefix]?.[iconName];

  const iconStyle = {
    color: color,
    fontSize: `${size * sizeRatio}px`,
    animation: effect === 'pulse' ? 'pulse 2s infinite' : 
               effect === 'spin' ? 'spin 2s linear infinite' : 
               effect === 'bounce' ? 'bounce 1s infinite' : 'none',
    maxWidth: '100%',
    maxHeight: '100%',
  };

  return IconComponent ? <IconComponent style={iconStyle} /> : null;
};

AIIconNodeView.displayName = "AIIconNodeView";

export { AIIconNodeView };