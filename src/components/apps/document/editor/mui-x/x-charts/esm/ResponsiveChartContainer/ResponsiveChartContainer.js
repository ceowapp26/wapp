import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["width", "height"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { ChartContainer } from '../ChartContainer';
import { useChartContainerDimensions } from './useChartContainerDimensions';
import { jsx as _jsx } from "react/jsx-runtime";
const ResizableContainer = styled('div', {
  name: 'MuiResponsiveChart',
  slot: 'Container'
})(({
  ownerState
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
  }
}));
const ResponsiveChartContainer = /*#__PURE__*/React.forwardRef(function ResponsiveChartContainer(props, ref) {
  const {
      width: inWidth,
      height: inHeight
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const [containerRef, width, height] = useChartContainerDimensions(inWidth, inHeight);
  return /*#__PURE__*/_jsx(ResizableContainer, {
    ref: containerRef,
    ownerState: {
      width: inWidth,
      height: inHeight
    },
    children: width && height ? /*#__PURE__*/_jsx(ChartContainer, _extends({}, other, {
      width: width,
      height: height,
      ref: ref
    })) : null
  });
});
process.env.NODE_ENV !== "production" ? ResponsiveChartContainer.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  className: PropTypes.string,
  /**
   * Color palette used to colorize multiple series.
   * @default blueberryTwilightPalette
   */
  colors: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.func]),
  /**
   * An array of objects that can be used to populate series and axes data using their `dataKey` property.
   */
  dataset: PropTypes.arrayOf(PropTypes.object),
  desc: PropTypes.string,
  /**
   * If `true`, the charts will not listen to the mouse move event.
   * It might break interactive features, but will improve performance.
   * @default false
   */
  disableAxisListener: PropTypes.bool,
  /**
   * The height of the chart in px. If not defined, it takes the height of the parent element.
   */
  height: PropTypes.number,
  /**
   * The margin between the SVG and the drawing area.
   * It's used for leaving some space for extra information such as the x- and y-axis or legend.
   * Accepts an object with the optional properties: `top`, `bottom`, `left`, and `right`.
   * @default object Depends on the charts type.
   */
  margin: PropTypes.shape({
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number
  }),
  /**
   * The array of series to display.
   * Each type of series has its own specificity.
   * Please refer to the appropriate docs page to learn more about it.
   */
  series: PropTypes.arrayOf(PropTypes.object).isRequired,
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object]),
  title: PropTypes.string,
  viewBox: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number
  }),
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   */
  width: PropTypes.number,
  /**
   * The configuration of the x-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  xAxis: PropTypes.arrayOf(PropTypes.shape({
    axisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    classes: PropTypes.object,
    colorMap: PropTypes.oneOfType([PropTypes.shape({
      color: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string.isRequired), PropTypes.func]).isRequired,
      max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      type: PropTypes.oneOf(['continuous']).isRequired
    }), PropTypes.shape({
      colors: PropTypes.arrayOf(PropTypes.string).isRequired,
      thresholds: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]).isRequired).isRequired,
      type: PropTypes.oneOf(['piecewise']).isRequired
    }), PropTypes.shape({
      colors: PropTypes.arrayOf(PropTypes.string).isRequired,
      type: PropTypes.oneOf(['ordinal']).isRequired,
      unknownColor: PropTypes.string,
      values: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string]).isRequired)
    })]),
    data: PropTypes.array,
    dataKey: PropTypes.string,
    disableLine: PropTypes.bool,
    disableTicks: PropTypes.bool,
    fill: PropTypes.string,
    hideTooltip: PropTypes.bool,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    label: PropTypes.string,
    labelFontSize: PropTypes.number,
    labelStyle: PropTypes.object,
    max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
    min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
    position: PropTypes.oneOf(['bottom', 'left', 'right', 'top']),
    reverse: PropTypes.bool,
    scaleType: PropTypes.oneOf(['band', 'linear', 'log', 'point', 'pow', 'sqrt', 'time', 'utc']),
    slotProps: PropTypes.object,
    slots: PropTypes.object,
    stroke: PropTypes.string,
    tickFontSize: PropTypes.number,
    tickInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.array, PropTypes.func]),
    tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
    tickLabelPlacement: PropTypes.oneOf(['middle', 'tick']),
    tickLabelStyle: PropTypes.object,
    tickMaxStep: PropTypes.number,
    tickMinStep: PropTypes.number,
    tickNumber: PropTypes.number,
    tickPlacement: PropTypes.oneOf(['end', 'extremities', 'middle', 'start']),
    tickSize: PropTypes.number,
    valueFormatter: PropTypes.func
  })),
  /**
   * The configuration of the y-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  yAxis: PropTypes.arrayOf(PropTypes.shape({
    axisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    classes: PropTypes.object,
    colorMap: PropTypes.oneOfType([PropTypes.shape({
      color: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string.isRequired), PropTypes.func]).isRequired,
      max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      type: PropTypes.oneOf(['continuous']).isRequired
    }), PropTypes.shape({
      colors: PropTypes.arrayOf(PropTypes.string).isRequired,
      thresholds: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]).isRequired).isRequired,
      type: PropTypes.oneOf(['piecewise']).isRequired
    }), PropTypes.shape({
      colors: PropTypes.arrayOf(PropTypes.string).isRequired,
      type: PropTypes.oneOf(['ordinal']).isRequired,
      unknownColor: PropTypes.string,
      values: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string]).isRequired)
    })]),
    data: PropTypes.array,
    dataKey: PropTypes.string,
    disableLine: PropTypes.bool,
    disableTicks: PropTypes.bool,
    fill: PropTypes.string,
    hideTooltip: PropTypes.bool,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    label: PropTypes.string,
    labelFontSize: PropTypes.number,
    labelStyle: PropTypes.object,
    max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
    min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
    position: PropTypes.oneOf(['bottom', 'left', 'right', 'top']),
    reverse: PropTypes.bool,
    scaleType: PropTypes.oneOf(['band', 'linear', 'log', 'point', 'pow', 'sqrt', 'time', 'utc']),
    slotProps: PropTypes.object,
    slots: PropTypes.object,
    stroke: PropTypes.string,
    tickFontSize: PropTypes.number,
    tickInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.array, PropTypes.func]),
    tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
    tickLabelPlacement: PropTypes.oneOf(['middle', 'tick']),
    tickLabelStyle: PropTypes.object,
    tickMaxStep: PropTypes.number,
    tickMinStep: PropTypes.number,
    tickNumber: PropTypes.number,
    tickPlacement: PropTypes.oneOf(['end', 'extremities', 'middle', 'start']),
    tickSize: PropTypes.number,
    valueFormatter: PropTypes.func
  }))
} : void 0;
export { ResponsiveChartContainer };