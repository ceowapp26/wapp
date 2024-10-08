"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ChartsContinuousGradient;
var React = _interopRequireWildcard(require("react"));
var _d3Interpolate = require("d3-interpolate");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const PX_PRECISION = 10;
function ChartsContinuousGradient(props) {
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
  const interpolator = typeof extremValues[0] === 'number' ? (0, _d3Interpolate.interpolateNumber)(extremValues[0], extremValues[1]) : (0, _d3Interpolate.interpolateDate)(extremValues[0], extremValues[1]);
  const numberOfPoints = Math.round((Math.max(...extremPositions) - Math.min(...extremPositions)) / PX_PRECISION);
  const keyPrefix = `${extremValues[0]}-${extremValues[1]}-`;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("linearGradient", {
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
      return /*#__PURE__*/(0, _jsxRuntime.jsx)("stop", {
        offset: offset,
        stopColor: color,
        stopOpacity: 1
      }, keyPrefix + index);
    })
  });
}