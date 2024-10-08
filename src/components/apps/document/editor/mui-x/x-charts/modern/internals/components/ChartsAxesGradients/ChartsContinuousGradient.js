import * as React from 'react';
import { interpolateDate, interpolateNumber } from 'd3-interpolate';
import { jsx as _jsx } from "react/jsx-runtime";
const PX_PRECISION = 10;
export default function ChartsContinuousGradient(props) {
  const {
    isReveresed,
    gradientId,
    size,
    direction,
    scale,
    colorScale,
    colorMap
  } = props;
  const extremValues = [colorMap.min ?? 0, colorMap.max ?? 100];
  const extremPositions = extremValues.map(scale).filter(p => p !== undefined);
  if (extremPositions.length !== 2) {
    return null;
  }
  const interpolator = typeof extremValues[0] === 'number' ? interpolateNumber(extremValues[0], extremValues[1]) : interpolateDate(extremValues[0], extremValues[1]);
  const numberOfPoints = Math.round((Math.max(...extremPositions) - Math.min(...extremPositions)) / PX_PRECISION);
  const keyPrefix = `${extremValues[0]}-${extremValues[1]}-`;
  return /*#__PURE__*/_jsx("linearGradient", {
    id: gradientId,
    x1: "0",
    x2: "0",
    y1: "0",
    y2: "0",
    [`${direction}${isReveresed ? 1 : 2}`]: `${size}px`,
    gradientUnits: "userSpaceOnUse" // Use the SVG coordinate instead of the component ones.
    ,
    children: Array.from({
      length: numberOfPoints + 1
    }, (_, index) => {
      const value = interpolator(index / numberOfPoints);
      if (value === undefined) {
        return null;
      }
      const x = scale(value);
      if (x === undefined) {
        return null;
      }
      const offset = isReveresed ? 1 - x / size : x / size;
      const color = colorScale(value);
      if (color === null) {
        return null;
      }
      return /*#__PURE__*/_jsx("stop", {
        offset: offset,
        stopColor: color,
        stopOpacity: 1
      }, keyPrefix + index);
    })
  });
}