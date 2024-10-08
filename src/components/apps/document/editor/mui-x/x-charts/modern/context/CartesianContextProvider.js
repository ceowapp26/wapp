import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { scaleBand, scalePoint } from 'd3-scale';
import { getExtremumX as getBarExtremumX, getExtremumY as getBarExtremumY } from '../BarChart/extremums';
import { getExtremumX as getScatterExtremumX, getExtremumY as getScatterExtremumY } from '../ScatterChart/extremums';
import { getExtremumX as getLineExtremumX, getExtremumY as getLineExtremumY } from '../LineChart/extremums';
import { isBandScaleConfig, isPointScaleConfig } from '../models/axis';
import { getScale } from '../internals/getScale';
import { SeriesContext } from './SeriesContextProvider';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../constants';
import { getTickNumber } from '../hooks/useTicks';
import { useDrawingArea } from '../hooks/useDrawingArea';
import { getColorScale, getOrdinalColorScale } from '../internals/colorScale';
import { jsx as _jsx } from "react/jsx-runtime";
const DEFAULT_CATEGORY_GAP_RATIO = 0.2;
const DEFAULT_BAR_GAP_RATIO = 0.1;

// TODO: those might be better placed in a distinct file
const xExtremumGetters = {
  bar: getBarExtremumX,
  scatter: getScatterExtremumX,
  line: getLineExtremumX
};
const yExtremumGetters = {
  bar: getBarExtremumY,
  scatter: getScatterExtremumY,
  line: getLineExtremumY
};
export const CartesianContext = /*#__PURE__*/React.createContext({
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
  const formattedSeries = React.useContext(SeriesContext);
  const drawingArea = useDrawingArea();
  const xAxis = React.useMemo(() => inXAxis?.map(axisConfig => {
    const dataKey = axisConfig.dataKey;
    if (dataKey === undefined || axisConfig.data !== undefined) {
      return axisConfig;
    }
    if (dataset === undefined) {
      throw Error('MUI X Charts: x-axis uses `dataKey` but no `dataset` is provided.');
    }
    return _extends({}, axisConfig, {
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
    return _extends({}, axisConfig, {
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
    const allXAxis = [...(xAxis?.map((axis, index) => _extends({
      id: `defaultized-x-axis-${index}`
    }, axis)) ?? []),
    // Allows to specify an axis with id=DEFAULT_X_AXIS_KEY
    ...(xAxis === undefined || xAxis.findIndex(({
      id
    }) => id === DEFAULT_X_AXIS_KEY) === -1 ? [{
      id: DEFAULT_X_AXIS_KEY,
      scaleType: 'linear'
    }] : [])];
    const completedXAxis = {};
    allXAxis.forEach((axis, axisIndex) => {
      const isDefaultAxis = axisIndex === 0;
      const [minData, maxData] = getAxisExtremum(axis, xExtremumGetters, isDefaultAxis);
      const range = axis.reverse ? [drawingArea.left + drawingArea.width, drawingArea.left] : [drawingArea.left, drawingArea.left + drawingArea.width];
      if (isBandScaleConfig(axis)) {
        const categoryGapRatio = axis.categoryGapRatio ?? DEFAULT_CATEGORY_GAP_RATIO;
        const barGapRatio = axis.barGapRatio ?? DEFAULT_BAR_GAP_RATIO;
        completedXAxis[axis.id] = _extends({
          categoryGapRatio,
          barGapRatio
        }, axis, {
          scale: scaleBand(axis.data, range).paddingInner(categoryGapRatio).paddingOuter(categoryGapRatio / 2),
          tickNumber: axis.data.length,
          colorScale: axis.colorMap && (axis.colorMap.type === 'ordinal' ? getOrdinalColorScale(_extends({
            values: axis.data
          }, axis.colorMap)) : getColorScale(axis.colorMap))
        });
      }
      if (isPointScaleConfig(axis)) {
        completedXAxis[axis.id] = _extends({}, axis, {
          scale: scalePoint(axis.data, range),
          tickNumber: axis.data.length,
          colorScale: axis.colorMap && (axis.colorMap.type === 'ordinal' ? getOrdinalColorScale(_extends({
            values: axis.data
          }, axis.colorMap)) : getColorScale(axis.colorMap))
        });
      }
      if (axis.scaleType === 'band' || axis.scaleType === 'point') {
        // Could be merged with the two previous "if conditions" but then TS does not get that `axis.scaleType` can't be `band` or `point`.
        return;
      }
      const scaleType = axis.scaleType ?? 'linear';
      const extremums = [axis.min ?? minData, axis.max ?? maxData];
      const tickNumber = getTickNumber(_extends({}, axis, {
        range,
        domain: extremums
      }));
      const niceScale = getScale(scaleType, extremums, range).nice(tickNumber);
      const niceDomain = niceScale.domain();
      const domain = [axis.min ?? niceDomain[0], axis.max ?? niceDomain[1]];
      completedXAxis[axis.id] = _extends({}, axis, {
        scaleType,
        scale: niceScale.domain(domain),
        tickNumber,
        colorScale: axis.colorMap && getColorScale(axis.colorMap)
      });
    });
    const allYAxis = [...(yAxis?.map((axis, index) => _extends({
      id: `defaultized-y-axis-${index}`
    }, axis)) ?? []), ...(yAxis === undefined || yAxis.findIndex(({
      id
    }) => id === DEFAULT_Y_AXIS_KEY) === -1 ? [{
      id: DEFAULT_Y_AXIS_KEY,
      scaleType: 'linear'
    }] : [])];
    const completedYAxis = {};
    allYAxis.forEach((axis, axisIndex) => {
      const isDefaultAxis = axisIndex === 0;
      const [minData, maxData] = getAxisExtremum(axis, yExtremumGetters, isDefaultAxis);
      const range = axis.reverse ? [drawingArea.top, drawingArea.top + drawingArea.height] : [drawingArea.top + drawingArea.height, drawingArea.top];
      if (isBandScaleConfig(axis)) {
        const categoryGapRatio = axis.categoryGapRatio ?? DEFAULT_CATEGORY_GAP_RATIO;
        completedYAxis[axis.id] = _extends({
          categoryGapRatio,
          barGapRatio: 0
        }, axis, {
          scale: scaleBand(axis.data, [range[1], range[0]]).paddingInner(categoryGapRatio).paddingOuter(categoryGapRatio / 2),
          tickNumber: axis.data.length,
          colorScale: axis.colorMap && (axis.colorMap.type === 'ordinal' ? getOrdinalColorScale(_extends({
            values: axis.data
          }, axis.colorMap)) : getColorScale(axis.colorMap))
        });
      }
      if (isPointScaleConfig(axis)) {
        completedYAxis[axis.id] = _extends({}, axis, {
          scale: scalePoint(axis.data, [range[1], range[0]]),
          tickNumber: axis.data.length,
          colorScale: axis.colorMap && (axis.colorMap.type === 'ordinal' ? getOrdinalColorScale(_extends({
            values: axis.data
          }, axis.colorMap)) : getColorScale(axis.colorMap))
        });
      }
      if (axis.scaleType === 'band' || axis.scaleType === 'point') {
        // Could be merged with the two previous "if conditions" but then TS does not get that `axis.scaleType` can't be `band` or `point`.
        return;
      }
      const scaleType = axis.scaleType ?? 'linear';
      const extremums = [axis.min ?? minData, axis.max ?? maxData];
      const tickNumber = getTickNumber(_extends({}, axis, {
        range,
        domain: extremums
      }));
      const niceScale = getScale(scaleType, extremums, range).nice(tickNumber);
      const niceDomain = niceScale.domain();
      const domain = [axis.min ?? niceDomain[0], axis.max ?? niceDomain[1]];
      completedYAxis[axis.id] = _extends({}, axis, {
        scaleType,
        scale: niceScale.domain(domain),
        tickNumber,
        colorScale: axis.colorMap && getColorScale(axis.colorMap)
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
  return /*#__PURE__*/_jsx(CartesianContext.Provider, {
    value: value,
    children: children
  });
}
export { CartesianContextProvider };