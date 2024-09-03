"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateRangeCalendar = void 0;
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _clsx = _interopRequireDefault(require("clsx"));
var _useEventCallback = _interopRequireDefault(require("@mui/utils/useEventCallback"));
var _useMediaQuery = _interopRequireDefault(require("@mui/material/useMediaQuery"));
var _utils = require("@mui/base/utils");
var _styles = require("@mui/material/styles");
var _utils2 = require("@mui/utils");
var _xLicense = require("@mui/x-license");
var _internals = require("@mui/x-date-pickers/internals");
var _releaseInfo = require("../internals/utils/releaseInfo");
var _dateRangeCalendarClasses = require("./dateRangeCalendarClasses");
var _dateUtils = require("../internals/utils/date-utils");
var _dateRangeManager = require("../internals/utils/date-range-manager");
var _DateRangePickerDay = require("../DateRangePickerDay");
var _valueManagers = require("../internals/utils/valueManagers");
var _useDragRange2 = require("./useDragRange");
var _useRangePosition = require("../internals/hooks/useRangePosition");
var _dimensions = require("../internals/constants/dimensions");
var _PickersRangeCalendarHeader = require("../PickersRangeCalendarHeader");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["value", "defaultValue", "referenceDate", "onChange", "className", "disableFuture", "disablePast", "minDate", "maxDate", "shouldDisableDate", "reduceAnimations", "onMonthChange", "rangePosition", "defaultRangePosition", "onRangePositionChange", "calendars", "currentMonthCalendarPosition", "slots", "slotProps", "loading", "renderLoading", "disableHighlightToday", "readOnly", "disabled", "showDaysOutsideCurrentMonth", "dayOfWeekFormatter", "disableAutoMonthSwitching", "autoFocus", "fixedWeekNumber", "disableDragEditing", "displayWeekNumber", "timezone", "availableRangePositions", "views", "view", "openTo", "onViewChange"],
  _excluded2 = ["isDragging", "rangeDragDay", "draggingDatePosition"];
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const releaseInfo = (0, _releaseInfo.getReleaseInfo)();
const DateRangeCalendarRoot = (0, _styles.styled)('div', {
  name: 'MuiDateRangeCalendar',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root
})({
  display: 'flex',
  flexDirection: 'row'
});
const DateRangeCalendarMonthContainer = (0, _styles.styled)('div', {
  name: 'MuiDateRangeCalendar',
  slot: 'Container',
  overridesResolver: (_, styles) => styles.monthContainer
})(({
  theme
}) => ({
  '&:not(:last-of-type)': {
    borderRight: `1px solid ${(theme.vars || theme).palette.divider}`
  }
}));
const weeksContainerHeight = (_dimensions.DAY_RANGE_SIZE + _dimensions.DAY_MARGIN * 2) * 6;
const warnInvalidCurrentMonthCalendarPosition = (0, _internals.buildWarning)(['The `currentMonthCalendarPosition` prop must be an integer between `1` and the amount of calendars rendered.', 'For example if you have 2 calendars rendered, it should be equal to either 1 or 2.']);
const DayCalendarForRange = (0, _styles.styled)(_internals.DayCalendar)(({
  theme
}) => ({
  minWidth: 312,
  minHeight: weeksContainerHeight,
  [`&.${_dateRangeCalendarClasses.dateRangeCalendarClasses.dayDragging}`]: {
    [`& .${_DateRangePickerDay.dateRangePickerDayClasses.day}`]: {
      cursor: 'grabbing'
    },
    [`& .${_DateRangePickerDay.dateRangePickerDayClasses.root}:not(.${_DateRangePickerDay.dateRangePickerDayClasses.rangeIntervalDayHighlightStart}):not(.${_DateRangePickerDay.dateRangePickerDayClasses.rangeIntervalDayHighlightEnd}) .${_DateRangePickerDay.dateRangePickerDayClasses.day}:not(.${_DateRangePickerDay.dateRangePickerDayClasses.notSelectedDate})`]: {
      // we can't override `PickersDay` background color here, because it's styles take precedence
      opacity: 0.6
    }
  },
  [`&:not(.${_dateRangeCalendarClasses.dateRangeCalendarClasses.dayDragging}) .${_DateRangePickerDay.dateRangePickerDayClasses.dayOutsideRangeInterval}`]: {
    '@media (pointer: fine)': {
      '&:hover': {
        border: `1px solid ${(theme.vars || theme).palette.grey[500]}`
      }
    }
  }
}));
function useDateRangeCalendarDefaultizedProps(props, name) {
  const utils = (0, _internals.useUtils)();
  const defaultDates = (0, _internals.useDefaultDates)();
  const defaultReduceAnimations = (0, _internals.useDefaultReduceAnimations)();
  const themeProps = (0, _styles.useThemeProps)({
    props,
    name
  });
  return (0, _extends2.default)({}, themeProps, {
    renderLoading: themeProps.renderLoading ?? (() => /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
      children: "..."
    })),
    reduceAnimations: themeProps.reduceAnimations ?? defaultReduceAnimations,
    loading: props.loading ?? false,
    disablePast: props.disablePast ?? false,
    disableFuture: props.disableFuture ?? false,
    openTo: themeProps.openTo ?? 'day',
    views: themeProps.views ?? ['day'],
    minDate: (0, _internals.applyDefaultDate)(utils, themeProps.minDate, defaultDates.minDate),
    maxDate: (0, _internals.applyDefaultDate)(utils, themeProps.maxDate, defaultDates.maxDate),
    calendars: themeProps.calendars ?? 2,
    disableDragEditing: themeProps.disableDragEditing ?? false,
    availableRangePositions: themeProps.availableRangePositions ?? ['start', 'end']
  });
}
const useUtilityClasses = ownerState => {
  const {
    classes,
    isDragging
  } = ownerState;
  const slots = {
    root: ['root'],
    monthContainer: ['monthContainer'],
    dayCalendar: [isDragging && 'dayDragging']
  };
  return (0, _utils2.unstable_composeClasses)(slots, _dateRangeCalendarClasses.getDateRangeCalendarUtilityClass, classes);
};
/**
 * Demos:
 *
 * - [DateRangePicker](https://mui.com/x/react-date-pickers/date-range-picker/)
 * - [DateRangeCalendar](https://mui.com/x/react-date-pickers/date-range-calendar/)
 *
 * API:
 *
 * - [DateRangeCalendar API](https://mui.com/x/api/date-pickers/date-range-calendar/)
 */
const DateRangeCalendar = exports.DateRangeCalendar = /*#__PURE__*/React.forwardRef(function DateRangeCalendar(inProps, ref) {
  const props = useDateRangeCalendarDefaultizedProps(inProps, 'MuiDateRangeCalendar');
  const shouldHavePreview = (0, _useMediaQuery.default)(_internals.DEFAULT_DESKTOP_MODE_MEDIA_QUERY, {
    defaultMatches: false
  });
  const {
      value: valueProp,
      defaultValue,
      referenceDate,
      onChange,
      className,
      disableFuture,
      disablePast,
      minDate,
      maxDate,
      shouldDisableDate,
      reduceAnimations,
      onMonthChange,
      rangePosition: rangePositionProp,
      defaultRangePosition: inDefaultRangePosition,
      onRangePositionChange: inOnRangePositionChange,
      calendars,
      currentMonthCalendarPosition = 1,
      slots,
      slotProps,
      loading,
      renderLoading,
      disableHighlightToday,
      readOnly,
      disabled,
      showDaysOutsideCurrentMonth,
      dayOfWeekFormatter,
      disableAutoMonthSwitching,
      autoFocus,
      fixedWeekNumber,
      disableDragEditing,
      displayWeekNumber,
      timezone: timezoneProp,
      availableRangePositions,
      views,
      view: inView,
      openTo,
      onViewChange
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const {
    value,
    handleValueChange,
    timezone
  } = (0, _internals.useControlledValueWithTimezone)({
    name: 'DateRangeCalendar',
    timezone: timezoneProp,
    value: valueProp,
    defaultValue,
    onChange,
    valueManager: _valueManagers.rangeValueManager
  });
  const {
    setValueAndGoToNextView,
    view
  } = (0, _internals.useViews)({
    view: inView,
    views,
    openTo,
    onChange: handleValueChange,
    onViewChange,
    autoFocus
  });
  const utils = (0, _internals.useUtils)();
  const now = (0, _internals.useNow)(timezone);
  const {
    rangePosition,
    onRangePositionChange
  } = (0, _useRangePosition.useRangePosition)({
    rangePosition: rangePositionProp,
    defaultRangePosition: inDefaultRangePosition,
    onRangePositionChange: inOnRangePositionChange
  });
  const handleDatePositionChange = (0, _useEventCallback.default)(position => {
    if (rangePosition !== position) {
      onRangePositionChange(position);
    }
  });
  const handleSelectedDayChange = (0, _useEventCallback.default)((newDate, selectionState, allowRangeFlip = false) => {
    const {
      nextSelection,
      newRange
    } = (0, _dateRangeManager.calculateRangeChange)({
      newDate,
      utils,
      range: value,
      rangePosition,
      allowRangeFlip,
      shouldMergeDateAndTime: true
    });
    const isNextSectionAvailable = availableRangePositions.includes(nextSelection);
    if (isNextSectionAvailable) {
      onRangePositionChange(nextSelection);
    }
    const isFullRangeSelected = rangePosition === 'end' && (0, _dateUtils.isRangeValid)(utils, newRange);
    setValueAndGoToNextView(newRange, isFullRangeSelected || !isNextSectionAvailable ? 'finish' : 'partial', view);
  });
  const handleDrop = (0, _useEventCallback.default)(newDate => {
    handleSelectedDayChange(newDate, undefined, true);
  });
  const shouldDisableDragEditing = disableDragEditing || disabled || readOnly;

  // Range going for the start of the start day to the end of the end day.
  // This makes sure that `isWithinRange` works with any time in the start and end day.
  const valueDayRange = React.useMemo(() => [value[0] == null || !utils.isValid(value[0]) ? value[0] : utils.startOfDay(value[0]), value[1] == null || !utils.isValid(value[1]) ? value[1] : utils.endOfDay(value[1])], [value, utils]);
  const _useDragRange = (0, _useDragRange2.useDragRange)({
      disableDragEditing: shouldDisableDragEditing,
      onDrop: handleDrop,
      onDatePositionChange: handleDatePositionChange,
      utils,
      dateRange: valueDayRange,
      timezone
    }),
    {
      isDragging,
      rangeDragDay,
      draggingDatePosition
    } = _useDragRange,
    dragEventHandlers = (0, _objectWithoutPropertiesLoose2.default)(_useDragRange, _excluded2);
  const ownerState = (0, _extends2.default)({}, props, {
    isDragging
  });
  const classes = useUtilityClasses(ownerState);
  const draggingRange = React.useMemo(() => {
    if (!valueDayRange[0] || !valueDayRange[1] || !rangeDragDay) {
      return [null, null];
    }
    const newRange = (0, _dateRangeManager.calculateRangeChange)({
      utils,
      range: valueDayRange,
      newDate: rangeDragDay,
      rangePosition,
      allowRangeFlip: true
    }).newRange;
    return newRange[0] !== null && newRange[1] !== null ? [utils.startOfDay(newRange[0]), utils.endOfDay(newRange[1])] : newRange;
  }, [rangePosition, rangeDragDay, utils, valueDayRange]);
  const wrappedShouldDisableDate = React.useMemo(() => {
    if (!shouldDisableDate) {
      return undefined;
    }
    return dayToTest => shouldDisableDate(dayToTest, draggingDatePosition || rangePosition);
  }, [shouldDisableDate, rangePosition, draggingDatePosition]);
  const {
    calendarState,
    changeFocusedDay,
    changeMonth,
    handleChangeMonth,
    onMonthSwitchingAnimationEnd
  } = (0, _internals.useCalendarState)({
    value: value[0] || value[1],
    referenceDate,
    disableFuture,
    disablePast,
    disableSwitchToMonthOnDayFocus: true,
    maxDate,
    minDate,
    onMonthChange,
    reduceAnimations,
    shouldDisableDate: wrappedShouldDisableDate,
    timezone
  });
  const CalendarHeader = slots?.calendarHeader ?? _PickersRangeCalendarHeader.PickersRangeCalendarHeader;
  const calendarHeaderProps = (0, _utils.useSlotProps)({
    elementType: CalendarHeader,
    externalSlotProps: slotProps?.calendarHeader,
    additionalProps: {
      calendars,
      views: ['day'],
      view: 'day',
      currentMonth: calendarState.currentMonth,
      onMonthChange: (newMonth, direction) => handleChangeMonth({
        newMonth,
        direction
      }),
      minDate,
      maxDate,
      disabled,
      disablePast,
      disableFuture,
      reduceAnimations,
      timezone,
      slots,
      slotProps
    },
    ownerState: props
  });
  const prevValue = React.useRef(null);
  React.useEffect(() => {
    const date = rangePosition === 'start' ? value[0] : value[1];
    if (!date || !utils.isValid(date)) {
      return;
    }
    const prevDate = rangePosition === 'start' ? prevValue.current?.[0] : prevValue.current?.[1];
    prevValue.current = value;

    // The current date did not change, this call comes either from a `rangePosition` change or a change in the other date.
    // In both cases, we don't want to change the visible month(s).
    if (disableAutoMonthSwitching && prevDate && utils.isEqual(prevDate, date)) {
      return;
    }
    const displayingMonthRange = calendars - 1;
    const currentMonthNumber = utils.getMonth(calendarState.currentMonth);
    const requestedMonthNumber = utils.getMonth(date);
    if (!utils.isSameYear(calendarState.currentMonth, date) || requestedMonthNumber < currentMonthNumber || requestedMonthNumber > currentMonthNumber + displayingMonthRange) {
      const newMonth = rangePosition === 'start' ? date :
      // If need to focus end, scroll to the state when "end" is displaying in the last calendar
      utils.addMonths(date, -displayingMonthRange);
      changeMonth(newMonth);
    }
  }, [rangePosition, value]); // eslint-disable-line

  const baseDateValidationProps = {
    disablePast,
    disableFuture,
    maxDate,
    minDate
  };
  const commonViewProps = {
    disableHighlightToday,
    readOnly,
    disabled
  };
  const [rangePreviewDay, setRangePreviewDay] = React.useState(null);
  const CalendarTransitionProps = React.useMemo(() => ({
    onMouseLeave: () => setRangePreviewDay(null)
  }), []);
  const previewingRange = (0, _dateRangeManager.calculateRangePreview)({
    utils,
    range: valueDayRange,
    newDate: rangePreviewDay,
    rangePosition
  });
  const handleDayMouseEnter = (0, _useEventCallback.default)((event, newPreviewRequest) => {
    if (!(0, _dateUtils.isWithinRange)(utils, newPreviewRequest, valueDayRange)) {
      setRangePreviewDay(newPreviewRequest);
    } else {
      setRangePreviewDay(null);
    }
  });
  const slotsForDayCalendar = (0, _extends2.default)({
    day: _DateRangePickerDay.DateRangePickerDay
  }, slots);
  const slotPropsForDayCalendar = (0, _extends2.default)({}, slotProps, {
    day: dayOwnerState => {
      const {
        day
      } = dayOwnerState;
      const isSelectedStartDate = (0, _dateUtils.isStartOfRange)(utils, day, valueDayRange);
      const isSelectedEndDate = (0, _dateUtils.isEndOfRange)(utils, day, valueDayRange);
      const shouldInitDragging = !shouldDisableDragEditing && valueDayRange[0] && valueDayRange[1];
      const isElementDraggable = shouldInitDragging && (isSelectedStartDate || isSelectedEndDate);
      let datePosition;
      if (isSelectedStartDate) {
        datePosition = 'start';
      } else if (isSelectedEndDate) {
        datePosition = 'end';
      }
      const isStartOfHighlighting = isDragging ? (0, _dateUtils.isStartOfRange)(utils, day, draggingRange) : isSelectedStartDate;
      const isEndOfHighlighting = isDragging ? (0, _dateUtils.isEndOfRange)(utils, day, draggingRange) : isSelectedEndDate;
      return (0, _extends2.default)({
        isPreviewing: shouldHavePreview ? (0, _dateUtils.isWithinRange)(utils, day, previewingRange) : false,
        isStartOfPreviewing: shouldHavePreview ? (0, _dateUtils.isStartOfRange)(utils, day, previewingRange) : false,
        isEndOfPreviewing: shouldHavePreview ? (0, _dateUtils.isEndOfRange)(utils, day, previewingRange) : false,
        isHighlighting: (0, _dateUtils.isWithinRange)(utils, day, isDragging ? draggingRange : valueDayRange),
        isStartOfHighlighting,
        isEndOfHighlighting: isDragging ? (0, _dateUtils.isEndOfRange)(utils, day, draggingRange) : isSelectedEndDate,
        onMouseEnter: shouldHavePreview ? handleDayMouseEnter : undefined,
        // apply selected styling to the dragging start or end day
        isVisuallySelected: dayOwnerState.selected || isDragging && (isStartOfHighlighting || isEndOfHighlighting),
        'data-position': datePosition
      }, dragEventHandlers, {
        draggable: isElementDraggable ? true : undefined
      }, (0, _utils.resolveComponentProps)(slotProps?.day, dayOwnerState) ?? {});
    }
  });
  const calendarMonths = React.useMemo(() => Array.from({
    length: calendars
  }).map((_, index) => index), [calendars]);
  const visibleMonths = React.useMemo(() => {
    if (process.env.NODE_ENV !== 'production') {
      if (currentMonthCalendarPosition > calendars || currentMonthCalendarPosition < 1) {
        warnInvalidCurrentMonthCalendarPosition();
      }
    }
    const firstMonth = utils.addMonths(calendarState.currentMonth, 1 - currentMonthCalendarPosition);
    return Array.from({
      length: calendars
    }).map((_, index) => utils.addMonths(firstMonth, index));
  }, [utils, calendarState.currentMonth, calendars, currentMonthCalendarPosition]);
  const focusedMonth = React.useMemo(() => {
    if (!autoFocus) {
      return null;
    }

    // The focus priority of the "day" view is as follows:
    // 1. Month of the `start` date
    // 2. Month of the `end` date
    // 3. Month of the current date
    // 4. First visible month

    if (value[0] != null) {
      return visibleMonths.find(month => utils.isSameMonth(month, value[0]));
    }
    if (value[1] != null) {
      return visibleMonths.find(month => utils.isSameMonth(month, value[1]));
    }
    return visibleMonths.find(month => utils.isSameMonth(month, now)) ?? visibleMonths[0];
  }, [utils, value, visibleMonths, autoFocus, now]);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(DateRangeCalendarRoot, (0, _extends2.default)({
    ref: ref,
    className: (0, _clsx.default)(className, classes.root),
    ownerState: ownerState
  }, other, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_xLicense.Watermark, {
      packageName: "x-date-pickers-pro",
      releaseInfo: releaseInfo
    }), calendarMonths.map(monthIndex => {
      const month = visibleMonths[monthIndex];
      return /*#__PURE__*/(0, _jsxRuntime.jsxs)(DateRangeCalendarMonthContainer, {
        className: classes.monthContainer,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(CalendarHeader, (0, _extends2.default)({}, calendarHeaderProps, {
          month: month,
          monthIndex: monthIndex
        })), /*#__PURE__*/(0, _jsxRuntime.jsx)(DayCalendarForRange, (0, _extends2.default)({
          className: classes.dayCalendar
        }, calendarState, baseDateValidationProps, commonViewProps, {
          onMonthSwitchingAnimationEnd: onMonthSwitchingAnimationEnd,
          onFocusedDayChange: changeFocusedDay,
          reduceAnimations: reduceAnimations,
          selectedDays: value,
          onSelectedDaysChange: handleSelectedDayChange,
          currentMonth: month,
          TransitionProps: CalendarTransitionProps,
          shouldDisableDate: wrappedShouldDisableDate,
          showDaysOutsideCurrentMonth: calendars === 1 && showDaysOutsideCurrentMonth,
          dayOfWeekFormatter: dayOfWeekFormatter,
          loading: loading,
          renderLoading: renderLoading,
          slots: slotsForDayCalendar,
          slotProps: slotPropsForDayCalendar,
          autoFocus: month === focusedMonth,
          fixedWeekNumber: fixedWeekNumber,
          displayWeekNumber: displayWeekNumber,
          timezone: timezone
        }))]
      }, monthIndex);
    })]
  }));
});
process.env.NODE_ENV !== "production" ? DateRangeCalendar.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * If `true`, the main element is focused during the first mount.
   * This main element is:
   * - the element chosen by the visible view if any (i.e: the selected day on the `day` view).
   * - the `input` element if there is a field rendered.
   */
  autoFocus: _propTypes.default.bool,
  /**
   * Range positions available for selection.
   * This list is checked against when checking if a next range position can be selected.
   *
   * Used on Date Time Range pickers with current `rangePosition` to force a `finish` selection after just one range position selection.
   * @default ['start', 'end']
   */
  availableRangePositions: _propTypes.default.arrayOf(_propTypes.default.oneOf(['end', 'start']).isRequired),
  /**
   * The number of calendars to render.
   * @default 2
   */
  calendars: _propTypes.default.oneOf([1, 2, 3]),
  /**
   * Override or extend the styles applied to the component.
   */
  classes: _propTypes.default.object,
  className: _propTypes.default.string,
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
   * The default selected value.
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
   * If `true`, disable values before the current date for date components, time for time components and both for date time components.
   * @default false
   */
  disablePast: _propTypes.default.bool,
  /**
   * If `true`, the week number will be display in the calendar.
   */
  displayWeekNumber: _propTypes.default.bool,
  /**
   * The day view will show as many weeks as needed after the end of the current month to match this value.
   * Put it to 6 to have a fixed number of weeks in Gregorian calendars
   */
  fixedWeekNumber: _propTypes.default.number,
  /**
   * Controlled focused view.
   */
  focusedView: _propTypes.default.oneOf(['day']),
  /**
   * If `true`, calls `renderLoading` instead of rendering the day calendar.
   * Can be used to preload information and show it in calendar.
   * @default false
   */
  loading: _propTypes.default.bool,
  /**
   * Maximal selectable date.
   */
  maxDate: _propTypes.default.object,
  /**
   * Minimal selectable date.
   */
  minDate: _propTypes.default.object,
  /**
   * Callback fired when the value changes.
   * @template TValue The value type. Will be either the same type as `value` or `null`. Can be in `[start, end]` format in case of range value.
   * @template TView The view type. Will be one of date or time views.
   * @param {TValue} value The new value.
   * @param {PickerSelectionState | undefined} selectionState Indicates if the date selection is complete.
   * @param {TView | undefined} selectedView Indicates the view in which the selection has been made.
   */
  onChange: _propTypes.default.func,
  /**
   * Callback fired on focused view change.
   * @template TView
   * @param {TView} view The new view to focus or not.
   * @param {boolean} hasFocus `true` if the view should be focused.
   */
  onFocusedViewChange: _propTypes.default.func,
  /**
   * Callback fired on month change.
   * @template TDate
   * @param {TDate} month The new month.
   */
  onMonthChange: _propTypes.default.func,
  /**
   * Callback fired when the range position changes.
   * @param {RangePosition} rangePosition The new range position.
   */
  onRangePositionChange: _propTypes.default.func,
  /**
   * Callback fired on view change.
   * @template TView
   * @param {TView} view The new view.
   */
  onViewChange: _propTypes.default.func,
  /**
   * The default visible view.
   * Used when the component view is not controlled.
   * Must be a valid option from `views` list.
   */
  openTo: _propTypes.default.oneOf(['day']),
  /**
   * The position in the currently edited date range.
   * Used when the component position is controlled.
   */
  rangePosition: _propTypes.default.oneOf(['end', 'start']),
  /**
   * Make picker read only.
   * @default false
   */
  readOnly: _propTypes.default.bool,
  /**
   * If `true`, disable heavy animations.
   * @default `@media(prefers-reduced-motion: reduce)` || `navigator.userAgent` matches Android <10 or iOS <13
   */
  reduceAnimations: _propTypes.default.bool,
  /**
   * The date used to generate the new value when both `value` and `defaultValue` are empty.
   * @default The closest valid date using the validation props, except callbacks such as `shouldDisableDate`.
   */
  referenceDate: _propTypes.default.object,
  /**
   * Component rendered on the "day" view when `props.loading` is true.
   * @returns {React.ReactNode} The node to render when loading.
   * @default () => "..."
   */
  renderLoading: _propTypes.default.func,
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
  view: _propTypes.default.oneOf(['day']),
  /**
   * Available views.
   */
  views: _propTypes.default.arrayOf(_propTypes.default.oneOf(['day']))
} : void 0;