"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PickersRangeCalendarHeader = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/material/styles");
var _PickersCalendarHeader = require("@mui/x-date-pickers/PickersCalendarHeader");
var _internals = require("@mui/x-date-pickers/internals");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["calendars", "month", "monthIndex"];
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const PickersRangeCalendarHeaderContentMultipleCalendars = (0, _styles.styled)(_internals.PickersArrowSwitcher)({
  padding: '12px 16px 4px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
});
const PickersRangeCalendarHeader = exports.PickersRangeCalendarHeader = /*#__PURE__*/React.forwardRef(function PickersRangeCalendarHeader(props, ref) {
  const utils = (0, _internals.useUtils)();
  const localeText = (0, _internals.useLocaleText)();
  const {
      calendars,
      month,
      monthIndex
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const {
    format,
    slots,
    slotProps,
    currentMonth,
    onMonthChange,
    disableFuture,
    disablePast,
    minDate,
    maxDate,
    timezone
  } = props;
  const isNextMonthDisabled = (0, _internals.useNextMonthDisabled)(currentMonth, {
    disableFuture,
    maxDate,
    timezone
  });
  const isPreviousMonthDisabled = (0, _internals.usePreviousMonthDisabled)(currentMonth, {
    disablePast,
    minDate,
    timezone
  });
  if (calendars === 1) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_PickersCalendarHeader.PickersCalendarHeader, (0, _extends2.default)({}, other, {
      ref: ref
    }));
  }
  const selectNextMonth = () => onMonthChange(utils.addMonths(currentMonth, 1), 'left');
  const selectPreviousMonth = () => onMonthChange(utils.addMonths(currentMonth, -1), 'right');
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(PickersRangeCalendarHeaderContentMultipleCalendars, {
    ref: ref,
    onGoToPrevious: selectPreviousMonth,
    onGoToNext: selectNextMonth,
    isPreviousHidden: monthIndex !== 0,
    isPreviousDisabled: isPreviousMonthDisabled,
    previousLabel: localeText.previousMonth,
    isNextHidden: monthIndex !== calendars - 1,
    isNextDisabled: isNextMonthDisabled,
    nextLabel: localeText.nextMonth,
    slots: slots,
    slotProps: slotProps,
    children: utils.formatByString(month, format ?? `${utils.formats.month} ${utils.formats.year}`)
  });
});
process.env.NODE_ENV !== "production" ? PickersRangeCalendarHeader.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The number of calendars rendered.
   */
  calendars: _propTypes.default.oneOf([1, 2, 3]).isRequired,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: _propTypes.default.object,
  className: _propTypes.default.string,
  currentMonth: _propTypes.default.object.isRequired,
  disabled: _propTypes.default.bool,
  disableFuture: _propTypes.default.bool,
  disablePast: _propTypes.default.bool,
  /**
   * Format used to display the date.
   * @default `${adapter.formats.month} ${adapter.formats.year}`
   */
  format: _propTypes.default.string,
  labelId: _propTypes.default.string,
  maxDate: _propTypes.default.object.isRequired,
  minDate: _propTypes.default.object.isRequired,
  /**
   * Month used for this header.
   */
  month: _propTypes.default.object.isRequired,
  /**
   * Index of the month used for this header.
   */
  monthIndex: _propTypes.default.number.isRequired,
  onMonthChange: _propTypes.default.func.isRequired,
  onViewChange: _propTypes.default.func,
  reduceAnimations: _propTypes.default.bool.isRequired,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: _propTypes.default.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: _propTypes.default.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object, _propTypes.default.bool])), _propTypes.default.func, _propTypes.default.object]),
  timezone: _propTypes.default.string.isRequired,
  view: _propTypes.default.oneOf(['day', 'month', 'year']).isRequired,
  views: _propTypes.default.arrayOf(_propTypes.default.oneOf(['day', 'month', 'year']).isRequired).isRequired
} : void 0;