"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PieArcLabelPlot = PieArcLabelPlot;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _web = require("@react-spring/web");
var _transition = require("./dataTransform/transition");
var _useTransformData = require("./dataTransform/useTransformData");
var _PieArcLabel = require("./PieArcLabel");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["arcLabel", "arcLabelMinAngle", "arcLabelRadius", "cornerRadius", "data", "faded", "highlighted", "highlightScope", "id", "innerRadius", "outerRadius", "paddingAngle", "skipAnimation", "slotProps", "slots"],
  _excluded2 = ["startAngle", "endAngle", "paddingAngle", "innerRadius", "outerRadius", "arcLabelRadius", "cornerRadius"];
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const RATIO = 180 / Math.PI;
function getItemLabel(arcLabel, arcLabelMinAngle, item) {
  if (!arcLabel) {
    return null;
  }
  const angle = (item.endAngle - item.startAngle) * RATIO;
  if (angle < arcLabelMinAngle) {
    return null;
  }
  if (typeof arcLabel === 'string') {
    return item[arcLabel]?.toString();
  }
  return arcLabel(item);
}
function PieArcLabelPlot(props) {
  const {
      arcLabel,
      arcLabelMinAngle = 0,
      arcLabelRadius,
      cornerRadius = 0,
      data,
      faded = {
        additionalRadius: -5
      },
      highlighted,
      highlightScope,
      id,
      innerRadius,
      outerRadius,
      paddingAngle = 0,
      skipAnimation,
      slotProps,
      slots
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const transformedData = (0, _useTransformData.useTransformData)({
    innerRadius,
    outerRadius,
    arcLabelRadius,
    cornerRadius,
    paddingAngle,
    id,
    highlightScope,
    highlighted,
    faded,
    data
  });
  const transition = (0, _web.useTransition)(transformedData, (0, _extends2.default)({}, _transition.defaultLabelTransitionConfig, {
    immediate: skipAnimation
  }));
  if (data.length === 0) {
    return null;
  }
  const ArcLabel = slots?.pieArcLabel ?? _PieArcLabel.PieArcLabel;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("g", (0, _extends2.default)({}, other, {
    children: transition((_ref, item) => {
      let {
          startAngle,
          endAngle,
          paddingAngle: pA,
          innerRadius: iR,
          outerRadius: oR,
          arcLabelRadius: aLR,
          cornerRadius: cR
        } = _ref,
        style = (0, _objectWithoutPropertiesLoose2.default)(_ref, _excluded2);
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(ArcLabel, (0, _extends2.default)({
        startAngle: startAngle,
        endAngle: endAngle,
        paddingAngle: pA,
        innerRadius: iR,
        outerRadius: oR,
        arcLabelRadius: aLR,
        cornerRadius: cR,
        style: style,
        id: id,
        color: item.color,
        isFaded: item.isFaded,
        isHighlighted: item.isHighlighted,
        formattedArcLabel: getItemLabel(arcLabel, arcLabelMinAngle, item)
      }, slotProps?.pieArcLabel));
    })
  }));
}
process.env.NODE_ENV !== "production" ? PieArcLabelPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The label displayed into the arc.
   */
  arcLabel: _propTypes.default.oneOfType([_propTypes.default.oneOf(['formattedValue', 'label', 'value']), _propTypes.default.func]),
  /**
   * The minimal angle required to display the arc label.
   * @default 0
   */
  arcLabelMinAngle: _propTypes.default.number,
  /**
   * The radius between circle center and the arc label in px.
   * @default (innerRadius - outerRadius) / 2
   */
  arcLabelRadius: _propTypes.default.number,
  /**
   * The radius applied to arc corners (similar to border radius).
   * @default 0
   */
  cornerRadius: _propTypes.default.number,
  data: _propTypes.default.arrayOf(_propTypes.default.shape({
    color: _propTypes.default.string.isRequired,
    endAngle: _propTypes.default.number.isRequired,
    formattedValue: _propTypes.default.string.isRequired,
    id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired,
    index: _propTypes.default.number.isRequired,
    label: _propTypes.default.string,
    padAngle: _propTypes.default.number.isRequired,
    startAngle: _propTypes.default.number.isRequired,
    value: _propTypes.default.number.isRequired
  })).isRequired,
  /**
   * Override the arc attibutes when it is faded.
   * @default { additionalRadius: -5 }
   */
  faded: _propTypes.default.shape({
    additionalRadius: _propTypes.default.number,
    arcLabelRadius: _propTypes.default.number,
    color: _propTypes.default.string,
    cornerRadius: _propTypes.default.number,
    innerRadius: _propTypes.default.number,
    outerRadius: _propTypes.default.number,
    paddingAngle: _propTypes.default.number
  }),
  /**
   * Override the arc attibutes when it is highlighted.
   */
  highlighted: _propTypes.default.shape({
    additionalRadius: _propTypes.default.number,
    arcLabelRadius: _propTypes.default.number,
    color: _propTypes.default.string,
    cornerRadius: _propTypes.default.number,
    innerRadius: _propTypes.default.number,
    outerRadius: _propTypes.default.number,
    paddingAngle: _propTypes.default.number
  }),
  highlightScope: _propTypes.default.shape({
    faded: _propTypes.default.oneOf(['global', 'none', 'series']),
    highlighted: _propTypes.default.oneOf(['item', 'none', 'series'])
  }),
  id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired,
  /**
   * The radius between circle center and the begining of the arc.
   * @default 0
   */
  innerRadius: _propTypes.default.number,
  /**
   * The radius between circle center and the end of the arc.
   */
  outerRadius: _propTypes.default.number.isRequired,
  /**
   * The padding angle (deg) between two arcs.
   * @default 0
   */
  paddingAngle: _propTypes.default.number,
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