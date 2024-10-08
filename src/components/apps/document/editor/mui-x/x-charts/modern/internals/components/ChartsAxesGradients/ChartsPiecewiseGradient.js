import * as React from 'react';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function ChartsPiecewiseGradient(props) {
  const {
    isReveresed,
    gradientId,
    size,
    direction,
    scale,
    colorMap
  } = props;
  return /*#__PURE__*/_jsx("linearGradient", {
    id: gradientId,
    x1: "0",
    x2: "0",
    y1: "0",
    y2: "0",
    [`${direction}${isReveresed ? 1 : 2}`]: `${size}px`,
    gradientUnits: "userSpaceOnUse" // Use the SVG coordinate instead of the component ones.
    ,
    children: colorMap.thresholds.map((threshold, index) => {
      const x = scale(threshold);
      if (x === undefined) {
        return null;
      }
      const offset = isReveresed ? 1 - x / size : x / size;
      return /*#__PURE__*/_jsxs(React.Fragment, {
        children: [/*#__PURE__*/_jsx("stop", {
          offset: offset,
          stopColor: colorMap.colors[index],
          stopOpacity: 1
        }), /*#__PURE__*/_jsx("stop", {
          offset: offset,
          stopColor: colorMap.colors[index + 1],
          stopOpacity: 1
        })]
      }, threshold.toString() + index);
    })
  });
}