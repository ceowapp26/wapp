"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderCountry = renderCountry;
var React = _interopRequireWildcard(require("react"));
var _Box = _interopRequireDefault(require("@mui/material/Box"));
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const Country = /*#__PURE__*/React.memo(function Country(props) {
  const {
    value
  } = props;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Box.default, {
    sx: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      '&  > img': {
        mr: 0.5,
        flexShrink: 0,
        width: '20px'
      }
    },
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("img", {
      loading: "lazy",
      width: "20",
      src: `https://flagcdn.com/w20/${value.code.toLowerCase()}.png`,
      srcSet: `https://flagcdn.com/w40/${value.code.toLowerCase()}.png 2x`,
      alt: ""
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Box.default, {
      component: "span",
      sx: {
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      },
      children: value.label
    })]
  });
});
function renderCountry(params) {
  if (params.value == null) {
    return '';
  }

  // If the aggregated value does not have the same unit as the other cell
  // Then we fall back to the default rendering based on `valueGetter` instead of rendering the total price UI.
  if (params.aggregation && !params.aggregation.hasCellUnit) {
    return null;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(Country, {
    value: params.value
  });
}