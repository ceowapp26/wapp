"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridFooterCell = GridFooterCell;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _xDataGrid = require("@mui/x-data-grid");
var _styles = require("@mui/material/styles");
var _utils = require("@mui/utils");
var _useGridRootProps = require("../hooks/utils/useGridRootProps");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["formattedValue", "colDef", "cellMode", "row", "api", "id", "value", "rowNode", "field", "focusElementRef", "hasFocus", "tabIndex", "isEditable"];
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const GridFooterCellRoot = (0, _styles.styled)('div', {
  name: 'MuiDataGrid',
  slot: 'FooterCell',
  overridesResolver: (_, styles) => styles.footerCell
})(({
  theme
}) => ({
  fontWeight: theme.typography.fontWeightMedium,
  color: (theme.vars || theme).palette.primary.dark
}));
const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ['footerCell']
  };
  return (0, _utils.unstable_composeClasses)(slots, _xDataGrid.getDataGridUtilityClass, classes);
};
function GridFooterCell(props) {
  const {
      formattedValue
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const ownerState = rootProps;
  const classes = useUtilityClasses(ownerState);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(GridFooterCellRoot, (0, _extends2.default)({
    ownerState: ownerState,
    className: classes.root
  }, other, {
    children: formattedValue
  }));
}