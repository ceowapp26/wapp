"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LineHighlightElement = LineHighlightElement;
exports.getHighlightElementUtilityClass = getHighlightElementUtilityClass;
exports.lineHighlightElementClasses = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
var _generateUtilityClass = _interopRequireDefault(require("@mui/utils/generateUtilityClass"));
var _styles = require("@mui/material/styles");
var _generateUtilityClasses = _interopRequireDefault(require("@mui/utils/generateUtilityClasses"));
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["x", "y", "id", "classes", "color"];
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function getHighlightElementUtilityClass(slot) {
  return (0, _generateUtilityClass.default)('MuiHighlightElement', slot);
}
const lineHighlightElementClasses = exports.lineHighlightElementClasses = (0, _generateUtilityClasses.default)('MuiHighlightElement', ['root']);
const useUtilityClasses = ownerState => {
  const {
    classes,
    id
  } = ownerState;
  const slots = {
    root: ['root', `series-${id}`]
  };
  return (0, _composeClasses.default)(slots, getHighlightElementUtilityClass, classes);
};
const HighlightElement = (0, _styles.styled)('circle', {
  name: 'MuiHighlightElement',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root
})(({
  ownerState
}) => ({
  transform: `translate(${ownerState.x}px, ${ownerState.y}px)`,
  transformOrigin: `${ownerState.x}px ${ownerState.y}px`,
  fill: ownerState.color
}));
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [LineHighlightElement API](https://mui.com/x/api/charts/line-highlight-element/)
 */
function LineHighlightElement(props) {
  const {
      x,
      y,
      id,
      classes: innerClasses,
      color
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const ownerState = {
    id,
    classes: innerClasses,
    color,
    x,
    y
  };
  const classes = useUtilityClasses(ownerState);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(HighlightElement, (0, _extends2.default)({
    pointerEvents: "none",
    ownerState: ownerState,
    className: classes.root,
    cx: 0,
    cy: 0,
    r: other.r === undefined ? 5 : other.r
  }, other));
}
process.env.NODE_ENV !== "production" ? LineHighlightElement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  classes: _propTypes.default.object,
  id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired
} : void 0;