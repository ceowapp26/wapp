"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MobileDateTimeRangePicker = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _utils = require("@mui/utils");
var _internals = require("@mui/x-date-pickers/internals");
var _utils2 = require("@mui/base/utils");
var _timeViewRenderers = require("@mui/x-date-pickers/timeViewRenderers");
var _MultiSectionDigitalClock = require("@mui/x-date-pickers/MultiSectionDigitalClock");
var _DigitalClock = require("@mui/x-date-pickers/DigitalClock");
var _valueManagers = require("../internals/utils/valueManagers");
var _dateRangeViewRenderers = require("../dateRangeViewRenderers");
var _useMobileRangePicker = require("../internals/hooks/useMobileRangePicker");
var _validateDateTimeRange = require("../internals/utils/validation/validateDateTimeRange");
var _shared = require("../DateTimeRangePicker/shared");
var _MultiInputDateTimeRangeField = require("../MultiInputDateTimeRangeField");
var _DateTimeRangePickerTimeWrapper = require("../DateTimeRangePicker/DateTimeRangePickerTimeWrapper");
var _dimensions = require("../internals/constants/dimensions");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["view", "openTo", "rangePosition"];
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const rendererInterceptor = function rendererInterceptor(inViewRenderers, popperView, rendererProps) {
  const {
      view,
      openTo,
      rangePosition
    } = rendererProps,
    otherRendererProps = (0, _objectWithoutPropertiesLoose2.default)(rendererProps, _excluded);
  const finalProps = (0, _extends2.default)({}, otherRendererProps, {
    rangePosition,
    focusedView: null,
    sx: [{
      width: _internals.DIALOG_WIDTH,
      [`.${_MultiSectionDigitalClock.multiSectionDigitalClockSectionClasses.root}`]: {
        flex: 1,
        // account for the border on `MultiSectionDigitalClock`
        maxHeight: _internals.VIEW_HEIGHT - 1,
        [`.${_MultiSectionDigitalClock.multiSectionDigitalClockSectionClasses.item}`]: {
          width: 'auto'
        }
      },
      [`&.${_DigitalClock.digitalClockClasses.root}`]: {
        maxHeight: _dimensions.RANGE_VIEW_HEIGHT,
        [`.${_DigitalClock.digitalClockClasses.item}`]: {
          justifyContent: 'center'
        }
      },
      [`&.${_MultiSectionDigitalClock.multiSectionDigitalClockClasses.root}, .${_MultiSectionDigitalClock.multiSectionDigitalClockSectionClasses.root}`]: {
        maxHeight: _dimensions.RANGE_VIEW_HEIGHT - 1
      }
    }]
  });
  const isTimeView = (0, _internals.isInternalTimeView)(popperView);
  const viewRenderer = inViewRenderers[popperView];
  if (!viewRenderer) {
    return null;
  }
  if (isTimeView) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_DateTimeRangePickerTimeWrapper.DateTimeRangePickerTimeWrapper, (0, _extends2.default)({}, finalProps, {
      viewRenderer: viewRenderer,
      view: view && (0, _internals.isInternalTimeView)(view) ? view : 'hours',
      views: finalProps.views,
      openTo: (0, _internals.isInternalTimeView)(openTo) ? openTo : 'hours'
    }));
  }
  // avoiding problem of `props: never`
  const typedViewRenderer = viewRenderer;
  return typedViewRenderer((0, _extends2.default)({}, finalProps, {
    availableRangePositions: [rangePosition],
    views: finalProps.views.filter(_internals.isDatePickerView),
    view: view && (0, _internals.isDatePickerView)(view) ? view : 'day',
    openTo: (0, _internals.isDatePickerView)(openTo) ? openTo : 'day'
  }));
};
/**
 * Demos:
 *
 * - [DateTimeRangePicker](https://mui.com/x/react-date-pickers/date-time-range-picker/)
 * - [Validation](https://mui.com/x/react-date-pickers/validation/)
 *
 * API:
 *
 * - [MobileDateTimeRangePicker API](https://mui.com/x/api/date-pickers/mobile-date-time-range-picker/)
 */
const MobileDateTimeRangePicker = exports.MobileDateTimeRangePicker = /*#__PURE__*/React.forwardRef(function MobileDateTimeRangePicker(inProps, ref) {
  // Props with the default values common to all date time range pickers
  const defaultizedProps = (0, _shared.useDateTimeRangePickerDefaultizedProps)(inProps, 'MuiMobileDateTimeRangePicker');
  const renderTimeView = defaultizedProps.shouldRenderTimeInASingleColumn ? _timeViewRenderers.renderDigitalClockTimeView : _timeViewRenderers.renderMultiSectionDigitalClockTimeView;
  const viewRenderers = (0, _extends2.default)({
    day: _dateRangeViewRenderers.renderDateRangeViewCalendar,
    hours: renderTimeView,
    minutes: renderTimeView,
    seconds: renderTimeView,
    meridiem: renderTimeView
  }, defaultizedProps.viewRenderers);
  const props = (0, _extends2.default)({}, defaultizedProps, {
    viewRenderers,
    // Force one calendar on mobile to avoid layout issues
    calendars: 1,
    // force true to correctly handle `renderTimeViewClock` as a renderer
    ampmInClock: true,
    slots: (0, _extends2.default)({
      field: _MultiInputDateTimeRangeField.MultiInputDateTimeRangeField
    }, defaultizedProps.slots),
    slotProps: (0, _extends2.default)({}, defaultizedProps.slotProps, {
      field: ownerState => (0, _extends2.default)({}, (0, _utils2.resolveComponentProps)(defaultizedProps.slotProps?.field, ownerState), (0, _internals.extractValidationProps)(defaultizedProps), {
        ref
      }),
      tabs: (0, _extends2.default)({
        hidden: false
      }, defaultizedProps.slotProps?.tabs),
      toolbar: (0, _extends2.default)({
        hidden: false,
        toolbarVariant: 'mobile'
      }, defaultizedProps.slotProps?.toolbar)
    })
  });
  const {
    renderPicker
  } = (0, _useMobileRangePicker.useMobileRangePicker)({
    props,
    valueManager: _valueManagers.rangeValueManager,
    valueType: 'date-time',
    validator: _validateDateTimeRange.validateDateTimeRange,
    rendererInterceptor
  });
  return renderPicker();
});
MobileDateTimeRangePicker.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * 12h/24h view for hour selection clock.
   * @default utils.is12HourCycleInCurrentLocale()
   */
  ampm: _propTypes.default.bool,
  /**
   * If `true`, the main element is focused during the first mount.
   * This main element is:
   * - the element chosen by the visible view if any (i.e: the selected day on the `day` view).
   * - the `input` element if there is a field rendered.
   */
  autoFocus: _propTypes.default.bool,
  className: _propTypes.default.string,
  /**
   * If `true`, the popover or modal will close after submitting the full date.
   * @default `true` for desktop, `false` for mobile (based on the chosen wrapper and `desktopModeMediaQuery` prop).
   */
  closeOnSelect: _propTypes.default.bool,
  /**
   * Position the current month is rendered in.
   * @default 1
   */
  currentMonthCalendarPosition: _propTypes.default.oneOf([1, 2, 3]),
  /**
   * Formats the day of week displayed in the calendar header.
   * @param {TDate} date The date of the day of week provided by the adapter.
   * @returns {string} The name to display.
   * @default (date: TDate) => adapter.format(date, 'weekdayShort').charAt(0).toUpperCase()
   */
  dayOfWeekFormatter: _propTypes.default.func,
  /**
   * The initial position in the edited date range.
   * Used when the component is not controlled.
   * @default 'start'
   */
  defaultRangePosition: _propTypes.default.oneOf(['end', 'start']),
  /**
   * The default value.
   * Used when the component is not controlled.
   */
  defaultValue: _propTypes.default.arrayOf(_propTypes.default.object),
  /**
   * If `true`, after selecting `start` date calendar will not automatically switch to the month of `end` date.
   * @default false
   */
  disableAutoMonthSwitching: _propTypes.default.bool,
  /**
   * If `true`, the picker and text field are disabled.
   * @default false
   */
  disabled: _propTypes.default.bool,
  /**
   * If `true`, editing dates by dragging is disabled.
   * @default false
   */
  disableDragEditing: _propTypes.default.bool,
  /**
   * If `true`, disable values after the current date for date components, time for time components and both for date time components.
   * @default false
   */
  disableFuture: _propTypes.default.bool,
  /**
   * If `true`, today's date is rendering without highlighting with circle.
   * @default false
   */
  disableHighlightToday: _propTypes.default.bool,
  /**
   * Do not ignore date part when validating min/max time.
   * @default false
   */
  disableIgnoringDatePartForTimeValidation: _propTypes.default.bool,
  /**
   * If `true`, the open picker button will not be rendered (renders only the field).
   * @default false
   */
  disableOpenPicker: _propTypes.default.bool,
  /**
   * If `true`, disable values before the current date for date components, time for time components and both for date time components.
   * @default false
   */
  disablePast: _propTypes.default.bool,
  /**
   * If `true`, the week number will be display in the calendar.
   */
  displayWeekNumber: _propTypes.default.bool,
  /**
   * @default false
   */
  enableAccessibleFieldDOMStructure: _propTypes.default.any,
  /**
   * The day view will show as many weeks as needed after the end of the current month to match this value.
   * Put it to 6 to have a fixed number of weeks in Gregorian calendars
   */
  fixedWeekNumber: _propTypes.default.number,
  /**
   * Format of the date when rendered in the input(s).
   * Defaults to localized format based on the used `views`.
   */
  format: _propTypes.default.string,
  /**
   * Density of the format when rendered in the input.
   * Setting `formatDensity` to `"spacious"` will add a space before and after each `/`, `-` and `.` character.
   * @default "dense"
   */
  formatDensity: _propTypes.default.oneOf(['dense', 'spacious']),
  /**
   * Pass a ref to the `input` element.
   * Ignored if the field has several inputs.
   */
  inputRef: _utils.refType,
  /**
   * The label content.
   * Ignored if the field has several inputs.
   */
  label: _propTypes.default.node,
  /**
   * If `true`, calls `renderLoading` instead of rendering the day calendar.
   * Can be used to preload information and show it in calendar.
   * @default false
   */
  loading: _propTypes.default.bool,
  /**
   * Locale for components texts.
   * Allows overriding texts coming from `LocalizationProvider` and `theme`.
   */
  localeText: _propTypes.default.object,
  /**
   * Maximal selectable date.
   */
  maxDate: _propTypes.default.object,
  /**
   * Maximal selectable moment of time with binding to date, to set max time in each day use `maxTime`.
   */
  maxDateTime: _propTypes.default.object,
  /**
   * Maximal selectable time.
   * The date part of the object will be ignored unless `props.disableIgnoringDatePartForTimeValidation === true`.
   */
  maxTime: _propTypes.default.object,
  /**
   * Minimal selectable date.
   */
  minDate: _propTypes.default.object,
  /**
   * Minimal selectable moment of time with binding to date, to set min time in each day use `minTime`.
   */
  minDateTime: _propTypes.default.object,
  /**
   * Minimal selectable time.
   * The date part of the object will be ignored unless `props.disableIgnoringDatePartForTimeValidation === true`.
   */
  minTime: _propTypes.default.object,
  /**
   * Step over minutes.
   * @default 1
   */
  minutesStep: _propTypes.default.number,
  /**
   * Name attribute used by the `input` element in the Field.
   * Ignored if the field has several inputs.
   */
  name: _propTypes.default.string,
  /**
   * Callback fired when the value is accepted.
   * @template TValue The value type. Will be either the same type as `value` or `null`. Can be in `[start, end]` format in case of range value.
   * @param {TValue} value The value that was just accepted.
   */
  onAccept: _propTypes.default.func,
  /**
   * Callback fired when the value changes.
   * @template TValue The value type. Will be either the same type as `value` or `null`. Can be in `[start, end]` format in case of range value.
   * @template TError The validation error type. Will be either `string` or a `null`. Can be in `[start, end]` format in case of range value.
   * @param {TValue} value The new value.
   * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
   */
  onChange: _propTypes.default.func,
  /**
   * Callback fired when the popup requests to be closed.
   * Use in controlled mode (see `open`).
   */
  onClose: _propTypes.default.func,
  /**
   * Callback fired when the error associated to the current value changes.
   * If the error has a non-null value, then the `TextField` will be rendered in `error` state.
   *
   * @template TValue The value type. Will be either the same type as `value` or `null`. Can be in `[start, end]` format in case of range value.
   * @template TError The validation error type. Will be either `string` or a `null`. Can be in `[start, end]` format in case of range value.
   * @param {TError} error The new error describing why the current value is not valid.
   * @param {TValue} value The value associated to the error.
   */
  onError: _propTypes.default.func,
  /**
   * Callback fired on month change.
   * @template TDate
   * @param {TDate} month The new month.
   */
  onMonthChange: _propTypes.default.func,
  /**
   * Callback fired when the popup requests to be opened.
   * Use in controlled mode (see `open`).
   */
  onOpen: _propTypes.default.func,
  /**
   * Callback fired when the range position changes.
   * @param {RangePosition} rangePosition The new range position.
   */
  onRangePositionChange: _propTypes.default.func,
  /**
   * Callback fired when the selected sections change.
   * @param {FieldSelectedSections} newValue The new selected sections.
   */
  onSelectedSectionsChange: _propTypes.default.func,
  /**
   * Callback fired on view change.
   * @template TView
   * @param {TView} view The new view.
   */
  onViewChange: _propTypes.default.func,
  /**
   * Control the popup or dialog open state.
   * @default false
   */
  open: _propTypes.default.bool,
  /**
   * The default visible view.
   * Used when the component view is not controlled.
   * Must be a valid option from `views` list.
   */
  openTo: _propTypes.default.oneOf(['day', 'hours', 'minutes', 'seconds']),
  /**
   * The position in the currently edited date range.
   * Used when the component position is controlled.
   */
  rangePosition: _propTypes.default.oneOf(['end', 'start']),
  readOnly: _propTypes.default.bool,
  /**
   * If `true`, disable heavy animations.
   * @default `@media(prefers-reduced-motion: reduce)` || `navigator.userAgent` matches Android <10 or iOS <13
   */
  reduceAnimations: _propTypes.default.bool,
  /**
   * The date used to generate the new value when both `value` and `defaultValue` are empty.
   * @default The closest valid date-time using the validation props, except callbacks like `shouldDisable<...>`.
   */
  referenceDate: _propTypes.default.object,
  /**
   * Component rendered on the "day" view when `props.loading` is true.
   * @returns {React.ReactNode} The node to render when loading.
   * @default () => "..."
   */
  renderLoading: _propTypes.default.func,
  /**
   * The currently selected sections.
   * This prop accepts four formats:
   * 1. If a number is provided, the section at this index will be selected.
   * 2. If a string of type `FieldSectionType` is provided, the first section with that name will be selected.
   * 3. If `"all"` is provided, all the sections will be selected.
   * 4. If `null` is provided, no section will be selected.
   * If not provided, the selected sections will be handled internally.
   */
  selectedSections: _propTypes.default.oneOfType([_propTypes.default.oneOf(['all', 'day', 'empty', 'hours', 'meridiem', 'minutes', 'month', 'seconds', 'weekDay', 'year']), _propTypes.default.number]),
  /**
   * Disable specific date.
   *
   * Warning: This function can be called multiple times (for example when rendering date calendar, checking if focus can be moved to a certain date, etc.). Expensive computations can impact performance.
   *
   * @template TDate
   * @param {TDate} day The date to test.
   * @param {string} position The date to test, 'start' or 'end'.
   * @returns {boolean} Returns `true` if the date should be disabled.
   */
  shouldDisableDate: _propTypes.default.func,
  /**
   * Disable specific time.
   * @template TDate
   * @param {TDate} value The value to check.
   * @param {TimeView} view The clock type of the timeValue.
   * @returns {boolean} If `true` the time will be disabled.
   */
  shouldDisableTime: _propTypes.default.func,
  /**
   * If `true`, days outside the current month are rendered:
   *
   * - if `fixedWeekNumber` is defined, renders days to have the weeks requested.
   *
   * - if `fixedWeekNumber` is not defined, renders day to fill the first and last week of the current month.
   *
   * - ignored if `calendars` equals more than `1` on range pickers.
   * @default false
   */
  showDaysOutsideCurrentMonth: _propTypes.default.bool,
  /**
   * If `true`, disabled digital clock items will not be rendered.
   * @default false
   */
  skipDisabled: _propTypes.default.bool,
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
  /**
   * Amount of time options below or at which the single column time renderer is used.
   * @default 24
   */
  thresholdToRenderTimeInASingleColumn: _propTypes.default.number,
  /**
   * The time steps between two time unit options.
   * For example, if `timeStep.minutes = 8`, then the available minute options will be `[0, 8, 16, 24, 32, 40, 48, 56]`.
   * When single column time renderer is used, only `timeStep.minutes` will be used.
   * @default{ hours: 1, minutes: 5, seconds: 5 }
   */
  timeSteps: _propTypes.default.shape({
    hours: _propTypes.default.number,
    minutes: _propTypes.default.number,
    seconds: _propTypes.default.number
  }),
  /**
   * Choose which timezone to use for the value.
   * Example: "default", "system", "UTC", "America/New_York".
   * If you pass values from other timezones to some props, they will be converted to this timezone before being used.
   * @see See the {@link https://mui.com/x/react-date-pickers/timezone/ timezones documentation} for more details.
   * @default The timezone of the `value` or `defaultValue` prop is defined, 'default' otherwise.
   */
  timezone: _propTypes.default.string,
  /**
   * The selected value.
   * Used when the component is controlled.
   */
  value: _propTypes.default.arrayOf(_propTypes.default.object),
  /**
   * The visible view.
   * Used when the component view is controlled.
   * Must be a valid option from `views` list.
   */
  view: _propTypes.default.oneOf(['day', 'hours', 'meridiem', 'minutes', 'seconds']),
  /**
   * Define custom view renderers for each section.
   * If `null`, the section will only have field editing.
   * If `undefined`, internally defined view will be the used.
   */
  viewRenderers: _propTypes.default.shape({
    day: _propTypes.default.func,
    hours: _propTypes.default.func,
    meridiem: _propTypes.default.func,
    minutes: _propTypes.default.func,
    seconds: _propTypes.default.func
  }),
  /**
   * Available views.
   */
  views: _propTypes.default.arrayOf(_propTypes.default.oneOf(['day', 'hours', 'minutes', 'seconds']).isRequired)
};