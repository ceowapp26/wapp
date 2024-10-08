"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CartesianContext = void 0;
exports.CartesianContextProvider = CartesianContextProvider;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _d3Scale = require("d3-scale");
var _extremums = require("../BarChart/extremums");
var _extremums2 = require("../ScatterChart/extremums");
var _extremums3 = require("../LineChart/extremums");
var _axis = require("../models/axis");
var _getScale = require("../internals/getScale");
var _SeriesContextProvider = require("./SeriesContextProvider");
var _constants = require("../constants");
var _useTicks = require("../hooks/useTicks");
var _useDrawingArea = require("../hooks/useDrawingArea");
var _colorScale = require("../internals/colorScale");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const DEFAULT_CATEGORY_GAP_RATIO = 0.2;
const DEFAULT_BAR_GAP_RATIO = 0.1;

// TODO: those might be better placed in a distinct file
const xExtremumGetters = {
  bar: _extremums.getExtremumX,
  scatter: _extremums2.getExtremumX,
  line: _extremums3.getExtremumX
};
const yExtremumGetters = {
  bar: _extremums.getExtremumY,
  scatter: _extremums2.getExtremumY,
  line: _extremums3.getExtremumY
};
const CartesianContext = exports.CartesianContext = /*#__PURE__*/React.createContext({
  xAxis: {},
  yAxis: {},
  xAxisIds: [],
  yAxisIds: []
});
if (process.env.NODE_ENV !== 'production') {
  CartesianContext.displayName = 'CartesianContext';
}
function CartesianContextProvider(props) {
  const {
    xAxis: inXAxis,
    yAxis: inYAxis,
    dataset,
    children
  } = props;
  const formattedSeries = React.useContext(_SeriesContextProvider.SeriesContext);
  const drawingArea = (0, _useDrawingArea.useDrawingArea)();
  const xAxis = React.useMemo(() => inXAxis?.map(axisConfig => {
    const dataKey = axisConfig.dataKey;
    if (dataKey === undefined || axisConfig.data !== undefined) {
      return axisConfig;
    }
    if (dataset === undefined) {
      throw Error('MUI X Charts: x-axis uses `dataKey` but no `dataset` is provided.');
    }
    return (0, _extends2.default)({}, axisConfig, {
      data: dataset.map(d => d[dataKey])
    });
  }), [inXAxis, dataset]);
  const yAxis = React.useMemo(() => inYAxis?.map(axisConfig => {
    const dataKey = axisConfig.dataKey;
    if (dataKey === undefined || axisConfig.data !== undefined) {
      return axisConfig;
    }
    if (dataset === undefined) {
      throw Error('MUI X Charts: y-axis uses `dataKey` but no `dataset` is provided.');
    }
    return (0, _extends2.default)({}, axisConfig, {
      data: dataset.map(d => d[dataKey])
    });
  }), [inYAxis, dataset]);
  const value = React.useMemo(() => {
    const axisExtremumCallback = (acc, chartType, axis, getters, isDefaultAxis) => {
      const getter = getters[chartType];
      const series = formattedSeries[chartType]?.series ?? {};
      const [minChartTypeData, maxChartTypeData] = getter({
        series,
        axis,
        isDefaultAxis
      });
      const [minData, maxData] = acc;
      if (minData === null || maxData === null) {
        return [minChartTypeData, maxChartTypeData];
      }
      if (minChartTypeData === null || maxChartTypeData === null) {
        return [minData, maxData];
      }
      return [Math.min(minChartTypeData, minData), Math.max(maxChartTypeData, maxData)];
    };
    const getAxisExtremum = (axis, getters, isDefaultAxis) => {
      const charTypes = Object.keys(getters);
      return charTypes.reduce((acc, charType) => axisExtremumCallback(acc, charType, axis, getters, isDefaultAxis), [null, null]);
    };
    const allXAxis = [...(xAxis?.map((axis, index) => (0, _extends2.default)({
      id: `defaultized-x-axis-${index}`
    }, axis)) ?? []),
    // Allows to specify an axis with id=DEFAULT_X_AXIS_KEY
    ...(xAxis === undefined || xAxis.findIndex(({
      id
    }) => id === _constants.DEFAULT_X_AXIS_KEY) === -1 ? [{
      id: _constants.DEFAULT_X_AXIS_KEY,
      scaleType: 'linear'
    }] : [])];
    const completedXAxis = {};
    allXAxis.forEach((axis, axisIndex) => {
      const isDefaultAxis = axisIndex === 0;
      const [minData, maxData] = getAxisExtremum(axis, xExtremumGetters, isDefaultAxis);
      const range = axis.reverse ? [drawingArea.left + drawingArea.width, drawingArea.left] : [drawingArea.left, drawingArea.left + drawingArea.width];
      if ((0, _axis.isBandScaleConfig)(axis)) {
        const categoryGapRatio = axis.categoryGapRatio ?? DEFAULT_CATEGORY_GAP_RATIO;
        const barGapRatio = axis.barGapRatio ?? DEFAULT_BAR_GAP_RATIO;
        completedXAxis[axis.id] = (0, _extends2.default)({
          categoryGapRatio,
          barGapRatio
        }, axis, {
          scale: (0, _d3Scale.scaleBand)(axis.data, range).paddingInner(categoryGapRatio).paddingOuter(categoryGapRatio / 2),
          tickNumber: axis.data.length,
          colorScale: axis.colorMap && (axis.colorMap.type === 'ordinal' ? (0, _colorScale.getOrdinalColorScale)((0, _extends2.default)({
            values: axis.data
          }, axis.colorMap)) : (0, _colorScale.getColorScale)(axis.colorMap))
        });
      }
      if ((0, _axis.isPointScaleConfig)(axis)) {
        completedXAxis[axis.id] = (0, _extends2.default)({}, axis, {
          scale: (0, _d3Scale.scalePoint)(axis.data, range),
          tickNumber: axis.data.length,
          colorScale: axis.colorMap && (axis.colorMap.type === 'ordinal' ? (0, _colorScale.getOrdinalColorScale)((0, _extends2.default)({
            values: axis.data
          }, axis.colorMap)) : (0, _colorScale.getColorScale)(axis.colorMap))
        });
      }
      if (axis.scaleType === 'band' || axis.scaleType === 'point') {
        // Could be merged with the two previous "if conditions" but then TS does not get that `axis.scaleType` can't be `band` or `point`.
        return;
      }
      const scaleType = axis.scaleType ?? 'linear';
      const extremums = [axis.min ?? minData, axis.max ?? maxData];
      const tickNumber = (0, _useTicks.getTickNumber)((0, _extends2.default)({}, axis, {
        range,
        domain: extremums
      }));
      const niceScale = (0, _getScale.getScale)(scaleType, extremums, range).nice(tickNumber);
      const niceDomain = niceScale.domain();
      const domain = [axis.min ?? niceDomain[0], axis.max ?? niceDomain[1]];
      completedXAxis[axis.id] = (0, _extends2.default)({}, axis, {
        scaleType,
        scale: niceScale.domain(domain),
        tickNumber,
        colorScale: axis.colorMap && (0, _colorScale.getColorScale)(axis.colorMap)
      });
    });
    const allYAxis = [...(yAxis?.map((axis, index) => (0, _extends2.default)({
      id: `defaultized-y-axis-${index}`
    }, axis)) ?? []), ...(yAxis === undefined || yAxis.findIndex(({
      id
    }) => id === _constants.DEFAULT_Y_AXIS_KEY) === -1 ? [{
      id: _constants.DEFAULT_Y_AXIS_KEY,
      scaleType: 'linear'
    }] : [])];
    const completedYAxis = {};
    allYAxis.forEach((axis, axisIndex) => {
      const isDefaultAxis = axisIndex === 0;
      const [minData, maxData] = getAxisExtremum(axis, yExtremumGetters, isDefaultAxis);
      const range = axis.reverse ? [drawingArea.top, drawingArea.top + drawingArea.height] : [drawingArea.top + drawingArea.height, drawingArea.top];
      if ((0, _axis.isBandScaleConfig)(axis)) {
        const categoryGapRatio = axis.categoryGapRatio ?? DEFAULT_CATEGORY_GAP_RATIO;
        completedYAxis[axis.id] = (0, _extends2.default)({
          categoryGapRatio,
          barGapRatio: 0
        }, axis, {
          scale: (0, _d3Scale.scaleBand)(axis.data, [range[1], range[0]]).paddingInner(categoryGapRatio).paddingOuter(categoryGapRatio / 2),
          tickNumber: axis.data.length,
          colorScale: axis.colorMap && (axis.colorMap.type === 'ordinal' ? (0, _colorScale.getOrdinalColorScale)((0, _extends2.default)({
            values: axis.data
          }, axis.colorMap)) : (0, _colorScale.getColorScale)(axis.colorMap))
        });
      }
      if ((0, _axis.isPointScaleConfig)(axis)) {
        completedYAxis[axis.id] = (0, _extends2.default)({}, axis, {
          scale: (0, _d3Scale.scalePoint)(axis.data, [range[1], range[0]]),
          tickNumber: axis.data.length,
          colorScale: axis.colorMap && (axis.colorMap.type === 'ordinal' ? (0, _colorScale.getOrdinalColorScale)((0, _extends2.default)({
            values: axis.data
          }, axis.colorMap)) : (0, _colorScale.getColorScale)(axis.colorMap))
        });
      }
      if (axis.scaleType === 'band' || axis.scaleType === 'point') {
        // Could be merged with the two previous "if conditions" but then TS does not get that `axis.scaleType` can't be `band` or `point`.
        return;
      }
      const scaleType = axis.scaleType ?? 'linear';
      const extremums = [axis.min ?? minData, axis.max ?? maxData];
      const tickNumber = (0, _useTicks.getTickNumber)((0, _extends2.default)({}, axis, {
        range,
        domain: extremums
      }));
      const niceScale = (0, _getScale.getScale)(scaleType, extremums, range).nice(tickNumber);
      const niceDomain = niceScale.domain();
      const domain = [axis.min ?? niceDomain[0], axis.max ?? niceDomain[1]];
      completedYAxis[axis.id] = (0, _extends2.default)({}, axis, {
        scaleType,
        scale: niceScale.domain(domain),
        tickNumber,
        colorScale: axis.colorMap && (0, _colorScale.getColorScale)(axis.colorMap)
      });
    });
    return {
      xAxis: completedXAxis,
      yAxis: completedYAxis,
      xAxisIds: allXAxis.map(({
        id
      }) => id),
      yAxisIds: allYAxis.map(({
        id
      }) => id)
    };
  }, [drawingArea.height, drawingArea.left, drawingArea.top, drawingArea.width, formattedSeries, xAxis, yAxis]);

  // @ts-ignore
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(CartesianContext.Provider, {
    value: value,
    children: children
  });
}