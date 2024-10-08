import * as React from 'react';
import { SvgContext } from '../context/DrawingProvider';
export function generateVirtualElement(mousePosition) {
  if (mousePosition === null) {
    return {
      getBoundingClientRect: () => ({
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        toJSON: () => ''
      })
    };
  }
  const {
    x,
    y
  } = mousePosition;
  return {
    getBoundingClientRect: () => ({
      width: 0,
      height: 0,
      x,
      y,
      top: y,
      right: x,
      bottom: y,
      left: x,
      toJSON: () => JSON.stringify({
        width: 0,
        height: 0,
        x,
        y,
        top: y,
        right: x,
        bottom: y,
        left: x
      })
    })
  };
}
export function useMouseTracker() {
  const svgRef = React.useContext(SvgContext);

  // Use a ref to avoid rerendering on every mousemove event.
  const [mousePosition, setMousePosition] = React.useState(null);
  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null) {
      return () => {};
    }
    const handleMouseOut = () => {
      setMousePosition(null);
    };
    const handleMouseMove = event => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY
      });
    };
    element.addEventListener('mouseout', handleMouseOut);
    element.addEventListener('mousemove', handleMouseMove);
    return () => {
      element.removeEventListener('mouseout', handleMouseOut);
      element.removeEventListener('mousemove', handleMouseMove);
    };
  }, [svgRef]);
  return mousePosition;
}
export function getTooltipHasData(trigger, displayedData) {
  if (trigger === 'item') {
    return displayedData !== null;
  }
  const hasAxisXData = displayedData.x !== null;
  const hasAxisYData = displayedData.y !== null;
  return hasAxisXData || hasAxisYData;
}
export function isCartesianSeriesType(seriesType) {
  return ['bar', 'line', 'scatter'].includes(seriesType);
}
export function isCartesianSeries(series) {
  return isCartesianSeriesType(series.type);
}
export function utcFormatter(v) {
  if (v instanceof Date) {
    return v.toUTCString();
  }
  return v.toLocaleString();
}