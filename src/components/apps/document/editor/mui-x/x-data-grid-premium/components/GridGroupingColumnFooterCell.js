"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridGroupingColumnFooterCell = GridGroupingColumnFooterCell;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _useGridRootProps = require("../hooks/utils/useGridRootProps");
var _GridFooterCell = require("./GridFooterCell");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function GridGroupingColumnFooterCell(props) {
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const sx = {
    ml: 0
  };
  if (props.rowNode.parent == null) {
    sx.ml = 0;
  } else if (rootProps.rowGroupingColumnMode === 'multiple') {
    sx.ml = 2;
  } else {
    sx.ml = theme => `calc(var(--DataGrid-cellOffsetMultiplier) * ${theme.spacing(props.rowNode.depth)})`;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridFooterCell.GridFooterCell, (0, _extends2.default)({
    sx: sx
  }, props));
}