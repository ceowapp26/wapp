"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridPanelHeader = GridPanelHeader;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _clsx = _interopRequireDefault(require("clsx"));
var _system = require("@mui/system");
var _utils = require("@mui/utils");
var _gridClasses = require("../../constants/gridClasses");
var _useGridRootProps = require("../../hooks/utils/useGridRootProps");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["className"];
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ['panelHeader']
  };
  return (0, _utils.unstable_composeClasses)(slots, _gridClasses.getDataGridUtilityClass, classes);
};
const GridPanelHeaderRoot = (0, _system.styled)('div', {
  name: 'MuiDataGrid',
  slot: 'PanelHeader',
  overridesResolver: (props, styles) => styles.panelHeader
})(({
  theme
}) => ({
  padding: theme.spacing(1)
}));
function GridPanelHeader(props) {
  const {
      className
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const classes = useUtilityClasses(rootProps);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(GridPanelHeaderRoot, (0, _extends2.default)({
    className: (0, _clsx.default)(className, classes.root),
    ownerState: rootProps
  }, other));
}
process.env.NODE_ENV !== "production" ? GridPanelHeader.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  sx: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object, _propTypes.default.bool])), _propTypes.default.func, _propTypes.default.object])
} : void 0;