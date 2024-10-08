"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderProgress = renderProgress;
var React = _interopRequireWildcard(require("react"));
var _clsx = _interopRequireDefault(require("clsx"));
var _styles = require("@mui/material/styles");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const Center = (0, _styles.styled)('div')({
  height: '100%',
  display: 'flex',
  alignItems: 'center'
});
const Element = (0, _styles.styled)('div')(({
  theme
}) => ({
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  height: 26,
  borderRadius: 2
}));
const Value = (0, _styles.styled)('div')({
  position: 'absolute',
  lineHeight: '24px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center'
});
const Bar = (0, _styles.styled)('div')({
  height: '100%',
  '&.low': {
    backgroundColor: '#f44336'
  },
  '&.medium': {
    backgroundColor: '#efbb5aa3'
  },
  '&.high': {
    backgroundColor: '#088208a3'
  }
});
const ProgressBar = /*#__PURE__*/React.memo(function ProgressBar(props) {
  const {
    value
  } = props;
  const valueInPercent = value * 100;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(Element, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(Value, {
      children: `${valueInPercent.toLocaleString()} %`
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(Bar, {
      className: (0, _clsx.default)(valueInPercent < 30 && "low", valueInPercent >= 30 && valueInPercent <= 70 && "medium", valueInPercent > 70 && "high"),
      style: {
        maxWidth: `${valueInPercent}%`
      }
    })]
  });
});
function renderProgress(params) {
  if (params.value == null) {
    return '';
  }

  // If the aggregated value does not have the same unit as the other cell
  // Then we fall back to the default rendering based on `valueGetter` instead of rendering a progress bar.
  if (params.aggregation && !params.aggregation.hasCellUnit) {
    return null;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(Center, {
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(ProgressBar, {
      value: params.value
    })
  });
}