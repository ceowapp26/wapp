"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LineElement = LineElement;
exports.getLineElementUtilityClass = getLineElementUtilityClass;
exports.lineElementClasses = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
var _utils = require("@mui/base/utils");
var _generateUtilityClass = _interopRequireDefault(require("@mui/utils/generateUtilityClass"));
var _generateUtilityClasses = _interopRequireDefault(require("@mui/utils/generateUtilityClasses"));
var _InteractionProvider = require("../context/InteractionProvider");
var _useInteractionItemProps = require("../hooks/useInteractionItemProps");
var _AnimatedLine = require("./AnimatedLine");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["id", "classes", "color", "gradientId", "highlightScope", "slots", "slotProps", "onClick"];
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function getLineElementUtilityClass(slot) {
  return (0, _generateUtilityClass.default)('MuiLineElement', slot);
}
const lineElementClasses = exports.lineElementClasses = (0, _generateUtilityClasses.default)('MuiLineElement', ['root', 'highlighted', 'faded']);
const useUtilityClasses = ownerState => {
  const {
    classes,
    id,
    isFaded,
    isHighlighted
  } = ownerState;
  const slots = {
    root: ['root', `series-${id}`, isHighlighted && 'highlighted', isFaded && 'faded']
  };
  return (0, _composeClasses.default)(slots, getLineElementUtilityClass, classes);
};
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [LineElement API](https://mui.com/x/api/charts/line-element/)
 */
function LineElement(props) {
  const {
      id,
      classes: innerClasses,
      color,
      gradientId,
      highlightScope,
      slots,
      slotProps,
      onClick
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const getInteractionItemProps = (0, _useInteractionItemProps.useInteractionItemProps)(highlightScope);
  const {
    item
  } = React.useContext(_InteractionProvider.InteractionContext);
  const isHighlighted = (0, _useInteractionItemProps.getIsHighlighted)(item, {
    type: 'line',
    seriesId: id
  }, highlightScope);
  const isFaded = !isHighlighted && (0, _useInteractionItemProps.getIsFaded)(item, {
    type: 'line',
    seriesId: id
  }, highlightScope);
  const ownerState = {
    id,
    classes: innerClasses,
    color,
    gradientId,
    isFaded,
    isHighlighted
  };
  const classes = useUtilityClasses(ownerState);
  const Line = slots?.line ?? _AnimatedLine.AnimatedLine;
  const lineProps = (0, _utils.useSlotProps)({
    elementType: Line,
    externalSlotProps: slotProps?.line,
    additionalProps: (0, _extends2.default)({}, other, getInteractionItemProps({
      type: 'line',
      seriesId: id
    }), {
      className: classes.root,
      onClick,
      cursor: onClick ? 'pointer' : 'unset'
    }),
    ownerState
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(Line, (0, _extends2.default)({}, lineProps));
}
process.env.NODE_ENV !== "production" ? LineElement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  classes: _propTypes.default.object,
  color: _propTypes.default.string.isRequired,
  d: _propTypes.default.string.isRequired,
  gradientId: _propTypes.default.string,
  highlightScope: _propTypes.default.shape({
    faded: _propTypes.default.oneOf(['global', 'none', 'series']),
    highlighted: _propTypes.default.oneOf(['item', 'none', 'series'])
  }),
  id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired,
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