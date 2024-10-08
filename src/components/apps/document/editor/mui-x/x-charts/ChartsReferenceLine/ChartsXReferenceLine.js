"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsXReferenceLine = ChartsXReferenceLine;
exports.getXReferenceLineClasses = getXReferenceLineClasses;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
var _hooks = require("../hooks");
var _common = require("./common");
var _ChartsText = require("../ChartsText");
var _chartsReferenceLineClasses = require("./chartsReferenceLineClasses");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const getTextParams = ({
  top,
  height,
  spacingY,
  labelAlign = 'middle'
}) => {
  switch (labelAlign) {
    case 'start':
      return {
        y: top + spacingY,
        style: {
          dominantBaseline: 'hanging',
          textAnchor: 'start'
        }
      };
    case 'end':
      return {
        y: top + height - spacingY,
        style: {
          dominantBaseline: 'auto',
          textAnchor: 'start'
        }
      };
    default:
      return {
        y: top + height / 2,
        style: {
          dominantBaseline: 'central',
          textAnchor: 'start'
        }
      };
  }
};
function getXReferenceLineClasses(classes) {
  return (0, _composeClasses.default)({
    root: ['root', 'vertical'],
    line: ['line'],
    label: ['label']
  }, _chartsReferenceLineClasses.getReferenceLineUtilityClass, classes);
}
let warnedOnce = false;
function ChartsXReferenceLine(props) {
  const {
    x,
    label = '',
    spacing = 5,
    classes: inClasses,
    labelAlign,
    lineStyle,
    labelStyle,
    axisId
  } = props;
  const {
    top,
    height
  } = (0, _hooks.useDrawingArea)();
  const xAxisScale = (0, _hooks.useXScale)(axisId);
  const xPosition = xAxisScale(x);
  if (xPosition === undefined) {
    if (process.env.NODE_ENV !== 'production') {
      if (!warnedOnce) {
        warnedOnce = true;
        console.error(`MUI X Charts: the value ${x} does not exist in the data of x axis with id ${axisId}.`);
      }
    }
    return null;
  }
  const d = `M ${xPosition} ${top} l 0 ${height}`;
  const classes = getXReferenceLineClasses(inClasses);
  const spacingX = typeof spacing === 'object' ? spacing.x ?? 0 : spacing;
  const spacingY = typeof spacing === 'object' ? spacing.y ?? 0 : spacing;
  const textParams = (0, _extends2.default)({
    x: xPosition + spacingX,
    text: label,
    fontSize: 12
  }, getTextParams({
    top,
    height,
    spacingY,
    labelAlign
  }), {
    className: classes.label
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_common.ReferenceLineRoot, {
    className: classes.root,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
      d: d,
      className: classes.line,
      style: lineStyle
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsText.ChartsText, (0, _extends2.default)({}, textParams, {
      style: (0, _extends2.default)({}, textParams.style, labelStyle)
    }))]
  });
}