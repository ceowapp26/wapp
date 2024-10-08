// @ignore - do not document.
import * as React from 'react';
import { getPercentageValue } from '../internals/utils';
import { getArcRatios, getAvailableRadius } from './utils';
import { useDrawingArea } from '../hooks/useDrawingArea';
import { jsx as _jsx } from "react/jsx-runtime";
export const GaugeContext = /*#__PURE__*/React.createContext({
  value: null,
  valueMin: 0,
  valueMax: 0,
  startAngle: 0,
  endAngle: 0,
  innerRadius: 0,
  outerRadius: 0,
  cornerRadius: 0,
  cx: 0,
  cy: 0,
  maxRadius: 0,
  valueAngle: null
});
if (process.env.NODE_ENV !== 'production') {
  GaugeContext.displayName = 'GaugeContext';
}
export function GaugeProvider(props) {
  const {
    value = null,
    valueMin = 0,
    valueMax = 100,
    startAngle = 0,
    endAngle = 360,
    outerRadius: outerRadiusParam,
    innerRadius: innerRadiusParam,
    cornerRadius: cornerRadiusParam,
    cx: cxParam,
    cy: cyParam,
    children
  } = props;
  const {
    left,
    top,
    width,
    height
  } = useDrawingArea();
  const ratios = getArcRatios(startAngle, endAngle);
  const innerCx = cxParam ? getPercentageValue(cxParam, width) : ratios.cx * width;
  const innerCy = cyParam ? getPercentageValue(cyParam, height) : ratios.cy * height;
  let cx = left + innerCx;
  let cy = top + innerCy;
  const maxRadius = getAvailableRadius(innerCx, innerCy, width, height, ratios);

  // If the center is not defined, after computation of the available radius, udpate the center to use the remaining space.
  if (cxParam === undefined) {
    const usedWidth = maxRadius * (ratios.maxX - ratios.minX);
    cx = left + (width - usedWidth) / 2 + ratios.cx * usedWidth;
  }
  if (cyParam === undefined) {
    const usedHeight = maxRadius * (ratios.maxY - ratios.minY);
    cy = top + (height - usedHeight) / 2 + ratios.cy * usedHeight;
  }
  const outerRadius = getPercentageValue(outerRadiusParam ?? maxRadius, maxRadius);
  const innerRadius = getPercentageValue(innerRadiusParam ?? '80%', maxRadius);
  const cornerRadius = getPercentageValue(cornerRadiusParam ?? 0, outerRadius - innerRadius);
  const contextValue = React.useMemo(() => {
    const startAngleRad = Math.PI * startAngle / 180;
    const endAngleRad = Math.PI * endAngle / 180;
    return {
      value,
      valueMin,
      valueMax,
      startAngle: startAngleRad,
      endAngle: endAngleRad,
      outerRadius,
      innerRadius,
      cornerRadius,
      cx,
      cy,
      maxRadius,
      valueAngle: value === null ? null : startAngleRad + (endAngleRad - startAngleRad) * (value - valueMin) / (valueMax - valueMin)
    };
  }, [value, valueMin, valueMax, startAngle, endAngle, outerRadius, innerRadius, cornerRadius, cx, cy, maxRadius]);
  return /*#__PURE__*/_jsx(GaugeContext.Provider, {
    value: contextValue,
    children: children
  });
}
export function useGaugeState() {
  return React.useContext(GaugeContext);
}