"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useDataGridPremiumProps = exports.DATA_GRID_PREMIUM_PROPS_DEFAULT_VALUES = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _styles = require("@mui/material/styles");
var _xDataGridPro = require("@mui/x-data-grid-pro");
var _internals = require("@mui/x-data-grid-pro/internals");
var _aggregation = require("../hooks/features/aggregation");
var _dataGridPremiumDefaultSlotsComponents = require("../constants/dataGridPremiumDefaultSlotsComponents");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * The default values of `DataGridPremiumPropsWithDefaultValue` to inject in the props of DataGridPremium.
 */
const DATA_GRID_PREMIUM_PROPS_DEFAULT_VALUES = exports.DATA_GRID_PREMIUM_PROPS_DEFAULT_VALUES = (0, _extends2.default)({}, _xDataGridPro.DATA_GRID_PRO_PROPS_DEFAULT_VALUES, {
  cellSelection: false,
  disableAggregation: false,
  disableRowGrouping: false,
  rowGroupingColumnMode: 'single',
  aggregationFunctions: _aggregation.GRID_AGGREGATION_FUNCTIONS,
  aggregationRowsScope: 'filtered',
  getAggregationPosition: groupNode => groupNode.depth === -1 ? 'footer' : 'inline',
  disableClipboardPaste: false,
  splitClipboardPastedText: pastedText => {
    // Excel on Windows adds an empty line break at the end of the copied text.
    // See https://github.com/mui/mui-x/issues/9103
    const text = pastedText.replace(/\r?\n$/, '');
    return text.split(/\r\n|\n|\r/).map(row => row.split('\t'));
  }
});
const defaultSlots = _dataGridPremiumDefaultSlotsComponents.DATA_GRID_PREMIUM_DEFAULT_SLOTS_COMPONENTS;
const useDataGridPremiumProps = inProps => {
  const themedProps = (0, _internals.useProps)(
  // eslint-disable-next-line material-ui/mui-name-matches-component-name
  (0, _styles.useThemeProps)({
    props: inProps,
    name: 'MuiDataGrid'
  }));
  const localeText = React.useMemo(() => (0, _extends2.default)({}, _xDataGridPro.GRID_DEFAULT_LOCALE_TEXT, themedProps.localeText), [themedProps.localeText]);
  const slots = React.useMemo(() => (0, _internals.computeSlots)({
    defaultSlots,
    slots: themedProps.slots
  }), [themedProps.slots]);
  return React.useMemo(() => (0, _extends2.default)({}, DATA_GRID_PREMIUM_PROPS_DEFAULT_VALUES, themedProps, {
    localeText,
    slots,
    signature: 'DataGridPremium'
  }), [themedProps, localeText, slots]);
};
exports.useDataGridPremiumProps = useDataGridPremiumProps;