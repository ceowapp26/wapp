"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsYReferenceLine = ChartsYReferenceLine;
exports.getYReferenceLineClasses = getYReferenceLineClasses;
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
  left,
  width,
  spacingX,
  labelAlign = 'middle'
}) => {
  switch (labelAlign) {
    case 'start':
      return {
        x: left + spacingX,
        style: {
          dominantBaseline: 'auto',
          textAnchor: 'start'
        }
      };
    case 'end':
      return {
        x: left + width - spacingX,
        style: {
          dominantBaseline: 'auto',
          textAnchor: 'end'
        }
      };
    default:
      return {
        x: left + width / 2,
        style: {
          dominantBaseline: 'auto',
          textAnchor: 'middle'
        }
      };
  }
};
let warnedOnce = false;
function getYReferenceLineClasses(classes) {
  return (0, _composeClasses.default)({
    root: ['root', 'horizontal'],
    line: ['line'],
    label: ['label']
  }, _chartsReferenceLineClasses.getReferenceLineUtilityClass, classes);
}
function ChartsYReferenceLine(props) {
  const {
    y,
    label = '',
    spacing = 5,
    classes: inClasses,
    labelAlign,
    lineStyle,
    labelStyle,
    axisId
  } = props;
  const {
    left,
    width
  } = (0, _hooks.useDrawingArea)();
  const yAxisScale = (0, _hooks.useYScale)(axisId);
  const yPosition = yAxisScale(y);
  if (yPosition === undefined) {
    if (process.env.NODE_ENV !== 'production') {
      if (!warnedOnce) {
        warnedOnce = true;
        console.error(`MUI X Charts: the value ${y} does not exist in the data of y axis with id ${axisId}.`);
      }
    }
    return null;
  }
  const d = `M ${left} ${yPosition} l ${width} 0`;
  const classes = getYReferenceLineClasses(inClasses);
  const spacingX = typeof spacing === 'object' ? spacing.x ?? 0 : spacing;
  const spacingY = typeof spacing === 'object' ? spacing.y ?? 0 : spacing;
  const textParams = (0, _extends2.default)({
    y: yPosition - spacingY,
    text: label,
    fontSize: 12
  }, getTextParams({
    left,
    width,
    spacingX,
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