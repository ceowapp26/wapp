"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GaugeContainer = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _useForkRef = _interopRequireDefault(require("@mui/utils/useForkRef"));
var _styles = require("@mui/material/styles");
var _useChartContainerDimensions = require("../ResponsiveChartContainer/useChartContainerDimensions");
var _ChartsSurface = require("../ChartsSurface");
var _DrawingProvider = require("../context/DrawingProvider");
var _GaugeProvider = require("./GaugeProvider");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["width", "height", "margin", "title", "desc", "value", "valueMin", "valueMax", "startAngle", "endAngle", "outerRadius", "innerRadius", "cornerRadius", "cx", "cy", "children"];
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const ResizableContainer = (0, _styles.styled)('div', {
  name: 'MuiGauge',
  slot: 'Container'
})(({
  ownerState,
  theme
}) => ({
  width: ownerState.width ?? '100%',
  height: ownerState.height ?? '100%',
  display: 'flex',
  position: 'relative',
  flexGrow: 1,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  '&>svg': {
    width: '100%',
    height: '100%'
  },
  '& text': {
    fill: (theme.vars || theme).palette.text.primary
  }
}));
const GaugeContainer = exports.GaugeContainer = /*#__PURE__*/React.forwardRef(function GaugeContainer(props, ref) {
  const {
      width: inWidth,
      height: inHeight,
      margin,
      title,
      desc,
      value,
      valueMin = 0,
      valueMax = 100,
      startAngle,
      endAngle,
      outerRadius,
      innerRadius,
      cornerRadius,
      cx,
      cy,
      children
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const [containerRef, width, height] = (0, _useChartContainerDimensions.useChartContainerDimensions)(inWidth, inHeight);
  const svgRef = React.useRef(null);
  const handleRef = (0, _useForkRef.default)(ref, svgRef);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(ResizableContainer, (0, _extends2.default)({
    ref: containerRef,
    ownerState: {
      width: inWidth,
      height: inHeight
    },
    role: "meter",
    "aria-valuenow": value === null ? undefined : value,
    "aria-valuemin": valueMin,
    "aria-valuemax": valueMax
  }, other, {
    children: width && height ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_DrawingProvider.DrawingProvider, {
      width: width,
      height: height,
      margin: (0, _extends2.default)({
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      }, margin),
      svgRef: svgRef,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_GaugeProvider.GaugeProvider, {
        value: value,
        valueMin: valueMin,
        valueMax: valueMax,
        startAngle: startAngle,
        endAngle: endAngle,
        outerRadius: outerRadius,
        innerRadius: innerRadius,
        cornerRadius: cornerRadius,
        cx: cx,
        cy: cy,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsSurface.ChartsSurface, {
          width: width,
          height: height,
          ref: handleRef,
          title: title,
          desc: desc,
          disableAxisListener: true,
          "aria-hidden": "true",
          children: children
        })
      })
    }) : null
  }));
});
process.env.NODE_ENV !== "production" ? GaugeContainer.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  children: _propTypes.default.node,
  className: _propTypes.default.string,
  /**
   * The radius applied to arc corners (similar to border radius).
   * Set it to '50%' to get rounded arc.
   * @default 0
   */
  cornerRadius: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  /**
   * The x coordinate of the arc center.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the width the drawing area.
   */
  cx: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  /**
   * The y coordinate of the arc center.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the height the drawing area.
   */
  cy: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  desc: _propTypes.default.string,
  /**
   * If `true`, the charts will not listen to the mouse move event.
   * It might break interactive features, but will improve performance.
   * @default false
   */
  disableAxisListener: _propTypes.default.bool,
  /**
   * The end angle (deg).
   * @default 360
   */
  endAngle: _propTypes.default.number,
  /**
   * The height of the chart in px. If not defined, it takes the height of the parent element.
   */
  height: _propTypes.default.number,
  /**
   * The radius between circle center and the begining of the arc.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the maximal radius that fit into the drawing area.
   * @default '80%'
   */
  innerRadius: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  /**
   * The margin between the SVG and the drawing area.
   * It's used for leaving some space for extra information such as the x- and y-axis or legend.
   * Accepts an object with the optional properties: `top`, `bottom`, `left`, and `right`.
   * @default object Depends on the charts type.
   */
  margin: _propTypes.default.shape({
    bottom: _propTypes.default.number,
    left: _propTypes.default.number,
    right: _propTypes.default.number,
    top: _propTypes.default.number
  }),
  /**
   * The radius between circle center and the end of the arc.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the maximal radius that fit into the drawing area.
   * @default '100%'
   */
  outerRadius: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  /**
   * The start angle (deg).
   * @default 0
   */
  startAngle: _propTypes.default.number,
  sx: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object, _propTypes.default.bool])), _propTypes.default.func, _propTypes.default.object]),
  title: _propTypes.default.string,
  /**
   * The value of the gauge.
   * Set to `null` to not display a value.
   */
  value: _propTypes.default.number,
  /**
   * The maximal value of the gauge.
   * @default 100
   */
  valueMax: _propTypes.default.number,
  /**
   * The minimal value of the gauge.
   * @default 0
   */
  valueMin: _propTypes.default.number,
  viewBox: _propTypes.default.shape({
    height: _propTypes.default.number,
    width: _propTypes.default.number,
    x: _propTypes.default.number,
    y: _propTypes.default.number
  }),
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   */
  width: _propTypes.default.number
} : void 0;