"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridDetailPanelToggleCell = GridDetailPanelToggleCell;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _utils = require("@mui/utils");
var _xDataGrid = require("@mui/x-data-grid");
var _useGridRootProps = require("../hooks/utils/useGridRootProps");
var _useGridApiContext = require("../hooks/utils/useGridApiContext");
var _gridDetailPanelSelector = require("../hooks/features/detailPanel/gridDetailPanelSelector");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const useUtilityClasses = ownerState => {
  const {
    classes,
    isExpanded
  } = ownerState;
  const slots = {
    root: ['detailPanelToggleCell', isExpanded && 'detailPanelToggleCell--expanded']
  };
  return (0, _utils.unstable_composeClasses)(slots, _xDataGrid.getDataGridUtilityClass, classes);
};
function GridDetailPanelToggleCell(props) {
  const {
    id,
    value: isExpanded
  } = props;
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const ownerState = {
    classes: rootProps.classes,
    isExpanded
  };
  const classes = useUtilityClasses(ownerState);
  const contentCache = (0, _xDataGrid.useGridSelector)(apiRef, _gridDetailPanelSelector.gridDetailPanelExpandedRowsContentCacheSelector);
  const hasContent = /*#__PURE__*/React.isValidElement(contentCache[id]);
  const Icon = isExpanded ? rootProps.slots.detailPanelCollapseIcon : rootProps.slots.detailPanelExpandIcon;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.baseIconButton, (0, _extends2.default)({
    size: "small",
    tabIndex: -1,
    disabled: !hasContent,
    className: classes.root,
    "aria-label": isExpanded ? apiRef.current.getLocaleText('collapseDetailPanel') : apiRef.current.getLocaleText('expandDetailPanel')
  }, rootProps.slotProps?.baseIconButton, {
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(Icon, {
      fontSize: "inherit"
    })
  }));
}
process.env.NODE_ENV !== "production" ? GridDetailPanelToggleCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * GridApi that let you manipulate the grid.
   */
  api: _propTypes.default.object.isRequired,
  /**
   * The mode of the cell.
   */
  cellMode: _propTypes.default.oneOf(['edit', 'view']).isRequired,
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: _propTypes.default.object.isRequired,
  /**
   * The column field of the cell that triggered the event.
   */
  field: _propTypes.default.string.isRequired,
  /**
   * A ref allowing to set imperative focus.
   * It can be passed to the element that should receive focus.
   * @ignore - do not document.
   */
  focusElementRef: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.shape({
    current: _propTypes.default.shape({
      focus: _propTypes.default.func.isRequired
    })
  })]),
  /**
   * The cell value formatted with the column valueFormatter.
   */
  formattedValue: _propTypes.default.any,
  /**
   * If true, the cell is the active element.
   */
  hasFocus: _propTypes.default.bool.isRequired,
  /**
   * The grid row id.
   */
  id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired,
  /**
   * If true, the cell is editable.
   */
  isEditable: _propTypes.default.bool,
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: _propTypes.default.any.isRequired,
  /**
   * The node of the row that the current cell belongs to.
   */
  rowNode: _propTypes.default.object.isRequired,
  /**
   * the tabIndex value.
   */
  tabIndex: _propTypes.default.oneOf([-1, 0]).isRequired,
  /**
   * The cell value.
   * If the column has `valueGetter`, use `params.row` to directly access the fields.
   */
  value: _propTypes.default.any
} : void 0;