"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderIncoterm = renderIncoterm;
var React = _interopRequireWildcard(require("react"));
var _Tooltip = _interopRequireDefault(require("@mui/material/Tooltip"));
var _Box = _interopRequireDefault(require("@mui/material/Box"));
var _Info = _interopRequireDefault(require("@mui/icons-material/Info"));
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const Incoterm = /*#__PURE__*/React.memo(function Incoterm(props) {
  const {
    value
  } = props;
  if (!value) {
    return null;
  }
  const valueStr = value.toString();
  const tooltip = valueStr.slice(valueStr.indexOf('(') + 1, valueStr.indexOf(')'));
  const code = valueStr.slice(0, valueStr.indexOf('(')).trim();
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Box.default, {
    sx: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
      children: code
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
      title: tooltip,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Info.default, {
        sx: {
          color: '#2196f3',
          alignSelf: 'center',
          ml: '8px'
        }
      })
    })]
  });
});
function renderIncoterm(params) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(Incoterm, {
    value: params.value
  });
}