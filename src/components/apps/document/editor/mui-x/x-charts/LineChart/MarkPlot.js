"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MarkPlot = MarkPlot;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _SeriesContextProvider = require("../context/SeriesContextProvider");
var _CartesianContextProvider = require("../context/CartesianContextProvider");
var _MarkElement = require("./MarkElement");
var _useScale = require("../hooks/useScale");
var _useChartId = require("../hooks/useChartId");
var _constants = require("../constants");
var _utils = require("../internals/utils");
var _getColor = _interopRequireDefault(require("./getColor"));
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["slots", "slotProps", "skipAnimation", "onItemClick"];
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [MarkPlot API](https://mui.com/x/api/charts/mark-plot/)
 */
function MarkPlot(props) {
  const {
      slots,
      slotProps,
      skipAnimation,
      onItemClick
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const seriesData = React.useContext(_SeriesContextProvider.SeriesContext).line;
  const axisData = React.useContext(_CartesianContextProvider.CartesianContext);
  const chartId = (0, _useChartId.useChartId)();
  const Mark = slots?.mark ?? _MarkElement.MarkElement;
  if (seriesData === undefined) {
    return null;
  }
  const {
    series,
    stackingGroups
  } = seriesData;
  const {
    xAxis,
    yAxis,
    xAxisIds,
    yAxisIds
  } = axisData;
  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("g", (0, _extends2.default)({}, other, {
    children: stackingGroups.flatMap(({
      ids: groupIds
    }) => {
      return groupIds.map(seriesId => {
        const {
          xAxisKey = defaultXAxisId,
          yAxisKey = defaultYAxisId,
          stackedData,
          data,
          showMark = true
        } = series[seriesId];
        if (showMark === false) {
          return null;
        }
        const xScale = (0, _useScale.getValueToPositionMapper)(xAxis[xAxisKey].scale);
        const yScale = yAxis[yAxisKey].scale;
        const xData = xAxis[xAxisKey].data;
        const xRange = xAxis[xAxisKey].scale.range();
        const yRange = yScale.range();
        const isInRange = ({
          x,
          y
        }) => {
          if (x < Math.min(...xRange) || x > Math.max(...xRange)) {
            return false;
          }
          if (y < Math.min(...yRange) || y > Math.max(...yRange)) {
            return false;
          }
          return true;
        };
        if (xData === undefined) {
          throw new Error(`MUI X Charts: ${xAxisKey === _constants.DEFAULT_X_AXIS_KEY ? 'The first `xAxis`' : `The x-axis with id "${xAxisKey}"`} should have data property to be able to display a line plot.`);
        }
        const clipId = (0, _utils.cleanId)(`${chartId}-${seriesId}-line-clip`); // We assume that if displaying line mark, the line will also be rendered

        const colorGetter = (0, _getColor.default)(series[seriesId], xAxis[xAxisKey], yAxis[yAxisKey]);
        return /*#__PURE__*/(0, _jsxRuntime.jsx)("g", {
          clipPath: `url(#${clipId})`,
          children: xData?.map((x, index) => {
            const value = data[index] == null ? null : stackedData[index][1];
            return {
              x: xScale(x),
              y: value === null ? null : yScale(value),
              position: x,
              value,
              index
            };
          }).filter(({
            x,
            y,
            index,
            position,
            value
          }) => {
            if (value === null || y === null) {
              // Remove missing data point
              return false;
            }
            if (!isInRange({
              x,
              y
            })) {
              // Remove out of range
              return false;
            }
            if (showMark === true) {
              return true;
            }
            return showMark({
              x,
              y,
              index,
              position,
              value
            });
          }).map(({
            x,
            y,
            index
          }) => {
            return /*#__PURE__*/(0, _jsxRuntime.jsx)(Mark, (0, _extends2.default)({
              id: seriesId,
              dataIndex: index,
              shape: "circle",
              color: colorGetter(index),
              x: x,
              y: y // Don't know why TS doesn't get from the filter that y can't be null
              ,
              highlightScope: series[seriesId].highlightScope,
              skipAnimation: skipAnimation,
              onClick: onItemClick && (event => onItemClick(event, {
                type: 'line',
                seriesId,
                dataIndex: index
              }))
            }, slotProps?.mark), `${seriesId}-${index}`);
          })
        }, seriesId);
      });
    })
  }));
}
process.env.NODE_ENV !== "production" ? MarkPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Callback fired when a line mark item is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {LineItemIdentifier} lineItemIdentifier The line mark item identifier.
   */
  onItemClick: _propTypes.default.func,
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation: _propTypes.default.bool,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: _propTypes.default.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: _propTypes.default.object
} : void 0;