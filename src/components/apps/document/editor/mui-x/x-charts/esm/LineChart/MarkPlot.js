import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["slots", "slotProps", "skipAnimation", "onItemClick"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { SeriesContext } from '../context/SeriesContextProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import { MarkElement } from './MarkElement';
import { getValueToPositionMapper } from '../hooks/useScale';
import { useChartId } from '../hooks/useChartId';
import { DEFAULT_X_AXIS_KEY } from '../constants';
import { cleanId } from '../internals/utils';
import getColor from './getColor';
import { jsx as _jsx } from "react/jsx-runtime";
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
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const seriesData = React.useContext(SeriesContext).line;
  const axisData = React.useContext(CartesianContext);
  const chartId = useChartId();
  const Mark = slots?.mark ?? MarkElement;
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
  return /*#__PURE__*/_jsx("g", _extends({}, other, {
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
        const xScale = getValueToPositionMapper(xAxis[xAxisKey].scale);
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
          throw new Error(`MUI X Charts: ${xAxisKey === DEFAULT_X_AXIS_KEY ? 'The first `xAxis`' : `The x-axis with id "${xAxisKey}"`} should have data property to be able to display a line plot.`);
        }
        const clipId = cleanId(`${chartId}-${seriesId}-line-clip`); // We assume that if displaying line mark, the line will also be rendered

        const colorGetter = getColor(series[seriesId], xAxis[xAxisKey], yAxis[yAxisKey]);
        return /*#__PURE__*/_jsx("g", {
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
            return /*#__PURE__*/_jsx(Mark, _extends({
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
export { MarkPlot };