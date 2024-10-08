"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BarPlot = BarPlot;
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _web = require("@react-spring/web");
var _SeriesContextProvider = require("../context/SeriesContextProvider");
var _CartesianContextProvider = require("../context/CartesianContextProvider");
var _BarElement = require("./BarElement");
var _axis = require("../models/axis");
var _constants = require("../constants");
var _getColor = _interopRequireDefault(require("./getColor"));
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["skipAnimation", "onItemClick"];
/**
 * Solution of the equations
 * W = barWidth * N + offset * (N-1)
 * offset / (offset + barWidth) = r
 * @param bandWidth The width available to place bars.
 * @param numberOfGroups The number of bars to place in that space.
 * @param gapRatio The ratio of the gap between bars over the bar width.
 * @returns The bar width and the offset between bars.
 */
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function getBandSize({
  bandWidth: W,
  numberOfGroups: N,
  gapRatio: r
}) {
  if (r === 0) {
    return {
      barWidth: W / N,
      offset: 0
    };
  }
  const barWidth = W / (N + (N - 1) * r);
  const offset = r * barWidth;
  return {
    barWidth,
    offset
  };
}
const useAggregatedData = () => {
  const seriesData = React.useContext(_SeriesContextProvider.SeriesContext).bar ?? {
    series: {},
    stackingGroups: [],
    seriesOrder: []
  };
  const axisData = React.useContext(_CartesianContextProvider.CartesianContext);
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
  const data = stackingGroups.flatMap(({
    ids: groupIds
  }, groupIndex) => {
    return groupIds.flatMap(seriesId => {
      const xAxisKey = series[seriesId].xAxisKey ?? defaultXAxisId;
      const yAxisKey = series[seriesId].yAxisKey ?? defaultYAxisId;
      const xAxisConfig = xAxis[xAxisKey];
      const yAxisConfig = yAxis[yAxisKey];
      const verticalLayout = series[seriesId].layout === 'vertical';
      let baseScaleConfig;
      if (verticalLayout) {
        if (!(0, _axis.isBandScaleConfig)(xAxisConfig)) {
          throw new Error(`MUI X Charts: ${xAxisKey === _constants.DEFAULT_X_AXIS_KEY ? 'The first `xAxis`' : `The x-axis with id "${xAxisKey}"`} shoud be of type "band" to display the bar series of id "${seriesId}".`);
        }
        if (xAxis[xAxisKey].data === undefined) {
          throw new Error(`MUI X Charts: ${xAxisKey === _constants.DEFAULT_X_AXIS_KEY ? 'The first `xAxis`' : `The x-axis with id "${xAxisKey}"`} shoud have data property.`);
        }
        baseScaleConfig = xAxisConfig;
        if ((0, _axis.isBandScaleConfig)(yAxisConfig) || (0, _axis.isPointScaleConfig)(yAxisConfig)) {
          throw new Error(`MUI X Charts: ${yAxisKey === _constants.DEFAULT_Y_AXIS_KEY ? 'The first `yAxis`' : `The y-axis with id "${yAxisKey}"`} shoud be a continuous type to display the bar series of id "${seriesId}".`);
        }
      } else {
        if (!(0, _axis.isBandScaleConfig)(yAxisConfig)) {
          throw new Error(`MUI X Charts: ${yAxisKey === _constants.DEFAULT_Y_AXIS_KEY ? 'The first `yAxis`' : `The y-axis with id "${yAxisKey}"`} shoud be of type "band" to display the bar series of id "${seriesId}".`);
        }
        if (yAxis[yAxisKey].data === undefined) {
          throw new Error(`MUI X Charts: ${yAxisKey === _constants.DEFAULT_Y_AXIS_KEY ? 'The first `yAxis`' : `The y-axis with id "${yAxisKey}"`} shoud have data property.`);
        }
        baseScaleConfig = yAxisConfig;
        if ((0, _axis.isBandScaleConfig)(xAxisConfig) || (0, _axis.isPointScaleConfig)(xAxisConfig)) {
          throw new Error(`MUI X Charts: ${xAxisKey === _constants.DEFAULT_X_AXIS_KEY ? 'The first `xAxis`' : `The x-axis with id "${xAxisKey}"`} shoud be a continuous type to display the bar series of id "${seriesId}".`);
        }
      }
      const xScale = xAxisConfig.scale;
      const yScale = yAxisConfig.scale;
      const colorGetter = (0, _getColor.default)(series[seriesId], xAxis[xAxisKey], yAxis[yAxisKey]);
      const bandWidth = baseScaleConfig.scale.bandwidth();
      const {
        barWidth,
        offset
      } = getBandSize({
        bandWidth,
        numberOfGroups: stackingGroups.length,
        gapRatio: baseScaleConfig.barGapRatio
      });
      const barOffset = groupIndex * (barWidth + offset);
      const {
        stackedData
      } = series[seriesId];
      return stackedData.map((values, dataIndex) => {
        const valueCoordinates = values.map(v => verticalLayout ? yScale(v) : xScale(v));
        const minValueCoord = Math.round(Math.min(...valueCoordinates));
        const maxValueCoord = Math.round(Math.max(...valueCoordinates));
        return {
          seriesId,
          dataIndex,
          layout: series[seriesId].layout,
          x: verticalLayout ? xScale(xAxis[xAxisKey].data?.[dataIndex]) + barOffset : minValueCoord,
          y: verticalLayout ? minValueCoord : yScale(yAxis[yAxisKey].data?.[dataIndex]) + barOffset,
          xOrigin: xScale(0),
          yOrigin: yScale(0),
          height: verticalLayout ? maxValueCoord - minValueCoord : barWidth,
          width: verticalLayout ? barWidth : maxValueCoord - minValueCoord,
          color: colorGetter(dataIndex),
          highlightScope: series[seriesId].highlightScope
        };
      });
    });
  });
  return data;
};
const getOutStyle = ({
  layout,
  yOrigin,
  x,
  width,
  y,
  xOrigin,
  height
}) => (0, _extends2.default)({}, layout === 'vertical' ? {
  y: yOrigin,
  x,
  height: 0,
  width
} : {
  y,
  x: xOrigin,
  height,
  width: 0
});
const getInStyle = ({
  x,
  width,
  y,
  height
}) => ({
  y,
  x,
  height,
  width
});

/**
 * Demos:
 *
 * - [Bars](https://mui.com/x/react-charts/bars/)
 * - [Bar demonstration](https://mui.com/x/react-charts/bar-demo/)
 * - [Stacking](https://mui.com/x/react-charts/stacking/)
 *
 * API:
 *
 * - [BarPlot API](https://mui.com/x/api/charts/bar-plot/)
 */
function BarPlot(props) {
  const completedData = useAggregatedData();
  const {
      skipAnimation,
      onItemClick
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const transition = (0, _web.useTransition)(completedData, {
    keys: bar => `${bar.seriesId}-${bar.dataIndex}`,
    from: getOutStyle,
    leave: getOutStyle,
    enter: getInStyle,
    update: getInStyle,
    immediate: skipAnimation
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(React.Fragment, {
    children: transition((style, {
      seriesId,
      dataIndex,
      color,
      highlightScope
    }) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_BarElement.BarElement, (0, _extends2.default)({
      id: seriesId,
      dataIndex: dataIndex,
      highlightScope: highlightScope,
      color: color
    }, other, {
      onClick: onItemClick && (event => {
        onItemClick(event, {
          type: 'bar',
          seriesId,
          dataIndex
        });
      }),
      style: style
    })))
  });
}
process.env.NODE_ENV !== "production" ? BarPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Callback fired when a bar item is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {BarItemIdentifier} barItemIdentifier The bar item identifier.
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