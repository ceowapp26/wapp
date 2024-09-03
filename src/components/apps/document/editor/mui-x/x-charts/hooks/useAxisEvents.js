"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAxisEvents = void 0;
var React = _interopRequireWildcard(require("react"));
var _InteractionProvider = require("../context/InteractionProvider");
var _CartesianContextProvider = require("../context/CartesianContextProvider");
var _isBandScale = require("../internals/isBandScale");
var _utils = require("../internals/utils");
var _useSvgRef = require("./useSvgRef");
var _useDrawingArea = require("./useDrawingArea");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function getAsANumber(value) {
  return value instanceof Date ? value.getTime() : value;
}
const useAxisEvents = disableAxisListener => {
  const svgRef = (0, _useSvgRef.useSvgRef)();
  const {
    left,
    top,
    width,
    height
  } = (0, _useDrawingArea.useDrawingArea)();
  const {
    xAxis,
    yAxis,
    xAxisIds,
    yAxisIds
  } = React.useContext(_CartesianContextProvider.CartesianContext);
  const {
    dispatch
  } = React.useContext(_InteractionProvider.InteractionContext);
  const usedXAxis = xAxisIds[0];
  const usedYAxis = yAxisIds[0];

  // Use a ref to avoid rerendering on every mousemove event.
  const mousePosition = React.useRef({
    x: -1,
    y: -1
  });
  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null || disableAxisListener) {
      return () => {};
    }
    const getUpdate = (axisConfig, mouseValue) => {
      if (usedXAxis === null) {
        return null;
      }
      const {
        scale,
        data: axisData,
        reverse
      } = axisConfig;
      if (!(0, _isBandScale.isBandScale)(scale)) {
        const value = scale.invert(mouseValue);
        if (axisData === undefined) {
          return {
            value
          };
        }
        const valueAsNumber = getAsANumber(value);
        const closestIndex = axisData?.findIndex((pointValue, index) => {
          const v = getAsANumber(pointValue);
          if (v > valueAsNumber) {
            if (index === 0 || Math.abs(valueAsNumber - v) <= Math.abs(valueAsNumber - getAsANumber(axisData[index - 1]))) {
              return true;
            }
          }
          if (v <= valueAsNumber) {
            if (index === axisData.length - 1 || Math.abs(getAsANumber(value) - v) < Math.abs(getAsANumber(value) - getAsANumber(axisData[index + 1]))) {
              return true;
            }
          }
          return false;
        });
        return {
          value: closestIndex !== undefined && closestIndex >= 0 ? axisData[closestIndex] : value,
          index: closestIndex
        };
      }
      const dataIndex = scale.bandwidth() === 0 ? Math.floor((mouseValue - Math.min(...scale.range()) + scale.step() / 2) / scale.step()) : Math.floor((mouseValue - Math.min(...scale.range())) / scale.step());
      if (dataIndex < 0 || dataIndex >= axisData.length) {
        return null;
      }
      if (reverse) {
        const reverseIndex = axisData.length - 1 - dataIndex;
        return {
          index: reverseIndex,
          value: axisData[reverseIndex]
        };
      }
      return {
        index: dataIndex,
        value: axisData[dataIndex]
      };
    };
    const handleMouseOut = () => {
      mousePosition.current = {
        x: -1,
        y: -1
      };
      dispatch({
        type: 'exitChart'
      });
    };
    const handleMouseMove = event => {
      const svgPoint = (0, _utils.getSVGPoint)(svgRef.current, event);
      mousePosition.current = {
        x: svgPoint.x,
        y: svgPoint.y
      };
      const outsideX = svgPoint.x < left || svgPoint.x > left + width;
      const outsideY = svgPoint.y < top || svgPoint.y > top + height;
      if (outsideX || outsideY) {
        dispatch({
          type: 'exitChart'
        });
        return;
      }
      const newStateX = getUpdate(xAxis[usedXAxis], svgPoint.x);
      const newStateY = getUpdate(yAxis[usedYAxis], svgPoint.y);
      dispatch({
        type: 'updateAxis',
        data: {
          x: newStateX,
          y: newStateY
        }
      });
    };
    element.addEventListener('mouseout', handleMouseOut);
    element.addEventListener('mousemove', handleMouseMove);
    return () => {
      element.removeEventListener('mouseout', handleMouseOut);
      element.removeEventListener('mousemove', handleMouseMove);
    };
  }, [svgRef, dispatch, left, width, top, height, usedYAxis, yAxis, usedXAxis, xAxis, disableAxisListener]);
};
exports.useAxisEvents = useAxisEvents;