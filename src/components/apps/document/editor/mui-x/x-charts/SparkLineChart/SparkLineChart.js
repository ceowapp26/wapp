"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SparkLineChart = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _BarChart = require("../BarChart");
var _LineChart = require("../LineChart");
var _ResponsiveChartContainer = require("../ResponsiveChartContainer");
var _constants = require("../constants");
var _ChartsTooltip = require("../ChartsTooltip");
var _ChartsAxisHighlight = require("../ChartsAxisHighlight");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const SPARKLINE_DEFAULT_MARGIN = {
  top: 5,
  bottom: 5,
  left: 5,
  right: 5
};

/**
 * Demos:
 *
 * - [SparkLine](https://mui.com/x/react-charts/sparkline/)
 *
 * API:
 *
 * - [SparkLineChart API](https://mui.com/x/api/charts/spark-line-chart/)
 */
const SparkLineChart = exports.SparkLineChart = /*#__PURE__*/React.forwardRef(function SparkLineChart(props, ref) {
  const {
    xAxis,
    width,
    height,
    margin = SPARKLINE_DEFAULT_MARGIN,
    colors,
    sx,
    showTooltip,
    tooltip,
    showHighlight,
    axisHighlight: inAxisHighlight,
    children,
    slots,
    slotProps,
    data,
    plotType = 'line',
    valueFormatter = value => value === null ? '' : value.toString(),
    area,
    curve = 'linear'
  } = props;
  const defaultXHighlight = showHighlight && plotType === 'bar' ? {
    x: 'band'
  } : {
    x: 'none'
  };
  const axisHighlight = (0, _extends2.default)({}, defaultXHighlight, inAxisHighlight);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_ResponsiveChartContainer.ResponsiveChartContainer, {
    ref: ref,
    series: [(0, _extends2.default)({
      type: plotType,
      data,
      valueFormatter
    }, plotType === 'bar' ? {} : {
      area,
      curve,
      disableHighlight: !showHighlight
    })],
    width: width,
    height: height,
    margin: margin,
    xAxis: [(0, _extends2.default)({
      id: _constants.DEFAULT_X_AXIS_KEY,
      scaleType: plotType === 'bar' ? 'band' : 'point',
      data: Array.from({
        length: data.length
      }, (_, index) => index),
      hideTooltip: xAxis === undefined
    }, xAxis)],
    colors: colors,
    sx: sx,
    disableAxisListener: (!showTooltip || tooltip?.trigger !== 'axis') && axisHighlight?.x === 'none' && axisHighlight?.y === 'none',
    children: [plotType === 'bar' && /*#__PURE__*/(0, _jsxRuntime.jsx)(_BarChart.BarPlot, {
      skipAnimation: true,
      slots: slots,
      slotProps: slotProps,
      sx: {
        shapeRendering: 'auto'
      }
    }), plotType === 'line' && /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_LineChart.AreaPlot, {
        skipAnimation: true,
        slots: slots,
        slotProps: slotProps
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_LineChart.LinePlot, {
        skipAnimation: true,
        slots: slots,
        slotProps: slotProps
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_LineChart.LineHighlightPlot, {
        slots: slots,
        slotProps: slotProps
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsAxisHighlight.ChartsAxisHighlight, (0, _extends2.default)({}, axisHighlight)), showTooltip && /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsTooltip.ChartsTooltip, (0, _extends2.default)({}, tooltip, {
      slotProps: slotProps,
      slots: slots
    })), children]
  });
});
process.env.NODE_ENV !== "production" ? SparkLineChart.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Set to `true` to fill spark line area.
   * Has no effect if plotType='bar'.
   * @default false
   */
  area: _propTypes.default.bool,
  axisHighlight: _propTypes.default.shape({
    x: _propTypes.default.oneOf(['band', 'line', 'none']),
    y: _propTypes.default.oneOf(['band', 'line', 'none'])
  }),
  children: _propTypes.default.node,
  className: _propTypes.default.string,
  /**
   * Color palette used to colorize multiple series.
   * @default blueberryTwilightPalette
   */
  colors: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.string), _propTypes.default.func]),
  /**
   * @default 'linear'
   */
  curve: _propTypes.default.oneOf(['catmullRom', 'linear', 'monotoneX', 'monotoneY', 'natural', 'step', 'stepAfter', 'stepBefore']),
  /**
   * Data to plot.
   */
  data: _propTypes.default.arrayOf(_propTypes.default.number).isRequired,
  /**
   * An array of objects that can be used to populate series and axes data using their `dataKey` property.
   */
  dataset: _propTypes.default.arrayOf(_propTypes.default.object),
  desc: _propTypes.default.string,
  /**
   * If `true`, the charts will not listen to the mouse move event.
   * It might break interactive features, but will improve performance.
   * @default false
   */
  disableAxisListener: _propTypes.default.bool,
  /**
   * The height of the chart in px. If not defined, it takes the height of the parent element.
   */
  height: _propTypes.default.number,
  /**
   * The margin between the SVG and the drawing area.
   * It's used for leaving some space for extra information such as the x- and y-axis or legend.
   * Accepts an object with the optional properties: `top`, `bottom`, `left`, and `right`.
   * @default {
   *   top: 5,
   *   bottom: 5,
   *   left: 5,
   *   right: 5,
   * }
   */
  margin: _propTypes.default.shape({
    bottom: _propTypes.default.number,
    left: _propTypes.default.number,
    right: _propTypes.default.number,
    top: _propTypes.default.number
  }),
  /**
   * Type of plot used.
   * @default 'line'
   */
  plotType: _propTypes.default.oneOf(['bar', 'line']),
  /**
   * Set to `true` to highlight the value.
   * With line, it shows a point.
   * With bar, it shows a highlight band.
   * @default false
   */
  showHighlight: _propTypes.default.bool,
  /**
   * Set to `true` to enable the tooltip in the sparkline.
   * @default false
   */
  showTooltip: _propTypes.default.bool,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: _propTypes.default.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: _propTypes.default.object,
  sx: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object, _propTypes.default.bool])), _propTypes.default.func, _propTypes.default.object]),
  title: _propTypes.default.string,
  tooltip: _propTypes.default.shape({
    axisContent: _propTypes.default.elementType,
    classes: _propTypes.default.object,
    itemContent: _propTypes.default.elementType,
    slotProps: _propTypes.default.object,
    slots: _propTypes.default.object,
    trigger: _propTypes.default.oneOf(['axis', 'item', 'none'])
  }),
  /**
   * Formatter used by the tooltip.
   * @param {number} value The value to format.
   * @returns {string} the formatted value.
   * @default (value: number | null) => (value === null ? '' : value.toString())
   */
  valueFormatter: _propTypes.default.func,
  viewBox: _propTypes.default.shape({
    height: _propTypes.default.number,
    width: _propTypes.default.number,
    x: _propTypes.default.number,
    y: _propTypes.default.number
  }),
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   */
  width: _propTypes.default.number,
  /**
   * The xAxis configuration.
   * Notice it is a single configuration object, not an array of configuration.
   */
  xAxis: _propTypes.default.shape({
    axisId: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
    classes: _propTypes.default.object,
    colorMap: _propTypes.default.oneOfType([_propTypes.default.shape({
      color: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.string.isRequired), _propTypes.default.func]).isRequired,
      max: _propTypes.default.oneOfType([_propTypes.default.instanceOf(Date), _propTypes.default.number]),
      min: _propTypes.default.oneOfType([_propTypes.default.instanceOf(Date), _propTypes.default.number]),
      type: _propTypes.default.oneOf(['continuous']).isRequired
    }), _propTypes.default.shape({
      colors: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
      thresholds: _propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.instanceOf(Date), _propTypes.default.number]).isRequired).isRequired,
      type: _propTypes.default.oneOf(['piecewise']).isRequired
    }), _propTypes.default.shape({
      colors: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
      type: _propTypes.default.oneOf(['ordinal']).isRequired,
      unknownColor: _propTypes.default.string,
      values: _propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.instanceOf(Date), _propTypes.default.number, _propTypes.default.string]).isRequired)
    })]),
    data: _propTypes.default.array,
    dataKey: _propTypes.default.string,
    disableLine: _propTypes.default.bool,
    disableTicks: _propTypes.default.bool,
    fill: _propTypes.default.string,
    hideTooltip: _propTypes.default.bool,
    id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
    label: _propTypes.default.string,
    labelFontSize: _propTypes.default.number,
    labelStyle: _propTypes.default.object,
    max: _propTypes.default.oneOfType([_propTypes.default.instanceOf(Date), _propTypes.default.number]),
    min: _propTypes.default.oneOfType([_propTypes.default.instanceOf(Date), _propTypes.default.number]),
    position: _propTypes.default.oneOf(['bottom', 'left', 'right', 'top']),
    reverse: _propTypes.default.bool,
    scaleType: _propTypes.default.oneOf(['band', 'linear', 'log', 'point', 'pow', 'sqrt', 'time', 'utc']),
    slotProps: _propTypes.default.object,
    slots: _propTypes.default.object,
    stroke: _propTypes.default.string,
    tickFontSize: _propTypes.default.number,
    tickInterval: _propTypes.default.oneOfType([_propTypes.default.oneOf(['auto']), _propTypes.default.array, _propTypes.default.func]),
    tickLabelInterval: _propTypes.default.oneOfType([_propTypes.default.oneOf(['auto']), _propTypes.default.func]),
    tickLabelPlacement: _propTypes.default.oneOf(['middle', 'tick']),
    tickLabelStyle: _propTypes.default.object,
    tickMaxStep: _propTypes.default.number,
    tickMinStep: _propTypes.default.number,
    tickNumber: _propTypes.default.number,
    tickPlacement: _propTypes.default.oneOf(['end', 'extremities', 'middle', 'start']),
    tickSize: _propTypes.default.number,
    valueFormatter: _propTypes.default.func
  })
} : void 0;