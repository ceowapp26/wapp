"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Gauge = Gauge;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
var _GaugeContainer = require("./GaugeContainer");
var _GaugeValueArc = require("./GaugeValueArc");
var _GaugeReferenceArc = require("./GaugeReferenceArc");
var _gaugeClasses = require("./gaugeClasses");
var _GaugeValueText = require("./GaugeValueText");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["text", "children", "classes"];
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const useUtilityClasses = props => {
  const {
    classes
  } = props;
  const slots = {
    root: ['root'],
    valueArc: ['valueArc'],
    referenceArc: ['referenceArc'],
    valueText: ['valueText']
  };
  return (0, _composeClasses.default)(slots, _gaugeClasses.getGaugeUtilityClass, classes);
};
function Gauge(props) {
  const {
      text,
      children
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const classes = useUtilityClasses(props);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_GaugeContainer.GaugeContainer, (0, _extends2.default)({}, other, {
    className: classes.root,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_GaugeReferenceArc.GaugeReferenceArc, {
      className: classes.referenceArc
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_GaugeValueArc.GaugeValueArc, {
      className: classes.valueArc
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_GaugeValueText.GaugeValueText, {
      className: classes.valueText,
      text: text
    }), children]
  }));
}
process.env.NODE_ENV !== "production" ? Gauge.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  children: _propTypes.default.node,
  classes: _propTypes.default.object,
  className: _propTypes.default.string,
  /**
   * The radius applied to arc corners (similar to border radius).
   * Set it to '50%' to get rounded arc.
   * @default 0
   */
  cornerRadius: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  /**
   * The x coordinate of the arc center.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the width the drawing area.
   */
  cx: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  /**
   * The y coordinate of the arc center.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the height the drawing area.
   */
  cy: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  desc: _propTypes.default.string,
  /**
   * If `true`, the charts will not listen to the mouse move event.
   * It might break interactive features, but will improve performance.
   * @default false
   */
  disableAxisListener: _propTypes.default.bool,
  /**
   * The end angle (deg).
   * @default 360
   */
  endAngle: _propTypes.default.number,
  /**
   * The height of the chart in px. If not defined, it takes the height of the parent element.
   */
  height: _propTypes.default.number,
  /**
   * The radius between circle center and the begining of the arc.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the maximal radius that fit into the drawing area.
   * @default '80%'
   */
  innerRadius: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  /**
   * The margin between the SVG and the drawing area.
   * It's used for leaving some space for extra information such as the x- and y-axis or legend.
   * Accepts an object with the optional properties: `top`, `bottom`, `left`, and `right`.
   * @default object Depends on the charts type.
   */
  margin: _propTypes.default.shape({
    bottom: _propTypes.default.number,
    left: _propTypes.default.number,
    right: _propTypes.default.number,
    top: _propTypes.default.number
  }),
  /**
   * The radius between circle center and the end of the arc.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the maximal radius that fit into the drawing area.
   * @default '100%'
   */
  outerRadius: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  /**
   * The start angle (deg).
   * @default 0
   */
  startAngle: _propTypes.default.number,
  sx: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object, _propTypes.default.bool])), _propTypes.default.func, _propTypes.default.object]),
  text: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.string]),
  title: _propTypes.default.string,
  /**
   * The value of the gauge.
   * Set to `null` to not display a value.
   */
  value: _propTypes.default.number,
  /**
   * The maximal value of the gauge.
   * @default 100
   */
  valueMax: _propTypes.default.number,
  /**
   * The minimal value of the gauge.
   * @default 0
   */
  valueMin: _propTypes.default.number,
  viewBox: _propTypes.default.shape({
    height: _propTypes.default.number,
    width: _propTypes.default.number,
    x: _propTypes.default.number,
    y: _propTypes.default.number
  }),
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   */
  width: _propTypes.default.number
} : void 0;