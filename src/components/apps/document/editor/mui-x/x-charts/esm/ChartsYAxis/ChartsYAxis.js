import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
const _excluded = ["scale", "tickNumber"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { useSlotProps } from '@mui/base/utils';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { useThemeProps, useTheme } from '@mui/material/styles';
import { CartesianContext } from '../context/CartesianContextProvider';
import { useTicks } from '../hooks/useTicks';
import { useDrawingArea } from '../hooks/useDrawingArea';
import { AxisRoot } from '../internals/components/AxisSharedComponents';
import { ChartsText } from '../ChartsText';
import { getAxisUtilityClass } from '../ChartsAxis/axisClasses';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const useUtilityClasses = ownerState => {
  const {
    classes,
    position
  } = ownerState;
  const slots = {
    root: ['root', 'directionY', position],
    line: ['line'],
    tickContainer: ['tickContainer'],
    tick: ['tick'],
    tickLabel: ['tickLabel'],
    label: ['label']
  };
  return composeClasses(slots, getAxisUtilityClass, classes);
};
const defaultProps = {
  position: 'left',
  disableLine: false,
  disableTicks: false,
  tickFontSize: 12,
  labelFontSize: 14,
  tickSize: 6
};

/**
 * Demos:
 *
 * - [Axis](https://mui.com/x/react-charts/axis/)
 *
 * API:
 *
 * - [ChartsYAxis API](https://mui.com/x/api/charts/charts-y-axis/)
 */
function ChartsYAxis(inProps) {
  const props = useThemeProps({
    props: _extends({}, defaultProps, inProps),
    name: 'MuiChartsYAxis'
  });
  const {
    yAxisIds
  } = React.useContext(CartesianContext);
  const _React$useContext = React.useContext(CartesianContext),
    _ref = props.axisId ?? yAxisIds[0],
    {
      yAxis: {
        [_ref]: {
          scale: yScale,
          tickNumber
        }
      }
    } = _React$useContext,
    settings = _objectWithoutPropertiesLoose(_React$useContext.yAxis[_ref], _excluded);
  const defaultizedProps = _extends({}, defaultProps, settings, props);
  const {
    position,
    disableLine,
    disableTicks,
    tickFontSize,
    label,
    labelFontSize,
    labelStyle,
    tickLabelStyle,
    tickSize: tickSizeProp,
    valueFormatter,
    slots,
    slotProps,
    tickPlacement,
    tickLabelPlacement,
    tickInterval,
    tickLabelInterval
  } = defaultizedProps;
  const theme = useTheme();
  const classes = useUtilityClasses(_extends({}, defaultizedProps, {
    theme
  }));
  const {
    left,
    top,
    width,
    height
  } = useDrawingArea();
  const tickSize = disableTicks ? 4 : tickSizeProp;
  const yTicks = useTicks({
    scale: yScale,
    tickNumber,
    valueFormatter,
    tickPlacement,
    tickLabelPlacement,
    tickInterval
  });
  const positionSign = position === 'right' ? 1 : -1;
  const labelRefPoint = {
    x: positionSign * (tickFontSize + tickSize + 10),
    y: top + height / 2
  };
  const Line = slots?.axisLine ?? 'line';
  const Tick = slots?.axisTick ?? 'line';
  const TickLabel = slots?.axisTickLabel ?? ChartsText;
  const Label = slots?.axisLabel ?? ChartsText;
  const axisTickLabelProps = useSlotProps({
    elementType: TickLabel,
    externalSlotProps: slotProps?.axisTickLabel,
    additionalProps: {
      style: _extends({
        fontSize: tickFontSize,
        textAnchor: position === 'right' ? 'start' : 'end',
        dominantBaseline: 'central'
      }, tickLabelStyle),
      className: classes.tickLabel
    },
    ownerState: {}
  });
  const axisLabelProps = useSlotProps({
    elementType: Label,
    externalSlotProps: slotProps?.axisLabel,
    additionalProps: {
      style: _extends({
        fontSize: labelFontSize,
        angle: positionSign * 90,
        textAnchor: 'middle',
        dominantBaseline: 'auto'
      }, labelStyle)
    },
    ownerState: {}
  });
  return /*#__PURE__*/_jsxs(AxisRoot, {
    transform: `translate(${position === 'right' ? left + width : left}, 0)`,
    className: classes.root,
    children: [!disableLine && /*#__PURE__*/_jsx(Line, _extends({
      y1: yScale.range()[0],
      y2: yScale.range()[1],
      className: classes.line
    }, slotProps?.axisLine)), yTicks.map(({
      formattedValue,
      offset,
      labelOffset,
      value
    }, index) => {
      const xTickLabel = positionSign * (tickSize + 2);
      const yTickLabel = labelOffset;
      const skipLabel = typeof tickLabelInterval === 'function' && !tickLabelInterval?.(value, index);
      return /*#__PURE__*/_jsxs("g", {
        transform: `translate(0, ${offset})`,
        className: classes.tickContainer,
        children: [!disableTicks && /*#__PURE__*/_jsx(Tick, _extends({
          x2: positionSign * tickSize,
          className: classes.tick
        }, slotProps?.axisTick)), formattedValue !== undefined && !skipLabel && /*#__PURE__*/_jsx(TickLabel, _extends({
          x: xTickLabel,
          y: yTickLabel,
          text: formattedValue.toString()
        }, axisTickLabelProps))]
      }, index);
    }), label && /*#__PURE__*/_jsx("g", {
      className: classes.label,
      children: /*#__PURE__*/_jsx(Label, _extends({}, labelRefPoint, axisLabelProps, {
        text: label
      }))
    })]
  });
}
process.env.NODE_ENV !== "production" ? ChartsYAxis.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The id of the axis to render.
   * If undefined, it will be the first defined axis.
   */
  axisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * If true, the axis line is disabled.
   * @default false
   */
  disableLine: PropTypes.bool,
  /**
   * If true, the ticks are disabled.
   * @default false
   */
  disableTicks: PropTypes.bool,
  /**
   * The fill color of the axis text.
   * @default 'currentColor'
   */
  fill: PropTypes.string,
  /**
   * The label of the axis.
   */
  label: PropTypes.string,
  /**
   * The font size of the axis label.
   * @default 14
   * @deprecated Consider using `labelStyle.fontSize` instead.
   */
  labelFontSize: PropTypes.number,
  /**
   * The style applied to the axis label.
   */
  labelStyle: PropTypes.object,
  /**
   * Position of the axis.
   */
  position: PropTypes.oneOf(['left', 'right']),
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
  /**
   * The stroke color of the axis line.
   * @default 'currentColor'
   */
  stroke: PropTypes.string,
  /**
   * The font size of the axis ticks text.
   * @default 12
   * @deprecated Consider using `tickLabelStyle.fontSize` instead.
   */
  tickFontSize: PropTypes.number,
  /**
   * Defines which ticks are displayed. Its value can be:
   * - 'auto' In such case the ticks are computed based on axis scale and other parameters.
   * - a filtering function of the form `(value, index) => boolean` which is available only if the axis has a data property.
   * - an array containing the values where ticks should be displayed.
   * @default 'auto'
   */
  tickInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.array, PropTypes.func]),
  /**
   * Defines which ticks get its label displayed. Its value can be:
   * - 'auto' In such case, labels are displayed if they do not overlap with the previous one.
   * - a filtering function of the form (value, index) => boolean. Warning: the index is tick index, not data ones.
   * @default 'auto'
   */
  tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
  /**
   * The placement of ticks label. Can be the middle of the band, or the tick position.
   * Only used if scale is 'band'.
   * @default 'middle'
   */
  tickLabelPlacement: PropTypes.oneOf(['middle', 'tick']),
  /**
   * The style applied to ticks text.
   */
  tickLabelStyle: PropTypes.object,
  /**
   * Maximal step between two ticks.
   * When using time data, the value is assumed to be in ms.
   * Not supported by categorical axis (band, points).
   */
  tickMaxStep: PropTypes.number,
  /**
   * Minimal step between two ticks.
   * When using time data, the value is assumed to be in ms.
   * Not supported by categorical axis (band, points).
   */
  tickMinStep: PropTypes.number,
  /**
   * The number of ticks. This number is not guaranteed.
   * Not supported by categorical axis (band, points).
   */
  tickNumber: PropTypes.number,
  /**
   * The placement of ticks in regard to the band interval.
   * Only used if scale is 'band'.
   * @default 'extremities'
   */
  tickPlacement: PropTypes.oneOf(['end', 'extremities', 'middle', 'start']),
  /**
   * The size of the ticks.
   * @default 6
   */
  tickSize: PropTypes.number
} : void 0;
export { ChartsYAxis };