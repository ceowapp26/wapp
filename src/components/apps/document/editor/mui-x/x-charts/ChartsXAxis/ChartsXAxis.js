"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsXAxis = ChartsXAxis;
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _utils = require("@mui/base/utils");
var _utils2 = require("@mui/utils");
var _styles = require("@mui/material/styles");
var _CartesianContextProvider = require("../context/CartesianContextProvider");
var _useTicks = require("../hooks/useTicks");
var _axisClasses = require("../ChartsAxis/axisClasses");
var _AxisSharedComponents = require("../internals/components/AxisSharedComponents");
var _ChartsText = require("../ChartsText");
var _geometry = require("../internals/geometry");
var _useMounted = require("../hooks/useMounted");
var _useDrawingArea = require("../hooks/useDrawingArea");
var _getWordsByLines = require("../internals/getWordsByLines");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["scale", "tickNumber", "reverse"];
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
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
  return (0, _utils2.unstable_composeClasses)(slots, _axisClasses.getAxisUtilityClass, classes);
};
function addLabelDimension(xTicks, {
  tickLabelStyle: style,
  tickLabelInterval,
  reverse,
  isMounted
}) {
  const withDimension = xTicks.map(tick => {
    if (!isMounted || tick.formattedValue === undefined) {
      return (0, _extends2.default)({}, tick, {
        width: 0,
        height: 0
      });
    }
    const tickSizes = (0, _getWordsByLines.getWordsByLines)({
      style,
      needsComputation: true,
      text: tick.formattedValue
    });
    return (0, _extends2.default)({}, tick, {
      width: Math.max(...tickSizes.map(size => size.width)),
      height: Math.max(tickSizes.length * tickSizes[0].height)
    });
  });
  if (typeof tickLabelInterval === 'function') {
    return withDimension.map((item, index) => (0, _extends2.default)({}, item, {
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
    const distance = (0, _geometry.getMinXTranslation)(width, height, style?.angle);
    const textPosition = offset + labelOffset;
    const gapRatio = 1.2; // Ratio applied to the minimal distance to add some margin.

    currentTextLimit = textPosition - direction * (gapRatio * distance) / 2;
    if (labelIndex > 0 && direction * currentTextLimit < direction * previousTextLimit) {
      // Except for the first label, we skip all label that overlap with the last accepted.
      // Notice that the early return prevents `previousTextLimit` from being updated.
      return (0, _extends2.default)({}, item, {
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
  const props = (0, _styles.useThemeProps)({
    props: (0, _extends2.default)({}, defaultProps, inProps),
    name: 'MuiChartsXAxis'
  });
  const {
    xAxisIds
  } = React.useContext(_CartesianContextProvider.CartesianContext);
  const _React$useContext = React.useContext(_CartesianContextProvider.CartesianContext),
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
    settings = (0, _objectWithoutPropertiesLoose2.default)(_React$useContext.xAxis[_ref], _excluded);
  const isMounted = (0, _useMounted.useMounted)();
  const defaultizedProps = (0, _extends2.default)({}, defaultProps, settings, props);
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
  const theme = (0, _styles.useTheme)();
  const classes = useUtilityClasses((0, _extends2.default)({}, defaultizedProps, {
    theme
  }));
  const {
    left,
    top,
    width,
    height
  } = (0, _useDrawingArea.useDrawingArea)();
  const tickSize = disableTicks ? 4 : tickSizeProp;
  const positionSign = position === 'bottom' ? 1 : -1;
  const Line = slots?.axisLine ?? 'line';
  const Tick = slots?.axisTick ?? 'line';
  const TickLabel = slots?.axisTickLabel ?? _ChartsText.ChartsText;
  const Label = slots?.axisLabel ?? _ChartsText.ChartsText;
  const axisTickLabelProps = (0, _utils.useSlotProps)({
    elementType: TickLabel,
    externalSlotProps: slotProps?.axisTickLabel,
    additionalProps: {
      style: (0, _extends2.default)({
        textAnchor: 'middle',
        dominantBaseline: position === 'bottom' ? 'hanging' : 'auto',
        fontSize: tickFontSize ?? 12
      }, tickLabelStyle),
      className: classes.tickLabel
    },
    className: classes.tickLabel,
    ownerState: {}
  });
  const xTicks = (0, _useTicks.useTicks)({
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
  const axisLabelProps = (0, _utils.useSlotProps)({
    elementType: Label,
    externalSlotProps: slotProps?.axisLabel,
    additionalProps: {
      style: (0, _extends2.default)({
        fontSize: labelFontSize ?? 14,
        textAnchor: 'middle',
        dominantBaseline: position === 'bottom' ? 'hanging' : 'auto'
      }, labelStyle)
    },
    ownerState: {}
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_AxisSharedComponents.AxisRoot, {
    transform: `translate(0, ${position === 'bottom' ? top + height : top})`,
    className: classes.root,
    children: [!disableLine && /*#__PURE__*/(0, _jsxRuntime.jsx)(Line, (0, _extends2.default)({
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
      return /*#__PURE__*/(0, _jsxRuntime.jsxs)("g", {
        transform: `translate(${offset}, 0)`,
        className: classes.tickContainer,
        children: [!disableTicks && /*#__PURE__*/(0, _jsxRuntime.jsx)(Tick, (0, _extends2.default)({
          y2: positionSign * tickSize,
          className: classes.tick
        }, slotProps?.axisTick)), formattedValue !== undefined && !skipLabel && /*#__PURE__*/(0, _jsxRuntime.jsx)(TickLabel, (0, _extends2.default)({
          x: xTickLabel,
          y: yTickLabel
        }, axisTickLabelProps, {
          text: formattedValue.toString()
        }))]
      }, index);
    }), label && /*#__PURE__*/(0, _jsxRuntime.jsx)("g", {
      className: classes.label,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(Label, (0, _extends2.default)({}, labelRefPoint, axisLabelProps, {
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
  axisId: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  /**
   * Override or extend the styles applied to the component.
   */
  classes: _propTypes.default.object,
  /**
   * If true, the axis line is disabled.
   * @default false
   */
  disableLine: _propTypes.default.bool,
  /**
   * If true, the ticks are disabled.
   * @default false
   */
  disableTicks: _propTypes.default.bool,
  /**
   * The fill color of the axis text.
   * @default 'currentColor'
   */
  fill: _propTypes.default.string,
  /**
   * The label of the axis.
   */
  label: _propTypes.default.string,
  /**
   * The font size of the axis label.
   * @default 14
   * @deprecated Consider using `labelStyle.fontSize` instead.
   */
  labelFontSize: _propTypes.default.number,
  /**
   * The style applied to the axis label.
   */
  labelStyle: _propTypes.default.object,
  /**
   * Position of the axis.
   */
  position: _propTypes.default.oneOf(['bottom', 'top']),
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
  /**
   * The stroke color of the axis line.
   * @default 'currentColor'
   */
  stroke: _propTypes.default.string,
  /**
   * The font size of the axis ticks text.
   * @default 12
   * @deprecated Consider using `tickLabelStyle.fontSize` instead.
   */
  tickFontSize: _propTypes.default.number,
  /**
   * Defines which ticks are displayed. Its value can be:
   * - 'auto' In such case the ticks are computed based on axis scale and other parameters.
   * - a filtering function of the form `(value, index) => boolean` which is available only if the axis has a data property.
   * - an array containing the values where ticks should be displayed.
   * @default 'auto'
   */
  tickInterval: _propTypes.default.oneOfType([_propTypes.default.oneOf(['auto']), _propTypes.default.array, _propTypes.default.func]),
  /**
   * Defines which ticks get its label displayed. Its value can be:
   * - 'auto' In such case, labels are displayed if they do not overlap with the previous one.
   * - a filtering function of the form (value, index) => boolean. Warning: the index is tick index, not data ones.
   * @default 'auto'
   */
  tickLabelInterval: _propTypes.default.oneOfType([_propTypes.default.oneOf(['auto']), _propTypes.default.func]),
  /**
   * The placement of ticks label. Can be the middle of the band, or the tick position.
   * Only used if scale is 'band'.
   * @default 'middle'
   */
  tickLabelPlacement: _propTypes.default.oneOf(['middle', 'tick']),
  /**
   * The style applied to ticks text.
   */
  tickLabelStyle: _propTypes.default.object,
  /**
   * Maximal step between two ticks.
   * When using time data, the value is assumed to be in ms.
   * Not supported by categorical axis (band, points).
   */
  tickMaxStep: _propTypes.default.number,
  /**
   * Minimal step between two ticks.
   * When using time data, the value is assumed to be in ms.
   * Not supported by categorical axis (band, points).
   */
  tickMinStep: _propTypes.default.number,
  /**
   * The number of ticks. This number is not guaranteed.
   * Not supported by categorical axis (band, points).
   */
  tickNumber: _propTypes.default.number,
  /**
   * The placement of ticks in regard to the band interval.
   * Only used if scale is 'band'.
   * @default 'extremities'
   */
  tickPlacement: _propTypes.default.oneOf(['end', 'extremities', 'middle', 'start']),
  /**
   * The size of the ticks.
   * @default 6
   */
  tickSize: _propTypes.default.number
} : void 0;