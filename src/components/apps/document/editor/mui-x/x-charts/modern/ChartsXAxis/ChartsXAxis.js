import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
const _excluded = ["scale", "tickNumber", "reverse"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { useSlotProps } from '@mui/base/utils';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { useThemeProps, useTheme } from '@mui/material/styles';
import { CartesianContext } from '../context/CartesianContextProvider';
import { useTicks } from '../hooks/useTicks';
import { getAxisUtilityClass } from '../ChartsAxis/axisClasses';
import { AxisRoot } from '../internals/components/AxisSharedComponents';
import { ChartsText } from '../ChartsText';
import { getMinXTranslation } from '../internals/geometry';
import { useMounted } from '../hooks/useMounted';
import { useDrawingArea } from '../hooks/useDrawingArea';
import { getWordsByLines } from '../internals/getWordsByLines';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const useUtilityClasses = ownerState => {
  const {
    classes,
    position
  } = ownerState;
  const slots = {
    root: ['root', 'directionX', position],
    line: ['line'],
    tickContainer: ['tickContainer'],
    tick: ['tick'],
    tickLabel: ['tickLabel'],
    label: ['label']
  };
  return composeClasses(slots, getAxisUtilityClass, classes);
};
function addLabelDimension(xTicks, {
  tickLabelStyle: style,
  tickLabelInterval,
  reverse,
  isMounted
}) {
  const withDimension = xTicks.map(tick => {
    if (!isMounted || tick.formattedValue === undefined) {
      return _extends({}, tick, {
        width: 0,
        height: 0
      });
    }
    const tickSizes = getWordsByLines({
      style,
      needsComputation: true,
      text: tick.formattedValue
    });
    return _extends({}, tick, {
      width: Math.max(...tickSizes.map(size => size.width)),
      height: Math.max(tickSizes.length * tickSizes[0].height)
    });
  });
  if (typeof tickLabelInterval === 'function') {
    return withDimension.map((item, index) => _extends({}, item, {
      skipLabel: !tickLabelInterval(item.value, index)
    }));
  }

  // Filter label to avoid overlap
  let currentTextLimit = 0;
  let previousTextLimit = 0;
  const direction = reverse ? -1 : 1;
  return withDimension.map((item, labelIndex) => {
    const {
      width,
      offset,
      labelOffset,
      height
    } = item;
    const distance = getMinXTranslation(width, height, style?.angle);
    const textPosition = offset + labelOffset;
    const gapRatio = 1.2; // Ratio applied to the minimal distance to add some margin.

    currentTextLimit = textPosition - direction * (gapRatio * distance) / 2;
    if (labelIndex > 0 && direction * currentTextLimit < direction * previousTextLimit) {
      // Except for the first label, we skip all label that overlap with the last accepted.
      // Notice that the early return prevents `previousTextLimit` from being updated.
      return _extends({}, item, {
        skipLabel: true
      });
    }
    previousTextLimit = textPosition + direction * (gapRatio * distance) / 2;
    return item;
  });
}
const defaultProps = {
  position: 'bottom',
  disableLine: false,
  disableTicks: false,
  tickSize: 6
};

/**
 * Demos:
 *
 * - [Axis](https://mui.com/x/react-charts/axis/)
 *
 * API:
 *
 * - [ChartsXAxis API](https://mui.com/x/api/charts/charts-x-axis/)
 */
function ChartsXAxis(inProps) {
  const props = useThemeProps({
    props: _extends({}, defaultProps, inProps),
    name: 'MuiChartsXAxis'
  });
  const {
    xAxisIds
  } = React.useContext(CartesianContext);
  const _React$useContext = React.useContext(CartesianContext),
    _ref = props.axisId ?? xAxisIds[0],
    {
      xAxis: {
        [_ref]: {
          scale: xScale,
          tickNumber,
          reverse
        }
      }
    } = _React$useContext,
    settings = _objectWithoutPropertiesLoose(_React$useContext.xAxis[_ref], _excluded);
  const isMounted = useMounted();
  const defaultizedProps = _extends({}, defaultProps, settings, props);
  const {
    position,
    disableLine,
    disableTicks,
    tickLabelStyle,
    label,
    labelStyle,
    tickFontSize,
    labelFontSize,
    tickSize: tickSizeProp,
    valueFormatter,
    slots,
    slotProps,
    tickInterval,
    tickLabelInterval,
    tickPlacement,
    tickLabelPlacement
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
  const positionSign = position === 'bottom' ? 1 : -1;
  const Line = slots?.axisLine ?? 'line';
  const Tick = slots?.axisTick ?? 'line';
  const TickLabel = slots?.axisTickLabel ?? ChartsText;
  const Label = slots?.axisLabel ?? ChartsText;
  const axisTickLabelProps = useSlotProps({
    elementType: TickLabel,
    externalSlotProps: slotProps?.axisTickLabel,
    additionalProps: {
      style: _extends({
        textAnchor: 'middle',
        dominantBaseline: position === 'bottom' ? 'hanging' : 'auto',
        fontSize: tickFontSize ?? 12
      }, tickLabelStyle),
      className: classes.tickLabel
    },
    className: classes.tickLabel,
    ownerState: {}
  });
  const xTicks = useTicks({
    scale: xScale,
    tickNumber,
    valueFormatter,
    tickInterval,
    tickPlacement,
    tickLabelPlacement
  });
  const xTicksWithDimension = addLabelDimension(xTicks, {
    tickLabelStyle: axisTickLabelProps.style,
    tickLabelInterval,
    reverse,
    isMounted
  });
  const labelRefPoint = {
    x: left + width / 2,
    y: positionSign * (tickSize + 22)
  };
  const axisLabelProps = useSlotProps({
    elementType: Label,
    externalSlotProps: slotProps?.axisLabel,
    additionalProps: {
      style: _extends({
        fontSize: labelFontSize ?? 14,
        textAnchor: 'middle',
        dominantBaseline: position === 'bottom' ? 'hanging' : 'auto'
      }, labelStyle)
    },
    ownerState: {}
  });
  return /*#__PURE__*/_jsxs(AxisRoot, {
    transform: `translate(0, ${position === 'bottom' ? top + height : top})`,
    className: classes.root,
    children: [!disableLine && /*#__PURE__*/_jsx(Line, _extends({
      x1: xScale.range()[0],
      x2: xScale.range()[1],
      className: classes.line
    }, slotProps?.axisLine)), xTicksWithDimension.map(({
      formattedValue,
      offset,
      labelOffset,
      skipLabel
    }, index) => {
      const xTickLabel = labelOffset ?? 0;
      const yTickLabel = positionSign * (tickSize + 3);
      return /*#__PURE__*/_jsxs("g", {
        transform: `translate(${offset}, 0)`,
        className: classes.tickContainer,
        children: [!disableTicks && /*#__PURE__*/_jsx(Tick, _extends({
          y2: positionSign * tickSize,
          className: classes.tick
        }, slotProps?.axisTick)), formattedValue !== undefined && !skipLabel && /*#__PURE__*/_jsx(TickLabel, _extends({
          x: xTickLabel,
          y: yTickLabel
        }, axisTickLabelProps, {
          text: formattedValue.toString()
        }))]
      }, index);
    }), label && /*#__PURE__*/_jsx("g", {
      className: classes.label,
      children: /*#__PURE__*/_jsx(Label, _extends({}, labelRefPoint, axisLabelProps, {
        text: label
      }))
    })]
  });
}
process.env.NODE_ENV !== "production" ? ChartsXAxis.propTypes = {
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
  position: PropTypes.oneOf(['bottom', 'top']),
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
export { ChartsXAxis };