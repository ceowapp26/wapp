"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateVirtualElement = generateVirtualElement;
exports.getTooltipHasData = getTooltipHasData;
exports.isCartesianSeries = isCartesianSeries;
exports.isCartesianSeriesType = isCartesianSeriesType;
exports.useMouseTracker = useMouseTracker;
exports.utcFormatter = utcFormatter;
var React = _interopRequireWildcard(require("react"));
var _DrawingProvider = require("../context/DrawingProvider");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function generateVirtualElement(mousePosition) {
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
function useMouseTracker() {
  const svgRef = React.useContext(_DrawingProvider.SvgContext);

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
function getTooltipHasData(trigger, displayedData) {
  if (trigger === 'item') {
    return displayedData !== null;
  }
  const hasAxisXData = displayedData.x !== null;
  const hasAxisYData = displayedData.y !== null;
  return hasAxisXData || hasAxisYData;
}
function isCartesianSeriesType(seriesType) {
  return ['bar', 'line', 'scatter'].includes(seriesType);
}
function isCartesianSeries(series) {
  return isCartesianSeriesType(series.type);
}
function utcFormatter(v) {
  if (v instanceof Date) {
    return v.toUTCString();
  }
  return v.toLocaleString();
}