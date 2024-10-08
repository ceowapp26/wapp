import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
const _excluded = ["slots", "slotProps", "skipAnimation", "onItemClick"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { line as d3Line } from 'd3-shape';
import { SeriesContext } from '../context/SeriesContextProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import { LineElement } from './LineElement';
import { getValueToPositionMapper } from '../hooks/useScale';
import getCurveFactory from '../internals/getCurve';
import { DEFAULT_X_AXIS_KEY } from '../constants';
import { useChartGradient } from '../internals/components/ChartsAxesGradients';
import { jsx as _jsx } from "react/jsx-runtime";
const useAggregatedData = () => {
  const seriesData = React.useContext(SeriesContext).line;
  const axisData = React.useContext(CartesianContext);
  if (seriesData === undefined) {
    return [];
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
  return stackingGroups.flatMap(({
    ids: groupIds
  }) => {
    return groupIds.flatMap(seriesId => {
      const {
        xAxisKey = defaultXAxisId,
        yAxisKey = defaultYAxisId,
        stackedData,
        data,
        connectNulls
      } = series[seriesId];
      const xScale = getValueToPositionMapper(xAxis[xAxisKey].scale);
      const yScale = yAxis[yAxisKey].scale;
      const xData = xAxis[xAxisKey].data;
      const gradientUsed = yAxis[yAxisKey].colorScale && [yAxisKey, 'y'] || xAxis[xAxisKey].colorScale && [xAxisKey, 'x'] || undefined;
      if (process.env.NODE_ENV !== 'production') {
        if (xData === undefined) {
          throw new Error(`MUI X Charts: ${xAxisKey === DEFAULT_X_AXIS_KEY ? 'The first `xAxis`' : `The x-axis with id "${xAxisKey}"`} should have data property to be able to display a line plot.`);
        }
        if (xData.length < stackedData.length) {
          throw new Error(`MUI X Charts: The data length of the x axis (${xData.length} items) is lower than the length of series (${stackedData.length} items).`);
        }
      }
      const linePath = d3Line().x(d => xScale(d.x)).defined((_, i) => connectNulls || data[i] != null).y(d => yScale(d.y[1]));
      const formattedData = xData?.map((x, index) => ({
        x,
        y: stackedData[index]
      })) ?? [];
      const d3Data = connectNulls ? formattedData.filter((_, i) => data[i] != null) : formattedData;
      const d = linePath.curve(getCurveFactory(series[seriesId].curve))(d3Data) || '';
      return _extends({}, series[seriesId], {
        gradientUsed,
        d,
        seriesId
      });
    });
  });
};

/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [LinePlot API](https://mui.com/x/api/charts/line-plot/)
 */
function LinePlot(props) {
  const {
      slots,
      slotProps,
      skipAnimation,
      onItemClick
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const getGradientId = useChartGradient();
  const completedData = useAggregatedData();
  return /*#__PURE__*/_jsx("g", _extends({}, other, {
    children: completedData.map(({
      d,
      seriesId,
      color,
      highlightScope,
      gradientUsed
    }) => {
      return /*#__PURE__*/_jsx(LineElement, {
        id: seriesId,
        d: d,
        color: color,
        gradientId: gradientUsed && getGradientId(...gradientUsed),
        highlightScope: highlightScope,
        skipAnimation: skipAnimation,
        slots: slots,
        slotProps: slotProps,
        onClick: onItemClick && (event => onItemClick(event, {
          type: 'line',
          seriesId
        }))
      }, seriesId);
    })
  }));
}
process.env.NODE_ENV !== "production" ? LinePlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Callback fired when a line item is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {LineItemIdentifier} lineItemIdentifier The line item identifier.
   */
  onItemClick: PropTypes.func,
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation: PropTypes.bool,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object
} : void 0;
export { LinePlot };