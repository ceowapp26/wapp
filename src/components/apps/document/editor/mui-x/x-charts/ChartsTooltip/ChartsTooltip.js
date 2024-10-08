"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsTooltip = ChartsTooltip;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
var _styles = require("@mui/material/styles");
var _Popper = require("@mui/base/Popper");
var _NoSsr = require("@mui/base/NoSsr");
var _utils = require("@mui/base/utils");
var _InteractionProvider = require("../context/InteractionProvider");
var _utils2 = require("./utils");
var _ChartsItemTooltipContent = require("./ChartsItemTooltipContent");
var _ChartsAxisTooltipContent = require("./ChartsAxisTooltipContent");
var _chartsTooltipClasses = require("./chartsTooltipClasses");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ['root'],
    table: ['table'],
    row: ['row'],
    cell: ['cell'],
    mark: ['mark'],
    markCell: ['markCell'],
    labelCell: ['labelCell'],
    valueCell: ['valueCell']
  };
  return (0, _composeClasses.default)(slots, _chartsTooltipClasses.getChartsTooltipUtilityClass, classes);
};
const ChartsTooltipRoot = (0, _styles.styled)(_Popper.Popper, {
  name: 'MuiChartsTooltip',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root
})(({
  theme
}) => ({
  pointerEvents: 'none',
  zIndex: theme.zIndex.modal
}));

/**
 * Demos:
 *
 * - [ChartsTooltip](https://mui.com/x/react-charts/tooltip/)
 *
 * API:
 *
 * - [ChartsTooltip API](https://mui.com/x/api/charts/charts-tool-tip/)
 */
function ChartsTooltip(props) {
  const themeProps = (0, _styles.useThemeProps)({
    props,
    name: 'MuiChartsTooltip'
  });
  const {
    trigger = 'axis',
    itemContent,
    axisContent,
    slots,
    slotProps
  } = themeProps;
  const mousePosition = (0, _utils2.useMouseTracker)();
  const {
    item,
    axis
  } = React.useContext(_InteractionProvider.InteractionContext);
  const displayedData = trigger === 'item' ? item : axis;
  const tooltipHasData = (0, _utils2.getTooltipHasData)(trigger, displayedData);
  const popperOpen = mousePosition !== null && tooltipHasData;
  const classes = useUtilityClasses({
    classes: themeProps.classes
  });
  const PopperComponent = slots?.popper ?? ChartsTooltipRoot;
  const popperProps = (0, _utils.useSlotProps)({
    elementType: PopperComponent,
    externalSlotProps: slotProps?.popper,
    additionalProps: {
      open: popperOpen,
      placement: 'right-start',
      anchorEl: (0, _utils2.generateVirtualElement)(mousePosition)
    },
    ownerState: {}
  });
  if (trigger === 'none') {
    return null;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_NoSsr.NoSsr, {
    children: popperOpen && /*#__PURE__*/(0, _jsxRuntime.jsx)(PopperComponent, (0, _extends2.default)({}, popperProps, {
      children: trigger === 'item' ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsItemTooltipContent.ChartsItemTooltipContent, {
        itemData: displayedData,
        content: slots?.itemContent ?? itemContent,
        contentProps: slotProps?.itemContent,
        sx: {
          mx: 2
        },
        classes: classes
      }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsAxisTooltipContent.ChartsAxisTooltipContent, {
        axisData: displayedData,
        content: slots?.axisContent ?? axisContent,
        contentProps: slotProps?.axisContent,
        sx: {
          mx: 2
        },
        classes: classes
      })
    }))
  });
}
process.env.NODE_ENV !== "production" ? ChartsTooltip.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Component to override the tooltip content when triger is set to 'axis'.
   * @deprecated Use slots.axisContent instead
   */
  axisContent: _propTypes.default.elementType,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: _propTypes.default.object,
  /**
   * Component to override the tooltip content when triger is set to 'item'.
   * @deprecated Use slots.itemContent instead
   */
  itemContent: _propTypes.default.elementType,
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
   * Select the kind of tooltip to display
   * - 'item': Shows data about the item below the mouse.
   * - 'axis': Shows values associated with the hovered x value
   * - 'none': Does not display tooltip
   * @default 'item'
   */
  trigger: _propTypes.default.oneOf(['axis', 'item', 'none'])
} : void 0;